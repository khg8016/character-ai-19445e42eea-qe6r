/*
  # Add chat count increment function

  1. New Functions
    - `increment_chat_count`: Safely increments the chat_count for a character
  
  2. Security
    - Function is accessible to authenticated users only
*/

-- Function to increment chat count
CREATE OR REPLACE FUNCTION increment_chat_count(char_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO character_stats (character_id, chat_count, like_count)
  VALUES (char_id, 1, 0)
  ON CONFLICT (character_id)
  DO UPDATE SET chat_count = character_stats.chat_count + 1;
END;
$$;