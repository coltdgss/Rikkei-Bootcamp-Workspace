-- BTVN Session 02 - Bài 4: Tạo bảng có DEFAULT và CHECK
-- Nguồn: Giáo trình RK-MODULE2-DATABASE (Lesson 3: Ràng buộc DEFAULT và CHECK)
-- Mục tiêu: Kết hợp DEFAULT và CHECK để kiểm soát trạng thái dữ liệu người dùng (ACTIVE / INACTIVE).

CREATE TABLE users (
    user_id VARCHAR(20) PRIMARY KEY,                                      -- Khóa chính tài khoản
    username VARCHAR(50) UNIQUE NOT NULL,                                 -- Tên đăng nhập không trùng lặp
    password VARCHAR(255) NOT NULL,                                       -- Mật khẩu bảo mật
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE')) -- Giá trị ngầm định ACTIVE, chỉ nhận ACTIVE/INACTIVE
);

-- Dữ liệu mẫu kiểm thử trên SQLite Engine
INSERT INTO users (user_id, username, password, status) VALUES
('U001', 'admin_rikkei', 'SecretPass@2026', 'ACTIVE'),
('U002', 'moderator_vn', 'ModPass#998', 'ACTIVE'),
('U003', 'guest_locked', 'Guest@123', 'INACTIVE');
