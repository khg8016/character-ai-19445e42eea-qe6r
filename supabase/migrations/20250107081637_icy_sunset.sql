/*
  # Add credit-based prototype purchasing

  1. New Columns
    - Add credit_price to prototypes table
    - Add purchased_prototypes table to track ownership

  2. Functions
    - Add purchase_prototype function for handling purchases
    - Add check_prototype_ownership function

  3. Security
    - Enable RLS on purchased_prototypes
    - Add policies for purchase tracking
*/

-- Add credit price to prototypes
ALTER TABLE prototypes
ADD COLUMN IF NOT EXISTS credit_price integer NOT NULL DEFAULT 1
CHECK (credit_price > 0);

-- Create purchased prototypes table
CREATE TABLE IF NOT EXISTS purchased_prototypes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  prototype_id uuid REFERENCES prototypes(id) ON DELETE CASCADE NOT NULL,
  purchased_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id, prototype_id)
);

-- Enable RLS
ALTER TABLE purchased_prototypes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their purchased prototypes"
  ON purchased_prototypes FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create purchase function
CREATE OR REPLACE FUNCTION purchase_prototype(
  p_prototype_id uuid,
  p_user_id uuid,
  p_credits integer
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if user has enough credits
  IF NOT EXISTS (
    SELECT 1 FROM user_credits 
    WHERE user_id = p_user_id 
    AND balance >= p_credits
  ) THEN
    RAISE EXCEPTION 'Insufficient credits';
  END IF;

  -- Check if user already owns the prototype
  IF EXISTS (
    SELECT 1 FROM purchased_prototypes
    WHERE user_id = p_user_id
    AND prototype_id = p_prototype_id
  ) THEN
    RAISE EXCEPTION 'Prototype already purchased';
  END IF;

  -- Create purchase record
  INSERT INTO purchased_prototypes (
    user_id,
    prototype_id
  ) VALUES (
    p_user_id,
    p_prototype_id
  );

  -- Deduct credits
  UPDATE user_credits
  SET 
    balance = balance - p_credits,
    total_spent = total_spent + p_credits
  WHERE user_id = p_user_id;

  -- Record transaction
  INSERT INTO credit_transactions (
    user_id,
    amount,
    type,
    description
  ) VALUES (
    p_user_id,
    p_credits * -1,
    'spend',
    'Prototype purchase'
  );
END;
$$;

-- Create ownership check function
CREATE OR REPLACE FUNCTION check_prototype_ownership(
  p_prototype_id uuid,
  p_user_id uuid
) RETURNS boolean
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

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_purchased_prototypes_user_id 
  ON purchased_prototypes(user_id);
CREATE INDEX IF NOT EXISTS idx_purchased_prototypes_prototype_id 
  ON purchased_prototypes(prototype_id);
CREATE INDEX IF NOT EXISTS idx_prototypes_credit_price 
  ON prototypes(credit_price);

-- Update existing prototypes with random credit prices
UPDATE prototypes 
SET credit_price = floor(random() * 10 + 1)::integer
WHERE credit_price = 1;