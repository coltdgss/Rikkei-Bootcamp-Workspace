-- =============================================================================
-- BTVN Session 05 - Bài 2: Group by và Having
-- Nguồn: Trích xuất tự động từ giáo trình RK-MODULE2-DATABASE trên Google Drive
-- =============================================================================

CREATE TABLE IF NOT EXISTS employees (
    emp_id VARCHAR(10) PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    department VARCHAR(50) NOT NULL,
    salary DECIMAL(12,2) NOT NULL
);

INSERT INTO employees (emp_id, full_name, department, salary) VALUES
('EMP01', 'Nguyen Van A', 'Ky thuat', 18000000.00),
('EMP02', 'Tran Thi B', 'Ky thuat', 22000000.00),
('EMP03', 'Le Van C', 'Ky thuat', 19000000.00),
('EMP04', 'Pham Thi D', 'Ky thuat', 25000000.00),
('EMP05', 'Hoang Van E', 'Kinh doanh', 14000000.00),
('EMP06', 'Do Thi F', 'Kinh doanh', 16000000.00),
('EMP07', 'Bui Van G', 'Nhan su', 12000000.00),
('EMP08', 'Vu Thi H', 'Nhan su', 13000000.00);

-- 1. Thống kê mỗi phòng ban có bao nhiêu nhân viên
SELECT department, COUNT(*) AS employee_count
FROM employees
GROUP BY department;

-- 2. Tính mức lương trung bình của từng phòng ban
SELECT department, ROUND(AVG(salary), 2) AS avg_salary
FROM employees
GROUP BY department;

-- 3. Chỉ hiển thị các phòng ban có trên 3 nhân viên (HAVING)
SELECT department, COUNT(*) AS employee_count
FROM employees
GROUP BY department
HAVING COUNT(*) > 3;

-- 4. Chỉ hiển thị các phòng ban có lương trung bình trên 15.000.000
SELECT department, ROUND(AVG(salary), 2) AS avg_salary
FROM employees
GROUP BY department
HAVING AVG(salary) > 15000000;
