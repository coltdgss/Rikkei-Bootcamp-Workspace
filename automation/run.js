#!/usr/bin/env node
import { initBrowser } from './src/browser.js';
import { performLogin } from './src/auth.js';
import { checkOllamaConnection, startOllamaServer } from './src/ollama_client.js';
import { showInteractiveMenu, runFullAutoPilot } from './src/menu.js';
import { interactiveManualLogin, importCookiesFromJsonFile } from './src/cookie_importer.js';

async function main() {
  const args = process.argv.slice(2);

  // Chế độ 1: Kiểm tra môi trường
  if (args.includes('--check-env')) {
    console.log('[Check-Env] Đang kiểm tra các dịch vụ...');
    const status = await checkOllamaConnection();
    console.log(`- Ollama AI Server: ${status.online ? '✓ ĐANG CHẠY' : '❌ CHƯA CHẠY'}`);
    process.exit(0);
  }

  // Chế độ 2: Khởi động Ollama Server
  if (args.includes('--ollama') || args.includes('--start-ollama')) {
    await startOllamaServer();
    process.exit(0);
  }

  // Chế độ 3: Đăng nhập thủ công bắt cookie
  if (args.includes('--manual-login')) {
    await interactiveManualLogin();
    process.exit(0);
  }

  // Chế độ 4: Nạp cookie từ file json
  if (args.includes('--import-cookie')) {
    await importCookiesFromJsonFile();
    process.exit(0);
  }

  // Chế độ 5: Chỉ tự động đăng nhập
  if (args.includes('--login-only')) {
    const { browser, context, page } = await initBrowser();
    try {
      await performLogin(page, context);
      console.log('[Main] ✓ Đã hoàn tất đăng nhập và lưu session.');
    } finally {
      await page.waitForTimeout(3000);
      await browser.close();
    }
    process.exit(0);
  }

  // Chế độ 6: Chạy Full Auto Pilot 1-Click
  if (args.includes('--auto') || args.includes('--full-auto') || args.includes('--start')) {
    await runFullAutoPilot();
    process.exit(0);
  }

  // Mặc định: Hiển thị Bảng điều khiển Menu tương tác
  await showInteractiveMenu();
}

main();
