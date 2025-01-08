-- Drop existing trigger and function
DROP TRIGGER IF EXISTS store_buyer_snapshot_trigger ON purchased_prototypes;
DROP FUNCTION IF EXISTS store_buyer_snapshot();

-- Create improved function to store buyer details
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
    COALESCE(p.full_name, p.display_id, 'Anonymous User'),  -- Fallback to display_id or 'Anonymous User'
    COALESCE(p.display_id, 'anonymous')  -- Fallback to 'anonymous'
  FROM profiles p
  WHERE p.id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger
CREATE TRIGGER store_buyer_snapshot_trigger
  AFTER INSERT ON purchased_prototypes
  FOR EACH ROW
  EXECUTE FUNCTION store_buyer_snapshot();