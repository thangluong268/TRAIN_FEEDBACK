import { DICT } from 'constant/dict.constant';

// Hàm remove: loại bỏ các ký tự lặp lại nhiều lần
export const remove = (text: string) => text.replace(/([A-Z])\1+/gi, (match, p1) => p1);

// Hàm utils_data: thay thế các từ viết tắt bằng từ đầy đủ
export const utils_data = (text: string) => {
  const listText = text.split(' ');
  for (let i = 0; i < listText.length; i++) {
    for (let j = 0; j < DICT.length; j++) {
      if (listText[i] === DICT[j][0]) {
        listText[i] = DICT[j][1];
      }
    }
  }
  return listText.join(' ');
};
