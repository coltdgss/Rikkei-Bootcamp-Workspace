// ================================================================
// app.js  –  Quản Lý Học Viên
// Công nghệ : Vanilla JavaScript (không dùng thư viện ngoài)
// Lưu trữ  : localStorage (dữ liệu tồn tại khi tắt/mở lại tab)
//
// Luồng hoạt động tổng quát:
//   Trang load → đọc localStorage → render bảng
//   Người dùng thao tác → cập nhật mảng students
//                       → lưu lại localStorage
//                       → render lại bảng
// ================================================================


/* ================================================================
   PHẦN 1: DỮ LIỆU (STATE)
   Các biến lưu trạng thái hiện tại của ứng dụng
================================================================ */

/*
  STORAGE_KEY: Khóa (tên) để lưu dữ liệu vào localStorage
  localStorage hoạt động như một "từ điển": key → value
  Dùng hằng số (const) vì không bao giờ thay đổi
  Viết HOA theo quy ước đặt tên hằng số
*/
const STORAGE_KEY = 'danhSachHocVien';

/*
  editingId: Biến theo dõi người dùng đang làm gì với form
  ┌─────────────────────────────────────────────────────┐
  │  editingId = null  →  Đang ở chế độ THÊM MỚI        │
  │  editingId = 3     →  Đang SỬA học viên có id = 3   │
  └─────────────────────────────────────────────────────┘
  Nhờ biến này, nút "Lưu lại" biết nên thêm hay cập nhật
*/
let editingId = null;

/*
  students: Mảng chứa tất cả đối tượng học viên
  Mỗi học viên là 1 object có dạng:
  {
    id: 1,                        ← Số định danh duy nhất
    hoTen: 'Nguyễn Văn A',
    email: 'a@gmail.com',
    soDienThoai: '0901234567',
    queQuan: 'Hà Nội',
    gioiTinh: 'Nam'
  }

  Gọi loadStudents() ngay lúc khai báo để đọc dữ liệu cũ từ localStorage
  (nếu người dùng đã nhập liệu trước đó, dữ liệu sẽ được khôi phục)
*/
let students = loadStudents();

/*
  nextId: Biến đếm ID tiếp theo cần gán khi thêm học viên mới
  Tìm ID lớn nhất trong mảng hiện tại rồi cộng thêm 1
  → Đảm bảo ID không bao giờ bị trùng dù đã xóa học viên

  Cú pháp toán tử 3 ngôi (ternary):
    điều_kiện ? giá_trị_nếu_đúng : giá_trị_nếu_sai

  Math.max(...students.map(s => s.id)):
    students.map(s => s.id) → Lấy ra mảng các id: [1, 2, 5, 3]
    ...                      → Spread: trải mảng thành từng đối số riêng
    Math.max(1, 2, 5, 3)    → Tìm số lớn nhất = 5
    + 1                      → nextId = 6
*/
let nextId = students.length > 0
  ? Math.max(...students.map(s => s.id)) + 1
  : 1; // Nếu mảng rỗng thì bắt đầu từ 1


/* ================================================================
   PHẦN 2: LOCALSTORAGE HELPERS
   Hai hàm đọc/ghi dữ liệu vào bộ nhớ trình duyệt
================================================================ */

/*
  loadStudents(): Đọc dữ liệu từ localStorage khi trang mở
  ─────────────────────────────────────────────────────────
  localStorage chỉ lưu được CHUỖI (string), không lưu được mảng/object
  Vì vậy khi lưu: mảng → JSON.stringify() → chuỗi JSON → localStorage
  Khi đọc ra: chuỗi JSON → JSON.parse() → lại thành mảng
  ─────────────────────────────────────────────────────────
  localStorage.getItem(key):
    - Nếu key tồn tại → trả về chuỗi đã lưu
    - Nếu chưa có     → trả về null
*/
function loadStudents() {
  const raw = localStorage.getItem(STORAGE_KEY); // Đọc chuỗi JSON từ localStorage
  return raw ? JSON.parse(raw) : [];
  //           ↑ Nếu có dữ liệu: chuyển chuỗi JSON → mảng object
  //                              ↑ Nếu chưa có: trả về mảng rỗng
}

/*
  saveStudents(): Lưu mảng students vào localStorage
  Gọi hàm này MỖI KHI mảng students thay đổi (thêm/sửa/xóa)
  để dữ liệu không bị mất khi tắt trình duyệt
*/
function saveStudents() {
  // JSON.stringify(students): Chuyển mảng object → chuỗi JSON
  // Ví dụ: [{id:1, hoTen:'A'}] → '[{"id":1,"hoTen":"A"}]'
  localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
}


/* ================================================================
   PHẦN 3: VALIDATE DỮ LIỆU ĐẦU VÀO
   Kiểm tra tính hợp lệ trước khi lưu
================================================================ */

/*
  validateForm(): Kiểm tra tất cả các trường trong form
  Trả về true nếu tất cả hợp lệ, false nếu có ít nhất 1 lỗi

  Tại sao không dừng ngay khi gặp lỗi đầu tiên?
  → Vì muốn hiện TẤT CẢ lỗi cùng lúc để người dùng sửa 1 lần
  → Dùng cờ isValid để theo dõi, tiếp tục kiểm tra dù đã gặp lỗi
*/
function validateForm() {
  let isValid = true; // Cờ: giả sử hợp lệ, sẽ đặt thành false nếu gặp lỗi

  // Lấy giá trị các ô input, .trim() xóa khoảng trắng đầu/cuối
  // (tránh trường hợp người dùng nhập toàn dấu cách mà qua validate)
  const hoTen       = document.getElementById('hoTen').value.trim();
  const email       = document.getElementById('email').value.trim();
  const soDienThoai = document.getElementById('soDienThoai').value.trim();
  const queQuan     = document.getElementById('queQuan').value.trim();

  // ── Kiểm tra HỌ VÀ TÊN ──────────────────────────────────────
  if (hoTen === '') {
    // === '' : So sánh với chuỗi rỗng (sau khi đã trim())
    showError('hoTen', 'Họ và tên không được để trống');
    isValid = false; // Đặt cờ = false nhưng KHÔNG return, tiếp tục kiểm tra
  } else {
    clearError('hoTen'); // Hợp lệ: xóa thông báo lỗi cũ (nếu có)
  }

  // ── Kiểm tra EMAIL ───────────────────────────────────────────
  /*
    Regex (Regular Expression): Mẫu để kiểm tra định dạng chuỗi
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/  giải thích từng phần:
    ─────────────────────────────────────────────────────────────
    ^           → Bắt đầu chuỗi
    [^\s@]+     → 1 hoặc nhiều ký tự KHÔNG PHẢI khoảng trắng(\s) hay @
                  Đây là phần trước dấu @  (vd: "abc", "nguyen.van.a")
    @           → Dấu @ bắt buộc phải có
    [^\s@]+     → 1+ ký tự không phải khoảng trắng hay @
                  Đây là tên miền  (vd: "gmail", "rikkei")
    \.          → Dấu chấm (\ để escape, vì . trong regex nghĩa là "ký tự bất kỳ")
    [^\s@]{2,}  → 2+ ký tự không phải khoảng trắng hay @
                  Đây là đuôi miền (vd: "com", "vn", "edu.vn")
    $           → Kết thúc chuỗi
    ─────────────────────────────────────────────────────────────
    Hợp lệ  : abc@gmail.com  |  name@rikkei.edu.vn
    Không hợp lệ: abc@  |  @gmail.com  |  abcgmail.com
  */
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  if (email === '') {
    showError('email', 'Email không được để trống');
    isValid = false;
  } else if (!emailRegex.test(email)) {
    // .test(chuỗi): Trả về true nếu chuỗi khớp regex, false nếu không
    // ! đảo ngược: true→false, false→true → vào if khi KHÔNG khớp
    showError('email', 'Email không đúng định dạng (vd: abc@gmail.com)');
    isValid = false;
  } else {
    clearError('email');
  }

  // ── Kiểm tra SỐ ĐIỆN THOẠI VIỆT NAM ─────────────────────────
  /*
    Regex SĐT Việt Nam: /^(03|05|07|08|09)\d{8}$/
    ─────────────────────────────────────────────────────────────
    ^              → Bắt đầu chuỗi
    (03|05|07|08|09) → Phải bắt đầu bằng 1 trong các đầu số này:
                       03x (Viettel), 05x (Vietnamobile/Gmobile),
                       07x (Mobifone), 08x (Vinaphone), 09x (nhiều nhà mạng)
    \d{8}          → \d = chữ số (0-9), {8} = đúng 8 chữ số tiếp theo
    $              → Kết thúc chuỗi
    ─────────────────────────────────────────────────────────────
    Tổng: 2 chữ số đầu + 8 chữ số sau = 10 chữ số (chuẩn SĐT VN)
    Hợp lệ  : 0901234567  |  0371234567  |  0851234567
    Không hợp lệ: 01234567890 (11 số)  |  +84901234567  |  090123456 (9 số)
  */
  const phoneRegex = /^(03|05|07|08|09)\d{8}$/;

  if (soDienThoai === '') {
    showError('soDienThoai', 'Số điện thoại không được để trống');
    isValid = false;
  } else if (!phoneRegex.test(soDienThoai)) {
    showError('soDienThoai', 'SĐT phải đúng định dạng VN (vd: 0901234567)');
    isValid = false;
  } else {
    clearError('soDienThoai');
  }

  // ── Kiểm tra QUÊ QUÁN ────────────────────────────────────────
  if (queQuan === '') {
    showError('queQuan', 'Quê quán không được để trống');
    isValid = false;
  } else {
    clearError('queQuan');
  }

  return isValid; // true = tất cả hợp lệ, false = có ít nhất 1 lỗi
}

/*
  showError(fieldId, message): Hiện thông báo lỗi cho 1 trường
  ─────────────────────────────────────────────────────────────
  Tham số:
    fieldId  → ID của input cần báo lỗi (vd: 'hoTen', 'email')
    message  → Nội dung thông báo lỗi
  ─────────────────────────────────────────────────────────────
  Làm 2 việc:
    1. Thêm class 'input-error' vào ô input → CSS đổi viền sang đỏ
    2. Điền text lỗi vào <span id="err-fieldId">
*/
function showError(fieldId, message) {
  const input   = document.getElementById(fieldId);
  const errSpan = document.getElementById('err-' + fieldId);
  // 'err-' + 'hoTen' → 'err-hoTen' → tìm <span id="err-hoTen">

  if (input)   input.classList.add('input-error'); // Thêm class đỏ
  if (errSpan) errSpan.textContent = message;      // Hiện chữ lỗi
  // if (input) → Kiểm tra an toàn: chỉ làm nếu element tồn tại (tránh lỗi null)
}

/*
  clearError(fieldId): Xóa thông báo lỗi của 1 trường
  Gọi khi trường đó đã hợp lệ (ví dụ: người dùng đã điền đúng)
*/
function clearError(fieldId) {
  const input   = document.getElementById(fieldId);
  const errSpan = document.getElementById('err-' + fieldId);

  if (input)   input.classList.remove('input-error'); // Xóa class đỏ
  if (errSpan) errSpan.textContent = '';              // Xóa chữ lỗi
}

/*
  clearAllErrors(): Xóa lỗi của TẤT CẢ các trường
  Gọi khi reset form (sau khi lưu, hoặc khi bấm Hủy)
*/
function clearAllErrors() {
  // forEach: lặp qua mảng, gọi clearError() cho từng phần tử
  ['hoTen', 'email', 'soDienThoai', 'queQuan'].forEach(clearError);
}


/* ================================================================
   PHẦN 4: LẤY / ĐẶT GIÁ TRỊ FORM
   Các hàm tiện ích để đọc và ghi dữ liệu form
================================================================ */

/*
  getGioiTinh(): Lấy giá trị radio button Giới tính đang được chọn
  ─────────────────────────────────────────────────────────────────
  querySelectorAll('input[name="gioiTinh"]'):
    Tìm TẤT CẢ input có attribute name="gioiTinh"
    Trả về NodeList (giống mảng) gồm 2 radio: [radio_Nam, radio_Nu]
  ─────────────────────────────────────────────────────────────────
  Vòng lặp for...of: duyệt qua từng radio button
    r.checked: true nếu radio đó đang được chọn
    r.value  : giá trị ('Nam' hoặc 'Nữ')
*/
function getGioiTinh() {
  const radios = document.querySelectorAll('input[name="gioiTinh"]');
  for (const r of radios) {
    if (r.checked) return r.value; // Trả về giá trị của radio đang chọn
  }
  return 'Nam'; // Mặc định trả về 'Nam' nếu không radio nào checked (phòng hờ)
}

/*
  setGioiTinh(value): Chọn radio button theo giá trị cho trước
  Dùng khi điền form lúc edit: cần tick đúng radio tương ứng với dữ liệu
  ─────────────────────────────────────────────────────────────────
  r.checked = (r.value === value):
    Nếu value = 'Nữ':
      radio Nam: 'Nam' === 'Nữ' → false → không chọn
      radio Nữ : 'Nữ'  === 'Nữ' → true  → chọn ✓
*/
function setGioiTinh(value) {
  const radios = document.querySelectorAll('input[name="gioiTinh"]');
  radios.forEach(r => { r.checked = (r.value === value); });
}

/*
  resetForm(): Xóa sạch form và đặt lại về trạng thái "Thêm mới"
  Gọi sau khi: Lưu thành công | Bấm nút Hủy
*/
function resetForm() {
  // Xóa trắng các ô text
  document.getElementById('hoTen').value        = '';
  document.getElementById('email').value        = '';
  document.getElementById('soDienThoai').value  = '';
  document.getElementById('queQuan').value      = '';

  setGioiTinh('Nam'); // Trả radio về mặc định "Nam"
  clearAllErrors();   // Xóa hết thông báo lỗi

  // Đặt lại về chế độ "Thêm mới"
  editingId = null;
  document.getElementById('btnLuu').textContent     = '💾 Lưu lại';
  document.getElementById('btnHuy').style.display   = 'none'; // Ẩn nút Hủy
}

/*
  fillForm(student): Điền dữ liệu 1 học viên vào form
  Gọi khi người dùng bấm nút "Sửa" → cần điền thông tin cũ vào form
  Tham số student: object học viên { id, hoTen, email, ... }
*/
function fillForm(student) {
  document.getElementById('hoTen').value        = student.hoTen;
  document.getElementById('email').value        = student.email;
  document.getElementById('soDienThoai').value  = student.soDienThoai;
  document.getElementById('queQuan').value      = student.queQuan;
  setGioiTinh(student.gioiTinh); // Tick đúng radio Nam/Nữ
}


/* ================================================================
   PHẦN 5: RENDER BẢNG HỌC VIÊN
   Tạo HTML cho bảng từ mảng dữ liệu
================================================================ */

/*
  renderTable(list): Vẽ lại toàn bộ bảng từ đầu
  ─────────────────────────────────────────────────────────────────
  Tham số list: Mảng học viên cần hiển thị
    → Có thể là students (toàn bộ)
    → Hoặc kết quả sau lọc/sắp xếp
  ─────────────────────────────────────────────────────────────────
  Cách tiếp cận "render lại toàn bộ":
    Xóa sạch tbody → tạo lại tất cả hàng mới
    Ưu điểm: Đơn giản, dễ hiểu
    Nhược điểm: Chậm hơn nếu dữ liệu quá lớn (vài nghìn hàng)
    → Với bài học viên (< 100), cách này hoàn toàn ổn
*/
function renderTable(list) {
  const tbody    = document.getElementById('tbodyHocVien'); // Phần thân bảng
  const emptyMsg = document.getElementById('emptyMsg');     // Thông báo "chưa có học viên"

  tbody.innerHTML = ''; // Xóa toàn bộ hàng cũ trong tbody

  // Nếu danh sách rỗng: hiện thông báo, thoát khỏi hàm
  if (list.length === 0) {
    emptyMsg.style.display = 'block'; // Hiện thông báo
    return; // Dừng hàm, không làm gì thêm
  }

  emptyMsg.style.display = 'none'; // Ẩn thông báo (có dữ liệu rồi)

  /*
    forEach((student, index) => { ... }):
      Lặp qua từng học viên trong list
      student → object học viên hiện tại
      index   → vị trí trong mảng (0, 1, 2...)
      index + 1 → STT hiển thị (1, 2, 3...)
  */
  list.forEach((student, index) => {
    // Chọn class badge dựa vào giới tính (toán tử 3 ngôi)
    const badgeClass = student.gioiTinh === 'Nam' ? 'badge-nam' : 'badge-nu';

    // Tạo phần tử <tr> mới
    const row = document.createElement('tr');

    /*
      Template Literal (chuỗi mẫu): Dùng dấu backtick ` ` thay dấu nháy
      ${...}: Chèn giá trị biến vào giữa chuỗi
      Dễ đọc hơn nhiều so với nối chuỗi: '<td>' + index + '</td>'
    */
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${escapeHtml(student.hoTen)}</td>
      <td>${escapeHtml(student.email)}</td>
      <td>${escapeHtml(student.soDienThoai)}</td>
      <td>${escapeHtml(student.queQuan)}</td>
      <td><span class="badge ${badgeClass}">${student.gioiTinh}</span></td>
      <td>
        <button class="action-btn btn-edit"   onclick="handleEdit(${student.id})">✏️ Sửa</button>
        <button class="action-btn btn-delete" onclick="handleDelete(${student.id})">🗑️ Xoá</button>
      </td>
    `;
    /*
      onclick="handleEdit(${student.id})":
        Mỗi nút được gắn id cụ thể vào onclick
        Vd: onclick="handleEdit(3)" → khi bấm, gọi handleEdit với id=3
        Không dùng index vì index thay đổi khi xóa phần tử
        Dùng id cố định để luôn tìm đúng học viên
    */

    // Thêm hàng vừa tạo vào cuối tbody
    tbody.appendChild(row);
  });
}

/*
  escapeHtml(str): Chuyển đổi ký tự đặc biệt HTML → dạng an toàn
  ─────────────────────────────────────────────────────────────────
  Vì sao cần hàm này?
  Bảo vệ khỏi tấn công XSS (Cross-Site Scripting):
    Nếu ai nhập hoTen = '<script>alert("hack")</script>'
    Không escape → trình duyệt chạy script đó → nguy hiểm
    Có escape    → hiển thị thành chữ thường, vô hại

  Các ký tự cần escape:
    &  → &amp;   (phải escape trước để không escape nhầm &amp; thành &amp;amp;)
    <  → &lt;    (less than)
    >  → &gt;    (greater than)
    "  → &quot;  (quotation mark)
*/
function escapeHtml(str) {
  return String(str)              // Đảm bảo là string (phòng hờ nếu là số)
    .replace(/&/g, '&amp;')      // /&/g: tìm tất cả dấu & (g = global, không bỏ sót)
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}


/* ================================================================
   PHẦN 6: CÁC CHỨC NĂNG CHÍNH (Event Handlers)
   Các hàm được gọi khi người dùng tương tác với giao diện
================================================================ */

/* ────────────────────────────────────────────────────────────────
   6.1  handleLuu()  –  Xử lý khi bấm nút "Lưu lại" / "Cập nhật"
   Hoạt động 2 chế độ tùy theo editingId:
     editingId = null → THÊM MỚI học viên vào mảng
     editingId = <id> → CẬP NHẬT học viên đã có
──────────────────────────────────────────────────────────────── */
function handleLuu() {

  // Bước 1: Validate – nếu không hợp lệ thì DỪNG luôn, không làm gì thêm
  if (!validateForm()) return;
  // !validateForm(): Nếu hàm trả về false → !false = true → vào if → return

  // Bước 2: Đọc giá trị từ các ô input
  const hoTen       = document.getElementById('hoTen').value.trim();
  const email       = document.getElementById('email').value.trim();
  const soDienThoai = document.getElementById('soDienThoai').value.trim();
  const queQuan     = document.getElementById('queQuan').value.trim();
  const gioiTinh    = getGioiTinh(); // Lấy giá trị radio đang chọn

  if (editingId === null) {
    // ── CHẾ ĐỘ THÊM MỚI ──────────────────────────────────────────

    /*
      Tạo object học viên mới với id tự tăng
      nextId++: Lấy giá trị hiện tại của nextId, sau đó tăng 1
      Vd: nextId=3 → id được gán = 3, sau đó nextId = 4
    */
    const newStudent = {
      id: nextId++,
      hoTen,
      email,
      soDienThoai,
      queQuan,
      gioiTinh
      /*
        Shorthand property: hoTen thay vì hoTen: hoTen
        Khi tên biến = tên thuộc tính, có thể viết gọn
      */
    };

    students.push(newStudent); // Thêm vào cuối mảng students

  } else {
    // ── CHẾ ĐỘ CẬP NHẬT ──────────────────────────────────────────

    /*
      findIndex(): Tìm VỊ TRÍ (index) của phần tử thỏa điều kiện
      Trả về index (0, 1, 2...) nếu tìm thấy, hoặc -1 nếu không tìm thấy
      s => s.id === editingId: Hàm mũi tên (arrow function) – điều kiện tìm
    */
    const idx = students.findIndex(s => s.id === editingId);

    if (idx !== -1) {
      // Thay thế toàn bộ object tại vị trí idx bằng object mới
      // Giữ nguyên id (editingId), cập nhật tất cả trường còn lại
      students[idx] = {
        id: editingId,
        hoTen,
        email,
        soDienThoai,
        queQuan,
        gioiTinh
      };
    }
  }

  // Bước 3: Lưu mảng students đã cập nhật vào localStorage
  saveStudents();

  // Bước 4: Vẽ lại bảng với dữ liệu mới
  renderTable(students);

  // Bước 5: Xóa form, trả về trạng thái "Thêm mới"
  resetForm();

  // Bước 6: Xóa ô tìm kiếm (tránh hiển thị kết quả lọc cũ)
  document.getElementById('tuKhoa').value = '';
}


/* ────────────────────────────────────────────────────────────────
   6.2  handleDelete(id)  –  Xử lý khi bấm nút "Xóa"
   Tham số id: ID của học viên cần xóa
──────────────────────────────────────────────────────────────── */
function handleDelete(id) {

  // Tìm học viên trong mảng để lấy tên (dùng cho confirm)
  const hocVien = students.find(s => s.id === id);
  /*
    find(): Tìm PHẦN TỬ ĐẦU TIÊN thỏa điều kiện
    Trả về object học viên nếu tìm thấy, undefined nếu không
    (findIndex trả về số, find trả về phần tử)
  */
  if (!hocVien) return; // Phòng hờ: nếu không tìm thấy thì bỏ qua

  // Hộp thoại xác nhận – tránh xóa nhầm
  // Template literal để chèn tên học viên vào câu hỏi
  if (!confirm(`Bạn có chắc muốn xoá học viên "${hocVien.hoTen}"?`)) return;
  // confirm(): Hiện hộp thoại OK/Cancel
  //   OK     → trả về true  → !true = false  → không return, tiếp tục xóa
  //   Cancel → trả về false → !false = true  → return, hủy xóa

  /*
    filter(): Tạo MẢNG MỚI chỉ gồm các phần tử THỎA điều kiện
    s.id !== id: Giữ lại học viên có id KHÁC id cần xóa
    → Học viên có id trùng bị loại ra → hiệu quả xóa
    ─────────────────────────────────────────────────────────
    Lưu ý: Gán lại cho biến students (không sửa mảng gốc)
    Đây là cách "immutable update" – an toàn hơn splice()
  */
  students = students.filter(s => s.id !== id);

  saveStudents();    // Lưu lại sau khi xóa
  renderTable(students); // Vẽ lại bảng (học viên đã bị xóa không còn xuất hiện)

  // Nếu đang edit đúng học viên vừa bị xóa → reset form
  // (tránh trường hợp bấm Lưu lại cho học viên đã xóa)
  if (editingId === id) resetForm();
}


/* ────────────────────────────────────────────────────────────────
   6.3  handleEdit(id)  –  Xử lý khi bấm nút "Sửa"
   Điền dữ liệu học viên vào form để chỉnh sửa
──────────────────────────────────────────────────────────────── */
function handleEdit(id) {

  // Tìm học viên theo id
  const hocVien = students.find(s => s.id === id);
  if (!hocVien) return; // Không tìm thấy → bỏ qua

  // Lưu id đang edit vào biến toàn cục
  // handleLuu() sẽ đọc editingId để biết cần cập nhật (không phải thêm mới)
  editingId = id;

  fillForm(hocVien);  // Điền thông tin học viên vào các ô form
  clearAllErrors();   // Xóa lỗi cũ (nếu trước đó đã validate)

  // Cập nhật giao diện form sang chế độ "Cập nhật"
  document.getElementById('btnLuu').textContent   = '💾 Cập nhật'; // Đổi text nút
  document.getElementById('btnHuy').style.display = 'inline-block'; // Hiện nút Hủy

  // Cuộn trang lên đầu (form ở trên cùng) để người dùng nhìn thấy form
  window.scrollTo({ top: 0, behavior: 'smooth' });
  // behavior: 'smooth' → cuộn mượt (không nhảy cóc)
}


/* ────────────────────────────────────────────────────────────────
   6.4  handleHuy()  –  Xử lý khi bấm nút "Hủy"
   Hủy bỏ chỉnh sửa, trả form về trạng thái ban đầu
──────────────────────────────────────────────────────────────── */
function handleHuy() {
  resetForm();  // Xóa form, ẩn nút Hủy, đặt editingId = null

  // Xóa ô tìm kiếm và hiện lại toàn bộ danh sách
  document.getElementById('tuKhoa').value = '';
  renderTable(students);
}


/* ────────────────────────────────────────────────────────────────
   6.5  handleSapXep()  –  Sắp xếp danh sách học viên theo A→Z
──────────────────────────────────────────────────────────────── */
function handleSapXep() {
  /*
    [...students]: Spread operator – tạo bản SAO của mảng students
    Tại sao cần sao chép? Vì sort() SỬA TRỰC TIẾP mảng gốc
    Nếu dùng students.sort() → mảng gốc bị đảo thứ tự
    Dùng [...students].sort() → sắp xếp bản sao, mảng gốc không đổi
    (Ở đây thực ra ta muốn lưu lại thứ tự mới, nhưng là thói quen tốt)
  */
  const sorted = [...students].sort((a, b) =>
    /*
      localeCompare(): So sánh chuỗi theo ngôn ngữ (locale-aware)
      Tại sao không dùng a.hoTen < b.hoTen?
        → Không xử lý được tiếng Việt có dấu: â, ă, đ, ê, ô, ơ, ư...
        → VD: "An" < "Ân" sẽ sai nếu dùng so sánh thông thường

      localeCompare(chuỗi_so_sánh, ngôn_ngữ, tùy_chọn):
        'vi'                     → ngôn ngữ tiếng Việt
        { sensitivity: 'base' } → Bỏ qua hoa/thường và dấu khi so sánh thứ tự
        Trả về: âm số (<0) nếu a đứng trước b
                0          nếu bằng nhau
                dương số (>0) nếu a đứng sau b
    */
    a.hoTen.localeCompare(b.hoTen, 'vi', { sensitivity: 'base' })
  );

  renderTable(sorted); // Hiển thị danh sách đã sắp xếp

  // Lưu thứ tự mới vào mảng gốc và localStorage
  students = sorted;
  saveStudents();
}


/* ────────────────────────────────────────────────────────────────
   6.6  handleTimKiem()  –  Tìm kiếm học viên theo tên
   Được gọi realtime mỗi khi người dùng gõ vào ô tìm kiếm
──────────────────────────────────────────────────────────────── */
function handleTimKiem() {
  const tuKhoa = document.getElementById('tuKhoa').value
    .trim()       // Xóa khoảng trắng đầu/cuối
    .toLowerCase(); // Chuyển về chữ thường để so sánh không phân biệt hoa/thường

  // Nếu ô tìm kiếm rỗng → hiển thị lại toàn bộ danh sách
  if (tuKhoa === '') {
    renderTable(students);
    return;
  }

  /*
    filter(): Giữ lại học viên có tên CHỨA từ khóa
    .toLowerCase(): Cũng chuyển tên học viên về chữ thường
    .includes(tuKhoa): Kiểm tra chuỗi có chứa từ khóa không
    ─────────────────────────────────────────────────────────
    Ví dụ tìm "an":
      'Nguyễn Văn A'.toLowerCase() = 'nguyễn văn a' → không chứa 'an'
      'Nguyễn Văn An'.toLowerCase() = 'nguyễn văn an' → chứa 'an' ✓
      'An Văn Bình'.toLowerCase()   = 'an văn bình'  → chứa 'an' ✓
  */
  const ketQua = students.filter(s =>
    s.hoTen.toLowerCase().includes(tuKhoa)
  );

  // Render kết quả lọc (có thể là 0 kết quả → hiện "Chưa có học viên nào")
  renderTable(ketQua);
}


/* ================================================================
   PHẦN 7: KHỞI ĐỘNG ỨNG DỤNG (IIFE)
================================================================ */

/*
  IIFE = Immediately Invoked Function Expression
  Cú pháp: (function tênHàm() { ... })()
  Ý nghĩa: Định nghĩa hàm và GỌI NGAY LẬP TỨC

  Tại sao dùng IIFE thay vì gọi thẳng renderTable(students)?
  → Đây là code khởi động, bọc trong hàm để:
     1. Rõ ràng hơn: thấy tên "init" biết đây là bước khởi tạo
     2. Tách biệt logic: không làm "ô nhiễm" scope toàn cục
     3. Thói quen tốt cho dự án lớn hơn sau này

  Tại sao đặt ở CUỐI file?
  → Phải khai báo tất cả hàm và biến trước, rồi mới gọi
  → Thực ra với function declaration (function tênHàm(){}) thì
    JavaScript "hoisting" cho phép gọi trước khi khai báo,
    nhưng đặt cuối vẫn dễ đọc hơn
*/
(function init() {
  renderTable(students); // Vẽ bảng ngay khi trang load xong
})();
// ()   ← Dấu ngoặc gọi hàm ngay lập tức
