import { Injectable } from '@nestjs/common';
import { TEXT_CLASSIFICATION_API_ENGLISH } from 'apis/text-classification-english.api';
import { TRANSLATION_API } from 'apis/translation.api';
import { CLOUDFLARE_WORKERS_AI_TOKEN, HUGGING_FACE_ACCESS_TOKEN } from 'app.config';
import axios, { AxiosHeaders } from 'axios';
import { POSITIVE } from 'constant/common';
import { AxiosType } from 'enums/common.enum';
import { remove, utils_data } from 'utils/text-util.final.util';

@Injectable()
export class ClassifyService {
  constructor() {}

  async classifyFeedback(text: string) {
    // Get Final Text
    const textRemoveDuplicateChar = remove(text);
    const textLowercase = textRemoveDuplicateChar.toLowerCase();
    const finalText = utils_data(textLowercase);
    console.log(finalText);

    const englishText = await this.translate2English(finalText);
    console.log(englishText);

    let data = null;
    // Text classification
    const headers = new AxiosHeaders();
    headers.set('Content-Type', 'application/json');
    headers.set('Authorization', `Bearer ${HUGGING_FACE_ACCESS_TOKEN}`);
    try {
      const res = await axios({
        url: TEXT_CLASSIFICATION_API_ENGLISH,
        method: AxiosType.POST,
        data: { inputs: englishText },
        headers,
      });
      data = res.data.flat();
    } catch (error) {
      console.error('Error:', error.message);
    }
    console.log(data);
    const result = data[0].score >= 0.7 ? data[0].label : POSITIVE;
    return result;
  }

  async translate2English(text: string) {
    const headers = new AxiosHeaders();
    headers.set('Content-Type', 'application/json');
    headers.set('Authorization', `Bearer ${CLOUDFLARE_WORKERS_AI_TOKEN}`);
    try {
      const res = await axios({
        url: TRANSLATION_API,
        method: AxiosType.POST,
        data: {
          source_lang: 'vi',
          target_lang: 'en',
          text,
        },
        headers,
      });
      const englishText = res.data.result.translated_text;
      return englishText;
    } catch (error) {
      console.error('Error:', error.message);
    }
  }
}
