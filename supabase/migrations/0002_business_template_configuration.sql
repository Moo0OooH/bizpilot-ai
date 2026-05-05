/*
============================================================
File: supabase/migrations/0002_business_template_configuration.sql
Project: BizPilot AI
Description: Creates the Phase 3 business and Cleaning template configuration tables.
Role: Defines tenant-owned configuration records, seeded Cleaning template metadata, and RLS policies.
Related:
- docs/product/BIZPILOT_BUILD_PLAN_v1.4.md
- tests/rls/business-template-configuration.test.sql
Author: MoOoH
Created: 2026-05-05
Last Updated: 2026-05-05
Change Log:
- 2026-05-05: Created Phase 3 business configuration and editable Cleaning template migration.
============================================================
*/

create table if not exists public.verticals (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name text not null check (char_length(trim(name)) > 0),
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.industry_templates (
  id uuid primary key default gen_random_uuid(),
  vertical_id uuid not null references public.verticals(id) on delete restrict,
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name text not null check (char_length(trim(name)) > 0),
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.industry_template_fields (
  id uuid primary key default gen_random_uuid(),
  template_id uuid not null references public.industry_templates(id) on delete cascade,
  field_key text not null check (field_key ~ '^[a-z][a-z0-9_]*$'),
  label text not null check (char_length(trim(label)) > 0),
  field_type text not null check (field_type in ('text', 'textarea', 'email', 'phone', 'number', 'select', 'boolean', 'date', 'time_window')),
  is_required boolean not null default false,
  help_text text,
  options jsonb not null default '[]'::jsonb,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (template_id, field_key)
);

create table if not exists public.business_branding (
  business_id uuid primary key references public.businesses(id) on delete cascade,
  logo_url text,
  primary_color text not null default '#18181b',
  accent_color text not null default '#0f766e',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.business_services (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  name text not null check (char_length(trim(name)) > 0),
  description text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.business_faqs (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  question text not null check (char_length(trim(question)) > 0),
  answer text not null check (char_length(trim(answer)) > 0),
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.business_service_areas (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  name text not null check (char_length(trim(name)) > 0),
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (business_id, name)
);

create table if not exists public.business_privacy_settings (
  business_id uuid primary key references public.businesses(id) on delete cascade,
  privacy_mode text not null default 'standard' check (privacy_mode in ('standard', 'minimal', 'forward_only')),
  retain_leads_days integer not null default 365 check (retain_leads_days between 1 and 3650),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.business_consent_settings (
  business_id uuid primary key references public.businesses(id) on delete cascade,
  consent_notice text not null default 'By submitting this request, you agree that your information will be shared with this business to respond to your quote request. BizPilot may help prepare internal AI drafts, but the business reviews messages before sending.',
  ai_disclosure_enabled boolean not null default true,
  privacy_contact_email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.business_template_settings (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  template_id uuid not null references public.industry_templates(id) on delete restrict,
  custom_name text,
  field_overrides jsonb not null default '{}'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (business_id, template_id)
);

create table if not exists public.business_onboarding_tasks (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  task_key text not null check (task_key ~ '^[a-z][a-z0-9_]*$'),
  label text not null check (char_length(trim(label)) > 0),
  completed_at timestamptz,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (business_id, task_key)
);

create index if not exists industry_templates_vertical_id_idx
  on public.industry_templates(vertical_id);

create index if not exists industry_template_fields_template_id_idx
  on public.industry_template_fields(template_id);

create index if not exists business_services_business_id_idx
  on public.business_services(business_id);

create index if not exists business_faqs_business_id_idx
  on public.business_faqs(business_id);

create index if not exists business_service_areas_business_id_idx
  on public.business_service_areas(business_id);

create index if not exists business_template_settings_business_id_idx
  on public.business_template_settings(business_id);

create index if not exists business_template_settings_template_id_idx
  on public.business_template_settings(template_id);

create index if not exists business_onboarding_tasks_business_id_idx
  on public.business_onboarding_tasks(business_id);

drop trigger if exists verticals_set_updated_at on public.verticals;
create trigger verticals_set_updated_at
before update on public.verticals
for each row
execute function public.set_updated_at();

drop trigger if exists industry_templates_set_updated_at on public.industry_templates;
create trigger industry_templates_set_updated_at
before update on public.industry_templates
for each row
execute function public.set_updated_at();

drop trigger if exists industry_template_fields_set_updated_at on public.industry_template_fields;
create trigger industry_template_fields_set_updated_at
before update on public.industry_template_fields
for each row
execute function public.set_updated_at();

drop trigger if exists business_branding_set_updated_at on public.business_branding;
create trigger business_branding_set_updated_at
before update on public.business_branding
for each row
execute function public.set_updated_at();

drop trigger if exists business_services_set_updated_at on public.business_services;
create trigger business_services_set_updated_at
before update on public.business_services
for each row
execute function public.set_updated_at();

drop trigger if exists business_faqs_set_updated_at on public.business_faqs;
create trigger business_faqs_set_updated_at
before update on public.business_faqs
for each row
execute function public.set_updated_at();

drop trigger if exists business_service_areas_set_updated_at on public.business_service_areas;
create trigger business_service_areas_set_updated_at
before update on public.business_service_areas
for each row
execute function public.set_updated_at();

drop trigger if exists business_privacy_settings_set_updated_at on public.business_privacy_settings;
create trigger business_privacy_settings_set_updated_at
before update on public.business_privacy_settings
for each row
execute function public.set_updated_at();

drop trigger if exists business_consent_settings_set_updated_at on public.business_consent_settings;
create trigger business_consent_settings_set_updated_at
before update on public.business_consent_settings
for each row
execute function public.set_updated_at();

drop trigger if exists business_template_settings_set_updated_at on public.business_template_settings;
create trigger business_template_settings_set_updated_at
before update on public.business_template_settings
for each row
execute function public.set_updated_at();

drop trigger if exists business_onboarding_tasks_set_updated_at on public.business_onboarding_tasks;
create trigger business_onboarding_tasks_set_updated_at
before update on public.business_onboarding_tasks
for each row
execute function public.set_updated_at();

alter table public.verticals enable row level security;
alter table public.industry_templates enable row level security;
alter table public.industry_template_fields enable row level security;
alter table public.business_branding enable row level security;
alter table public.business_services enable row level security;
alter table public.business_faqs enable row level security;
alter table public.business_service_areas enable row level security;
alter table public.business_privacy_settings enable row level security;
alter table public.business_consent_settings enable row level security;
alter table public.business_template_settings enable row level security;
alter table public.business_onboarding_tasks enable row level security;

drop policy if exists "verticals_select_authenticated" on public.verticals;
create policy "verticals_select_authenticated"
on public.verticals
for select
to authenticated
using (is_active = true);

drop policy if exists "industry_templates_select_authenticated" on public.industry_templates;
create policy "industry_templates_select_authenticated"
on public.industry_templates
for select
to authenticated
using (is_active = true);

drop policy if exists "industry_template_fields_select_authenticated" on public.industry_template_fields;
create policy "industry_template_fields_select_authenticated"
on public.industry_template_fields
for select
to authenticated
using (is_active = true);

drop policy if exists "business_branding_select_member" on public.business_branding;
create policy "business_branding_select_member"
on public.business_branding
for select
to authenticated
using (public.is_business_member(business_id));

drop policy if exists "business_branding_manage_manager" on public.business_branding;
create policy "business_branding_manage_manager"
on public.business_branding
for all
to authenticated
using (public.can_manage_business(business_id))
with check (public.can_manage_business(business_id));

drop policy if exists "business_services_select_member" on public.business_services;
create policy "business_services_select_member"
on public.business_services
for select
to authenticated
using (public.is_business_member(business_id));

drop policy if exists "business_services_manage_manager" on public.business_services;
create policy "business_services_manage_manager"
on public.business_services
for all
to authenticated
using (public.can_manage_business(business_id))
with check (public.can_manage_business(business_id));

drop policy if exists "business_faqs_select_member" on public.business_faqs;
create policy "business_faqs_select_member"
on public.business_faqs
for select
to authenticated
using (public.is_business_member(business_id));

drop policy if exists "business_faqs_manage_manager" on public.business_faqs;
create policy "business_faqs_manage_manager"
on public.business_faqs
for all
to authenticated
using (public.can_manage_business(business_id))
with check (public.can_manage_business(business_id));

drop policy if exists "business_service_areas_select_member" on public.business_service_areas;
create policy "business_service_areas_select_member"
on public.business_service_areas
for select
to authenticated
using (public.is_business_member(business_id));

drop policy if exists "business_service_areas_manage_manager" on public.business_service_areas;
create policy "business_service_areas_manage_manager"
on public.business_service_areas
for all
to authenticated
using (public.can_manage_business(business_id))
with check (public.can_manage_business(business_id));

drop policy if exists "business_privacy_settings_select_member" on public.business_privacy_settings;
create policy "business_privacy_settings_select_member"
on public.business_privacy_settings
for select
to authenticated
using (public.is_business_member(business_id));

drop policy if exists "business_privacy_settings_manage_manager" on public.business_privacy_settings;
create policy "business_privacy_settings_manage_manager"
on public.business_privacy_settings
for all
to authenticated
using (public.can_manage_business(business_id))
with check (public.can_manage_business(business_id));

drop policy if exists "business_consent_settings_select_member" on public.business_consent_settings;
create policy "business_consent_settings_select_member"
on public.business_consent_settings
for select
to authenticated
using (public.is_business_member(business_id));

drop policy if exists "business_consent_settings_manage_manager" on public.business_consent_settings;
create policy "business_consent_settings_manage_manager"
on public.business_consent_settings
for all
to authenticated
using (public.can_manage_business(business_id))
with check (public.can_manage_business(business_id));

drop policy if exists "business_template_settings_select_member" on public.business_template_settings;
create policy "business_template_settings_select_member"
on public.business_template_settings
for select
to authenticated
using (public.is_business_member(business_id));

drop policy if exists "business_template_settings_manage_manager" on public.business_template_settings;
create policy "business_template_settings_manage_manager"
on public.business_template_settings
for all
to authenticated
using (public.can_manage_business(business_id))
with check (public.can_manage_business(business_id));

drop policy if exists "business_onboarding_tasks_select_member" on public.business_onboarding_tasks;
create policy "business_onboarding_tasks_select_member"
on public.business_onboarding_tasks
for select
to authenticated
using (public.is_business_member(business_id));

drop policy if exists "business_onboarding_tasks_manage_manager" on public.business_onboarding_tasks;
create policy "business_onboarding_tasks_manage_manager"
on public.business_onboarding_tasks
for all
to authenticated
using (public.can_manage_business(business_id))
with check (public.can_manage_business(business_id));

insert into public.verticals (slug, name, description)
values (
  'cleaning',
  'Cleaning',
  'First GTM vertical for cleaning businesses with quote recovery workflows.'
)
on conflict (slug) do update
set
  name = excluded.name,
  description = excluded.description,
  is_active = true;

with cleaning_vertical as (
  select id
  from public.verticals
  where slug = 'cleaning'
)
insert into public.industry_templates (vertical_id, slug, name, description)
select
  cleaning_vertical.id,
  'cleaning-smart-quote-v1',
  'Cleaning Smart Quote v1',
  'Editable Phase 3 Cleaning quote template configuration. Public rendering starts in Phase 4.'
from cleaning_vertical
on conflict (slug) do update
set
  name = excluded.name,
  description = excluded.description,
  is_active = true;

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
  field.field_key,
  field.label,
  field.field_type,
  field.is_required,
  field.help_text,
  field.options::jsonb,
  field.sort_order
from cleaning_template
cross join (
  values
    ('cleaning_type', 'Cleaning type', 'select', true, 'The kind of cleaning requested.', '["standard","deep","move_in_move_out","post_construction"]', 10),
    ('property_type', 'Property type', 'select', true, 'The property category for the request.', '["house","apartment","condo","office","other"]', 20),
    ('bedrooms', 'Bedrooms', 'number', false, 'Optional room count for residential jobs.', '[]', 30),
    ('bathrooms', 'Bathrooms', 'number', false, 'Optional bathroom count for residential jobs.', '[]', 40),
    ('square_footage_optional', 'Square footage', 'number', false, 'Optional size estimate when known.', '[]', 50),
    ('pets', 'Pets', 'boolean', false, 'Whether pets are present.', '[]', 60),
    ('preferred_date', 'Preferred date', 'date', false, 'Customer preferred service date.', '[]', 70),
    ('preferred_time_window', 'Preferred time window', 'time_window', false, 'Customer preferred time window.', '["morning","afternoon","evening","flexible"]', 80),
    ('city_or_service_area', 'City or service area', 'text', true, 'Where the cleaning request is located.', '[]', 90),
    ('customer_name', 'Customer name', 'text', true, 'Name of the person requesting the quote.', '[]', 100),
    ('customer_contact', 'Customer contact', 'text', true, 'Email or phone for owner follow-up.', '[]', 110),
    ('notes', 'Notes', 'textarea', false, 'Extra context for the owner.', '[]', 120)
) as field(field_key, label, field_type, is_required, help_text, options, sort_order)
on conflict (template_id, field_key) do update
set
  label = excluded.label,
  field_type = excluded.field_type,
  is_required = excluded.is_required,
  help_text = excluded.help_text,
  options = excluded.options,
  sort_order = excluded.sort_order,
  is_active = true;
