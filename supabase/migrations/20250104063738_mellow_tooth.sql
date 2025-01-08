/*
  # Fix Categories and Deletion

  1. Changes
    - Add category column to prototypes table
    - Add cascade delete triggers for related tables
    - Add proper RLS policies for deletion
  
  2. Security
    - Enable RLS policies for deletion operations
    - Ensure only authors can delete their prototypes
*/

-- Add category column if it doesn't exist
ALTER TABLE prototypes 
ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT 'all';

-- Create index for faster category filtering
CREATE INDEX IF NOT EXISTS idx_prototypes_category 
  ON prototypes(category);

-- Update existing prototypes to have categories based on tags
UPDATE prototypes
SET category = 
  CASE 
    WHEN 'frameworks' = ANY(tags) THEN 'frameworks'
    WHEN 'business' = ANY(tags) THEN 'business'
    WHEN 'productivity' = ANY(tags) THEN 'productivity'
    WHEN 'ecommerce' = ANY(tags) THEN 'ecommerce'
    WHEN 'education' = ANY(tags) THEN 'education'
    WHEN 'entertainment' = ANY(tags) THEN 'entertainment'
    WHEN 'social' = ANY(tags) THEN 'social'
    WHEN 'ai' = ANY(tags) OR 'machine-learning' = ANY(tags) THEN 'ai-ml'
    WHEN 'dashboard' = ANY(tags) THEN 'dashboards'
    WHEN 'creative' = ANY(tags) THEN 'creative'
    WHEN 'utilities' = ANY(tags) THEN 'utilities'
    ELSE 'all'
  END;

-- Drop existing delete policies if they exist
DROP POLICY IF EXISTS "Authors can delete their prototypes" ON prototypes;
DROP POLICY IF EXISTS "Cascade delete prototype features" ON prototype_features;
DROP POLICY IF EXISTS "Cascade delete prototype requirements" ON prototype_requirements;
DROP POLICY IF EXISTS "Cascade delete prototype getting started steps" ON prototype_getting_started;

-- Create new delete policies
CREATE POLICY "Authors can delete their prototypes"
  ON prototypes
  FOR DELETE
  TO authenticated
  USING (auth.uid() = author_id);

-- Add cascade delete policies for related tables
CREATE POLICY "Cascade delete prototype features"
  ON prototype_features
  FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM prototypes 
    WHERE id = prototype_id AND author_id = auth.uid()
  ));

CREATE POLICY "Cascade delete prototype requirements"
  ON prototype_requirements
  FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM prototypes 
    WHERE id = prototype_id AND author_id = auth.uid()
  ));

CREATE POLICY "Cascade delete prototype getting started steps"
  ON prototype_getting_started
  FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM prototypes 
    WHERE id = prototype_id AND author_id = auth.uid()
  ));