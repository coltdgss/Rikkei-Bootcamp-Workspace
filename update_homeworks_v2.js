const fs = require('fs');
const path = require('path');

const baseDir = 'D:\\Rikkei-Bootcamp-Workspace\\Rikkei-Bootcamp-Workspace\\Module_2_Database\\Session_01\\Lesson_1';

const btvnData = [
  {
    folder: 'BTVN_1_QuanLySinhVien',
    content: `# BTVN 1: Quản lý sản phẩm (Thực thể Sinh viên)
*Lưu ý: Đề bài ghi tiêu đề là "Quản lý sản phẩm" nhưng nội dung yêu cầu là "Sinh viên", nên bài này sẽ tập trung giải quyết về Sinh viên.*

## 1. Mục tiêu
- Hiểu khái niệm thực thể (Entity)
- Biết cách biểu diễn thuộc tính trong ERD

## 2. Mô tả & Yêu cầu
Nhà trường cần lưu trữ thông tin cơ bản của sinh viên để quản lý.

## 3. Phân tích thực thể
- **Thực thể:** \`SinhVien\`
- **Các thuộc tính cơ bản:**
  - \`ma_sinh_vien\` (Khóa chính - PK): Để phân biệt không ai giống ai.
  - \`ten_sinh_vien\`: Họ và tên.
  - \`ngay_sinh\`: Ngày tháng năm sinh.

## 4. Sơ đồ ERD
*(Sử dụng kiểu dữ liệu chuyên môn kèm giải thích tiếng Việt dân dã)*

\`\`\`mermaid
erDiagram
    SinhVien {
        VARCHAR ma_sinh_vien PK "Mã sinh viên (chuỗi ký tự)"
        VARCHAR ten_sinh_vien "Tên sinh viên (chuỗi ký tự)"
        DATE ngay_sinh "Ngày sinh (ngày tháng)"
    }
\`\`\`
`
  },
  {
    folder: 'BTVN_2_QuanLyMonHoc',
    content: `# BTVN 2: Quản lý môn học

## 1. Mục tiêu
- Rèn kỹ năng xác định thuộc tính cho thực thể
- Vẽ ERD đơn giản

## 2. Mô tả & Yêu cầu
Trường học cần lưu trữ thông tin các môn học được giảng dạy.

## 3. Phân tích thực thể
- **Thực thể:** \`MonHoc\`
- **Các thuộc tính cơ bản:**
  - \`ma_mon_hoc\` (Khóa chính - PK): Mã riêng của từng môn.
  - \`ten_mon_hoc\`: Tên môn (ví dụ: Toán, Lý).
  - \`so_tin_chi\`: Môn này nặng bao nhiêu tín chỉ.

## 4. Sơ đồ ERD

\`\`\`mermaid
erDiagram
    MonHoc {
        VARCHAR ma_mon_hoc PK "Mã môn học (chuỗi ký tự)"
        VARCHAR ten_mon_hoc "Tên môn học (chuỗi ký tự)"
        INT so_tin_chi "Số tín chỉ (số nguyên)"
    }
\`\`\`
`
  },
  {
    folder: 'BTVN_3_QuanLySinhVienLop',
    content: `# BTVN 3: Quản lý sinh viên và lớp học

## 1. Mục tiêu
- Làm quen với khái niệm thực thể và mối quan hệ
- Vẽ sơ đồ ERD đơn giản (Thể hiện đúng kiểu quan hệ 1-N)

## 2. Mô tả & Yêu cầu
Trường học cần lưu trữ thông tin sinh viên và lớp học. Mỗi sinh viên chỉ học một lớp, một lớp có thể có nhiều sinh viên.

## 3. Phân tích thực thể & Quan hệ
- **Thực thể 1:** \`LopHoc\` (Gồm: mã lớp, tên lớp).
- **Thực thể 2:** \`SinhVien\` (Gồm: mã sinh viên, tên sinh viên).
- **Mối quan hệ:** Quan hệ **1 - N** (1 Lớp có Nhiều Sinh viên). Ta cần mượn "mã lớp" đưa vào thông tin của Sinh viên để biết sinh viên đó thuộc lớp nào.

## 4. Sơ đồ ERD

\`\`\`mermaid
erDiagram
    LopHoc ||--o{ SinhVien : "có nhiều"
    
    LopHoc {
        VARCHAR ma_lop PK "Mã lớp (chuỗi ký tự)"
        VARCHAR ten_lop "Tên lớp (chuỗi ký tự)"
    }
    
    SinhVien {
        VARCHAR ma_sinh_vien PK "Mã sinh viên (chuỗi ký tự)"
        VARCHAR ten_sinh_vien "Tên sinh viên (chuỗi ký tự)"
        VARCHAR ma_lop FK "Thuộc lớp nào (khóa ngoại)"
    }
\`\`\`
`
  },
  {
    folder: 'BTVN_4_QuanLyThuVien',
    content: `# BTVN 4: Quản lý thư viện

## 1. Mục tiêu
- Hiểu quan hệ nhiều – nhiều (N – N)
- Vẽ ERD với 2 thực thể

## 2. Mô tả & Yêu cầu
Thư viện cần quản lý độc giả và sách. Một độc giả có thể mượn nhiều sách, một cuốn sách có thể được nhiều độc giả mượn.

## 3. Phân tích thực thể & Quan hệ
- **Thực thể 1:** \`DocGia\` (Mã độc giả, Tên độc giả).
- **Thực thể 2:** \`Sach\` (Mã sách, Tên sách).
- **Mối quan hệ:** Quan hệ **N - N** (Nhiều - Nhiều). Ở mức độ cơ bản, ta nối trực tiếp hai bảng này với nhau bằng ký hiệu N-N.

## 4. Sơ đồ ERD
*Ký hiệu \`}o--o{\` trong Mermaid đại diện cho quan hệ Nhiều-Nhiều (N-N).*

\`\`\`mermaid
erDiagram
    DocGia }o--o{ Sach : "mượn"
    
    DocGia {
        VARCHAR ma_doc_gia PK "Mã độc giả (chuỗi ký tự)"
        VARCHAR ten_doc_gia "Tên độc giả (chuỗi ký tự)"
    }
    
    Sach {
        VARCHAR ma_sach PK "Mã sách (chuỗi ký tự)"
        VARCHAR ten_sach "Tên sách (chuỗi ký tự)"
    }
\`\`\`
`
  },
  {
    folder: 'BTVN_5_QuanLyBanHang',
    content: `# BTVN 5: Quản lý Bán hàng

## 1. Mục tiêu
- Hiểu quy trình thiết kế CSDL
- Biết tách dữ liệu để tránh trùng lặp

## 2. Phân tích yêu cầu & Các bước thiết kế
Một cửa hàng cần quản lý việc bán sản phẩm cho khách hàng.

1. **Xác định thực thể:** 
   - \`KhachHang\` (Mã KH, Tên, Số điện thoại)
   - \`SanPham\` (Mã SP, Tên SP, Giá bán)
   - \`HoaDon\` (Mã Hóa đơn, Ngày mua, Tổng tiền). Do 1 khách mua nhiều lần nên hóa đơn cần lưu tách biệt.
   
2. **Xác định quan hệ (Chỉ rõ 1-N và N-N):**
   - **Khách hàng & Hóa đơn:** Quan hệ **1-N** (1 Khách hàng có thể có Nhiều Hóa đơn).
   - **Hóa đơn & Sản phẩm:** Bản chất là quan hệ **N-N** (1 Hóa đơn có Nhiều Sản phẩm, và 1 Sản phẩm có thể nằm trong Nhiều Hóa đơn).
   
3. **Tách dữ liệu tránh trùng lặp:**
   - Để giải quyết quan hệ N-N ở trên, ta bắt buộc phải sinh ra một bảng ở giữa gọi là \`ChiTietMuaHang\`.
   - Bảng này sẽ biến quan hệ N-N thành hai quan hệ 1-N: (Hóa đơn **1-N** Chi tiết mua hàng) và (Sản phẩm **1-N** Chi tiết mua hàng).

## 3. Sơ đồ ERD

\`\`\`mermaid
erDiagram
    KhachHang ||--o{ HoaDon : "mua"
    HoaDon ||--o{ ChiTietMuaHang : "gồm có"
    SanPham ||--o{ ChiTietMuaHang : "nằm trong"
    
    KhachHang {
        VARCHAR ma_khach PK "Mã khách (chuỗi ký tự)"
        VARCHAR ten_khach "Tên khách (chuỗi ký tự)"
        VARCHAR so_dien_thoai "Số điện thoại (chuỗi ký tự)"
    }
    
    SanPham {
        VARCHAR ma_san_pham PK "Mã sản phẩm (chuỗi ký tự)"
        VARCHAR ten_san_pham "Tên sản phẩm (chuỗi ký tự)"
        FLOAT gia_ban "Giá bán (số thập phân)"
    }
    
    HoaDon {
        VARCHAR ma_hoa_don PK "Mã hóa đơn (chuỗi ký tự)"
        DATE ngay_mua "Ngày mua (ngày tháng)"
        FLOAT tong_tien "Tổng tiền (số thập phân)"
        VARCHAR ma_khach FK "Thuộc khách nào (khóa ngoại)"
    }
    
    ChiTietMuaHang {
        VARCHAR ma_hoa_don PK, FK
        VARCHAR ma_san_pham PK, FK
        INT so_luong "Số lượng mua (số nguyên)"
    }
\`\`\`
`
  },
  {
    folder: 'BTVN_6_QuanLySinhVienMonHoc',
    content: `# BTVN 6: Quản lý Sinh viên – Môn học

## 1. Mục tiêu
- Hiểu vai trò của CSDL trong quản lý dữ liệu
- Xác định được thực thể (Entity), thuộc tính, mối quan hệ

## 2. Mô tả & Yêu cầu
Quản lý sinh viên và các môn học mà sinh viên đăng ký.
- Sinh viên: mã sinh viên, họ tên, ngày sinh, giới tính
- Môn học: mã môn, tên môn, số tín chỉ

## 3. Xác định Thực thể & Mối quan hệ
- **Bội số quan hệ:** 1 Sinh viên có thể đăng ký Nhiều Môn học, và 1 Môn học có Nhiều Sinh viên đăng ký. Đây là quan hệ **N-N**.
- **Cách giải quyết:** Khi gặp quan hệ N-N, ta phải đẻ ra một bảng phụ (bảng trung gian) tên là \`DangKyMonHoc\` để tách nó thành hai quan hệ **1-N**.

## 4. Sơ đồ ERD (Có Khóa chính PK)

\`\`\`mermaid
erDiagram
    SinhVien ||--o{ DangKyMonHoc : "đăng ký"
    MonHoc ||--o{ DangKyMonHoc : "có sinh viên"
    
    SinhVien {
        VARCHAR ma_sinh_vien PK "Mã sinh viên (chuỗi ký tự)"
        VARCHAR ho_ten "Họ tên (chuỗi ký tự)"
        DATE ngay_sinh "Ngày sinh (ngày tháng)"
        VARCHAR gioi_tinh "Giới tính (chuỗi ký tự)"
    }
    
    MonHoc {
        VARCHAR ma_mon_hoc PK "Mã môn (chuỗi ký tự)"
        VARCHAR ten_mon_hoc "Tên môn (chuỗi ký tự)"
        INT so_tin_chi "Số tín chỉ (số nguyên)"
    }
    
    DangKyMonHoc {
        VARCHAR ma_sinh_vien PK, FK
        VARCHAR ma_mon_hoc PK, FK
        VARCHAR hoc_ky "Học kỳ (chuỗi ký tự)"
    }
\`\`\`
`
  }
];

btvnData.forEach(item => {
  const folderPath = path.join(baseDir, item.folder);
  if (fs.existsSync(folderPath)) {
    fs.writeFileSync(path.join(folderPath, 'README.md'), item.content, 'utf8');
  }
});

console.log('Successfully updated all BTVN README files with professional terms and Vietnamese comments.');
