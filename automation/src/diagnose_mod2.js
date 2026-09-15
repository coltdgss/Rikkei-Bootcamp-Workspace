import { chromium } from 'playwright';
import { config } from './config.js';
import * as fs from 'fs';

const delay = (ms) => new Promise(r => setTimeout(r, ms));

async function main() {
  console.log('🔬 [DIAGNOSTIC MODULE 2] Mở browser để xem HTML...');
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    storageState: config.browser.storageStatePath,
    viewport: { width: 1280, height: 800 },
  });
  const page = await context.newPage();

  // Go to Module 2
  await page.goto('https://portal.rikkei.edu.vn/learn/96', { waitUntil: 'domcontentloaded' });
  await delay(8000); // Wait for API calls

  // Lấy danh sách badge
  const badgeClasses = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.lesson-status-badge, [class*="badge"], [class*="status"]'))
      .map(el => ({ className: el.className, text: el.textContent?.trim(), parent: el.parentElement?.className }))
      .filter(x => x.text && x.text.length < 50)
      .slice(0, 30);
  });

  // Lấy các bài chưa hoàn thành hoặc chưa khóa
  const lessonHeaders = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.MuiAccordionSummary-root, .lesson-header-wrapper, [class*="lesson"]'))
      .map(el => ({
        className: el.className,
        text: el.textContent?.trim().slice(0, 100),
        html: el.innerHTML.slice(0, 300)
      }))
      .filter(x => x.text && (x.text.includes('Lesson') || x.text.includes('Session')))
      .slice(0, 20);
  });

  // Tìm tất cả text trong panel phải xem có chữ "Chưa hoàn thành" không
  const rightPanelText = await page.evaluate(() => {
    const panels = Array.from(document.querySelectorAll('.learn__content--right'));
    return panels.map(p => p.innerText.slice(0, 1000));
  });

  const output = { badgeClasses, lessonHeaders, rightPanelText };
  fs.writeFileSync('storage_state/dom_mod2_diagnostic.json', JSON.stringify(output, null, 2));

  console.log('\n📋 Output saved to storage_state/dom_mod2_diagnostic.json');
  await browser.close();
}

main().catch(console.error);
