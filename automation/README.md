# Hệ Thống Tự Động Hóa Học Tập Rikkei Portal Với Playwright & Ollama AI

Hệ thống được thiết kế chuyên biệt để tự động hóa toàn bộ quy trình từ đăng nhập, xử lý reCAPTCHA, định tuyến đến khóa học và hoàn thành các bài giảng từ **Session 17** trên nền tảng [Rikkei Portal](https://portal.rikkei.edu.vn/dangnhap).

---

## 🔄 CƠ CHẾ LÀM MỚI KHI TOKEN HẾT HẠN (Sau Tháng 09/2026)

Hệ thống đã được lập trình sẵn cơ chế **Tự Động Phát Hiện Phiên Hết Hạn (`checkIsLoggedIn`)**:
- Khi token hết hạn, bot sẽ nhận biết ngay lập tức và thông báo: `[Auth] Phiên cũ hết hạn, bắt đầu làm mới...`.

Để cấp lại token mới khi hết hạn, bạn có **3 cách cực kỳ đơn giản**:

### Cách 1: Để Bot Tự Động Đăng Nhập Lại (Khuyên dùng)
- Bạn chỉ cần chạy **[`CHAY_1_CLICK_TU_DONG.bat`](file:///d:/Rikkei-Bootcamp-Workspace/CHAY_1_CLICK_TU_DONG.bat)** như bình thường.
- Bot tự phát hiện session cũ hết hạn $\rightarrow$ Tự động điền lại Email, Mật khẩu $\rightarrow$ Click reCAPTCHA và lưu lại file `auth.json` mới!

### Cách 2: Mở Trình Duyệt Tự Đăng Nhập 1 Lần (10 Giây)
- Nhấp đúp **[`CHAY_HOC_TU_DONG.bat`](file:///d:/Rikkei-Bootcamp-Workspace/CHAY_HOC_TU_DONG.bat)** $\rightarrow$ Chọn mục **`[4]`**.
- Trình duyệt Chrome sẽ mở ra, bạn đăng nhập tài khoản như bình thường.
- Ngay khi vào Dashboard, hệ thống **tự động bắt Cookie mới** và lưu đè vào `auth.json`.

### Cách 3: Nạp Cookie Từ Tiện Ích Cookie-Editor
- Copy `access_token` mới từ trình duyệt và dán vào file `automation/cookies.json` $\rightarrow$ Chọn mục **`[5]`** trên Menu.

---

## 💾 Tính Năng Lưu Trữ Lịch Sử & Tiếp Nối Tiến Độ (Resume Feature)

Hệ thống được tích hợp sẵn bộ theo dõi tiến độ **`ProgressTracker`**:
- **Tự động lưu**: Sau khi hoàn thành mỗi bài học, bot tự động ghi nhận Session, Lesson, URL và thời gian vào file `storage_state/progress.json`.
- **Tự động tiếp nối (Smart Resume)**: Khi khởi động lại, bot đọc lịch sử gần nhất, hiển thị ngay trên Menu và **tự động tìm đúng bài học tiếp theo để học** mà không cần phải quét lại từ đầu trang.

---

## 📋 Bảng Điều Khiển Tương Tác (Interactive Menu)

Chỉ cần chạy file `CHAY_HOC_TU_DONG.bat` hoặc lệnh `npm start`:

```text
========================================================
📋 RIKKEI PORTAL AUTOMATION - BẢNG ĐIỀU KHIỂN TÁC VỤ
========================================================
🎯 TIẾN ĐỘ GẦN NHẤT: [Session 17] -> Lesson 10 (1 bài đã xong)
--------------------------------------------------------
 [1] 🚀 1-CLICK TỰ ĐỘNG TOÀN BỘ (Tự bật Ollama + Tự học tiếp)
 [2] 🧠 Khởi động / Khởi động lại Ollama AI Server
 [3] 🤖 Đăng nhập tự động & Vượt reCAPTCHA (Bot làm từ A-Z)
 [4] 🌐 Mở trình duyệt để TỰ ĐĂNG NHẬP (Tự động bắt Cookie)
 [5] 📥 Nạp Cookie từ file "automation/cookies.json"
 [6] 🎯 Học thử 1 bài học duy nhất (Kiểm tra Video & Ollama AI)
 [7] 📂 Xem danh sách ghi chú bài học AI đã tạo (notes/)
 [8] 📊 Xem / Đặt lại lịch sử tiến độ học (progress.json)
 [9] 🔍 Kiểm tra môi trường & Trạng thái hệ thống
 [0] ❌ Thoát chương trình
========================================================
```

---

## 🚀 2 Cách Khởi Chạy Nhanh Nhất (Chỉ Cần Double-Click)

1. **[`CHAY_1_CLICK_TU_DONG.bat`](file:///d:/Rikkei-Bootcamp-Workspace/CHAY_1_CLICK_TU_DONG.bat)**:
   *👉 Nhấp đúp là tự động chạy toàn bộ từ A-Z mà không cần phải bấm thêm bất kỳ nút nào.*
2. **[`CHAY_HOC_TU_DONG.bat`](file:///d:/Rikkei-Bootcamp-Workspace/CHAY_HOC_TU_DONG.bat)**:
   *👉 Nhấp đúp để mở Bảng điều khiển Menu nếu bạn muốn chọn tác vụ riêng lẻ.*
