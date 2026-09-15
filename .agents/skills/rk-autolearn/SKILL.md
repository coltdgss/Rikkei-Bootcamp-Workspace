---
name: rk-autolearn
description: >-
  Các lệnh và quy trình liên quan đến tự khởi động hệ thống học, quản lý vòng lặp tự động (Module 1, Module 2) và kiểm soát trình duyệt ảo cho dự án Rikkei.
---

# /rk-autolearn — Rikkei Auto-Learn System

Kỹ năng này bao gồm các quy trình chuẩn để khởi động, theo dõi, và quản lý hệ thống tự động học (Auto-Learn Engine).

## 🚀 Các lệnh kích hoạt nhanh (Quick Launch)

- **Module 1 (1 Click):** Sử dụng file `CHAY_1_CLICK_TU_DONG.bat`
- **Module 1 (Vòng lặp):** Sử dụng file `CHAY_VONG_LAP.bat`
- **Module 2 (1 Click):** Sử dụng file `CHAY_MODULE_2_1_CLICK.bat`
- **Module 2 (Vòng lặp):** Sử dụng file `CHAY_MODULE_2_VONG_LAP.bat`

## ⚙️ Quy trình xử lý lỗi (Troubleshooting Protocol)

Khi người dùng báo lỗi liên quan đến quá trình auto-learn (ví dụ: bot đứng im, không cuộn được, không ấn được video), áp dụng tiêu chuẩn L0-L4 từ `/rk-tk`:

1. **[L0] Khám phá:** Bắt buộc thu thập dữ liệu cấu trúc DOM mới nhất bằng Playwright script (xuất ra `storage_state/diagnostic.json`) trước khi đưa ra kết luận. KHÔNG ĐƯỢC đoán mò.
2. **[L1] Sửa đổi:** Cập nhật các selectors trong `src/learner.js`, `src/quiz_solver.js` nếu cấu trúc UI của Rikkei Portal thay đổi.
3. **Validation:** Bắt buộc chạy script debug nội bộ (ví dụ `src/debug_mod2_learner.js`) và theo dõi log để đảm bảo lỗi đã được fix hoàn toàn trước khi báo cáo người dùng.

## 🛠️ Cấu trúc lõi (Core Architecture)

- `src/config.js`: Định cấu hình URL khóa học, tọa độ click, thời gian chờ.
- `src/learner.js`: Engine chính, phụ trách cuộn chuột, mở Accordion, quét DOM tìm badge "Chưa hoàn thành".
- `src/quiz_solver.js`: Xử lý bài tập trắc nghiệm (ưu tiên nút "Câu tiếp", đảm bảo trả lời đủ 5 câu trước khi nộp).
- `src/navigator.js`: Điều hướng URL.
