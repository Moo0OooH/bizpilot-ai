/*
============================================================
File: supabase/migrations/0013_public_submission_abuse_log.sql
Project: BizPilot AI
Description: Phase 13 abuse-protection schema for the public quote submission path.
Role: Records anon submission attempts and exposes two security-definer helpers used by
      the service layer to record and count attempts per (business, ip_hash) without
      requiring anon to read or write the table directly.
Related:
- supabase/migrations/0005_public_intake_and_leads.sql
- supabase/migrations/0010_explicit_data_api_grants.sql
- server/services/abuse-protection.service.ts
- tests/rls/public-submission-abuse-log.test.sql
- docs/security/BIZPILOT_SUPABASE_EXPLICIT_GRANTS_AUDIT_v1.0.md
- docs/architecture/BIZPILOT_VENDOR_INDEPENDENCE_AND_PORTABILITY_STANDARD_v1.0.md (Sections 11, 13)
Author: MoOoH
Created: 2026-05-15
Last Updated: 2026-05-15
Change Log:
- 2026-05-15: Created the abuse log table, helper functions, RLS, and grants.
============================================================
*/

-- ============================================================
-- Table
-- ============================================================

create table if not exists public.public_submission_abuse_log (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  intake_form_id uuid references public.intake_forms(id) on delete set null,
  ip_hash text not null check (char_length(ip_hash) between 32 and 128),
  reason text not null check (reason in (
    'submission_completed',
    'rate_limit_exceeded',
    'honeypot_triggered',
    'consent_missing',
    'invalid_form',
    'invalid_field'
  )),
  created_at timestamptz not null default now()
);

create index if not exists public_submission_abuse_log_ip_window_idx
  on public.public_submission_abuse_log (business_id, ip_hash, created_at desc);

create index if not exists public_submission_abuse_log_business_window_idx
  on public.public_submission_abuse_log (business_id, created_at desc);

-- ============================================================
-- Security definer helpers
-- ============================================================
-- The service layer uses these so anon never needs direct INSERT or SELECT
-- on the table. The functions enforce the table's invariants (referenced
-- business/form exist) and are the only path through which rows are written
-- or counted from the public flow.

create or replace function public.record_public_submission_attempt(
  target_business_id uuid,
  target_intake_form_id uuid,
  target_ip_hash text,
  target_reason text
)
returns void
language plpgsql
security definer
set search_path = public
set row_security = off
as $$
begin
  if target_business_id is null then
    raise exception 'record_public_submission_attempt requires a business id.';
  end if;

  if target_ip_hash is null or char_length(target_ip_hash) = 0 then
    raise exception 'record_public_submission_attempt requires an ip_hash.';
  end if;

  if not exists (
    select 1 from public.businesses where id = target_business_id
  ) then
    -- Silently ignore unknown business_ids. The function exists so anon can
    -- log without leaking which business ids are valid.
    return;
  end if;

  insert into public.public_submission_abuse_log
    (business_id, intake_form_id, ip_hash, reason)
  values
    (target_business_id, target_intake_form_id, target_ip_hash, target_reason);
end;
$$;

create or replace function public.count_recent_public_submission_attempts(
  target_business_id uuid,
  target_ip_hash text,
  target_window_minutes integer
)
returns integer
language sql
stable
security definer
set search_path = public
set row_security = off
as $$
  select count(*)::integer
  from public.public_submission_abuse_log
  where business_id = target_business_id
    and ip_hash = target_ip_hash
    and created_at >= now() - make_interval(mins => target_window_minutes);
$$;

-- ============================================================
-- RLS and grants
-- ============================================================

alter table public.public_submission_abuse_log enable row level security;

-- Members of the business can read their own abuse log (no insert/update/delete from the dashboard).
drop policy if exists "public_submission_abuse_log_select_member"
  on public.public_submission_abuse_log;
create policy "public_submission_abuse_log_select_member"
on public.public_submission_abuse_log
for select
to authenticated
using (public.is_business_member(business_id));

-- The functions above are the only path that writes to this table. Service-role
-- retains full grants for export and maintenance.
grant select on public.public_submission_abuse_log to authenticated;
grant select, insert, update, delete on public.public_submission_abuse_log to service_role;

grant execute on function public.record_public_submission_attempt(uuid, uuid, text, text)
  to anon, authenticated, service_role;

grant execute on function public.count_recent_public_submission_attempts(uuid, text, integer)
  to anon, authenticated, service_role;
