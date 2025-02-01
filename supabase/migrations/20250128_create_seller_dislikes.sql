-- Create seller_dislikes table
CREATE TABLE IF NOT EXISTS seller_dislikes (
    id BIGSERIAL PRIMARY KEY,
    seller_id UUID NOT NULL REFERENCES auth.users(id),
    project_postings_id BIGINT NOT NULL REFERENCES project_postings(project_postings_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(seller_id, project_postings_id)
);

-- Enable RLS
alter table seller_dislikes enable row level security;

-- Create policies
create policy "Users can view their own dislikes"
    on seller_dislikes for select
    using (auth.uid() = seller_id);

create policy "Users can insert their own dislikes"
    on seller_dislikes for insert
    with check (auth.uid() = seller_id);

create policy "Users can delete their own dislikes"
    on seller_dislikes for delete
    using (auth.uid() = seller_id);

-- Grant access to authenticated users
grant all on seller_dislikes to authenticated;
