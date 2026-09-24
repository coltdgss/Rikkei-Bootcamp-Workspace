CREATE TABLE doc_gia (
    ma_doc_gia VARCHAR(20) PRIMARY KEY,
    ten_doc_gia VARCHAR(100) NOT NULL
);

CREATE TABLE sach (
    ma_sach VARCHAR(20) PRIMARY KEY,
    ten_sach VARCHAR(150) NOT NULL
);

CREATE TABLE muon_sach (
    ma_doc_gia VARCHAR(20),
    ma_sach VARCHAR(20),
    ngay_muon DATE,
    PRIMARY KEY (ma_doc_gia, ma_sach),
    FOREIGN KEY (ma_doc_gia) REFERENCES doc_gia(ma_doc_gia),
    FOREIGN KEY (ma_sach) REFERENCES sach(ma_sach)
);

INSERT INTO doc_gia (ma_doc_gia, ten_doc_gia) VALUES 
('DG01', 'Nguyen Van A'),
('DG02', 'Tran Thi B');

INSERT INTO sach (ma_sach, ten_sach) VALUES 
('S001', 'Nhap mon Co so du lieu'),
('S002', 'Thiet ke Web chuyen sau');

INSERT INTO muon_sach (ma_doc_gia, ma_sach, ngay_muon) VALUES 
('DG01', 'S001', '2026-09-10'),
('DG01', 'S002', '2026-09-12'),
('DG02', 'S001', '2026-09-14');
