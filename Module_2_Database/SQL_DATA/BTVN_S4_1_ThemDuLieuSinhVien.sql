-- =============================================================================
-- BTVN Session 04 - Bài 1: Thêm dữ liệu sinh viên (INSERT + SELECT)
-- Nguồn: Trích xuất tự động từ giáo trình RK-MODULE2-DATABASE trên Google Drive
-- =============================================================================

CREATE TABLE IF NOT EXISTS students (
    student_id VARCHAR(10) PRIMARY KEY, -- Mã sinh viên
    full_name VARCHAR(100) NOT NULL,    -- Họ và tên
    birth_date DATE NOT NULL,           -- Ngày sinh
    gender VARCHAR(10) NOT NULL,        -- Giới tính (Nam/Nu)
    email VARCHAR(100)                  -- Email (có thể NULL)
);

-- 1. Thêm ít nhất 5 sinh viên vào bảng (có ít nhất 1 sinh viên chưa có email)
INSERT INTO students (student_id, full_name, birth_date, gender, email) VALUES
('SV001', 'Nguyen Van An', '2004-03-15', 'Nam', 'an.nv@gmail.com'),
('SV002', 'Tran Thi Bich', '2005-08-22', 'Nu', 'bich.tt@gmail.com'),
('SV003', 'Le Hoang Cuong', '2003-11-10', 'Nam', NULL),
('SV004', 'Pham Minh Duc', '2004-01-05', 'Nam', 'duc.pm@gmail.com'),
('SV005', 'Vo Thi Mai', '2005-12-30', 'Nu', NULL);

-- 2. Viết câu lệnh SELECT hiển thị toàn bộ danh sách sinh viên
SELECT * FROM students;

-- 3. Chỉ hiển thị các cột: mã sinh viên, họ tên, email
SELECT student_id, full_name, email FROM students;
