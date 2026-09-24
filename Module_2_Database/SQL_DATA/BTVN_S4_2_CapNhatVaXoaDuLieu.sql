-- =============================================================================
-- BTVN Session 04 - Bài 2: Cập nhật và xóa dữ liệu (UPDATE + DELETE)
-- Nguồn: Trích xuất tự động từ giáo trình RK-MODULE2-DATABASE trên Google Drive
-- =============================================================================

CREATE TABLE IF NOT EXISTS students (
    student_id VARCHAR(10) PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    birth_date DATE NOT NULL,
    gender VARCHAR(10) NOT NULL,
    email VARCHAR(100)
);

-- Khởi tạo dữ liệu mẫu ban đầu
INSERT INTO students (student_id, full_name, birth_date, gender, email) VALUES
('SV001', 'Nguyen Van An', '2004-03-15', 'Nam', 'an.nv@gmail.com'),
('SV002', 'Tran Thi Bich', '2005-08-22', 'Nu', 'bich.tt@gmail.com'),
('SV003', 'Le Hoang Cuong', '2003-11-10', 'Nam', NULL),
('SV004', 'Pham Minh Duc', '2004-01-05', 'Nam', 'duc.pm@gmail.com'),
('SV005', 'Vo Thi Mai', '2005-12-30', 'Nu', NULL);

-- 1. Cập nhật email cho sinh viên chưa có email (SV003)
UPDATE students
SET email = 'cuong.lh@gmail.com'
WHERE student_id = 'SV003';

-- Kiểm tra lại sau khi cập nhật email
SELECT * FROM students WHERE student_id = 'SV003';

-- 2. Cập nhật giới tính cho sinh viên có mã là SV005
UPDATE students
SET gender = 'Nu'
WHERE student_id = 'SV005';

-- Kiểm tra lại sau khi cập nhật giới tính
SELECT * FROM students WHERE student_id = 'SV005';

-- 3. Xóa sinh viên có mã sinh viên là SV003
DELETE FROM students
WHERE student_id = 'SV003';

-- Kiểm tra lại toàn bộ bảng sau khi xóa
SELECT * FROM students;
