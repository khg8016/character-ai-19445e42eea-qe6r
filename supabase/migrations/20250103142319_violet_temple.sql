/*
  # Add User Level to Profiles

  1. Changes
    - Add user_level enum type
    - Add user_level column to profiles table with default value 'Rookie'
    - Update RLS policies to allow viewing user levels
*/

-- Create enum for user levels
DO $$ BEGIN
  CREATE TYPE user_level AS ENUM ('Admin', 'Expert', 'Rookie');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Add user_level column to profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS user_level user_level NOT NULL DEFAULT 'Rookie';

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS profiles_user_level_idx ON profiles(user_level);