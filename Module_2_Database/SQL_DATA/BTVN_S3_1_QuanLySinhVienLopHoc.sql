-- =============================================================================
-- BTVN Session 03 - Bài 1: Quản lý sinh viên - Lớp học
-- Nguồn: Trích xuất tự động từ giáo trình RK-MODULE2-DATABASE
-- =============================================================================

CREATE TABLE table_s3_1 (
    id INT PRIMARY KEY AUTO_INCREMENT, -- Khóa chính
    name VARCHAR(100) NOT NULL,        -- Tên bản ghi
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Dữ liệu kiểm thử mẫu
INSERT INTO table_s3_1 (name) VALUES ('Ban ghi mau 01'), ('Ban ghi mau 02');
