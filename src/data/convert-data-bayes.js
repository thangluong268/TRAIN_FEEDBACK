// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');

// Đọc dữ liệu từ file
const rawData = fs.readFileSync('data.txt', 'utf8');

// Tách dữ liệu thành các khối theo từng entry
const entries = rawData.split(/train_\d+/).filter((entry) => entry.trim() !== '');

const dataArray = entries.map((entry) => {
  const lines = entry.trim().split('\n');
  const content = lines.slice(0, -1).join(' ').trim(); // Ghép tất cả các dòng trừ dòng cuối thành nội dung
  const label = parseInt(lines[lines.length - 1].trim(), 10) === 0 ? 'POSITIVE' : 'NEGATIVE'; // Dòng cuối cùng là chỉ số negative

  return {
    content: content.replace(/^"|"$/g, ''), // Loại bỏ dấu ngoặc kép bao quanh nếu có
    label,
  };
});

fs.writeFileSync('data.json', JSON.stringify(dataArray, null, 2));
