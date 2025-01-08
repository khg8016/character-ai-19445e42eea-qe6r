-- Drop existing function first
DROP FUNCTION IF EXISTS use_credits(uuid, bigint, text);

-- Recreate the function with fixed parameter names and error handling
CREATE OR REPLACE FUNCTION use_credits(
  p_user_id uuid,
  p_amount bigint,
  p_description text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_balance bigint;
BEGIN
  -- Get current balance with error handling
  SELECT balance INTO current_balance
  FROM user_credits
  WHERE user_id = p_user_id;

  -- Return false if user not found
  IF NOT FOUND THEN
    RETURN false;
  END IF;

  -- Check if user has enough credits
  IF current_balance >= p_amount THEN
    -- Update balance
    UPDATE user_credits
    SET balance = balance - p_amount,
        updated_at = now()
    WHERE user_id = p_user_id;

    -- Record transaction
    INSERT INTO credit_transactions (user_id, amount, type, description)
    VALUES (p_user_id, p_amount, 'use', p_description);

    RETURN true;
  END IF;

  RETURN false;
END;
$$;