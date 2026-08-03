create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  name text not null default '',
  age integer not null default 0,
  gender text not null default '',
  state text not null default '',
  district text not null default '',
  occupation text not null default '',
  annual_income numeric not null default 0,
  category text not null default '',
  disability text not null default '',
  education text not null default '',
  family_size integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  file_name text not null,
  file_url text not null,
  storage_path text not null,
  mime_type text not null,
  size_bytes bigint not null default 0,
  document_type text not null default '',
  uploaded_at timestamptz not null default now()
);

alter table public.documents enable row level security;
alter table public.profiles enable row level security;

create policy "Users can read own profile" on public.profiles for select using (auth.uid() = user_id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = user_id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = user_id);
create policy "Users can delete own profile" on public.profiles for delete using (auth.uid() = user_id);

create policy "Users can read own documents" on public.documents for select using (auth.uid() = user_id);
create policy "Users can insert own documents" on public.documents for insert with check (auth.uid() = user_id);
create policy "Users can update own documents" on public.documents for update using (auth.uid() = user_id);
create policy "Users can delete own documents" on public.documents for delete using (auth.uid() = user_id);
