import { Injectable, Logger } from '@nestjs/common';
import { NEGATIVE, POSITIVE, TRAIN_MODEL_FILE_PATH_BAYES } from 'constant/common';
import { DATA_TRAIN } from 'data/data-bayes';
import { copyFile } from 'utils/copy-file.util';
import { remove, utils_data } from 'utils/text-util.final.util';
import { loadClassifier, saveClassifier } from 'utils/vntk.util';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');
// eslint-disable-next-line @typescript-eslint/no-var-requires
// const Sentiment = require('sentiment');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const vntk = require('vntk');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fastText = require('fasttext');

@Injectable()
export class TrainService {
  private readonly logger = new Logger(TrainService.name);
  private readonly classifierBayes = new vntk.BayesClassifier();
  private readonly classifierFT = new fastText.Classifier();
  constructor() {}

  trainModel() {
    this.logger.log('Bắt đầu huấn luyện mô hình phân loại phản hồi');
    // Huấn luyện mô hình phân loại
    DATA_TRAIN.forEach((item) => {
      // this.classifier.addDocument(this.tokenizer.tokenize(item.content), item.label);
      this.classifierBayes.addDocument(item.content, item.label);
      console.log('Loading...');
    });
    this.classifierBayes.train();
    // Lưu trữ mô hình đã huấn luyện
    saveClassifier(this.classifierBayes, TRAIN_MODEL_FILE_PATH_BAYES);

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

  classifyFeedback(newFeedback: string) {
    this.logger.log('Phân loại phản hồi mới');

    // Get Final Text
    const textRemoveDuplicateChar = remove(newFeedback);
    const textLowercase = textRemoveDuplicateChar.toLowerCase();
    const finalText = utils_data(textLowercase);
    console.log(finalText);

    // Phân loại new feedback của bayes
    const classifierBayesModel = loadClassifier(TRAIN_MODEL_FILE_PATH_BAYES);
    const labelBaYes = classifierBayesModel.classify(finalText);
    console.log(labelBaYes);

    // Phân loại new feedback của fasttext
    // let model = path.join(__dirname, '../data/data-ft.bin');
    const model = 'data-ft.bin';
    const classifier = new fastText.Classifier(model);
    let labelFT = '';
    let confidenceFT = 0;

    classifier.predict(newFeedback, 1).then((res) => {
      if (res.length > 0) {
        const tag = res[0].label;
        labelFT = tag.split('__')[tag.split('__').length - 1];
        confidenceFT = res[0].value;
      } else {
        console.log('No matches');
      }
    });

    if (labelBaYes === NEGATIVE && labelFT === NEGATIVE && confidenceFT >= 1) {
      return NEGATIVE;
    } else {
      return POSITIVE;
    }
  }
}
