-- Run this in Supabase → SQL Editor (after 001-006).
-- Adds a column to store a captured snapshot of the user's 3D avatar,
-- used as their profile picture.

alter table public.profiles add column if not exists avatar_snapshot_url text;
