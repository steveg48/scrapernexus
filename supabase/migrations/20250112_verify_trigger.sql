-- Check if trigger exists
SELECT 
    tgname as trigger_name,
    tgenabled as trigger_enabled,
    tgtype as trigger_type,
    proname as function_name,
    nspname as schema_name,
    relname as table_name
FROM 
    pg_trigger t
    JOIN pg_proc p ON t.tgfoid = p.oid
    JOIN pg_namespace n ON p.pronamespace = n.oid
    JOIN pg_class c ON t.tgrelid = c.oid
WHERE 
    proname = 'handle_new_user'
    OR relname = 'users';

-- Check trigger function definition
SELECT 
    proname as function_name,
    prosrc as function_definition
FROM 
    pg_proc 
WHERE 
    proname = 'handle_new_user';
