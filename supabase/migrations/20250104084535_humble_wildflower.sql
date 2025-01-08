/*
  # Configure avatar storage policies
  
  1. Security Policies
    - Enable public read access for all avatar images
    - Allow users to upload/update their own avatars
    - Restrict file types to images
    - Allow users to delete their own avatars
*/

-- Set up storage policies for the avatars bucket
CREATE POLICY "Avatar images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1] AND
    (LOWER(storage.extension(name)) = ANY (ARRAY['jpg', 'jpeg', 'png', 'webp']))
  );

CREATE POLICY "Users can update their own avatar"
  ON storage.objects FOR UPDATE
  WITH CHECK (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1] AND
    (LOWER(storage.extension(name)) = ANY (ARRAY['jpg', 'jpeg', 'png', 'webp']))
  );

CREATE POLICY "Users can delete their own avatar"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );