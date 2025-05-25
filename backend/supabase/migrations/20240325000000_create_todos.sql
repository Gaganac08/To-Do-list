create table todos (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  completed boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table todos enable row level security;

-- Create policies
create policy "Enable read access for all users" on todos
  for select using (true);

create policy "Enable insert for authenticated users only" on todos
  for insert with check (true);

create policy "Enable update for users based on id" on todos
  for update using (true);

create policy "Enable delete for users based on id" on todos
  for delete using (true); 