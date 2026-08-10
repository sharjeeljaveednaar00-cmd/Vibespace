-- Run this in Supabase → SQL Editor (after 001-008).
-- Adds real groups/communities: create, join (public instant / private via
-- approval), a group feed (reuses the existing posts/comments/reactions
-- system via a new group_id column), and real-time group chat.

create table if not exists public.groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text default '',
  type text not null check (type in ('public', 'private')),
  creator_id uuid references auth.users on delete cascade not null,
  created_at timestamptz default now()
);

alter table public.groups enable row level security;

drop policy if exists "Anyone signed in can browse groups" on public.groups;
create policy "Anyone signed in can browse groups"
  on public.groups for select
  using (auth.role() = 'authenticated');

drop policy if exists "Users can create groups" on public.groups;
create policy "Users can create groups"
  on public.groups for insert
  with check (auth.uid() = creator_id);

create table if not exists public.group_members (
  id uuid primary key default gen_random_uuid(),
  group_id uuid references public.groups on delete cascade not null,
  user_id uuid references auth.users on delete cascade not null,
  role text not null default 'member' check (role in ('owner', 'admin', 'member')),
  joined_at timestamptz default now(),
  unique (group_id, user_id)
);

alter table public.group_members enable row level security;

drop policy if exists "Anyone signed in can see membership" on public.group_members;
create policy "Anyone signed in can see membership"
  on public.group_members for select
  using (auth.role() = 'authenticated');

-- Self-join is only allowed straight into PUBLIC groups. Private groups are
-- joined only via approve_group_join_request() below (security definer),
-- so there's no general insert policy for private groups here.
drop policy if exists "Users can join public groups directly" on public.group_members;
create policy "Users can join public groups directly"
  on public.group_members for insert
  with check (
    auth.uid() = user_id
    and exists (select 1 from public.groups g where g.id = group_id and g.type = 'public')
  );

-- Auto-add the creator as owner whenever a group is created.
create or replace function public.handle_new_group()
returns trigger as $$
begin
  insert into public.group_members (group_id, user_id, role) values (new.id, new.creator_id, 'owner');
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_group_created on public.groups;
create trigger on_group_created
  after insert on public.groups
  for each row execute procedure public.handle_new_group();

create table if not exists public.group_join_requests (
  id uuid primary key default gen_random_uuid(),
  group_id uuid references public.groups on delete cascade not null,
  user_id uuid references auth.users on delete cascade not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'declined')),
  created_at timestamptz default now(),
  unique (group_id, user_id)
);

alter table public.group_join_requests enable row level security;

drop policy if exists "Users can see their own requests, admins see all for their group" on public.group_join_requests;
create policy "Users can see their own requests, admins see all for their group"
  on public.group_join_requests for select
  using (
    auth.uid() = user_id
    or exists (select 1 from public.group_members m where m.group_id = group_join_requests.group_id and m.user_id = auth.uid() and m.role in ('owner', 'admin'))
  );

drop policy if exists "Users can request to join" on public.group_join_requests;
create policy "Users can request to join"
  on public.group_join_requests for insert
  with check (auth.uid() = user_id);

-- Approving a request must be done by an owner/admin, and needs to insert into
-- group_members on the requester's behalf — a security definer function
-- handles both steps atomically and safely.
create or replace function public.approve_group_join_request(request_id uuid)
returns void as $$
declare
  req record;
begin
  select * into req from public.group_join_requests where id = request_id;
  if req is null then raise exception 'Request not found'; end if;
  if not exists (select 1 from public.group_members m where m.group_id = req.group_id and m.user_id = auth.uid() and m.role in ('owner', 'admin')) then
    raise exception 'Not authorized to approve requests for this group';
  end if;
  update public.group_join_requests set status = 'approved' where id = request_id;
  insert into public.group_members (group_id, user_id, role) values (req.group_id, req.user_id, 'member') on conflict do nothing;
end;
$$ language plpgsql security definer set search_path = public;

-- ---------------------------------------------------------------
-- Group feed — reuses the existing posts table (and therefore its
-- comments/reactions system) by adding an optional group_id.
-- ---------------------------------------------------------------

alter table public.posts add column if not exists group_id uuid references public.groups on delete cascade;

drop policy if exists "Anyone signed in can read posts" on public.posts;
create policy "Anyone signed in can read posts"
  on public.posts for select
  using (
    group_id is null
    or exists (select 1 from public.groups g where g.id = group_id and g.type = 'public')
    or exists (select 1 from public.group_members m where m.group_id = posts.group_id and m.user_id = auth.uid())
  );

-- ---------------------------------------------------------------
-- Group chat (separate from 1:1 messages) — real-time.
-- ---------------------------------------------------------------

create table if not exists public.group_messages (
  id uuid primary key default gen_random_uuid(),
  group_id uuid references public.groups on delete cascade not null,
  sender_id uuid references auth.users on delete cascade not null,
  sender_name text not null,
  text text default '',
  media_url text,
  media_type text check (media_type in ('image', 'gif', 'video', 'voice') or media_type is null),
  created_at timestamptz default now()
);

alter table public.group_messages enable row level security;

drop policy if exists "Members can read their group's chat" on public.group_messages;
create policy "Members can read their group's chat"
  on public.group_messages for select
  using (exists (select 1 from public.group_members m where m.group_id = group_messages.group_id and m.user_id = auth.uid()));

drop policy if exists "Members can send messages to their group" on public.group_messages;
create policy "Members can send messages to their group"
  on public.group_messages for insert
  with check (auth.uid() = sender_id and exists (select 1 from public.group_members m where m.group_id = group_messages.group_id and m.user_id = auth.uid()));

alter publication supabase_realtime add table public.group_messages;
