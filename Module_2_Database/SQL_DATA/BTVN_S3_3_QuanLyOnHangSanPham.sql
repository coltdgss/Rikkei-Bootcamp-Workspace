-- =============================================================================
-- BTVN Session 03 - Bài 3: Quản lý đơn hàng - Sản phẩm (Customers, Orders, Order Details)
-- Nguồn: Giáo trình chuẩn RK-MODULE2-DATABASE · Session 03 DDL Basics
-- =============================================================================

-- 1. Bảng Khách hàng (customers)
CREATE TABLE customers (
    customer_id VARCHAR(20) PRIMARY KEY,   -- Mã khách hàng
    customer_name VARCHAR(100) NOT NULL,   -- Họ tên khách hàng
    phone VARCHAR(15) UNIQUE NOT NULL,     -- Số điện thoại (bắt buộc duy nhất)
    address VARCHAR(200)                   -- Địa chỉ giao hàng
);

-- 2. Bảng Sản phẩm (products)
CREATE TABLE products (
    product_id VARCHAR(20) PRIMARY KEY,    -- Mã sản phẩm
    product_name VARCHAR(120) NOT NULL,    -- Tên hàng hóa
    unit_price DECIMAL(12,2) CHECK (unit_price > 0), -- Đơn giá > 0
    stock_quantity INT DEFAULT 0 CHECK (stock_quantity >= 0) -- Tồn kho >= 0
);

-- 3. Bảng Đơn hàng (orders)
CREATE TABLE orders (
    order_id VARCHAR(20) PRIMARY KEY,      -- Mã đơn hàng
    order_date DATE NOT NULL,              -- Ngày đặt hàng
    customer_id VARCHAR(20) NOT NULL,      -- Khách hàng đặt
    order_status VARCHAR(20) DEFAULT 'Pending' CHECK (order_status IN ('Pending', 'Processing', 'Completed', 'Cancelled')),
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

-- 4. Bảng Chi tiết đơn hàng (order_items - Nối N-N giữa orders & products)
CREATE TABLE order_items (
    order_id VARCHAR(20) NOT NULL,
    product_id VARCHAR(20) NOT NULL,
    quantity INT CHECK (quantity > 0),     -- Số lượng mua > 0
    item_price DECIMAL(12,2) CHECK (item_price > 0),
    PRIMARY KEY (order_id, product_id),    -- Khóa chính tổ hợp (Composite Key)
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

-- Dữ liệu kiểm thử
INSERT INTO customers VALUES 
('KH01', 'Nguyen Van Thanh', '0988112233', 'Ha Noi'),
('KH02', 'Le Thi Ngoc', '0977445566', 'Da Nang');

INSERT INTO products VALUES
('SP01', 'Ban phim co RK Royal Kludge', 850000, 25),
('SP02', 'Chuot Gaming Logitech G102', 450000, 40);

INSERT INTO orders VALUES
('ORD01', '2025-03-01', 'KH01', 'Processing'),
('ORD02', '2025-03-02', 'KH02', 'Pending');

INSERT INTO order_items VALUES
('ORD01', 'SP01', 1, 850000),
('ORD01', 'SP02', 2, 450000),
('ORD02', 'SP02', 1, 450000);

SELECT * FROM orders;
SELECT * FROM order_items;
