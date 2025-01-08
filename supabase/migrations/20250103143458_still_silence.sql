/*
  # Fix database relations

  1. Changes
    - Add foreign key constraint for author_id in prototypes table
    - Update RLS policies to use auth.uid()
    - Add indexes for better query performance

  2. Security
    - Maintain existing RLS policies
    - Ensure proper access control through auth.uid()
*/

-- Add foreign key constraint for author_id
ALTER TABLE prototypes
DROP CONSTRAINT IF EXISTS prototypes_author_id_fkey,
ADD CONSTRAINT prototypes_author_id_fkey 
  FOREIGN KEY (author_id) 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;

-- Add index for author_id for better join performance
CREATE INDEX IF NOT EXISTS prototypes_author_id_idx ON prototypes(author_id);

-- Update RLS policies to ensure proper access control
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