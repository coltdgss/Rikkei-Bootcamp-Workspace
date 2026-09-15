import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { config } from './config.js';

/**
 * Kiểm tra kết nối tới Ollama Server
 */
export async function checkOllamaConnection(timeoutMs = 3000) {
  try {
    const res = await fetch(`${config.ollama.host}/api/tags`, {
      method: 'GET',
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (res.ok) {
      const data = await res.json();
      const models = data.models ? data.models.map(m => m.name) : [];
      return { online: true, models };
    }
  } catch (err) {
    // Offline
  }
  return { online: false, models: [] };
}

/**
 * Tự động khởi động Ollama Server độc lập qua Windows Background Process
 */
export async function startOllamaServer() {
  console.log(`[Ollama AI] ⏳ Đang khởi động Ollama Server ngầm...`);

  // Kiểm tra trước nếu đã chạy thì không cần bật lại
  const current = await checkOllamaConnection(1500);
  if (current.online) {
    console.log(`[Ollama AI] ✓ Ollama Server ĐANG CHẠY! Các model sẵn có: ${current.models.join(', ')}`);
    return true;
  }

  try {
    if (process.platform === 'win32') {
      execSync('powershell -NoProfile -Command "Start-Process ollama -ArgumentList \'serve\' -WindowStyle Hidden"', { stdio: 'ignore' });
    } else {
      execSync('nohup ollama serve >/dev/null 2>&1 &', { stdio: 'ignore' });
    }

    console.log(`[Ollama AI] Đã gửi lệnh khởi động. Đang chờ server nạp vào RAM (tối đa 15 giây)...`);

    // Vòng lặp kiểm tra kết nối chu kỳ 1.5s
    const startTime = Date.now();
    while (Date.now() - startTime < 15000) {
      await new Promise(r => setTimeout(r, 1500));
      const status = await checkOllamaConnection(1500);
      if (status.online) {
        console.log(`[Ollama AI] ✓ Ollama Server đã khởi động thành công! Các model sẵn có: ${status.models.join(', ') || 'Chưa có model'}`);
        return true;
      }
    }
  } catch (err) {
    console.error(`[Ollama AI] ❌ Lỗi khi khởi động Ollama: ${err.message}`);
  }

  console.warn(`[Ollama AI] ⚠️ Chưa thể kết nối tới Ollama. Bạn có thể bấm file "start_ollama.bat" ở thư mục gốc để mở thủ công.`);
  return false;
}

/**
 * Đảm bảo Ollama Server đã sẵn sàng trước khi thực hiện tác vụ AI
 */
export async function ensureOllamaReady() {
  const status = await checkOllamaConnection(2000);
  if (status.online) {
    console.log(`[Ollama AI] ✓ Ollama Server đang trực tuyến (Model: ${config.ollama.model}).`);
    return true;
  }
  return await startOllamaServer();
}

/**
 * Gửi prompt tới Ollama để tạo tóm tắt bài học
 */
export async function generateLessonSummary(sessionTitle, lessonTitle, lessonContent) {
  const isReady = await checkOllamaConnection(2000);
  if (!isReady.online) {
    console.log('[Ollama AI] Bỏ qua tóm tắt AI do Ollama server đang offline.');
    return null;
  }

  console.log(`[Ollama AI] 🧠 Đang phân tích bài học "${lessonTitle}" qua mô hình ${config.ollama.model}...`);

  const prompt = `
Bạn là một trợ lý AI thông minh chuyên về Lập trình Front-end (HTML, CSS, JavaScript, DOM, Browser Storage).
Nhiệm vụ của bạn: Tóm tắt bài học sau đây của khóa học Rikkei Education thành ghi chú học tập ngắn gọn, súc tích.

---
Khóa học: [Tsubasa] Lập trình front-end cơ bản
Chương: ${sessionTitle}
Bài học: ${lessonTitle}
Nội dung trích xuất:
${lessonContent.slice(0, 4000)}
---

Yêu cầu định dạng đầu ra (Markdown):
# ${lessonTitle}
## 1. Khái niệm cốt lõi (Key Concepts)
- [Ghi các điểm chính]
## 2. Cú pháp & Ví dụ code mẫu (nếu có)
\`\`\`javascript
// code mẫu nếu có
\`\`\`
## 3. Lưu ý thực tế & Lỗi thường gặp
- [Lưu ý]
`;

  try {
    const res = await fetch(`${config.ollama.host}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: config.ollama.model,
        prompt: prompt,
        stream: false,
      }),
    });

    if (!res.ok) {
      throw new Error(`Ollama HTTP Error: ${res.status}`);
    }

    const data = await res.json();
    const summary = data.response;

    // Lưu vào thư mục notes
    if (!fs.existsSync(config.paths.notesDir)) {
      fs.mkdirSync(config.paths.notesDir, { recursive: true });
    }

    const safeFileName = `${sessionTitle}_${lessonTitle}`.replace(/[/\\?%*:|"<>]/g, '_').slice(0, 80) + '.md';
    const filePath = path.join(config.paths.notesDir, safeFileName);
    fs.writeFileSync(filePath, summary, 'utf-8');
    console.log(`[Ollama AI] ✓ Đã lưu ghi chú bài học vào: ${filePath}`);

    return summary;
  } catch (err) {
    console.error(`[Ollama AI] Lỗi khi tạo tóm tắt bài học: ${err.message}`);
    return null;
  }
}

/**
 * Trợ lý giải bài tập trắc nghiệm qua Ollama
 */
export async function solveQuizWithAI(questionText, options) {
  const isReady = await checkOllamaConnection(2000);
  if (!isReady.online) return null;

  const prompt = `
Hãy trả lời câu hỏi trắc nghiệm sau về Front-end Web Development:
Câu hỏi: ${questionText}
Các lựa chọn:
${options.map((opt, i) => `${i + 1}. ${opt}`).join('\n')}

Chỉ đưa ra số thứ tự của đáp án đúng nhất (ví dụ: 1 hoặc 2 hoặc 3 hoặc 4) kèm giải thích ngắn 1 dòng.
Định dạng:
DAP_AN: [Số thứ tự]
GIAI_THICH: [Lý do ngắn]
`;

  try {
    const res = await fetch(`${config.ollama.host}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: config.ollama.model,
        prompt: prompt,
        stream: false,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      return data.response;
    }
  } catch (err) {
    console.error(`[Ollama AI] Lỗi khi giải câu hỏi: ${err.message}`);
  }
  return null;
}
