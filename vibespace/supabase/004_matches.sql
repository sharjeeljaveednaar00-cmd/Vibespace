-- Run this in Supabase → SQL Editor (after migrations.sql, 002, and 003).
-- Adds: broader profile visibility for discovery, a swipes table, and a
-- matches table that's auto-populated when two users both like each other.

-- Profiles were previously only visible to their own owner. A dating/discovery
-- feed needs to show OTHER users too, so add a second (broader) read policy.
-- This does not remove the existing "own profile" policy — Postgres RLS
-- policies are OR'd together, so this only adds visibility, never removes it.
drop policy if exists "Signed-in users can view all profiles for discovery" on public.profiles;
create policy "Signed-in users can view all profiles for discovery"
  on public.profiles for select
  using (auth.role() = 'authenticated');

create table if not exists public.swipes (
  id uuid primary key default gen_random_uuid(),
  swiper_id uuid references auth.users on delete cascade not null,
  swiped_id uuid references auth.users on delete cascade not null,
  direction text not null check (direction in ('like', 'pass')),
  created_at timestamptz default now(),
  unique (swiper_id, swiped_id)
);

alter table public.swipes enable row level security;

drop policy if exists "Users can read their own swipes" on public.swipes;
create policy "Users can read their own swipes"
  on public.swipes for select
  using (auth.uid() = swiper_id);

drop policy if exists "Users can create their own swipes" on public.swipes;
create policy "Users can create their own swipes"
  on public.swipes for insert
  with check (auth.uid() = swiper_id);

create table if not exists public.matches (
  id uuid primary key default gen_random_uuid(),
  user_a uuid references auth.users on delete cascade not null,
  user_b uuid references auth.users on delete cascade not null,
  created_at timestamptz default now(),
  unique (user_a, user_b),
  check (user_a < user_b) -- always store the smaller id first so a pair can't match twice
);

alter table public.matches enable row level security;

drop policy if exists "Users can read their own matches" on public.matches;
create policy "Users can read their own matches"
  on public.matches for select
  using (auth.uid() = user_a or auth.uid() = user_b);

-- No insert policy for users — matches are only ever created by the trigger below.

-- When someone likes another user, check if that other user already liked them
-- back. If so, create a match automatically.
create or replace function public.check_for_match()
returns trigger as $$
begin
  if new.direction = 'like' then
    if exists (
      select 1 from public.swipes
      where swiper_id = new.swiped_id and swiped_id = new.swiper_id and direction = 'like'
    ) then
      insert into public.matches (user_a, user_b)
      values (least(new.swiper_id, new.swiped_id), greatest(new.swiper_id, new.swiped_id))
      on conflict (user_a, user_b) do nothing;
    end if;
  end if;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_swipe_check_match on public.swipes;
create trigger on_swipe_check_match
  after insert on public.swipes
  for each row execute procedure public.check_for_match();
