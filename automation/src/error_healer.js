import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from './config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIAGNOSIS_LOG_PATH = path.resolve(__dirname, '../storage_state/error_diagnosis_log.json');

/**
 * Hệ thống Tự Động Phân Tích Lỗi & Đưa Ra Phương Án Sửa Chữa (Self-Healing & Diagnostic Engine)
 */
export const ErrorHealer = {
  /**
   * Phân tích sâu nguyên nhân lỗi từ ngữ cảnh trình duyệt và ngoại lệ
   */
  async analyzeAndHeal({ error, iteration, page, context }) {
    console.log(`\n================================================================`);
    console.log(`🩺 [AI DIAGNOSTIC] PHÂN TÍCH NGUYÊN NHÂN LỖI - VÒNG LẶP ${iteration}`);
    console.log(`================================================================`);

    const errorMessage = error ? error.message : 'Lỗi không xác định';
    const errorStack = error ? error.stack : '';
    let currentUrl = 'Không rõ';
    let screenshotPath = null;

    try {
      if (page && !page.isClosed()) {
        currentUrl = page.url();
        // Chụp ảnh màn hình lỗi để đối chiếu
        const snapshotDir = path.resolve(__dirname, '../storage_state/snapshots');
        if (!fs.existsSync(snapshotDir)) fs.mkdirSync(snapshotDir, { recursive: true });
        
        screenshotPath = path.join(snapshotDir, `error_iter_${iteration}.png`);
        await page.screenshot({ path: screenshotPath, fullPage: false }).catch(() => {});
      }
    } catch (e) {}

    // Phân loại mã lỗi và xây dựng phương án khắc phục tự động
    let rootCause = 'Không xác định được nguyên nhân cụ thể';
    let healingAction = 'Khởi động lại trình duyệt và dọn dẹp bộ nhớ đệm';
    let errorCategory = 'UNKNOWN_ERROR';
    let autoAppliedFix = null;

    if (errorMessage.includes('stale') || errorMessage.includes('not attached') || errorMessage.includes('Target closed')) {
      errorCategory = 'DOM_STALE_ELEMENT';
      rootCause = 'Phần tử bài học bị hủy khi trang điều hướng hoặc danh sách DOM được tải lại.';
      healingAction = 'Tự động kích hoạt cơ chế Dynamic Re-Query: Luôn truy vấn lại selector tươi mới trước khi click.';
      autoAppliedFix = 'ENABLE_DYNAMIC_REQUERY';
    } else if (errorMessage.includes('timeout') || errorMessage.includes('waiting for selector')) {
      errorCategory = 'SELECTOR_TIMEOUT';
      rootCause = 'Trang tải chậm hoặc phần tử (Video/Bài đọc/Quiz) nằm trong iframe chưa kịp nạp vào DOM.';
      healingAction = 'Tăng thời gian timeout từ 10s lên 25s và áp dụng ScrollIntoView bắt buộc.';
      autoAppliedFix = 'EXTEND_TIMEOUT_AND_FORCE_SCROLL';
    } else if (currentUrl.includes('/dangnhap') || errorMessage.includes('recaptcha')) {
      errorCategory = 'AUTH_CAPTCHA_REQUIRED';
      rootCause = 'Phiên đăng nhập bị gián đoạn hoặc Google yêu cầu xác thực lại.';
      healingAction = 'Nạp lại cookie sạch từ auth.json hoặc kích hoạt bộ giải reCAPTCHA tự động.';
      autoAppliedFix = 'RELOAD_AUTH_STATE';
    } else if (errorMessage.includes('Navigation') || errorMessage.includes('net::ERR')) {
      errorCategory = 'NETWORK_INSTABILITY';
      rootCause = 'Kết nối mạng tới portal.rikkei.edu.vn bị nghẽn hoặc ngắt quãng.';
      healingAction = 'Tạm dừng 5 giây để mạng ổn định, sau đó tự động reload trang khóa học.';
      autoAppliedFix = 'NETWORK_COOL_DOWN_RETRY';
    } else {
      errorCategory = 'RUNTIME_FLOW_INTERRUPT';
      rootCause = `Ngoại lệ trong quá trình thực thi: ${errorMessage.slice(0, 120)}`;
      healingAction = 'Đặt lại trạng thái DOM, dọn dẹp Chromium Zombie và thử lại ở bài học tiếp theo.';
      autoAppliedFix = 'RESET_DOM_AND_ZOMBIE_KILL';
    }

    console.log(`- 🔍 Phân loại lỗi: [${errorCategory}]`);
    console.log(`- 🌐 URL lúc bị lỗi: ${currentUrl}`);
    console.log(`- ⚠️ Nguyên nhân gốc rễ: ${rootCause}`);
    console.log(`- 🛠️ Phương án sửa chữa: ${healingAction}`);
    if (screenshotPath) {
      console.log(`- 📸 Đã chụp ảnh màn hình lỗi: ${screenshotPath}`);
    }
    console.log(`================================================================\n`);

    // Lưu vào file nhật ký chẩn đoán
    const logEntry = {
      iteration,
      timestamp: new Date().toISOString(),
      errorCategory,
      errorMessage,
      currentUrl,
      rootCause,
      healingAction,
      autoAppliedFix,
      screenshotPath
    };

    let existingLogs = [];
    if (fs.existsSync(DIAGNOSIS_LOG_PATH)) {
      try {
        existingLogs = JSON.parse(fs.readFileSync(DIAGNOSIS_LOG_PATH, 'utf-8'));
      } catch (e) {}
    }

    existingLogs.push(logEntry);
    fs.writeFileSync(DIAGNOSIS_LOG_PATH, JSON.stringify(existingLogs, null, 2), 'utf-8');

    return logEntry;
  }
};
