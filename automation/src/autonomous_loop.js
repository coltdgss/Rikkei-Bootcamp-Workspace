import { chromium } from 'playwright-extra';
import stealthPlugin from 'puppeteer-extra-plugin-stealth';
import fs from 'fs';
import path from 'path';
import { config } from './config.js';
import { ensureOllamaReady } from './ollama_client.js';
import { checkIsLoggedIn, performLogin } from './auth.js';
import { runCourseLearner } from './learner.js';
import { ProgressTracker } from './progress_tracker.js';
import { killZombieBrowsers } from './browser.js';
import { ErrorHealer } from './error_healer.js';
import { SkillMemory } from './skill_memory.js';

chromium.use(stealthPlugin());

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Động Cơ Vòng Lặp Tự Động 10 Lần - Nạp 100% Bộ Nhớ Kỹ Năng Do Người Dùng Dạy
 */
export async function runAutonomous10IterationEngine() {
  console.log('\n================================================================');
  console.log(`🚀 ĐỘNG CƠ VÒNG LẶP TỰ ĐỘNG 10 LẦN - KHÓA HỌC: ${config.portal.courseId}`);
  console.log('================================================================');

  // Nạp và in toàn bộ kỹ năng đã học được từ người dùng
  SkillMemory.printSkillMemorySummary();

  await ensureOllamaReady();

  const maxIterations = 10;
  const analysisReport = [];

  for (let iter = 1; iter <= maxIterations; iter++) {
    console.log(`\n================================================================`);
    console.log(`🔄 [VÒNG LẶP ${iter}/${maxIterations}] - BẮT ĐẦU QUÉT VÀ HỌC THẬT KHÓA HỌC ${config.portal.courseId}...`);
    console.log(`================================================================`);

    killZombieBrowsers();
    await delay(1500);

    const isStorageExist = fs.existsSync(config.browser.storageStatePath);
    const browser = await chromium.launch({
      headless: config.browser.headless,
      slowMo: config.browser.slowMo,
      args: ['--start-maximized', '--disable-blink-features=AutomationControlled'],
    });

    const contextOptions = {
      viewport: null,
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36',
    };
    if (isStorageExist) {
      contextOptions.storageState = config.browser.storageStatePath;
    }

    const context = await browser.newContext(contextOptions);
    const page = await context.newPage();

    try {
      // 1. Kiểm tra đăng nhập
      console.log(`[Vòng ${iter}] Kiểm tra phiên đăng nhập...`);
      const loggedIn = await checkIsLoggedIn(page);
      if (!loggedIn) {
        console.log(`[Vòng ${iter}] Đăng nhập phiên mới...`);
        await performLogin(page, context);
      }

      // 2. Chạy học tự động sâu 2 tầng qua runCourseLearner
      await runCourseLearner(page);

      // 3. Kiểm tra kết quả
      const pendingCount = await page.locator('.lesson-status-badge.pending, div:has-text("○ Chưa hoàn thành")').count().catch(() => 0);

      analysisReport.push({
        iteration: iter,
        timestamp: new Date().toISOString(),
        remainingPending: pendingCount,
        isGoalMet: (pendingCount === 0)
      });

      const reportPath = path.resolve(config.paths.storageDir, 'iteration_analysis.json');
      fs.writeFileSync(reportPath, JSON.stringify(analysisReport, null, 2), 'utf-8');

      if (pendingCount === 0) {
        console.log(`\n================================================================`);
        console.log(`🎉 CHÚC MỪNG! ĐÃ HOÀN THÀNH 100% TẤT CẢ BÀI HỌC CỦA KHÓA ${config.portal.courseId}!`);
        console.log(`================================================================\n`);
        await browser.close().catch(() => {});
        break;
      }

    } catch (err) {
      console.error(`\n[Vòng ${iter}] ❌ Phát sinh sự cố trong chu kỳ: ${err.message}`);
      
      await ErrorHealer.analyzeAndHeal({
        error: err,
        iteration: iter,
        page,
        context
      });

      console.log(`[Vòng ${iter}] ⏳ Đệm 5 giây phục hồi hệ thống trước khi bắt đầu Vòng lặp ${iter + 1}...`);
      await delay(5000);

    } finally {
      await browser.close().catch(() => {});
    }
  }

  console.log(`\n================================================================`);
  console.log(`📊 BÁO CÁO TIẾN TRÌNH VÒNG LẶP ĐÃ ĐƯỢC CẬP NHẬT!`);
  console.log(`================================================================\n`);
  ProgressTracker.printProgressSummary();
}

runAutonomous10IterationEngine();
