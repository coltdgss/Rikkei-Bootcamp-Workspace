-- =============================================================================
-- BTVN Session 04 - Bài 5: Quản lý nhân viên
-- Nguồn: Trích xuất tự động từ giáo trình RK-MODULE2-DATABASE trên Google Drive
-- =============================================================================

CREATE TABLE IF NOT EXISTS employees (
    emp_id VARCHAR(10) PRIMARY KEY,      -- Mã nhân viên
    full_name VARCHAR(100) NOT NULL,     -- Họ tên nhân viên
    birth_year INT NOT NULL,             -- Năm sinh
    department VARCHAR(50) NOT NULL,     -- Phòng ban
    salary DECIMAL(12,2) NOT NULL,       -- Mức lương
    phone VARCHAR(15)                    -- Số điện thoại (có thể NULL)
);

-- Thêm tối thiểu 10 nhân viên mẫu vào bảng
INSERT INTO employees (emp_id, full_name, birth_year, department, salary, phone) VALUES
('EMP01', 'Nguyen Van Thang', 1990, 'Ky thuat', 18500000.00, '0901234567'),
('EMP02', 'Tran Thi Mai', 1995, 'Nhan su', 12000000.00, '0912345678'),
('EMP03', 'Le Hoang Nam', 1988, 'Kinh doanh', 22000000.00, NULL),
('EMP04', 'Pham Thi Thu', 1992, 'Ke toan', 14500000.00, '0934567890'),
('EMP05', 'Vo Van Hai', 1997, 'Ky thuat', 16000000.00, '0945678901'),
('EMP06', 'Dang Minh Tri', 1993, 'Kinh doanh', 9500000.00, NULL),
('EMP07', 'Bui Thi Huyen', 1996, 'Nhan su', 11000000.00, '0967890123'),
('EMP08', 'Doan Van Phong', 1989, 'Ky thuat', 25000000.00, '0978901234'),
('EMP09', 'Hoang Quoc Viet', 1994, 'Ke toan', 13500000.00, NULL),
('EMP10', 'Ngo Bao Ngoc', 1998, 'Kinh doanh', 10500000.00, '0990123456');

-- 1. Hiển thị danh sách nhân viên có mức lương từ 10.000.000 đến 20.000.000
SELECT * FROM employees
WHERE salary BETWEEN 10000000 AND 20000000;

-- 2. Hiển thị nhân viên thuộc phòng 'Ky thuat' hoặc 'Kinh doanh'
SELECT * FROM employees
WHERE department IN ('Ky thuat', 'Kinh doanh');

-- 3. Hiển thị nhân viên chưa có số điện thoại
SELECT * FROM employees
WHERE phone IS NULL;

-- 4. Sắp xếp danh sách nhân viên theo lương giảm dần
SELECT * FROM employees
ORDER BY salary DESC;
