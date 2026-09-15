import readline from 'readline/promises';
import { stdin as input, stdout as output } from 'process';
import fs from 'fs';
import path from 'path';
import { initBrowser } from './browser.js';
import { checkIsLoggedIn, performLogin } from './auth.js';
import { navigateToOnlineLearning, selectFrontendCourse } from './navigator.js';
import { runCourseLearner } from './learner.js';
import { LearningRules } from './rules.js';
import { checkOllamaConnection, ensureOllamaReady, startOllamaServer } from './ollama_client.js';
import { interactiveManualLogin, importCookiesFromJsonFile } from './cookie_importer.js';
import { ProgressTracker } from './progress_tracker.js';
import { config } from './config.js';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * CHẾ ĐỘ 1-CLICK TỰ ĐỘNG TOÀN BỘ (FULL AUTO-PILOT)
 */
export async function runFullAutoPilot() {
  console.log(`\n========================================================`);
  console.log(`🚀 BẮT ĐẦU CHẾ ĐỘ 1-CLICK FULL AUTO-PILOT (TỰ ĐỘNG TOÀN DIỆN)`);
  console.log(`========================================================`);
  console.log(`- Tài khoản: ${config.portal.email}`);
  console.log(`- Khóa học: ${config.portal.courseName}`);
  console.log(`- Bắt đầu từ: Session ${config.portal.startSession}`);

  const progress = ProgressTracker.loadProgress();
  if (progress.lastCompletedLesson) {
    console.log(`- 🎯 TIẾP NỐI LỊCH SỬ: Đã xong [${progress.lastCompletedSession}] -> ${progress.lastCompletedLesson}`);
  }
  console.log(`========================================================\n`);

  // Bước 1: Khởi động và kiểm tra Ollama AI Server (Độ trễ 4 giây)
  console.log(`[Bước 1/5] 🧠 Đang kiểm tra & chuẩn bị Ollama AI Server...`);
  await ensureOllamaReady();
  console.log(`[Bước 1/5] Đệm 3 giây an toàn để tài nguyên AI ổn định...`);
  await delay(3000);

  // Bước 2: Khởi động trình duyệt Playwright với Stealth Evasion
  console.log(`\n[Bước 2/5] 🌐 Đang khởi động trình duyệt Chromium Stealth...`);
  const { browser, context, page } = await initBrowser();
  await delay(2000);

  try {
    // Bước 3: Kiểm tra phiên đăng nhập Cookie
    console.log(`\n[Bước 3/5] 🔑 Kiểm tra phiên đăng nhập người dùng...`);
    const loggedIn = await checkIsLoggedIn(page);
    
    if (!loggedIn) {
      console.log(`[Bước 3/5] Chưa có session hợp lệ, tiến hành quy trình đăng nhập 5 bước...`);
      await performLogin(page, context);
    } else {
      console.log(`[Bước 3/5] ✓ Đã đăng nhập bằng Cookie hợp lệ (Bỏ qua bước đăng nhập)!`);
    }
    
    console.log(`[Bước 3/5] Đệm 3 giây để hệ thống Portal tải xong Dashboard...`);
    await delay(3000);

    // Bước 4: Điều hướng vào mục Học trực tuyến -> Khóa học Front-end
    console.log(`\n[Bước 4/5] 🧭 Điều hướng vào khóa học "${config.portal.courseName}"...`);
    await navigateToOnlineLearning(page);
    await delay(2500);

    await selectFrontendCourse(page);
    console.log(`[Bước 4/5] Đệm 4 giây để tải toàn bộ cây chương trình học...`);
    await delay(4000);

    // Bước 5: Bắt đầu học tự động các bài Chưa hoàn thành
    console.log(`\n[Bước 5/5] 📚 Bắt đầu tiến trình học tự động từ Session ${config.portal.startSession}...`);
    await runCourseLearner(page);

    console.log(`\n========================================================`);
    console.log(`🎉 CHÚC MỪNG! ĐÃ HOÀN TẤT TIẾN TRÌNH HỌC TỰ ĐỘNG.`);
    console.log(`========================================================`);
  } catch (error) {
    console.error(`\n❌ Lỗi trong quá trình chạy tự động: ${error.message}`);
  } finally {
    console.log(`\n[Hệ thống] Giữ trình duyệt thêm 8 giây trước khi đóng...`);
    await delay(8000);
    await browser.close().catch(() => {});
  }
}

/**
 * Hiển thị Bảng điều khiển Menu tương tác
 */
export async function showInteractiveMenu() {
  const rl = readline.createInterface({ input, output });

  while (true) {
    const progress = ProgressTracker.loadProgress();

    console.log(`\n========================================================`);
    console.log(`📋 RIKKEI PORTAL AUTOMATION - BẢNG ĐIỀU KHIỂN TÁC VỤ`);
    console.log(`========================================================`);
    if (progress.lastCompletedLesson) {
      console.log(`🎯 TIẾN ĐỘ GẦN NHẤT: [${progress.lastCompletedSession}] -> ${progress.lastCompletedLesson} (${progress.completedCount} bài đã xong)`);
      console.log(`--------------------------------------------------------`);
    }
    console.log(` [1] 🚀 1-CLICK TỰ ĐỘNG TOÀN BỘ (Tự bật Ollama + Tự học tiếp)`);
    console.log(` [2] 🧠 Khởi động / Khởi động lại Ollama AI Server`);
    console.log(` [3] 🤖 Đăng nhập tự động & Vượt reCAPTCHA (Bot làm từ A-Z)`);
    console.log(` [4] 🌐 Mở trình duyệt để TỰ ĐĂNG NHẬP (Tự động bắt Cookie)`);
    console.log(` [5] 📥 Nạp Cookie từ file "automation/cookies.json"`);
    console.log(` [6] 🎯 Học thử 1 bài học duy nhất (Kiểm tra Video & Ollama AI)`);
    console.log(` [7] 📂 Xem danh sách ghi chú bài học AI đã tạo (notes/)`);
    console.log(` [8] 📊 Xem / Đặt lại lịch sử tiến độ học (progress.json)`);
    console.log(` [9] 🔍 Kiểm tra môi trường & Trạng thái hệ thống`);
    console.log(` [0] ❌ Thoát chương trình`);
    console.log(`========================================================`);

    const answer = await rl.question('👉 Chọn tác vụ (0-9): ');
    const choice = answer.trim();

    if (choice === '0') {
      console.log('\n[Menu] Đã thoát chương trình. Tạm biệt!');
      rl.close();
      process.exit(0);
    }

    try {
      switch (choice) {
        case '1': {
          await runFullAutoPilot();
          break;
        }

        case '2': {
          console.log('\n--- KHỞI ĐỘNG OLLAMA AI SERVER ---');
          await startOllamaServer();
          break;
        }

        case '3': {
          console.log('\n--- ĐĂNG NHẬP TỰ ĐỘNG & VƯỢT reCAPTCHA ---');
          const { browser, context, page } = await initBrowser();
          try {
            await performLogin(page, context);
            console.log('[Menu] ✓ Đăng nhập và lưu session thành công!');
          } finally {
            await delay(3000);
            await browser.close();
          }
          break;
        }

        case '4': {
          console.log('\n--- MỞ TRÌNH DUYỆT ĐĂNG NHẬP THỦ CÔNG ĐỂ BẮT COOKIE ---');
          await interactiveManualLogin();
          break;
        }

        case '5': {
          console.log('\n--- NẠP COOKIE TỪ FILE JSON ---');
          const defaultJsonPath = path.resolve(path.dirname(config.browser.storageStatePath), '../cookies.json');
          await importCookiesFromJsonFile(defaultJsonPath);
          break;
        }

        case '6': {
          console.log('\n--- HỌC THỬ 1 BÀI DUY NHẤT ---');
          await ensureOllamaReady();
          await delay(2000);
          const { browser, context, page } = await initBrowser();
          try {
            const loggedIn = await checkIsLoggedIn(page);
            if (!loggedIn) {
              await performLogin(page, context);
            }
            await delay(2000);
            await navigateToOnlineLearning(page);
            await delay(2000);
            await selectFrontendCourse(page);
            await delay(3000);
            
            const badge = page.locator('text=Chưa hoàn thành').first();
            if (await badge.isVisible({ timeout: 5000 }).catch(() => false)) {
              console.log('[Menu] Đã tìm thấy bài học chưa hoàn thành, đang mở...');
              await badge.click();
              await page.waitForLoadState('networkidle');
              await delay(2000);
              await LearningRules.processLessonContent(page, 'Session Test', 'Lesson Demo');
            } else {
              console.log('[Menu] Không tìm thấy bài học nào có nhãn Chưa hoàn thành.');
            }
          } finally {
            await delay(4000);
            await browser.close();
          }
          break;
        }

        case '7': {
          console.log('\n--- DANH SÁCH GHI CHÚ BÀI HỌC OLLAMA AI ---');
          if (fs.existsSync(config.paths.notesDir)) {
            const files = fs.readdirSync(config.paths.notesDir);
            if (files.length === 0) {
              console.log('[Notes] Thư mục notes/ hiện đang trống.');
            } else {
              console.log(`Tìm thấy ${files.length} ghi chú bài học:`);
              files.forEach((f, idx) => console.log(`  [${idx + 1}] ${f}`));
            }
          } else {
            console.log('[Notes] Thư mục notes/ chưa được tạo.');
          }
          break;
        }

        case '8': {
          ProgressTracker.printProgressSummary();
          const resetAns = await rl.question('\nBạn có muốn XÓA lịch sử để học lại từ đầu không? (y/N): ');
          if (resetAns.trim().toLowerCase() === 'y') {
            ProgressTracker.resetProgress();
          }
          break;
        }

        case '9': {
          console.log('\n--- KIỂM TRA MÔI TRƯỜNG & HỆ THỐNG ---');
          const ollamaStatus = await checkOllamaConnection();
          console.log(`- Ollama AI Server: ${ollamaStatus.online ? '✓ ĐANG CHẠY' : '❌ CHƯA CHẠY'}`);
          if (ollamaStatus.online) {
            console.log(`  + Model cấu hình: ${config.ollama.model}`);
            console.log(`  + Models khả dụng: ${ollamaStatus.models.join(', ') || 'Chưa tải model'}`);
          }
          const hasSession = fs.existsSync(config.browser.storageStatePath);
          console.log(`- Trạng thái Cookie Session (auth.json): ${hasSession ? '✓ ĐÃ CÓ' : '❌ CHƯA CÓ'}`);
          break;
        }

        default:
          console.log('⚠️ Lựa chọn không hợp lệ. Vui lòng chọn từ 0 đến 9.');
      }
    } catch (err) {
      console.error(`\n❌ Đã xảy ra lỗi: ${err.message}`);
    }

    await rl.question('\nNhấn [Enter] để quay lại Bảng điều khiển...');
  }
}
