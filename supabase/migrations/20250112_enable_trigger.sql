-- Enable the trigger
ALTER TABLE auth.users ENABLE TRIGGER on_auth_user_created;

-- Verify it's enabled
SELECT tgname, tgenabled 
FROM pg_trigger 
WHERE tgname = 'on_auth_user_created';
