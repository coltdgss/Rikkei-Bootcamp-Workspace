CREATE TABLE khach_hang (
    ma_khach VARCHAR(20) PRIMARY KEY,
    ten_khach VARCHAR(100) NOT NULL,
    so_dien_thoai VARCHAR(20)
);

CREATE TABLE san_pham (
    ma_san_pham VARCHAR(20) PRIMARY KEY,
    ten_san_pham VARCHAR(150) NOT NULL,
    gia_ban FLOAT NOT NULL
);

CREATE TABLE hoa_don (
    ma_hoa_don VARCHAR(20) PRIMARY KEY,
    ngay_mua DATE,
    tong_tien FLOAT,
    ma_khach VARCHAR(20),
    FOREIGN KEY (ma_khach) REFERENCES khach_hang(ma_khach)
);

CREATE TABLE chi_tiet_mua_hang (
    ma_hoa_don VARCHAR(20),
    ma_san_pham VARCHAR(20),
    so_luong INT NOT NULL,
    PRIMARY KEY (ma_hoa_don, ma_san_pham),
    FOREIGN KEY (ma_hoa_don) REFERENCES hoa_don(ma_hoa_don),
    FOREIGN KEY (ma_san_pham) REFERENCES san_pham(ma_san_pham)
);

INSERT INTO khach_hang (ma_khach, ten_khach, so_dien_thoai) VALUES 
('KH01', 'Nguyen Van Trung', '0987654321'),
('KH02', 'Le Thi Mai', '0912345678');

INSERT INTO san_pham (ma_san_pham, ten_san_pham, gia_ban) VALUES 
('SP01', 'Ban phim co Gaming', 1200000),
('SP02', 'Chuot khong day Ergonomic', 650000);

INSERT INTO hoa_don (ma_hoa_don, ngay_mua, tong_tien, ma_khach) VALUES 
('HD01', '2026-09-15', 1850000, 'KH01');

INSERT INTO chi_tiet_mua_hang (ma_hoa_don, ma_san_pham, so_luong) VALUES 
('HD01', 'SP01', 1),
('HD01', 'SP02', 1);
