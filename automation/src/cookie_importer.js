import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright-extra';
import stealthPlugin from 'puppeteer-extra-plugin-stealth';
import { config } from './config.js';

chromium.use(stealthPlugin());

/**
 * Cách 1: Mở trình duyệt thực để người dùng tự đăng nhập và hệ thống tự bắt cookie lưu vào auth.json
 */
export async function interactiveManualLogin() {
  console.log('\n========================================================');
  console.log('🌐 CHẾ ĐỘ ĐĂNG NHẬP THỦ CÔNG ĐỂ BẮT COOKIE / SESSION');
  console.log('========================================================');
  console.log('- Trình duyệt sẽ mở trang: ' + config.portal.loginUrl);
  console.log('- Hãy tự nhập tài khoản / mật khẩu và giải CAPTCHA (nếu có).');
  console.log('- Khi đăng nhập thành công vào trang chủ, hệ thống sẽ TỰ ĐỘNG LƯU SESSION và đóng trình duyệt.');
  console.log('========================================================\n');

  const browser = await chromium.launch({
    headless: false,
    slowMo: 100,
    args: ['--start-maximized', '--disable-blink-features=AutomationControlled']
  });

  const context = await browser.newContext({
    viewport: null, // Full screen
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36'
  });

  const page = await context.newPage();
  await page.goto(config.portal.loginUrl);

  console.log('[Cookie Importer] Đang theo dõi trạng thái đăng nhập của bạn...');

  // Chờ cho đến khi URL không còn ở /dangnhap hoặc xuất hiện element trang chủ
  try {
    await page.waitForFunction(() => {
      const url = window.location.href;
      return !url.includes('/dangnhap') && (document.body.innerText.includes('Khóa học') || document.body.innerText.includes('Hệ thống') || document.body.innerText.includes('Xin chào'));
    }, { timeout: 300000 }); // Chờ tối đa 5 phút

    console.log('\n[Cookie Importer] ✓ Phát hiện đăng nhập thành công!');
    await page.waitForTimeout(3000);

    // Lưu storageState vào file
    const dir = path.dirname(config.browser.storageStatePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    await context.storageState({ path: config.browser.storageStatePath });
    console.log(`[Cookie Importer] ✓ ĐÃ LƯU TOÀN BỘ COOKIE & LOCALSTORAGE VÀO: ${config.browser.storageStatePath}`);
    console.log('[Cookie Importer] Bạn có thể dùng tùy chọn "Học tự động" mà không cần đăng nhập lại!');
  } catch (err) {
    console.error(`[Cookie Importer] ❌ Quá thời gian chờ hoặc hủy đăng nhập: ${err.message}`);
  } finally {
    await browser.close();
  }
}

/**
 * Cách 2: Nạp cookie từ file JSON (export từ tiện ích Cookie-Editor / EditThisCookie)
 */
export async function importCookiesFromJsonFile(jsonFilePath) {
  const targetPath = jsonFilePath || path.resolve(path.dirname(config.browser.storageStatePath), '../cookies.json');
  
  if (!fs.existsSync(targetPath)) {
    console.error(`[Cookie Importer] ❌ Không tìm thấy file: ${targetPath}`);
    console.log(`[Cookie Importer] Gợi ý: Hãy tạo file "automation/cookies.json" và dán mảng cookie JSON vào đó.`);
    return false;
  }

  try {
    const rawData = fs.readFileSync(targetPath, 'utf-8');
    const parsedCookies = JSON.parse(rawData);

    if (!Array.isArray(parsedCookies)) {
      throw new Error('Dữ liệu cookie phải là một mảng JSON (Array of Cookie objects).');
    }

    // Chuẩn hóa định dạng Cookie theo chuẩn của Playwright StorageState
    const playwrightCookies = parsedCookies.map(c => ({
      name: c.name,
      value: c.value,
      domain: c.domain.startsWith('.') ? c.domain : `.${c.domain}`,
      path: c.path || '/',
      expires: c.expirationDate || (c.expires ? c.expires : -1),
      httpOnly: c.httpOnly ?? false,
      secure: c.secure ?? true,
      sameSite: c.sameSite === 'no_restriction' ? 'None' : (c.sameSite === 'lax' ? 'Lax' : (c.sameSite === 'strict' ? 'Strict' : 'Lax'))
    }));

    const storageState = {
      cookies: playwrightCookies,
      origins: [
        {
          origin: 'https://portal.rikkei.edu.vn',
          localStorage: []
        }
      ]
    };

    const dir = path.dirname(config.browser.storageStatePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(config.browser.storageStatePath, JSON.stringify(storageState, null, 2), 'utf-8');
    console.log(`[Cookie Importer] ✓ Đã chuyển đổi và lưu ${playwrightCookies.length} cookies vào: ${config.browser.storageStatePath}`);
    return true;
  } catch (err) {
    console.error(`[Cookie Importer] ❌ Lỗi khi đọc file cookie: ${err.message}`);
    return false;
  }
}
