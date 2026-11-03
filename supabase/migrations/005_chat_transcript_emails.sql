-- Track which chat messages have already been emailed to Manny.
alter table public.chats add column if not exists emailed_at timestamptz;
alter table public.chats add column if not exists emailed_msg_count integer not null default 0;
create index if not exists chats_updated_at_idx on public.chats (updated_at);
update public.chats set emailed_msg_count = jsonb_array_length(messages), emailed_at = now();
