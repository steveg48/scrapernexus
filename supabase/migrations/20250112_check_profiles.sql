\d profiles;

-- Check for any constraints
SELECT
    tc.constraint_name, 
    tc.constraint_type,
    kcu.column_name,
    cc.check_clause
FROM 
    information_schema.table_constraints tc
JOIN 
    information_schema.key_column_usage kcu
    ON tc.constraint_name = kcu.constraint_name
LEFT JOIN 
    information_schema.check_constraints cc
    ON tc.constraint_name = cc.constraint_name
WHERE 
    tc.table_name = 'profiles';
