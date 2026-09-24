-- =============================================================================
-- BTVN Session 03 - Bài 5: Quản lý khóa học trực tuyến (Giảng viên, Khóa học & Đăng ký)
-- Nguồn: Giáo trình chuẩn RK-MODULE2-DATABASE · Session 03 DDL Basics
-- =============================================================================

-- 1. Bảng Giảng viên (instructors)
CREATE TABLE instructors (
    instructor_id VARCHAR(20) PRIMARY KEY,
    instructor_name VARCHAR(100) NOT NULL,
    specialty VARCHAR(100),                -- Chuyên môn: Java, SQL, AI, Cloud...
    email VARCHAR(100) UNIQUE NOT NULL
);

-- 2. Bảng Khóa học (courses)
CREATE TABLE courses (
    course_id VARCHAR(20) PRIMARY KEY,
    course_title VARCHAR(150) NOT NULL,
    price DECIMAL(10,2) CHECK (price >= 0),
    duration_hours INT CHECK (duration_hours > 0),
    instructor_id VARCHAR(20) NOT NULL,
    FOREIGN KEY (instructor_id) REFERENCES instructors(instructor_id)
);

-- 3. Bảng Học viên (students)
CREATE TABLE students (
    student_id VARCHAR(20) PRIMARY KEY,
    student_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL
);

-- 4. Bảng Đăng ký khóa học (enrollments - Quan hệ N-N)
CREATE TABLE enrollments (
    enrollment_id INT PRIMARY KEY,
    student_id VARCHAR(20) NOT NULL,
    course_id VARCHAR(20) NOT NULL,
    enroll_date DATE NOT NULL,
    rating_score INT CHECK (rating_score BETWEEN 1 AND 5), -- Điểm đánh giá 1-5 sao
    payment_status VARCHAR(20) DEFAULT 'Paid' CHECK (payment_status IN ('Pending', 'Paid', 'Refunded')),
    FOREIGN KEY (student_id) REFERENCES students(student_id),
    FOREIGN KEY (course_id) REFERENCES courses(course_id)
);

-- Dữ liệu kiểm thử
INSERT INTO instructors VALUES
('INS01', 'Ths. Nguyen Van Quang', 'Backend Architecture & Database', 'quang.nv@rikkei.edu.vn'),
('INS02', 'Ks. Tran Bao Chau', 'Fullstack JavaScript & React', 'chau.tb@rikkei.edu.vn');

INSERT INTO courses VALUES
('CRS01', 'MySQL Database Masterclass 2025', 1800000, 48, 'INS01'),
('CRS02', 'Java Core & Spring Boot Pro', 2500000, 72, 'INS01');

INSERT INTO students VALUES
('STD01', 'Do Tien Dat', 'dat.dt@gmail.com'),
('STD02', 'Vu Hong Nhung', 'nhung.vh@gmail.com');

INSERT INTO enrollments VALUES
(1, 'STD01', 'CRS01', '2025-03-01', 5, 'Paid'),
(2, 'STD02', 'CRS01', '2025-03-02', 4, 'Paid'),
(3, 'STD01', 'CRS02', '2025-03-05', NULL, 'Pending');

SELECT * FROM courses;
SELECT * FROM enrollments;
