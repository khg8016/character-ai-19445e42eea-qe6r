/*
  # Fix user signup trigger

  1. Changes
    - Update handle_new_user function to properly handle new user creation
    - Add better error handling
    - Fix display_id generation
*/

-- Drop existing trigger and function if they exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.generate_unique_display_id();

-- Create function to generate unique display ID
CREATE OR REPLACE FUNCTION public.generate_unique_display_id()
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
      IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE display_id = new_id) THEN
        done := true;
      END IF;
    END;
  END LOOP;
  RETURN new_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to handle new user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    display_id,
    user_level,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    public.generate_unique_display_id(),
    'Rookie',
    NOW(),
    NOW()
  );
  RETURN NEW;
EXCEPTION
  WHEN others THEN
    RAISE LOG 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();