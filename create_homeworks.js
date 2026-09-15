const fs = require('fs');
const path = require('path');

const baseDir = 'D:\\Rikkei-Bootcamp-Workspace\\Rikkei-Bootcamp-Workspace\\Module_2_Database\\Session_01\\Lesson_1';

const btvnData = [
  {
    folder: 'BTVN_1_QuanLySinhVien',
    content: `# BTVN 1: Quản lý sản phẩm (Thực thể SinhVien)

## 1. Mục tiêu
- Hiểu khái niệm thực thể (Entity)
- Biết cách biểu diễn thuộc tính trong ERD

## 2. Mô tả & Yêu cầu
Nhà trường cần lưu trữ thông tin cơ bản của sinh viên để quản lý.

## 3. Phân tích thực thể
- **Thực thể:** \`SinhVien\`
- **Các thuộc tính:**
  - \`MaSinhVien\` (Khóa chính - PK): Mã định danh sinh viên.
  - \`TenSinhVien\`: Họ và tên sinh viên.
  - \`NgaySinh\`: Ngày tháng năm sinh.
  - \`GioiTinh\`: Giới tính.

## 4. Sơ đồ ERD

\`\`\`mermaid
erDiagram
    SinhVien {
        string MaSinhVien PK "Mã sinh viên"
        string TenSinhVien "Tên sinh viên"
        date NgaySinh "Ngày sinh"
        string GioiTinh "Giới tính"
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
- **Các thuộc tính:**
  - \`MaMonHoc\` (Khóa chính - PK): Mã định danh môn học.
  - \`TenMonHoc\`: Tên gọi của môn học.
  - \`SoTinChi\`: Số lượng tín chỉ của môn học.

## 4. Sơ đồ ERD

\`\`\`mermaid
erDiagram
    MonHoc {
        string MaMonHoc PK "Mã môn học"
        string TenMonHoc "Tên môn học"
        int SoTinChi "Số tín chỉ"
    }
\`\`\`
`
  },
  {
    folder: 'BTVN_3_QuanLySinhVienLop',
    content: `# BTVN 3: Quản lý sinh viên và lớp học

## 1. Mục tiêu
- Làm quen với khái niệm thực thể và mối quan hệ
- Vẽ sơ đồ ERD đơn giản (Quan hệ 1-N)

## 2. Mô tả & Yêu cầu
Trường học cần lưu trữ thông tin sinh viên và lớp học. Mỗi sinh viên chỉ học một lớp, một lớp có thể có nhiều sinh viên.

## 3. Phân tích thực thể & Quan hệ
- **Thực thể 1:** \`Lop\` (Mã lớp, Tên lớp)
- **Thực thể 2:** \`SinhVien\` (Mã sinh viên, Tên sinh viên, Mã lớp)
- **Quan hệ:** 1 Lớp có nhiều Sinh viên (1 - N).

## 4. Sơ đồ ERD

\`\`\`mermaid
erDiagram
    Lop ||--o{ SinhVien : "có"
    
    Lop {
        string MaLop PK "Mã lớp"
        string TenLop "Tên lớp"
    }
    
    SinhVien {
        string MaSinhVien PK "Mã sinh viên"
        string TenSinhVien "Tên sinh viên"
        string MaLop FK "Thuộc lớp nào"
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
- **Thực thể 1:** \`DocGia\` (Mã độc giả, Tên độc giả)
- **Thực thể 2:** \`Sach\` (Mã sách, Tên sách)
- **Quan hệ:** Độc giả mượn Sách (N - N). 
*(Trong mô hình thực tế, quan hệ N-N được tách thành bảng trung gian Phiếu mượn, nhưng ở cấp độ cơ bản có thể dùng quan hệ N-N trực tiếp)*

## 4. Sơ đồ ERD

\`\`\`mermaid
erDiagram
    DocGia }o--o{ Sach : "mượn"
    
    DocGia {
        string MaDocGia PK "Mã độc giả"
        string TenDocGia "Tên độc giả"
    }
    
    Sach {
        string MaSach PK "Mã sách"
        string TenSach "Tên sách"
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

## 2. Mô tả & Yêu cầu
Một cửa hàng cần quản lý việc bán sản phẩm cho khách hàng.
- Mỗi khách hàng có thể mua nhiều sản phẩm trong một lần mua.
- Một lần mua có ngày mua và tổng tiền.

## 3. Các bước thiết kế CSDL
1. **Xác định thực thể:** \`KhachHang\`, \`SanPham\`, \`HoaDon\`, \`ChiTietHoaDon\`.
2. **Xác định thuộc tính:**
   - \`KhachHang\`: Mã KH, Tên, Số điện thoại.
   - \`SanPham\`: Mã SP, Tên SP, Giá bán.
   - \`HoaDon\`: Mã HĐ, Ngày mua, Tổng tiền, Mã KH.
   - \`ChiTietHoaDon\`: Mã HĐ, Mã SP, Số lượng.
3. **Xác định quan hệ:**
   - Khách hàng - Hóa đơn: 1 - N (1 khách hàng có nhiều hóa đơn).
   - Hóa đơn - Chi tiết hóa đơn: 1 - N.
   - Sản phẩm - Chi tiết hóa đơn: 1 - N.

## 4. Sơ đồ ERD

\`\`\`mermaid
erDiagram
    KhachHang ||--o{ HoaDon : "mua"
    HoaDon ||--o{ ChiTietHoaDon : "gồm có"
    SanPham ||--o{ ChiTietHoaDon : "được mua trong"
    
    KhachHang {
        string MaKhachHang PK "Mã KH"
        string TenKhachHang "Tên khách hàng"
        string SoDienThoai "SĐT"
    }
    
    SanPham {
        string MaSanPham PK "Mã SP"
        string TenSanPham "Tên sản phẩm"
        float GiaBan "Giá bán"
    }
    
    HoaDon {
        string MaHoaDon PK "Mã hóa đơn"
        date NgayMua "Ngày mua"
        float TongTien "Tổng tiền"
        string MaKhachHang FK "Của KH nào"
    }
    
    ChiTietHoaDon {
        string MaHoaDon PK, FK
        string MaSanPham PK, FK
        int SoLuong "Số lượng mua"
    }
\`\`\`
`
  },
  {
    folder: 'BTVN_6_QuanLySinhVienMonHoc',
    content: `# BTVN 6: Quản lý Sinh viên – Môn học

## 1. Mục tiêu
- Hiểu vai trò của CSDL trong quản lý dữ liệu.
- Xác định được thực thể, thuộc tính, mối quan hệ và tách bảng trung gian.

## 2. Mô tả & Yêu cầu
Một trường đại học cần xây dựng CSDL quản lý sinh viên và các môn học sinh viên đăng ký.
- Mỗi sinh viên có thể đăng ký nhiều môn học.
- Mỗi môn học có thể có nhiều sinh viên đăng ký.

## 3. Phân tích thực thể & Quan hệ
Vì Sinh viên và Môn học có mối quan hệ N-N (Nhiều - Nhiều), ta cần một bảng trung gian là \`DangKyMonHoc\`.
- **Thực thể:** \`SinhVien\`, \`MonHoc\`, \`DangKyMonHoc\`.
- **Thuộc tính chính:**
  - \`SinhVien\`: Mã SV, Họ tên, Ngày sinh, Giới tính.
  - \`MonHoc\`: Mã Môn, Tên môn, Số tín chỉ.
  - \`DangKyMonHoc\`: Mã SV, Mã Môn, Học kỳ (hoặc Điểm số).

## 4. Sơ đồ ERD

\`\`\`mermaid
erDiagram
    SinhVien ||--o{ DangKyMonHoc : "đăng ký"
    MonHoc ||--o{ DangKyMonHoc : "được đăng ký bởi"
    
    SinhVien {
        string MaSinhVien PK "Mã sinh viên"
        string HoTen "Họ tên"
        date NgaySinh "Ngày sinh"
        string GioiTinh "Giới tính"
    }
    
    MonHoc {
        string MaMonHoc PK "Mã môn"
        string TenMonHoc "Tên môn"
        int SoTinChi "Số tín chỉ"
    }
    
    DangKyMonHoc {
        string MaSinhVien PK, FK
        string MaMonHoc PK, FK
        string HocKy "Đăng ký học kỳ nào"
    }
\`\`\`
`
  }
];

if (!fs.existsSync(baseDir)) {
  fs.mkdirSync(baseDir, { recursive: true });
}

btvnData.forEach(item => {
  const folderPath = path.join(baseDir, item.folder);
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }
  fs.writeFileSync(path.join(folderPath, 'README.md'), item.content, 'utf8');
});

// Remove old directory
const oldDir = path.join(baseDir, 'btvn_quan_ly_sinh_vien');
if (fs.existsSync(oldDir)) {
  fs.rmSync(oldDir, { recursive: true, force: true });
}

console.log('Successfully generated all BTVN folders and README files.');
