# BTVN 6: Quản lý Sinh viên – Môn học

## 1. Mục tiêu
- Hiểu vai trò của CSDL trong quản lý dữ liệu
- Xác định được thực thể (Entity), thuộc tính, mối quan hệ

## 2. Mô tả & Yêu cầu
Quản lý sinh viên và các môn học mà sinh viên đăng ký.
- Sinh viên: mã sinh viên, họ tên, ngày sinh, giới tính
- Môn học: mã môn, tên môn, số tín chỉ

## 3. Xác định Thực thể & Mối quan hệ
- **Bội số quan hệ:** 1 Sinh viên có thể đăng ký Nhiều Môn học, và 1 Môn học có Nhiều Sinh viên đăng ký. Đây là quan hệ **N-N**.
- **Cách giải quyết:** Khi gặp quan hệ N-N, ta phải đẻ ra một bảng phụ (bảng trung gian) tên là `DangKyMonHoc` để tách nó thành hai quan hệ **1-N**.

## 4. Sơ đồ ERD (Có Khóa chính PK)

```mermaid
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
```
