-- Check triggers specifically on auth.users
SELECT 
    event_object_schema as table_schema,
    event_object_table as table_name,
    trigger_schema,
    trigger_name,
    string_agg(event_manipulation, ',') as event,
    action_timing as activation,
    action_statement as definition
FROM information_schema.triggers
WHERE event_object_schema = 'auth' 
AND event_object_table = 'users'
GROUP BY 1,2,3,4,5,6,7;
