-- Add github_token column to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS github_token text;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_github_token 
  ON profiles(github_token) 
  WHERE github_token IS NOT NULL;