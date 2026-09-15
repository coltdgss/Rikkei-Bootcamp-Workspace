import fs from 'fs';
import path from 'path';
import { config } from './config.js';

/**
 * Di chuyển chuột mượt mà đến phần tử để mô phỏng thao tác người dùng thật
 */
async function smoothMoveAndClick(page, locator) {
  try {
    await locator.waitFor({ state: 'visible', timeout: 10000 });
    const box = await locator.boundingBox();
    if (box) {
      const targetX = box.x + box.width / 2 + (Math.random() * 8 - 4);
      const targetY = box.y + box.height / 2 + (Math.random() * 6 - 3);
      await page.mouse.move(targetX, targetY, { steps: 25 });
      await page.waitForTimeout(200);
      await page.mouse.down();
      await page.waitForTimeout(80);
      await page.mouse.up();
      return true;
    }
  } catch (e) {}

  await locator.click().catch(() => {});
  return false;
}

/**
 * Kiểm tra xem session hiện tại đã đăng nhập vào Portal chưa
 */
export async function checkIsLoggedIn(page) {
  try {
    await page.goto('https://portal.rikkei.edu.vn/portal', { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForTimeout(2000);
    
    const currentUrl = page.url();
    if (!currentUrl.includes('/dangnhap') && (currentUrl.includes('/portal') || await page.$('text=Hệ thống học tập') || await page.$('text=Khóa học của tôi') || await page.$('text=Xin chào'))) {
      console.log('[Auth] ✓ Phiên đăng nhập hợp lệ (Đã đăng nhập trước đó - Bỏ qua Captcha)!');
      return true;
    }
  } catch (err) {
    console.log('[Auth] Phiên cũ chưa đăng nhập hoặc hết hạn, tiến hành đăng nhập...');
  }
  return false;
}

/**
 * Thực hiện quy trình đăng nhập 5 bước và xử lý reCAPTCHA Challenge (với Auto-Resume)
 */
export async function performLogin(page, context) {
  console.log(`[Auth] Điều hướng tới trang đăng nhập: ${config.portal.loginUrl}`);
  await page.goto(config.portal.loginUrl, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2500);

  // Nếu trang đã tự động chuyển sang /portal do có cookie từ trước
  if (page.url().includes('/portal')) {
    console.log('[Auth] ✓ Đã tự động vào Dashboard Portal!');
    await context.storageState({ path: config.browser.storageStatePath });
    return true;
  }

  // Bước 1 & 2: Điền Email và Password (Material UI)
  console.log(`[Auth] Bước 1: Di chuột và nhập Email (${config.portal.email})...`);
  const emailInput = page.locator('#outlined-required, input[type="text"]').first();
  await emailInput.waitFor({ state: 'visible', timeout: 10000 });
  await smoothMoveAndClick(page, emailInput);
  await emailInput.fill('');
  await emailInput.type(config.portal.email, { delay: 60 });
  await page.waitForTimeout(600);

  console.log(`[Auth] Bước 2: Di chuột và nhập Mật khẩu...`);
  const passwordInput = page.locator('#outlined-password-input, input[type="password"]').first();
  await passwordInput.waitFor({ state: 'visible', timeout: 10000 });
  await smoothMoveAndClick(page, passwordInput);
  await passwordInput.fill('');
  await passwordInput.type(config.portal.password, { delay: 60 });
  await page.waitForTimeout(1000);

  // Bước 3 & 4: Xử lý reCAPTCHA v2 Checkbox
  console.log('[Auth] Bước 3: Tìm và di chuột vào ô reCAPTCHA ("Tôi không phải là người máy")...');
  
  let recaptchaPassed = false;
  try {
    await page.waitForSelector('iframe[src*="recaptcha/api2/anchor"]', { timeout: 12000 });
    
    let recaptchaFrame = null;
    for (const f of page.frames()) {
      if (f.url().includes('recaptcha/api2/anchor')) {
        recaptchaFrame = f;
        break;
      }
    }

    if (recaptchaFrame) {
      const checkbox = await recaptchaFrame.waitForSelector('#recaptcha-anchor, .recaptcha-checkbox', { timeout: 8000 });
      
      const iframeElement = await page.$('iframe[src*="recaptcha/api2/anchor"]');
      const iframeBox = await iframeElement.boundingBox();

      if (iframeBox) {
        const clickX = iframeBox.x + 32 + (Math.random() * 4 - 2);
        const clickY = iframeBox.y + 38 + (Math.random() * 4 - 2);
        
        console.log('[Auth] Đang di chuyển chuột tự nhiên vào ô reCAPTCHA...');
        await page.mouse.move(clickX, clickY, { steps: 25 });
        await page.waitForTimeout(300);
        await page.mouse.down();
        await page.waitForTimeout(90);
        await page.mouse.up();
      } else {
        await checkbox.click();
      }

      console.log('[Auth] Bước 4: Đang chờ reCAPTCHA xác thực...');
      
      let challengeAnnounced = false;
      const startTime = Date.now();
      const maxWaitMs = 120000; // Chờ tối đa 2 phút

      while (Date.now() - startTime < maxWaitMs) {
        // Kiểm tra xem checkbox đã tích xanh chưa hoặc URL đã đổi
        const isChecked = await recaptchaFrame.$eval('#recaptcha-anchor', el => el.getAttribute('aria-checked') === 'true').catch(() => false);
        const currentUrl = page.url();

        if (isChecked || currentUrl.includes('/portal') || !currentUrl.includes('/dangnhap')) {
          console.log('\n[Auth] ✓ reCAPTCHA ĐÃ XÁC THỰC THÀNH CÔNG (Tích xanh)!');
          console.log('[Auth] 🤖 Bot tự động tiếp quản quyền điều khiển...');
          recaptchaPassed = true;
          break;
        }

        // Kiểm tra xem có xuất hiện khung câu đố ảnh 3x3 không
        const challengeFrame = page.frames().find(f => f.url().includes('recaptcha/api2/bframe'));
        if (challengeFrame && !challengeAnnounced) {
          console.log('\n========================================================');
          console.log('🧩 PHÁT HIỆN CÂU ĐỐ HÌNH ẢNH reCAPTCHA (3x3 Grid)');
          console.log('- Hãy chọn các ô hình ảnh phù hợp và bấm "XÁC MINH".');
          console.log('- Hệ thống đang theo dõi và sẽ TỰ ĐỘNG TIẾP QUẢN ngay khi bạn xác minh xong!');
          console.log('========================================================\n');
          challengeAnnounced = true;
        }

        await page.waitForTimeout(1000);
      }
    }
  } catch (err) {
    console.warn(`[Auth] Lưu ý tương tác reCAPTCHA: ${err.message}.`);
  }

  // Bước 5: Bấm Đăng nhập nếu vẫn ở trang login
  if (page.url().includes('/dangnhap')) {
    console.log('[Auth] Bước 5: Đệm 2 giây an toàn...');
    await page.waitForTimeout(2000);

    console.log('[Auth] Di chuột đến nút "Đăng nhập" và click...');
    const loginButton = page.locator('button:has-text("Đăng nhập"), button[type="submit"], .MuiButton-containedPrimary').first();
    await smoothMoveAndClick(page, loginButton);

    console.log('[Auth] Đang xác nhận chuyển hướng SPA vào Dashboard...');
    
    // Đợi SPA chuyển sang /portal mà không bị kẹt bởi waitForNavigation
    try {
      await page.waitForFunction(() => {
        return window.location.href.includes('/portal') || !window.location.href.includes('/dangnhap');
      }, { timeout: 20000 });
    } catch (e) {
      console.log('[Auth] Chuyển trang SPA hoàn tất.');
    }
    await page.waitForTimeout(3000);
  }

  // Lưu session state vào file auth.json để không bao giờ phải giải lại
  const dir = path.dirname(config.browser.storageStatePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  await context.storageState({ path: config.browser.storageStatePath });
  console.log(`[Auth] ✓ ĐÃ LƯU TOÀN BỘ PHIÊN ĐĂNG NHẬP VÀO: ${config.browser.storageStatePath}`);
  console.log(`[Auth] 👉 Các lần chạy sau sẽ VÀO THẲNG BÀI HỌC mà không cần giải Captcha nữa!`);
  
  return true;
}
