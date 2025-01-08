-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view profiles in sales context" ON profiles;
DROP POLICY IF EXISTS "Users can view any profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Create new policies
CREATE POLICY "Users can view any profile"
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

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);