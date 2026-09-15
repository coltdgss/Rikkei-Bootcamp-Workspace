/**
 * DIAGNOSTIC SCRIPT: Dump HTML cấu trúc thực tế của trang Rikkei Portal
 * Chạy: node src/diagnose_dom.js
 * Mục đích: Xác định chính xác class/HTML của badge "Chưa hoàn thành" và green checkmark
 */
import { chromium } from 'playwright';
import { config } from './config.js';
import * as fs from 'fs';
import * as path from 'path';

const delay = (ms) => new Promise(r => setTimeout(r, ms));

async function main() {
  console.log('🔬 [DIAGNOSTIC] Khởi động browser để dump DOM thực tế...');

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    storageState: config.browser.storageStatePath,
    viewport: { width: 1280, height: 800 },
  });
  const page = await context.newPage();

  await page.goto('https://portal.rikkei.edu.vn/learn/32', { waitUntil: 'domcontentloaded' });
  await delay(4000);

  // Scroll to Lesson 10 area (Session 17)
  console.log('🔬 [DIAGNOSTIC] Cuộn đến khu vực Lesson 10...');
  await page.evaluate(() => {
    // Try to scroll all scrollable containers
    const all = Array.from(document.querySelectorAll('*'));
    for (const el of all) {
      const s = window.getComputedStyle(el);
      if ((s.overflowY === 'auto' || s.overflowY === 'scroll') && el.scrollHeight > el.clientHeight + 100) {
        el.scrollTop += 2000;
      }
    }
  });
  await delay(2000);

  // DUMP 1: Find all elements containing "Chưa hoàn thành"
  const badgeDump = await page.evaluate(() => {
    const results = [];
    const allEls = Array.from(document.querySelectorAll('*'));
    for (const el of allEls) {
      const ownText = el.textContent?.trim() || '';
      if (ownText.includes('Chưa hoàn thành') && el.offsetHeight > 0 && el.offsetHeight < 80) {
        results.push({
          tag: el.tagName,
          className: el.className,
          id: el.id,
          textContent: ownText.slice(0, 100),
          childrenCount: el.children.length,
          childrenTags: Array.from(el.children).map(c => c.tagName + '.' + c.className).join(', '),
          innerHTML: el.innerHTML.slice(0, 500),
          offsetWidth: el.offsetWidth,
          offsetHeight: el.offsetHeight,
          parentTag: el.parentElement?.tagName,
          parentClass: el.parentElement?.className,
        });
      }
    }
    return results;
  });

  console.log('\n📋 [DUMP 1] Tất cả elements chứa "Chưa hoàn thành":');
  console.log(JSON.stringify(badgeDump, null, 2));

  // DUMP 2: Find all sub-items p.learn__content--right__item--block__content__name
  const subItemDump = await page.evaluate(() => {
    const results = [];
    const items = document.querySelectorAll('p.learn__content--right__item--block__content__name');
    for (const p of items) {
      // Get parent block
      const block = p.closest('div');
      const blockHtml = block ? block.innerHTML.slice(0, 800) : '';
      results.push({
        name: p.textContent?.trim(),
        parentClass: p.parentElement?.className,
        blockClass: block?.className,
        blockHtml: blockHtml,
        // Check visibility
        isVisible: p.offsetHeight > 0 && p.offsetWidth > 0,
        offsetTop: p.getBoundingClientRect().top,
      });
    }
    return results;
  });

  console.log('\n📋 [DUMP 2] Tất cả sub-items p.learn__content--right__item--block__content__name:');
  console.log(JSON.stringify(subItemDump, null, 2));

  // DUMP 3: Specific check on Session 17 area
  const sessionDump = await page.evaluate(() => {
    // Find Session 17 header
    const allHeadings = Array.from(document.querySelectorAll('*')).filter(el =>
      el.textContent?.includes('Session 17') && el.offsetHeight < 80 && el.offsetHeight > 0
    );
    return allHeadings.map(el => ({
      tag: el.tagName,
      className: el.className,
      text: el.textContent?.trim()?.slice(0, 100),
      parentClass: el.parentElement?.className,
      nearbyHtml: el.closest('section, div[class*="session"], div[class*="accordion"]')?.innerHTML?.slice(0, 2000) || '',
    }));
  });

  console.log('\n📋 [DUMP 3] Session 17 area HTML:');
  console.log(JSON.stringify(sessionDump, null, 2));

  // Save to file for analysis
  const outputPath = path.join('storage_state', 'dom_diagnostic.json');
  fs.writeFileSync(outputPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    badgeDump,
    subItemDump,
    sessionDump,
  }, null, 2));

  console.log(`\n✅ [DIAGNOSTIC] Đã lưu kết quả vào: ${outputPath}`);
  console.log('📌 Review file này để xác định class/HTML chính xác!');

  await delay(3000);
  await browser.close();
}

main().catch(console.error);
