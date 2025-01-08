/*
  # Add prototype tags support

  1. Changes
    - Add tags array column to prototypes table
    - Update existing RLS policies

  2. Security
    - Maintain existing RLS policies for prototypes table
*/

-- Add tags array column to prototypes table
ALTER TABLE prototypes 
ADD COLUMN IF NOT EXISTS tags text[] NOT NULL DEFAULT '{}';

-- Create index for tags search
CREATE INDEX IF NOT EXISTS prototypes_tags_gin_idx ON prototypes USING gin(tags);

-- Update RLS policies to include tags
DROP POLICY IF EXISTS "Anyone can view prototypes" ON prototypes;
CREATE POLICY "Anyone can view prototypes"
  ON prototypes
  FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "Users can create prototypes" ON prototypes;
CREATE POLICY "Users can create prototypes"
  ON prototypes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "Authors can update their prototypes" ON prototypes;
CREATE POLICY "Authors can update their prototypes"
  ON prototypes
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);