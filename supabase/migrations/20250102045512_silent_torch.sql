/*
  # Add character stats creation policy

  1. Security
    - Add policy to allow authenticated users to create stats for characters they own
*/

-- Allow authenticated users to create stats for their characters
CREATE POLICY "Users can create stats for their characters"
  ON character_stats
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM characters
      WHERE characters.id = character_stats.character_id
      AND characters.created_by = auth.uid()
    )
  );