import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from automation root
dotenv.config({ path: path.resolve(__dirname, '../.env') });

export const config = {
  portal: {
    loginUrl: process.env.PORTAL_LOGIN_URL || 'https://portal.rikkei.edu.vn/dangnhap',
    email: process.env.PORTAL_EMAIL || 'gen9.0525@gmail.com',
    password: process.env.PORTAL_PASSWORD || 'gen9.0525@gmail.com',
    courseName: process.env.COURSE_NAME || '[Tsubasa] Lập trình front-end cơ bản',
    courseId: process.env.COURSE_ID || '32',
    courseUrl: process.env.COURSE_URL || 'https://portal.rikkei.edu.vn/learn/32',
    startSession: parseInt(process.env.START_SESSION || '17', 10),
    endSession: parseInt(process.env.END_SESSION || '20', 10),
  },
  browser: {
    headless: process.env.HEADLESS === 'true',
    slowMo: parseInt(process.env.SLOW_MO || '150', 10),
    viewport: {
      width: parseInt(process.env.VIEWPORT_WIDTH || '1366', 10),
      height: parseInt(process.env.VIEWPORT_HEIGHT || '768', 10),
    },
    storageStatePath: path.resolve(__dirname, '..', process.env.STORAGE_STATE_PATH || 'storage_state/auth.json'),
    progressPath: path.resolve(__dirname, '../storage_state/progress.json'),
  },
  ollama: {
    host: process.env.OLLAMA_HOST || 'http://127.0.0.1:11434',
    model: process.env.OLLAMA_MODEL || 'qwen2.5-coder:latest',
  },
  rules: {
    minLessonStayMs: parseInt(process.env.MIN_LESSON_STAY_MS || '15000', 10),
    maxLessonStayMs: parseInt(process.env.MAX_LESSON_STAY_MS || '30000', 10),
    videoPlaybackRate: parseFloat(process.env.VIDEO_PLAYBACK_RATE || '1.5'),
  },
  paths: {
    notesDir: path.resolve(__dirname, '../notes'),
    storageDir: path.resolve(__dirname, '../storage_state'),
    knowledgeBaseDir: path.resolve(__dirname, '../knowledge_base'),
  }
};
