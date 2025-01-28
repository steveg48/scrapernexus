-- Create seller_favorites table
CREATE TABLE IF NOT EXISTS seller_favorites (
    id BIGSERIAL PRIMARY KEY,
    seller_id UUID NOT NULL REFERENCES auth.users(id),
    project_posting_id BIGINT NOT NULL REFERENCES project_postings(project_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(seller_id, project_posting_id)
);

-- Enable RLS
alter table seller_favorites enable row level security;

-- Create policies
create policy "Users can view their own favorites"
    on seller_favorites for select
    using (auth.uid() = seller_id);

create policy "Users can insert their own favorites"
    on seller_favorites for insert
    with check (auth.uid() = seller_id);

create policy "Users can delete their own favorites"
    on seller_favorites for delete
    using (auth.uid() = seller_id);

-- Grant access to authenticated users
grant all on seller_favorites to authenticated;
