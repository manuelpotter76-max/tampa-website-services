-- Track audit page titles and when the emailed report went out.
alter table public.audits add column if not exists meta jsonb not null default '{}'::jsonb;
alter table public.audits add column if not exists report_sent_at timestamptz;
