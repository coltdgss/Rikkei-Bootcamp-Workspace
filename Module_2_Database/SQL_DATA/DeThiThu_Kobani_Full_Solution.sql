-- =============================================================================
-- ĐỀ ÔN TẬP THI CUỐI MÔN - CƠ SỞ DỮ LIỆU MYSQL (RIKKEI ACADEMY)
-- HỆ THỐNG QUẢN LÝ CỬA HÀNG KOBANI
-- Giảng viên: Lương Quốc Tuấn | Học viên: Nguyễn Văn Trung
-- Đáp án & Giải pháp hoàn chỉnh 100% (Phần 1 -> Phần 5)
-- =============================================================================

-- =============================================================================
-- BƯỚC 0: KHỞI TẠO VÀ CHỌN CƠ SỞ DỮ LIỆU
-- Thao tác trên Workbench: Bôi đen 2 dòng dưới và bấm Ctrl + Enter (hoặc nút tia sét 2)
-- =============================================================================
CREATE DATABASE IF NOT EXISTS CuaHangKobani;
USE CuaHangKobani;

-- =============================================================================
-- PHẦN 1: THAO TÁC VỚI DỮ LIỆU CÁC BẢNG (DDL & DML)
-- QUY TẮC THỨ TỰ TẠO BẢNG:
--   1. Tạo bảng ĐỘC LẬP (bảng Cha, không chứa Foreign Key): KhachHang, SanPham
--   2. Tạo bảng PHỤ THUỘC (bảng Con, chứa Foreign Key): DonHang -> ThanhToan
-- =============================================================================

-- 1.1. Bảng KhachHang (Khách hàng)
CREATE TABLE IF NOT EXISTS KhachHang (
    khachhang_id VARCHAR(10) PRIMARY KEY,
    ho_ten VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    so_dien_thoai VARCHAR(15) NOT NULL,
    dia_chi VARCHAR(200)
);

-- 1.2. Bảng SanPham (Sản phẩm kinh doanh)
CREATE TABLE IF NOT EXISTS SanPham (
    sanpham_id VARCHAR(10) PRIMARY KEY,
    ten_san_pham VARCHAR(150) NOT NULL UNIQUE,
    gia_ban DECIMAL(12,2) NOT NULL CHECK (gia_ban > 0),
    trang_thai VARCHAR(50) NOT NULL DEFAULT 'Đang bán',
    so_luong_ton INT NOT NULL
);

-- 1.3. Bảng DonHang (Đơn đặt hàng - tham chiếu KhachHang và SanPham)
CREATE TABLE IF NOT EXISTS DonHang (
    donhang_id INT PRIMARY KEY AUTO_INCREMENT,
    khachhang_id VARCHAR(10) NOT NULL,
    sanpham_id VARCHAR(10) NOT NULL,
    so_luong INT NOT NULL CHECK (so_luong > 0),
    ngay_dat DATE NOT NULL,
    ngay_giao DATE,
    tong_tien DECIMAL(12,2) DEFAULT 0,
    CONSTRAINT fk_donhang_khachhang FOREIGN KEY (khachhang_id) REFERENCES KhachHang(khachhang_id),
    CONSTRAINT fk_donhang_sanpham FOREIGN KEY (sanpham_id) REFERENCES SanPham(sanpham_id)
);

-- 1.4. Bảng ThanhToan (Lịch sử thanh toán - tham chiếu DonHang)
CREATE TABLE IF NOT EXISTS ThanhToan (
    thanhtoan_id INT PRIMARY KEY AUTO_INCREMENT,
    donhang_id INT NOT NULL,
    phuong_thuc_tt VARCHAR(50) NOT NULL,
    ngay_tt DATE NOT NULL,
    so_tien_tt DECIMAL(12,2) NOT NULL CHECK (so_tien_tt > 0),
    CONSTRAINT fk_thanhtoan_donhang FOREIGN KEY (donhang_id) REFERENCES DonHang(donhang_id)
);

-- =============================================================================
-- 1.5. CHÈN DỮ LIỆU MẪU (INSERT INTO)
-- Thứ tự chèn: KhachHang -> SanPham -> DonHang -> ThanhToan
-- =============================================================================

INSERT INTO KhachHang (khachhang_id, ho_ten, email, so_dien_thoai, dia_chi) VALUES
('KH001', 'Nguyen Van An', 'an.nguyen@example.com', '0911111111', 'Hanoi'),
('KH002', 'Tran Thu Ha', 'ha.tran@example.com', '0922222222', 'Danang'),
('KH003', 'Le Minh Khoa', 'khoa.le@example.com', '0933333333', 'Hanoi'),
('KH004', 'Pham Quoc Bao', 'bao.pham@example.com', '0944444444', 'HCM'),
('KH005', 'Hoang Minh Chau', 'chau.hoang@example.com', '0955555555', 'Haiphong'),
('KH006', 'Do Thi Lan', 'lan.do@example.com', '0966666666', 'Hanoi'),
('KH007', 'Bui Duc Long', 'long.bui@example.com', '0977777777', 'Hue'),
('KH008', 'Vo Thanh Dat', 'dat.vo@example.com', '0988888888', 'Cantho');

INSERT INTO SanPham (sanpham_id, ten_san_pham, gia_ban, trang_thai, so_luong_ton) VALUES
('SP001', 'Cà phê hạt Arabica 250g', 180.00, 'Đang bán', 50),
('SP002', 'Trà ô long hộp thiếc', 120.00, 'Đang bán', 40),
('SP003', 'Bánh quy bơ Kobani', 90.00, 'Ngừng bán', 0),
('SP004', 'Bình giữ nhiệt inox', 350.00, 'Đang bán', 25),
('SP005', 'Cốc sứ Kobani', 150.00, 'Đang bán', 60),
('SP006', 'Máy pha cà phê mini', 800.00, 'Đang bán', 15),
('SP007', 'Túi vải canvas', 120.00, 'Đang bán', 80),
('SP008', 'Sổ tay bìa da', 200.00, 'Ngừng bán', 0);

INSERT INTO DonHang (donhang_id, khachhang_id, sanpham_id, so_luong, ngay_dat, ngay_giao, tong_tien) VALUES
(1, 'KH001', 'SP001', 2, '2026-09-01', '2026-09-03', 0.00),
(2, 'KH002', 'SP002', 1, '2026-09-02', '2026-09-04', 0.00),
(3, 'KH003', 'SP003', 3, '2026-09-03', '2026-09-05', 0.00),
(4, 'KH004', 'SP004', 1, '2026-09-04', '2026-09-06', 0.00),
(5, 'KH005', 'SP005', 2, '2026-09-05', '2026-09-07', 0.00),
(6, 'KH006', 'SP006', 1, '2026-09-06', '2026-09-08', 0.00),
(7, 'KH007', 'SP007', 2, '2026-09-07', '2026-09-09', 0.00),
(8, 'KH008', 'SP008', 1, '2026-09-08', '2026-09-10', 0.00),
(9, 'KH001', 'SP004', 2, '2026-09-10', '2026-09-12', 0.00),
(10, 'KH006', 'SP005', 1, '2026-09-12', '2026-09-14', 0.00);

INSERT INTO ThanhToan (thanhtoan_id, donhang_id, phuong_thuc_tt, ngay_tt, so_tien_tt) VALUES
(1, 1, 'Credit Card', '2026-09-01', 380.00),
(2, 2, 'Cash', '2026-09-02', 140.00),
(3, 3, 'Bank Transfer', '2026-09-03', 290.00),
(4, 4, 'E-Wallet', '2026-09-04', 370.00),
(5, 5, 'Credit Card', '2026-09-05', 320.00),
(6, 6, 'Bank Transfer', '2026-09-06', 820.00),
(7, 7, 'Cash', '2026-09-07', 260.00),
(8, 8, 'E-Wallet', '2026-09-08', 220.00),
(9, 9, 'Bank Transfer', '2026-09-10', 720.00),
(10, 10, 'Cash', '2026-09-12', 170.00);

-- =============================================================================
-- 1.6. CẬP NHẬT DỮ LIỆU (UPDATE)
-- Công thức: tong_tien = gia_ban * so_luong + 20.0 (phí đóng gói)
-- Điều kiện: sp.trang_thai = 'Đang bán' VÀ ngay_dat < CURDATE()
-- =============================================================================
UPDATE DonHang dh
JOIN SanPham sp ON dh.sanpham_id = sp.sanpham_id
SET dh.tong_tien = (sp.gia_ban * dh.so_luong) + 20.00
WHERE sp.trang_thai = 'Đang bán'
  AND dh.ngay_dat < CURDATE();

-- =============================================================================
-- 1.7. XÓA DỮ LIỆU (DELETE)
-- Điều kiện: phuong_thuc_tt = 'Cash' VÀ so_tien_tt < 150.0
-- =============================================================================
DELETE FROM ThanhToan
WHERE phuong_thuc_tt = 'Cash'
  AND so_tien_tt < 150.00;

-- =============================================================================
-- PHẦN 2: TRUY VẤN DỮ LIỆU (10 CÂU QUERY)
-- =============================================================================

-- Câu 1: Lấy thông tin khách hàng, sắp xếp theo họ tên tăng dần
SELECT khachhang_id, ho_ten, email, so_dien_thoai, dia_chi
FROM KhachHang
ORDER BY ho_ten ASC;

-- Câu 2: Lấy thông tin sản phẩm, sắp xếp theo giá bán giảm dần
SELECT sanpham_id, ten_san_pham, gia_ban, so_luong_ton
FROM SanPham
ORDER BY gia_ban DESC;

-- Câu 3: Lấy thông tin khách hàng và sản phẩm đã đặt
SELECT kh.khachhang_id, kh.ho_ten, sp.sanpham_id, dh.ngay_dat, dh.ngay_giao
FROM DonHang dh
INNER JOIN KhachHang kh ON dh.khachhang_id = kh.khachhang_id
INNER JOIN SanPham sp ON dh.sanpham_id = sp.sanpham_id;

-- Câu 4: Danh sách khách hàng và số tiền đã thanh toán, sắp xếp giảm dần theo số tiền
SELECT kh.khachhang_id, kh.ho_ten, tt.phuong_thuc_tt, tt.so_tien_tt
FROM ThanhToan tt
INNER JOIN DonHang dh ON tt.donhang_id = dh.donhang_id
INNER JOIN KhachHang kh ON dh.khachhang_id = kh.khachhang_id
ORDER BY tt.so_tien_tt DESC;

-- Câu 5: Lấy thông tin khách hàng từ vị trí thứ 2 đến thứ 4 (sắp xếp theo họ tên)
-- Giải thích: Bỏ qua 1 dòng đầu (OFFSET 1), lấy tiếp 3 dòng (vị trí 2, 3, 4)
SELECT *
FROM KhachHang
ORDER BY ho_ten ASC
LIMIT 3 OFFSET 1;

-- Câu 6: Khách hàng đã đặt ít nhất 2 đơn hàng VÀ tổng tiền thanh toán > 500.0
SELECT kh.khachhang_id, kh.ho_ten, COUNT(DISTINCT dh.donhang_id) AS so_luong_don_hang
FROM KhachHang kh
INNER JOIN DonHang dh ON kh.khachhang_id = dh.khachhang_id
INNER JOIN ThanhToan tt ON dh.donhang_id = tt.donhang_id
GROUP BY kh.khachhang_id, kh.ho_ten
HAVING COUNT(DISTINCT dh.donhang_id) >= 2
   AND SUM(tt.so_tien_tt) > 500.00;

-- Câu 7: Sản phẩm có tổng tiền thanh toán < 1000.0 VÀ có ít nhất 2 khách hàng khác nhau đã đặt
SELECT sp.sanpham_id, sp.ten_san_pham, sp.gia_ban, SUM(tt.so_tien_tt) AS tong_tien_thanh_toan
FROM SanPham sp
INNER JOIN DonHang dh ON sp.sanpham_id = dh.sanpham_id
INNER JOIN ThanhToan tt ON dh.donhang_id = tt.donhang_id
GROUP BY sp.sanpham_id, sp.ten_san_pham, sp.gia_ban
HAVING SUM(tt.so_tien_tt) < 1000.00
   AND COUNT(DISTINCT dh.khachhang_id) >= 2;

-- Câu 8: Khách hàng có tổng số tiền thanh toán lớn hơn 500.0
SELECT kh.khachhang_id, kh.ho_ten, SUM(tt.so_tien_tt) AS tong_tien_thanh_toan
FROM KhachHang kh
INNER JOIN DonHang dh ON kh.khachhang_id = dh.khachhang_id
INNER JOIN ThanhToan tt ON dh.donhang_id = tt.donhang_id
GROUP BY kh.khachhang_id, kh.ho_ten
HAVING SUM(tt.so_tien_tt) > 500.00;

-- Câu 9: Khách hàng có họ tên chứa 'Minh' HOẶC địa chỉ ở 'Hanoi', sắp xếp họ tên tăng dần
SELECT khachhang_id, ho_ten, email, so_dien_thoai, dia_chi
FROM KhachHang
WHERE ho_ten LIKE '%Minh%' OR dia_chi LIKE '%Hanoi%'
ORDER BY ho_ten ASC;

-- Câu 10: Sản phẩm giá bán giảm dần, hiển thị 3 sản phẩm tiếp theo sau 2 sản phẩm đầu (Trang 2)
SELECT sanpham_id, ten_san_pham, gia_ban
FROM SanPham
ORDER BY gia_ban DESC
LIMIT 3 OFFSET 2;

-- =============================================================================
-- PHẦN 3: TẠO VIEW (BẢNG ẢO)
-- =============================================================================

-- View 1: Sản phẩm và khách hàng đã đặt hàng trước ngày 2026-09-06
CREATE OR REPLACE VIEW view_sanpham_khachhang_dat_hang AS
SELECT sp.sanpham_id, sp.ten_san_pham, kh.khachhang_id, kh.ho_ten
FROM DonHang dh
INNER JOIN SanPham sp ON dh.sanpham_id = sp.sanpham_id
INNER JOIN KhachHang kh ON dh.khachhang_id = kh.khachhang_id
WHERE dh.ngay_dat < '2026-09-06';

-- Kiểm tra View 1:
SELECT * FROM view_sanpham_khachhang_dat_hang;

-- View 2: Khách hàng và đơn hàng đã đặt với giá bán sản phẩm > 200.0
CREATE OR REPLACE VIEW view_khachhang_donhang_gia_cao AS
SELECT kh.khachhang_id, kh.ho_ten, sp.sanpham_id, sp.gia_ban
FROM DonHang dh
INNER JOIN KhachHang kh ON dh.khachhang_id = kh.khachhang_id
INNER JOIN SanPham sp ON dh.sanpham_id = sp.sanpham_id
WHERE sp.gia_ban > 200.00;

-- Kiểm tra View 2:
SELECT * FROM view_khachhang_donhang_gia_cao;

-- =============================================================================
-- PHẦN 4: TẠO TRIGGER (BẪY LỖI & TỰ ĐỘNG HÓA SỰ KIỆN)
-- Lưu ý: Phải dùng DELIMITER $$ để bao bọc thân Trigger trong MySQL Workbench
-- =============================================================================

-- Trigger 1: Kiểm tra khi chèn DonHang, nếu ngay_giao < ngay_dat thì báo lỗi và hủy thao tác
DROP TRIGGER IF EXISTS check_insert_donhang;
DELIMITER $$
CREATE TRIGGER check_insert_donhang
BEFORE INSERT ON DonHang
FOR EACH ROW
BEGIN
    IF NEW.ngay_giao IS NOT NULL AND NEW.ngay_giao < NEW.ngay_dat THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Ngày giao không thể trước ngày đặt hàng được !';
    END IF;
END$$
DELIMITER ;

-- Trigger 2: Tự động cập nhật SanPham thành 'Ngừng bán' khi được đặt quá 30 lần trong cùng 1 ngày
DROP TRIGGER IF EXISTS update_sanpham_status_on_order;
DELIMITER $$
CREATE TRIGGER update_sanpham_status_on_order
AFTER INSERT ON DonHang
FOR EACH ROW
BEGIN
    DECLARE total_orders_today INT;
    
    -- Đếm số lần sản phẩm này được đặt trong cùng ngày vừa chèn
    SELECT COUNT(*) INTO total_orders_today
    FROM DonHang
    WHERE sanpham_id = NEW.sanpham_id
      AND ngay_dat = NEW.ngay_dat;
      
    -- Nếu vượt quá 30 lần thì cập nhật trạng thái ngừng bán
    IF total_orders_today > 30 THEN
        UPDATE SanPham
        SET trang_thai = 'Ngừng bán'
        WHERE sanpham_id = NEW.sanpham_id;
    END IF;
END$$
DELIMITER ;

-- =============================================================================
-- PHẦN 5: TẠO STORED PROCEDURE (THỦ TỤC LƯU TRỮ)
-- =============================================================================

-- Procedure 1: Thêm mới một khách hàng với đầy đủ thông tin cần thiết
DROP PROCEDURE IF EXISTS add_khachhang;
DELIMITER $$
CREATE PROCEDURE add_khachhang (
    IN p_khachhang_id VARCHAR(10),
    IN p_ho_ten VARCHAR(100),
    IN p_email VARCHAR(100),
    IN p_so_dien_thoai VARCHAR(15),
    IN p_dia_chi VARCHAR(200)
)
BEGIN
    INSERT INTO KhachHang (khachhang_id, ho_ten, email, so_dien_thoai, dia_chi)
    VALUES (p_khachhang_id, p_ho_ten, p_email, p_so_dien_thoai, p_dia_chi);
END$$
DELIMITER ;

-- Test Procedure 1:
-- CALL add_khachhang('KH009', 'Ngo Bao Chau', 'chau.ngo@example.com', '0999888777', 'Hanoi');
-- SELECT * FROM KhachHang WHERE khachhang_id = 'KH009';

-- Procedure 2: Thêm một thanh toán mới cho một đơn hàng
DROP PROCEDURE IF EXISTS add_thanhtoan;
DELIMITER $$
CREATE PROCEDURE add_thanhtoan (
    IN p_donhang_id INT,
    IN p_phuong_thuc_tt VARCHAR(50),
    IN p_so_tien_tt DECIMAL(12,2),
    IN p_ngay_tt DATE
)
BEGIN
    INSERT INTO ThanhToan (donhang_id, phuong_thuc_tt, so_tien_tt, ngay_tt)
    VALUES (p_donhang_id, p_phuong_thuc_tt, p_so_tien_tt, p_ngay_tt);
END$$
DELIMITER ;

-- Test Procedure 2:
-- CALL add_thanhtoan(1, 'E-Wallet', 380.00, '2026-09-24');
-- SELECT * FROM ThanhToan WHERE donhang_id = 1;

-- =============================================================================
-- HẾT TOÀN BỘ ĐÁP ÁN BÀI THI KOBANI (HOÀN THÀNH 100%)
-- =============================================================================
