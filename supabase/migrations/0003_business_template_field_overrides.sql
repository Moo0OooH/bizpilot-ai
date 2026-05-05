/*
============================================================
File: supabase/migrations/0003_business_template_field_overrides.sql
Project: BizPilot AI
Description: Creates business-level overrides for editable Cleaning template fields.
Role: Stores per-tenant template field labels, required flags, hidden flags, help text, sort order, and options.
Related:
- supabase/migrations/0002_business_template_configuration.sql
- tests/rls/business-template-configuration.test.sql
Author: MoOoH
Created: 2026-05-05
Last Updated: 2026-05-05
Change Log:
- 2026-05-05: Created Phase 3 business template field override table and RLS policies.
============================================================
*/

create table if not exists public.business_template_fields (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  template_field_id uuid not null references public.industry_template_fields(id) on delete cascade,
  field_key text not null check (field_key ~ '^[a-z][a-z0-9_]*$'),
  label_override text check (label_override is null or char_length(trim(label_override)) > 0),
  is_required_override boolean,
  is_hidden boolean not null default false,
  help_text_override text,
  sort_order_override integer,
  options_override jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (business_id, template_field_id),
  unique (business_id, field_key)
);

create index if not exists business_template_fields_business_id_idx
  on public.business_template_fields(business_id);

create index if not exists business_template_fields_template_field_id_idx
  on public.business_template_fields(template_field_id);

drop trigger if exists business_template_fields_set_updated_at on public.business_template_fields;
create trigger business_template_fields_set_updated_at
before update on public.business_template_fields
for each row
execute function public.set_updated_at();

alter table public.business_template_fields enable row level security;

drop policy if exists "business_template_fields_select_member" on public.business_template_fields;
create policy "business_template_fields_select_member"
on public.business_template_fields
for select
to authenticated
using (public.is_business_member(business_id));

drop policy if exists "business_template_fields_manage_manager" on public.business_template_fields;
create policy "business_template_fields_manage_manager"
on public.business_template_fields
for all
to authenticated
using (public.can_manage_business(business_id))
with check (public.can_manage_business(business_id));
