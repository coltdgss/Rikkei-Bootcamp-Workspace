import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

process.env.COURSE_NAME = '[Tsubasa] Lập trình Front-end nâng cao';
process.env.COURSE_ID = '96';
process.env.COURSE_URL = 'https://portal.rikkei.edu.vn/learn/96';
process.env.START_SESSION = '1';
process.env.END_SESSION = '20';

console.log('========================================================');
console.log('🔄 ĐANG KHỞI ĐỘNG VÒNG LẶP TỰ ĐỘNG CHO MODULE 2 (Khóa 96)');
console.log(`- Course URL: ${process.env.COURSE_URL}`);
console.log('========================================================\n');

try {
  execSync(`node src/autonomous_loop.js`, { 
    stdio: 'inherit',
    cwd: path.resolve(__dirname, '..')
  });
} catch (err) {
  console.log('\n[Tiến trình] Engine Vòng lặp Module 2 đã hoàn tất hoặc bị ngắt.');
}
