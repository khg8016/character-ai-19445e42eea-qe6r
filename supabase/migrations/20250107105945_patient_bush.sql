-- Add policy for viewing buyer profiles in sales context
CREATE POLICY "Users can view profiles in sales context"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    id = auth.uid()  -- Users can see their own profile
    OR id IN (  -- Or profiles of users who bought their prototypes
      SELECT pp.user_id 
      FROM purchased_prototypes pp
      JOIN prototypes p ON pp.prototype_id = p.id
      WHERE p.author_id = auth.uid()
    )
  );

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_purchased_prototypes_user
  ON purchased_prototypes(user_id);