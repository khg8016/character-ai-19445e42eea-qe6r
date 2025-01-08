/*
  # Add order and payment tracking

  1. New Tables
    - `orders`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `amount` (bigint)
      - `credits` (bigint)
      - `status` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `payments`
      - `id` (uuid, primary key) 
      - `order_id` (uuid, references orders)
      - `stripe_session_id` (text)
      - `stripe_payment_intent_id` (text)
      - `amount` (bigint)
      - `status` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
*/

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  amount bigint NOT NULL,
  credits bigint NOT NULL,
  status text NOT NULL CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id),
  stripe_session_id text UNIQUE,
  stripe_payment_intent_id text UNIQUE,
  amount bigint NOT NULL,
  status text NOT NULL CHECK (status IN ('pending', 'succeeded', 'failed', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- RLS policies for orders
CREATE POLICY "Users can view own orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own orders"
  ON orders
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- RLS policies for payments
CREATE POLICY "Users can view payments for their orders"
  ON payments
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = payments.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- Function to create order and payment record
CREATE OR REPLACE FUNCTION create_order_with_payment(
  p_user_id uuid,
  p_amount bigint,
  p_credits bigint,
  p_stripe_session_id text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order_id uuid;
BEGIN
  -- Create order
  INSERT INTO orders (user_id, amount, credits, status)
  VALUES (p_user_id, p_amount, p_credits, 'pending')
  RETURNING id INTO v_order_id;

  -- Create payment
  INSERT INTO payments (order_id, stripe_session_id, amount, status)
  VALUES (v_order_id, p_stripe_session_id, p_amount, 'pending');

  RETURN v_order_id;
END;
$$;

-- Function to update payment status and complete order
CREATE OR REPLACE FUNCTION complete_payment(
  p_stripe_session_id text,
  p_stripe_payment_intent_id text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order_id uuid;
BEGIN
  -- Update payment status
  UPDATE payments
  SET status = 'succeeded',
      stripe_payment_intent_id = p_stripe_payment_intent_id,
      updated_at = now()
  WHERE stripe_session_id = p_stripe_session_id
  RETURNING order_id INTO v_order_id;

  -- Update order status
  UPDATE orders
  SET status = 'completed',
      updated_at = now()
  WHERE id = v_order_id;
END;
$$;