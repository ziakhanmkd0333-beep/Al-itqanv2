-- Create storage bucket for admission files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('admission-files', 'admission-files', true)
ON CONFLICT (id) DO NOTHING;

-- Policy to allow authenticated users to upload files
CREATE POLICY "Allow authenticated uploads" ON storage.objects
  FOR INSERT TO authenticated 
  WITH CHECK (bucket_id = 'admission-files');

-- Policy to allow public read access
CREATE POLICY "Allow public read" ON storage.objects
  FOR SELECT USING (bucket_id = 'admission-files');

-- Policy to allow authenticated users to delete their own files
CREATE POLICY "Allow authenticated delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'admission-files');
