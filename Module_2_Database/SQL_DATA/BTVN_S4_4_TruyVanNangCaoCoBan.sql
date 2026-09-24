-- =============================================================================
-- BTVN Session 04 - Bài 4: Truy vấn nâng cao cơ bản (LIKE + IS NULL + NOT)
-- Nguồn: Trích xuất tự động từ giáo trình RK-MODULE2-DATABASE trên Google Drive
-- =============================================================================

CREATE TABLE IF NOT EXISTS students (
    student_id VARCHAR(10) PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    birth_date DATE NOT NULL,
    gender VARCHAR(10) NOT NULL,
    email VARCHAR(100)
);

INSERT INTO students (student_id, full_name, birth_date, gender, email) VALUES
('SV001', 'Nguyen Van An', '2004-03-15', 'Nam', 'an.nv@gmail.com'),
('SV002', 'Tran Thi Bich', '2005-08-22', 'Nu', NULL),
('SV003', 'Ngo Thanh Tung', '2003-11-10', 'Nam', 'tung.nt@gmail.com'),
('SV004', 'Pham Minh Duc', '2004-01-05', 'Nam', 'duc.pm@gmail.com'),
('SV005', 'Vo Thi Mai', '2005-12-30', 'Nu', NULL);

-- 1. Hiển thị sinh viên chưa có email (IS NULL)
SELECT * FROM students
WHERE email IS NULL;

-- 2. Hiển thị sinh viên đã có email (IS NOT NULL)
SELECT * FROM students
WHERE email IS NOT NULL;

-- 3. Hiển thị sinh viên có họ tên bắt đầu bằng chữ 'Ng' (LIKE 'Ng%')
SELECT * FROM students
WHERE full_name LIKE 'Ng%';

-- 4. Hiển thị sinh viên không phải giới tính Nam (NOT hoặc !=)
SELECT * FROM students
WHERE gender != 'Nam';
