-- Row Level Security (RLS) Policies for Enrollment-Based Access Control
-- Ensures students can ONLY access content for courses they are enrolled in

-- Enable RLS on all relevant tables
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_progress ENABLE ROW LEVEL SECURITY;

-- ============================================
-- COURSES TABLE POLICIES
-- ============================================

-- Students can only view courses they are enrolled in
CREATE POLICY "Students can view enrolled courses"
  ON courses FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM enrollments 
      WHERE enrollments.course_id = courses.id 
      AND enrollments.student_id = (SELECT id FROM students WHERE user_id = auth.uid())
      AND enrollments.status = 'active'
    )
    OR 
    -- Teachers can view courses they teach
    EXISTS (
      SELECT 1 FROM teachers 
      WHERE teachers.user_id = auth.uid() 
      AND teachers.id = courses.teacher_id
    )
    OR
    -- Admins can view all courses
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- ============================================
-- ENROLLMENTS TABLE POLICIES
-- ============================================

-- Students can only view their own enrollments
CREATE POLICY "Students can view own enrollments"
  ON enrollments FOR SELECT
  USING (
    student_id = (SELECT id FROM students WHERE user_id = auth.uid())
    OR
    -- Teachers can view enrollments for their courses
    EXISTS (
      SELECT 1 FROM courses 
      WHERE courses.id = enrollments.course_id 
      AND courses.teacher_id = (SELECT id FROM teachers WHERE user_id = auth.uid())
    )
    OR
    -- Admins can view all enrollments
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- ============================================
-- CLASS SESSIONS TABLE POLICIES
-- ============================================

-- Students can only view sessions for enrolled courses
CREATE POLICY "Students can view sessions for enrolled courses"
  ON class_sessions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM enrollments 
      WHERE enrollments.course_id = class_sessions.course_id 
      AND enrollments.student_id = (SELECT id FROM students WHERE user_id = auth.uid())
      AND enrollments.status = 'active'
    )
    OR
    -- Teachers can view sessions for their courses
    EXISTS (
      SELECT 1 FROM courses 
      WHERE courses.id = class_sessions.course_id 
      AND courses.teacher_id = (SELECT id FROM teachers WHERE user_id = auth.uid())
    )
    OR
    -- Admins can view all sessions
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- ============================================
-- MATERIALS TABLE POLICIES
-- ============================================

-- Students can only view materials for enrolled courses
CREATE POLICY "Students can view materials for enrolled courses"
  ON materials FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM enrollments 
      WHERE enrollments.course_id = materials.course_id 
      AND enrollments.student_id = (SELECT id FROM students WHERE user_id = auth.uid())
      AND enrollments.status = 'active'
    )
    OR
    -- Teachers can view materials for their courses
    EXISTS (
      SELECT 1 FROM courses 
      WHERE courses.id = materials.course_id 
      AND courses.teacher_id = (SELECT id FROM teachers WHERE user_id = auth.uid())
    )
    OR
    -- Admins can view all materials
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- ============================================
-- ASSIGNMENTS TABLE POLICIES
-- ============================================

-- Students can only view assignments for enrolled courses
CREATE POLICY "Students can view assignments for enrolled courses"
  ON assignments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM enrollments 
      WHERE enrollments.course_id = assignments.course_id 
      AND enrollments.student_id = (SELECT id FROM students WHERE user_id = auth.uid())
      AND enrollments.status = 'active'
    )
    OR
    -- Teachers can view assignments for their courses
    EXISTS (
      SELECT 1 FROM courses 
      WHERE courses.id = assignments.course_id 
      AND courses.teacher_id = (SELECT id FROM teachers WHERE user_id = auth.uid())
    )
    OR
    -- Admins can view all assignments
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- ============================================
-- ATTENDANCE TABLE POLICIES
-- ============================================

-- Students can only view their own attendance
CREATE POLICY "Students can view own attendance"
  ON attendance FOR SELECT
  USING (
    student_id = (SELECT id FROM students WHERE user_id = auth.uid())
    OR
    -- Teachers can view attendance for their course sessions
    EXISTS (
      SELECT 1 FROM class_sessions cs
      JOIN courses c ON c.id = cs.course_id
      WHERE cs.id = attendance.session_id 
      AND c.teacher_id = (SELECT id FROM teachers WHERE user_id = auth.uid())
    )
    OR
    -- Admins can view all attendance
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- ============================================
-- CERTIFICATES TABLE POLICIES
-- ============================================

-- Students can only view their own certificates
CREATE POLICY "Students can view own certificates"
  ON certificates FOR SELECT
  USING (
    student_id = (SELECT id FROM students WHERE user_id = auth.uid())
    OR
    -- Admins can view all certificates
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- ============================================
-- STUDENT PROGRESS TABLE POLICIES
-- ============================================

-- Students can only view their own progress
CREATE POLICY "Students can view own progress"
  ON student_progress FOR SELECT
  USING (
    student_id = (SELECT id FROM students WHERE user_id = auth.uid())
    OR
    -- Teachers can view progress for their course students
    EXISTS (
      SELECT 1 FROM enrollments e
      JOIN courses c ON c.id = e.course_id
      WHERE e.student_id = student_progress.student_id 
      AND c.teacher_id = (SELECT id FROM teachers WHERE user_id = auth.uid())
    )
    OR
    -- Admins can view all progress
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- ============================================
-- COMMENTS
-- ============================================
COMMENT ON POLICY "Students can view enrolled courses" ON courses IS 'Students can only see courses they are actively enrolled in';
COMMENT ON POLICY "Students can view own enrollments" ON enrollments IS 'Students can only see their own enrollment records';
COMMENT ON POLICY "Students can view sessions for enrolled courses" ON class_sessions IS 'Students can only see class sessions for courses they are enrolled in';
COMMENT ON POLICY "Students can view materials for enrolled courses" ON materials IS 'Students can only see materials for courses they are enrolled in';
COMMENT ON POLICY "Students can view assignments for enrolled courses" ON assignments IS 'Students can only see assignments for courses they are enrolled in';
COMMENT ON POLICY "Students can view own attendance" ON attendance IS 'Students can only see their own attendance records';
COMMENT ON POLICY "Students can view own certificates" ON certificates IS 'Students can only see their own certificates';
COMMENT ON POLICY "Students can view own progress" ON student_progress IS 'Students can only see their own progress records';
