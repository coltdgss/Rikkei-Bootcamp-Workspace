/**
 * DIAGNOSTIC SCRIPT v2: Dump HTML đầy đủ của Lesson 10 accordion để xem icon check của sub-items
 * Chạy: node src/diagnose_dom2.js
 */
import { chromium } from 'playwright';
import { config } from './config.js';
import * as fs from 'fs';

const delay = (ms) => new Promise(r => setTimeout(r, ms));

async function main() {
  console.log('🔬 [DIAGNOSTIC v2] Mở browser để xem HTML đầy đủ của Lesson 10...');
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    storageState: config.browser.storageStatePath,
    viewport: { width: 1280, height: 800 },
  });
  const page = await context.newPage();

  await page.goto('https://portal.rikkei.edu.vn/learn/32', { waitUntil: 'domcontentloaded' });
  await delay(5000);

  // Scroll đến khu vực Session 17 để Lesson 10 visible
  await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll('*'));
    for (const el of all) {
      const s = window.getComputedStyle(el);
      if ((s.overflowY === 'auto' || s.overflowY === 'scroll') && el.scrollHeight > el.clientHeight + 100) {
        el.scrollTop += 3000;
      }
    }
  });
  await delay(2000);

  // DUMP: Tìm tất cả lesson--right__item--block (sub-item rows) và lấy toàn bộ HTML của parent
  const dump = await page.evaluate(() => {
    // Lấy outer HTML đầy đủ của tất cả learn__content--right__item--block
    const blocks = document.querySelectorAll('.learn__content--right__item--block, [class*="item--block"]');
    const results = [];
    for (const block of blocks) {
      results.push({
        className: block.className,
        outerHTML: block.outerHTML.slice(0, 1500),
        parentClass: block.parentElement?.className,
        grandParentClass: block.parentElement?.parentElement?.className,
        offsetTop: block.getBoundingClientRect().top,
      });
    }
    return results;
  });

  // Lấy thêm Lesson 10 accordion đầy đủ (khi đang mở)
  const lesson10Dump = await page.evaluate(() => {
    // Tìm accordion của Lesson 10
    const spans = Array.from(document.querySelectorAll('span.lesson-name-text'));
    const lesson10Span = spans.find(s => s.textContent?.includes('Gắn sự kiện') || s.textContent?.includes('addEventListener'));
    if (!lesson10Span) return { error: 'Lesson 10 not found in DOM' };

    // Lấy accordion root
    const accordionRoot = lesson10Span.closest('.MuiPaper-root, [class*="Accordion-root"], [class*="accordion"]');
    return {
      accordionClass: accordionRoot?.className,
      accordionHTML: accordionRoot?.outerHTML?.slice(0, 5000) || 'Not found',
      ariaExpanded: accordionRoot?.querySelector('[aria-expanded]')?.getAttribute('aria-expanded'),
    };
  });

  // Cũng lấy tất cả .lesson-status-badge để xem class đầy đủ
  const badgeClasses = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.lesson-status-badge'))
      .map(el => ({ className: el.className, text: el.textContent?.trim(), parent: el.parentElement?.className }))
      .slice(0, 20);
  });

  const output = { blocksDump: dump.slice(0, 10), lesson10Dump, badgeClasses };
  fs.writeFileSync('storage_state/dom_diagnostic2.json', JSON.stringify(output, null, 2));

  console.log('\n📋 Badge classes:');
  console.log(JSON.stringify(badgeClasses, null, 2));
  console.log('\n📋 Lesson 10 accordion:');
  console.log(JSON.stringify(lesson10Dump, null, 2));
  console.log('\n📋 First 3 item blocks:');
  console.log(JSON.stringify(dump.slice(0, 3), null, 2));
  console.log('\n✅ Saved to storage_state/dom_diagnostic2.json');

  await delay(3000);
  await browser.close();
}

main().catch(console.error);
