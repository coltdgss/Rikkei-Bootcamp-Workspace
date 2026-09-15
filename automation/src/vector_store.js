import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const VECTOR_STORE_PATH = path.resolve(__dirname, '../knowledge_base/curriculum_vector_store.json');

/**
 * Quản lý kho tri thức bài giảng phân cấp (Module -> Session -> Lesson -> Content Vector Store)
 */
export const VectorKnowledgeStore = {
  /**
   * Đọc kho dữ liệu hiện tại
   */
  loadStore() {
    if (fs.existsSync(VECTOR_STORE_PATH)) {
      try {
        const raw = fs.readFileSync(VECTOR_STORE_PATH, 'utf-8');
        return JSON.parse(raw);
      } catch (e) {
        console.warn(`[VectorStore] Không thể đọc kho dữ liệu cũ: ${e.message}`);
      }
    }

    return {
      courseName: '[Tsubasa] Lập trình front-end cơ bản',
      lastUpdated: new Date().toISOString(),
      totalEntries: 0,
      entries: []
    };
  },

  /**
   * Lưu một đơn vị bài học vào kho tri thức vector phân cấp rõ ràng
   */
  saveEntry({ module = 'Module 1 - Frontend', session, lesson, title, url, contentType, rawContent, summary = '', quizAnswers = [] }) {
    const store = this.loadStore();
    
    const cleanSession = session ? session.trim().split('\n')[0] : 'Session Chưa xác định';
    const cleanLesson = lesson ? lesson.trim().split('\n')[0] : 'Lesson Chưa xác định';
    const cleanTitle = title ? title.trim().split('\n')[0] : cleanLesson;

    const entryId = `${module}_${cleanSession}_${cleanLesson}`.toLowerCase().replace(/[^a-z0-9]/g, '_');

    const entryData = {
      id: entryId,
      module: module,
      session: cleanSession,
      lesson: cleanLesson,
      title: cleanTitle,
      url: url || '',
      contentType: contentType || 'theory', // 'video' | 'reading' | 'quiz'
      rawContent: (rawContent || '').slice(0, 10000), // Lưu tối đa 10k ký tự
      summary: summary,
      quizAnswers: quizAnswers || [],
      savedAt: new Date().toISOString()
    };

    // Tìm và cập nhật nếu đã tồn tại, hoặc thêm mới
    const existingIndex = store.entries.findIndex(e => e.id === entryId || (e.session === cleanSession && e.lesson === cleanLesson));
    if (existingIndex >= 0) {
      store.entries[existingIndex] = { ...store.entries[existingIndex], ...entryData };
      console.log(`[VectorStore] 💾 Đã cập nhật tri thức: [${cleanSession}] -> [${cleanLesson}]`);
    } else {
      store.entries.push(entryData);
      console.log(`[VectorStore] 💾 Đã thêm mới vào kho tri thức: [${cleanSession}] -> [${cleanLesson}]`);
    }

    store.totalEntries = store.entries.length;
    store.lastUpdated = new Date().toISOString();

    const dir = path.dirname(VECTOR_STORE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(VECTOR_STORE_PATH, JSON.stringify(store, null, 2), 'utf-8');
    return entryData;
  },

  /**
   * Tìm kiếm câu trả lời đã lưu từ kho tri thức
   */
  findSavedAnswersForQuiz(session, lesson) {
    const store = this.loadStore();
    const entry = store.entries.find(e => e.session.includes(session) || session.includes(e.session));
    return entry ? entry.quizAnswers : [];
  }
};
