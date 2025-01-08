/*
  # Add credits for existing users
  
  1. Changes
    - Adds initial credit balance for existing users
    - Creates initial credit transaction records
    - Uses safe INSERT with ON CONFLICT clauses
  
  2. Security
    - Maintains data integrity with transaction
    - Prevents duplicate entries
*/

DO $$ 
BEGIN
  -- Add credits for existing users who don't have credit records
  INSERT INTO user_credits (user_id, balance)
  SELECT id, 100
  FROM auth.users
  WHERE NOT EXISTS (
    SELECT 1 FROM user_credits WHERE user_id = auth.users.id
  )
  ON CONFLICT (user_id) DO NOTHING;

  -- Add initial transaction records for these users
  INSERT INTO credit_transactions (user_id, amount, type, description)
  SELECT id, 100, 'charge', '회원가입 보너스 크레딧'
  FROM auth.users u
  WHERE NOT EXISTS (
    SELECT 1 
    FROM credit_transactions 
    WHERE user_id = u.id 
    AND type = 'charge' 
    AND description = '회원가입 보너스 크레딧'
  );
END $$;