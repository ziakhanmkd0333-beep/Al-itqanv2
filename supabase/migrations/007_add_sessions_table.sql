-- Migration: Add sessions table to track scheduled classes
-- This table is required for teacher and student dashboards

CREATE TABLE IF NOT EXISTS sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    title VARCHAR(255),
    description TEXT,
    scheduled_date DATE NOT NULL,
    scheduled_time TIME NOT NULL,
    duration_minutes INTEGER DEFAULT 30,
    meeting_link TEXT,
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'ongoing', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_sessions_teacher ON sessions(teacher_id);
CREATE INDEX IF NOT EXISTS idx_sessions_course ON sessions(course_id);
CREATE INDEX IF NOT EXISTS idx_sessions_date ON sessions(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_sessions_status ON sessions(status);

-- Create trigger for updated_at
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_updated_at_column') THEN
        CREATE TRIGGER update_sessions_updated_at BEFORE UPDATE ON sessions
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;
