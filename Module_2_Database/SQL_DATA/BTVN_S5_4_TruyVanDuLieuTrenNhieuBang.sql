-- =============================================================================
-- BTVN Session 05 - Bài 4: Truy vấn dữ liệu trên nhiều bảng (JOIN)
-- Nguồn: Trích xuất tự động từ giáo trình RK-MODULE2-DATABASE trên Google Drive
-- =============================================================================

CREATE TABLE IF NOT EXISTS customers (
    customer_id VARCHAR(10) PRIMARY KEY,
    customer_name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS orders (
    order_id VARCHAR(10) PRIMARY KEY,
    order_date DATE NOT NULL,
    customer_id VARCHAR(10),
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

CREATE TABLE IF NOT EXISTS order_items (
    order_id VARCHAR(10),
    product_name VARCHAR(150) NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (order_id, product_name),
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
);

INSERT INTO customers (customer_id, customer_name) VALUES
('C01', 'Nguyen Van An'),
('C02', 'Tran Thi Bich'),
('C03', 'Le Hoang Cuong');

INSERT INTO orders (order_id, order_date, customer_id) VALUES
('ORD01', '2026-09-20', 'C01'),
('ORD02', '2026-09-21', 'C02'),
('ORD03', '2026-09-22', 'C01');

INSERT INTO order_items (order_id, product_name, quantity, price) VALUES
('ORD01', 'Laptop Dell Vostro', 1, 18500000.00),
('ORD01', 'Chuot Logitech B100', 2, 120000.00),
('ORD02', 'Ban phim co Akko', 1, 1450000.00),
('ORD03', 'Man hinh LG 24 inch', 1, 3200000.00);

-- 1. Nối bảng customers và orders để xem đơn hàng của ai
SELECT c.customer_name, o.order_id, o.order_date
FROM customers c
INNER JOIN orders o ON c.customer_id = o.customer_id;

-- 2. Nối 3 bảng customers, orders, order_items xem chi tiết đầy đủ
SELECT 
    c.customer_name,
    o.order_id,
    o.order_date,
    oi.product_name,
    oi.quantity,
    oi.price,
    (oi.quantity * oi.price) AS subtotal
FROM customers c
INNER JOIN orders o ON c.customer_id = o.customer_id
INNER JOIN order_items oi ON o.order_id = oi.order_id;
