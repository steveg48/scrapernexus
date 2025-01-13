-- Drop existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create function with null checks and debug logging
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
    display_name_val text;
    member_type_val text;
    role_val text;
BEGIN
    -- Get values with fallbacks
    display_name_val := COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email);
    member_type_val := COALESCE(NEW.raw_user_meta_data->>'member_type', 'buyer');
    role_val := COALESCE(NEW.raw_user_meta_data->>'role', 'user');

    RAISE LOG 'Creating profile for user: %, display_name: %, member_type: %, role: %', 
              NEW.id, display_name_val, member_type_val, role_val;
  
    INSERT INTO public.profiles (
        id,
        display_name,
        member_type,
        role,
        created_at,
        updated_at
    ) VALUES (
        NEW.id,
        display_name_val,
        member_type_val,
        role_val,
        NOW(),
        NOW()
    );
  
    RAISE LOG 'Profile created successfully';
    RETURN NEW;
EXCEPTION WHEN OTHERS THEN
    RAISE LOG 'Error creating profile: %, SQLSTATE: %, SQLERRM: %', 
              NEW.id, SQLSTATE, SQLERRM;
    RETURN NEW;
END;
$$;

-- Create trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO postgres, anon, authenticated, service_role;

-- Verify trigger
SELECT pg_get_functiondef(oid) FROM pg_proc WHERE proname = 'handle_new_user';
