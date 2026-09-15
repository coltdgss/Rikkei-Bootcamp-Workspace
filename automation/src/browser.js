import { chromium } from 'playwright-extra';
import stealthPlugin from 'puppeteer-extra-plugin-stealth';
import { execSync } from 'child_process';
import fs from 'fs';
import { config } from './config.js';

// Activate stealth plugin to hide automation signatures
chromium.use(stealthPlugin());

/**
 * Tự động diệt các tiến trình Chromium/Playwright cũ bị treo để chống xung đột
 */
export function killZombieBrowsers() {
  try {
    if (process.platform === 'win32') {
      execSync('powershell -NoProfile -Command "Get-Process chrome,msedge -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like \'*playwright*\' -or $_.MainWindowTitle -like \'*Chromium*\' } | Stop-Process -Force -ErrorAction SilentlyContinue"', { stdio: 'ignore' });
    }
  } catch (err) {
    // Ignore error if no processes found
  }
}

/**
 * Khởi tạo Browser và Context với cấu hình chống phát hiện Bot
 */
export async function initBrowser() {
  // Dọn dẹp các cửa sổ trình duyệt zombie trước khi mở phiên mới
  killZombieBrowsers();

  const isStorageExist = fs.existsSync(config.browser.storageStatePath);
  
  console.log(`[Browser] Khởi động trình duyệt Chromium (Headless: ${config.browser.headless})...`);
  
  const browser = await chromium.launch({
    headless: config.browser.headless,
    slowMo: config.browser.slowMo,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-infobars',
      '--disable-blink-features=AutomationControlled',
      '--window-size=1366,768',
      '--disable-web-security',
      '--disable-features=IsolateOrigins,site-per-process'
    ]
  });

  const contextOptions = {
    viewport: config.browser.viewport,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36',
    locale: 'vi-VN',
    timezoneId: 'Asia/Ho_Chi_Minh',
    permissions: ['geolocation', 'notifications'],
  };

  if (isStorageExist) {
    try {
      console.log(`[Browser] Nạp phiên đăng nhập (Cookie/Token) từ: ${config.browser.storageStatePath}`);
      contextOptions.storageState = config.browser.storageStatePath;
    } catch (err) {
      console.warn(`[Browser] Không thể tải storageState: ${err.message}`);
    }
  }

  const context = await browser.newContext(contextOptions);

  // Thêm script chống phát hiện thuộc tính webdriver
  await context.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', {
      get: () => undefined,
    });
  });

  const page = await context.newPage();
  page.setDefaultTimeout(30000);
  page.setDefaultNavigationTimeout(45000);

  return { browser, context, page };
}
