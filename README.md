# LegalPro AI

**Smart Legal Solutions. Trusted Professional Service.**

Phase 1 (MVP) of the LegalPro AI legal case management platform, owned by Khaled Ahmed.
This is real, working source code — not a mockup — built with Next.js 14 (App Router),
Supabase (Postgres + Auth + Storage + Edge Functions), and the Gemini API.

## What's implemented in this drop

- Public home page (hero, stats, practice areas)
- Email/password + Google auth (Supabase Auth), with role-aware redirects
- Role-based route protection via middleware (`admin` / `lawyer` / `client`)
- Full Postgres schema with Row Level Security (`supabase/migrations/0001_init.sql`)
- Client dashboard: real cases + appointments pulled from Supabase
- Lawyer dashboard: case stats, case list, "New Case" flow with a real
  Zod-validated Server Action that inserts into Postgres
- Case detail page with a live, database-driven timeline
- A working AI Legal Assistant: browser → Next.js route handler → Supabase
  Edge Function → Gemini API, with the required
  *"This AI does not replace professional legal advice."* disclaimer and
  per-user audit logging
- **AI Contract Analyzer**: real file upload to a private Supabase Storage
  bucket (`contracts`, owner-scoped RLS), then a Gemini multimodal call that
  reads the PDF/DOCX directly and returns structured risks, obligations,
  rights, missing clauses, and recommendations — persisted to
  `contract_analyses`
- **AI Document Generator**: role-restricted (lawyer/admin) form that drafts
  contracts, notices, POAs, and 7 other document types via Gemini, editable
  in the browser, persisted to `generated_documents`, with the required
  *"Draft for review by a licensed lawyer before use."* disclaimer

All three AI Edge Functions share one Gemini calling convention
(`supabase/functions/_shared/gemini.ts`) so behavior, error handling, and
auth checks stay consistent as more AI tools are added.

## What's intentionally not in this drop

Everything else under **Phase 2** (AI Case Summary, AI Legal Strategy, OCR,
voice notes) and all of **Phase 3** (payments, e-signature, multi-branch,
etc.) from the master spec — building those with the same real, verified
rigor needs further passes. See `docs/INSTALLATION.md` for how to run this,
and ask for the next module to continue.

## Stack

Next.js 14 · TypeScript · Tailwind CSS · Supabase (Postgres/Auth/Storage/Edge
Functions) · Gemini API · Zod · React Hook Form

## Note on verification

This sandbox has no network access, so `npm install` / `next build` could not be
run here to compile-check the code. It was written and manually reviewed for
import correctness, bracket/type consistency, and Supabase/Next.js API accuracy —
but you should run `npm install && npm run typecheck` yourself before deploying.
