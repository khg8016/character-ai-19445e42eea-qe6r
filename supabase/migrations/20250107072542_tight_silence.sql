-- Drop existing function if it exists
DROP FUNCTION IF EXISTS create_order_with_payment;

-- Create stored procedure for order and payment handling
CREATE OR REPLACE FUNCTION create_order_with_payment(
  p_user_id uuid,
  p_amount integer,
  p_credits integer,
  p_stripe_session_id text
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_order_id uuid;
BEGIN
  -- Create order
  INSERT INTO orders (
    user_id,
    amount,
    credits,
    status
  ) VALUES (
    p_user_id,
    p_amount,
    p_credits,
    'pending'
  ) RETURNING id INTO v_order_id;

  -- Create payment record
  INSERT INTO payments (
    order_id,
    amount,
    payment_method,
    status,
    transaction_id
  ) VALUES (
    v_order_id,
    p_amount,
    'stripe',
    'pending',
    p_stripe_session_id
  );

  RETURN v_order_id;
END;
$$;