/*
  # Add DisplayID to profiles

  1. Changes
    - Add display_id column to profiles table
    - Add function to generate unique display IDs
    - Add trigger to automatically generate display_id on profile creation
*/

-- Add display_id column
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS display_id text UNIQUE;

-- Function to generate unique display ID
CREATE OR REPLACE FUNCTION generate_unique_display_id()
RETURNS text AS $$
DECLARE
  new_id text;
  done bool;
BEGIN
  done := false;
  WHILE NOT done LOOP
    -- Generate random 8-character ID
    new_id := LOWER(SUBSTRING(MD5(''||NOW()::TEXT||RANDOM()::TEXT) FOR 8));
    BEGIN
      -- Try to update the profile with the new ID
      UPDATE profiles 
      SET display_id = new_id 
      WHERE id = NEW.id AND display_id IS NULL;
      done := true;
    EXCEPTION WHEN unique_violation THEN
      -- If there's a conflict, try again
      done := false;
    END;
  END LOOP;
  RETURN new_id;
END;
$$ LANGUAGE plpgsql VOLATILE;