/*
============================================================
File: supabase/migrations/0004_remove_noncanonical_template_field_table.sql
Project: BizPilot AI
Description: Migrates and removes a non-canonical Phase 3 template field override table.
Role: Preserves editable Cleaning template settings inside business_template_settings.
Related:
- docs/product/BIZPILOT_BUILD_PLAN_v1.4.md
- docs/product/BIZPILOT_MASTER_BLUEPRINT_v1.4.md
Author: MoOoH
Created: 2026-05-05
Last Updated: 2026-05-05
Change Log:
- 2026-05-05: Migrated business_template_fields data into field_overrides before dropping the table.
============================================================
*/

do $$
begin
  if to_regclass('public.business_template_fields') is not null then
    execute $sql$
      with field_payloads as (
        select
          business_id,
          template_field_id,
          field_key,
          jsonb_strip_nulls(
            jsonb_build_object(
              'label', label_override,
              'helpText', help_text_override,
              'isRequired', is_required_override,
              'isHidden', is_hidden,
              'sortOrder', sort_order_override,
              'options', options_override
            )
          ) as field_payload
        from public.business_template_fields
      ),
      template_payloads as (
        select
          field_payloads.business_id,
          industry_template_fields.template_id,
          jsonb_object_agg(field_payloads.field_key, field_payloads.field_payload) as fields
        from field_payloads
        join public.industry_template_fields
          on industry_template_fields.id = field_payloads.template_field_id
        group by field_payloads.business_id, industry_template_fields.template_id
      )
      insert into public.business_template_settings (
        business_id,
        template_id,
        field_overrides,
        is_active
      )
      select
        business_id,
        template_id,
        jsonb_build_object('fields', fields),
        true
      from template_payloads
      on conflict (business_id, template_id)
      do update set
        field_overrides = jsonb_set(
          coalesce(public.business_template_settings.field_overrides, '{}'::jsonb),
          '{fields}',
          coalesce(public.business_template_settings.field_overrides -> 'fields', '{}'::jsonb)
            || coalesce(excluded.field_overrides -> 'fields', '{}'::jsonb),
          true
        ),
        updated_at = now();
    $sql$;
  end if;
end;
$$;

drop table if exists public.business_template_fields;
