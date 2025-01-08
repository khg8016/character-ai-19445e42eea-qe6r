/*
  # Credits System Tables

  1. New Tables
    - user_credits: Stores user credit balances
      - id (uuid, primary key)
      - user_id (uuid, references profiles)
      - balance (integer)
      - total_purchased (integer)
      - total_spent (integer)
      - created_at (timestamp)
      - updated_at (timestamp)
    
    - credit_transactions: Stores credit transaction history
      - id (uuid, primary key)
      - user_id (uuid, references profiles)
      - amount (integer)
      - type (enum: purchase, spend, refund)
      - description (text)
      - order_id (text, optional)
      - created_at (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to view their own data
*/

-- Create transaction type enum
CREATE TYPE credit_transaction_type AS ENUM ('purchase', 'spend', 'refund');

-- Create user_credits table
CREATE TABLE user_credits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  balance integer NOT NULL DEFAULT 0,
  total_purchased integer NOT NULL DEFAULT 0,
  total_spent integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT positive_balance CHECK (balance >= 0)
);

-- Create credit_transactions table
CREATE TABLE credit_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  amount integer NOT NULL,
  type credit_transaction_type NOT NULL,
  description text NOT NULL,
  order_id text,
  created_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX idx_user_credits_user_id ON user_credits(user_id);
CREATE INDEX idx_credit_transactions_user_id ON credit_transactions(user_id);
CREATE INDEX idx_credit_transactions_created_at ON credit_transactions(created_at DESC);

-- Enable RLS
ALTER TABLE user_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own credit balance"
  ON user_credits FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own transactions"
  ON credit_transactions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add trigger for updated_at
CREATE TRIGGER update_user_credits_updated_at
  BEFORE UPDATE ON user_credits
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create initial credit balance for existing users
INSERT INTO user_credits (user_id)
SELECT id FROM profiles
ON CONFLICT DO NOTHING;

-- Create function to handle new user credit balance
CREATE OR REPLACE FUNCTION handle_new_user_credits()
RETURNS trigger AS $$
BEGIN
  INSERT INTO user_credits (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new users
CREATE TRIGGER on_user_created_add_credits
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user_credits();