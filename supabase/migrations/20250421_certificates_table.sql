-- Drop table if exists (clean slate)
DROP TABLE IF EXISTS public.certificates;

-- Create certificates table to store uploaded certificate URLs
CREATE TABLE public.certificates (
  id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL,
  file_url TEXT NOT NULL,
  file_name TEXT,
  file_type TEXT,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  CONSTRAINT fk_certificates_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own certificates
CREATE POLICY "Users can view own certificates"
  ON public.certificates
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Allow authenticated users to insert their own certificates
CREATE POLICY "Users can insert own certificates"
  ON public.certificates
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Admins can view all certificates
CREATE POLICY "Admins can view all certificates"
  ON public.certificates
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- Add index for faster queries
CREATE INDEX idx_certificates_user_id ON public.certificates(user_id);
CREATE INDEX idx_certificates_created_at ON public.certificates(created_at);
