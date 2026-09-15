import { config } from './config.js';
import { generateLessonSummary } from './ollama_client.js';
import { VectorKnowledgeStore } from './vector_store.js';
import { SmartQuizSolver } from './quiz_solver.js';

function formatSeconds(sec) {
  if (isNaN(sec) || sec === null || sec === undefined) return '00:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

/**
 * Tìm phần tử video trên trang chính hoặc bên trong bất kỳ iframe nào
 */
async function findActiveVideo(page) {
  // 1. Kiểm tra trang chính
  const mainVideo = await page.$('video').catch(() => null);
  if (mainVideo) return { frame: page, isIframe: false };

  // 2. Quét qua tất cả các frame con
  for (const frame of page.frames()) {
    try {
      const fVideo = await frame.$('video').catch(() => null);
      if (fVideo) return { frame: frame, isIframe: true };
    } catch (e) {}
  }

  return null;
}

/**
 * Bộ quy tắc tương tác và xử lý bài học trên Rikkei Portal
 */
export const LearningRules = {
  /**
   * Quy tắc 1: Kiểm tra Session >= START_SESSION
   */
  isTargetSession(sessionTitle) {
    const match = sessionTitle.match(/Session\s*(\d+)/i);
    if (!match) return false;
    const sessionNum = parseInt(match[1], 10);
    return sessionNum >= config.portal.startSession;
  },

  /**
   * Xử lý bài học dạng Video: KHÓA CHẶT TIẾN TRÌNH, PHÁT HẾT 100% THỜI LƯỢNG (10-30 PHÚT), TUYỆT ĐỐI KHÔNG CLICK RỜI ĐI
   */
  async handleVideoLesson(page) {
    console.log('\n[Video Tracker] 🎬 BẮT ĐẦU CHẾ ĐỘ THEO DÕI VIDEO BÀI GIẢNG (KHÓA CHẶT ĐẾN KHI HẾT 100%)...');

    // Chờ tối đa 30 giây để video player tải xong metadata
    let videoTarget = null;
    const waitStartTime = Date.now();

    while (!videoTarget && (Date.now() - waitStartTime < 30000)) {
      videoTarget = await findActiveVideo(page);
      if (videoTarget) break;
      await page.waitForTimeout(1500);
    }

    if (!videoTarget) {
      console.log('[Video Tracker] ⚠️ Không tìm thấy thẻ <video> sau 30s chờ. Có thể là bài đọc thuần túy.');
      return false;
    }

    const targetFrame = videoTarget.frame;
    console.log(`[Video Tracker] ✓ Đã bắt trúng Video Player (${videoTarget.isIframe ? 'Bên trong Iframe' : 'Trang chính'}).`);

    // Bật phát video ở tốc độ 1.5x (muted)
    await targetFrame.evaluate((rate) => {
      const video = document.querySelector('video');
      if (video) {
        video.muted = true;
        try {
          video.playbackRate = rate;
        } catch (e) {}
        video.play().catch(() => {});
      }
    }, config.rules.videoPlaybackRate).catch(() => {});

    let isVideoEnded = false;
    let lastReportPercent = -1;
    let pollCount = 0;
    const maxPollCount = 7200; // Cho phép video dài tối đa 60 phút (chu kỳ 1s)

    console.log(`[Video Tracker] ⏳ Đang theo dõi tiến trình video thời gian thực... (Tuyệt đối không click rời trang)`);

    while (!isVideoEnded && pollCount < maxPollCount) {
      pollCount++;
      await page.waitForTimeout(1000); // Polling mỗi 1 giây

      const status = await targetFrame.evaluate(() => {
        const v = document.querySelector('video');
        if (!v) return { exists: false };
        return {
          exists: true,
          currentTime: v.currentTime,
          duration: v.duration,
          paused: v.paused,
          ended: v.ended,
          playbackRate: v.playbackRate
        };
      }).catch(() => ({ exists: false }));

      if (!status.exists) {
        // Thử tìm lại video nếu DOM bị re-render nhẹ
        const reCheck = await findActiveVideo(page);
        if (!reCheck) {
          console.log('[Video Tracker] Video player đã kết thúc hoặc đóng.');
          break;
        }
        continue;
      }

      // Tự động Resume nếu video bị pause ngắt quãng
      if (status.paused && !status.ended && status.duration > 0 && status.currentTime < (status.duration - 1)) {
        await targetFrame.evaluate(() => {
          const v = document.querySelector('video');
          if (v) v.play().catch(() => {});
        }).catch(() => {});
      }

      if (status.duration && status.duration > 0) {
        const percent = Math.floor((status.currentTime / status.duration) * 100);

        // Hiển thị tiến trình trực quan trên console mỗi khi tăng 5% hoặc mỗi 20s
        if (percent !== lastReportPercent && (percent % 5 === 0 || pollCount % 20 === 0)) {
          console.log(`[Video Tracker] ⏳ TIẾN ĐỘ: ${formatSeconds(status.currentTime)} / ${formatSeconds(status.duration)} (${percent}%) - Đang phát [${status.playbackRate}x]...`);
          lastReportPercent = percent;
        }

        // Kiểm tra xem video đã kết thúc trọn vẹn chưa (ended hoặc đến 99.5% thời lượng)
        if (status.ended || status.currentTime >= (status.duration - 1.5)) {
          console.log(`\n[Video Tracker] 🎉 HOÀN THÀNH 100% VIDEO! (${formatSeconds(status.duration)})`);
          console.log(`[Video Tracker] Chờ 4 giây an toàn để hệ thống Portal ghi nhận sự kiện...`);
          isVideoEnded = true;
          await page.waitForTimeout(4000);
          break;
        }
      } else {
        if (pollCount % 15 === 0) {
          console.log('[Video Tracker] Video đang phát (đang tải độ dài thời gian)...');
        }
      }
    }

    console.log('[Video Tracker] ✓ Đã xem xong toàn bộ video! Chuẩn bị chuyển sang bước tiếp theo.');
    return true;
  },

  /**
   * Xử lý bài học dạng Đọc lý thuyết: Cuộn trang mô phỏng người đọc
   */
  async handleReadingLesson(page) {
    console.log('[Reading Tracker] 📄 Bắt đầu đọc nội dung bài học lý thuyết...');
    try {
      await page.evaluate(async () => {
        await new Promise((resolve) => {
          let totalHeight = 0;
          const distance = 120;
          const timer = setInterval(() => {
            const scrollHeight = document.body.scrollHeight;
            window.scrollBy(0, distance);
            totalHeight += distance;

            if (totalHeight >= scrollHeight || totalHeight > 3500) {
              clearInterval(timer);
              resolve();
            }
          }, 300);
        });
      });
      await page.waitForTimeout(3000);
    } catch (err) {
      console.warn(`[Reading Tracker] Lưu ý cuộn trang: ${err.message}`);
    }
  },

  /**
   * Xử lý bài tập trắc nghiệm thông minh (Smart Quiz Solver 100%)
   */
  async handleQuizIfPresent(page, sessionTitle, lessonTitle) {
    try {
      const hasQuizLanding = await page.$('.cquiz-landing__btn, button:has-text("Bắt đầu làm bài"), .cquiz__question');
      const isQuizUrl = page.url().includes('/quiz/');

      if (hasQuizLanding || isQuizUrl) {
        console.log('[Quiz Tracker] 📝 Phát hiện Bài tập trắc nghiệm! Kích hoạt Smart Quiz Solver...');
        await SmartQuizSolver.solveQuiz(page, sessionTitle, lessonTitle);
      } else {
        const quizBtn = page.locator('button:has-text("Làm bài tập"), button:has-text("Bắt đầu làm"), text=Bài tập trắc nghiệm').first();
        if (await quizBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
          console.log('[Quiz Tracker] Mở bài tập trắc nghiệm...');
          await quizBtn.click();
          await page.waitForTimeout(2500);
          await SmartQuizSolver.solveQuiz(page, sessionTitle, lessonTitle);
        }
      }
    } catch (err) {
      console.warn(`[Quiz Tracker] Lưu ý xử lý Quiz: ${err.message}`);
    }
  },

  /**
   * Quy tắc 3: Xác nhận hoàn thành bài học
   */
  async confirmLessonCompletion(page) {
    console.log('[Rules] Xác nhận hoàn thành bước học...');
    const completionSelectors = [
      'button:has-text("Bài tiếp theo")',
      'a:has-text("Bài tiếp theo")',
      'button:has-text("Tiếp tục")',
      'button:has-text("Hoàn thành")',
      'button:has-text("Hoàn thành bài học")',
      '.btn-complete',
      '.btn-next-lesson'
    ];

    for (const selector of completionSelectors) {
      const btn = page.locator(selector).first();
      if (await btn.isVisible({ timeout: 1500 }).catch(() => false)) {
        console.log(`[Rules] ✓ Nhấn nút: "${selector}"...`);
        await btn.click();
        await page.waitForTimeout(2000);
        return true;
      }
    }

    return false;
  }
};
