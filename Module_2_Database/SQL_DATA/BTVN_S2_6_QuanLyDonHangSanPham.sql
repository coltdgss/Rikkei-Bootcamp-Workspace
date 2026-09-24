-- BTVN Session 02 - Bài 6: Quản lý đơn hàng - Sản phẩm (Quan hệ N-N)
-- Nguồn: Giáo trình RK-MODULE2-DATABASE (Lesson 3 & Phân rã quan hệ N-N)
-- Mục tiêu: Mô hình hóa quan hệ Nhiều - Nhiều giữa Đơn hàng (orders) và Sản phẩm (products) qua bảng trung gian (order_items) với Composite Primary Key và FOREIGN KEY.

CREATE TABLE orders (
    order_id VARCHAR(20) PRIMARY KEY,      -- Mã đơn hàng (Khóa chính)
    order_date DATE NOT NULL,              -- Ngày đặt hàng
    status VARCHAR(50) NOT NULL            -- Trạng thái đơn hàng (NEW, PAID, SHIPPED)
);

CREATE TABLE products (
    product_id VARCHAR(20) PRIMARY KEY,    -- Mã sản phẩm (Khóa chính)
    product_name VARCHAR(150) NOT NULL,    -- Tên sản phẩm
    price DECIMAL(10, 2) NOT NULL          -- Giá niêm yết sản phẩm
);

CREATE TABLE order_items (
    order_id VARCHAR(20) NOT NULL,         -- Khóa ngoại trỏ về orders
    product_id VARCHAR(20) NOT NULL,       -- Khóa ngoại trỏ về products
    quantity INT NOT NULL CHECK (quantity > 0), -- Số lượng đặt mua (phải > 0)
    PRIMARY KEY (order_id, product_id),    -- Khóa chính kép (Composite PK)
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

-- Dữ liệu mẫu kiểm thử trên SQLite Engine
INSERT INTO orders (order_id, order_date, status) VALUES
('ORD001', '2026-09-16', 'PAID'),
('ORD002', '2026-09-17', 'NEW');

INSERT INTO products (product_id, product_name, price) VALUES
('P01', 'MacBook Air M3 16GB', 28500000.00),
('P02', 'Chuot Magic Mouse 2', 2190000.00),
('P03', 'Cap sac Type-C 100W', 390000.00);

INSERT INTO order_items (order_id, product_id, quantity) VALUES
('ORD001', 'P01', 1),
('ORD001', 'P02', 1),
('ORD002', 'P02', 2),
('ORD002', 'P03', 3);
