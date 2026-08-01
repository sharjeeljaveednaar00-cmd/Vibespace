# VibeSpace — Web + Mobile + Backend

## Auth & database: now on Supabase
Auth (including Google sign-in) and the user's profile now run through **Supabase** instead of the earlier custom Express backend — since you already set up Google OAuth there, it's the simpler path (hosted auth + Postgres in one place). The `backend/` folder (Express + SQLite) is no longer used for auth; keep it only if you want a separate API for future non-auth features, or delete it.

## What's real vs. mock right now
- **Real:** email/password signup & login, Google sign-in, sessions, and the logged-in user's name/bio/coins/level/XP — all in Supabase (Postgres).
- **Still mock (phase 2):** feed posts, matches/VibeRoulette, gifts, memory vault, games, communities. These currently reset on refresh — each can be moved into its own Supabase table the same way `profiles` was. Ask to wire up a specific feature next.
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
1. Wire feed posts, matches, gifts, and vault memories to their own Supabase tables (same pattern as `profiles`).
2. Facebook/TikTok OAuth — enable each provider in Supabase and register a developer app with that platform.
3. Replace the cosmetic liveness check with a real provider (e.g. a face-verification API) if you want actual bot/catfish prevention — this matters a lot for a dating product.
4. Decide whether to keep or remove `backend/` — everything it did for auth is now handled by Supabase.
