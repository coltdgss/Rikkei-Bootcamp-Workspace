SCSS mang đến các vũ khí hạng nặng như **Biến (Variables)**, **Hàm lồng (Nesting)** và đặc biệt là **Mixins**.

Dưới đây là bản nâng cấp toàn diện cho "Bí kíp Responsive", được thiết kế riêng cho combo HTML & SCSS.

````markdown
# 📌 BÍ KÍP CODE RESPONSIVE WEB (HTML & SCSS)

_Tài liệu tra cứu nhanh dành cho quá trình làm Front-end với SCSS_

---

## 1. ⚙️ CẤU HÌNH HTML BẮT BUỘC

Trong file `.html`, ở thẻ `<head>`, bạn luôn phải giữ thẻ Meta Viewport. Không có nó, mọi code SCSS/CSS Responsive của bạn đều vô nghĩa trên điện thoại.

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```
````

---

## 2. 🛠️ KHỞI TẠO SCSS: RESET & BIẾN (VARIABLES)

Thay vì nhớ từng con số `768px`, `1024px`, SCSS cho phép bạn lưu chúng thành biến số học (`$`) hoặc bản đồ (`map`). Hãy đặt đoạn này ở đầu file `.scss` chính của bạn (hoặc file `_variables.scss`).

### CSS Reset cơ bản

```scss
*,
*::before,
*::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
```

### Khai báo Breakpoints (Điểm ngắt màn hình)

```scss
// Quản lý mọi kích thước màn hình tại một nơi duy nhất
$breakpoints: (
  mobile: 576px,
  tablet: 768px,
  desktop: 1024px,
  large: 1440px,
);
```

---

## 3. 🪄 VŨ KHÍ BÍ MẬT CỦA SCSS: MIXIN MEDIA QUERY

Đây là tính năng "đáng đồng tiền bát gạo" nhất của SCSS khi làm Responsive. Thay vì viết lại dòng `@media (min-width: ...)` lặp đi lặp lại, bạn tạo một **Mixin**.

```scss
// Định nghĩa Mixin (Đặt ở đầu file hoặc file _mixins.scss)
@mixin respond-to($breakpoint-name) {
  // Lấy giá trị px từ map $breakpoints ở trên
  $width: map-get($breakpoints, $breakpoint-name);

  // Nếu tìm thấy tên breakpoint hợp lệ thì in ra @media
  @if $width {
    @media (min-width: $width) {
      @content; // Nội dung CSS bạn viết sẽ chui vào đây
    }
  } @else {
    @error "Không tìm thấy breakpoint có tên: #{$breakpoint-name}";
  }
}
```

---

## 4. 📐 TƯ DUY NESTING (LỒNG CODE) ĐỂ TẠO LAYOUT

Kết hợp **Mobile-First**, **Flexbox/Grid** và tính năng **Nesting (lồng nhau)** của SCSS cùng Mixin vừa tạo ở trên. Code của bạn sẽ đọc hiểu y như một câu chuyện.

```scss
.card-container {
  display: flex;
  flex-direction: column; // Dành cho Mobile: Xếp dọc
  gap: 1rem;
  padding: 1rem;

  // Gọi mixin cho Tablet trực tiếp bên trong class
  @include respond-to(tablet) {
    flex-direction: row; // Màn hình Tablet trở lên: Xếp ngang
    justify-content: space-between;
  }

  // Quản lý luôn các phần tử con (Nesting)
  .card-item {
    width: 100%; // Mobile: Chiếm full màn hình
    background-color: #f4f4f4;

    @include respond-to(desktop) {
      width: 30%; // Lên PC: Mỗi thẻ chiếm 30% để chia làm 3 cột
      transition: transform 0.3s ease;

      &:hover {
        transform: translateY(-5px); // Hiệu ứng hover chỉ có trên PC
      }
    }
  }
}
```

---

## 5. 📏 QUẢN LÝ KÍCH THƯỚC & TỶ LỆ

### Không dùng `px` cứng cho Box

```scss
.main-content {
  width: 100%;
  max-width: 1200px; // Web to đến mấy cũng chỉ dừng ở 1200px
  margin: 0 auto; // Căn giữa màn hình
}
```

### Xử lý Hình Ảnh (Fluid Images)

```scss
img,
video,
iframe {
  max-width: 100%;
  height: auto;
  display: block;
}
```

---

## 6. 🔠 BỐ CỤC CSS GRID VỚI SCSS

Dùng Grid kết hợp hàm `repeat` và `minmax` giúp bạn tự động Responsive chia cột mà thậm chí không cần dùng đến Mixin Media Query!

```scss
.product-grid {
  display: grid;
  // Tự động nhét số cột nhiều nhất có thể. Mỗi cột nhỏ nhất 250px, lớn nhất thì tự chia đều khoảng trống (1fr).
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}
```

---

## 7. 💡 MẸO LÀM VIỆC VỚI VS CODE CHO SCSS

1.  **Biên dịch SCSS:** Cài đặt extension **Live Sass Compiler** (của Glenn Marks). Bấm nút "Watch Sass" ở thanh status bar dưới cùng để nó tự động dịch file `.scss` thành `.css` mỗi khi bạn lưu file.
2.  **Chia nhỏ file:** Hãy tận dụng SCSS bằng cách chia nhỏ code thành nhiều file (ví dụ: `_variables.scss`, `_header.scss`, `_footer.scss`) rồi gom lại bằng lệnh `@import` (hoặc `@use` ở bản SASS mới) trong file `main.scss`. Tránh việc viết nghìn dòng code trong 1 file.

```

Việc áp dụng Mixin và Nesting trong SCSS sẽ giúp file code của bạn ngắn đi đáng kể và cực kỳ dễ tìm lỗi.

Bạn đã cài đặt công cụ nào (như extension Live Sass Compiler) để tự động dịch SCSS sang CSS trong VS Code chưa, hay bạn cần mình hướng dẫn cách thiết lập nó chạy mượt mà nhất?
```
