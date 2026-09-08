-- LegalPro AI — Client <-> Lawyer Messaging
-- Run with: supabase db push

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references public.profiles(id),
  receiver_id uuid not null references public.profiles(id),
  case_id uuid references public.cases(id),
  body text not null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index messages_sender_id_idx on public.messages(sender_id);
create index messages_receiver_id_idx on public.messages(receiver_id);
create index messages_conversation_idx on public.messages(sender_id, receiver_id, created_at);

alter table public.messages enable row level security;

create policy "messages: select own" on public.messages
  for select using (
    sender_id = auth.uid() or receiver_id = auth.uid() or public.is_admin()
  );

create policy "messages: insert as self" on public.messages
  for insert with check (sender_id = auth.uid());

-- Only the receiver may mark a message read (updates read_at)
create policy "messages: receiver marks read" on public.messages
  for update using (receiver_id = auth.uid())
  with check (receiver_id = auth.uid());

-- Enable live updates so open conversations receive new messages instantly
alter publication supabase_realtime add table public.messages;
