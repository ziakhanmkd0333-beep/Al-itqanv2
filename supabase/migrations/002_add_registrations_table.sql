-- Registration Management Migration
-- Adds registrations table and updates related tables for approval workflow

-- Create registrations table for unified student/teacher registration management
CREATE TABLE registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('student', 'teacher')),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    country VARCHAR(100),
    age INTEGER,
    language VARCHAR(10) DEFAULT 'en' CHECK (language IN ('en', 'ar', 'ur')),
    
    -- Student-specific fields
    guardian_name VARCHAR(255),
    guardian_phone VARCHAR(20),
    course_id UUID REFERENCES courses(id),
    preferred_timing VARCHAR(50),
    start_date DATE,
    
    -- Teacher-specific fields
    specialization VARCHAR(255),
    qualifications TEXT,
    experience_years INTEGER,
    languages_known TEXT[] DEFAULT '{}',
    cv_url TEXT,
    certification_url TEXT,
    bio TEXT,
    
    -- Status and approval tracking
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'inactive', 'suspended')),
    reviewed_by UUID,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    admin_notes TEXT,
    
    -- Link to original record
    original_id UUID NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add approved tracking columns to students table
ALTER TABLE students 
    ADD COLUMN IF NOT EXISTS approved_by UUID,
    ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP WITH TIME ZONE;

-- Add approved tracking columns to teachers table
ALTER TABLE teachers 
    ADD COLUMN IF NOT EXISTS approved_by UUID,
    ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP WITH TIME ZONE;

-- Create indexes for better performance
CREATE INDEX idx_registrations_email ON registrations(email);
CREATE INDEX idx_registrations_status ON registrations(status);
CREATE INDEX idx_registrations_user_type ON registrations(user_type);
CREATE INDEX idx_registrations_created_at ON registrations(created_at);
CREATE INDEX idx_registrations_original_id ON registrations(original_id);

-- Create trigger for updated_at
CREATE TRIGGER update_registrations_updated_at 
    BEFORE UPDATE ON registrations 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS on registrations table
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for registrations

-- Admins can view all registrations
CREATE POLICY "Admins can view all registrations" ON registrations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin' 
            AND users.is_active = true
        )
    );

-- Admins can insert registrations
CREATE POLICY "Admins can insert registrations" ON registrations
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin' 
            AND users.is_active = true
        )
    );

-- Admins can update registrations
CREATE POLICY "Admins can update registrations" ON registrations
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin' 
            AND users.is_active = true
        )
    );

-- Admins can delete registrations
CREATE POLICY "Admins can delete registrations" ON registrations
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin' 
            AND users.is_active = true
        )
    );

-- Users can view their own registration
CREATE POLICY "Users can view own registration" ON registrations
    FOR SELECT USING (
        original_id = auth.uid() OR
        email = (SELECT email FROM users WHERE id = auth.uid())
    );

-- Add comment for documentation
COMMENT ON TABLE registrations IS 'Unified registration management table for students and teachers with approval workflow';
