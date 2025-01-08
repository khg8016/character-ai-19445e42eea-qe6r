-- Drop existing trigger and function
DROP TRIGGER IF EXISTS store_buyer_snapshot_trigger ON purchased_prototypes;
DROP FUNCTION IF EXISTS store_buyer_snapshot();

-- Create improved function to store buyer details
CREATE OR REPLACE FUNCTION store_buyer_snapshot()
RETURNS trigger AS $$
DECLARE
  v_buyer_name text;
  v_buyer_display_id text;
BEGIN
  -- Get buyer details with fallbacks
  SELECT 
    COALESCE(full_name, display_id, 'Anonymous User'),
    COALESCE(display_id, 'anonymous')
  INTO v_buyer_name, v_buyer_display_id
  FROM profiles
  WHERE id = NEW.user_id;

  -- Insert snapshot with non-null values
  INSERT INTO purchase_snapshots (
    purchase_id,
    buyer_id,
    buyer_name,
    buyer_display_id
  ) VALUES (
    NEW.id,
    NEW.user_id,
    v_buyer_name,
    v_buyer_display_id
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger
CREATE TRIGGER store_buyer_snapshot_trigger
  AFTER INSERT ON purchased_prototypes
  FOR EACH ROW
  EXECUTE FUNCTION store_buyer_snapshot();

-- Update existing records that might have null values
UPDATE purchase_snapshots ps
SET 
  buyer_name = COALESCE(p.full_name, p.display_id, 'Anonymous User'),
  buyer_display_id = COALESCE(p.display_id, 'anonymous')
FROM profiles p
WHERE ps.buyer_id = p.id
AND (ps.buyer_name IS NULL OR ps.buyer_display_id IS NULL);