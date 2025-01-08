-- Create prototypes bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('prototypes', 'prototypes', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for the prototypes bucket
CREATE POLICY "Prototype images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'prototypes');

CREATE POLICY "Expert users can upload prototype images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'prototypes' AND
    auth.uid()::text = (storage.foldername(name))[1] AND
    (LOWER(storage.extension(name)) = ANY (ARRAY['jpg', 'jpeg', 'png', 'webp'])) AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND user_level = 'Expert'
    )
  );

CREATE POLICY "Expert users can update their prototype images"
  ON storage.objects FOR UPDATE
  WITH CHECK (
    bucket_id = 'prototypes' AND
    auth.uid()::text = (storage.foldername(name))[1] AND
    (LOWER(storage.extension(name)) = ANY (ARRAY['jpg', 'jpeg', 'png', 'webp'])) AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND user_level = 'Expert'
    )
  );

CREATE POLICY "Expert users can delete their prototype images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'prototypes' AND
    auth.uid()::text = (storage.foldername(name))[1] AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND user_level = 'Expert'
    )
  );