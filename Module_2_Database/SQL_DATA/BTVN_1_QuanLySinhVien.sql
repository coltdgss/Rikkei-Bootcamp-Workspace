CREATE TABLE sinh_vien (
    ma_sinh_vien VARCHAR(20) PRIMARY KEY,
    ten_sinh_vien VARCHAR(100) NOT NULL,
    ngay_sinh DATE
);

INSERT INTO sinh_vien (ma_sinh_vien, ten_sinh_vien, ngay_sinh)
VALUES ('SV001', 'Nguyen Van A', '2005-02-15');