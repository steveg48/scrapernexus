-- Add last_seen column to profiles if it doesn't exist
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS last_seen timestamp with time zone;

-- Function to check if a user is online based on last_seen timestamp
CREATE OR REPLACE FUNCTION is_user_online(last_seen_time timestamp with time zone)
RETURNS boolean AS $$
BEGIN
    -- Consider user online if they've been seen in the last 5 minutes
    RETURN last_seen_time >= NOW() - INTERVAL '5 minutes';
END;
$$ LANGUAGE plpgsql;

-- Create a view for user status information
CREATE OR REPLACE VIEW user_status AS
SELECT 
    p.id,
    p.last_seen,
    -- Automatically determine if user is online based on last_seen timestamp
    is_user_online(p.last_seen) as is_online,
    -- Show when they were last active
    CASE 
        WHEN is_user_online(p.last_seen) THEN 'Online'
        WHEN p.last_seen IS NULL THEN 'Never'
        WHEN p.last_seen >= NOW() - INTERVAL '1 hour' THEN 'Last seen ' || 
            EXTRACT(MINUTES FROM NOW() - p.last_seen)::text || ' minutes ago'
        WHEN p.last_seen >= NOW() - INTERVAL '1 day' THEN 'Last seen ' || 
            EXTRACT(HOURS FROM NOW() - p.last_seen)::text || ' hours ago'
        ELSE 'Last seen ' || 
            EXTRACT(DAYS FROM NOW() - p.last_seen)::text || ' days ago'
    END as display_status
FROM profiles p;
