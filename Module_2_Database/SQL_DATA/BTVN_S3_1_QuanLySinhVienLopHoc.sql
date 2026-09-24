-- =============================================================================
-- BTVN Session 03 - Bài 1: Quản lý sinh viên - Lớp học (DDL & Quan hệ 1-N)
-- Nguồn: Giáo trình chuẩn RK-MODULE2-DATABASE · Session 03 DDL Basics
-- =============================================================================

-- 1. Tạo bảng Lớp học (classes)
CREATE TABLE classes (
    class_id VARCHAR(20) PRIMARY KEY,      -- Mã lớp (Khóa chính)
    class_name VARCHAR(100) NOT NULL,      -- Tên lớp học
    room_number VARCHAR(20),               -- Phòng học
    max_students INT DEFAULT 45 CHECK (max_students > 0) -- Sĩ số tối đa
);

-- 2. Tạo bảng Sinh viên (students) có khóa ngoại liên kết tới classes
CREATE TABLE students (
    student_id VARCHAR(20) PRIMARY KEY,    -- Mã sinh viên (Khóa chính)
    full_name VARCHAR(100) NOT NULL,       -- Họ và tên
    date_of_birth DATE NOT NULL,           -- Ngày sinh
    gender VARCHAR(10) CHECK (gender IN ('Nam', 'Nu')),
    email VARCHAR(100) UNIQUE,             -- Email độc nhất không trùng lặp
    class_id VARCHAR(20) NOT NULL,         -- Khóa ngoại nối về classes
    FOREIGN KEY (class_id) REFERENCES classes(class_id)
);

-- 3. Chèn dữ liệu kiểm thử
INSERT INTO classes (class_id, class_name, room_number, max_students) VALUES
('C01', 'Cong nghe Thong tin K24', 'A101', 40),
('C02', 'Khoa hoc Du lieu K24', 'B203', 35);

INSERT INTO students (student_id, full_name, date_of_birth, gender, email, class_id) VALUES
('SV01', 'Nguyen Van An', '2004-03-15', 'Nam', 'an.nv@rikkei.edu.vn', 'C01'),
('SV02', 'Tran Thi Bich', '2005-08-20', 'Nu', 'bich.tt@rikkei.edu.vn', 'C01'),
('SV03', 'Le Hoang Cuong', '2004-11-12', 'Nam', 'cuong.lh@rikkei.edu.vn', 'C02');

-- 4. Truy vấn kiểm tra
SELECT * FROM classes;
SELECT * FROM students;
