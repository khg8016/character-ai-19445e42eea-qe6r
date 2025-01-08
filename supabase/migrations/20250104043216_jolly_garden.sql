-- Add DELETE policy for prototypes table
CREATE POLICY "Authors can delete their prototypes"
  ON prototypes
  FOR DELETE
  TO authenticated
  USING (auth.uid() = author_id);

-- Add DELETE policies for related tables
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