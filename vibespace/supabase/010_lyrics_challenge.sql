-- Run this in Supabase → SQL Editor (after 001-009).
-- Real "Lyrics Challenge" feature inside Become a Star: users submit their
-- OWN lyrics/verse as a challenge (not licensed song lyrics — this app never
-- embeds real copyrighted lyrics), others record themselves singing it, and
-- anyone can rate attempts to settle "who sang it better."

create table if not exists public.lyric_challenges (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid references auth.users on delete cascade not null,
  creator_name text not null,
  song_title text not null,       -- a label, e.g. "Original verse" or an inspiration credit — never actual lyrics
  lyrics_text text not null,      -- the challenge creator's own written lyrics/prompt
  audio_url text,
  video_url text,
  created_at timestamptz default now()
);

alter table public.lyric_challenges enable row level security;

drop policy if exists "Anyone signed in can read challenges" on public.lyric_challenges;
create policy "Anyone signed in can read challenges"
  on public.lyric_challenges for select
  using (auth.role() = 'authenticated');

drop policy if exists "Users can create their own challenges" on public.lyric_challenges;
create policy "Users can create their own challenges"
  on public.lyric_challenges for insert
  with check (auth.uid() = creator_id);

create table if not exists public.challenge_attempts (
  id uuid primary key default gen_random_uuid(),
  challenge_id uuid references public.lyric_challenges on delete cascade not null,
  singer_id uuid references auth.users on delete cascade not null,
  singer_name text not null,
  audio_url text,
  video_url text,
  created_at timestamptz default now()
);

alter table public.challenge_attempts enable row level security;

drop policy if exists "Anyone signed in can read attempts" on public.challenge_attempts;
create policy "Anyone signed in can read attempts"
  on public.challenge_attempts for select
  using (auth.role() = 'authenticated');

drop policy if exists "Users can submit their own attempts" on public.challenge_attempts;
create policy "Users can submit their own attempts"
  on public.challenge_attempts for insert
  with check (auth.uid() = singer_id);

create table if not exists public.attempt_ratings (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid references public.challenge_attempts on delete cascade not null,
  rater_id uuid references auth.users on delete cascade not null,
  stars integer not null check (stars between 1 and 5),
  created_at timestamptz default now(),
  unique (attempt_id, rater_id)
);

alter table public.attempt_ratings enable row level security;

drop policy if exists "Anyone signed in can read ratings" on public.attempt_ratings;
create policy "Anyone signed in can read ratings"
  on public.attempt_ratings for select
  using (auth.role() = 'authenticated');

drop policy if exists "Users can rate as themselves" on public.attempt_ratings;
create policy "Users can rate as themselves"
  on public.attempt_ratings for insert
  with check (auth.uid() = rater_id);

drop policy if exists "Users can update their own rating" on public.attempt_ratings;
create policy "Users can update their own rating"
  on public.attempt_ratings for update
  using (auth.uid() = rater_id)
  with check (auth.uid() = rater_id);
