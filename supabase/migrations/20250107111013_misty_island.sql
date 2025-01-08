-- Create a new table to store buyer information at purchase time
CREATE TABLE IF NOT EXISTS purchase_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_id uuid REFERENCES purchased_prototypes(id) ON DELETE CASCADE,
  buyer_id uuid REFERENCES profiles(id),
  buyer_name text NOT NULL,
  buyer_display_id text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create function to automatically store buyer details on purchase
CREATE OR REPLACE FUNCTION store_buyer_snapshot()
RETURNS trigger AS $$
BEGIN
  INSERT INTO purchase_snapshots (
    purchase_id,
    buyer_id,
    buyer_name,
    buyer_display_id
  )
  SELECT
    NEW.id,
    NEW.user_id,
    COALESCE(p.full_name, p.display_id),
    p.display_id
  FROM profiles p
  WHERE p.id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to store buyer details
CREATE TRIGGER store_buyer_snapshot_trigger
  AFTER INSERT ON purchased_prototypes
  FOR EACH ROW
  EXECUTE FUNCTION store_buyer_snapshot();

-- Enable RLS
ALTER TABLE purchase_snapshots ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own purchase snapshots"
  ON purchase_snapshots
  FOR SELECT
  TO authenticated
  USING (buyer_id = auth.uid());

CREATE POLICY "Expert users can view snapshots of their prototype sales"
  ON purchase_snapshots
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM purchased_prototypes pp
      JOIN prototypes p ON p.id = pp.prototype_id
      JOIN profiles pr ON pr.id = auth.uid()
      WHERE pp.id = purchase_id
      AND p.author_id = auth.uid()
      AND pr.user_level = 'Expert'
    )
  );

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_purchase_snapshots_purchase_id
  ON purchase_snapshots(purchase_id);
CREATE INDEX IF NOT EXISTS idx_purchase_snapshots_buyer_id
  ON purchase_snapshots(buyer_id);