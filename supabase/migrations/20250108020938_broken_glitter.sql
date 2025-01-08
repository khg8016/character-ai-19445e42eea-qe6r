/*
  # Add GitHub URL column
  
  1. Changes
    - Add github_url column to prototypes table
    - Add index for faster lookups
*/

-- Add github_url column if it doesn't exist
ALTER TABLE prototypes
ADD COLUMN IF NOT EXISTS github_url text;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_prototypes_github_url 
  ON prototypes(github_url) 
  WHERE github_url IS NOT NULL;