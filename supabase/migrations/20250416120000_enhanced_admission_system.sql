-- Enhanced Admission System Migration
-- Adds comprehensive fields for role-based admission with Islamic education qualifications

-- 1. Add new columns to students table
ALTER TABLE students ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'student';
ALTER TABLE students ADD COLUMN IF NOT EXISTS city VARCHAR(100);
ALTER TABLE students ADD COLUMN IF NOT EXISTS full_address TEXT;
ALTER TABLE students ADD COLUMN IF NOT EXISTS profile_picture_url TEXT;
ALTER TABLE students ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE students ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE students ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT FALSE;
ALTER TABLE students ADD COLUMN IF NOT EXISTS is_flagged BOOLEAN DEFAULT FALSE;
ALTER TABLE students ADD COLUMN IF NOT EXISTS flag_reason TEXT;
ALTER TABLE students ADD COLUMN IF NOT EXISTS submitted_from_ip INET;
ALTER TABLE students ADD COLUMN IF NOT EXISTS reviewed_by UUID REFERENCES auth.users(id);
ALTER TABLE students ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE students ADD COLUMN IF NOT EXISTS review_notes TEXT;

-- 2. Create Islamic Education Qualifications table
CREATE TABLE IF NOT EXISTS islamic_education_qualifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  
  -- Nazira (Quran Reading)
  nazira_enabled BOOLEAN DEFAULT FALSE,
  nazira_details TEXT,
  nazira_institution TEXT,
  nazira_completion_year INTEGER,
  
  -- Hifz (Quran Memorization)
  hifz_enabled BOOLEAN DEFAULT FALSE,
  hifz_details TEXT,
  hifz_institution TEXT,
  hifz_completion_year INTEGER,
  hifz_juz_count INTEGER,
  
  -- Tarjama (Translation)
  tarjama_enabled BOOLEAN DEFAULT FALSE,
  tarjama_details TEXT,
  tarjama_institution TEXT,
  tarjama_completion_year INTEGER,
  
  -- Tafseer (Exegesis)
  tafseer_enabled BOOLEAN DEFAULT FALSE,
  tafseer_details TEXT,
  tafseer_institution TEXT,
  tafseer_completion_year INTEGER,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(student_id)
);

-- 3. Create Previous Education table
CREATE TABLE IF NOT EXISTS previous_education (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  education_type VARCHAR(50) NOT NULL, -- 'general' or 'islamic'
  institution_name VARCHAR(255) NOT NULL,
  degree_title VARCHAR(255),
  completion_year INTEGER,
  certificate_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create Certificates table
CREATE TABLE IF NOT EXISTS certificates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  certificate_type VARCHAR(100) NOT NULL, -- 'academic', 'islamic', 'professional'
  title VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  file_name VARCHAR(255),
  file_size INTEGER,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create Role-Specific Information table
CREATE TABLE IF NOT EXISTS role_specific_info (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL, -- 'student', 'teacher', 'imam', 'mudarris'
  
  -- Common fields
  current_class_grade VARCHAR(100),
  school_institute_name VARCHAR(255),
  school_city VARCHAR(100),
  school_address TEXT,
  
  -- For Teachers
  teaching_subject VARCHAR(255),
  years_of_experience INTEGER,
  
  -- For Imam/Khateeb
  mosque_name VARCHAR(255),
  mosque_city VARCHAR(100),
  mosque_address TEXT,
  years_serving INTEGER,
  
  -- For Mudarris
  madrasa_name VARCHAR(255),
  madrasa_city VARCHAR(100),
  madrasa_address TEXT,
  subjects_teaching TEXT[],
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, role)
);

-- 6. Create Fraud Detection Logs table
CREATE TABLE IF NOT EXISTS fraud_detection_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255),
  phone VARCHAR(50),
  ip_address INET,
  submission_count INTEGER DEFAULT 1,
  is_suspicious BOOLEAN DEFAULT FALSE,
  suspicion_reason TEXT,
  detected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_submission_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_students_role ON students(role);
CREATE INDEX IF NOT EXISTS idx_students_status ON students(status);
CREATE INDEX IF NOT EXISTS idx_students_is_approved ON students(is_approved);
CREATE INDEX IF NOT EXISTS idx_students_is_flagged ON students(is_flagged);
CREATE INDEX IF NOT EXISTS idx_students_email ON students(email);
CREATE INDEX IF NOT EXISTS idx_students_phone ON students(phone);
CREATE INDEX IF NOT EXISTS idx_islamic_qualifications_student ON islamic_education_qualifications(student_id);
CREATE INDEX IF NOT EXISTS idx_previous_education_student ON previous_education(student_id);
CREATE INDEX IF NOT EXISTS idx_certificates_student ON certificates(student_id);
CREATE INDEX IF NOT EXISTS idx_role_info_user ON role_specific_info(user_id);
CREATE INDEX IF NOT EXISTS idx_fraud_email ON fraud_detection_logs(email);
CREATE INDEX IF NOT EXISTS idx_fraud_phone ON fraud_detection_logs(phone);
CREATE INDEX IF NOT EXISTS idx_fraud_ip ON fraud_detection_logs(ip_address);

-- 8. Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 9. Create triggers for updated_at
DROP TRIGGER IF EXISTS update_islamic_qualifications_updated_at ON islamic_education_qualifications;
CREATE TRIGGER update_islamic_qualifications_updated_at
  BEFORE UPDATE ON islamic_education_qualifications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_role_specific_info_updated_at ON role_specific_info;
CREATE TRIGGER update_role_specific_info_updated_at
  BEFORE UPDATE ON role_specific_info
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 10. Update RLS policies (enable if not already enabled)
ALTER TABLE islamic_education_qualifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE previous_education ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_specific_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE fraud_detection_logs ENABLE ROW LEVEL SECURITY;

-- 11. Create RLS policies
CREATE POLICY "Admins can manage all qualifications" ON islamic_education_qualifications
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Users can view own qualifications" ON islamic_education_qualifications
  FOR SELECT USING (auth.uid() IN (SELECT user_id FROM students WHERE id = student_id));

CREATE POLICY "Admins can manage all education" ON previous_education
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Users can view own education" ON previous_education
  FOR SELECT USING (auth.uid() IN (SELECT user_id FROM students WHERE id = student_id));

CREATE POLICY "Admins can manage all certificates" ON certificates
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Users can view own certificates" ON certificates
  FOR SELECT USING (auth.uid() IN (SELECT user_id FROM students WHERE id = student_id));

CREATE POLICY "Admins can manage role info" ON role_specific_info
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Users can view own role info" ON role_specific_info
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view fraud logs" ON fraud_detection_logs
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
