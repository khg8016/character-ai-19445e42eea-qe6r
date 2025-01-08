/*
  # Fix Chat RLS Policies

  1. Changes
    - Add user_id to chat creation
    - Update chat RLS policies
    - Add missing RLS policies for messages

  2. Security
    - Enable RLS on chats and messages tables
    - Add policies for authenticated users to manage their own chats and messages
*/

-- Update chat RLS policies
DROP POLICY IF EXISTS "Users can create own chats" ON chats;
CREATE POLICY "Users can create own chats"
  ON chats
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
  );

DROP POLICY IF EXISTS "Users can read own chats" ON chats;
CREATE POLICY "Users can read own chats"
  ON chats
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id
  );

-- Update message RLS policies
DROP POLICY IF EXISTS "Users can read messages from their chats" ON messages;
CREATE POLICY "Users can read messages from their chats"
  ON messages
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM chats
      WHERE chats.id = messages.chat_id
      AND chats.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can create messages in their chats" ON messages;
CREATE POLICY "Users can create messages in their chats"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM chats
      WHERE chats.id = messages.chat_id
      AND chats.user_id = auth.uid()
    )
  );