-- Drop existing policies
DROP POLICY IF EXISTS "Expert users can view their sales" ON purchased_prototypes;

-- Create new policy for purchased_prototypes
CREATE POLICY "Users can view purchased prototypes"
  ON purchased_prototypes
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()  -- Users can see their own purchases
    OR EXISTS (  -- Expert users can see purchases of their prototypes
      SELECT 1 FROM prototypes p
      WHERE p.id = prototype_id
      AND p.author_id = auth.uid()
      AND EXISTS (
        SELECT 1 FROM profiles pr
        WHERE pr.id = auth.uid()
        AND pr.user_level = 'Expert'
      )
    )
  );

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_purchased_prototypes_lookup
  ON purchased_prototypes(prototype_id, user_id);