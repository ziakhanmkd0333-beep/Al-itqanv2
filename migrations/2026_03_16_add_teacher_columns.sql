-- Add missing columns to teachers table for teacher registration
-- Created: 2026-03-16

-- Add certification_url column
ALTER TABLE teachers
ADD COLUMN IF NOT EXISTS certification_url TEXT;

-- Add bio column (if not exists)
ALTER TABLE teachers
ADD COLUMN IF NOT EXISTS bio TEXT;

-- Verify columns
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'teachers' 
ORDER BY ordinal_position;
