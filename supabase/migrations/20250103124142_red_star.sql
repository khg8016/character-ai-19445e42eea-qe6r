-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own credit balance" ON user_credits;
DROP POLICY IF EXISTS "Users can view own transactions" ON credit_transactions;

-- Recreate policies with explicit table references
CREATE POLICY "Users can view own credit balance"
  ON user_credits
  FOR SELECT
  TO authenticated
  USING (user_credits.user_id = auth.uid());

CREATE POLICY "Users can view own transactions"
  ON credit_transactions
  FOR SELECT
  TO authenticated
  USING (credit_transactions.user_id = auth.uid());

-- First drop the existing function
DROP FUNCTION IF EXISTS add_credits(uuid, bigint, text);

-- Then recreate the function with explicit table references
CREATE OR REPLACE FUNCTION add_credits(
  p_user_id uuid,
  p_amount bigint,
  p_description text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Update user balance with explicit table reference
  UPDATE user_credits
  SET balance = balance + p_amount,
      updated_at = now()
  WHERE user_credits.user_id = p_user_id;

  -- Record transaction with explicit table reference
  INSERT INTO credit_transactions (user_id, amount, type, description)
  VALUES (p_user_id, p_amount, 'charge', p_description);
END;
$$;