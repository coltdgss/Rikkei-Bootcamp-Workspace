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
- **Thực thể:** \`Sinh_vien\`
- **Các thuộc tính cơ bản:**
  - \`ma_sinh_vien\` (Khóa chính - PK): Để phân biệt không ai giống ai.
  - \`ten_sinh_vien\`: Họ và tên.
  - \`ngay_sinh\`: Ngày tháng năm sinh.

## 4. Sơ đồ ERD
*(Dùng các kiểu dữ liệu bình dân dễ hiểu)*

\`\`\`mermaid
erDiagram
    Sinh_vien {
        chuoi ma_sinh_vien PK "Mã sinh viên"
        chuoi ten_sinh_vien "Tên sinh viên"
        ngay_thang ngay_sinh "Ngày sinh"
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
- **Thực thể:** \`Mon_hoc\`
- **Các thuộc tính cơ bản:**
  - \`ma_mon_hoc\` (Khóa chính - PK): Mã riêng của từng môn.
  - \`ten_mon_hoc\`: Tên môn (ví dụ: Toán, Lý).
  - \`so_tin_chi\`: Môn này nặng bao nhiêu tín chỉ.

## 4. Sơ đồ ERD

\`\`\`mermaid
erDiagram
    Mon_hoc {
        chuoi ma_mon_hoc PK "Mã môn học"
        chuoi ten_mon_hoc "Tên môn học"
        con_so so_tin_chi "Số tín chỉ"
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
- **Thực thể 1:** \`Lop_hoc\` (Gồm: mã lớp, tên lớp).
- **Thực thể 2:** \`Sinh_vien\` (Gồm: mã sinh viên, tên sinh viên).
- **Mối quan hệ:** Quan hệ **1 - N** (1 Lớp có Nhiều Sinh viên). Ta cần mượn "mã lớp" đưa vào thông tin của Sinh viên để biết sinh viên đó thuộc lớp nào.

## 4. Sơ đồ ERD

\`\`\`mermaid
erDiagram
    Lop_hoc ||--o{ Sinh_vien : "có nhiều"
    
    Lop_hoc {
        chuoi ma_lop PK "Mã lớp"
        chuoi ten_lop "Tên lớp"
    }
    
    Sinh_vien {
        chuoi ma_sinh_vien PK "Mã sinh viên"
        chuoi ten_sinh_vien "Tên sinh viên"
        chuoi ma_lop FK "Thuộc lớp nào"
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
- **Thực thể 1:** \`Doc_gia\` (Mã độc giả, Tên độc giả).
- **Thực thể 2:** \`Sach\` (Mã sách, Tên sách).
- **Mối quan hệ:** Quan hệ **N - N** (Nhiều - Nhiều). Ở mức độ cơ bản, ta nối trực tiếp hai bảng này với nhau bằng ký hiệu N-N.

## 4. Sơ đồ ERD
*Ký hiệu \`}o--o{\` trong Mermaid đại diện cho quan hệ Nhiều-Nhiều (N-N).*

\`\`\`mermaid
erDiagram
    Doc_gia }o--o{ Sach : "mượn"
    
    Doc_gia {
        chuoi ma_doc_gia PK "Mã độc giả"
        chuoi ten_doc_gia "Tên độc giả"
    }
    
    Sach {
        chuoi ma_sach PK "Mã sách"
        chuoi ten_sach "Tên sách"
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
   - \`Khach_hang\` (Mã KH, Tên, Số điện thoại)
   - \`San_pham\` (Mã SP, Tên SP, Giá bán)
   - \`Hoa_don\` (Mã Hóa đơn, Ngày mua, Tổng tiền). Do 1 khách mua nhiều lần nên hóa đơn cần lưu tách biệt.
   
2. **Xác định quan hệ (Chỉ rõ 1-N và N-N):**
   - **Khách hàng & Hóa đơn:** Quan hệ **1-N** (1 Khách hàng có thể có Nhiều Hóa đơn).
   - **Hóa đơn & Sản phẩm:** Bản chất là quan hệ **N-N** (1 Hóa đơn có Nhiều Sản phẩm, và 1 Sản phẩm có thể nằm trong Nhiều Hóa đơn).
   
3. **Tách dữ liệu tránh trùng lặp:**
   - Để giải quyết quan hệ N-N ở trên, ta bắt buộc phải sinh ra một bảng ở giữa gọi là \`Chi_tiet_mua_hang\`.
   - Bảng này sẽ biến quan hệ N-N thành hai quan hệ 1-N: (Hóa đơn **1-N** Chi tiết mua hàng) và (Sản phẩm **1-N** Chi tiết mua hàng).

## 3. Sơ đồ ERD

\`\`\`mermaid
erDiagram
    Khach_hang ||--o{ Hoa_don : "mua"
    Hoa_don ||--o{ Chi_tiet_mua_hang : "gồm có"
    San_pham ||--o{ Chi_tiet_mua_hang : "nằm trong"
    
    Khach_hang {
        chuoi ma_khach PK "Mã khách"
        chuoi ten_khach "Tên khách"
        chuoi so_dien_thoai "Số điện thoại"
    }
    
    San_pham {
        chuoi ma_san_pham PK "Mã sản phẩm"
        chuoi ten_san_pham "Tên sản phẩm"
        so_tien gia_ban "Giá bán"
    }
    
    Hoa_don {
        chuoi ma_hoa_don PK "Mã hóa đơn"
        ngay_thang ngay_mua "Ngày mua"
        so_tien tong_tien "Tổng tiền"
        chuoi ma_khach FK "Thuộc khách nào"
    }
    
    Chi_tiet_mua_hang {
        chuoi ma_hoa_don PK, FK
        chuoi ma_san_pham PK, FK
        con_so so_luong "Số lượng mua"
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
- **Cách giải quyết:** Khi gặp quan hệ N-N, ta phải đẻ ra một bảng phụ (bảng trung gian) tên là \`Dang_ky_mon_hoc\` để tách nó thành hai quan hệ **1-N**.

## 4. Sơ đồ ERD (Có Khóa chính PK)

\`\`\`mermaid
erDiagram
    Sinh_vien ||--o{ Dang_ky_mon_hoc : "đăng ký"
    Mon_hoc ||--o{ Dang_ky_mon_hoc : "có sinh viên"
    
    Sinh_vien {
        chuoi ma_sinh_vien PK "Mã sinh viên"
        chuoi ho_ten "Họ tên"
        ngay_thang ngay_sinh "Ngày sinh"
        chuoi gioi_tinh "Giới tính"
    }
    
    Mon_hoc {
        chuoi ma_mon_hoc PK "Mã môn"
        chuoi ten_mon_hoc "Tên môn"
        con_so so_tin_chi "Số tín chỉ"
    }
    
    Dang_ky_mon_hoc {
        chuoi ma_sinh_vien PK, FK
        chuoi ma_mon_hoc PK, FK
        chuoi hoc_ky "Học kỳ"
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

console.log('Successfully updated all BTVN README files with normal user naming and explicit requirements.');
