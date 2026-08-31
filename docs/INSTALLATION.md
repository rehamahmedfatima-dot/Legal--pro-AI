# Installation Guide

## 1. Prerequisites
- Node.js 20+
- A Supabase project (free tier is enough to start): https://supabase.com/dashboard
- A Gemini API key: https://aistudio.google.com/app/apikey

## 2. Clone & install
```bash
git clone <your-repo-url> legalpro-ai
cd legalpro-ai
npm install
```

## 3. Configure environment
```bash
cp .env.example .env.local
```
Fill in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key from Supabase settings>
SUPABASE_SERVICE_ROLE_KEY=<service role key — server only, never expose>
GEMINI_API_KEY=<not used by Next.js directly — see step 5>
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 4. Push the database schema
```bash
npm install -g supabase
supabase login
supabase link --project-ref <project-ref>
supabase db push
```
This creates all tables, enums, triggers, and Row Level Security policies from
`supabase/migrations/0001_init.sql`.

## 5. Deploy the AI Edge Functions
```bash
supabase functions deploy ai-legal-assistant
supabase functions deploy ai-contract-analyzer
supabase functions deploy ai-document-generator
supabase secrets set GEMINI_API_KEY=<your gemini key>
```
The Gemini key lives only in Supabase's Edge Function secrets — it is never
bundled into the Next.js app. All three functions share
`supabase/functions/_shared/gemini.ts`, so this one secret covers all of them.

## 6. Enable Google OAuth (optional)
In the Supabase dashboard: Authentication → Providers → Google, add your OAuth
client ID/secret, and set the redirect URL to
`http://localhost:3000/api/auth/callback` (and your production URL later).

## 7. Seed the first admin (Khaled Ahmed)
Register a normal account through `/register`, then in the Supabase SQL editor:
```sql
update public.profiles set role = 'admin' where email = 'khaled@example.com';
```

## 8. Run locally
```bash
npm run dev
```
Visit http://localhost:3000

## 9. Deploy
- Push the repo to GitHub.
- Import it into Vercel, set the same env vars from step 3 in the Vercel
  project settings.
- Every push to `main` re-deploys the frontend; run `supabase db push` /
  `supabase functions deploy` separately (or wire into GitHub Actions) for
  backend changes.
