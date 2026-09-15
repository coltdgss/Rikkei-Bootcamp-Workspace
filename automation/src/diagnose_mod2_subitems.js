import { chromium } from 'playwright';
import { config } from './config.js';
import * as fs from 'fs';

async function main() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({ storageState: config.browser.storageStatePath });
  const page = await context.newPage();

  await page.goto('https://portal.rikkei.edu.vn/learn/96', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(5000);

  const subItemsData = await page.evaluate(() => {
    const lesson2 = Array.from(document.querySelectorAll('.MuiAccordion-root')).find(el => el.textContent.includes('Lesson 2'));
    if (!lesson2) return "Lesson 2 not found";

    const blocks = Array.from(lesson2.querySelectorAll('div.learn__content--right__item--block, [class*="item--block"], .lesson-sub-item, .MuiCollapse-root *'));
    
    // Dump all potential subitems
    return blocks.map(b => ({
      className: b.className,
      text: b.textContent?.trim(),
      html: b.innerHTML.slice(0, 500)
    })).filter(b => b.text && (b.text.includes('Video') || b.text.includes('Bài') || b.text.includes('Kiểm tra')));
  });

  fs.writeFileSync('storage_state/mod2_subitems.json', JSON.stringify(subItemsData, null, 2));
  console.log('Saved to storage_state/mod2_subitems.json');
  await browser.close();
}

main().catch(console.error);
