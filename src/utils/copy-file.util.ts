// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');

// Hàm sao chép tệp
export const copyFile = (source: string, destination: string) => {
  fs.copyFile(source, destination, (err) => {
    if (err) {
      console.error('Lỗi khi sao chép tệp:', err);
    } else {
      console.log('Tệp đã được sao chép thành công từ', source, 'tới', destination);
    }
  });
};
