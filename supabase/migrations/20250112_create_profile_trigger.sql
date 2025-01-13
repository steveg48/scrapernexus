-- Create a trigger function to create a profile when a new user is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    display_name,
    member_type,
    role
  ) VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'display_name',
    COALESCE(NEW.raw_user_meta_data->>'member_type', 'buyer'),
    COALESCE(NEW.raw_user_meta_data->>'member_type', 'buyer')
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
