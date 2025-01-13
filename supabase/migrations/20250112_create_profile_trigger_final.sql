-- Create a trigger function to create a profile when a new user is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    display_name,
    member_type,
    role,  -- Default to 'user', can be upgraded to 'admin' later
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'display_name',
    NEW.raw_user_meta_data->>'member_type',
    'user',  -- Everyone starts as a regular user
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop the trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create an enum type for roles if it doesn't exist
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('user', 'admin', 'guest');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Add role check constraint if it doesn't exist
DO $$ BEGIN
  ALTER TABLE profiles 
    ADD CONSTRAINT valid_role CHECK (role IN ('user', 'admin', 'guest'));
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
