/*
  # Credits System

  1. New Tables
    - `user_credits`
      - `user_id` (uuid, primary key): User ID
      - `balance` (bigint): Current credit balance
      - `created_at` (timestamptz): Record creation time
      - `updated_at` (timestamptz): Last update time

    - `credit_transactions`
      - `id` (uuid, primary key): Transaction ID
      - `user_id` (uuid): User ID
      - `amount` (bigint): Transaction amount (positive for charge, negative for use)
      - `type` (text): Transaction type (charge/use)
      - `description` (text): Transaction description
      - `created_at` (timestamptz): Transaction time

  2. Functions
    - `handle_new_user()`: Gives 100 free credits to new users
    - `add_credits()`: Safely adds credits to user balance
    - `use_credits()`: Safely deducts credits from user balance

  3. Triggers
    - `on_auth_user_created`: Triggers when new user signs up
*/

-- Create user_credits table
CREATE TABLE IF NOT EXISTS user_credits (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id),
  balance bigint NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create credit_transactions table
CREATE TABLE IF NOT EXISTS credit_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  amount bigint NOT NULL,
  type text NOT NULL CHECK (type IN ('charge', 'use')),
  description text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_credits
CREATE POLICY "Users can view own credit balance"
  ON user_credits
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS policies for credit_transactions
CREATE POLICY "Users can view own transactions"
  ON credit_transactions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Create initial credit balance
  INSERT INTO user_credits (user_id, balance)
  VALUES (NEW.id, 100);

  -- Record the initial credit transaction
  INSERT INTO credit_transactions (user_id, amount, type, description)
  VALUES (NEW.id, 100, 'charge', '회원가입 보너스 크레딧');

  RETURN NEW;
END;
$$;

-- Trigger for new user registration
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Function to add credits
CREATE OR REPLACE FUNCTION add_credits(
  user_id uuid,
  amount bigint,
  description text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Update user balance
  UPDATE user_credits
  SET balance = balance + amount,
      updated_at = now()
  WHERE user_id = add_credits.user_id;

  -- Record transaction
  INSERT INTO credit_transactions (user_id, amount, type, description)
  VALUES (add_credits.user_id, amount, 'charge', description);
END;
$$;

-- Function to use credits
CREATE OR REPLACE FUNCTION use_credits(
  user_id uuid,
  amount bigint,
  description text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_balance bigint;
BEGIN
  -- Get current balance
  SELECT balance INTO current_balance
  FROM user_credits
  WHERE user_id = use_credits.user_id
  FOR UPDATE;

  -- Check if user has enough credits
  IF current_balance >= amount THEN
    -- Update balance
    UPDATE user_credits
    SET balance = balance - amount,
        updated_at = now()
    WHERE user_id = use_credits.user_id;

    -- Record transaction
    INSERT INTO credit_transactions (user_id, amount, type, description)
    VALUES (use_credits.user_id, -amount, 'use', description);

    RETURN true;
  END IF;

  RETURN false;
END;
$$;