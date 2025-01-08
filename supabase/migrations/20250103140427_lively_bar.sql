/*
  # Add display ID functionality to profiles

  1. Changes
    - Add function to generate unique display IDs
    - Add trigger to automatically set display IDs for new profiles
    - Update existing profiles with display IDs
*/

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
      -- Try to use the new ID
      IF NOT EXISTS (SELECT 1 FROM profiles WHERE display_id = new_id) THEN
        done := true;
      END IF;
    END;
  END LOOP;
  RETURN new_id;
END;
$$ LANGUAGE plpgsql VOLATILE;

-- Update the handle_new_user function to include display_id
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, display_id)
  VALUES (new.id, generate_unique_display_id());
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add index for faster profile lookups
CREATE INDEX IF NOT EXISTS profiles_display_id_idx ON profiles(display_id);

-- Update existing profiles with display IDs
DO $$
DECLARE
  profile_record RECORD;
BEGIN
  FOR profile_record IN SELECT id FROM profiles WHERE display_id IS NULL LOOP
    UPDATE profiles 
    SET display_id = generate_unique_display_id()
    WHERE id = profile_record.id;
  END LOOP;
END $$;