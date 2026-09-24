-- BTVN Session 02 - Bài 1: Tạo bảng Sinh viên
-- Nguồn: Giáo trình RK-MODULE2-DATABASE (Lesson 1 & Lesson 2)
-- Mục tiêu: Khởi tạo bảng students với các kiểu dữ liệu chuỗi (VARCHAR) và ngày tháng (DATE), xác định PRIMARY KEY.

CREATE TABLE students (
    student_id VARCHAR(20) PRIMARY KEY, -- Mã sinh viên (Khóa chính định danh duy nhất)
    full_name VARCHAR(100) NOT NULL,    -- Họ và tên sinh viên (Bắt buộc nhập)
    date_of_birth DATE,                 -- Ngày sinh (Định dạng chuẩn YYYY-MM-DD)
    gender VARCHAR(10)                  -- Giới tính (Nam / Nu / Khac)
);

-- Dữ liệu mẫu kiểm thử trên SQLite Engine
INSERT INTO students (student_id, full_name, date_of_birth, gender) VALUES
('SV001', 'Nguyen Van An', '2004-05-12', 'Nam'),
('SV002', 'Tran Thi Bich', '2005-09-20', 'Nu'),
('SV003', 'Le Hoang Minh', '2004-11-03', 'Nam');
