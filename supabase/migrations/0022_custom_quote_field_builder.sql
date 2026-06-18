/*
============================================================
File: supabase/migrations/0022_custom_quote_field_builder.sql
Project: BizPilot AI
Description: Allows owner-defined quote fields to use radio-button choices.
Role: Keeps the configurable quote field builder aligned with public intake field storage.
Related:
- app/(dashboard)/dashboard/configuration/page.tsx
- server/actions/business-configuration.actions.ts
- server/repositories/business-configuration.repository.ts
Author: MoOoH
Created: 2026-06-18
Last Updated: 2026-06-18
Change Log:
- 2026-06-18: Added radio as a safe choice field type for per-business quote form configuration.
============================================================
*/

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
      'time_window'
    )
  );
