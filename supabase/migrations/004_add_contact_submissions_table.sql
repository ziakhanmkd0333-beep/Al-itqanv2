-- Create contact_submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Allow public to insert
CREATE POLICY "Anyone can submit a contact form" ON contact_submissions
    FOR INSERT WITH CHECK (true);

-- Only admins can see submissions
CREATE POLICY "Admins can view all contact submissions" ON contact_submissions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- Trigger for updated_at
CREATE TRIGGER update_contact_submissions_updated_at BEFORE UPDATE ON contact_submissions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
