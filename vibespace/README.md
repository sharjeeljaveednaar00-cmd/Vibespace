# VibeSpace — Web + Mobile + Backend

## Auth & database: now on Supabase
Auth (including Google sign-in) and the user's profile now run through **Supabase** instead of the earlier custom Express backend — since you already set up Google OAuth there, it's the simpler path (hosted auth + Postgres in one place). The `backend/` folder (Express + SQLite) is no longer used for auth; keep it only if you want a separate API for future non-auth features, or delete it.

## What's real vs. mock right now
- **Real:** email/password signup & login, Google sign-in, sessions, the logged-in user's name/bio/coins/level/XP, feed posts with photo/GIF-file/video/voice-note attachments + reactions, comments (with @mentions, per-comment reactions, and photo/GIF-file/video/voice-note attachments), a swipe-to-match Discover deck with mutual-match detection, **VibeLens** — a live-camera filter system with real-time face tracking (via MediaPipe) so accessories actually follow your face position/size/tilt, plus live color/beauty adjustments and one-tap capture to your Vault or straight to the feed, and a **3D Avatar Editor** — a real Three.js character with deep manual customization: skin tone, eye color (with free-form color pickers, not just presets), face width/length, jaw width, ear size, eye size/spacing, eyebrow thickness, nose size, mouth width, lip fullness, 8 hairstyles + hair color, 5 outfits + outfit color, 6 accessories you can combine and wear simultaneously (glasses, cap, bow tie, earrings, necklace, headband), body height/build, pose, expression, and a glowing aura — drag to rotate, scroll to zoom, with a "Capture as Profile Picture" button that saves a real snapshot as your profile photo — all saved to your profile in Supabase (Postgres + Storage).

### Everything still dummy / not wired to real data
- **Gifts** — sending/receiving gifts is still local-only mock state, resets on refresh.
- **Memory Vault** — items beyond what VibeLens saves there are still mock/sample entries.
- **Games** (word chain, trivia, etc.) — fully mock, no persistence, no real opponents.
- **Communities** — mock list, joining/posting isn't wired to a database.
- **VibeRoulette** (random video matching) — connects to fake mock "strangers," not real users.
- **Facebook/TikTok login buttons** — disabled placeholders, not functional.
- **The "liveness check"** during signup — a cosmetic progress bar animation, not real face/identity verification.
- **GIF search** — "GIF" support means uploading your own `.gif` file; there's no Giphy/Tenor-style search (needs a separate API key from one of those providers).
- **Zodiac compatibility, VibeStage, in-game chat bubbles, and similar flavor features** — cosmetic/mock, not backed by real data.

Everything in the "Real" list above went through the same pattern: a Supabase table + RLS policies + wired-up frontend calls, verified to load without errors before shipping. Anything not listed there should be assumed mock until wired up the same way.

- **On VibeLens:** the first face-tracking model download is a few MB and can take a moment on a slow connection the first time someone opens the tab. It only loads once per session.
- **On the 3D avatar:** it's built from real, live-rendered geometry (sphere/capsule/torus primitives) rather than a licensed character asset pack — genuinely 3D and customizable, but stylized/low-poly rather than photorealistic. Swapping in a full rigged/animated character (e.g. Ready Player Me-style) is a larger step up that would need a real character asset pipeline.
- **Heads up on Discover:** it needs *other real signed-up users* to show anyone — with only your own test account so far, the deck will look empty. Sign up 2-3 test accounts (or wait for real users) to see it work end to end.
- **Not implemented:** Facebook/TikTok OAuth (disabled placeholders), the "liveness check" is still a cosmetic progress bar, not real face verification.

## 1. Set up Supabase (one-time)
1. In your Supabase project dashboard, go to **SQL Editor** and run everything in `supabase/migrations.sql` — this creates the `profiles` table, its security policies, and a trigger that auto-creates a profile row for every new user (covers both email signup and Google sign-in).
2. Go to **Authentication → Providers → Google** and confirm it's enabled with the Client ID/Secret from Google Cloud Console (you mentioned this is already done).
3. Go to **Authentication → URL Configuration** and add your app's URL (e.g. `http://localhost:5173` for local dev, plus your real domain later) to **Redirect URLs** — Google sign-in will fail without this.
4. In Google Cloud Console, make sure the OAuth consent screen's **Authorized redirect URI** includes your Supabase callback URL: `https://<your-project-ref>.supabase.co/auth/v1/callback`.
5. Grab your **Project URL** and **anon public key** from Project Settings → API — you'll need them next.

## 2. Run the web app
```
cd web
npm install
cp .env.example .env      # paste in your Supabase Project URL + anon key
npm run dev
```
Opens at http://localhost:5173. Sign up with email/password, or tap "Continue with Google" — both persist to Supabase.

## (Optional) Run the custom backend
Only needed if you're keeping it for future non-auth features:
```
cd backend
npm install
cp .env.example .env
npm run dev
```

**Deploying the web app:** `npm run build` produces a static `dist/` folder you can host on Vercel, Netlify, Cloudflare Pages, etc. Deploy the backend somewhere too (Railway, Render, Fly.io are easiest for a small Node+SQLite app) and set `VITE_API_URL` to its public URL before building.

## 3. Build the mobile app (Capacitor wrap)
This packages the same web app as an installable iOS/Android app using a native WebView shell.

```
cd web
npm install -D @capacitor/core @capacitor/cli @capacitor/ios @capacitor/android
npm run build              # produces web/dist

cd ../mobile
npx cap init VibeSpace com.vibespace.app --web-dir=../web/dist
npx cap add ios            # requires Xcode, macOS only
npx cap add android        # requires Android Studio
npx cap sync
npx cap open ios           # or: npx cap open android
```
From there you build/run it in Xcode or Android Studio like any native app, and submit to the App Store / Play Store through your own developer accounts.

**Before shipping to app stores:** point `VITE_API_URL` at your deployed (not localhost) backend and rebuild — a phone can't reach your laptop's localhost.

## Next steps (in priority order)
1. Wire gifts, remaining vault memories, and VibeRoulette random matching to their own Supabase tables.
2. Real GIF search (e.g. Giphy/Tenor API) instead of file-upload-only GIFs — needs an API key from that provider.
3. Expand VibeLens's lens library and the 3D avatar's customization options — both foundations are real and reusable, so adding more variety is mostly art/design work, not new engineering.
4. Show a user's 3D avatar elsewhere in the app (profile card, matches, comments) instead of just the initial-letter circle — the avatar config is already saved and ready to reuse.
5. Facebook/TikTok OAuth — enable each provider in Supabase and register a developer app with that platform.
6. Replace the cosmetic liveness check with a real provider (e.g. a face-verification API) if you want actual bot/catfish prevention — this matters a lot for a dating product.
7. A real chat/messaging feature between matched users (currently matching works, but matched users have no way to message each other yet).
8. Decide whether to keep or remove `backend/` — everything it did for auth is now handled by Supabase.
