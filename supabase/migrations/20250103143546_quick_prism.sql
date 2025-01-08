/*
  # Fix profile relations

  1. Changes
    - Add foreign key from prototypes to profiles
    - Update join queries to use profiles table
    - Add indexes for better performance

  2. Security
    - Maintain existing RLS policies
*/

-- Drop existing foreign key if exists
ALTER TABLE prototypes
DROP CONSTRAINT IF EXISTS prototypes_author_id_fkey;

-- Add foreign key to profiles table
ALTER TABLE prototypes
ADD CONSTRAINT prototypes_author_id_fkey 
  FOREIGN KEY (author_id) 
  REFERENCES profiles(id) 
  ON DELETE CASCADE;

-- Add index for better join performance
CREATE INDEX IF NOT EXISTS prototypes_author_id_idx ON prototypes(author_id);