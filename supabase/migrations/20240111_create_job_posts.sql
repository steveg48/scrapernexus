create table if not exists public.job_posts (
    id bigint primary key generated always as identity,
    title text not null,
    description text not null,
    rate_type text not null,
    experience_level text not null,
    estimated_time text not null,
    hours_per_week text not null,
    skills text[] not null default '{}',
    created_at timestamptz not null default now(),
    buyer_id uuid not null references auth.users(id),
    updated_at timestamptz
);

-- Set up Row Level Security (RLS)
alter table public.job_posts enable row level security;

-- Allow anyone to read job posts
create policy "Anyone can view job posts"
    on public.job_posts
    for select
    using (true);

-- Only buyers can insert their own job posts
create policy "Buyers can create job posts"
    on public.job_posts
    for insert
    with check (
        auth.uid() = buyer_id
        and exists (
            select 1 from auth.users
            where id = auth.uid()
            and raw_user_meta_data->>'user_type' = 'buyer'
        )
    );

-- Only the buyer who created the post can update it
create policy "Buyers can update their own job posts"
    on public.job_posts
    for update
    using (auth.uid() = buyer_id)
    with check (auth.uid() = buyer_id);

-- Only the buyer who created the post can delete it
create policy "Buyers can delete their own job posts"
    on public.job_posts
    for delete
    using (auth.uid() = buyer_id);
