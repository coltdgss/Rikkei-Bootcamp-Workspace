CREATE TABLE mon_hoc (
    ma_mon_hoc VARCHAR(20) PRIMARY KEY,
    ten_mon_hoc VARCHAR(100) NOT NULL,
    so_tin_chi INT NOT NULL
);

INSERT INTO mon_hoc (ma_mon_hoc, ten_mon_hoc, so_tin_chi)
VALUES 
('CS101', 'Co so du lieu MySQL', 3),
('JV201', 'Lap trinh Java Core', 4),
('FE102', 'Lap trinh Web HTML/CSS', 2);
