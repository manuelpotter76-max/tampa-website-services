-- Delete records 2 years after a person's last interaction (privacy policy).
-- Runs daily at 07:17 UTC via pg_cron. Lives in a private schema so it is not callable through the API.
create extension if not exists pg_cron;
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create or replace function private.purge_old_records() returns void
language sql as $$
  with cutoff as (select now() - interval '2 years' as t),
  recent_emails as (
    select lower(coalesce(email,'')) as e from public.leads, cutoff where coalesce(email,'') <> '' and created_at >= cutoff.t
    union
    select lower(coalesce(email,'')) from public.audits, cutoff where coalesce(email,'') <> '' and created_at >= cutoff.t
  ),
  recent_phones as (
    select regexp_replace(coalesce(phone,''), '\D', '', 'g') as p from public.leads, cutoff where coalesce(phone,'') <> '' and created_at >= cutoff.t
  ),
  del_leads as (
    delete from public.leads l using cutoff
    where l.created_at < cutoff.t
      and (coalesce(l.email,'') = '' or lower(l.email) not in (select e from recent_emails))
      and (coalesce(l.phone,'') = '' or regexp_replace(l.phone, '\D', '', 'g') not in (select p from recent_phones))
    returning 1
  ),
  del_audits as (
    delete from public.audits a using cutoff
    where a.created_at < cutoff.t
      and (coalesce(a.email,'') = '' or lower(a.email) not in (select e from recent_emails))
    returning 1
  )
  delete from public.chats c using cutoff where c.updated_at < cutoff.t;
$$;
revoke all on function private.purge_old_records() from public, anon, authenticated;

select cron.schedule('purge-old-records', '17 7 * * *', $$select private.purge_old_records()$$);
