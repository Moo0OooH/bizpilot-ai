/*
============================================================
File: supabase/migrations/0014_cleaning_template_contact_address_fields.sql
Project: BizPilot AI
Description: Adds separate contact and home address questions to the Cleaning quote template.
Role: Extends configurable public quote questions while keeping existing active/inactive field controls.
Related:
- supabase/migrations/0002_business_template_configuration.sql
- app/(dashboard)/dashboard/configuration/page.tsx
- app/(public)/quote/[slug]/page.tsx
Author: MoOoH
Created: 2026-05-18
Last Updated: 2026-05-18
Change Log:
- 2026-05-18: Added customer phone, customer email, and home address template fields for Phase 18A quote setup polish.
============================================================
*/

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
    ('customer_phone', 'Phone number', 'phone', true, 'Best phone number for owner follow-up.', '[]', 112),
    ('customer_email', 'Email address', 'email', false, 'Best email address for owner follow-up.', '[]', 114),
    ('home_address', 'Home address', 'text', false, 'Street address or nearest major intersection for the cleaning request.', '[]', 116)
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
