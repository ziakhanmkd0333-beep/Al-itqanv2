-- Migration: Add last_login column to users table
-- Required for login tracking

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE;

-- Add comment
COMMENT ON COLUMN users.last_login IS 'Timestamp of the last successful login';
