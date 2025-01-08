/*
  # Initial Schema Setup for Character.ai Clone

  1. New Tables
    - `characters`
      - Basic character information
      - Name, description, avatar_url, greeting_message
    - `chats`
      - Chat sessions between users and characters
    - `messages` 
      - Individual messages in chat sessions
    - `character_categories`
      - Categories for organizing characters
    - `character_stats`
      - Statistics for characters (chat count, likes, etc)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Character Categories
CREATE TABLE IF NOT EXISTS character_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE character_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read character categories"
  ON character_categories
  FOR SELECT
  TO public
  USING (true);

-- Characters
CREATE TABLE IF NOT EXISTS characters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  avatar_url text,
  greeting_message text NOT NULL,
  category_id uuid REFERENCES character_categories(id),
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE characters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read characters"
  ON characters
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can create characters"
  ON characters
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

-- Character Stats
CREATE TABLE IF NOT EXISTS character_stats (
  character_id uuid PRIMARY KEY REFERENCES characters(id),
  chat_count bigint DEFAULT 0,
  like_count bigint DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE character_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read character stats"
  ON character_stats
  FOR SELECT
  TO public
  USING (true);

-- Chats
CREATE TABLE IF NOT EXISTS chats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  character_id uuid REFERENCES characters(id),
  title text NOT NULL DEFAULT 'New Chat',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE chats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own chats"
  ON chats
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own chats"
  ON chats
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Messages
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id uuid REFERENCES chats(id),
  content text NOT NULL,
  is_from_character boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

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

-- Insert some initial categories
INSERT INTO character_categories (name, description) VALUES
  ('여행 계획하기', '여행 계획을 도와주는 캐릭터'),
  ('언어 학습', '언어 학습을 도와주는 캐릭터'),
  ('창작 도우미', '창작 활동을 도와주는 캐릭터'),
  ('게임', '게임 관련 캐릭터');