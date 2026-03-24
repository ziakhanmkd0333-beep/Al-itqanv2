-- Migration: Add RLS policy for contact_submissions
-- Allow any visitor to submit the contact form

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'contact_submissions' 
        AND policyname = 'Allow public insert'
    ) THEN
        CREATE POLICY "Allow public insert" ON contact_submissions
        FOR INSERT WITH CHECK (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'contact_submissions' 
        AND policyname = 'Allow admin service role select'
    ) THEN
        CREATE POLICY "Allow admin service role select" ON contact_submissions
        FOR SELECT USING (true);
    END IF;
END $$;
