-- BTVN Session 02 - Bài 3: Áp dụng ràng buộc trong bảng
-- Nguồn: Giáo trình RK-MODULE2-DATABASE (Lesson 3: Các ràng buộc trong SQL - Constraints)
-- Mục tiêu: Đảm bảo tính toàn vẹn dữ liệu với PRIMARY KEY, NOT NULL, UNIQUE (email), và CHECK (tuổi >= 18).

CREATE TABLE students_constraint (
    student_id VARCHAR(20) PRIMARY KEY,    -- Khóa chính định danh sinh viên duy nhất
    full_name VARCHAR(100) NOT NULL,       -- Họ tên không được để trống
    email VARCHAR(100) UNIQUE NOT NULL,    -- Email không được trùng lặp và không để trống
    age INT CHECK (age >= 18)              -- Tuổi phải đủ từ 18 trở lên
);

-- Dữ liệu mẫu kiểm thử trên SQLite Engine
INSERT INTO students_constraint (student_id, full_name, email, age) VALUES
('SV001', 'Nguyen Van Hung', 'hung.nv@rikkei.edu.vn', 20),
('SV002', 'Pham Mai Linh', 'linh.pm@rikkei.edu.vn', 19),
('SV003', 'Dang Tuan Kiet', 'kiet.dt@rikkei.edu.vn', 22);
