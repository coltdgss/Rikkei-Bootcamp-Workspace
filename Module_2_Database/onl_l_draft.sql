CREATE DATABASE IF NOT EXISTS student_db;
USE student_db;

CREATE TABLE IF NOT EXISTS classes(
	id INT PRIMARY KEY AUTO_INCREMENT,
	class_name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS students(
	id_std INT PRIMARY KEY AUTO_INCREMENT,
	full_name VARCHAR(200) NOT NULL,
	age INT NOT NULL CHECK(age > 0),
	email VARCHAR(255) NOT NULL UNIQUE,
	date_create datetime default current_timestamp,
    class_id INT,
    FOREIGN KEY (class_id) REFERENCES classes(id)
);

-- Chỉnh sửa dữ liệu tuổi của bảng ghi thứ 2 thành 50 tuổi
UPDATE students
SET age = 50
WHERE id_std = 2;
-- Xóa bảng ghi đối với sinh viên có tuổi bằng 35
SET SQL_SAFE_UPDATES = 0;

DELETE 
FROM students
WHERE age = 35;

SET SQL_SAFE_UPDATES = 1;
-- Xóa bảng ghi đối với sinh viên tên bắt đầu bằng chữ "t"
DELETE 
FROM students
WHERE full_name LIKE "%t";
-- Lấy ra tên ở bảng ghi thứ 1
SELECT full_name
FROM students
WHERE id_std = 1;

-- Lấy ra tên những sv có tuổi lớn hơn 25.
SELECT full_name as 'Tên', age as 'Tuổi', email
FROM students
WHERE age > 25;

SELECT distinct * 
FROM students
WHERE age > 25;

SELECT count(id_std) as "Số lượng sinh viên có tuổi trên 25"
FROM students
WHERE age > 25;

SELECT max(age) 
FROM students
WHERE age > 25;
-- 

INSERT INTO classes()
VALUES (NULL,'CNTT1'),
(NULL, 'CNTT2'),
(NULL, 'CNTT3');

INSERT INTO students () 
VALUES 
	(null, "Sơn Tùng", 29, "tung1@gmail.com", default, 1),
	(null, "Quốc Tuấn", 45, "tuan@gmail.com", default, 1),
	(null, "Quốc Hai", 25, "hai@gmail.com", default, 2),
	(null, "Gia Bảo", 43, "bao@gmail.com", default, 3);

-- Lấy ra những sinh viên đang học ở lớp cntt1
SELECT std.full_name, std.email, cls.class_name
FROM students as std
INNER JOIN classes as cls
ON std.class_id = cls.id
WHERE cls.class_name = 'CNTT1';

-- Lấy ra những sinh viên đang học ở lớp cntt1
SELECT *
FROM students, classes
WHERE classes.class_name = 'CNTT1';

-- Thống kê xem mỗi lớp có bao nhiêu sinh viên
SELECT classes.class_name, COUNT(students.id_std)
FROM students
INNER JOIN classes
ON classes.id = students.class_id
GROUP BY classes.class_name;
-- Thống kê xem mỗi lớp có bao nhiêu sinh viên, nhưng chỉ hiển thị lớp có trên 3 sinh viên
SELECT classes.class_name, COUNT(students.id_std)
FROM students
INNER JOIN classes
ON classes.id = students.class_id
GROUP BY classes.class_name
HAVING COUNT(students.id_std) > 1;

-- Lấy ds tên các lớp kèm số lượng sinh viên từng lớp và sắp xếp kết quả theo thứ tự tăng dần
SELECT classes.class_name, COUNT(students.id_std)
FROM students
INNER JOIN classes
ON classes.id = students.class_id
GROUP BY classes.class_name
ORDER BY COUNT(students.id_std) DESC;

-- Yêu cầu 1: Lấy ra những sinh viên có tuổi lớn hơn 30 và đang học CNTT1, sau đó sắp xếp tăng dần theo tuổi
SELECT std.full_name, std.age, cls.class_name
FROM students as std
INNER JOIN classes as cls
ON std.class_id = cls.id
WHERE cls.class_name = 'CNTT1' and std.age >30
ORDER BY std.age ASC;

-- Yêu cầu 2: Đếm số lượng Sinh viên có tuổi trên 25
SELECT COUNT(id_std) AS so_luong_sv
FROM students
WHERE age > 25;

-- Yêu cầu 3: Lấy ra sinh viên có tuổi cao nhất và học ở CNTT1
SELECT std.full_name, std.age, cls.class_name
FROM students as std
INNER JOIN classes as cls
ON std.class_id = cls.id
WHERE cls.class_name = 'CNTT1' and std.age >30
ORDER BY std.age DESC
LIMIT 1;