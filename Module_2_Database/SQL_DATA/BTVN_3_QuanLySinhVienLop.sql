CREATE TABLE lop_hoc (
    ma_lop VARCHAR(20) PRIMARY KEY,
    ten_lop VARCHAR(100) NOT NULL
);

CREATE TABLE sinh_vien (
    ma_sinh_vien VARCHAR(20) PRIMARY KEY,
    ten_sinh_vien VARCHAR(100) NOT NULL,
    ma_lop VARCHAR(20),
    FOREIGN KEY (ma_lop) REFERENCES lop_hoc(ma_lop)
);

INSERT INTO lop_hoc (ma_lop, ten_lop) VALUES 
('L01', 'Lop CNTT K01'),
('L02', 'Lop Web Frontend K02');

INSERT INTO sinh_vien (ma_sinh_vien, ten_sinh_vien, ma_lop) VALUES 
('SV001', 'Nguyen Van A', 'L01'),
('SV002', 'Tran Thi B', 'L01'),
('SV003', 'Le Van C', 'L02');
