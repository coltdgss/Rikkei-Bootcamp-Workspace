-- =============================================================================
-- BTVN Session 05 - Bài 3: Truy vấn lồng (SubQuery)
-- Nguồn: Trích xuất tự động từ giáo trình RK-MODULE2-DATABASE trên Google Drive
-- =============================================================================

CREATE TABLE IF NOT EXISTS products (
    product_id VARCHAR(10) PRIMARY KEY,
    product_name VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL,
    price DECIMAL(10,2) NOT NULL
);

INSERT INTO products (product_id, product_name, category, price) VALUES
('P01', 'But bi thien long', 'Van phong pham', 5000.00),
('P02', 'Vo hoc sinh 200 trang', 'Van phong pham', 15000.00),
('P03', 'Bia cong trau A4', 'Van phong pham', 35000.00),
('P04', 'Chuot quang khong day', 'Phu kien IT', 150000.00),
('P05', 'Ban phim co Bluetooth', 'Phu kien IT', 850000.00),
('P06', 'Lot chuot gaming size L', 'Phu kien IT', 95000.00);

-- 1. Hiển thị các sản phẩm có giá cao hơn giá trung bình của tất cả sản phẩm
SELECT * FROM products
WHERE price > (SELECT AVG(price) FROM products);

-- 2. Hiển thị sản phẩm có giá cao nhất trong từng loại sản phẩm (Subquery lồng)
SELECT p.* FROM products p
WHERE p.price = (
    SELECT MAX(sub.price)
    FROM products sub
    WHERE sub.category = p.category
);

-- 3. Hiển thị các sản phẩm thuộc loại có ít nhất một sản phẩm giá trên 20.000
SELECT * FROM products
WHERE category IN (
    SELECT DISTINCT category
    FROM products
    WHERE price > 20000
);
