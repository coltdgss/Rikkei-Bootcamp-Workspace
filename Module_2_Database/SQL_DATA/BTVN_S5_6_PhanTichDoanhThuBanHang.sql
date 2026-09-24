-- =============================================================================
-- BTVN Session 05 - Bài 6: Phân tích doanh thu bán hàng
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
    price DECIMAL(12,2) NOT NULL,
    PRIMARY KEY (order_id, product_name),
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
);

INSERT INTO customers (customer_id, customer_name) VALUES
('C01', 'Cong ty TNHH Song Hong'),
('C02', 'Tap doan Nam Hai'),
('C03', 'Cua hang Bach Hoa Xanh');

INSERT INTO orders (order_id, order_date, customer_id) VALUES
('ORD01', '2026-09-01', 'C01'),
('ORD02', '2026-09-05', 'C02'),
('ORD03', '2026-09-10', 'C01');

INSERT INTO order_items (order_id, product_name, quantity, price) VALUES
('ORD01', 'May in Laser HP', 2, 4500000.00),
('ORD01', 'Giay in Double A', 10, 85000.00),
('ORD02', 'May chieu Sony 4K', 1, 28000000.00),
('ORD03', 'Muc in chinh hang HP', 5, 650000.00);

-- 1. Tính tổng giá trị cho từng đơn hàng
SELECT 
    o.order_id,
    o.order_date,
    SUM(oi.quantity * oi.price) AS total_order_amount
FROM orders o
INNER JOIN order_items oi ON o.order_id = oi.order_id
GROUP BY o.order_id, o.order_date;

-- 2. Tính tổng chi tiêu của từng khách hàng
SELECT 
    c.customer_id,
    c.customer_name,
    SUM(oi.quantity * oi.price) AS total_spent
FROM customers c
INNER JOIN orders o ON c.customer_id = o.customer_id
INNER JOIN order_items oi ON o.order_id = oi.order_id
GROUP BY c.customer_id, c.customer_name;

-- 3. Chỉ hiển thị khách hàng có tổng chi tiêu trên 5.000.000
SELECT 
    c.customer_id,
    c.customer_name,
    SUM(oi.quantity * oi.price) AS total_spent
FROM customers c
INNER JOIN orders o ON c.customer_id = o.customer_id
INNER JOIN order_items oi ON o.order_id = oi.order_id
GROUP BY c.customer_id, c.customer_name
HAVING SUM(oi.quantity * oi.price) > 5000000
ORDER BY total_spent DESC;
