-- Add RLS policies for sales history
CREATE POLICY "Expert users can view their sales"
  ON purchased_prototypes
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
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
CREATE INDEX IF NOT EXISTS idx_prototypes_author_sales
  ON prototypes(author_id);