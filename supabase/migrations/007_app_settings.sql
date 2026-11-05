-- Server-only key/value settings (e.g. the Zoho CRM refresh token). RLS on, no policies: only the service role can read or write.
create table if not exists public.app_settings (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);
alter table public.app_settings enable row level security;
