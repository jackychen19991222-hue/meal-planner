-- Run this in Supabase SQL Editor

create table if not exists public.recipes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name_zh text not null,
  name_en text not null,
  tags_zh text[] default '{}',
  tags_en text[] default '{}',
  servings int default 2,
  instructions_zh text default '',
  instructions_en text default '',
  ingredients jsonb not null default '[]'::jsonb,
  created_at timestamptz default now()
);

alter table public.recipes enable row level security;

drop policy if exists "Users can read their own recipes" on public.recipes;
create policy "Users can read their own recipes"
on public.recipes
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can insert their own recipes" on public.recipes;
create policy "Users can insert their own recipes"
on public.recipes
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update their own recipes" on public.recipes;
create policy "Users can update their own recipes"
on public.recipes
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own recipes" on public.recipes;
create policy "Users can delete their own recipes"
on public.recipes
for delete
to authenticated
using (auth.uid() = user_id);
