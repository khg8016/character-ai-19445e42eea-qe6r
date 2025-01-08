-- Drop existing constraints if they exist
ALTER TABLE profiles 
  DROP CONSTRAINT IF EXISTS github_url_format,
  DROP CONSTRAINT IF EXISTS youtube_url_format,
  DROP CONSTRAINT IF EXISTS twitter_url_format,
  DROP CONSTRAINT IF EXISTS linkedin_url_format;

-- Add social media profile columns
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS github_url text,
ADD COLUMN IF NOT EXISTS youtube_url text,
ADD COLUMN IF NOT EXISTS twitter_url text,
ADD COLUMN IF NOT EXISTS linkedin_url text;

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