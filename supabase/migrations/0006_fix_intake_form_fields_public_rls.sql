/*
============================================================
File: supabase/migrations/0006_fix_intake_form_fields_public_rls.sql
Project: BizPilot AI
Description: Hotfixes public RLS for intake_form_fields after Phase 4 migration has already been applied.
Role: Removes stale/experimental intake_form_fields policies, hardens helper signature, and recreates canonical field policies.
Related:
- supabase/migrations/0005_public_intake_and_leads.sql
- tests/rls/public-intake-and-leads.test.sql
Author: MoOoH
Created: 2026-05-07
Last Updated: 2026-05-07
Change Log:
- 2026-05-07: Added deterministic hotfix for public visible field reads.
============================================================
*/

alter table public.intake_form_fields enable row level security;

-- Remove every policy on this table to eliminate stale SQL Editor experiments
-- and old versions of the Phase 4 field policy.
do $$
declare
  policy_record record;
begin
  for policy_record in
    select policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = 'intake_form_fields'
  loop
    execute format(
      'drop policy if exists %I on public.intake_form_fields',
      policy_record.policyname
    );
  end loop;
end;
$$;

-- Remove old helper signatures before creating the canonical one.
drop function if exists public.can_public_read_intake_field(uuid, boolean);
drop function if exists public.can_public_read_intake_field(uuid, uuid, boolean);
drop function if exists public.can_public_read_intake_field(uuid, uuid, boolean, uuid);

create or replace function public.can_public_read_intake_field(
  target_business_id uuid,
  target_form_id uuid,
  target_field_hidden boolean
)
returns boolean
language sql
stable
security definer
set search_path = public
set row_security = off
as $$
  select exists (
    select 1
    from public.intake_forms form
    where form.id = target_form_id
      and form.business_id = target_business_id
      and form.is_active = true
      and target_field_hidden = false
      and public.has_active_public_link(target_business_id)
  );
$$;

grant execute on function public.can_public_read_intake_field(uuid, uuid, boolean) to anon, authenticated;

create policy "intake_form_fields_select_public_active"
on public.intake_form_fields
for select
to anon, authenticated
using (
  public.can_public_read_intake_field(
    business_id,
    intake_form_id,
    is_hidden
  )
);

create policy "intake_form_fields_select_member"
on public.intake_form_fields
for select
to authenticated
using (public.is_business_member(business_id));

create policy "intake_form_fields_manage_manager"
on public.intake_form_fields
for all
to authenticated
using (public.can_manage_business(business_id))
with check (public.can_manage_business(business_id));
