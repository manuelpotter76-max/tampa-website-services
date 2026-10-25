-- keep only the newest row per session, then enforce one row per session
delete from public.chats c using public.chats n
  where c.session_id = n.session_id and c.created_at < n.created_at;
alter table public.chats add column if not exists updated_at timestamptz not null default now();
create unique index if not exists chats_session_id_key on public.chats (session_id);
