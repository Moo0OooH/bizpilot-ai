/*
============================================================
File: supabase/migrations/0004_remove_noncanonical_template_field_table.sql
Project: BizPilot AI
Description: Removes a non-canonical Phase 3 template field override table.
Role: Keeps editable Cleaning template settings scoped to business_template_settings.
Related:
- docs/product/BIZPILOT_BUILD_PLAN_v1.4.md
- docs/product/BIZPILOT_MASTER_BLUEPRINT_v1.4.md
Author: MoOoH
Created: 2026-05-05
Last Updated: 2026-05-05
Change Log:
- 2026-05-05: Dropped business_template_fields after aligning template edits with canonical Phase 3 tables.
============================================================
*/

drop table if exists public.business_template_fields;
