/*
  # Fix prototype security policies

  1. Security Updates
    - Update RLS policies to ensure only authors can modify their own prototypes
    - Add author check to all modification policies
    - Add expert level check for prototype management

  2. Changes
    - Drop existing policies
    - Create new stricter policies
    - Add function to check expert status
*/

-- Create function to check if user is expert
CREATE OR REPLACE FUNCTION is_expert(user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = user_id
    AND user_level = 'Expert'
  );
END;
$$;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can create prototypes" ON prototypes;
DROP POLICY IF EXISTS "Authors can update their prototypes" ON prototypes;
DROP POLICY IF EXISTS "Authors can delete their prototypes" ON prototypes;

-- Create new policies with expert check
CREATE POLICY "Expert users can create prototypes"
  ON prototypes
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = author_id
    AND is_expert(auth.uid())
  );

CREATE POLICY "Authors can update their own prototypes"
  ON prototypes
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = author_id
    AND is_expert(auth.uid())
  )
  WITH CHECK (
    auth.uid() = author_id
    AND is_expert(auth.uid())
  );

CREATE POLICY "Authors can delete their own prototypes"
  ON prototypes
  FOR DELETE
  TO authenticated
  USING (
    auth.uid() = author_id
    AND is_expert(auth.uid())
  );

-- Update related table policies
DROP POLICY IF EXISTS "Authors can insert prototype features" ON prototype_features;
DROP POLICY IF EXISTS "Authors can insert prototype requirements" ON prototype_requirements;
DROP POLICY IF EXISTS "Authors can insert prototype getting started steps" ON prototype_getting_started;

CREATE POLICY "Authors can insert prototype features"
  ON prototype_features
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM prototypes 
      WHERE id = prototype_id 
      AND author_id = auth.uid()
      AND is_expert(auth.uid())
    )
  );

CREATE POLICY "Authors can insert prototype requirements"
  ON prototype_requirements
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM prototypes 
      WHERE id = prototype_id 
      AND author_id = auth.uid()
      AND is_expert(auth.uid())
    )
  );

CREATE POLICY "Authors can insert prototype getting started steps"
  ON prototype_getting_started
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM prototypes 
      WHERE id = prototype_id 
      AND author_id = auth.uid()
      AND is_expert(auth.uid())
    )
  );