-- Add password_hash column to students table
ALTER TABLE students ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);

-- Add guardian fields to students table if not exists
ALTER TABLE students ADD COLUMN IF NOT EXISTS guardian_name VARCHAR(255);
ALTER TABLE students ADD COLUMN IF NOT EXISTS guardian_phone VARCHAR(20);

-- Add start_date to admissions if not exists
ALTER TABLE admissions ADD COLUMN IF NOT EXISTS start_date DATE;

-- Update RLS policy to allow service role to insert
CREATE POLICY "Service role can insert students" ON students
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Service role can insert admissions" ON admissions
    FOR INSERT WITH CHECK (true);
