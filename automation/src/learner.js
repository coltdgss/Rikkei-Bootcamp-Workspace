import { LearningRules } from './rules.js';
import { ProgressTracker } from './progress_tracker.js';
import { VectorKnowledgeStore } from './vector_store.js';
import { SmartQuizSolver } from './quiz_solver.js';
import { config } from './config.js';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Cuộn đúng container bên phải xuống.
 * Có logic đảo chiều: Lúc đầu nhảy lên trên cùng, sau đó cuộn xuống dần để quét từ trên xuống dưới.
 * Đảm bảo tìm được bài "Chưa hoàn thành" đầu tiên ngay sau bài "Đã hoàn thành".
 */
async function scrollRightPanel(page, amount = 350, scrollRound = 0) {
  const { width, height } = await page.evaluate(() => ({
    width: window.innerWidth,
    height: window.innerHeight
  }));

  const targetX = width - Math.min(250, width / 4);
  const targetY = height / 2;

  await page.mouse.move(targetX, targetY, { steps: 5 });
  await delay(80);

  // Vòng lặp đầu tiên: Nhảy hẳn lên trên cùng để bắt đầu quét từ top xuống bottom
  if (scrollRound === 0 || scrollRound === 1) {
    console.log('[Learner] Đưa cuộn về sát bài chưa hoàn thành gần nhất...');
    await page.evaluate(() => {
      // Tìm session "Đã hoàn thành" cuối cùng trong DOM
      const allSessions = Array.from(document.querySelectorAll('.learn__content--right__name'));
      let lastDoneSession = null;
      for (const el of allSessions) {
        if (el.textContent.includes('Session')) {
          const container = el.closest('[class*="session"], .MuiAccordionSummary-root') || el.parentElement?.parentElement;
          if (container && (container.innerHTML.includes('tick-circle') || container.innerHTML.includes('Đã hoàn thành'))) {
            lastDoneSession = el;
          }
        }
      }
      if (lastDoneSession) {
        lastDoneSession.scrollIntoView({ behavior: 'instant', block: 'start' });
      } else {
        // Fallback: lên đầu trang
        const all = Array.from(document.querySelectorAll('*'));
        for (const el of all) {
          const s = window.getComputedStyle(el);
          if ((s.overflowY === 'auto' || s.overflowY === 'scroll') && el.scrollHeight > el.clientHeight + 50) {
            if (el.getBoundingClientRect().right > window.innerWidth * 0.5) {
              el.scrollTop = 0;
            }
          }
        }
        window.scrollTo(0, 0);
      }
    });
    await delay(1000);
  } else {
    // Các vòng sau: Cuộn dần xuống dưới
    await page.mouse.wheel(0, amount);
    await delay(500);

    // JS backup cuộn xuống
    await page.evaluate((amt) => {
      const all = Array.from(document.querySelectorAll('*'));
      for (const el of all) {
        const s = window.getComputedStyle(el);
        if ((s.overflowY === 'auto' || s.overflowY === 'scroll') && el.scrollHeight > el.clientHeight + 50) {
          if (el.getBoundingClientRect().right > window.innerWidth * 0.5) {
            el.scrollBy({ top: amt, behavior: 'instant' });
          }
        }
      }
      window.scrollBy({ top: amt, behavior: 'instant' });
    }, amount).catch(() => {});
  }

  await delay(400);
}

async function humanClick(page, locator) {
  try {
    await locator.waitFor({ state: 'visible', timeout: 5000 });
    const box = await locator.boundingBox();
    if (box) {
      const cx = box.x + box.width / 2;
      const cy = box.y + box.height / 2;
      await page.mouse.move(cx - 60, cy, { steps: 8 });
      await delay(100);
      await page.mouse.move(cx, cy, { steps: 10 });
      await delay(100);
      await page.mouse.click(cx, cy);
      return true;
    }
  } catch (e) {}
  try { await locator.click({ force: true }); } catch (e) {}
  return false;
}

/**
 * Tìm pending lessons và sub-items chưa hoàn thành dựa trên DOM thực tế.
 */
async function scanPendingLessonsAndSubItems(page, courseId) {
  return await page.evaluate((cId) => {
    const results = [];

    // Tìm tất cả Session để biết lesson thuộc Session nào
    const sessionNodes = Array.from(document.querySelectorAll('.learn__content--right__name'));
    
    const allBadges = Array.from(document.querySelectorAll('.lesson-status-badge, [class*="badge"]'));
    const pendingBadges = allBadges.filter(el => el.textContent.includes('Chưa hoàn thành') && el.children.length === 0);
    const accurateBadges = document.querySelectorAll('div.lesson-status-badge.pending');
    const targetBadges = accurateBadges.length > 0 ? Array.from(accurateBadges) : pendingBadges;

    for (const badge of targetBadges) {
      const accordionRoot = badge.closest('.MuiPaper-root, [class*="MuiAccordion-root"], .lesson-item, [class*="accordion"]');
      if (!accordionRoot) continue;

      const nameSpan = accordionRoot.querySelector('span.lesson-name-text, h3, .lesson-title, .learn__content--right__name');
      const lessonName = nameSpan?.textContent?.trim() || 'Unknown Lesson';

      // Xác định Session chứa Lesson này (tìm session Node ở phía trên gần nhất)
      let currentSession = "Unknown Session";
      const rectBadge = badge.getBoundingClientRect();
      for (let i = sessionNodes.length - 1; i >= 0; i--) {
        const sNode = sessionNodes[i];
        if (sNode.textContent.includes('Session')) {
          const sRect = sNode.getBoundingClientRect();
          if (sRect.top < rectBadge.top) {
            currentSession = sNode.textContent.trim();
            break;
          }
        }
      }

      // LUẬT BỎ QUA: Bỏ qua phần Lesson 2 Của Session 20 (Chỉ áp dụng cho Module 1)
      if (cId === '32' && lessonName.includes('Lesson 2') && currentSession.includes('Session 20')) {
        continue;
      }

      const summary = accordionRoot.querySelector('[aria-expanded]');
      const isExpanded = summary?.getAttribute('aria-expanded') === 'true';

      if (!isExpanded) {
        const summaryRect = summary ? summary.getBoundingClientRect() : null;
        results.push({
          lessonName,
          sessionName: currentSession,
          isExpanded: false,
          needsOpen: true,
          clickX: summaryRect && summaryRect.width > 0 ? summaryRect.x + summaryRect.width / 2 : null,
          clickY: summaryRect && summaryRect.height > 0 ? summaryRect.y + summaryRect.height / 2 : null,
        });
      } else {
        const subItems = Array.from(accordionRoot.querySelectorAll('div.learn__content--right__item--block, [class*="item--block"]'));
        const pendingSubItems = [];

        for (const block of subItems) {
          const nameEl = block.querySelector('p.learn__content--right__item--block__content__name, [class*="name"]');
          if (!nameEl) continue;
          const itemName = nameEl.textContent?.trim() || '';

          const contentDiv = block.querySelector('div.learn__content--right__item--block__content') || block;
          const contentHtml = contentDiv.innerHTML;

          const imgs = contentDiv.querySelectorAll('img');
          const svgs = contentDiv.querySelectorAll('svg');

          const isDone = contentHtml.includes('tick-circle') ||
                         contentHtml.includes('check_circle') ||
                         contentHtml.includes('check-circle') ||
                         contentHtml.includes('done') ||
                         contentHtml.includes('#52c41a') ||
                         imgs.length >= 2 || 
                         svgs.length >= 2;

          if (!isDone) {
            const rect = nameEl.getBoundingClientRect();
            pendingSubItems.push({
              name: itemName,
              clickX: rect.width > 0 ? rect.x + rect.width / 2 : null,
              clickY: rect.height > 0 ? rect.y + rect.height / 2 : null,
              isVisible: rect.height > 0 && rect.width > 0 && rect.top >= 0 && rect.top < window.innerHeight,
            });
          }
        }

        if (pendingSubItems.length > 0) {
          results.push({
            lessonName,
            sessionName: currentSession,
            isExpanded: true,
            needsOpen: false,
            pendingSubItems,
          });
        }
      }
    }

    return results;
  }).catch((e) => {
    console.error('[Learner] scan error:', e.message);
    return [];
  });
}

/**
 * HÀM CHÍNH: Học tự động toàn bộ session chưa hoàn thành
 */
export async function runCourseLearner(page) {
  console.log(`\n================================================================`);
  console.log(`🎯 [Learner] HỌC TỰ ĐỘNG XUYÊN SUỐT KHÓA HỌC: ${config.portal.courseId}`);
  console.log(`================================================================`);

  await delay(2000);
  const courseUrl = config.portal.courseUrl;
  const courseId = config.portal.courseId;

  const ensureCoursePage = async () => {
    const url = page.url();
    if (!url.includes(`/learn/${courseId}`) || url.includes('/lessons/') || url.includes('/quiz/') || url.includes('/document/')) {
      console.log(`[Learner] ↩ Quay về danh mục khóa học...`);
      await page.goto(courseUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await delay(3000);
    }
  };

  await ensureCoursePage();

  let totalDone = 0;
  let scrollRounds = 0;
  const MAX_SCROLL = 50;

  while (scrollRounds < MAX_SCROLL) {
    await ensureCoursePage();

    const scanResult = await scanPendingLessonsAndSubItems(page, courseId);

    if (scanResult.length === 0) {
      console.log(`[Learner] 📜 BƯỚC 1: Kéo thanh trượt phải (vòng ${scrollRounds}/${MAX_SCROLL}) để tìm bài học tiếp theo...`);
      await scrollRightPanel(page, 450, scrollRounds);
      scrollRounds++;
      continue;
    }

    scrollRounds = 0;
    const target = scanResult.find(r => r.isExpanded && r.pendingSubItems?.length > 0) || scanResult[0];

    const viewportHeight = page.viewportSize()?.height || 1080;
    
    if (target.needsOpen) {
      console.log(`\n[Learner] 🟡 BƯỚC 2: Mở accordion bài học: "${target.lessonName}" (thuộc ${target.sessionName})...`);
      if (target.clickX !== null && target.clickY !== null && target.clickY > 0 && target.clickY < viewportHeight) {
        await page.mouse.move(target.clickX - 50, target.clickY, { steps: 8 });
        await delay(100);
        await page.mouse.click(target.clickX, target.clickY);
      } else {
        const lessonHeader = page.locator(`span.lesson-name-text:has-text("${target.lessonName.slice(0, 30)}")`).first();
        await lessonHeader.scrollIntoViewIfNeeded().catch(() => {});
        await delay(300);
        await humanClick(page, lessonHeader);
      }
      await delay(2000);
      continue;
    }

    const pendingItem = target.pendingSubItems.find(s => s.isVisible) || target.pendingSubItems[0];
    console.log(`\n[Learner] 🎯 BƯỚC 3: Click mục "${pendingItem.name}" trong "${target.lessonName}"`);

    if (pendingItem.clickX !== null && pendingItem.clickY !== null && pendingItem.clickY > 0 && pendingItem.clickY < viewportHeight) {
      await page.mouse.move(pendingItem.clickX - 60, pendingItem.clickY, { steps: 8 });
      await delay(100);
      await page.mouse.click(pendingItem.clickX, pendingItem.clickY);
    } else {
      const subItemLocator = page.locator('p.learn__content--right__item--block__content__name').filter({ hasText: pendingItem.name }).first();
      await subItemLocator.scrollIntoViewIfNeeded().catch(() => {});
      await delay(400);
      await humanClick(page, subItemLocator);
    }

    await page.waitForLoadState('domcontentloaded', { timeout: 15000 }).catch(() => {});
    await delay(3500); // Chờ load trang mới

    const newUrl = page.url();
    console.log(`[Learner] 📍 Điều hướng → ${newUrl}`);

    if (newUrl.includes('/lessons/')) {
      console.log(`[Learner] 🎬 Bài Video — chờ xem hết video...`);
      await LearningRules.handleVideoLesson(page);
      await LearningRules.confirmLessonCompletion(page);

    } else if (newUrl.includes('/quiz/')) {
      console.log(`[Learner] 📝 Bài Quiz — giải quiz tự động...`);
      const heading = await page.locator('h1, h2, .cquiz-landing__title, .lesson-title').first().innerText().catch(() => pendingItem.name);
      await SmartQuizSolver.solveQuiz(page, target.lessonName, heading);

    } else if (newUrl.includes('/document/')) {
      console.log(`[Learner] 📄 Bài Đọc — đọc và xác nhận...`);
      await LearningRules.handleReadingLesson(page);
      await LearningRules.confirmLessonCompletion(page);

    } else {
      console.log(`[Learner] ⚠ URL không nhận dạng: ${newUrl}. Thử xác nhận hoàn thành...`);
      await LearningRules.confirmLessonCompletion(page).catch(() => {});
    }

    totalDone++;
    ProgressTracker.saveProgress(target.lessonName, pendingItem.name, 'completed');
    
    console.log(`[Learner] 🔄 Quay lại danh mục để chuyển sang mục tiếp theo...`);
    await page.goto(courseUrl, { waitUntil: 'domcontentloaded' }).catch(() => {});
    await delay(3000);
  }

  console.log(`\n================================================================`);
  console.log(`🎉 HOÀN THÀNH ${totalDone} MỤC HỌC! Không còn bài "Chưa hoàn thành" nào nữa.`);
  console.log(`================================================================\n`);
  ProgressTracker.printProgressSummary();
}
