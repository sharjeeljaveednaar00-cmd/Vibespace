-- Run this in Supabase → SQL Editor (after migrations.sql).
-- Adds tables for the feed: posts and per-user reactions.

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid references auth.users on delete cascade not null,
  author_name text not null,
  text text not null,
  mentions jsonb default '[]',
  comments integer default 0,
  created_at timestamptz default now()
);

alter table public.posts enable row level security;

drop policy if exists "Anyone signed in can read posts" on public.posts;
create policy "Anyone signed in can read posts"
  on public.posts for select
  using (auth.role() = 'authenticated');

drop policy if exists "Users can create their own posts" on public.posts;
create policy "Users can create their own posts"
  on public.posts for insert
  with check (auth.uid() = author_id);

drop policy if exists "Users can delete their own posts" on public.posts;
create policy "Users can delete their own posts"
  on public.posts for delete
  using (auth.uid() = author_id);

create table if not exists public.post_reactions (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references public.posts on delete cascade not null,
  user_id uuid references auth.users on delete cascade not null,
  reaction text not null,
  created_at timestamptz default now(),
  unique (post_id, user_id, reaction)
);

alter table public.post_reactions enable row level security;

drop policy if exists "Anyone signed in can read reactions" on public.post_reactions;
create policy "Anyone signed in can read reactions"
  on public.post_reactions for select
  using (auth.role() = 'authenticated');

drop policy if exists "Users can add their own reactions" on public.post_reactions;
create policy "Users can add their own reactions"
  on public.post_reactions for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can remove their own reactions" on public.post_reactions;
create policy "Users can remove their own reactions"
  on public.post_reactions for delete
  using (auth.uid() = user_id);
