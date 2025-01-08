/*
  # Initial Schema for Prototypes Application

  1. New Tables
    - `prototypes`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `image_url` (text)
      - `author_id` (uuid, references users)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `prototype_features`
      - `id` (uuid, primary key)
      - `prototype_id` (uuid, references prototypes)
      - `feature` (text)
    
    - `prototype_requirements`
      - `id` (uuid, primary key)
      - `prototype_id` (uuid, references prototypes)
      - `requirement` (text)
    
    - `prototype_tags`
      - `id` (uuid, primary key)
      - `prototype_id` (uuid, references prototypes)
      - `tag` (text)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create prototypes table
CREATE TABLE IF NOT EXISTS prototypes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  image_url text NOT NULL,
  author_id uuid REFERENCES auth.users NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create prototype_features table
CREATE TABLE IF NOT EXISTS prototype_features (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prototype_id uuid REFERENCES prototypes ON DELETE CASCADE,
  feature text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create prototype_requirements table
CREATE TABLE IF NOT EXISTS prototype_requirements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prototype_id uuid REFERENCES prototypes ON DELETE CASCADE,
  requirement text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create prototype_tags table
CREATE TABLE IF NOT EXISTS prototype_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prototype_id uuid REFERENCES prototypes ON DELETE CASCADE,
  tag text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE prototypes ENABLE ROW LEVEL SECURITY;
ALTER TABLE prototype_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE prototype_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE prototype_tags ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view prototypes"
  ON prototypes
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can create prototypes"
  ON prototypes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update their prototypes"
  ON prototypes
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

-- Policies for related tables
CREATE POLICY "Anyone can view prototype features"
  ON prototype_features
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can view prototype requirements"
  ON prototype_requirements
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can view prototype tags"
  ON prototype_tags
  FOR SELECT
  TO public
  USING (true);

-- Add function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add trigger for updated_at
CREATE TRIGGER update_prototypes_updated_at
  BEFORE UPDATE ON prototypes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();