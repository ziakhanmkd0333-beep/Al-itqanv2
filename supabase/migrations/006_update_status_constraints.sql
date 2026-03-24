-- Migration: Update status constraints for students and teachers
-- To support the approval workflow (pending, approved, rejected)

-- Update students table status constraint
ALTER TABLE students DROP CONSTRAINT IF EXISTS students_status_check;
ALTER TABLE students ADD CONSTRAINT students_status_check 
    CHECK (status IN ('pending', 'approved', 'active', 'inactive', 'suspended', 'rejected'));

-- Update teachers table status constraint
ALTER TABLE teachers DROP CONSTRAINT IF EXISTS teachers_status_check;
ALTER TABLE teachers ADD CONSTRAINT teachers_status_check 
    CHECK (status IN ('pending', 'approved', 'active', 'inactive', 'rejected'));

-- Provide default values for existing records if needed
UPDATE students SET status = 'active' WHERE status IS NULL;
UPDATE teachers SET status = 'active' WHERE status IS NULL;
