-- Drop existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create function with debug logging
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE LOG 'Creating profile for user: %, metadata: %', NEW.id, NEW.raw_user_meta_data;
  
  INSERT INTO public.profiles (
    id,
    display_name,
    member_type,
    role,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'display_name',
    NEW.raw_user_meta_data->>'member_type',
    NEW.raw_user_meta_data->>'role',
    NOW(),
    NOW()
  );
  
  RAISE LOG 'Profile created successfully';
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE LOG 'Error creating profile: %', SQLERRM;
  RETURN NEW;
END;
$$;

-- Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable logging
ALTER DATABASE postgres SET log_min_messages = 'DEBUG';

-- Verify trigger
SELECT pg_get_functiondef(oid) FROM pg_proc WHERE proname = 'handle_new_user';
