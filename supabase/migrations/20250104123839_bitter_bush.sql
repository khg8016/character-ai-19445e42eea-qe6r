/*
  # Add Social Media Profile Fields

  1. Changes
    - Add social media profile columns to profiles table:
      - github_url: Link to GitHub profile
      - youtube_url: Link to YouTube channel
      - twitter_url: Link to X/Twitter profile
      - linkedin_url: Link to LinkedIn profile

  2. Validation
    - Add URL format validation using check constraints
*/

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