-- BTVN Session 02 - Bài 2: Tạo bảng Sản phẩm
-- Nguồn: Giáo trình RK-MODULE2-DATABASE (Lesson 2: Kiểu dữ liệu số và chuỗi)
-- Mục tiêu: Sử dụng kiểu dữ liệu số (DECIMAL cho giá tiền, INT cho tồn kho) và chuỗi (VARCHAR), thiết lập PRIMARY KEY.

CREATE TABLE products (
    product_id VARCHAR(20) PRIMARY KEY,      -- Mã sản phẩm (Khóa chính)
    product_name VARCHAR(150) NOT NULL,      -- Tên sản phẩm (Bắt buộc)
    price DECIMAL(10, 2) NOT NULL,           -- Giá bán (Định dạng số thực với 2 chữ số thập phân)
    stock_quantity INT NOT NULL              -- Số lượng tồn kho (Số nguyên)
);

-- Dữ liệu mẫu kiểm thử trên SQLite Engine
INSERT INTO products (product_id, product_name, price, stock_quantity) VALUES
('SP001', 'Chuot khong day Logitech M331', 350000.00, 45),
('SP002', 'Ban phim co Keychron K2', 1850000.00, 20),
('SP003', 'Tai nghe Sony WH-1000XM5', 6990000.00, 12);
