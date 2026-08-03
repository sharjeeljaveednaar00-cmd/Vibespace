-- Run this in Supabase → SQL Editor (after migrations.sql and 002_feed_posts.sql).
-- Adds: comments (with mentions + media), per-user comment reactions,
-- storage for comment media, and a trigger to keep posts.comments in sync.

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references public.posts on delete cascade not null,
  author_id uuid references auth.users on delete cascade not null,
  author_name text not null,
  text text default '',
  mentions jsonb default '[]',
  media_url text,
  media_type text check (media_type in ('image', 'gif', 'video') or media_type is null),
  created_at timestamptz default now()
);

alter table public.comments enable row level security;

drop policy if exists "Anyone signed in can read comments" on public.comments;
create policy "Anyone signed in can read comments"
  on public.comments for select
  using (auth.role() = 'authenticated');

drop policy if exists "Users can create their own comments" on public.comments;
create policy "Users can create their own comments"
  on public.comments for insert
  with check (auth.uid() = author_id);

drop policy if exists "Users can delete their own comments" on public.comments;
create policy "Users can delete their own comments"
  on public.comments for delete
  using (auth.uid() = author_id);

create table if not exists public.comment_reactions (
  id uuid primary key default gen_random_uuid(),
  comment_id uuid references public.comments on delete cascade not null,
  user_id uuid references auth.users on delete cascade not null,
  reaction text not null,
  created_at timestamptz default now(),
  unique (comment_id, user_id, reaction)
);

alter table public.comment_reactions enable row level security;

drop policy if exists "Anyone signed in can read comment reactions" on public.comment_reactions;
create policy "Anyone signed in can read comment reactions"
  on public.comment_reactions for select
  using (auth.role() = 'authenticated');

drop policy if exists "Users can add their own comment reactions" on public.comment_reactions;
create policy "Users can add their own comment reactions"
  on public.comment_reactions for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can remove their own comment reactions" on public.comment_reactions;
create policy "Users can remove their own comment reactions"
  on public.comment_reactions for delete
  using (auth.uid() = user_id);

-- Keep posts.comments count accurate automatically whenever a comment is added/removed.
create or replace function public.sync_post_comment_count()
returns trigger as $$
begin
  if tg_op = 'INSERT' then
    update public.posts set comments = comments + 1 where id = new.post_id;
  elsif tg_op = 'DELETE' then
    update public.posts set comments = greatest(0, comments - 1) where id = old.post_id;
  end if;
  return null;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_comment_added on public.comments;
create trigger on_comment_added
  after insert on public.comments
  for each row execute procedure public.sync_post_comment_count();

drop trigger if exists on_comment_removed on public.comments;
create trigger on_comment_removed
  after delete on public.comments
  for each row execute procedure public.sync_post_comment_count();

-- ---------------------------------------------------------------
-- Storage bucket for comment media (photos, GIF files, short videos)
-- ---------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit)
values ('comment-media', 'comment-media', true, 26214400) -- 25MB cap per file
on conflict (id) do nothing;

drop policy if exists "Anyone can view comment media" on storage.objects;
create policy "Anyone can view comment media"
  on storage.objects for select
  using (bucket_id = 'comment-media');

drop policy if exists "Signed-in users can upload comment media" on storage.objects;
create policy "Signed-in users can upload comment media"
  on storage.objects for insert
  with check (bucket_id = 'comment-media' and auth.role() = 'authenticated');

drop policy if exists "Users can delete their own comment media" on storage.objects;
create policy "Users can delete their own comment media"
  on storage.objects for delete
  using (bucket_id = 'comment-media' and owner = auth.uid());
