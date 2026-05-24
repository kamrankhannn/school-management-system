-- ============================================================
-- School Management System - Database Schema
-- For shared hosting (InfinityFree, 000webhost, etc.):
-- 1. Create the database manually in your hosting control panel
-- 2. Click on the database in phpMyAdmin FIRST, then Import this file
-- DO NOT run CREATE DATABASE here — it's not allowed on shared hosts
-- ============================================================

-- -----------------------------------------------
-- Users Table (Auth for all roles)
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin','teacher','student') NOT NULL DEFAULT 'student',
    profile_pic VARCHAR(255) DEFAULT NULL,
    status ENUM('active','inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- -----------------------------------------------
-- Classes Table
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS classes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    class_name VARCHAR(100) NOT NULL,
    section VARCHAR(10) NOT NULL,
    teacher_id INT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- -----------------------------------------------
-- Students Table
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    roll_number VARCHAR(50) NOT NULL UNIQUE,
    class_id INT DEFAULT NULL,
    date_of_birth DATE DEFAULT NULL,
    phone VARCHAR(20) DEFAULT NULL,
    address TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- -----------------------------------------------
-- Teachers Table
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS teachers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    employee_id VARCHAR(50) NOT NULL UNIQUE,
    subject VARCHAR(100) DEFAULT NULL,
    phone VARCHAR(20) DEFAULT NULL,
    qualification VARCHAR(150) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------
-- Subjects Table
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS subjects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    subject_name VARCHAR(100) NOT NULL,
    class_id INT NOT NULL,
    teacher_id INT DEFAULT NULL,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
    FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- -----------------------------------------------
-- Attendance Table
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    class_id INT NOT NULL,
    date DATE NOT NULL,
    status ENUM('present','absent','late') DEFAULT 'present',
    marked_by INT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_attendance (student_id, class_id, date),
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
    FOREIGN KEY (marked_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- -----------------------------------------------
-- Grades Table
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS grades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    subject_id INT NOT NULL,
    marks_obtained DECIMAL(5,2) DEFAULT 0,
    total_marks DECIMAL(5,2) DEFAULT 100,
    grade_letter VARCHAR(5) DEFAULT NULL,
    exam_type ENUM('midterm','final','quiz','assignment') DEFAULT 'midterm',
    remarks TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------
-- Notices Table
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS notices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    posted_by INT NOT NULL,
    target_role ENUM('all','student','teacher') DEFAULT 'all',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (posted_by) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------
-- Seed Data: Default Admin
-- Password: Admin@123 (bcrypt hashed)
-- -----------------------------------------------
INSERT INTO users (full_name, email, password, role, status) VALUES
('Super Admin', 'admin@school.com', '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'active'),
('John Smith', 'teacher@school.com', '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'teacher', 'active'),
('Ali Hassan', 'student@school.com', '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student', 'active');

INSERT INTO classes (class_name, section, teacher_id) VALUES
('Grade 10', 'A', 2),
('Grade 11', 'B', 2);

INSERT INTO teachers (user_id, employee_id, subject, phone, qualification) VALUES
(2, 'EMP-001', 'Mathematics', '0300-0000001', 'M.Sc Mathematics');

INSERT INTO students (user_id, roll_number, class_id, date_of_birth, phone) VALUES
(3, 'STU-001', 1, '2008-03-15', '0300-0000002');

INSERT INTO subjects (subject_name, class_id, teacher_id) VALUES
('Mathematics', 1, 2),
('English', 1, 2),
('Physics', 1, 2),
('Chemistry', 1, 2);

INSERT INTO notices (title, content, posted_by, target_role) VALUES
('Welcome to the New Academic Year', 'We are excited to welcome all students and teachers to the new academic year. Please check your schedules.', 1, 'all'),
('Midterm Exams Schedule', 'Midterm examinations will begin on June 15th. All students must report 30 minutes before their scheduled time.', 1, 'student');
