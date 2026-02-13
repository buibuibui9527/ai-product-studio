-- Create profiles table
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  credits integer default 3,
  created_at timestamp default now()
);

-- Create jobs table
create table jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  image_url text not null,
  style_id text not null,
  status text default 'pending',
  result_url text,
  created_at timestamp default now()
);

-- Create lemonsqueezy_events table for idempotency
create table lemonsqueezy_events (
  id text primary key,
  created_at timestamp default now()
);

-- Function to deduct credit (atomic operation)
create or replace function deduct_credit(user_id uuid)
returns void as $$
begin
  update profiles
  set credits = credits - 1
  where id = user_id and credits > 0;

  if not found then
    raise exception 'NO_CREDIT';
  end if;
end;
$$ language plpgsql;

-- Function to increment credit (for purchases)
create or replace function increment_credit(user_id uuid, amount integer)
returns void as $$
begin
  update profiles
  set credits = credits + amount
  where id = user_id;
end;
$$ language plpgsql;

-- Create trigger to auto-create profile on user signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, credits)
  values (new.id, 3);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- Enable Row Level Security
alter table profiles enable row level security;
alter table jobs enable row level security;

-- Policies for profiles
create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

-- Policies for jobs
create policy "Users can view own jobs"
  on jobs for select
  using (auth.uid() = user_id);

create policy "Users can insert own jobs"
  on jobs for insert
  with check (auth.uid() = user_id);

-- Create indexes for performance
create index idx_jobs_user_id on jobs(user_id);
create index idx_jobs_status on jobs(status);
create index idx_jobs_created_at on jobs(created_at desc);
