import { config } from './config.js';

/**
 * Bước 6: Điều hướng vào menu "Học trực tuyến"
 */
export async function navigateToOnlineLearning(page) {
  console.log('[Navigator] Bước 6: Đang tìm và truy cập mục "Học trực tuyến"...');
  await page.waitForTimeout(2500);

  // Tìm card "Học trực tuyến" và nút "Truy cập"
  try {
    const card = page.locator('div, .MuiCard-root, .MuiPaper-root').filter({ hasText: 'Học trực tuyến' }).first();
    const btn = card.locator('text=Truy cập, button, a').first();
    
    if (await btn.isVisible({ timeout: 5000 }).catch(() => false)) {
      console.log('[Navigator] Click nút "Truy cập" của Học trực tuyến...');
      await btn.click();
    } else {
      console.log('[Navigator] Click trực tiếp vào chữ "Học trực tuyến"...');
      await page.locator('text=Học trực tuyến').first().click();
    }
  } catch (err) {
    console.log('[Navigator] Thử click fallback...');
    await page.locator('text=Học trực tuyến').first().click().catch(() => {});
  }

  await page.waitForTimeout(3000);
  console.log('[Navigator] ✓ Đã vào giao diện Học trực tuyến.');
}

/**
 * Bước 7: Chọn khóa học bằng cách truy cập trực tiếp URL
 */
export async function selectFrontendCourse(page) {
  console.log(`[Navigator] Bước 7: Truy cập trực tiếp khóa học: ${config.portal.courseName} (${config.portal.courseUrl})...`);
  await page.waitForTimeout(1000);
  
  await page.goto(config.portal.courseUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(3500);
  console.log('[Navigator] ✓ Đã mở chi tiết khóa học.');
}
