-- =============================================================================
-- BTVN Session 05 - Bài 1: Sử dụng các hàm SQL thông dụng
-- Nguồn: Trích xuất tự động từ giáo trình RK-MODULE2-DATABASE trên Google Drive
-- =============================================================================

CREATE TABLE IF NOT EXISTS students (
    student_id VARCHAR(10) PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    birth_year INT NOT NULL,
    gender VARCHAR(10) NOT NULL,
    score DECIMAL(4,2) NOT NULL
);

INSERT INTO students (student_id, full_name, birth_year, gender, score) VALUES
('SV001', 'Nguyen Van An', 2004, 'Nam', 8.45),
('SV002', 'Tran Thi Bich', 2005, 'Nu', 9.12),
('SV003', 'Le Hoang Cuong', 2003, 'Nam', 6.78),
('SV004', 'Pham Minh Duc', 2004, 'Nam', 7.50),
('SV005', 'Vo Thi Mai', 2005, 'Nu', 8.89);

-- 1. Hiển thị mã sinh viên và họ tên viết hoa toàn bộ
SELECT student_id, UPPER(full_name) AS full_name_uppercase
FROM students;

-- 2. Hiển thị họ tên và số tuổi của sinh viên (dựa vào năm hiện tại 2026)
SELECT full_name, (2026 - birth_year) AS age
FROM students;

-- 3. Hiển thị điểm trung bình được làm tròn 1 chữ số thập phân
SELECT student_id, full_name, ROUND(score, 1) AS score_rounded
FROM students;

-- 4. Hiển thị: tổng số sinh viên, điểm cao nhất, điểm thấp nhất
SELECT 
    COUNT(*) AS total_students,
    MAX(score) AS max_score,
    MIN(score) AS min_score,
    ROUND(AVG(score), 2) AS avg_score
FROM students;
