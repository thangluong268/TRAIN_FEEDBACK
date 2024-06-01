import { Injectable, Logger } from '@nestjs/common';
import { NEGATIVE, POSITIVE, TRAIN_MODEL_FILE_PATH_NATURAL } from 'constant/common';
import { DATA_TRAIN } from 'data/data-bayes';
import * as natural from 'natural';
import { copyFile } from 'utils/copy-file.util';
import { remove, utils_data } from 'utils/text-util.final.util';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

import { AggressiveTokenizerVi } from 'natural';
const TOKENIZER = new AggressiveTokenizerVi();
const CLASSIFIER = new natural.BayesClassifier();

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fastText = require('fasttext');

@Injectable()
export class TrainService {
  private readonly logger = new Logger(TrainService.name);
  private readonly classifierFT = new fastText.Classifier();

  constructor() {}

  trainModel() {
    this.logger.log('Bắt đầu huấn luyện mô hình phân loại phản hồi');
    // Huấn luyện mô hình phân loại
    DATA_TRAIN.forEach((item) => {
      // this.classifier.addDocument(this.tokenizer.tokenize(item.content), item.label);
      CLASSIFIER.addDocument(TOKENIZER.tokenize(item.content), item.label);
      console.log('Loading...');
    });
    CLASSIFIER.train();
    // Lưu trữ mô hình đã huấn luyện
    CLASSIFIER.save(TRAIN_MODEL_FILE_PATH_NATURAL, (err) => {
      err
        ? console.error('Lỗi khi lưu mô hình:', err)
        : console.log('Mô hình đã được lưu thành công tại:', TRAIN_MODEL_FILE_PATH_NATURAL);
    });

    const data = path.join(__dirname, '../data/data-ft.txt');
    const model = path.join(__dirname, '../data/data-ft');
    const pathBin = path.join(__dirname, '../data/data-ft.bin');
    // Huấn luyện mô hình fasttext
    const options = {
      input: data,
      output: model,
      lr: 0.1,
      epoch: 25,
      wordNgrams: 2,
      verbose: 2,
      minCount: 1,
    };
    this.classifierFT
      .train('supervised', options)
      .then(() => {
        console.log('train success');
        // Gọi hàm để sao chép tệp
        copyFile(pathBin, 'data-ft.bin');
      })
      .catch((err) => {
        console.log('train error:', err);
      });
  }

  async classifyFeedback(newFeedback: string) {
    this.logger.log('Phân loại phản hồi mới');

    // Get Final Text
    const textRemoveDuplicateChar = remove(newFeedback);
    const textLowercase = textRemoveDuplicateChar.toLowerCase();
    const finalText = utils_data(textLowercase);
    console.log(finalText);

    let labelNatural = '';
    // Phân loại new feedback của natural
    natural.BayesClassifier.load(TRAIN_MODEL_FILE_PATH_NATURAL, null, function (err, classifier) {
      const textAfterTokenize = TOKENIZER.tokenize(finalText);
      labelNatural = classifier.classify(textAfterTokenize);
      console.log(labelNatural);
    });

    // Phân loại new feedback của fasttext
    // let model = path.join(__dirname, '../data/data-ft.bin');
    const model = 'data-ft.bin';
    const classifier = new fastText.Classifier(model);

    const res = await classifier.predict(newFeedback, 5);
    const tag = res[0]?.label;
    const labelFT = tag?.split('__')[tag?.split('__').length - 1];
    const confidenceFT = res[0]?.value;

    console.log(labelFT);
    console.log(confidenceFT);

    if ((labelNatural === NEGATIVE && (labelFT === NEGATIVE && confidenceFT >= 0.5)) || (!labelFT && !confidenceFT)) {
      return NEGATIVE;
    } else {
      return POSITIVE;
    }
  }
}
