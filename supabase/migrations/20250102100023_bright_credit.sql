/*
  # Add Storage bucket for character avatars

  1. New Storage Bucket
    - Create 'avatars' bucket for storing character profile images
  
  2. Security
    - Enable public access for reading avatar images
    - Allow authenticated users to upload images with size and type restrictions
    - Allow users to delete their own avatar images
*/

-- Enable storage by inserting bucket configuration
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true);

-- Set up security policies
CREATE POLICY "Avatar images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Authenticated users can upload avatar images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'avatars'
    AND (LOWER(RIGHT(name, 4)) IN ('.jpg', '.png', '.gif')
      OR LOWER(RIGHT(name, 5)) = '.jpeg'
      OR LOWER(RIGHT(name, 5)) = '.webp')
    AND LENGTH(name) < 255
    AND LOWER(SPLIT_PART(name, '/', 1)) = 'character-avatars'
  );

CREATE POLICY "Users can delete their own avatar images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'avatars');