-- Migration: Add user_id column to students table for authentication integration
-- This links approved students to their user records in the users table

-- Add user_id column to students table
ALTER TABLE students 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_students_user_id ON students(user_id);

-- Add comment for documentation
COMMENT ON COLUMN students.user_id IS 'Reference to the user record in users table for authentication';
