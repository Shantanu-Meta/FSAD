-- ============================================================
--  Seed reference data for College Admission Management System (dev / H2)
--  NOTE: Users (admin/clerk) are seeded in DataSeeder.java using the real
--  bcrypt PasswordEncoder so the hashes are always valid.
--    admin / admin123   (ADMIN)
--    clerk / clerk123   (CLERK)
-- ============================================================

-- Courses
INSERT INTO courses (course_name, course_code, duration_years, total_seats, available_seats, eligibility_criteria, is_active) VALUES
('Bachelor of Computer Applications', 'BCA', 3, 60, 60, 'Passed 10+2 with Mathematics, minimum 50% aggregate', TRUE),
('Master of Business Administration', 'MBA', 2, 40, 40, 'Bachelor degree in any discipline, minimum 55% aggregate', TRUE),
('Bachelor of Commerce', 'BCOM', 3, 80, 80, 'Passed 10+2 in Commerce stream, minimum 45% aggregate', TRUE);

-- Course fees (academic year 2024-25)
INSERT INTO course_fees (course_id, fee_type, amount, academic_year) VALUES
(1, 'Tuition', 45000.00, '2024-25'),
(1, 'Exam', 5000.00, '2024-25'),
(1, 'Library', 2000.00, '2024-25'),
(2, 'Tuition', 90000.00, '2024-25'),
(2, 'Hostel', 40000.00, '2024-25'),
(2, 'Exam', 6000.00, '2024-25'),
(3, 'Tuition', 30000.00, '2024-25'),
(3, 'Exam', 4000.00, '2024-25');

-- Subjects
INSERT INTO subjects (course_id, subject_name, subject_code, semester) VALUES
(1, 'Programming in C', 'BCA101', 1),
(1, 'Digital Logic', 'BCA102', 1),
(1, 'Data Structures', 'BCA201', 2),
(2, 'Principles of Management', 'MBA101', 1),
(2, 'Managerial Economics', 'MBA102', 1);

