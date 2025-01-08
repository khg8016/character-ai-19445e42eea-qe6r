-- Drop existing tables if they exist
DROP TABLE IF EXISTS prototype_getting_started;
DROP TABLE IF EXISTS prototype_requirements;
DROP TABLE IF EXISTS prototype_features;

-- Create prototype_features table
CREATE TABLE prototype_features (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prototype_id uuid REFERENCES prototypes ON DELETE CASCADE NOT NULL,
  feature text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create prototype_requirements table
CREATE TABLE prototype_requirements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prototype_id uuid REFERENCES prototypes ON DELETE CASCADE NOT NULL,
  requirement text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create prototype_getting_started table
CREATE TABLE prototype_getting_started (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prototype_id uuid REFERENCES prototypes ON DELETE CASCADE NOT NULL,
  step text NOT NULL,
  order_index integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE prototype_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE prototype_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE prototype_getting_started ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view prototype features"
  ON prototype_features FOR SELECT TO public
  USING (true);

CREATE POLICY "Authors can insert prototype features"
  ON prototype_features FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM prototypes WHERE id = prototype_id AND author_id = auth.uid()
  ));

CREATE POLICY "Anyone can view prototype requirements"
  ON prototype_requirements FOR SELECT TO public
  USING (true);

CREATE POLICY "Authors can insert prototype requirements"
  ON prototype_requirements FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM prototypes WHERE id = prototype_id AND author_id = auth.uid()
  ));

CREATE POLICY "Anyone can view prototype getting started steps"
  ON prototype_getting_started FOR SELECT TO public
  USING (true);

CREATE POLICY "Authors can insert prototype getting started steps"
  ON prototype_getting_started FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM prototypes WHERE id = prototype_id AND author_id = auth.uid()
  ));

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_prototype_features_prototype_id 
  ON prototype_features(prototype_id);

CREATE INDEX IF NOT EXISTS idx_prototype_requirements_prototype_id 
  ON prototype_requirements(prototype_id);

CREATE INDEX IF NOT EXISTS idx_prototype_getting_started_prototype_id 
  ON prototype_getting_started(prototype_id);

CREATE INDEX IF NOT EXISTS idx_prototype_getting_started_order 
  ON prototype_getting_started(prototype_id, order_index);