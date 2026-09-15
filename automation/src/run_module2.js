#!/usr/bin/env node
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ghi đè biến môi trường cho Module 2
process.env.COURSE_NAME = '[Tsubasa] Lập trình Front-end nâng cao'; // Tên khóa (có thể thay đổi nếu đúng)
process.env.COURSE_ID = '96';
process.env.COURSE_URL = 'https://portal.rikkei.edu.vn/learn/96';
process.env.START_SESSION = '1';
process.env.END_SESSION = '20'; // hoặc bao nhiêu tùy thuộc nội dung Module 2

console.log('========================================================');
console.log('🚀 ĐANG KHỞI ĐỘNG ENGINE TỰ HỌC CHO MODULE 2 (Khóa 96)');
console.log(`- Course URL: ${process.env.COURSE_URL}`);
console.log('========================================================\n');

// Lấy tham số dòng lệnh truyền vào (nếu có, VD: --full-auto)
const args = process.argv.slice(2).join(' ');

try {
  // Chạy file run.js với biến môi trường đã được ghi đè
  execSync(`node run.js ${args}`, { 
    stdio: 'inherit',
    cwd: path.resolve(__dirname, '..')
  });
} catch (err) {
  console.log('\n[Tiến trình] Engine Module 2 đã hoàn tất hoặc bị ngắt.');
}
