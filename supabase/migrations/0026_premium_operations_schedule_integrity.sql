/*
============================================================
File: supabase/migrations/0026_premium_operations_schedule_integrity.sql
Project: BizPilot AI
Description: Hardens Premium Operations schedule provenance, exact-time intake, recipient currentness, atomic review-draft creation, and founder entitlement auditing.
Role: Keeps availability and bulk-review workflows tenant-safe, current, manual-only, and transactionally complete without creating public booking or automatic messaging.
Related:
- supabase/migrations/0025_premium_operations_addons.sql
- tests/rls/premium-operations-addons.test.sql
- tests/unit/premium-operations-schedule-integrity-source.test.mts
- docs/product/BIZPILOT_PREMIUM_OPERATIONS_ADDONS_v1.0.md
Author: MoOoH
Created: 2026-07-22
Last Updated: 2026-07-22
Change Log:
- 2026-07-22: Added canonical exact-time intake, fixed Toronto timezone derivation, operating hours, overlap serialization, availability provenance/currentness, atomic draft RPCs, and founder entitlement audit RPC.
- 2026-07-22: Enforced least-privilege helper grants, derived earliest openings, NULL-safe metadata, future starts, and cancellation/delete serialization.
- 2026-07-22: Revalidated durable recipient counts and non-terminal leads at generic review/copy, including lead/recipient deletion races and clean parent cascades.
- 2026-07-22: Kept direct exact-date deletion fail-closed while allowing submission/business cascades, and retained stale drafts to remove create-versus-review lock inversion.
============================================================
*/

/*
  Product contract: every date/time without an explicit offset is interpreted
  in this one shared business timezone. Keep the literal synchronized with the
  application BUSINESS_OPERATING_TIME_ZONE constant. There is deliberately no
  per-business timezone setting in this release.
*/
create or replace function public.premium_operations_operating_time_zone()
returns text
language sql
immutable
security invoker
set search_path = public
as $$
  select 'America/Toronto'::text;
$$;

revoke all on function public.premium_operations_operating_time_zone()
  from public;
grant execute on function public.premium_operations_operating_time_zone()
  to anon, authenticated, service_role;

alter table public.businesses
  add column if not exists operating_day_start time without time zone
    not null default '08:00',
  add column if not exists operating_day_end time without time zone
    not null default '18:00';

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'businesses_operating_day_check'
      and conrelid = 'public.businesses'::regclass
  ) then
    alter table public.businesses
      add constraint businesses_operating_day_check
      check (operating_day_end > operating_day_start);
  end if;
end
$$;

create or replace function public.premium_operations_workspace_is_writable(
  target_business_id uuid
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
    from public.businesses business
    where business.id = target_business_id
      and business.status in ('onboarding', 'active')
      and business.plan_slug <> 'paused'
      and business.lifecycle_status = 'active'
      and business.deletion_requested_at is null
      and business.deleted_at is null
      and (
        auth.uid() is null
        or public.can_manage_business(target_business_id)
      )
  );
$$;

revoke all on function public.premium_operations_workspace_is_writable(uuid)
  from public;
grant execute on function public.premium_operations_workspace_is_writable(uuid)
  to authenticated, service_role;

-- Internal entitlement lookup for security-definer validation. Only the
-- trusted service role receives direct EXECUTE; authenticated callers must use
-- the membership-aware add-on helper from migration 0025.
create or replace function public.premium_operations_entitlement_record_is_active(
  target_business_id uuid,
  target_addon_key text
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
    from public.business_addon_entitlements entitlement
    where entitlement.business_id = target_business_id
      and entitlement.addon_key = target_addon_key
      and entitlement.status in ('enabled', 'trial')
      and (
        entitlement.expires_at is null
        or entitlement.expires_at > statement_timestamp()
      )
  );
$$;

revoke all on function public.premium_operations_entitlement_record_is_active(uuid, text)
  from public;
grant execute on function public.premium_operations_entitlement_record_is_active(uuid, text)
  to service_role;

create or replace function public.enforce_business_operating_schedule_entitlement()
returns trigger
language plpgsql
security definer
set search_path = public
set row_security = off
as $$
begin
  if new.operating_day_start is not distinct from old.operating_day_start
    and new.operating_day_end is not distinct from old.operating_day_end then
    return new;
  end if;

  -- Migration/service-role maintenance has no end-user JWT. Direct signed-in
  -- writes must remain manager-only, active-workspace, and separately entitled.
  if auth.uid() is not null
    and (
      not public.premium_operations_workspace_is_writable(new.id)
      or not public.premium_operations_addon_is_active(
        new.id,
        'availability_coordination'
      )
    ) then
    raise exception 'Availability Coordination is required to change operating hours.';
  end if;

  return new;
end;
$$;

revoke all on function public.enforce_business_operating_schedule_entitlement()
  from public;

drop trigger if exists businesses_enforce_operating_schedule_entitlement
  on public.businesses;
create trigger businesses_enforce_operating_schedule_entitlement
before update of operating_day_start, operating_day_end
on public.businesses
for each row
execute function public.enforce_business_operating_schedule_entitlement();

-- Exact preferred time is a real field type, not a string overloaded onto a
-- named window. Keep the earlier radio extension while adding `time`.
alter table public.industry_template_fields
  drop constraint if exists industry_template_fields_field_type_check;

alter table public.industry_template_fields
  add constraint industry_template_fields_field_type_check
  check (
    field_type in (
      'text',
      'textarea',
      'email',
      'phone',
      'number',
      'select',
      'radio',
      'boolean',
      'date',
      'time',
      'time_window'
    )
  );

alter table public.intake_form_fields
  drop constraint if exists intake_form_fields_field_type_check;

alter table public.intake_form_fields
  add constraint intake_form_fields_field_type_check
  check (
    field_type in (
      'text',
      'textarea',
      'email',
      'phone',
      'number',
      'select',
      'radio',
      'boolean',
      'date',
      'time',
      'time_window'
    )
  );

with cleaning_template as (
  select id
  from public.industry_templates
  where slug = 'cleaning-smart-quote-v1'
)
insert into public.industry_template_fields (
  template_id,
  field_key,
  label,
  field_type,
  is_required,
  help_text,
  options,
  sort_order
)
select
  cleaning_template.id,
  'preferred_time',
  'Preferred exact time',
  'time',
  false,
  'Customer preferred exact time. The business still reviews availability before confirming.',
  '[]'::jsonb,
  75
from cleaning_template
on conflict (template_id, field_key) do update
set
  label = excluded.label,
  field_type = excluded.field_type,
  is_required = excluded.is_required,
  help_text = excluded.help_text,
  options = excluded.options,
  sort_order = excluded.sort_order,
  is_active = true;

create or replace function public.sync_availability_preferred_time_field()
returns trigger
language plpgsql
security definer
set search_path = public
set row_security = off
as $$
declare
  target_business_id uuid := coalesce(new.business_id, old.business_id);
  canonical_template_field_id uuid;
  entitlement_active boolean;
begin
  if coalesce(new.addon_key, old.addon_key) <> 'availability_coordination' then
    if tg_op = 'DELETE' then
      return old;
    end if;

    return new;
  end if;

  select template_field.id
    into canonical_template_field_id
  from public.industry_template_fields template_field
  join public.industry_templates template
    on template.id = template_field.template_id
  where template.slug = 'cleaning-smart-quote-v1'
    and template_field.field_key = 'preferred_time'
    and template_field.field_type = 'time'
    and template_field.is_active = true;

  if canonical_template_field_id is null then
    raise exception 'Canonical preferred_time template field is missing.';
  end if;

  entitlement_active := public.premium_operations_entitlement_record_is_active(
    target_business_id,
    'availability_coordination'
  );

  if entitlement_active then
    insert into public.intake_form_fields (
      business_id,
      intake_form_id,
      template_field_id,
      field_key,
      label,
      field_type,
      is_required,
      is_hidden,
      help_text,
      options,
      sort_order
    )
    select
      form.business_id,
      form.id,
      canonical_template_field_id,
      'preferred_time',
      'Preferred exact time',
      'time',
      false,
      false,
      'Customer preferred exact time. The business still reviews availability before confirming.',
      '[]'::jsonb,
      75
    from public.intake_forms form
    join public.industry_templates template
      on template.id = form.template_id
    where form.business_id = target_business_id
      and template.slug = 'cleaning-smart-quote-v1'
    on conflict (intake_form_id, field_key) do nothing;
  end if;

  -- Never relink or overwrite a custom field that happens to reuse the key.
  update public.intake_form_fields field
  set
    label = 'Preferred exact time',
    field_type = 'time',
    is_required = false,
    is_hidden = not entitlement_active,
    help_text = 'Customer preferred exact time. The business still reviews availability before confirming.',
    options = '[]'::jsonb,
    sort_order = 75
  where field.business_id = target_business_id
    and field.template_field_id = canonical_template_field_id
    and field.field_key = 'preferred_time';

  if tg_op = 'DELETE' then
    return old;
  end if;

  return new;
end;
$$;

revoke all on function public.sync_availability_preferred_time_field()
  from public;

drop trigger if exists business_addon_entitlements_sync_preferred_time
  on public.business_addon_entitlements;
create trigger business_addon_entitlements_sync_preferred_time
after insert or update or delete
on public.business_addon_entitlements
for each row
execute function public.sync_availability_preferred_time_field();

-- Backfill forms that already had the add-on at migration time. A custom key
-- collision is left untouched and consequently cannot become canonical.
with canonical as (
  select template_field.id as template_field_id
  from public.industry_template_fields template_field
  join public.industry_templates template
    on template.id = template_field.template_id
  where template.slug = 'cleaning-smart-quote-v1'
    and template_field.field_key = 'preferred_time'
    and template_field.field_type = 'time'
    and template_field.is_active = true
), entitled_forms as (
  select form.*
  from public.intake_forms form
  join public.industry_templates template
    on template.id = form.template_id
  join public.business_addon_entitlements entitlement
    on entitlement.business_id = form.business_id
   and entitlement.addon_key = 'availability_coordination'
   and entitlement.status in ('enabled', 'trial')
   and (
     entitlement.expires_at is null
     or entitlement.expires_at > statement_timestamp()
   )
  where template.slug = 'cleaning-smart-quote-v1'
)
insert into public.intake_form_fields (
  business_id,
  intake_form_id,
  template_field_id,
  field_key,
  label,
  field_type,
  is_required,
  is_hidden,
  help_text,
  options,
  sort_order
)
select
  form.business_id,
  form.id,
  canonical.template_field_id,
  'preferred_time',
  'Preferred exact time',
  'time',
  false,
  false,
  'Customer preferred exact time. The business still reviews availability before confirming.',
  '[]'::jsonb,
  75
from entitled_forms form
cross join canonical
on conflict (intake_form_id, field_key) do nothing;

-- The public policy used the earlier three-argument overload. Drop the policy
-- first so the obsolete helper can be removed instead of remaining callable.
drop policy if exists "intake_form_fields_select_public_active"
  on public.intake_form_fields;
drop function if exists public.can_public_read_intake_field(uuid, uuid, boolean);

create or replace function public.can_public_read_intake_field(
  target_business_id uuid,
  target_form_id uuid,
  target_field_id uuid,
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
    join public.intake_form_fields field
      on field.id = target_field_id
     and field.intake_form_id = form.id
     and field.business_id = form.business_id
    left join public.industry_template_fields template_field
      on template_field.id = field.template_field_id
     and template_field.template_id = form.template_id
    where form.id = target_form_id
      and form.business_id = target_business_id
      and form.is_active = true
      and target_field_hidden = false
      and public.has_active_public_link(target_business_id)
      and (
        field.field_key <> 'preferred_time'
        or (
          field.field_type = 'time'
          and template_field.field_key = 'preferred_time'
          and template_field.field_type = 'time'
          and template_field.is_active = true
          and public.premium_operations_entitlement_record_is_active(
            target_business_id,
            'availability_coordination'
          )
        )
      )
  );
$$;

revoke all on function public.can_public_read_intake_field(uuid, uuid, uuid, boolean)
  from public;
grant execute on function public.can_public_read_intake_field(uuid, uuid, uuid, boolean)
  to anon, authenticated, service_role;

create policy "intake_form_fields_select_public_active"
on public.intake_form_fields
for select
to anon, authenticated
using (
  public.can_public_read_intake_field(
    business_id,
    intake_form_id,
    id,
    is_hidden
  )
);

create or replace function public.public_can_insert_submission_value(
  target_business_id uuid,
  target_submission_id uuid,
  target_field_key text
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
    from public.intake_submissions submission
    join public.intake_forms form
      on form.id = submission.intake_form_id
     and form.business_id = submission.business_id
    join public.intake_form_fields field
      on field.intake_form_id = submission.intake_form_id
     and field.business_id = submission.business_id
     and field.field_key = target_field_key
     and field.is_hidden = false
    left join public.industry_template_fields template_field
      on template_field.id = field.template_field_id
     and template_field.template_id = form.template_id
    where submission.id = target_submission_id
      and submission.business_id = target_business_id
      and (
        target_field_key <> 'preferred_time'
        or (
          field.field_type = 'time'
          and template_field.field_key = 'preferred_time'
          and template_field.field_type = 'time'
          and template_field.is_active = true
          and public.premium_operations_entitlement_record_is_active(
            target_business_id,
            'availability_coordination'
          )
        )
      )
  );
$$;

revoke all on function public.public_can_insert_submission_value(uuid, uuid, text)
  from public;
grant execute on function public.public_can_insert_submission_value(uuid, uuid, text)
  to anon, authenticated, service_role;

create or replace function public.premium_operations_safe_date(target_value text)
returns date
language plpgsql
immutable
security invoker
set search_path = public
as $$
begin
  if target_value is null
    or target_value !~ '^\d{4}-\d{2}-\d{2}$' then
    return null;
  end if;

  return target_value::date;
exception
  when invalid_datetime_format or datetime_field_overflow then
    return null;
end;
$$;

create or replace function public.premium_operations_safe_time(target_value text)
returns time without time zone
language plpgsql
immutable
security invoker
set search_path = public
as $$
begin
  if target_value is null
    or target_value !~ '^(?:[01]\d|2[0-3]):[0-5]\d$' then
    return null;
  end if;

  return target_value::time;
exception
  when invalid_datetime_format or datetime_field_overflow then
    return null;
end;
$$;

revoke all on function public.premium_operations_safe_date(text) from public;
revoke all on function public.premium_operations_safe_time(text) from public;

create or replace function public.premium_operations_local_time_is_unique(
  target_date date,
  target_time time without time zone
)
returns boolean
language plpgsql
stable
security definer
set search_path = public
set row_security = off
as $$
declare
  local_timestamp timestamp without time zone;
  resolved_instant timestamptz;
  matching_instants integer;
  operating_time_zone text :=
    public.premium_operations_operating_time_zone();
begin
  if target_date is null or target_time is null then
    return false;
  end if;

  local_timestamp := target_date + target_time;
  resolved_instant := local_timestamp at time zone operating_time_zone;

  -- A spring-forward gap normalizes to a different local clock value.
  if resolved_instant at time zone operating_time_zone <> local_timestamp then
    return false;
  end if;

  -- A fall-back fold maps two instants to the same local clock value. Search a
  -- three-hour envelope minute-by-minute to cover current Toronto DST shifts.
  select count(*)
    into matching_instants
  from generate_series(
    resolved_instant - interval '3 hours',
    resolved_instant + interval '3 hours',
    interval '1 minute'
  ) candidate(candidate_instant)
  where candidate_instant at time zone operating_time_zone = local_timestamp;

  return matching_instants = 1;
end;
$$;

revoke all on function public.premium_operations_local_time_is_unique(date, time without time zone)
  from public;

create or replace function public.premium_operations_exact_request_window(
  target_business_id uuid,
  target_lead_id uuid
)
returns table (
  submission_id uuid,
  requested_starts_at timestamptz,
  requested_ends_at timestamptz
)
language plpgsql
stable
security definer
set search_path = public
set row_security = off
as $$
declare
  requested_date date;
  requested_time time without time zone;
  operating_time_zone text :=
    public.premium_operations_operating_time_zone();
begin
  -- This helper is callable through the Data API, so a signed-in user may
  -- resolve only a lead in their own workspace. Service-role maintenance is
  -- allowed only when the JWT itself carries the trusted service role.
  if auth.uid() is null then
    if coalesce(auth.role(), '') <> 'service_role' then
      return;
    end if;
  elsif not public.is_business_member(target_business_id) then
    return;
  end if;

  select
    submission.id,
    public.premium_operations_safe_date(date_value.field_value #>> '{}'),
    public.premium_operations_safe_time(time_value.field_value #>> '{}')
  into submission_id, requested_date, requested_time
  from public.leads lead
  join public.intake_submissions submission
    on submission.id = lead.intake_submission_id
   and submission.business_id = lead.business_id
  join public.intake_forms form
    on form.id = submission.intake_form_id
   and form.business_id = submission.business_id
  join public.intake_form_fields date_field
    on date_field.intake_form_id = form.id
   and date_field.business_id = form.business_id
   and date_field.field_key = 'preferred_date'
   and date_field.field_type = 'date'
  join public.industry_template_fields date_template_field
    on date_template_field.id = date_field.template_field_id
   and date_template_field.template_id = form.template_id
   and date_template_field.field_key = 'preferred_date'
   and date_template_field.field_type = 'date'
   and date_template_field.is_active = true
  join public.intake_form_fields time_field
    on time_field.intake_form_id = form.id
   and time_field.business_id = form.business_id
   and time_field.field_key = 'preferred_time'
   and time_field.field_type = 'time'
  join public.industry_template_fields time_template_field
    on time_template_field.id = time_field.template_field_id
   and time_template_field.template_id = form.template_id
   and time_template_field.field_key = 'preferred_time'
   and time_template_field.field_type = 'time'
   and time_template_field.is_active = true
  join public.intake_submission_values date_value
    on date_value.submission_id = submission.id
   and date_value.business_id = submission.business_id
   and date_value.field_key = 'preferred_date'
  join public.intake_submission_values time_value
    on time_value.submission_id = submission.id
   and time_value.business_id = submission.business_id
   and time_value.field_key = 'preferred_time'
  where lead.id = target_lead_id
    and lead.business_id = target_business_id
    and lead.status not in ('archived', 'booked', 'lost')
    and jsonb_typeof(date_value.field_value) = 'string'
    and jsonb_typeof(time_value.field_value) = 'string';

  if submission_id is null
    or requested_date is null
    or requested_time is null
    or not public.premium_operations_local_time_is_unique(
      requested_date,
      requested_time
    ) then
    return;
  end if;

  requested_starts_at :=
    (requested_date + requested_time) at time zone operating_time_zone;
  requested_ends_at := requested_starts_at + interval '60 minutes';
  return next;
end;
$$;

revoke all on function public.premium_operations_exact_request_window(uuid, uuid)
  from public;
grant execute on function public.premium_operations_exact_request_window(uuid, uuid)
  to authenticated, service_role;

create or replace function public.enforce_submission_preferred_time_date_pair()
returns trigger
language plpgsql
security definer
set search_path = public
set row_security = off
as $$
declare
  target_business_id uuid := coalesce(new.business_id, old.business_id);
  target_submission_id uuid := coalesce(new.submission_id, old.submission_id);
  preferred_date_text text;
  preferred_time_text text;
  preferred_date date;
  preferred_time time without time zone;
  local_request timestamptz;
  operating_time_zone text :=
    public.premium_operations_operating_time_zone();
begin
  if coalesce(new.field_key, old.field_key) not in ('preferred_date', 'preferred_time') then
    if tg_op = 'DELETE' then
      return old;
    end if;

    return new;
  end if;

  -- Serialize exact-time provenance with availability review/copy decisions.
  perform 1
  from public.businesses
  where id = target_business_id
  for update;

  if tg_op = 'DELETE' then
    -- A direct child-row delete must not orphan an exact time. During an
    -- ON DELETE CASCADE, however, the deleted parent is already absent from
    -- this transaction's view. Requiring both live parents distinguishes the
    -- direct mutation from submission- and workspace-level cleanup without
    -- weakening the direct invariant.
    if old.field_key = 'preferred_date'
      and exists (
        select 1
        from public.businesses business
        where business.id = old.business_id
      )
      and exists (
        select 1
        from public.intake_submissions submission
        where submission.id = old.submission_id
          and submission.business_id = old.business_id
      )
      and exists (
        select 1
        from public.intake_submission_values value
        where value.submission_id = old.submission_id
          and value.business_id = old.business_id
          and value.field_key = 'preferred_time'
      ) then
      raise exception 'Exact preferred time requires a preferred date.';
    end if;

    return old;
  end if;

  if new.field_key = 'preferred_time'
    and not public.public_can_insert_submission_value(
      new.business_id,
      new.submission_id,
      'preferred_time'
    ) then
    raise exception 'Exact preferred time requires the entitled canonical field.';
  end if;

  select value.field_value #>> '{}'
    into preferred_date_text
  from public.intake_submission_values value
  where value.submission_id = target_submission_id
    and value.business_id = target_business_id
    and value.field_key = 'preferred_date';

  select value.field_value #>> '{}'
    into preferred_time_text
  from public.intake_submission_values value
  where value.submission_id = target_submission_id
    and value.business_id = target_business_id
    and value.field_key = 'preferred_time';

  if new.field_key = 'preferred_date' then
    preferred_date_text := new.field_value #>> '{}';
  elsif new.field_key = 'preferred_time' then
    preferred_time_text := new.field_value #>> '{}';
  end if;

  -- A date may exist without an exact time. Once a time exists, both values
  -- must be canonical, parseable, and map to exactly one Toronto instant.
  if preferred_time_text is null then
    return new;
  end if;

  preferred_date := public.premium_operations_safe_date(preferred_date_text);
  preferred_time := public.premium_operations_safe_time(preferred_time_text);

  if preferred_date is null
    or preferred_time is null
    or not public.premium_operations_local_time_is_unique(
      preferred_date,
      preferred_time
    ) then
    raise exception 'Exact preferred time requires a valid, unambiguous local date and HH:mm time.';
  end if;

  local_request :=
    (preferred_date + preferred_time) at time zone operating_time_zone;

  if local_request <= statement_timestamp() then
    raise exception 'Exact preferred time must still be in the future.';
  end if;

  return new;
end;
$$;

revoke all on function public.enforce_submission_preferred_time_date_pair()
  from public;

drop trigger if exists intake_submission_values_enforce_preferred_time_date_pair
  on public.intake_submission_values;
create trigger intake_submission_values_enforce_preferred_time_date_pair
before insert or update or delete
on public.intake_submission_values
for each row
execute function public.enforce_submission_preferred_time_date_pair();

create or replace function public.public_intake_operating_time_zone(
  target_business_id uuid,
  target_form_id uuid
)
returns text
language sql
stable
security definer
set search_path = public
set row_security = off
as $$
  select public.premium_operations_operating_time_zone()
  where exists (
    select 1
    from public.intake_forms form
    where form.id = target_form_id
      and form.business_id = target_business_id
      and form.is_active = true
      and public.has_active_public_link(target_business_id)
      and public.premium_operations_entitlement_record_is_active(
        target_business_id,
        'availability_coordination'
      )
  );
$$;

revoke all on function public.public_intake_operating_time_zone(uuid, uuid)
  from public;
grant execute on function public.public_intake_operating_time_zone(uuid, uuid)
  to anon, authenticated, service_role;

-- All authenticated Premium Operations mutations fail closed when a workspace
-- is paused, suspended, cancelled, archived, or in deletion. Service-role and
-- migration maintenance remain possible without manufacturing a JWT.
create or replace function public.enforce_premium_operations_workspace_writable()
returns trigger
language plpgsql
security definer
set search_path = public
set row_security = off
as $$
declare
  target_business_id uuid;
begin
  if tg_op = 'DELETE' then
    target_business_id := old.business_id;
  else
    target_business_id := new.business_id;
  end if;

  if auth.uid() is not null
    and not public.premium_operations_workspace_is_writable(target_business_id) then
    raise exception 'This workspace is not writable for Premium Operations.';
  end if;

  if tg_op = 'DELETE' then
    return old;
  end if;

  return new;
end;
$$;

revoke all on function public.enforce_premium_operations_workspace_writable()
  from public;

drop trigger if exists lead_priority_rules_enforce_workspace_writable
  on public.lead_priority_rules;
create trigger lead_priority_rules_enforce_workspace_writable
before insert or update or delete
on public.lead_priority_rules
for each row
execute function public.enforce_premium_operations_workspace_writable();

drop trigger if exists service_time_blocks_enforce_workspace_writable
  on public.service_time_blocks;
create trigger service_time_blocks_enforce_workspace_writable
before insert or update or delete
on public.service_time_blocks
for each row
execute function public.enforce_premium_operations_workspace_writable();

drop trigger if exists bulk_reply_drafts_enforce_workspace_writable
  on public.bulk_reply_drafts;
create trigger bulk_reply_drafts_enforce_workspace_writable
before insert or update or delete
on public.bulk_reply_drafts
for each row
execute function public.enforce_premium_operations_workspace_writable();

drop trigger if exists bulk_reply_draft_recipients_enforce_workspace_writable
  on public.bulk_reply_draft_recipients;
create trigger bulk_reply_draft_recipients_enforce_workspace_writable
before insert or update or delete
on public.bulk_reply_draft_recipients
for each row
execute function public.enforce_premium_operations_workspace_writable();

create or replace function public.serialize_premium_operations_entitlement_change()
returns trigger
language plpgsql
security definer
set search_path = public
set row_security = off
as $$
declare
  target_business_id uuid;
begin
  if tg_op = 'DELETE' then
    target_business_id := old.business_id;
  else
    target_business_id := new.business_id;
  end if;

  perform 1
  from public.businesses
  where id = target_business_id
  for update;

  if tg_op = 'DELETE' then
    return old;
  end if;

  return new;
end;
$$;

revoke all on function public.serialize_premium_operations_entitlement_change()
  from public;

drop trigger if exists business_addon_entitlements_serialize_change
  on public.business_addon_entitlements;
create trigger business_addon_entitlements_serialize_change
before insert or update or delete
on public.business_addon_entitlements
for each row
execute function public.serialize_premium_operations_entitlement_change();

create or replace function public.enforce_service_time_block_no_overlap()
returns trigger
language plpgsql
security definer
set search_path = public
set row_security = off
as $$
declare
  target_business_id uuid := case
    when tg_op = 'DELETE' then old.business_id
    else new.business_id
  end;
begin
  -- Every lifecycle change, including cancellation and deletion, shares the
  -- business-row mutex used by availability draft validation. This prevents a
  -- concurrent writer from preserving a draft against a schedule snapshot
  -- that changed while it was being checked.
  perform 1
  from public.businesses
  where id = target_business_id
  for update;

  if tg_op = 'DELETE' then
    return old;
  end if;

  -- Cancelled history remains durable and can be cancelled after its end time.
  if new.status = 'cancelled' then
    return new;
  end if;

  if new.starts_at <= statement_timestamp() then
    raise exception 'Active internal time blocks must start in the future.';
  end if;

  if exists (
    select 1
    from public.service_time_blocks existing
    where existing.business_id = new.business_id
      and existing.status in ('reserved', 'tentative')
      and existing.id <> new.id
      and existing.starts_at < new.ends_at
      and new.starts_at < existing.ends_at
  ) then
    raise exception 'This internal time overlaps another active time block.';
  end if;

  return new;
end;
$$;

revoke all on function public.enforce_service_time_block_no_overlap()
  from public;

do $$
begin
  if exists (
    select 1
    from public.service_time_blocks left_block
    join public.service_time_blocks right_block
      on right_block.business_id = left_block.business_id
     and right_block.id > left_block.id
     and right_block.status in ('reserved', 'tentative')
     and left_block.starts_at < right_block.ends_at
     and right_block.starts_at < left_block.ends_at
    where left_block.status in ('reserved', 'tentative')
  ) then
    raise exception 'Resolve overlapping active internal time blocks before applying migration 0026.';
  end if;
end
$$;

drop trigger if exists service_time_blocks_enforce_no_overlap
  on public.service_time_blocks;
create trigger service_time_blocks_enforce_no_overlap
before insert or update of business_id, starts_at, ends_at, status
on public.service_time_blocks
for each row
execute function public.enforce_service_time_block_no_overlap();

drop trigger if exists service_time_blocks_serialize_delete
  on public.service_time_blocks;
create trigger service_time_blocks_serialize_delete
before delete
on public.service_time_blocks
for each row
execute function public.enforce_service_time_block_no_overlap();

-- Lead lifecycle/provenance changes share the same business-row lock used by
-- draft review/copy and time-block writes. DELETE is serialized as well so a
-- cascading recipient removal cannot race a currentness decision.
create or replace function public.serialize_availability_lead_provenance_change()
returns trigger
language plpgsql
security definer
set search_path = public
set row_security = off
as $$
declare
  target_business_id uuid := case
    when tg_op = 'DELETE' then old.business_id
    else new.business_id
  end;
begin
  perform 1
  from public.businesses
  where id = target_business_id
  for update;

  if tg_op = 'DELETE' then
    return old;
  end if;

  return new;
end;
$$;

revoke all on function public.serialize_availability_lead_provenance_change()
  from public;

drop trigger if exists leads_serialize_availability_provenance_change
  on public.leads;
create trigger leads_serialize_availability_provenance_change
before update of intake_submission_id, status
on public.leads
for each row
when (
  old.intake_submission_id is distinct from new.intake_submission_id
  or old.status is distinct from new.status
)
execute function public.serialize_availability_lead_provenance_change();

drop trigger if exists leads_serialize_premium_operations_delete
  on public.leads;
create trigger leads_serialize_premium_operations_delete
before delete
on public.leads
for each row
execute function public.serialize_availability_lead_provenance_change();

-- Derive, rather than merely validate, the first saved internal opening. The
-- caller holds the workspace row lock, so time-block changes cannot move the
-- answer between validation and persistence/review/copy.
create or replace function public.premium_operations_first_internal_opening(
  target_business_id uuid,
  target_requested_starts_at timestamptz,
  target_requested_ends_at timestamptz
)
returns table (
  suggested_starts_at timestamptz,
  suggested_ends_at timestamptz
)
language plpgsql
stable
security definer
set search_path = public
set row_security = off
as $$
declare
  candidate_starts_at timestamptz;
  candidate_ends_at timestamptz;
  conflicting_ends_at timestamptz;
  operating_day_start time without time zone;
  operating_day_end time without time zone;
  operating_day_date date;
  operating_day_starts_at timestamptz;
  operating_day_ends_at timestamptz;
  requested_duration interval;
  attempts integer := 0;
  operating_time_zone text :=
    public.premium_operations_operating_time_zone();
begin
  if target_requested_starts_at is null
    or target_requested_ends_at is null
    or target_requested_ends_at <= target_requested_starts_at then
    return;
  end if;

  select business.operating_day_start, business.operating_day_end
    into operating_day_start, operating_day_end
  from public.businesses business
  where business.id = target_business_id;

  if not found then
    return;
  end if;

  operating_day_date :=
    (target_requested_starts_at at time zone operating_time_zone)::date;
  operating_day_starts_at :=
    (operating_day_date + operating_day_start) at time zone operating_time_zone;
  operating_day_ends_at :=
    (operating_day_date + operating_day_end) at time zone operating_time_zone;
  requested_duration :=
    target_requested_ends_at - target_requested_starts_at;
  candidate_starts_at := greatest(
    target_requested_starts_at,
    operating_day_starts_at
  );

  loop
    attempts := attempts + 1;
    if attempts > 10000 then
      -- A pathological legacy schedule fails closed instead of risking an
      -- unbounded database function.
      return;
    end if;

    candidate_ends_at := candidate_starts_at + requested_duration;
    if candidate_ends_at > operating_day_ends_at
      or (candidate_starts_at at time zone operating_time_zone)::date
        <> operating_day_date
      or (candidate_ends_at at time zone operating_time_zone)::date
        <> operating_day_date then
      return;
    end if;

    select block.ends_at
      into conflicting_ends_at
    from public.service_time_blocks block
    where block.business_id = target_business_id
      and block.status in ('reserved', 'tentative')
      and block.starts_at < candidate_ends_at
      and candidate_starts_at < block.ends_at
    order by block.starts_at asc, block.ends_at asc, block.id asc
    limit 1;

    if not found then
      suggested_starts_at := candidate_starts_at;
      suggested_ends_at := candidate_ends_at;
      return next;
      return;
    end if;

    candidate_starts_at := greatest(candidate_starts_at, conflicting_ends_at);
  end loop;
end;
$$;

revoke all on function public.premium_operations_first_internal_opening(
  uuid,
  timestamptz,
  timestamptz
) from public;

create or replace function public.premium_operations_availability_draft_is_current(
  target_business_id uuid,
  target_audience_summary jsonb
)
returns boolean
language plpgsql
stable
security definer
set search_path = public
set row_security = off
as $$
declare
  target_lead_id uuid;
  target_submission_id uuid;
  canonical_submission_id uuid;
  target_requested_starts_at timestamptz;
  target_requested_ends_at timestamptz;
  canonical_requested_starts_at timestamptz;
  canonical_requested_ends_at timestamptz;
  expected_suggested_starts_at timestamptz;
  expected_suggested_ends_at timestamptz;
  target_suggested_starts_at timestamptz;
  target_suggested_ends_at timestamptz;
  suggested_starts_text text;
  suggested_ends_text text;
  supplied_conflict_ids uuid[];
  actual_conflict_ids uuid[];
begin
  if coalesce(jsonb_typeof(target_audience_summary), '') <> 'object'
    or coalesce(target_audience_summary ->> 'source', '')
      <> 'availability_conflict'
    or coalesce(target_audience_summary ->> 'timeZone', '')
      <> public.premium_operations_operating_time_zone()
    or coalesce(target_audience_summary ->> 'leadCount', '') <> '1'
    or coalesce(target_audience_summary ->> 'manualOnly', '') <> 'true' then
    return false;
  end if;

  if coalesce(
    jsonb_typeof(target_audience_summary -> 'conflictBlockIds'),
    ''
  ) <> 'array' then
    return false;
  end if;

  if jsonb_array_length(target_audience_summary -> 'conflictBlockIds') < 1
    or jsonb_array_length(target_audience_summary -> 'conflictBlockIds') > 50 then
    return false;
  end if;

  if auth.uid() is not null
    and not public.is_business_member(target_business_id) then
    return false;
  end if;

  if not exists (
    select 1
    from public.businesses business
    where business.id = target_business_id
      and business.status in ('onboarding', 'active')
      and business.plan_slug <> 'paused'
      and business.lifecycle_status = 'active'
      and business.deletion_requested_at is null
      and business.deleted_at is null
  )
    or not public.premium_operations_entitlement_record_is_active(
      target_business_id,
      'availability_coordination'
    ) then
    return false;
  end if;

  begin
    target_lead_id :=
      nullif(target_audience_summary ->> 'leadId', '')::uuid;
    target_submission_id :=
      nullif(target_audience_summary ->> 'submissionId', '')::uuid;
    target_requested_starts_at :=
      nullif(target_audience_summary ->> 'requestedStartsAt', '')::timestamptz;
    target_requested_ends_at :=
      nullif(target_audience_summary ->> 'requestedEndsAt', '')::timestamptz;

    select array_agg(conflict_id order by conflict_id)
      into supplied_conflict_ids
    from (
      select value::uuid as conflict_id
      from jsonb_array_elements_text(
        target_audience_summary -> 'conflictBlockIds'
      ) value
    ) supplied;
  exception
    when invalid_text_representation
      or invalid_datetime_format
      or datetime_field_overflow then
      return false;
  end;

  if target_lead_id is null
    or target_submission_id is null
    or target_requested_starts_at is null
    or target_requested_ends_at is null
    or target_requested_ends_at <= target_requested_starts_at
    or target_requested_starts_at <= statement_timestamp()
    or cardinality(supplied_conflict_ids) < 1
    or cardinality(supplied_conflict_ids)
      <> jsonb_array_length(target_audience_summary -> 'conflictBlockIds') then
    return false;
  end if;

  select
    request.submission_id,
    request.requested_starts_at,
    request.requested_ends_at
  into
    canonical_submission_id,
    canonical_requested_starts_at,
    canonical_requested_ends_at
  from public.premium_operations_exact_request_window(
    target_business_id,
    target_lead_id
  ) request;

  if canonical_submission_id is null
    or canonical_submission_id <> target_submission_id
    or canonical_requested_starts_at <> target_requested_starts_at
    or canonical_requested_ends_at <> target_requested_ends_at
    or not exists (
      select 1
      from public.leads lead
      where lead.id = target_lead_id
        and lead.business_id = target_business_id
        and lead.intake_submission_id = target_submission_id
        and lead.status not in ('archived', 'booked', 'lost')
    ) then
    return false;
  end if;

  select array_agg(block.id order by block.id)
    into actual_conflict_ids
  from public.service_time_blocks block
  where block.business_id = target_business_id
    and block.status in ('reserved', 'tentative')
    and block.starts_at < target_requested_ends_at
    and target_requested_starts_at < block.ends_at;

  if actual_conflict_ids is null
    or supplied_conflict_ids is distinct from actual_conflict_ids then
    return false;
  end if;

  suggested_starts_text :=
    nullif(target_audience_summary ->> 'suggestedStartsAt', '');
  suggested_ends_text :=
    nullif(target_audience_summary ->> 'suggestedEndsAt', '');

  if (suggested_starts_text is null) <> (suggested_ends_text is null) then
    return false;
  end if;

  if suggested_starts_text is not null then
    begin
      target_suggested_starts_at := suggested_starts_text::timestamptz;
      target_suggested_ends_at := suggested_ends_text::timestamptz;
    exception
      when invalid_text_representation
        or invalid_datetime_format
        or datetime_field_overflow then
        return false;
    end;

  end if;

  select opening.suggested_starts_at, opening.suggested_ends_at
    into expected_suggested_starts_at, expected_suggested_ends_at
  from public.premium_operations_first_internal_opening(
    target_business_id,
    target_requested_starts_at,
    target_requested_ends_at
  ) opening;

  if target_suggested_starts_at is distinct from expected_suggested_starts_at
    or target_suggested_ends_at is distinct from expected_suggested_ends_at then
    return false;
  end if;

  return true;
end;
$$;

revoke all on function public.premium_operations_availability_draft_is_current(uuid, jsonb)
  from public;
grant execute on function public.premium_operations_availability_draft_is_current(uuid, jsonb)
  to authenticated, service_role;

-- A durable audience count lets review/copy detect both terminal leads and a
-- recipient that disappeared through a cascading lead deletion. This helper
-- is intentionally trigger-only: callers cannot use it to probe another
-- workspace's lead state through the Data API.
create or replace function public.premium_operations_draft_recipients_are_current(
  target_business_id uuid,
  target_draft_id uuid
)
returns boolean
language plpgsql
stable
security definer
set search_path = public
set row_security = off
as $$
declare
  audience_summary jsonb;
  expected_recipient_count numeric;
  actual_recipient_count bigint;
  current_recipient_count bigint;
begin
  if auth.uid() is not null
    and not public.is_business_member(target_business_id) then
    return false;
  end if;

  select draft.audience_summary
    into audience_summary
  from public.bulk_reply_drafts draft
  where draft.id = target_draft_id
    and draft.business_id = target_business_id;

  if not found
    or coalesce(jsonb_typeof(audience_summary), '') <> 'object'
    or coalesce(jsonb_typeof(audience_summary -> 'leadCount'), '') <> 'number'
    or coalesce(jsonb_typeof(audience_summary -> 'manualOnly'), '') <> 'boolean'
    or coalesce(audience_summary ->> 'manualOnly', '') <> 'true' then
    return false;
  end if;

  begin
    expected_recipient_count :=
      (audience_summary ->> 'leadCount')::numeric;
  exception
    when invalid_text_representation or numeric_value_out_of_range then
      return false;
  end;

  if expected_recipient_count <> trunc(expected_recipient_count)
    or expected_recipient_count < 1
    or expected_recipient_count > 50 then
    return false;
  end if;

  select
    count(*),
    count(*) filter (
      where lead.id is not null
        and lead.status not in ('archived', 'booked', 'lost')
    )
  into actual_recipient_count, current_recipient_count
  from public.bulk_reply_draft_recipients recipient
  left join public.leads lead
    on lead.id = recipient.lead_id
   and lead.business_id = recipient.business_id
  where recipient.draft_id = target_draft_id
    and recipient.business_id = target_business_id;

  return actual_recipient_count = expected_recipient_count
    and current_recipient_count = actual_recipient_count;
end;
$$;

revoke all on function public.premium_operations_draft_recipients_are_current(
  uuid,
  uuid
) from public;

-- Replace the earlier shape-only insert check with a persisted provenance and
-- currentness check. Availability rows cannot be manufactured from a named
-- window, a custom key collision, a stale lead, or arbitrary block IDs.
create or replace function public.initialize_premium_operations_draft()
returns trigger
language plpgsql
security definer
set search_path = public
set row_security = off
as $$
begin
  if new.status <> 'draft'
    or new.reviewed_at is not null
    or new.reviewed_by_user_id is not null then
    raise exception 'A Premium Operations draft must be created in review-pending state.';
  end if;

  if new.audience_summary ->> 'source' = 'availability_conflict' then
    perform 1
    from public.businesses
    where id = new.business_id
    for update;

    if not public.premium_operations_availability_draft_is_current(
      new.business_id,
      new.audience_summary
    ) then
      raise exception 'Availability review drafts require one current, canonical conflict.';
    end if;
  end if;

  if auth.uid() is not null then
    new.created_by_user_id := auth.uid();
  end if;

  return new;
end;
$$;

revoke all on function public.initialize_premium_operations_draft()
  from public;

create or replace function public.enforce_availability_draft_current_on_review()
returns trigger
language plpgsql
security definer
set search_path = public
set row_security = off
as $$
begin
  if old.status = 'draft' and new.status = 'reviewed' then
    perform 1
    from public.businesses
    where id = old.business_id
    for update;

    if not public.premium_operations_draft_recipients_are_current(
      old.business_id,
      old.id
    ) then
      raise exception 'One or more selected leads are unavailable.';
    end if;

    if old.audience_summary ->> 'source' = 'availability_conflict'
      and not public.premium_operations_availability_draft_is_current(
        old.business_id,
        old.audience_summary
      ) then
        raise exception 'This availability draft is no longer current.';
    end if;
  end if;

  return new;
end;
$$;

revoke all on function public.enforce_availability_draft_current_on_review()
  from public;

drop trigger if exists bulk_reply_drafts_enforce_availability_current
  on public.bulk_reply_drafts;
create trigger bulk_reply_drafts_enforce_availability_current
before update on public.bulk_reply_drafts
for each row
execute function public.enforce_availability_draft_current_on_review();

create or replace function public.enforce_availability_recipient_current()
returns trigger
language plpgsql
security definer
set search_path = public
set row_security = off
as $$
declare
  parent_audience_summary jsonb;
  target_business_id uuid;
  target_draft_id uuid;
  copy_transition boolean := false;
begin
  if tg_op = 'DELETE' then
    target_business_id := old.business_id;
    target_draft_id := old.draft_id;
  elsif tg_op = 'UPDATE' then
    target_business_id := old.business_id;
    target_draft_id := old.draft_id;
    copy_transition := old.copied_at is null and new.copied_at is not null;
  else
    target_business_id := new.business_id;
    target_draft_id := new.draft_id;
  end if;

  -- Direct recipient removal and parent-draft cascades both serialize through
  -- OLD.business_id. DELETE does not run currentness checks, so deleting a
  -- pending parent can cascade cleanly; any surviving parent is made stale by
  -- the durable leadCount mismatch at its next review/copy attempt.
  if tg_op = 'DELETE' then
    perform 1
    from public.businesses
    where id = target_business_id
    for update;

    return old;
  end if;

  select draft.audience_summary
    into parent_audience_summary
  from public.bulk_reply_drafts draft
  where draft.id = target_draft_id
    and draft.business_id = target_business_id;

  if copy_transition
    or (
      tg_op = 'INSERT'
      and parent_audience_summary ->> 'source' = 'availability_conflict'
    ) then
    perform 1
    from public.businesses
    where id = target_business_id
    for update;
  end if;

  if copy_transition
    and not public.premium_operations_draft_recipients_are_current(
      target_business_id,
      target_draft_id
    ) then
    raise exception 'One or more selected leads are unavailable.';
  end if;

  if parent_audience_summary ->> 'source' = 'availability_conflict'
    and (tg_op = 'INSERT' or copy_transition) then
    if not public.premium_operations_availability_draft_is_current(
      target_business_id,
      parent_audience_summary
    ) then
      raise exception 'This availability draft is no longer current.';
    end if;
  end if;

  return new;
end;
$$;

revoke all on function public.enforce_availability_recipient_current()
  from public;

drop trigger if exists bulk_reply_draft_recipients_enforce_availability_current
  on public.bulk_reply_draft_recipients;
create trigger bulk_reply_draft_recipients_enforce_availability_current
before insert or update or delete
on public.bulk_reply_draft_recipients
for each row
execute function public.enforce_availability_recipient_current();

create or replace function public.create_availability_review_draft(
  target_business_id uuid,
  target_lead_id uuid,
  target_title text,
  target_message_template text,
  target_requested_starts_at timestamptz,
  target_requested_ends_at timestamptz,
  target_suggested_starts_at timestamptz,
  target_suggested_ends_at timestamptz,
  target_conflict_block_ids jsonb
)
returns uuid
language plpgsql
security invoker
set search_path = public
as $$
declare
  created_draft_id uuid;
  canonical_submission_id uuid;
  canonical_requested_starts_at timestamptz;
  canonical_requested_ends_at timestamptz;
  audience_summary jsonb;
begin
  if not public.premium_operations_workspace_is_writable(target_business_id) then
    raise exception 'Availability Coordination is not writable for this workspace.';
  end if;

  if auth.uid() is not null then
    if not public.can_manage_business(target_business_id)
      or not public.premium_operations_addon_is_active(
        target_business_id,
        'availability_coordination'
      ) then
      raise exception 'Availability Coordination is not writable for this workspace.';
    end if;
  elsif coalesce(auth.role(), '') = 'service_role' then
    if not public.premium_operations_entitlement_record_is_active(
      target_business_id,
      'availability_coordination'
    ) then
      raise exception 'Availability Coordination is not writable for this workspace.';
    end if;
  else
    raise exception 'Availability Coordination is not writable for this workspace.';
  end if;

  perform 1
  from public.businesses
  where id = target_business_id
  for update;

  select
    request.submission_id,
    request.requested_starts_at,
    request.requested_ends_at
  into
    canonical_submission_id,
    canonical_requested_starts_at,
    canonical_requested_ends_at
  from public.premium_operations_exact_request_window(
    target_business_id,
    target_lead_id
  ) request;

  if canonical_submission_id is null
    or canonical_requested_starts_at <> target_requested_starts_at
    or canonical_requested_ends_at <> target_requested_ends_at then
    raise exception 'Availability review requires the lead current canonical exact-time request.';
  end if;

  audience_summary := jsonb_build_object(
    'conflictBlockIds', target_conflict_block_ids,
    'leadCount', 1,
    'leadId', target_lead_id::text,
    'manualOnly', true,
    'requestedEndsAt', target_requested_ends_at,
    'requestedStartsAt', target_requested_starts_at,
    'source', 'availability_conflict',
    'submissionId', canonical_submission_id::text,
    'suggestedEndsAt', target_suggested_ends_at,
    'suggestedStartsAt', target_suggested_starts_at,
    'timeZone', public.premium_operations_operating_time_zone()
  );

  if not public.premium_operations_availability_draft_is_current(
    target_business_id,
    audience_summary
  ) then
    raise exception 'Availability review requires one current conflict and a valid open suggestion.';
  end if;

  if exists (
    select 1
    from public.bulk_reply_drafts draft
    where draft.business_id = target_business_id
      and draft.audience_summary ->> 'source' = 'availability_conflict'
      and draft.audience_summary ->> 'leadId' = target_lead_id::text
      and public.premium_operations_availability_draft_is_current(
        target_business_id,
        draft.audience_summary
      )
  ) then
    raise exception 'An availability review draft already exists for this request.';
  end if;

  -- Stale availability drafts are durable review history. In particular, do
  -- not delete or lock an existing draft after taking the business-row mutex:
  -- review takes the draft tuple lock before the same mutex, so reversing that
  -- order here would permit a create-versus-review deadlock. Current drafts
  -- remain unique through the serialized check above; stale drafts continue to
  -- fail closed at review/copy. Any deliberate retention cleanup must remain a
  -- separate operation with draft-before-business lock ordering.

  insert into public.bulk_reply_drafts (
    business_id,
    title,
    audience_summary,
    message_template
  )
  values (
    target_business_id,
    target_title,
    audience_summary,
    target_message_template
  )
  returning id into created_draft_id;

  insert into public.bulk_reply_draft_recipients (
    business_id,
    draft_id,
    lead_id,
    rendered_message
  )
  values (
    target_business_id,
    created_draft_id,
    target_lead_id,
    target_message_template
  );

  return created_draft_id;
end;
$$;

revoke all on function public.create_availability_review_draft(
  uuid,
  uuid,
  text,
  text,
  timestamptz,
  timestamptz,
  timestamptz,
  timestamptz,
  jsonb
) from public;
grant execute on function public.create_availability_review_draft(
  uuid,
  uuid,
  text,
  text,
  timestamptz,
  timestamptz,
  timestamptz,
  timestamptz,
  jsonb
) to authenticated, service_role;

create or replace function public.create_premium_reply_draft(
  target_business_id uuid,
  target_title text,
  target_message_template text,
  target_audience_summary jsonb,
  target_recipients jsonb
)
returns uuid
language plpgsql
security invoker
set search_path = public
as $$
declare
  created_draft_id uuid;
  recipient jsonb;
  recipient_count integer;
  distinct_recipient_count integer;
  audience_lead_count numeric;
begin
  if coalesce(jsonb_typeof(target_audience_summary), '') <> 'object'
    or coalesce(target_audience_summary ->> 'source', '') = 'availability_conflict' then
    raise exception 'Availability conflicts require the dedicated atomic review function.';
  end if;

  if coalesce(
    jsonb_typeof(target_audience_summary -> 'leadCount'),
    ''
  ) <> 'number'
    or coalesce(
      jsonb_typeof(target_audience_summary -> 'manualOnly'),
      ''
    ) <> 'boolean'
    or coalesce(target_audience_summary ->> 'manualOnly', '') <> 'true' then
    raise exception 'One or more selected leads are unavailable.';
  end if;

  if coalesce(jsonb_typeof(target_recipients), '') <> 'array'
    or jsonb_array_length(target_recipients) < 1
    or jsonb_array_length(target_recipients) > 50 then
    raise exception 'A review batch must contain between 1 and 50 leads.';
  end if;

  begin
    select count(*), count(distinct (value ->> 'leadId')::uuid)
      into recipient_count, distinct_recipient_count
    from jsonb_array_elements(target_recipients) value;
  exception
    when invalid_text_representation then
      raise exception 'Every draft recipient requires a valid lead id.';
  end;

  if recipient_count <> distinct_recipient_count then
    raise exception 'A review batch cannot contain duplicate leads.';
  end if;

  begin
    audience_lead_count :=
      (target_audience_summary ->> 'leadCount')::numeric;
  exception
    when invalid_text_representation or numeric_value_out_of_range then
      raise exception 'One or more selected leads are unavailable.';
  end;

  if audience_lead_count <> trunc(audience_lead_count)
    or audience_lead_count <> recipient_count then
    raise exception 'One or more selected leads are unavailable.';
  end if;

  if not public.premium_operations_workspace_is_writable(target_business_id) then
    raise exception 'Bulk Reply Review is not writable for this workspace.';
  end if;

  if auth.uid() is not null then
    if not public.can_manage_business(target_business_id)
      or not public.premium_operations_addon_is_active(
        target_business_id,
        'bulk_reply_review'
      ) then
      raise exception 'Bulk Reply Review is not writable for this workspace.';
    end if;
  elsif coalesce(auth.role(), '') = 'service_role' then
    if not public.premium_operations_entitlement_record_is_active(
      target_business_id,
      'bulk_reply_review'
    ) then
      raise exception 'Bulk Reply Review is not writable for this workspace.';
    end if;
  else
    raise exception 'Bulk Reply Review is not writable for this workspace.';
  end if;

  perform 1
  from public.businesses
  where id = target_business_id
  for update;

  insert into public.bulk_reply_drafts (
    business_id,
    title,
    message_template,
    audience_summary
  )
  values (
    target_business_id,
    target_title,
    target_message_template,
    target_audience_summary
  )
  returning id into created_draft_id;

  for recipient in
    select value
    from jsonb_array_elements(target_recipients) value
  loop
    if coalesce(recipient ->> 'leadId', '') = ''
      or coalesce(btrim(recipient ->> 'renderedMessage'), '') = '' then
      raise exception 'Every draft recipient requires a lead and rendered message.';
    end if;

    insert into public.bulk_reply_draft_recipients (
      business_id,
      draft_id,
      lead_id,
      rendered_message
    )
    values (
      target_business_id,
      created_draft_id,
      (recipient ->> 'leadId')::uuid,
      recipient ->> 'renderedMessage'
    );
  end loop;

  return created_draft_id;
end;
$$;

revoke all on function public.create_premium_reply_draft(uuid, text, text, jsonb, jsonb)
  from public;
grant execute on function public.create_premium_reply_draft(uuid, text, text, jsonb, jsonb)
  to authenticated, service_role;

-- Founder mutations use one service-role-only transaction so entitlement state
-- and its admin audit record cannot diverge.
create or replace function public.founder_upsert_premium_addon_entitlement(
  target_business_id uuid,
  target_addon_key text,
  target_status text,
  target_actor_user_id uuid,
  target_activated_at timestamptz,
  target_expires_at timestamptz default null,
  target_note text default null
)
returns table (
  business_id uuid,
  addon_key text,
  status text,
  activated_at timestamptz,
  expires_at timestamptz,
  managed_by_user_id uuid,
  updated_at timestamptz
)
language plpgsql
security definer
set search_path = public
set row_security = off
as $$
declare
  previous_values jsonb := '{}'::jsonb;
  updated_entitlement public.business_addon_entitlements%rowtype;
begin
  if target_addon_key not in (
    'availability_coordination',
    'bulk_reply_review',
    'priority_workbench'
  ) then
    raise exception 'Unknown Premium Operations add-on.';
  end if;

  if target_status not in ('enabled', 'disabled') then
    raise exception 'Founder entitlement status must be enabled or disabled.';
  end if;

  if target_actor_user_id is null
    or not exists (
      select 1
      from auth.users actor
      where actor.id = target_actor_user_id
    ) then
    raise exception 'A valid founder actor is required.';
  end if;

  if (target_status = 'enabled' and target_activated_at is null)
    or (target_status = 'disabled' and target_activated_at is not null)
    or (target_status = 'disabled' and target_expires_at is not null)
    or (
      target_expires_at is not null
      and target_expires_at <= target_activated_at
    ) then
    raise exception 'Entitlement activation and expiry values are inconsistent.';
  end if;

  perform 1
  from public.businesses business
  where business.id = target_business_id
  for update;

  if not found then
    raise exception 'Business not found.';
  end if;

  select jsonb_build_object(
    'addonKey', entitlement.addon_key,
    'status', entitlement.status,
    'activatedAt', entitlement.activated_at,
    'expiresAt', entitlement.expires_at,
    'managedByUserId', entitlement.managed_by_user_id
  )
  into previous_values
  from public.business_addon_entitlements entitlement
  where entitlement.business_id = target_business_id
    and entitlement.addon_key = target_addon_key;

  previous_values := coalesce(previous_values, '{}'::jsonb);

  insert into public.business_addon_entitlements (
    business_id,
    addon_key,
    status,
    activated_at,
    expires_at,
    managed_by_user_id
  )
  values (
    target_business_id,
    target_addon_key,
    target_status,
    target_activated_at,
    target_expires_at,
    target_actor_user_id
  )
  on conflict (business_id, addon_key) do update
  set
    status = excluded.status,
    activated_at = excluded.activated_at,
    expires_at = excluded.expires_at,
    managed_by_user_id = excluded.managed_by_user_id
  returning * into updated_entitlement;

  insert into public.admin_action_log (
    business_id,
    actor_user_id,
    action_type,
    previous_values,
    new_values,
    note
  )
  values (
    target_business_id,
    target_actor_user_id,
    'status_changed',
    previous_values,
    jsonb_build_object(
      'operation', 'premium_addon_entitlement_updated',
      'addonKey', updated_entitlement.addon_key,
      'status', updated_entitlement.status,
      'activatedAt', updated_entitlement.activated_at,
      'expiresAt', updated_entitlement.expires_at,
      'managedByUserId', updated_entitlement.managed_by_user_id
    ),
    nullif(btrim(target_note), '')
  );

  return query
  select
    updated_entitlement.business_id,
    updated_entitlement.addon_key,
    updated_entitlement.status,
    updated_entitlement.activated_at,
    updated_entitlement.expires_at,
    updated_entitlement.managed_by_user_id,
    updated_entitlement.updated_at;
end;
$$;

revoke all on function public.founder_upsert_premium_addon_entitlement(
  uuid,
  text,
  text,
  uuid,
  timestamptz,
  timestamptz,
  text
) from public, anon, authenticated;
grant execute on function public.founder_upsert_premium_addon_entitlement(
  uuid,
  text,
  text,
  uuid,
  timestamptz,
  timestamptz,
  text
) to service_role;
