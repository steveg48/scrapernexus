-- Test function to manually create a profile
CREATE OR REPLACE FUNCTION test_profile_creation()
RETURNS void AS $$
DECLARE
    test_user_id uuid := '00000000-0000-0000-0000-000000000000'; -- Replace with actual test ID
BEGIN
    INSERT INTO public.profiles (
        id,
        display_name,
        member_type,
        role,
        created_at,
        updated_at
    ) VALUES (
        test_user_id,
        'Test User',
        'buyer',
        'user',
        NOW(),
        NOW()
    );
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error creating profile: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;
