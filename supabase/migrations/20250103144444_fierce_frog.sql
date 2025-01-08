/*
  # Fix prototype relationships

  1. Changes
    - Drop and recreate foreign key constraint between prototypes and profiles
    - Add proper indexes for performance
    - Update RLS policies
*/

-- Drop existing constraint if exists
ALTER TABLE prototypes
DROP CONSTRAINT IF EXISTS prototypes_author_id_fkey;

-- Recreate the foreign key constraint
ALTER TABLE prototypes
ADD CONSTRAINT prototypes_author_id_fkey 
  FOREIGN KEY (author_id) 
  REFERENCES profiles(id) 
  ON DELETE CASCADE;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_prototypes_author_id 
  ON prototypes(author_id);

CREATE INDEX IF NOT EXISTS idx_prototypes_created_at 
  ON prototypes(created_at DESC);

-- Update RLS policies
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