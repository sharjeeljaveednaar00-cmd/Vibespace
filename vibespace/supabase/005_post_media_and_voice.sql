-- Run this in Supabase → SQL Editor (after 001-004).
-- Adds photo/GIF/video/voice attachments to posts, and voice notes to comments.

alter table public.posts add column if not exists media_url text;
alter table public.posts add column if not exists media_type text;

alter table public.posts drop constraint if exists posts_media_type_check;
alter table public.posts add constraint posts_media_type_check
  check (media_type in ('image', 'gif', 'video', 'voice') or media_type is null);

alter table public.comments drop constraint if exists comments_media_type_check;
alter table public.comments add constraint comments_media_type_check
  check (media_type in ('image', 'gif', 'video', 'voice') or media_type is null);
