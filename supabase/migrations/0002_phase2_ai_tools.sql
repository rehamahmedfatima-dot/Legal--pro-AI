-- LegalPro AI — Phase 2: AI Contract Analyzer + AI Document Generator
-- Run with: supabase db push

-- ============================================================
-- Storage bucket for uploaded contracts (private)
-- ============================================================
insert into storage.buckets (id, name, public)
values ('contracts', 'contracts', false)
on conflict (id) do nothing;

-- Users may only read/write inside a folder named after their own user id:
-- contracts/<user_id>/<filename>
create policy "contracts: owner read"
  on storage.objects for select
  using (
    bucket_id = 'contracts'
    and (auth.uid()::text = (storage.foldername(name))[1] or public.is_admin())
  );

create policy "contracts: owner upload"
  on storage.objects for insert
  with check (
    bucket_id = 'contracts'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "contracts: owner delete"
  on storage.objects for delete
  using (
    bucket_id = 'contracts'
    and (auth.uid()::text = (storage.foldername(name))[1] or public.is_admin())
  );

-- ============================================================
-- contract_analyses
-- ============================================================
create table public.contract_analyses (
  id uuid primary key default gen_random_uuid(),
  uploaded_by uuid not null references public.profiles(id),
  case_id uuid references public.cases(id),
  file_path text not null,
  file_name text not null,
  status text not null default 'pending' check (status in ('pending', 'completed', 'failed')),
  summary text,
  risks jsonb not null default '[]'::jsonb,
  obligations jsonb not null default '[]'::jsonb,
  rights jsonb not null default '[]'::jsonb,
  missing_clauses jsonb not null default '[]'::jsonb,
  recommendations jsonb not null default '[]'::jsonb,
  error_message text,
  created_at timestamptz not null default now()
);

create index contract_analyses_uploaded_by_idx on public.contract_analyses(uploaded_by);

alter table public.contract_analyses enable row level security;

create policy "contract_analyses: select own" on public.contract_analyses
  for select using (uploaded_by = auth.uid() or public.is_admin());

-- Inserted only by the ai-contract-analyzer Edge Function via the
-- service role key, which bypasses RLS by design — no client insert policy.

-- ============================================================
-- generated_documents
-- ============================================================
create table public.generated_documents (
  id uuid primary key default gen_random_uuid(),
  created_by uuid not null references public.profiles(id),
  case_id uuid references public.cases(id),
  document_type text not null check (document_type in (
    'contract', 'legal_notice', 'power_of_attorney', 'declaration',
    'court_request', 'legal_letter', 'employment_contract',
    'rental_contract', 'purchase_agreement', 'company_formation'
  )),
  title text not null,
  content text not null,
  form_data jsonb not null default '{}'::jsonb,
  language text not null default 'ar',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index generated_documents_created_by_idx on public.generated_documents(created_by);

alter table public.generated_documents enable row level security;

create policy "generated_documents: select own" on public.generated_documents
  for select using (created_by = auth.uid() or public.is_admin());

create policy "generated_documents: owner update" on public.generated_documents
  for update using (created_by = auth.uid() or public.is_admin());

-- Inserted only by the ai-document-generator Edge Function via the
-- service role key — no client insert policy.
