-- Create the table for storing results
create table if not exists public.snow_results (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  room_id text not null,
  nickname text not null,
  crystal_code text,
  scores jsonb
);

-- Enable Row Level Security (RLS) is recommended
alter table public.snow_results enable row level security;

-- Policy 1: Allow anyone (anonymous users) to insert their result
create policy "Enable insert for everyone" 
on public.snow_results for insert 
to anon 
with check (true);

-- Policy 2: Allow anyone to read results (needed to see the graph)
-- In a production app, you might restrict this to the same room_id,
-- but for this prototype, allowing public select is easiest to avoid auth issues.
create policy "Enable select for everyone" 
on public.snow_results for select 
to anon 
using (true);
