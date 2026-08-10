-- Run this in Supabase → SQL Editor (after 001-007).
-- Adds direct messaging between users (conversation partners are your
-- matches from 004_matches.sql), with text + photo/GIF/video/voice support,
-- and enables Supabase Realtime so messages arrive live without refreshing.

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid references auth.users on delete cascade not null,
  recipient_id uuid references auth.users on delete cascade not null,
  text text default '',
  media_url text,
  media_type text check (media_type in ('image', 'gif', 'video', 'voice') or media_type is null),
  read_at timestamptz,
  created_at timestamptz default now()
);

create index if not exists messages_conversation_idx on public.messages (least(sender_id, recipient_id), greatest(sender_id, recipient_id), created_at);

alter table public.messages enable row level security;

drop policy if exists "Users can read their own conversations" on public.messages;
create policy "Users can read their own conversations"
  on public.messages for select
  using (auth.uid() = sender_id or auth.uid() = recipient_id);

drop policy if exists "Users can send messages as themselves" on public.messages;
create policy "Users can send messages as themselves"
  on public.messages for insert
  with check (auth.uid() = sender_id);

drop policy if exists "Recipients can mark messages read" on public.messages;
create policy "Recipients can mark messages read"
  on public.messages for update
  using (auth.uid() = recipient_id)
  with check (auth.uid() = recipient_id);

-- Enable live delivery — without this, new messages only show up on refresh.
alter publication supabase_realtime add table public.messages;
