-- Run this in Supabase SQL Editor

create table if not exists user_progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  srs_cards jsonb default '{}'::jsonb,
  streak_days integer default 0,
  total_reviewed integer default 0,
  selected_drama_ids text[] default '{}',
  updated_at timestamptz default now()
);

alter table user_progress enable row level security;

create policy "Users can read own progress"
  on user_progress for select
  using (auth.uid() = user_id);

create policy "Users can upsert own progress"
  on user_progress for insert
  with check (auth.uid() = user_id);

create policy "Users can update own progress"
  on user_progress for update
  using (auth.uid() = user_id);
