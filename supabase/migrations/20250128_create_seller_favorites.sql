-- Create seller_favorites table
CREATE TABLE IF NOT EXISTS seller_favorites (
    id BIGSERIAL PRIMARY KEY,
    seller_id UUID NOT NULL REFERENCES auth.users(id),
    project_posting_id BIGINT NOT NULL REFERENCES project_postings(project_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(seller_id, project_posting_id)
);
