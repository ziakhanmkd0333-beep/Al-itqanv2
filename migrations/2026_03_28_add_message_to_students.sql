-- Add message column to students table for admission inquiries
-- Created: 2026-03-28

ALTER TABLE students
ADD COLUMN IF NOT EXISTS message TEXT;

-- Verify column was added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'students' 
ORDER BY ordinal_position;
