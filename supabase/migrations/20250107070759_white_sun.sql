-- Create stored procedures for order and payment handling
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

-- Create procedure to complete payment
CREATE OR REPLACE FUNCTION complete_payment(
  p_stripe_session_id text,
  p_stripe_payment_intent_id text
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_order_id uuid;
  v_user_id uuid;
  v_credits integer;
BEGIN
  -- Get order details
  SELECT o.id, o.user_id, o.credits
  INTO v_order_id, v_user_id, v_credits
  FROM orders o
  JOIN payments p ON p.order_id = o.id
  WHERE p.transaction_id = p_stripe_session_id;

  -- Update order status
  UPDATE orders
  SET status = 'completed'
  WHERE id = v_order_id;

  -- Update payment status
  UPDATE payments
  SET 
    status = 'completed',
    transaction_id = p_stripe_payment_intent_id
  WHERE order_id = v_order_id;

  -- Add credits to user balance
  UPDATE user_credits
  SET 
    balance = balance + v_credits,
    total_purchased = total_purchased + v_credits
  WHERE user_id = v_user_id;

  -- Create credit transaction record
  INSERT INTO credit_transactions (
    user_id,
    amount,
    type,
    description,
    order_id
  ) VALUES (
    v_user_id,
    v_credits,
    'purchase',
    'Credit purchase',
    v_order_id::text
  );
END;
$$;