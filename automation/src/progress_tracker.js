import fs from 'fs';
import path from 'path';
import { config } from './config.js';

/**
 * Quản lý lịch sử và tiến độ học tập tự động (State Persistence)
 */
export const ProgressTracker = {
  /**
   * Đọc dữ liệu tiến độ từ file storage_state/progress.json
   */
  loadProgress() {
    const filePath = config.browser.progressPath;
    if (fs.existsSync(filePath)) {
      try {
        const raw = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(raw);
      } catch (e) {
        console.warn(`[ProgressTracker] Không thể đọc file progress.json: ${e.message}`);
      }
    }

    return {
      courseName: config.portal.courseName,
      lastCompletedSession: null,
      lastCompletedLesson: null,
      lastCompletedUrl: null,
      lastUpdated: null,
      completedCount: 0,
      history: []
    };
  },

  /**
   * Lưu lại một bài học vừa hoàn thành
   */
  saveLessonCompleted(sessionTitle, lessonTitle, lessonUrl = '') {
    const data = this.loadProgress();
    
    const cleanSession = sessionTitle ? sessionTitle.trim().split('\n')[0] : `Session ${config.portal.startSession}`;
    const cleanLesson = lessonTitle ? lessonTitle.trim().split('\n')[0] : 'Bài học';

    data.lastCompletedSession = cleanSession;
    data.lastCompletedLesson = cleanLesson;
    data.lastCompletedUrl = lessonUrl;
    data.lastUpdated = new Date().toISOString();
    
    // Thêm vào history nếu chưa có
    const exists = data.history.find(h => h.lesson === cleanLesson && h.session === cleanSession);
    if (!exists) {
      data.history.push({
        session: cleanSession,
        lesson: cleanLesson,
        completedAt: new Date().toISOString()
      });
      data.completedCount = data.history.length;
    }

    const dir = path.dirname(config.browser.progressPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(config.browser.progressPath, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`[ProgressTracker] 💾 Đã lưu tiến độ: [${cleanSession}] -> [${cleanLesson}] (${data.completedCount} bài đã xong).`);
  },

  /**
   * Kiểm tra bài học đã từng hoàn thành trong lịch sử chưa
   */
  isLessonAlreadyCompleted(sessionTitle, lessonTitle) {
    const data = this.loadProgress();
    const cleanSession = sessionTitle ? sessionTitle.trim().split('\n')[0] : '';
    const cleanLesson = lessonTitle ? lessonTitle.trim().split('\n')[0] : '';

    return data.history.some(h => (h.lesson === cleanLesson || cleanLesson.includes(h.lesson)) && (cleanSession.includes(h.session) || h.session.includes(cleanSession)));
  },

  /**
   * In tóm tắt tiến độ học tập
   */
  printProgressSummary() {
    const data = this.loadProgress();
    console.log(`\n========================================================`);
    console.log(`📊 TIẾN ĐỘ HỌC TẬP ĐÃ LƯU (PROGRESS HISTORY)`);
    console.log(`========================================================`);
    console.log(`- Khóa học: ${data.courseName}`);
    console.log(`- Tổng số bài đã hoàn thành tự động: ${data.completedCount} bài`);
    if (data.lastCompletedLesson) {
      console.log(`- Bài học gần nhất: [${data.lastCompletedSession}] -> ${data.lastCompletedLesson}`);
      console.log(`- Thời gian cập nhật: ${new Date(data.lastUpdated).toLocaleString('vi-VN')}`);
    } else {
      console.log(`- Chưa có lịch sử học tập nào được ghi nhận.`);
    }
    
    if (data.history.length > 0) {
      console.log(`\nDanh sách bài học đã hoàn thành:`);
      data.history.forEach((h, idx) => {
        console.log(`  [${idx + 1}] ${h.session} | ${h.lesson} (${new Date(h.completedAt).toLocaleTimeString('vi-VN')})`);
      });
    }
    console.log(`========================================================`);
  },

  /**
   * Đặt lại toàn bộ lịch sử học tập
   */
  resetProgress() {
    const filePath = config.browser.progressPath;
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`[ProgressTracker] ✓ Đã xóa lịch sử học tập cũ. Hệ thống sẽ quét lại từ đầu Session ${config.portal.startSession}.`);
    } else {
      console.log(`[ProgressTracker] Chưa có file lịch sử để đặt lại.`);
    }
  }
};
