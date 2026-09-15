📚 PHÂN TÍCH ĐỀ BÀI
Đề bài yêu cầu làm Quản Lý Học Viên với 7 chức năng. Hãy chia nhỏ ra:

🧩 PHẦN 1 – Cấu trúc Project
HN_JS220313_BS_TenBan/
├── index.html       ← Giao diện chính
├── style.css        ← CSS trang trí
└── app.js           ← Toàn bộ logic JavaScript

🧩 PHẦN 2 – Tư duy từng chức năng
✅ Chức năng 1: Mảng students + LocalStorage

Khai báo mảng students = []
Mỗi học viên là 1 object: { id, hoTen, email, soDienThoai, queQuan, gioiTinh }
Lưu vào localStorage bằng JSON.stringify, đọc ra bằng JSON.parse

✅ Chức năng 2: Thêm học viên

Lấy giá trị từ form → validate → push vào students → lưu localStorage → render bảng

✅ Chức năng 3: Xóa học viên

Dùng filter() loại bỏ phần tử có id tương ứng → lưu lại → render lại

✅ Chức năng 4: Sửa học viên

Click edit → điền dữ liệu vào form → đổi nút "Lưu lại" sang chế độ update → lưu → render lại

✅ Chức năng 5: Sắp xếp A-Z

Dùng sort() theo hoTen → render lại bảng

✅ Chức năng 6: Tìm kiếm

Dùng filter() lọc theo tên → render kết quả

✅ Chức năng 7: Validate
TrườngQuy tắcHọ tênKhông được rỗngEmailRegex: @ và . đúng định dạngSố điện thoạiBắt đầu 03/05/07/08/09, đủ 10 sốQuê quánKhông được rỗngGiới tínhDefault = Nam

💻 CODE HOÀN CHỈNH
Bây giờ tôi sẽ tạo đầy đủ 3 file cho bạn:3個のファイルを作成しました, ファイルを表示しました, コマンドを実行しました3個のファイルを作成しました, ファイルを表示しました, コマンドを実行しました
📖 GIẢI THÍCH CÁC KHÁI NIỆM QUAN TRỌNG BẠN CẦN NẮM
🔑 1. Tại sao dùng id thay vì index?
Khi bạn xoá 1 phần tử, index thay đổi, nhưng id thì không. Dùng id để tìm/sửa/xoá là an toàn nhất.
jsstudents.find(s => s.id === id)      // tìm
students.filter(s => s.id !== id)    // xoá (loại ra)
students.findIndex(s => s.id === id) // tìm vị trí để sửa
🔑 2. Tại sao dùng biến editingId?
Cùng 1 nút "Lưu lại", nhưng có 2 nhiệm vụ:

editingId === null → thêm mới
editingId === 5 → cập nhật học viên id=5

🔑 3. Regex validate
js/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/ // Email
/^(03|05|07|08|09)\d{8}$/        // SĐT Việt Nam 10 số
🔑 4. LocalStorage
jslocalStorage.setItem(key, JSON.stringify(mảng)) // Lưu
JSON.parse(localStorage.getItem(key))           // Đọc ra



_______________________________________________



📄 index.html — Comment giải thích
Cụm codeGiải thích thêm<!DOCTYPE html>Khai báo chuẩn HTML5lang="vi"Khai báo ngôn ngữ tiếng Việtmeta charset, viewportMã hóa ký tự + cấu hình mobile<script src="app.js"> ở cuối bodyTại sao không để trong <head> — vì HTML phải load xong thì JS mới tìm được elementfor="hoTen" trong labelClick label = click vào inputoninput vs onclickoninput chạy realtime, không cần bấm nútstyle="display:none" trên nút HủyẨn mặc định, JS bật lên khi edit

🎨 style.css — Comment giải thích
Cụm codeGiải thích thêmbox-sizing: border-boxTại sao phải reset — tránh padding làm tràn layout:root { --primary: ... }CSS Variables — khai báo một lần, dùng khắp nơidisplay: grid + 1frCSS Grid 2 cột, 1fr là gì@media (max-width: 900px)Responsive — màn hình nhỏ đổi sang 1 cộttransition: 0.2sHiệu ứng mượt khi hover/focus:focusKhi nào CSS này kích hoạt.input-errorClass JS thêm vào khi validate lỗi

⚙️ app.js — Comment giải thích
Cụm codeGiải thích thêmeditingIdTại sao cần biến này — cùng 1 nút "Lưu" làm 2 việcMath.max(...students.map(...))Spread + map kết hợp như thế nàoJSON.stringify / JSON.parselocalStorage chỉ lưu được chuỗiRegex email + SĐTGiải thích từng ký tự trong patternfind vs findIndex vs filter3 hàm mảng hay dùng nhất[...students].sort()Tại sao phải spread trước khi sortlocaleCompare('vi')Tại sao không dùng < để sort tiếng ViệtIIFE (function init(){})()Pattern khởi động ứng dụng



