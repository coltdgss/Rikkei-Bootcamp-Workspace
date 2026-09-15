import { chromium } from 'playwright-extra';
import stealthPlugin from 'puppeteer-extra-plugin-stealth';
import fs from 'fs';
import path from 'path';
import { config } from './config.js';

chromium.use(stealthPlugin());

/**
 * Chế độ Quan Sát & Ghi Nhận Hành Vi Người Dùng Toàn Diện (AI Master Observer)
 */
export async function startObserverAndLearnMode() {
  console.log('\n================================================================');
  console.log('👀 [AI OBSERVER] ĐÃ SẴN SÀNG QUAN SÁT THAO TÁC CỦA BẠN 100%!');
  console.log('================================================================');
  console.log('- AI sẽ ghi lại mọi thao tác click, cuộn trang, phát video, giải quiz.');
  console.log('- Toàn bộ selector chính xác và luồng đi sẽ được ghi nhận vào nhật ký.');
  console.log('- Khi bạn hoàn thành và đóng trình duyệt, AI sẽ tổng hợp và nâng cấp bot!');
  console.log('================================================================\n');

  const isStorageExist = fs.existsSync(config.browser.storageStatePath);
  
  const browser = await chromium.launch({
    headless: false,
    slowMo: 50,
    args: ['--start-maximized', '--disable-blink-features=AutomationControlled']
  });

  const contextOptions = {
    viewport: null, // Fullscreen
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36',
  };

  if (isStorageExist) {
    contextOptions.storageState = config.browser.storageStatePath;
  }

  const context = await browser.newContext(contextOptions);
  const page = await context.newPage();

  const interactionLogs = [];

  // Lắng nghe điều hướng URL
  page.on('framenavigated', (frame) => {
    if (frame === page.mainFrame()) {
      const url = frame.url();
      console.log(`[Observer] 🌐 Người dùng chuyển trang: ${url}`);
      interactionLogs.push({
        type: 'navigation',
        url: url,
        timestamp: new Date().toISOString()
      });
    }
  });

  // Inject script theo dõi click và video
  await page.exposeFunction('logUserClick', (info) => {
    console.log(`[Observer] 🖱️ Click: "${info.text || info.tag}" (ID: ${info.id || 'none'} | Class: ${info.className})`);
    interactionLogs.push({
      type: 'click',
      ...info,
      timestamp: new Date().toISOString()
    });
  });

  await page.exposeFunction('logVideoEvent', (info) => {
    console.log(`[Observer] 🎬 Video Event: ${info.event} (Time: ${info.currentTime}/${info.duration})`);
    interactionLogs.push({
      type: 'video',
      ...info,
      timestamp: new Date().toISOString()
    });
  });

  await page.addInitScript(() => {
    // Bắt sự kiện click
    document.addEventListener('click', (e) => {
      const target = e.target;
      if (target) {
        window.logUserClick({
          tag: target.tagName,
          text: (target.innerText || target.value || '').trim().slice(0, 80),
          className: target.className,
          id: target.id,
          ariaLabel: target.getAttribute('aria-label') || ''
        });
      }
    }, true);

    // Bắt sự kiện video
    document.addEventListener('play', (e) => {
      if (e.target && e.target.tagName === 'VIDEO') {
        window.logVideoEvent({
          event: 'play',
          currentTime: e.target.currentTime,
          duration: e.target.duration
        });
      }
    }, true);

    document.addEventListener('ended', (e) => {
      if (e.target && e.target.tagName === 'VIDEO') {
        window.logVideoEvent({
          event: 'ended',
          currentTime: e.target.currentTime,
          duration: e.target.duration
        });
      }
    }, true);
  });

  console.log('[Observer] Đang mở Rikkei Portal...');
  await page.goto('https://portal.rikkei.edu.vn/learn/32', { waitUntil: 'domcontentloaded' }).catch(async () => {
    await page.goto(config.portal.loginUrl);
  });

  console.log('\n👉 Trình duyệt đã mở! Mời bạn thoải mái thao tác mẫu để AI học hỏi.');

  // Giữ kết nối đến khi người dùng đóng trình duyệt
  await new Promise((resolve) => {
    page.on('close', resolve);
    browser.on('disconnected', resolve);
  });

  console.log('\n[Observer] Đang lưu trữ toàn bộ dữ liệu mẫu học hỏi từ bạn...');

  const dir = path.dirname(config.browser.storageStatePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  await context.storageState({ path: config.browser.storageStatePath }).catch(() => {});
  console.log(`[Observer] ✓ Đã lưu Session mới nhất vào: ${config.browser.storageStatePath}`);

  const logPath = path.resolve(dir, 'user_interaction_log.json');
  fs.writeFileSync(logPath, JSON.stringify(interactionLogs, null, 2), 'utf-8');
  console.log(`[Observer] ✓ Đã ghi nhận ${interactionLogs.length} thao tác mẫu vào: ${logPath}`);
  console.log('================================================================\n');
}

startObserverAndLearnMode();
