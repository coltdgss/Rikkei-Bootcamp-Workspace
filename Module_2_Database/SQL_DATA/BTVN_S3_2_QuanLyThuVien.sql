-- =============================================================================
-- BTVN Session 03 - Bài 2: Quản lý thư viện (Sách, Độc giả & Phiếu mượn N-N)
-- Nguồn: Giáo trình chuẩn RK-MODULE2-DATABASE · Session 03 DDL Basics
-- =============================================================================

-- 1. Bảng Sách (books)
CREATE TABLE books (
    book_id VARCHAR(20) PRIMARY KEY,       -- Mã sách (Khóa chính)
    title VARCHAR(150) NOT NULL,           -- Tiêu đề sách
    author VARCHAR(100) NOT NULL,          -- Tác giả
    publish_year INT CHECK (publish_year >= 1900), -- Năm xuất bản
    available_qty INT DEFAULT 1 CHECK (available_qty >= 0) -- Số lượng tồn kho
);

-- 2. Bảng Độc giả (members)
CREATE TABLE members (
    member_id VARCHAR(20) PRIMARY KEY,     -- Mã thẻ độc giả
    member_name VARCHAR(100) NOT NULL,     -- Tên độc giả
    phone_number VARCHAR(15) UNIQUE,       -- Số điện thoại không trùng
    join_date DATE DEFAULT (CURRENT_DATE)  -- Ngày làm thẻ
);

-- 3. Bảng Phiếu mượn (borrow_records - Quan hệ N-N)
CREATE TABLE borrow_records (
    record_id INT PRIMARY KEY,
    book_id VARCHAR(20) NOT NULL,
    member_id VARCHAR(20) NOT NULL,
    borrow_date DATE NOT NULL,
    return_date DATE,
    FOREIGN KEY (book_id) REFERENCES books(book_id),
    FOREIGN KEY (member_id) REFERENCES members(member_id)
);

-- 4. Dữ liệu kiểm thử
INSERT INTO books (book_id, title, author, publish_year, available_qty) VALUES
('B01', 'Co so du lieu nang cao', 'Nguyen Van A', 2023, 10),
('B02', 'Lap trinh Java Core', 'Tran Thi B', 2024, 15);

INSERT INTO members (member_id, member_name, phone_number, join_date) VALUES
('M01', 'Pham Hoang Nam', '0901234567', '2025-01-10'),
('M02', 'Do Thi Mai', '0912345678', '2025-02-15');

INSERT INTO borrow_records (record_id, book_id, member_id, borrow_date, return_date) VALUES
(1, 'B01', 'M01', '2025-03-01', '2025-03-10'),
(2, 'B02', 'M02', '2025-03-05', NULL);

-- 5. Truy vấn kiểm tra
SELECT * FROM books;
SELECT * FROM members;
SELECT * FROM borrow_records;
