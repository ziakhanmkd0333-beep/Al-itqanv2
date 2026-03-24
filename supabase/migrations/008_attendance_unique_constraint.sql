-- Migration: Add unique constraint to attendance table
-- To prevent duplicate attendance records for the same student, teacher, course, and date
-- Requirement for the upsert logic in the API

ALTER TABLE attendance 
ADD CONSTRAINT unique_attendance_entry UNIQUE (teacher_id, student_id, course_id, date);
