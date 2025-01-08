-- Drop existing policies
DROP POLICY IF EXISTS "Users can view profiles" ON profiles;
DROP POLICY IF EXISTS "Users can view purchased prototypes" ON purchased_prototypes;

-- Create simplified profile viewing policy
CREATE POLICY "Users can view profiles"
  ON profiles
  FOR SELECT
  TO public  -- Allow public access to profiles
  USING (true);

-- Create separate policies for purchased prototypes
CREATE POLICY "Users can view own purchases"
  ON purchased_prototypes
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Expert users can view prototype sales"
  ON purchased_prototypes
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM prototypes p
      JOIN profiles pr ON pr.id = auth.uid()
      WHERE p.id = prototype_id
      AND p.author_id = auth.uid()
      AND pr.user_level = 'Expert'
    )
  );

-- Add helper function for checking purchases
CREATE OR REPLACE FUNCTION has_prototype_access(p_prototype_id uuid, p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM purchased_prototypes
    WHERE prototype_id = p_prototype_id
    AND user_id = p_user_id
  );
END;
$$;