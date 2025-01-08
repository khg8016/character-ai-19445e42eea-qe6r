-- Drop existing policies
DROP POLICY IF EXISTS "Users can view purchased prototypes" ON purchased_prototypes;
DROP POLICY IF EXISTS "Users can view profiles" ON profiles;

-- Create clearer policies with explicit join conditions
CREATE POLICY "Users can view purchased prototypes"
  ON purchased_prototypes
  FOR SELECT
  TO authenticated
  USING (
    -- Users can see their own purchases
    user_id = auth.uid() 
    OR 
    -- Expert users can see purchases of their prototypes
    EXISTS (
      SELECT 1 FROM prototypes p
      WHERE p.id = prototype_id
      AND p.author_id = auth.uid()
    )
  );

-- Create simple profile viewing policy
CREATE POLICY "Users can view profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (true);

-- Add function to check if user is prototype author
CREATE OR REPLACE FUNCTION is_prototype_author(prototype_id uuid, user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM prototypes
    WHERE id = prototype_id
    AND author_id = user_id
  );
END;
$$;