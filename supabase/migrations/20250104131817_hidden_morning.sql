/*
  # Add social media profile fields

  1. New Fields
    - github_url: GitHub profile URL
    - youtube_url: YouTube channel URL  
    - twitter_url: Twitter/X profile URL
    - linkedin_url: LinkedIn profile URL

  2. Validation
    - Add URL format validation for each social media field
    - Each field allows NULL values (optional)
    - Strict URL pattern matching for each platform
*/

-- Add social media profile columns if they don't exist
DO $$ 
BEGIN
  -- Add columns if they don't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'github_url') THEN
    ALTER TABLE profiles ADD COLUMN github_url text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'youtube_url') THEN
    ALTER TABLE profiles ADD COLUMN youtube_url text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'twitter_url') THEN
    ALTER TABLE profiles ADD COLUMN twitter_url text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'linkedin_url') THEN
    ALTER TABLE profiles ADD COLUMN linkedin_url text;
  END IF;

  -- Drop existing constraints if they exist
  ALTER TABLE profiles 
    DROP CONSTRAINT IF EXISTS github_url_format,
    DROP CONSTRAINT IF EXISTS youtube_url_format,
    DROP CONSTRAINT IF EXISTS twitter_url_format,
    DROP CONSTRAINT IF EXISTS linkedin_url_format;

  -- Add URL format validation
  ALTER TABLE profiles
    ADD CONSTRAINT github_url_format CHECK (
      github_url IS NULL OR 
      github_url ~ '^https?:\/\/(www\.)?github\.com\/[A-Za-z0-9_-]+\/?$'
    ),
    ADD CONSTRAINT youtube_url_format CHECK (
      youtube_url IS NULL OR 
      youtube_url ~ '^https?:\/\/(www\.)?(youtube\.com\/(c\/|channel\/|user\/)?|youtu\.be\/)[A-Za-z0-9_-]+\/?'
    ),
    ADD CONSTRAINT twitter_url_format CHECK (
      twitter_url IS NULL OR 
      twitter_url ~ '^https?:\/\/(www\.)?(twitter\.com|x\.com)\/[A-Za-z0-9_]+\/?$'
    ),
    ADD CONSTRAINT linkedin_url_format CHECK (
      linkedin_url IS NULL OR 
      linkedin_url ~ '^https?:\/\/(www\.)?linkedin\.com\/(in|company)\/[A-Za-z0-9_-]+\/?$'
    );
END $$;