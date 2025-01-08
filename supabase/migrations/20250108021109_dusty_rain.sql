/*
  # Add user GitHub deployments table
  
  1. New Tables
    - `user_github_deployments`
      - `id` (uuid, primary key) 
      - `user_id` (uuid, references profiles)
      - `prototype_id` (uuid, references prototypes)
      - `github_url` (text)
      - `created_at` (timestamptz)
  
  2. Security
    - Enable RLS
    - Add policies for user access
*/

-- Create user_github_deployments table
CREATE TABLE user_github_deployments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  prototype_id uuid REFERENCES prototypes(id) ON DELETE CASCADE NOT NULL,
  github_url text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, prototype_id)
);

-- Enable RLS
ALTER TABLE user_github_deployments ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own deployments"
  ON user_github_deployments
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own deployments"
  ON user_github_deployments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Add indexes
CREATE INDEX idx_user_github_deployments_user_prototype
  ON user_github_deployments(user_id, prototype_id);

-- Drop github_url from prototypes if it exists
ALTER TABLE prototypes 
DROP COLUMN IF EXISTS github_url;