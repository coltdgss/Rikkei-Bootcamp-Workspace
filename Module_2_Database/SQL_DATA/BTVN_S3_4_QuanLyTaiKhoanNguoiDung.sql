-- =============================================================================
-- BTVN Session 03 - Bài 4: Quản lý tài khoản người dùng (Users & Profiles 1-1, Roles 1-N)
-- Nguồn: Giáo trình chuẩn RK-MODULE2-DATABASE · Session 03 DDL Basics
-- =============================================================================

-- 1. Bảng Vai trò (roles)
CREATE TABLE roles (
    role_id INT PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE  -- Admin, Teacher, Student...
);

-- 2. Bảng Người dùng (users)
CREATE TABLE users (
    user_id VARCHAR(20) PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,  -- Tên đăng nhập độc nhất
    password_hash VARCHAR(255) NOT NULL,   -- Mã băm mật khẩu
    email VARCHAR(100) NOT NULL UNIQUE,    -- Email độc nhất
    role_id INT NOT NULL,                  -- Khóa ngoại nối về roles
    is_active INT DEFAULT 1 CHECK (is_active IN (0, 1)), -- 1: Đang kích hoạt, 0: Khóa
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(role_id)
);

-- 3. Bảng Hồ sơ chi tiết (user_profiles - Quan hệ 1-1 với users)
CREATE TABLE user_profiles (
    user_id VARCHAR(20) PRIMARY KEY,       -- Vừa là PK vừa là FK đảm bảo quan hệ 1-1
    full_name VARCHAR(100) NOT NULL,
    avatar_url VARCHAR(255),
    bio VARCHAR(255),
    birth_date DATE,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Dữ liệu kiểm thử
INSERT INTO roles (role_id, role_name) VALUES 
(1, 'Administrator'), 
(2, 'Instructor'), 
(3, 'Student');

INSERT INTO users (user_id, username, password_hash, email, role_id) VALUES
('U01', 'admin_rikkei', 'hash_secret_123', 'admin@rikkei.edu.vn', 1),
('U02', 'an_nguyen', 'hash_pass_456', 'an.nv@rikkei.edu.vn', 3);

INSERT INTO user_profiles (user_id, full_name, bio, birth_date) VALUES
('U01', 'Quan Tri Vien He Thong', 'Admin he thong dao tao RK', '1992-05-10'),
('U02', 'Nguyen Van An', 'Hoc vien lop Bootcamp Java Backend', '2004-03-15');

SELECT * FROM users;
SELECT * FROM user_profiles;
