-- =============================================================================
-- BTVN Session 04 - Bài 6: Quản lý sản phẩm
-- Nguồn: Trích xuất tự động từ giáo trình RK-MODULE2-DATABASE trên Google Drive
-- =============================================================================

CREATE TABLE IF NOT EXISTS products (
    product_id VARCHAR(10) PRIMARY KEY,  -- Mã sản phẩm
    product_name VARCHAR(150) NOT NULL,  -- Tên sản phẩm
    category VARCHAR(50) NOT NULL,       -- Loại sản phẩm
    price DECIMAL(10,2) NOT NULL,        -- Giá bán
    quantity INT NOT NULL DEFAULT 0      -- Số lượng tồn kho
);

-- Thêm ít nhất 5 sản phẩm (trong đó có ít nhất 2 sản phẩm cùng loại)
INSERT INTO products (product_id, product_name, category, price, quantity) VALUES
('P001', 'Dien thoai Galaxy S24', 'Dien tu', 18900000.00, 15),
('P002', 'Laptop ThinkPad X1', 'Dien tu', 28500000.00, 8),
('P003', 'Ao so mi nam Oxford', 'Thoi trang', 450000.00, 50),
('P004', 'Quan jeans Slimfit', 'Thoi trang', 590000.00, 35),
('P005', 'Tai nghe AirPods Pro', 'Phu kien', 4990000.00, 20);

-- 1. Cập nhật số lượng sản phẩm P001 tăng thêm 10 đơn vị
UPDATE products
SET quantity = quantity + 10
WHERE product_id = 'P001';

-- 2. Xóa sản phẩm có số lượng tồn kho bằng 0 (nếu có)
DELETE FROM products
WHERE quantity = 0;

-- 3. Hiển thị các sản phẩm thuộc loại 'Dien tu' hoặc 'Thoi trang' có giá dưới 20.000.000
SELECT * FROM products
WHERE category IN ('Dien tu', 'Thoi trang') AND price < 20000000;

-- 4. Tìm kiếm sản phẩm có tên chứa chữ 'Galaxy' hoặc 'ThinkPad'
SELECT * FROM products
WHERE product_name LIKE '%Galaxy%' OR product_name LIKE '%ThinkPad%';
