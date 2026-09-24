<BOOTSTRAP>

1. Cách nhanh nhất: Sử dụng CDN (Content Delivery Network)
   Đây là cách "mì ăn liền", bạn chỉ cần chèn 2 đoạn mã vào file HTML là có thể chạy ngay mà không cần tải bất cứ thứ gì về máy.

Bước 1: Chèn CSS vào trong thẻ <head>:

HTML

<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
Bước 2: Chèn JavaScript vào cuối thẻ <body> (ngay trước thẻ đóng </body>):

HTML

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>

2. Cách dành cho lập trình viên (Dùng Local & NPM)
   Vì bạn đang làm các dự án lớn như G-SS và MIO, việc dùng CDN có thể gây phụ thuộc vào internet. Cách tốt nhất là cài đặt trực tiếp vào thư mục dự án:

Tải về: Bạn vào Trang chủ Bootstrap tải file CSS/JS về rồi link vào HTML.

Sử dụng NPM (Khuyên dùng): Nếu bạn dùng Node.js để quản lý dự án:

Bash
npm install bootstrap 3. Cấu trúc một File HTML chuẩn Bootstrap 5
Dưới đây là khung xương (Skeleton) mà bạn nên dùng để bắt đầu:

HTML

<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dự án của Trung</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>

    <div class="container mt-5">
        <h1 class="text-center text-primary">Hệ thống Quản lý G-SS</h1>
        <p class="lead">Chào mừng Trung quay trở lại với dự án!</p>

        <button class="btn btn-success">Thêm Học Sinh Mới</button>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>

</body>
</html>
4. Các "Từ khóa" quan trọng nhất bạn cần nhớ
Để sử dụng Bootstrap thành thạo, bạn không cần học thuộc lòng, chỉ cần nắm vững 3 nhóm class này:

Bố cục (Grid System): Luôn bắt đầu bằng .container, sau đó đến .row (hàng) và các .col-xx (cột). Tổng số cột trong một hàng luôn là 12.

Tiện ích (Utilities): \* m- (margin), p- (padding). Ví dụ: mt-3 là margin-top mức 3.

text- (màu chữ, căn lề). Ví dụ: text-center, text-danger (màu đỏ).

bg- (màu nền). Ví dụ: bg-dark, bg-light.

Thành phần (Components): .btn, .card, .navbar, .modal.
