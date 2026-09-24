-- BTVN Session 02 - Bài 5: Quản lý sinh viên - Lớp học (Quan hệ 1-N)
-- Nguồn: Giáo trình RK-MODULE2-DATABASE (Lesson 3 & Bài đọc Sơ đồ quan hệ thực thể)
-- Mục tiêu: Thiết kế quan hệ 1-N giữa Lớp học (classes) và Sinh viên (students) thông qua khóa ngoại FOREIGN KEY.

CREATE TABLE classes (
    class_id VARCHAR(20) PRIMARY KEY,      -- Mã lớp học (Khóa chính)
    class_name VARCHAR(100) NOT NULL,      -- Tên lớp học
    school_year VARCHAR(20) NOT NULL       -- Niên khóa học tập (VD: 2025-2026)
);

CREATE TABLE students (
    student_id VARCHAR(20) PRIMARY KEY,    -- Mã sinh viên (Khóa chính)
    full_name VARCHAR(100) NOT NULL,       -- Họ tên sinh viên
    date_of_birth DATE,                    -- Ngày sinh
    gender VARCHAR(10),                    -- Giới tính
    class_id VARCHAR(20) NOT NULL,         -- Khóa ngoại liên kết tới lớp học
    FOREIGN KEY (class_id) REFERENCES classes(class_id)
);

-- Dữ liệu mẫu kiểm thử trên SQLite Engine
INSERT INTO classes (class_id, class_name, school_year) VALUES
('L01', 'Cong nghe thong tin K01', '2025-2026'),
('L02', 'Ky thuat phan mem K02', '2025-2026');

INSERT INTO students (student_id, full_name, date_of_birth, gender, class_id) VALUES
('SV001', 'Nguyen Van An', '2004-03-15', 'Nam', 'L01'),
('SV002', 'Tran Thi Huong', '2005-08-22', 'Nu', 'L01'),
('SV003', 'Hoang Minh Tri', '2004-12-05', 'Nam', 'L02');
