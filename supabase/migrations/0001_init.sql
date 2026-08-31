-- LegalPro AI — Phase 1 core schema
-- Run with: supabase db push (after `supabase link`)

create extension if not exists "pgcrypto";

create type user_role as enum ('admin', 'lawyer', 'client');
create type case_status as enum ('open', 'in_progress', 'pending_court', 'closed', 'appealed');
create type case_priority as enum ('low', 'medium', 'high', 'urgent');
create type appointment_status as enum ('pending', 'confirmed', 'completed', 'cancelled', 'rescheduled');
create type consultation_type as enum ('in_person', 'video', 'phone');

-- ============================================================
-- profiles (1:1 with auth.users)
-- ============================================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null unique,
  phone text,
  role user_role not null default 'client',
  avatar_url text,
  locale text not null default 'ar',
  two_factor_enabled boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Auto-create a profile row whenever a new auth user signs up
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.email,
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'client')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Helper used inside RLS policies
create function public.is_admin()
returns boolean
language sql security definer set search_path = public
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

create function public.current_role()
returns user_role
language sql security definer set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

-- ============================================================
-- cases
-- ============================================================
create table public.cases (
  id uuid primary key default gen_random_uuid(),
  case_number text not null unique,
  title text not null,
  category text not null,
  status case_status not null default 'open',
  priority case_priority not null default 'medium',
  court_name text,
  judge_name text,
  lawyer_id uuid not null references public.profiles(id),
  client_id uuid not null references public.profiles(id),
  opened_at timestamptz not null default now(),
  closed_at timestamptz,
  outcome text,
  summary text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index cases_lawyer_id_idx on public.cases(lawyer_id);
create index cases_client_id_idx on public.cases(client_id);

-- ============================================================
-- case timeline events
-- ============================================================
create table public.case_timeline_events (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.cases(id) on delete cascade,
  event_type text not null check (event_type in (
    'created','document_added','court_session','deadline',
    'evidence_added','note','decision','appeal','result'
  )),
  title text not null,
  description text,
  event_date timestamptz not null default now(),
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now()
);

create index timeline_case_id_idx on public.case_timeline_events(case_id);

-- Auto-log a "created" timeline event whenever a case is inserted
create function public.log_case_created()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  insert into public.case_timeline_events (case_id, event_type, title, created_by)
  values (new.id, 'created', 'Case opened: ' || new.title, new.lawyer_id);
  return new;
end;
$$;

create trigger on_case_created
  after insert on public.cases
  for each row execute procedure public.log_case_created();

-- ============================================================
-- appointments
-- ============================================================
create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles(id),
  lawyer_id uuid not null references public.profiles(id),
  consultation_type consultation_type not null default 'in_person',
  scheduled_at timestamptz not null,
  duration_minutes int not null default 30,
  status appointment_status not null default 'pending',
  issue_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index appointments_client_id_idx on public.appointments(client_id);
create index appointments_lawyer_id_idx on public.appointments(lawyer_id);

-- ============================================================
-- Row Level Security
-- ============================================================
alter table public.profiles enable row level security;
alter table public.cases enable row level security;
alter table public.case_timeline_events enable row level security;
alter table public.appointments enable row level security;

-- profiles: everyone can read their own row; admins read/write all
create policy "profiles: self select" on public.profiles
  for select using (id = auth.uid() or public.is_admin());

create policy "profiles: self update" on public.profiles
  for update using (id = auth.uid() or public.is_admin());

create policy "profiles: admin insert" on public.profiles
  for insert with check (public.is_admin());

-- cases: client sees own cases, lawyer sees assigned cases, admin sees all
create policy "cases: select own" on public.cases
  for select using (
    client_id = auth.uid()
    or lawyer_id = auth.uid()
    or public.is_admin()
  );

create policy "cases: lawyer/admin insert" on public.cases
  for insert with check (
    (public.current_role() = 'lawyer' and lawyer_id = auth.uid())
    or public.is_admin()
  );

create policy "cases: lawyer/admin update" on public.cases
  for update using (
    (public.current_role() = 'lawyer' and lawyer_id = auth.uid())
    or public.is_admin()
  );

-- case_timeline_events: visible to anyone who can see the parent case
create policy "timeline: select via case" on public.case_timeline_events
  for select using (
    exists (
      select 1 from public.cases c
      where c.id = case_id
        and (c.client_id = auth.uid() or c.lawyer_id = auth.uid() or public.is_admin())
    )
  );

create policy "timeline: lawyer/admin insert" on public.case_timeline_events
  for insert with check (
    exists (
      select 1 from public.cases c
      where c.id = case_id
        and (c.lawyer_id = auth.uid() or public.is_admin())
    )
  );

-- appointments: client sees/creates own, lawyer sees/manages assigned, admin sees all
create policy "appointments: select own" on public.appointments
  for select using (
    client_id = auth.uid() or lawyer_id = auth.uid() or public.is_admin()
  );

create policy "appointments: client insert" on public.appointments
  for insert with check (client_id = auth.uid() or public.is_admin());

create policy "appointments: owner update" on public.appointments
  for update using (
    client_id = auth.uid() or lawyer_id = auth.uid() or public.is_admin()
  );

-- ============================================================
-- AI interaction audit log (written only by Edge Functions
-- via the service role key — no direct client insert policy)
-- ============================================================
create table public.ai_interactions_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id),
  feature text not null check (
    feature in ('assistant','contract_analyzer','document_generator','case_summary','strategy')
  ),
  input_ref text,
  output_summary text,
  created_at timestamptz not null default now()
);

create index ai_log_user_id_idx on public.ai_interactions_log(user_id);

alter table public.ai_interactions_log enable row level security;

-- Users can read their own AI usage history; only the service role
-- (Edge Functions) can insert, which bypasses RLS by design.
create policy "ai_log: select own" on public.ai_interactions_log
  for select using (user_id = auth.uid() or public.is_admin());
