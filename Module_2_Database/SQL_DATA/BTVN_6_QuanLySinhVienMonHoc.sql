CREATE TABLE sinh_vien (
    ma_sinh_vien VARCHAR(20) PRIMARY KEY,
    ho_ten VARCHAR(100) NOT NULL,
    ngay_sinh DATE,
    gioi_tinh VARCHAR(10)
);

CREATE TABLE mon_hoc (
    ma_mon_hoc VARCHAR(20) PRIMARY KEY,
    ten_mon_hoc VARCHAR(100) NOT NULL,
    so_tin_chi INT NOT NULL
);

CREATE TABLE dang_ky_mon_hoc (
    ma_sinh_vien VARCHAR(20),
    ma_mon_hoc VARCHAR(20),
    hoc_ky VARCHAR(20),
    PRIMARY KEY (ma_sinh_vien, ma_mon_hoc),
    FOREIGN KEY (ma_sinh_vien) REFERENCES sinh_vien(ma_sinh_vien),
    FOREIGN KEY (ma_mon_hoc) REFERENCES mon_hoc(ma_mon_hoc)
);

INSERT INTO sinh_vien (ma_sinh_vien, ho_ten, ngay_sinh, gioi_tinh) VALUES 
('SV001', 'Nguyen Van A', '2005-02-15', 'Nam'),
('SV002', 'Tran Thi B', '2005-08-20', 'Nu');

INSERT INTO mon_hoc (ma_mon_hoc, ten_mon_hoc, so_tin_chi) VALUES 
('CS101', 'Co so du lieu MySQL', 3),
('JV201', 'Lap trinh Java Nang cao', 4);

INSERT INTO dang_ky_mon_hoc (ma_sinh_vien, ma_mon_hoc, hoc_ky) VALUES 
('SV001', 'CS101', 'Ky 1 - 2026'),
('SV001', 'JV201', 'Ky 1 - 2026'),
('SV002', 'CS101', 'Ky 1 - 2026');
