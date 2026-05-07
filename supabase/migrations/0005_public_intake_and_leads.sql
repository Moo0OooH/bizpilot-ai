/*
============================================================
File: supabase/migrations/0005_public_intake_and_leads.sql
Project: BizPilot AI
Description: Creates the Phase 4 public intake, submission, lead, and source tracking tables.
Role: Defines public-safe quote link reads and scoped public inserts under Supabase RLS.
Related:
- docs/product/BIZPILOT_BUILD_PLAN_v1.4.md
- docs/security/BIZPILOT_PRIVACY_SECURITY_COMPLIANCE_BASELINE_v1.0.md
- tests/rls/public-intake-and-leads.test.sql
Author: MoOoH
Created: 2026-05-06
Last Updated: 2026-05-07
Change Log:
- 2026-05-07: Hardened public intake field helper/policy to validate business_id, form_id, active form, visibility, and active public link.
- 2026-05-06: Created Phase 4 public intake and lead capture migration.
============================================================
*/

create table if not exists public.intake_forms (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  template_id uuid not null references public.industry_templates(id) on delete restrict,
  name text not null check (char_length(trim(name)) > 0),
  privacy_mode text not null default 'standard' check (privacy_mode in ('standard', 'minimal')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (business_id, template_id)
);

alter table public.intake_forms
  add column if not exists privacy_mode text not null default 'standard'
  check (privacy_mode in ('standard', 'minimal'));

create table if not exists public.intake_form_fields (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  intake_form_id uuid not null references public.intake_forms(id) on delete cascade,
  template_field_id uuid references public.industry_template_fields(id) on delete set null,
  field_key text not null check (field_key ~ '^[a-z][a-z0-9_]*$'),
  label text not null check (char_length(trim(label)) > 0),
  field_type text not null check (field_type in ('text', 'textarea', 'email', 'phone', 'number', 'select', 'boolean', 'date', 'time_window')),
  is_required boolean not null default false,
  is_hidden boolean not null default false,
  help_text text,
  options jsonb not null default '[]'::jsonb,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (intake_form_id, field_key)
);

create table if not exists public.consent_versions (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  version_label text not null default 'v1',
  consent_notice text not null check (char_length(trim(consent_notice)) > 0),
  ai_disclosure_enabled boolean not null default true,
  privacy_contact_email text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (business_id, version_label)
);

create table if not exists public.public_link_variants (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  display_name text not null check (char_length(trim(display_name)) > 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.intake_submissions (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  intake_form_id uuid not null references public.intake_forms(id) on delete restrict,
  consent_version_id uuid not null references public.consent_versions(id) on delete restrict,
  privacy_mode text not null default 'standard' check (privacy_mode in ('standard', 'minimal')),
  consent_accepted_at timestamptz not null,
  status text not null default 'submitted' check (status in ('submitted', 'reviewed', 'archived')),
  delete_request_status text not null default 'none' check (delete_request_status in ('none', 'requested', 'completed')),
  created_at timestamptz not null default now()
);

create table if not exists public.intake_submission_values (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  submission_id uuid not null references public.intake_submissions(id) on delete cascade,
  field_key text not null check (field_key ~ '^[a-z][a-z0-9_]*$'),
  field_label text not null check (char_length(trim(field_label)) > 0),
  field_value jsonb not null default 'null'::jsonb,
  created_at timestamptz not null default now(),
  unique (submission_id, field_key)
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  intake_submission_id uuid not null unique references public.intake_submissions(id) on delete cascade,
  customer_name text,
  customer_contact text,
  service_type text,
  city_or_service_area text,
  status text not null default 'new' check (status in ('new', 'reviewed', 'replied', 'follow_up_needed', 'booked', 'lost', 'archived')),
  source_channel text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lead_source_metadata (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  lead_id uuid not null unique references public.leads(id) on delete cascade,
  source_channel text,
  source_url text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  referrer text,
  created_at timestamptz not null default now()
);

create index if not exists intake_forms_business_id_idx
  on public.intake_forms(business_id);

create index if not exists intake_form_fields_business_id_idx
  on public.intake_form_fields(business_id);

create index if not exists intake_form_fields_form_id_idx
  on public.intake_form_fields(intake_form_id);

create index if not exists consent_versions_business_id_idx
  on public.consent_versions(business_id);

create index if not exists public_link_variants_business_id_idx
  on public.public_link_variants(business_id);

create index if not exists intake_submissions_business_id_idx
  on public.intake_submissions(business_id);

create index if not exists intake_submission_values_business_id_idx
  on public.intake_submission_values(business_id);

create index if not exists leads_business_id_idx
  on public.leads(business_id);

create index if not exists lead_source_metadata_business_id_idx
  on public.lead_source_metadata(business_id);

drop trigger if exists intake_forms_set_updated_at on public.intake_forms;
create trigger intake_forms_set_updated_at
before update on public.intake_forms
for each row
execute function public.set_updated_at();

drop trigger if exists intake_form_fields_set_updated_at on public.intake_form_fields;
create trigger intake_form_fields_set_updated_at
before update on public.intake_form_fields
for each row
execute function public.set_updated_at();

drop trigger if exists consent_versions_set_updated_at on public.consent_versions;
create trigger consent_versions_set_updated_at
before update on public.consent_versions
for each row
execute function public.set_updated_at();

drop trigger if exists public_link_variants_set_updated_at on public.public_link_variants;
create trigger public_link_variants_set_updated_at
before update on public.public_link_variants
for each row
execute function public.set_updated_at();

drop trigger if exists leads_set_updated_at on public.leads;
create trigger leads_set_updated_at
before update on public.leads
for each row
execute function public.set_updated_at();

alter table public.intake_forms enable row level security;
alter table public.intake_form_fields enable row level security;
alter table public.intake_submissions enable row level security;
alter table public.intake_submission_values enable row level security;
alter table public.leads enable row level security;
alter table public.lead_source_metadata enable row level security;
alter table public.consent_versions enable row level security;
alter table public.public_link_variants enable row level security;

drop policy if exists "intake_forms_select_public_active" on public.intake_forms;
drop policy if exists "intake_form_fields_select_public_active" on public.intake_form_fields;

drop function if exists public.can_public_read_intake_form(uuid);
drop function if exists public.can_public_read_intake_field(uuid, boolean);
drop function if exists public.can_public_read_intake_field(uuid, uuid, boolean);
drop function if exists public.can_public_read_intake_field(uuid, uuid, boolean, uuid);

create or replace function public.can_public_submit_to_form(
  target_business_id uuid,
  target_form_id uuid,
  target_consent_version_id uuid
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
    join public.consent_versions consent
      on consent.business_id = form.business_id
    join public.public_link_variants plv
      on plv.business_id = form.business_id
    where form.id = target_form_id
      and consent.id = target_consent_version_id
      and form.business_id = target_business_id
      and form.is_active = true
      and consent.is_active = true
      and plv.is_active = true
  );
$$;

create or replace function public.public_submission_belongs_to_business(
  target_submission_id uuid,
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
    from public.intake_submissions submission
    where submission.id = target_submission_id
      and submission.business_id = target_business_id
  );
$$;

create or replace function public.public_lead_belongs_to_business(
  target_lead_id uuid,
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
    from public.leads lead
    where lead.id = target_lead_id
      and lead.business_id = target_business_id
  );
$$;

create or replace function public.has_active_public_link(
  target_business_id uuid
)
returns boolean
language plpgsql
stable
security definer
set search_path = public
set row_security = off
as $$
begin
  return exists (
    select 1
    from public.public_link_variants plv
    where plv.business_id = target_business_id
      and plv.is_active = true
  );
end;
$$;

create or replace function public.can_public_read_business_branding(
  target_business_id uuid
)
returns boolean
language plpgsql
stable
security definer
set search_path = public
set row_security = off
as $$
begin
  return public.has_active_public_link(target_business_id);
end;
$$;

create or replace function public.can_public_read_intake_form(
  target_business_id uuid,
  target_form_active boolean
)
returns boolean
language plpgsql
stable
security definer
set search_path = public
set row_security = off
as $$
begin
  return target_form_active
    and public.has_active_public_link(target_business_id);
end;
$$;

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

create or replace function public.can_public_read_consent_version(
  target_business_id uuid,
  target_consent_active boolean
)
returns boolean
language plpgsql
stable
security definer
set search_path = public
set row_security = off
as $$
begin
  return target_consent_active
    and public.has_active_public_link(target_business_id);
end;
$$;

grant usage on schema public to anon, authenticated;
grant select on public.business_branding to anon, authenticated;
grant select on public.public_link_variants to anon, authenticated;
grant select on public.intake_forms to anon, authenticated;
grant select on public.intake_form_fields to anon, authenticated;
grant select on public.consent_versions to anon, authenticated;
grant insert, update, delete on public.intake_forms to authenticated;
grant insert, update, delete on public.intake_form_fields to authenticated;
grant insert, update, delete on public.consent_versions to authenticated;
grant insert, update, delete on public.public_link_variants to authenticated;
grant insert on public.intake_submissions to anon, authenticated;
grant insert on public.intake_submission_values to anon, authenticated;
grant insert on public.leads to anon, authenticated;
grant insert on public.lead_source_metadata to anon, authenticated;
grant select on public.intake_submissions to authenticated;
grant select on public.intake_submission_values to authenticated;
grant select on public.leads to authenticated;
grant select on public.lead_source_metadata to authenticated;
grant execute on function public.has_active_public_link(uuid) to anon, authenticated;
grant execute on function public.can_public_read_business_branding(uuid) to anon, authenticated;
grant execute on function public.can_public_read_intake_form(uuid, boolean) to anon, authenticated;
grant execute on function public.can_public_read_intake_field(uuid, uuid, boolean) to anon, authenticated;
grant execute on function public.can_public_read_consent_version(uuid, boolean) to anon, authenticated;
grant execute on function public.can_public_submit_to_form(uuid, uuid, uuid) to anon, authenticated;
grant execute on function public.public_submission_belongs_to_business(uuid, uuid) to anon, authenticated;
grant execute on function public.public_lead_belongs_to_business(uuid, uuid) to anon, authenticated;

drop policy if exists "public_link_variants_select_public_active" on public.public_link_variants;
create policy "public_link_variants_select_public_active"
on public.public_link_variants
for select
to anon, authenticated
using (is_active = true);

drop policy if exists "business_branding_select_public_link_active" on public.business_branding;
create policy "business_branding_select_public_link_active"
on public.business_branding
for select
to anon
using (public.can_public_read_business_branding(business_id));

drop policy if exists "intake_forms_select_public_active" on public.intake_forms;
create policy "intake_forms_select_public_active"
on public.intake_forms
for select
to anon, authenticated
using (public.can_public_read_intake_form(business_id, is_active));

drop policy if exists "intake_form_fields_select_public_active" on public.intake_form_fields;
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

drop policy if exists "consent_versions_select_public_active" on public.consent_versions;
create policy "consent_versions_select_public_active"
on public.consent_versions
for select
to anon, authenticated
using (public.can_public_read_consent_version(business_id, is_active));

drop policy if exists "intake_submissions_insert_public_scoped" on public.intake_submissions;
create policy "intake_submissions_insert_public_scoped"
on public.intake_submissions
for insert
to anon, authenticated
with check (
  public.can_public_submit_to_form(
    business_id,
    intake_form_id,
    consent_version_id
  )
);

drop policy if exists "intake_submission_values_insert_public_scoped" on public.intake_submission_values;
create policy "intake_submission_values_insert_public_scoped"
on public.intake_submission_values
for insert
to anon, authenticated
with check (
  public.public_submission_belongs_to_business(submission_id, business_id)
);

drop policy if exists "leads_insert_public_scoped" on public.leads;
create policy "leads_insert_public_scoped"
on public.leads
for insert
to anon, authenticated
with check (
  public.public_submission_belongs_to_business(intake_submission_id, business_id)
);

drop policy if exists "lead_source_metadata_insert_public_scoped" on public.lead_source_metadata;
create policy "lead_source_metadata_insert_public_scoped"
on public.lead_source_metadata
for insert
to anon, authenticated
with check (
  public.public_lead_belongs_to_business(lead_id, business_id)
);

drop policy if exists "intake_forms_select_member" on public.intake_forms;
create policy "intake_forms_select_member"
on public.intake_forms
for select
to authenticated
using (public.is_business_member(business_id));

drop policy if exists "intake_forms_manage_manager" on public.intake_forms;
create policy "intake_forms_manage_manager"
on public.intake_forms
for all
to authenticated
using (public.can_manage_business(business_id))
with check (public.can_manage_business(business_id));

drop policy if exists "intake_form_fields_select_member" on public.intake_form_fields;
create policy "intake_form_fields_select_member"
on public.intake_form_fields
for select
to authenticated
using (public.is_business_member(business_id));

drop policy if exists "intake_form_fields_manage_manager" on public.intake_form_fields;
create policy "intake_form_fields_manage_manager"
on public.intake_form_fields
for all
to authenticated
using (public.can_manage_business(business_id))
with check (public.can_manage_business(business_id));

drop policy if exists "consent_versions_select_member" on public.consent_versions;
create policy "consent_versions_select_member"
on public.consent_versions
for select
to authenticated
using (public.is_business_member(business_id));

drop policy if exists "consent_versions_manage_manager" on public.consent_versions;
create policy "consent_versions_manage_manager"
on public.consent_versions
for all
to authenticated
using (public.can_manage_business(business_id))
with check (public.can_manage_business(business_id));

drop policy if exists "public_link_variants_select_member" on public.public_link_variants;
create policy "public_link_variants_select_member"
on public.public_link_variants
for select
to authenticated
using (public.is_business_member(business_id));

drop policy if exists "public_link_variants_manage_manager" on public.public_link_variants;
create policy "public_link_variants_manage_manager"
on public.public_link_variants
for all
to authenticated
using (public.can_manage_business(business_id))
with check (public.can_manage_business(business_id));

drop policy if exists "intake_submissions_select_member" on public.intake_submissions;
create policy "intake_submissions_select_member"
on public.intake_submissions
for select
to authenticated
using (public.is_business_member(business_id));

drop policy if exists "intake_submission_values_select_member" on public.intake_submission_values;
create policy "intake_submission_values_select_member"
on public.intake_submission_values
for select
to authenticated
using (public.is_business_member(business_id));

drop policy if exists "leads_select_member" on public.leads;
create policy "leads_select_member"
on public.leads
for select
to authenticated
using (public.is_business_member(business_id));

drop policy if exists "lead_source_metadata_select_member" on public.lead_source_metadata;
create policy "lead_source_metadata_select_member"
on public.lead_source_metadata
for select
to authenticated
using (public.is_business_member(business_id));
