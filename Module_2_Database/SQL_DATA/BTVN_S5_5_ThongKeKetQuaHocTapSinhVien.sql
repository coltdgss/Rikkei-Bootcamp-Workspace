-- =============================================================================
-- BTVN Session 05 - Bài 5: Thống kê kết quả học tập sinh viên
-- Nguồn: Trích xuất tự động từ giáo trình RK-MODULE2-DATABASE trên Google Drive
-- =============================================================================

CREATE TABLE IF NOT EXISTS scores (
    student_id VARCHAR(10) NOT NULL,
    subject VARCHAR(50) NOT NULL,
    score DECIMAL(4,2) NOT NULL,
    PRIMARY KEY (student_id, subject)
);

INSERT INTO scores (student_id, subject, score) VALUES
('SV01', 'Co so du lieu', 8.5),
('SV01', 'Lap trinh Java', 7.0),
('SV01', 'Thiet ke Web', 9.0),
('SV02', 'Co so du lieu', 6.0),
('SV02', 'Lap trinh Java', 6.5),
('SV02', 'Thiet ke Web', 7.0),
('SV03', 'Co so du lieu', 9.5),
('SV03', 'Lap trinh Java', 9.0),
('SV03', 'Thiet ke Web', 9.5);

-- 1. Tính điểm trung bình của mỗi sinh viên
SELECT student_id, ROUND(AVG(score), 2) AS avg_score
FROM scores
GROUP BY student_id;

-- 2. Chỉ hiển thị các sinh viên có điểm trung bình >= 7.0
SELECT student_id, ROUND(AVG(score), 2) AS avg_score
FROM scores
GROUP BY student_id
HAVING AVG(score) >= 7.0;

-- 3. Hiển thị sinh viên có điểm trung bình cao nhất (Subquery)
SELECT student_id, ROUND(AVG(score), 2) AS max_avg_score
FROM scores
GROUP BY student_id
HAVING AVG(score) = (
    SELECT MAX(sub.avg_score)
    FROM (
        SELECT AVG(score) AS avg_score
        FROM scores
        GROUP BY student_id
    ) sub
);
