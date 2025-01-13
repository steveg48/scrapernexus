-- Check existing profiles
SELECT 
    p.*,
    u.email,
    u.raw_user_meta_data
FROM 
    public.profiles p
    LEFT JOIN auth.users u ON p.id = u.id
ORDER BY 
    p.created_at DESC
LIMIT 5;
