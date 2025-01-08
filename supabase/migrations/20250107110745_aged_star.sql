-- Create a new table to store buyer information at purchase time
CREATE TABLE IF NOT EXISTS purchase_details (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_id uuid REFERENCES purchased_prototypes(id) ON DELETE CASCADE,
  buyer_name text NOT NULL,
  buyer_display_id text NOT NULL,
  purchase_amount integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create function to automatically store buyer details on purchase
CREATE OR REPLACE FUNCTION store_purchase_details()
RETURNS trigger AS $$
BEGIN
  INSERT INTO purchase_details (
    purchase_id,
    buyer_name,
    buyer_display_id,
    purchase_amount
  )
  SELECT
    NEW.id,
    COALESCE(p.full_name, p.display_id),
    p.display_id,
    pt.credit_price
  FROM profiles p
  JOIN prototypes pt ON pt.id = NEW.prototype_id
  WHERE p.id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to store buyer details
CREATE TRIGGER store_purchase_details_trigger
  AFTER INSERT ON purchased_prototypes
  FOR EACH ROW
  EXECUTE FUNCTION store_purchase_details();

-- Create view for sales history
CREATE VIEW sales_history AS
SELECT 
  pp.id as purchase_id,
  p.id as prototype_id,
  p.title as prototype_title,
  p.image_url as prototype_image,
  pd.buyer_name,
  pd.buyer_display_id,
  pd.purchase_amount,
  pp.purchased_at
FROM purchased_prototypes pp
JOIN prototypes p ON p.id = pp.prototype_id
JOIN purchase_details pd ON pd.purchase_id = pp.id;

-- Add policies for purchase details
ALTER TABLE purchase_details ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view purchase details"
  ON purchase_details
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM purchased_prototypes pp
      JOIN prototypes p ON p.id = pp.prototype_id
      WHERE pp.id = purchase_id
      AND (
        pp.user_id = auth.uid() OR
        p.author_id = auth.uid()
      )
    )
  );