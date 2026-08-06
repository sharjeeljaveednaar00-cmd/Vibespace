-- Run this in Supabase → SQL Editor (after 001-005).
-- Adds a column to store each user's 3D avatar customization.

alter table public.profiles add column if not exists avatar jsonb default '{
  "skinTone": "#e8b28c",
  "hair": "Short",
  "hairColor": "#1a1a1a",
  "outfit": "Streetwear",
  "outfitColor": "#334155",
  "aura": "None"
}'::jsonb;
