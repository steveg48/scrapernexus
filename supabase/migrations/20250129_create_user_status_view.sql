-- Add last_seen column to profiles if it doesn't exist
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS last_seen timestamp with time zone;

-- Function to return user activity status
CREATE OR REPLACE FUNCTION user_activity_status_view()
RETURNS TABLE (
    id uuid,
    last_seen timestamp with time zone,
    is_online boolean,
    display_status text
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.last_seen,
        -- Consider user online if they've been seen in the last 5 minutes
        p.last_seen >= NOW() - INTERVAL '5 minutes' as is_online,
        -- Show when they were last active
        CASE 
            WHEN p.last_seen >= NOW() - INTERVAL '5 minutes' THEN 'Online'
            WHEN p.last_seen IS NULL THEN 'Never'
            WHEN p.last_seen >= NOW() - INTERVAL '1 hour' THEN 'Last seen ' || 
                EXTRACT(MINUTES FROM NOW() - p.last_seen)::text || ' minutes ago'
            WHEN p.last_seen >= NOW() - INTERVAL '1 day' THEN 'Last seen ' || 
                EXTRACT(HOURS FROM NOW() - p.last_seen)::text || ' hours ago'
            ELSE 'Last seen ' || 
                EXTRACT(DAYS FROM NOW() - p.last_seen)::text || ' days ago'
        END as display_status
    FROM profiles p;
END;
$$ LANGUAGE plpgsql;
