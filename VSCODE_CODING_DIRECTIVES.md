pip install pylintpylint rbw/# MIO & ANTIGRAVITY CODING DIRECTIVES (VS CODE CONTEXT)

# ABBREVIATION: RBW = Rikkei-Bootcamp-Workspace

> **Chú ý cho AI / Cursor / VS Code Copilot:** Bạn BẮT BUỘC phải đọc và tuân thủ tuyệt đối các quy tắc dưới đây trước khi thực hiện bất kỳ thay đổi mã nguồn nào trong không gian làm việc này.

---

## 1. GIAO THỨC PHÁT TRIỂN BẮT BUỘC (MANDATORY DEV PROTOCOL)

Mọi thay đổi mã nguồn đều bị khóa cứng bởi 3 nguyên tắc sau:

- **PRESERVE (BẢO TỒN):** Giữ nguyên 100% logic cốt lõi, tên biến, tên hàm và kiến trúc hệ thống hiện tại. Tuyệt đối KHÔNG xóa hoặc sửa đổi các thành phần đang hoạt động bình thường.
- **APPEND (THÊM MỚI):** Mọi tính năng mới, bản vá lỗi (bug fix) phải được thực hiện bằng cách viết thêm code mới (thêm vào cuối file, tạo hàm/module mới) và gọi vào logic cũ. Hạn chế tối đa việc can thiệp vào các khối logic cũ.
- **DO NOT REFACTOR (KHÔNG LÀM MỚI):** Tuyệt đối không tự ý "tối ưu hóa", "dọn dẹp" (clean up) hay thay đổi coding style của các file hiện có. **Ngoại lệ duy nhất:** Chỉ được phép refactor nếu User yêu cầu rõ ràng bằng lệnh "Hãy refactor...".

> ### ⚡ NGOẠI LỆ — MÔI TRƯỜNG HỌC TẬP: `Rikkei-Bootcamp-Workspace`
>
> Thư mục `Rikkei-Bootcamp-Workspace` chỉ phục vụ **mục tiêu học tập**, không có logic production cần bảo vệ.
> Ba nguyên tắc trên được **giảm nhẹ** như sau để tiết kiệm quota:
>
> | Nguyên tắc          | Chế độ Học Tập                                                                                  |
> | ------------------- | ----------------------------------------------------------------------------------------------- |
> | **PRESERVE**        | Chỉ áp dụng khi User KHÔNG yêu cầu viết lại. Nếu User muốn làm lại bài → AI được phép thay thế. |
> | **APPEND**          | Ưu tiên nhưng **không bắt buộc**. Nếu viết lại gọn hơn → được phép.                             |
> | **DO NOT REFACTOR** | **Được phép refactor** bất cứ lúc nào nếu phục vụ mục tiêu học.                                 |
>
> **Quota Rule cho Rikkei:** AI không cần viết CHANGE EXPLANATION 3 mục cho bài tập HTML/CSS đơn giản.
> Chỉ cần 1 dòng tóm tắt ngắn trong Chat là đủ.

---

## 2. CHỈ THỊ VỀ NGÔN NGỮ (LANGUAGE & ENCODING SAFETY - BACKEND/SCRIPTS)

> **Phạm vi áp dụng:** Code Backend (Python), Script (Bash, PowerShell) và CLI terminal. KHÔNG áp dụng cho mã nguồn Frontend (HTML/CSS/JS) tại thư mục RIKKEI (xem Mục 3).

- **Giao tiếp:** Giải thích, phân tích và chat với User hoàn toàn bằng **Tiếng Việt**.
- **Ngôn ngữ Code Backend/Script:** Khi sinh ra mã nguồn Python, shell scripts, các lệnh command line, comments trong các file này, tên file, tên biến... **TUYỆT ĐỐI CHỈ SỬ DỤNG TIẾNG ANH (Tiếng Anh thuần không dấu, ASCII)**.
- **An toàn Encoding:** KHÔNG được dùng ký tự có dấu (Unicode tiếng Việt) trong các đoạn text xuất ra console (như `print`), comment trong Script (`bat`, `sh`), hay docstrings để tránh lỗi UnicodeEncodeError trên môi trường Windows.
- **An toàn Đường dẫn (Path Escaping):** Mọi đường dẫn (Path) có chứa khoảng trắng (Ví dụ: `My Drive`, `Colab Notebooks`) khi đưa vào lệnh Terminal / Script / file `.bat` **BẮT BUỘC** phải được bọc trong cặp ngoặc kép `""` hoặc escape biến `\"%VAR%\"`.

---

## 3. RIKKEI WORKFLOW - PRE-CODE LOCK (ALL LANGUAGES: HTML/CSS/JS/PYTHON, ETC.)

> **[SYSTEM LOCK] Phạm vi áp dụng:** Quy tắc này áp dụng tuyệt đối cho TẤT CẢ các loại file mã nguồn (HTML, CSS, Javascript, Python, và các ngôn ngữ khác trong tương lai) tại thư mục `RIKKEI`. Việc quên quy tắc này sẽ phá hỏng cơ chế Dual Memory RAG của hệ thống.

- **Comment Song ngữ (LOCK-1):** MỌI thẻ, khối logic, hàm, biến, selector quan trọng phải được comment theo định dạng phù hợp với từng ngôn ngữ:
  - **HTML:** `<!-- <tên-thẻ/khối>: Kanji(Hiragana) (Giải nghĩa tiếng Việt của đoạn code  & nghĩa tiếng việt độc lập của tên hàm/biến/class) -->`
  - **CSS:** `/* <tên-selector>: Kanji(Hiragana) (Giải nghĩa tiếng Việt của đoạn code  & nghĩa tiếng việt độc lập của tên hàm/biến/class) */`
  - **Javascript:** `// <tên-hàm/biến>: Kanji(Hiragana) (Giải nghĩa tiếng Việt của đoạn code  & nghĩa tiếng việt độc lập của tên hàm/biến/class)`
  - **Python:** `# <tên-hàm/biến/class>: Kanji(Hiragana) (Giải nghĩa tiếng Việt của đoạn code  & nghĩa tiếng việt độc lập của tên hàm/biến/class)`
    _Ví dụ:_
  - `<!-- <main>: メイン(めいん) (Nội dung chính của trang) -->`
  - `<!-- <nav>: ナビゲーション要素(ようそ) (Menu điều hướng — phân biệt với dữ liệu chính) -->`
  - `<!-- <form>: フォーム(ふぉーむ) (Biểu mẫu nhập liệu từ người dùng) -->`
- **Giải thích 3 Điểm (LOCK-2):** Comment song ngữ trên phải giải quyết đủ 3 yếu tố và **được trình bày khoa học, ngắt dòng hợp lý**:
  1. **Chức năng (What):** Thẻ/Đoạn code này làm gì?
  2. **Lý do (Why):** Tại sao lại dùng ở đây? (giúp phân biệt với các thẻ tương tự)
  3. **Lưu ý (Note):** Điểm cần chú ý (nếu có) — Ví dụ: "chỉ dùng cho form", "phải có role=...", v.v.
     _Yêu cầu format (Chống cuộn ngang):_ Bắt buộc phải xuống dòng rõ ràng ở mỗi ý (1, 2, 3). Nếu nội dung giải thích của một ý quá dài, phải chủ động ngắt dòng (word wrap) ở độ dài vừa phải (khoảng 80-100 ký tự/dòng) để người dùng có thể đọc toàn bộ comment ngay trên màn hình mà không cần kéo thanh cuộn ngang (horizontal scroll).
- **Danh sách Kanji Tiêu chuẩn (Standard Kanji List):**
  | Thẻ HTML | Kanji(Hiragana) | Giải thích Tiếng Việt |
  |----------|-----------------|----------------------|
  | `<main>` | メイン(めいん) | Nội dung chính của trang |
  | `<header>` | ヘッダー(へっだー) | Đầu trang, phần trên cùng |
  | `<nav>` | ナビゲーション(ないびげーしょん) | Menu/thanh điều hướng |
  | `<section>` | セクション(せくしょん) | Khung/vùng chứa nội dung |
  | `<article>` | 記事(きじ) | Bài viết/nội dung độc lập |
  | `<aside>` | 脇(わき) | Thanh bên, nội dung phụ |
  | `<footer>` | フッター(ふったー) | Chân trang, phần dưới cùng |
  | `<form>` | フォーム(ふぉーむ) | Biểu mẫu nhập liệu |
  | `<button>` | ボタン(ぼたん) | Nút bấm |
  | `<input>` | 入力(にゅうりょく) | Ô nhập liệu |
  | `<table>` | テーブル(てーぶる) | Bảng dữ liệu |
  | `<ul>` | リスト(りすと) | Danh sách không thứ tự |
  | `<ol>` | 番号付きリスト(ばんごうつきりすと) | Danh sách có thứ tự |
  | `<blockquote>` | 引用(いんよう) | Đoạn trích dẫn |
  | `<a>` | アンカー(あんかー) | Liên kết/hyperlink |
- **Ưu tiên:** Sử dụng Semantic Tags chuẩn HTML5 (thay vì lạm dụng `<div>`) và dùng `<ruby><rt>` khi hiển thị Kanji trực tiếp lên UI.

---

## 4. AUTO-FIX, FAST RESUME & TÍCH HỢP LLM (RUNTIME MINDSET)

- **Fast Resume (Phục hồi nhanh):** Nếu hệ thống bị crash hoặc đứt đoạn, KHÔNG được làm lại từ đầu. Phải tự động kiểm tra các file `maf_run.log` hoặc `status.json` để biết tiến trình dừng ở đâu và tiếp tục (Resume) từ điểm đó.
- **Không bao giờ bỏ cuộc (Auto-Fix):** Khi chạy lệnh hoặc test mà gặp lỗi (exit code != 0), AI phải tự đọc log lỗi, tự tư duy tìm nguyên nhân, và tự sửa file lặp lại vòng lặp cho đến khi thành công. Không bao giờ dừng lại giữa chừng báo lỗi cho User mà chưa cố gắng tự sửa.
- **Cập nhật LLM API:** Không hard-code các model cũ. Mặc định ưu tiên `gemini-2.5-flash` hoặc quét version bằng lệnh `node -e "fetch('.../models')"` nếu gặp lỗi 404 Not Found Version thay vì tự đoán tên model.

## 5. LỆNH TÙY CHỈNH (CUSTOM COMMANDS)

- **TRƯỚC MỌI SỬA ĐỔI:** AI phải đọc và hiểu `VSCODE_CODING_DIRECTIVES.md` trong workspace hiện tại trước khi thực hiện bất kỳ thay đổi mã nguồn nào.
- **/rikkeicomment**: Khi User gõ lệnh này, AI BẮT BUỘC thực hiện quy trình sau:
  1. **Đọc Tracking:** Kiểm tra file `rkc_comment_tracking.json` trong thư mục gốc để xác định các file và vị trí đã được comment trước đó.
  2. **Quét & So sánh:** Quét toàn bộ mã nguồn (HTML, CSS, JS, Python, v.v.) trong folder Session đang làm việc. Chỉ tiến hành xử lý các file chưa có trong danh sách tracking hoặc các thẻ/khối mới chưa được comment.
  3. **Tạo Comment:** Thêm comment song ngữ kèm "Giải thích 3 Điểm" (nếu phức tạp) hoặc 1 dòng (nếu chuẩn) theo đúng quy luật.
  4. **Cập nhật Tracking:** Lưu lại thông tin các file đã xử lý vào `rkc_comment_tracking.json` kèm timestamp.
  5. **Báo cáo:** Giải thích ngắn gọn những gì đã làm và danh sách các file mới được comment cho User.

  **Format Comment Tự Động (Auto-Comment Template):**
  - HTML: `<!-- <tag-name>: Kanji(Hiragana) (Giải thích tiếng Việt) -->`
  - CSS: `/* .class-name: Kanji(Hiragana) (Giải thích tiếng Việt) */`
  - JavaScript: `// functionName: Kanji(Hiragana) (Giải thích tiếng Việt)`
  - Python: `# function_name: Kanji(Hiragana) (Giải thích tiếng Việt)`

  **Ví dụ cụ thể:**

  ```html
  <!-- <main>: メイン(めいん) (Nội dung chính của trang) -->
  <!-- <section>: セクション(せくしょん) (Khung hiển thị trích dẫn nổi bật) -->
  <!-- <h1>: ヘッダー1(へっだーわん) (Tiêu đề lớn của phần) -->
  <!-- <blockquote>: 引用(いんよう) (Đoạn trích dẫn chính) -->
  <!-- <a>: アンカー(あんかー) (Nút liên kết tới nội dung đọc thêm) -->
  <!-- <form>: フォーム(ふぉーむ) (Biểu mẫu nhập liệu từ người dùng) -->
  <!-- <button>: ボタン(ぼたん) (Nút bấm để gửi/xử lý form) -->
  <!-- <ul>: リスト(りすと) (Danh sách không thứ tự) -->
  <!-- <li>: リスト項目(りすとこうもく) (Mục trong danh sách) -->
  <!-- <table>: テーブル(てーぶる) (Bảng dữ liệu) -->
  ```

  **Quy tắc tạo comment (Comment Generation Rules):**
  1. **Chỉ comment các thẻ chính:** `<body>`, `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`, `<form>`, `<table>`, `<blockquote>`, `<div class="...">` (với class có nghĩa), `<ul>`, `<ol>`, `<li>` (khi cần nhấn mạnh), `<a>` (link quan trọng), `<button>`, `<input>`, v.v.
  2. **Bỏ qua:** các thẻ inline nhỏ như `<span>`, `<strong>`, `<em>`, `<p>` tùy ý (trừ khi cần giải thích đặc biệt).
  3. **Vị trí:** Comment phải được đặt **ngay trước thẻ mở** (opening tag) hoặc **trên cùng dòng** nếu muốn compact.
  4. **Giải thích 3 Điểm (Cấu trúc Khoa học & Chống cuộn ngang):** Mỗi comment phải trả lời và xuống dòng cho từng ý:
     - **1. Chức năng (What):** Thẻ này làm gì?
     - **2. Lý do (Why):** Tại sao lại dùng thẻ này ở đây? (khi cần)
     - **3. Lưu ý (Note):** Điểm cần chú ý gì? (nếu có)
       _(Bắt buộc tự động ngắt dòng nếu câu dài quá 80-100 ký tự để dễ đọc trên một màn hình)_
  5. **PRESERVE Logic:** KHÔNG xóa, sửa, hoặc di chuyển code hiện có. Chỉ thêm comment vào phía trước/trên các thẻ chưa có.

- **/rkc**: Lệnh viết tắt của `/rikkeicomment`. Thực hiện đầy đủ quy trình quét, tracking và comment như đã mô tả ở trên.

- **CHANGE EXPLANATION REQUIRED:** Mỗi khi AI sửa đổi mã nguồn trong workspace, AI PHẢI trả lời rõ trong Chat Agent với đủ 3 mục:
  1. **Đã sửa dòng code ở vị trí nào?** (File, phần code, hoặc số dòng gần đúng)
  2. **Sửa như thế nào?** (Mô tả ngắn gọn thay đổi thực tế)
  3. **Tại sao sửa?** (Lý do và mục đích của việc sửa)

  Mục đích: Giúp User hiểu rõ từng thay đổi và học được ý nghĩa của việc sửa code trong giao diện Chat.

> **Xác nhận (Required Acknowledgment):** Nếu AI đọc file này để thực hiện thay đổi mã nguồn, AI bắt buộc phải có suy nghĩ: _"Acknowledged: PRESERVE, APPEND, DO NOT REFACTOR"_ trước khi bắt đầu code.

---

## 6. QUY TẮC TỐI ƯU QUOTA (QUOTA OPTIMIZATION RULES)

> **Mục đích:** Giảm thiểu tiêu hao token cho các tác vụ không cần độ sâu phân tích cao, trong khi vẫn bảo toàn chất lượng RAG và tính nhất quán của directive.

### 6.1 Nguyên tắc "Minimalist Explanation" (Phân tầng Comment)

Không áp dụng "Giải thích 3 Điểm" một cách cứng nhắc cho mọi thẻ. Thay vào đó, phân tầng như sau:

- **Tầng 1 — Thẻ có trong Standard Kanji List (Mục 3):** Chỉ cần **1 dòng inline** với format chuẩn. Không cần giải thích thêm Why/Note.
  - _Ví dụ:_ `<!-- <header>: ヘッダー(へっだー) (Đầu trang, phần trên cùng) -->`
- **Tầng 2 — Thẻ tùy biến hoặc logic phức tạp:** BẮT BUỘC giữ nguyên "Giải thích 3 Điểm" (What, Why, Note) để đảm bảo chất lượng RAG.
  - _Ví dụ:_ `<div class="card-grid">`, `<section id="dynamic-content">`, v.v.

### 6.2 Phạm vi `/rikkeicomment` Tinh Gọn (Semantic Cấp 1 Ưu Tiên)

Mặc định lệnh `/rikkeicomment` chỉ bắt buộc comment các **thẻ Semantic cấp 1**. Các thẻ lồng sâu chỉ comment khi có logic phức tạp.

- **Cấp 1 (BẮT BUỘC comment):** `<body>`, `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`
- **Cấp 2+ (Chỉ comment khi phức tạp):** `<div>`, `<ul>`, `<ol>`, `<li>`, `<form>`, `<table>` và các thẻ lồng bên trong cấp 1.
- **Tiêu chí "phức tạp":** Thẻ có class/id mang logic nghiệp vụ, hoặc không thể hiểu chức năng chỉ qua tên thẻ đơn thuần.

### 6.3 Giới Hạn Auto-Fix Theo Loại Lỗi

Thay thế quy tắc "không bao giờ bỏ cuộc" bằng cơ chế phân loại lỗi để tránh vòng lặp vô tận:

- **Lỗi Logic/Code** (syntax error, sai tên hàm, sai biến): **Không giới hạn** số lần tự sửa — giữ nguyên tinh thần Rule 4.
- **Lỗi Hệ thống** (Network timeout, SSL/VPN failure, Permission denied, NTFS getmtime): **Tối đa 3 lần thử**. Sau 3 lần thất bại, AI phải:
  1. Dừng vòng lặp.
  2. Xuất toàn bộ log lỗi cuối cùng ra Chat.
  3. Chờ chỉ thị từ User — không tự ý thay đổi chiến lược xử lý.

### 6.4 Bỏ Qua CHANGE EXPLANATION cho "Tác Vụ Rác"

Các thao tác thuộc danh sách "Tác vụ rác" bên dưới **KHÔNG cần** áp dụng quy tắc CHANGE EXPLANATION 3 mục (Mục 5). Chỉ cần 1 dòng mô tả ngắn trong Chat.

**Danh sách "Tác vụ rác" (Trivial Tasks):**

- Format lại code (indent, spacing, căn lề)
- Fix lỗi cú pháp đơn giản (thiếu dấu `;`, `>`, ngoặc đóng)
- Sửa typo trong text hiển thị hoặc comment
- Thêm/xóa dòng trống
- Sắp xếp lại thứ tự attribute trong thẻ HTML
- Đổi tên file/folder theo yêu cầu trực tiếp của User

> **Lưu ý:** Nếu một "tác vụ rác" dẫn đến thay đổi logic hoặc cấu trúc không lường trước, AI phải tự động nâng cấp lên CHANGE EXPLANATION đầy đủ.
