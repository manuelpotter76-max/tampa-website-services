-- Missed calls from Zoom Phone are saved as leads.
alter table public.leads drop constraint if exists leads_source_check;
alter table public.leads add constraint leads_source_check check (source in ('contact', 'audit', 'chat', 'pricing', 'call'));
create index if not exists leads_call_id_idx on public.leads ((meta->>'call_id')) where source = 'call';
