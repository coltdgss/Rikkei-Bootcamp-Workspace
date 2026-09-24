-- =============================================================================
-- BTVN Session 04 - Bài 3: Truy vấn với điều kiện (WHERE + BETWEEN + IN)
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
('SV001', 'Nguyen Van An', '2003-05-12', 'Nam', 'an.nv@gmail.com'),
('SV002', 'Tran Thi Bich', '2005-08-22', 'Nu', 'bich.tt@gmail.com'),
('SV003', 'Le Hoang Cuong', '2002-11-10', 'Nam', 'cuong.lh@gmail.com'),
('SV004', 'Pham Minh Duc', '2004-01-05', 'Nam', 'duc.pm@gmail.com'),
('SV005', 'Vo Thi Mai', '2005-12-30', 'Nu', 'mai.vt@gmail.com');

-- 1. Hiển thị sinh viên có năm sinh từ 2003 đến 2005 (dùng BETWEEN)
SELECT student_id, full_name, birth_date
FROM students
WHERE birth_date BETWEEN '2003-01-01' AND '2005-12-31';

-- 2. Hiển thị sinh viên có giới tính là Nam hoặc Nữ (chỉ hiển thị mã, họ tên, ngày sinh)
SELECT student_id, full_name, birth_date
FROM students
WHERE gender IN ('Nam', 'Nu');

-- 3. Hiển thị sinh viên có mã sinh viên thuộc một trong các mã: SV001, SV004, SV005
SELECT student_id, full_name, birth_date
FROM students
WHERE student_id IN ('SV001', 'SV004', 'SV005');
