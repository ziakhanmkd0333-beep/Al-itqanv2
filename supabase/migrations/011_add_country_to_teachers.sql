-- Migration: Add country column to teachers table
-- Required for profile management

ALTER TABLE teachers 
ADD COLUMN IF NOT EXISTS country VARCHAR(100);

-- Add comment
COMMENT ON COLUMN teachers.country IS 'Country of residence of the teacher';
