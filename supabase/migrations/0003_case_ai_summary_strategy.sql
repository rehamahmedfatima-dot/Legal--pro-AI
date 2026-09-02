-- LegalPro AI — Phase 2: AI Case Summary + AI Legal Strategy
-- Run with: supabase db push

-- ============================================================
-- case_ai_summaries
-- ============================================================
create table public.case_ai_summaries (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.cases(id) on delete cascade,
  created_by uuid not null references public.profiles(id),
  input_text text,
  facts jsonb not null default '[]'::jsonb,
  people jsonb not null default '[]'::jsonb,
  events jsonb not null default '[]'::jsonb,
  evidence jsonb not null default '[]'::jsonb,
  important_dates jsonb not null default '[]'::jsonb,
  legal_issues jsonb not null default '[]'::jsonb,
  strengths jsonb not null default '[]'::jsonb,
  weaknesses jsonb not null default '[]'::jsonb,
  missing_information jsonb not null default '[]'::jsonb,
  timeline jsonb not null default '[]'::jsonb,
  summary text,
  created_at timestamptz not null default now()
);

create index case_ai_summaries_case_id_idx on public.case_ai_summaries(case_id);

alter table public.case_ai_summaries enable row level security;

-- Internal working document: visible to the case's lawyer and admins only
-- (not the client) — matches how case_ai_strategies below is scoped.
create policy "case_ai_summaries: select for case lawyer" on public.case_ai_summaries
  for select using (
    exists (
      select 1 from public.cases c
      where c.id = case_id and (c.lawyer_id = auth.uid() or public.is_admin())
    )
  );

-- Inserted only by the ai-case-summary Edge Function via the service
-- role key, which bypasses RLS — no client insert policy.

-- ============================================================
-- case_ai_strategies
-- ============================================================
create table public.case_ai_strategies (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.cases(id) on delete cascade,
  summary_id uuid not null references public.case_ai_summaries(id) on delete cascade,
  created_by uuid not null references public.profiles(id),
  chronological_timeline jsonb not null default '[]'::jsonb,
  open_questions jsonb not null default '[]'::jsonb,
  missing_documents jsonb not null default '[]'::jsonb,
  research_flags jsonb not null default '[]'::jsonb,
  discussion_topics jsonb not null default '[]'::jsonb,
  deadline_reminders jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create index case_ai_strategies_case_id_idx on public.case_ai_strategies(case_id);

alter table public.case_ai_strategies enable row level security;

create policy "case_ai_strategies: select for case lawyer" on public.case_ai_strategies
  for select using (
    exists (
      select 1 from public.cases c
      where c.id = case_id and (c.lawyer_id = auth.uid() or public.is_admin())
    )
  );

-- Inserted only by the ai-legal-strategy Edge Function via the service
-- role key — no client insert policy.
