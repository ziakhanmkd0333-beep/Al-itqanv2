-- Migration: Add class_sessions table for recurring schedule
-- This table tracks the weekly schedule of classes

CREATE TABLE IF NOT EXISTS class_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE, -- Null for group classes
    enrollment_id UUID REFERENCES enrollments(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sunday, 1=Monday, etc.
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    session_type VARCHAR(20) DEFAULT 'individual' CHECK (session_type IN ('individual', 'group')),
    meeting_link TEXT,
    location TEXT,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_class_sessions_teacher ON class_sessions(teacher_id);
CREATE INDEX IF NOT EXISTS idx_class_sessions_course ON class_sessions(course_id);
CREATE INDEX IF NOT EXISTS idx_class_sessions_day ON class_sessions(day_of_week);

-- Create trigger for updated_at
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_updated_at_column') THEN
        CREATE TRIGGER update_class_sessions_updated_at BEFORE UPDATE ON class_sessions
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;
