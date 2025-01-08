/*
  # Add preview URL to prototypes

  1. Changes
    - Add preview_url column to prototypes table
    - Update existing RLS policies
*/

-- Add preview_url column
ALTER TABLE prototypes
ADD COLUMN IF NOT EXISTS preview_url text;

-- Update RLS policies to include preview_url
DROP POLICY IF EXISTS "Authors can update their prototypes" ON prototypes;
CREATE POLICY "Authors can update their prototypes"
  ON prototypes
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);