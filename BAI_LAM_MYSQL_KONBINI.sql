-- BAI LAM DOC LAP: DATABASE FUNDAMENTALS - MYSQL - CHUOI_KONBINI
DROP DATABASE IF EXISTS Chuoi_Konbini;
CREATE DATABASE Chuoi_Konbini;
USE Chuoi_Konbini;

CREATE TABLE Kho (
    ma_kho INT PRIMARY KEY,
    dia_chi_kho VARCHAR(255) NOT NULL,
    so_dien_thoai_kho VARCHAR(11)
);

CREATE TABLE San_Pham (
    ma_san_pham VARCHAR(5) PRIMARY KEY,
    ten_san_pham VARCHAR(200) NOT NULL,
    gia_san_pham INT NOT NULL,
    ma_kho_san_pham INT NOT NULL,
    CONSTRAINT chk_gia_san_pham CHECK (gia_san_pham > 0),
    CONSTRAINT fk_sanpham_kho
        FOREIGN KEY (ma_kho_san_pham) REFERENCES Kho(ma_kho)
);

INSERT INTO Kho VALUES
(1, 'Tokyo', '099999999'),
(2, 'Osaka', '088888888'),
(3, 'Nagoya', '077777777');

INSERT INTO San_Pham VALUES
('SP001', 'Mỳ Tôm', 15000, 1),
('SP002', 'Cơm', 25000, 1),
('SP003', 'Bánh Snack', 18000, 2),
('SP004', 'Nước uống', 12000, 3),
('SP005', 'Sữa', 30000, 2);

UPDATE San_Pham
SET gia_san_pham = gia_san_pham + 10000
WHERE ten_san_pham = 'Mỳ Tôm';

DELETE FROM San_Pham
WHERE ma_san_pham = 'SP005';

SELECT * FROM San_Pham;
SELECT * FROM San_Pham ORDER BY gia_san_pham DESC LIMIT 3;
SELECT * FROM San_Pham WHERE gia_san_pham > 20000;

SELECT sp.ma_san_pham, sp.ten_san_pham, sp.gia_san_pham,
       k.dia_chi_kho, k.so_dien_thoai_kho
FROM San_Pham AS sp
INNER JOIN Kho AS k
ON sp.ma_kho_san_pham = k.ma_kho;

SELECT *
FROM San_Pham
WHERE ma_kho_san_pham IN
    (SELECT ma_kho FROM Kho WHERE ma_kho <= 2);

CREATE VIEW view_san_pham_cho_khach_hang AS
SELECT ten_san_pham, ma_san_pham
FROM San_Pham;

SELECT * FROM view_san_pham_cho_khach_hang;

CREATE INDEX idx_ten_san_pham
ON San_Pham(ten_san_pham);

EXPLAIN ANALYZE
SELECT * FROM San_Pham
WHERE ten_san_pham = 'Cơm';

DROP INDEX idx_ten_san_pham ON San_Pham;

DELIMITER $$

CREATE PROCEDURE laydanhsachsanpham()
BEGIN
    SELECT * FROM San_Pham;
END $$

CREATE PROCEDURE timkiemthongtinsanpham(IN sp_ma_san_pham VARCHAR(10))
BEGIN
    SELECT * FROM San_Pham
    WHERE ma_san_pham = sp_ma_san_pham;
END $$

CREATE PROCEDURE soluongsanpham(OUT p_tong INT)
BEGIN
    SELECT COUNT(*) INTO p_tong FROM San_Pham;
END $$

DELIMITER ;

CALL laydanhsachsanpham();
CALL timkiemthongtinsanpham('SP002');
CALL soluongsanpham(@so_luong_san_pham);
SELECT @so_luong_san_pham AS SoLuongSanPhamCoTrongKho;
