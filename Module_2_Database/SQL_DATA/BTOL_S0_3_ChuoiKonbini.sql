-- =============================================================================
-- SESSION 00 - BÀI TẬP ONLINE 3 (BTOL_3): QUẢN LÝ CHUỖI KONBINI
-- Tổng hợp toàn diện: DDL, Ràng buộc, DML, Truy vấn, View, Index, Stored Procedure
-- Học viên: Nguyễn Văn Trung | Workspace: Rikkei Bootcamp
-- =============================================================================

-- Gõ các câu lệnh DDL để tạo database 
-- Bước 1 : Tạo Database 
-- Câu lệnh để tạo tên database : (CREATE DATABASE ten_database)
CREATE DATABASE Chuoi_Konbini;  

-- Bước 2 : Nhảy vào kho để thao tác với kho (USE ten_database)
USE Chuoi_Konbini;

-- Bước 3 : Đi tạo các bảng có trong DATABASE (Bảng sản phẩm , bảng kho)
--  CREATE TABLE ten_bang có trong database 

-- Kiểu dữ liệu trong MySQL :
-- Chữ : VARCHAR(255) => chuỗi này max là 255 ký tự 
-- Số : INT => Lưu trữ số 
-- Ngày tháng DATE 

CREATE TABLE Kho (
	ma_kho INT PRIMARY KEY,
    dia_chi_kho VARCHAR(255) NOT NULL 
);

-- PRIMARY KEY , NOT NULL , CHECK , UNIQUE (Độc nhất) ,
-- DEFAULT (Gán mặc định) giá trị 
-- => Được gọi chung là Contranstaint (Ràng buộc)

CREATE TABLE San_Pham (
	ma_san_pham VARCHAR(5) PRIMARY KEY,
    ten_san_pham VARCHAR(200) NOT NULL,
    gia_san_pham INT CHECK (gia_san_pham > 0),
    ma_kho_san_pham INT,
    FOREIGN KEY (ma_kho_san_pham) REFERENCES Kho(ma_kho)
);

--  Sửa thuộc tính của bảng (Dùng từ khóa ALTER)
ALTER TABLE Kho ADD so_dien_thoai_kho VARCHAR(11);

-- Xóa dữ liệu bảng , hoặc database (DROP)
-- DROP DATABASE Chuoi_Konbini;



-- Buổi hôm trước : DML (Thêm , sửa , xóa , cập nhật dữ liệu vào trong bảng) , DDL (Các bước thao tác thêm, sửa , xóa bảng)
-- Thêm một hàng dữ liệu vào bảng sản phẩm (Thêm một sản phẩm vào bảng sản phẩm)

SELECT * FROM kho;

--  INSERT : Thêm dữ liệu vào bảng 
INSERT INTO kho (ma_kho, dia_chi_kho , so_dien_thoai_kho) VALUES
	(1,"Tokoy","099999999"),
	(2,"Osaka","098888888");

-- INSERT : THÊM DỮ LIỆU VÀO BẢNG sản phẩm 
INSERT INTO san_pham (ma_san_pham, ten_san_pham, gia_san_pham , ma_kho_san_pham) VALUES
	("SP001","Cà Phê", 19999 , 1),
	("SP002","Mỳ Tôm", 39999 , 2),
    ("SP003","Cơm", 9999 , 1),
    ("SP004","Bánh Mỳ", 199999 , 1);

SELECT * FROM san_pham;

-- Sửa giá sản phẩm "Mỳ Tôm" thêm 10000 
UPDATE san_pham
SET gia_san_pham = gia_san_pham + 10000
WHERE ten_san_pham = "Mỳ Tôm";

-- Xóa một bản ghi ra khỏi bảng 
-- Xóa sản phẩm có ma_san_pham là "SP004" 

DELETE FROM san_pham
WHERE ma_san_pham = "SP004";

-- Sắp xếp dữ liệu 
-- In ra các sẩn phẩm theo thứ tự tăng dần của giá tiền 

SELECT * FROM san_pham ORDER BY gia_san_pham;

-- In ra sản phẩm có giá tiền cao nhất 
SELECT * FROM san_pham ORDER BY gia_san_pham DESC LIMIT 3;

-- alias : ĐẶT biệt danh , MAX, Min , AVG , SUM 

SELECT ma_san_pham AS MaSanPham FROM san_pham;

-- GROUP BY , HAVING

-- JOIN (LEFT JOIN , INNER JOIN , RIGHT JOIN): Nối bảng 

SELECT *
FROM san_pham AS sp
INNER JOIN kho AS k 
ON sp.ma_kho_san_pham = k.ma_kho;

-- View là một câu lệnh SELECT được đặt cho một cái tên lưu lại trong Database catalog 

CREATE VIEW view_ten_san_pham AS 
SELECT ten_san_pham FROM san_pham;

SELECT * FROM view_ten_san_pham;

CREATE VIEW view_toan_bo_thong_tin_join_2_bang AS 
SELECT *
FROM san_pham AS sp
INNER JOIN kho AS k 
ON sp.ma_kho_san_pham = k.ma_kho;

SELECT * FROM view_toan_bo_thong_tin_join_2_bang;

DROP VIEW view_ten_san_pham;

-- 
CREATE VIEW view_demo_du_lieu_san_pham_cho_khach_hang  AS
SELECT ten_san_pham , ma_san_pham 
FROM san_pham;

SELECT * FROM view_demo_du_lieu_san_pham_cho_khach_hang;


-- Tạo một view chứa các sản phẩm có giá tiền lớn hơn 20000

-- Tạo một view có thể xem được ten_san_pham , ma_san_pham , dia_chi_kho , so_dien_thoai_kho

SELECT * FROM san_pham;
-- Đánh Index (Chỉ mục) : Giúp tăng tốc độ tìm kiếm , truy vấn dữ liệu từ bảng  

CREATE INDEX idx_ten_san_pham  
ON san_pham(ten_san_pham);

-- Xóa Chỉ Mục 
DROP INDEX idx_ten_san_pham ON san_pham;

SELECT * FROM san_pham 
WHERE ten_san_pham = "Cơm";


-- STORED PROCEDURE : chính là hàm trong cơ sở dữ liệu 
-- Tham số , IF ELSE 

DELIMITER $$
CREATE PROCEDURE laydanhsachsanpham()
BEGIN
	SELECT * FROM san_pham;
END
$$ DELIMITER ;

-- GỌi procedure 
CALL laydanhsachsanpham();


-- Tạo một Procedure : để tìm kiếm thông tin sản phẩm theo mã sản phẩm 
-- Tham số : IN , OUT 

DELIMITER $$
CREATE PROCEDURE timkiemthongtinsanpham(IN sp_ma_san_pham VARCHAR(10))
BEGIN 
	SELECT * FROM san_pham 
    WHERE ma_san_pham = sp_ma_san_pham;
END
$$ DELIMITER ;

CALL timkiemthongtinsanpham("SP002") ;

-- Tạo một procedure lấy tất cả thông tin sản phẩm có giá tiền lớn hơn 10000 


-- Tạo ra một procedue trả về một giá trị  
-- Tạo một  procedue trả về số lượng các sản phẩm đang có 

DELIMITER $$
CREATE PROCEDURE soluongsanpham(OUT p_tong INT)
BEGIN 
	SELECT COUNT(*) INTO p_tong
    FROM san_pham ;
END
$$ DELIMITER ;

-- Lưu vào một vào một biến  
CALL soluongsanpham(@so_luong_san_pham);
SELECT @so_luong_san_pham AS SoLuongSanPhamCoTrongKho;

--  tạo một procedure trả về giá trị tổng tiền của toàn bộ sản phẩm có trong san_pham 
