-- Add source_code_url column to prototypes table
ALTER TABLE prototypes
ADD COLUMN IF NOT EXISTS source_code_url text;

-- Create source-code bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('source-code', 'source-code', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for the source-code bucket
CREATE POLICY "Source code files are accessible to authenticated users"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'source-code' AND auth.role() = 'authenticated');

CREATE POLICY "Expert users can upload source code"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'source-code' AND
    auth.uid()::text = (storage.foldername(name))[1] AND
    (LOWER(storage.extension(name)) = 'zip') AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND user_level = 'Expert'
    )
  );

CREATE POLICY "Expert users can update their source code"
  ON storage.objects FOR UPDATE
  WITH CHECK (
    bucket_id = 'source-code' AND
    auth.uid()::text = (storage.foldername(name))[1] AND
    (LOWER(storage.extension(name)) = 'zip') AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND user_level = 'Expert'
    )
  );

CREATE POLICY "Expert users can delete their source code"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'source-code' AND
    auth.uid()::text = (storage.foldername(name))[1] AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND user_level = 'Expert'
    )
  );