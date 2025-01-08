-- Drop existing policies
DROP POLICY IF EXISTS "Users can view purchased prototypes" ON purchased_prototypes;
DROP POLICY IF EXISTS "Users can view any profile" ON profiles;

-- Create new policy for purchased_prototypes with clearer permissions
CREATE POLICY "Users can view purchased prototypes"
  ON purchased_prototypes
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()  -- Users can see their own purchases
    OR EXISTS (  -- Expert users can see purchases of their prototypes
      SELECT 1 FROM prototypes p
      JOIN profiles pr ON pr.id = auth.uid()
      WHERE p.id = prototype_id
      AND p.author_id = auth.uid()
      AND pr.user_level = 'Expert'
    )
  );

-- Create simplified profile viewing policy
CREATE POLICY "Users can view profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (true);  -- Allow all authenticated users to view profiles

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_purchased_prototypes_composite
  ON purchased_prototypes(prototype_id, user_id);

CREATE INDEX IF NOT EXISTS idx_prototypes_author_id
  ON prototypes(author_id);