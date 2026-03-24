-- Migration: Add user_id column to teachers table for authentication integration
-- This links approved teachers to their user records in the users table

-- Add user_id column to teachers table
ALTER TABLE teachers 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_teachers_user_id ON teachers(user_id);

-- Add comment for documentation
COMMENT ON COLUMN teachers.user_id IS 'Reference to the user record in users table for authentication';
