-- Al-NOOR Academy Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Students Table
CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    country VARCHAR(100) NOT NULL,
    age INTEGER NOT NULL,
    language VARCHAR(10) DEFAULT 'en' CHECK (language IN ('en', 'ar', 'ur')),
    enrolled_courses UUID[] DEFAULT '{}',
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Teachers Table
CREATE TABLE teachers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    specialization VARCHAR(255) NOT NULL,
    credentials TEXT,
    bio TEXT,
    assigned_courses UUID[] DEFAULT '{}',
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    avatar_url TEXT,
    whatsapp VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Courses Table
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    level VARCHAR(50) NOT NULL CHECK (level IN ('Beginner', 'Intermediate', 'Advanced', 'Specialized')),
    category VARCHAR(100) NOT NULL CHECK (category IN ('Quran', 'Arabic Language', 'Fiqh', 'Sarf & Nahw', 'Hadith')),
    description TEXT NOT NULL,
    fee_min DECIMAL(10,2) NOT NULL,
    fee_max DECIMAL(10,2) NOT NULL,
    fee_currency VARCHAR(10) DEFAULT 'USD',
    duration VARCHAR(100) NOT NULL,
    schedule VARCHAR(255) NOT NULL,
    prerequisites TEXT,
    next_course VARCHAR(255),
    learning_outcomes TEXT[] DEFAULT '{}',
    core_books TEXT[] DEFAULT '{}',
    image_url TEXT,
    status VARCHAR(20) DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
    teacher_id UUID REFERENCES teachers(id),
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admissions Table
CREATE TABLE admissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'deferred')),
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_by UUID REFERENCES teachers(id),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    preferred_timing VARCHAR(50),
    guardian_name VARCHAR(255),
    guardian_phone VARCHAR(20),
    guardian_relation VARCHAR(50),
    message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payments Table
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    method VARCHAR(50) NOT NULL CHECK (method IN ('stripe', 'paypal', 'bank_transfer')),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('paid', 'pending', 'failed', 'overdue')),
    transaction_id VARCHAR(255),
    paid_at TIMESTAMP WITH TIME ZONE,
    due_date TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Attendance Table
CREATE TABLE attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('present', 'absent', 'late')),
    notes TEXT,
    session_notes TEXT,
    materials_uploaded TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Certificates Table
CREATE TABLE certificates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    certificate_number VARCHAR(255) UNIQUE NOT NULL,
    issued_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    download_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Course Materials Table
CREATE TABLE course_materials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_url TEXT NOT NULL,
    file_type VARCHAR(50),
    file_size INTEGER,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Student Progress Table
CREATE TABLE student_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage BETWEEN 0 AND 100),
    lessons_completed INTEGER DEFAULT 0,
    total_lessons INTEGER DEFAULT 0,
    last_accessed TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Announcements Table
CREATE TABLE announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    audience VARCHAR(20) DEFAULT 'all' CHECK (audience IN ('all', 'students', 'teachers', 'admins')),
    is_active BOOLEAN DEFAULT true,
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_students_email ON students(email);
CREATE INDEX idx_students_status ON students(status);
CREATE INDEX idx_teachers_email ON teachers(email);
CREATE INDEX idx_courses_slug ON courses(slug);
CREATE INDEX idx_courses_category ON courses(category);
CREATE INDEX idx_courses_status ON courses(status);
CREATE INDEX idx_admissions_status ON admissions(status);
CREATE INDEX idx_admissions_student ON admissions(student_id);
CREATE INDEX idx_payments_student ON payments(student_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_attendance_student ON attendance(student_id);
CREATE INDEX idx_attendance_teacher ON attendance(teacher_id);
CREATE INDEX idx_attendance_date ON attendance(date);
CREATE INDEX idx_certificates_student ON certificates(student_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teachers_updated_at BEFORE UPDATE ON teachers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admissions_updated_at BEFORE UPDATE ON admissions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_attendance_updated_at BEFORE UPDATE ON attendance
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_course_materials_updated_at BEFORE UPDATE ON course_materials
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_student_progress_updated_at BEFORE UPDATE ON student_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_announcements_updated_at BEFORE UPDATE ON announcements
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO teachers (id, full_name, email, specialization, credentials, bio, status) VALUES
('00000000-0000-0000-0000-000000000001', 'Dr. Noor Ur Rahman Hazarvi', 'scholar@alnooracademy.com', 'Quran & Hadith', 'PhD - IIU Islamabad, Khārij Jamia Banori Town', 'Senior scholar with 20+ years teaching experience', 'active');

-- Insert sample courses
INSERT INTO courses (id, title, slug, level, category, description, fee_min, fee_max, duration, schedule, prerequisites, next_course, image_url, status, teacher_id, "order") VALUES
('00000000-0000-0000-0000-000000000001', 'Noorani Qaida Course', 'noorani-qaida', 'Beginner', 'Quran', 'Learn to read Quran from basics with correct pronunciation', 20, 30, '2-3 Months', '3-5 days/week · 30 min', 'None', 'Nazra Quran', '/images/noorani_qaida_1769312153641.png', 'published', '00000000-0000-0000-0000-000000000001', 1);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE admissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_progress ENABLE ROW LEVEL SECURITY;

-- Students policies
CREATE POLICY "Students can view own record" ON students
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Students can update own record" ON students
    FOR UPDATE USING (auth.uid() = id);

-- Teachers policies
CREATE POLICY "Teachers can view own record" ON teachers
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Teachers can update own record" ON teachers
    FOR UPDATE USING (auth.uid() = id);

-- Courses policies
CREATE POLICY "Published courses are viewable by all" ON courses
    FOR SELECT USING (status = 'published');

CREATE POLICY "Teachers can view all courses" ON courses
    FOR SELECT USING (EXISTS (SELECT 1 FROM teachers WHERE id = auth.uid()));

-- Admissions policies
CREATE POLICY "Students can view own admissions" ON admissions
    FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Students can create admissions" ON admissions
    FOR INSERT WITH CHECK (auth.uid() = student_id);

-- Payments policies
CREATE POLICY "Students can view own payments" ON payments
    FOR SELECT USING (auth.uid() = student_id);

-- Attendance policies
CREATE POLICY "Students can view own attendance" ON attendance
    FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Teachers can view assigned attendance" ON attendance
    FOR SELECT USING (auth.uid() = teacher_id);

-- Certificates policies
CREATE POLICY "Students can view own certificates" ON certificates
    FOR SELECT USING (auth.uid() = student_id);

-- Course materials policies
CREATE POLICY "Students can view materials for enrolled courses" ON course_materials
    FOR SELECT USING (
        is_public = true OR 
        EXISTS (
            SELECT 1 FROM student_progress 
            WHERE student_id = auth.uid() 
            AND course_id = course_materials.course_id
        )
    );

-- Student progress policies
CREATE POLICY "Students can view own progress" ON student_progress
    FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Students can update own progress" ON student_progress
    FOR UPDATE USING (auth.uid() = student_id);
