-- Leads from the contact form, audit email unlock, and chat handoffs
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  source text not null check (source in ('contact', 'audit', 'chat', 'pricing')),
  name text,
  email text,
  phone text,
  website text,
  message text,
  sms_consent boolean not null default false,
  sms_consent_text text,
  page text,
  meta jsonb not null default '{}'::jsonb
);

-- Every Instant AI Audit run
create table if not exists public.audits (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  url text not null,
  overall int,
  scores jsonb not null default '{}'::jsonb,
  findings jsonb not null default '[]'::jsonb,
  email text
);

-- Concierge conversations (kept for follow-up and quality review)
create table if not exists public.chats (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  session_id text not null,
  page text,
  messages jsonb not null default '[]'::jsonb
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists audits_created_at_idx on public.audits (created_at desc);
create index if not exists chats_session_idx on public.chats (session_id);

-- Lock everything down. Only the server (service role) reads or writes. No public policies.
alter table public.leads enable row level security;
alter table public.audits enable row level security;
alter table public.chats enable row level security;
