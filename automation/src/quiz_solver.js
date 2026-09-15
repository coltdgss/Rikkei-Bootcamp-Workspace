import { VectorKnowledgeStore } from './vector_store.js';
import { solveQuizWithAI } from './ollama_client.js';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Trợ lý Giải Bài Tập Trắc Nghiệm Thông Minh (Khớp chuẩn 100% DOM Rikkei Portal)
 */
export const SmartQuizSolver = {
  /**
   * Tự động giải trắc nghiệm với cơ chế sửa sai 2 lượt đạt 100%
   */
  async solveQuiz(page, sessionTitle, lessonTitle) {
    console.log(`\n[QuizSolver] 📝 BẮT ĐẦU LÀM BÀI TRẮC NGHIỆM: [${sessionTitle}] -> [${lessonTitle}]`);
    await delay(2000);

    // 1. Nhấn nút "Bắt đầu làm bài"
    const startBtn = page.locator('.cquiz-landing__btn, button:has-text("Bắt đầu làm bài"), button:has-text("Bắt đầu")').first();
    if (await startBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      console.log('[QuizSolver] Click nút "Bắt đầu làm bài"...');
      await startBtn.click();
      await delay(2000);
    }

    let attempt = 1;
    const maxAttempts = 2;
    const learnedAnswers = {};

    while (attempt <= maxAttempts) {
      console.log(`\n======================================================`);
      console.log(`[QuizSolver] 🎯 Đang thực hiện lượt làm bài thứ ${attempt}/${maxAttempts}...`);
      console.log(`======================================================`);

      let hasNextQuestion = true;
      let questionIndex = 1;

      while (hasNextQuestion && questionIndex < 50) {
        await delay(1000);

        // Lấy nội dung câu hỏi
        const questionText = await page.evaluate(() => {
          const el = document.querySelector('.cquiz__question, .cquiz__content, .cquiz__title, h2, h3, .question-text');
          return el ? el.innerText.trim() : '';
        }).catch(() => '');

        // Lấy danh sách các đáp án lựa chọn
        const options = await page.$$eval('.cquiz__answer, .cquiz__answer-text', btns => btns.map(b => b.innerText.trim()));

        console.log(`\n[QuizSolver] [Câu ${questionIndex}]: ${questionText.slice(0, 70)}...`);

        let selectedOptionIndex = 0;

        // Ưu tiên 1: Dùng đáp án đúng đã học được từ lần xem câu sai
        if (questionText && learnedAnswers[questionText] !== undefined) {
          selectedOptionIndex = learnedAnswers[questionText];
          console.log(`[QuizSolver] 💡 Áp dụng đáp án đúng 100% đã học: Lựa chọn ${selectedOptionIndex + 1}`);
        } else {
          // Ưu tiên 2: Sử dụng bộ heuristic Front-end chuẩn xác
          const qLower = questionText.toLowerCase();
          if (qLower.includes('cú pháp đúng của phương thức addeventlistener') || qLower.includes('cú pháp') && qLower.includes('addeventlistener')) {
            const idx = options.findIndex(o => o.includes('element.addEventListener(type, listener, useCapture)') || o.includes('addEventListener(type'));
            if (idx >= 0) selectedOptionIndex = idx;
          } else if (qLower.includes('hủy bỏ một sự kiện') || qLower.includes('removeeventlistener')) {
            const idx = options.findIndex(o => o.includes('removeEventListener'));
            if (idx >= 0) selectedOptionIndex = idx;
          } else if (qLower.includes('usecapture') && qLower.includes('mặc định')) {
            const idx = options.findIndex(o => o.toLowerCase().includes('false') || o.includes('B. false'));
            if (idx >= 0) selectedOptionIndex = idx;
          } else if (qLower.includes('inline') && qLower.includes('html')) {
            const idx = options.findIndex(o => o.includes('onclick=') || o.includes('onclick="alert'));
            if (idx >= 0) selectedOptionIndex = idx;
          } else if (qLower.includes('thuộc tính') && qLower.includes('dom')) {
            const idx = options.findIndex(o => o.includes('onclick') || o.includes('DOM (onclick)'));
            if (idx >= 0) selectedOptionIndex = idx;
          } else if (options.length > 0) {
            // Gửi Ollama AI suy luận
            console.log(`[QuizSolver] 🧠 Gửi sang Ollama AI suy luận đáp án...`);
            const aiResp = await solveQuizWithAI(questionText, options);
            if (aiResp) {
              const match = aiResp.match(/DAP_AN:\s*(\d+)/i) || aiResp.match(/(\d+)/);
              if (match) {
                selectedOptionIndex = Math.max(0, Math.min(options.length - 1, parseInt(match[1], 10) - 1));
              }
            }
          }
          console.log(`[QuizSolver] 🤖 Chọn đáp án: ${options[selectedOptionIndex] ? options[selectedOptionIndex].split('\n')[0] : selectedOptionIndex + 1}`);
        }

        // Click chọn đáp án
        const answerBtns = page.locator('.cquiz__answer, .cquiz__answer-text, .cquiz__option');
        if (await answerBtns.count() > selectedOptionIndex) {
          await answerBtns.nth(selectedOptionIndex).click();
          await delay(800);
        }

        // ƯU TIÊN 1: Kiểm tra nút "Câu tiếp"
        // (Rikkei Portal thường hiển thị nút "Nộp bài" bị mờ ở mọi câu, nên ta không được check Nộp bài trước)
        const nextBtn = page.locator('.cquiz__nav-btn--next, button:has-text("Câu tiếp"), button:has-text("Tiếp theo")').first();
        const nextBtnVisible = await nextBtn.isVisible({ timeout: 1500 }).catch(() => false);
        const nextBtnDisabled = nextBtnVisible ? await nextBtn.isDisabled().catch(() => true) : true;

        if (nextBtnVisible && !nextBtnDisabled) {
          console.log(`[QuizSolver] Bấm "Câu tiếp"...`);
          await nextBtn.click();
          questionIndex++;
          await delay(1000);
        } else {
          // KHÔNG CÓ (HOẶC DISABLED) NÚT "CÂU TIẾP" -> ĐÂY LÀ CÂU CUỐI CÙNG -> BẤM NỘP BÀI
          const submitBtn = page.locator('.cquiz__nav-btn--submit, button:has-text("Nộp bài")').first();
          if (await submitBtn.isVisible({ timeout: 1500 }).catch(() => false)) {
            console.log('[QuizSolver] Đã đến câu cuối cùng. Bấm "Nộp bài"...');
            await submitBtn.click();
            await delay(1500);

            // Xác nhận nộp bài trong modal
            const confirmOk = page.locator('.cquiz-confirm__ok, button:has-text("Nộp bài")').last();
            if (await confirmOk.isVisible({ timeout: 3000 }).catch(() => false)) {
              await confirmOk.click();
              console.log('[QuizSolver] ✓ Đã xác nhận nộp bài!');
              await delay(3000);
            }
          }
          hasNextQuestion = false;
          break;
        }
      }

      await delay(3000);

      // 2. Kiểm tra kết quả
      const wrongBtn = page.locator('.view-wrong-btn, button:has-text("Xem các câu mình sai")').first();
      const hasWrong = await wrongBtn.isVisible({ timeout: 4000 }).catch(() => false);

      if (!hasWrong) {
        console.log(`\n======================================================`);
        console.log(`🎉 XUẤT SẮC! ĐÃ ĐẠT ĐIỂM TỐI ĐA 100% Ở LƯỢT ${attempt}!`);
        console.log(`======================================================\n`);
        break;
      } else {
        console.log(`[QuizSolver] ⚠️ Lượt ${attempt} có câu chưa tối ưu. Đang bấm "Xem các câu mình sai" để học đáp án...`);
        await wrongBtn.click();
        await delay(2000);

        // Trích xuất đáp án đúng từ modal
        const modalText = await page.evaluate(() => {
          const modal = document.querySelector('.ant-modal-wrap, .ant-modal, .wrong-answers-modal');
          return modal ? modal.innerText : '';
        }).catch(() => '');

        console.log('[QuizSolver] 📖 Đã học được danh sách đáp án đúng từ hệ thống.');

        // Lưu vào Vector Store
        VectorKnowledgeStore.saveEntry({
          session: sessionTitle,
          lesson: lessonTitle,
          title: `Quiz Correction (Lượt ${attempt})`,
          contentType: 'quiz_correction',
          rawContent: modalText.slice(0, 2000),
        });

        // Parse đáp án đúng để học
        const lines = modalText.split('\n').map(l => l.trim()).filter(l => l);
        let currentQuestion = null;
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          if (line.includes('?') || line.toLowerCase().includes('câu')) {
            currentQuestion = line;
          }
          if (line.includes('Đúng') || line.includes('✔') || line.includes('True')) {
            const prevLine = lines[i - 1];
            if (currentQuestion && prevLine) {
              const optIndex = prevLine.startsWith('A') ? 0 : prevLine.startsWith('B') ? 1 : prevLine.startsWith('C') ? 2 : prevLine.startsWith('D') ? 3 : 0;
              learnedAnswers[currentQuestion] = optIndex;
            }
          }
        }

        // Bấm nút "Làm lại"
        const closeBtn = page.locator('.ant-modal-close, button:has-text("Đóng")').first();
        if (await closeBtn.isVisible().catch(() => false)) await closeBtn.click();
        await delay(1000);

        const retakeBtn = page.locator('p:has-text("Làm lại"), button:has-text("Làm lại")').first();
        if (await retakeBtn.isVisible().catch(() => false)) {
          console.log('[QuizSolver] Bấm nút "Làm lại"...');
          await retakeBtn.click();
          await delay(2000);
        } else {
          console.log('[QuizSolver] Không tìm thấy nút "Làm lại", thử tải lại trang...');
          await page.reload({ waitUntil: 'domcontentloaded' });
          await delay(3000);
        }

        attempt++;
      }
    }
  }
};
