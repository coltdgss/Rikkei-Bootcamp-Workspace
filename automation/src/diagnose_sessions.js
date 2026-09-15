import { chromium } from 'playwright';
import { config } from './config.js';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ storageState: config.browser.storageStatePath });
  const page = await context.newPage();
  await page.goto('https://portal.rikkei.edu.vn/learn/32', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(5000);

  const sessions = await page.evaluate(() => {
    const results = [];
    // Tên session thường nằm trong thẻ p hoặc span có class chứa 'name'
    const nameEls = Array.from(document.querySelectorAll('p, span, h3')).filter(el => 
      el.textContent && el.textContent.includes('Session') && el.textContent.length < 100
    );
    
    for (const el of nameEls) {
      const container = el.closest('[class*="session"], .MuiAccordionSummary-root') || el.parentElement?.parentElement;
      if (container) {
        results.push({
          name: el.textContent.trim(),
          html: container.innerHTML.slice(0, 300),
          isDone: container.innerHTML.includes('Đã hoàn thành') || container.innerHTML.includes('is-done'),
          ariaExpanded: container.getAttribute('aria-expanded') || container.closest('[aria-expanded]')?.getAttribute('aria-expanded')
        });
      }
    }
    return results;
  });

  console.log(JSON.stringify(sessions, null, 2));
  await browser.close();
}
main();
