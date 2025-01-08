-- Allow users to delete their own chats
CREATE POLICY "Users can delete own chats"
  ON chats
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow users to delete messages from their chats
CREATE POLICY "Users can delete messages from their chats"
  ON messages
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM chats
      WHERE chats.id = messages.chat_id
      AND chats.user_id = auth.uid()
    )
  );