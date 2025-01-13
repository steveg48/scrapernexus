-- Enable logging for trigger errors
ALTER DATABASE postgres SET log_min_messages = 'DEBUG';
ALTER DATABASE postgres SET log_statement = 'all';

-- Check if the trigger function exists and its definition
SELECT proname, prosrc 
FROM pg_proc 
WHERE proname = 'handle_new_user';

-- Check if the trigger is properly attached
SELECT 
    tgname,
    tgenabled,
    tgtype,
    proname as function_name
FROM 
    pg_trigger t
    JOIN pg_proc p ON t.tgfoid = p.oid
WHERE 
    tgrelid = 'auth.users'::regclass;
