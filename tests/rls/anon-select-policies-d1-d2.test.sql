/*
============================================================
File: tests/rls/anon-select-policies-d1-d2.test.sql
Project: BizPilot AI
Description: Phase 10E RLS tests for anon SELECT on D1/D2 tables.
Role: Verifies the 0011 policies expose only active reference data and
      public-link-scoped FAQs/service areas to anon.
Related:
- supabase/migrations/0010_explicit_data_api_grants.sql
- supabase/migrations/0011_anon_select_policies_for_reference_and_faqs.sql
- docs/security/BIZPILOT_SUPABASE_EXPLICIT_GRANTS_AUDIT_v1.0.md
Author: MoOoH
Created: 2026-05-15
Last Updated: 2026-05-15
Change Log:
- 2026-05-15: Created Phase 10E anon SELECT verification tests.
============================================================
*/

begin;

-- ============================================================
-- Fixtures
-- ============================================================
-- Two businesses: one with an active public link, one without.
-- For each, an active FAQ + an inactive FAQ, and an active service area +
-- an inactive service area.
-- Plus a custom inactive vertical and a custom inactive industry template
-- so we can verify the is_active filter on reference rows.

insert into auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
)
values
  (
    '00000000-0000-0000-0000-000000000000',
    '30000000-0000-0000-0000-000000000001',
    'authenticated',
    'authenticated',
    'public-owner@example.com',
    'test-password',
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"display_name":"Public Owner"}',
    now(),
    now()
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '30000000-0000-0000-0000-000000000002',
    'authenticated',
    'authenticated',
    'private-owner@example.com',
    'test-password',
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"display_name":"Private Owner"}',
    now(),
    now()
  );

insert into public.businesses (id, name, slug, owner_user_id)
values
  (
    '40000000-0000-0000-0000-000000000001',
    'Public Cleaning Co',
    'public-cleaning-co',
    '30000000-0000-0000-0000-000000000001'
  ),
  (
    '40000000-0000-0000-0000-000000000002',
    'Private Cleaning Co',
    'private-cleaning-co',
    '30000000-0000-0000-0000-000000000002'
  );

insert into public.business_members (business_id, user_id, role)
values
  (
    '40000000-0000-0000-0000-000000000001',
    '30000000-0000-0000-0000-000000000001',
    'owner'
  ),
  (
    '40000000-0000-0000-0000-000000000002',
    '30000000-0000-0000-0000-000000000002',
    'owner'
  );

-- Only the first business has an active public link.
insert into public.public_link_variants (business_id, slug, display_name, is_active)
values (
  '40000000-0000-0000-0000-000000000001',
  'public-cleaning-co-quote',
  'Public Cleaning Quote',
  true
);

-- FAQs: one active, one inactive per business.
insert into public.business_faqs (business_id, question, answer, is_active, sort_order)
values
  (
    '40000000-0000-0000-0000-000000000001',
    'Active FAQ — public business',
    'This active FAQ belongs to the business that has an active public link.',
    true,
    10
  ),
  (
    '40000000-0000-0000-0000-000000000001',
    'Inactive FAQ — public business',
    'This FAQ is inactive and must not be visible to anon.',
    false,
    20
  ),
  (
    '40000000-0000-0000-0000-000000000002',
    'Active FAQ — private business',
    'This FAQ is active but the business has no public link, so anon must not see it.',
    true,
    10
  );

-- Service areas: one active and one inactive per business.
insert into public.business_service_areas (business_id, name, is_active, sort_order)
values
  (
    '40000000-0000-0000-0000-000000000001',
    'Active Area — public business',
    true,
    10
  ),
  (
    '40000000-0000-0000-0000-000000000001',
    'Inactive Area — public business',
    false,
    20
  ),
  (
    '40000000-0000-0000-0000-000000000002',
    'Active Area — private business',
    true,
    10
  );

-- Reference: insert an inactive vertical and an inactive industry template
-- so we can verify that is_active filtering hides them from anon.
insert into public.verticals (slug, name, description, is_active)
values (
  'phase-10e-test-inactive-vertical',
  'Phase 10E Inactive Vertical',
  'Fixture vertical used to verify anon cannot see inactive reference rows.',
  false
);

insert into public.industry_templates (vertical_id, slug, name, description, is_active)
select
  v.id,
  'phase-10e-test-inactive-template',
  'Phase 10E Inactive Template',
  'Fixture template used to verify anon cannot see inactive reference rows.',
  false
from public.verticals v
where v.slug = 'phase-10e-test-inactive-vertical';

insert into public.industry_template_fields (
  template_id, field_key, label, field_type, is_required, options, sort_order, is_active
)
select
  t.id,
  'inactive_test_field',
  'Inactive Test Field',
  'text',
  false,
  '[]'::jsonb,
  10,
  false
from public.industry_templates t
where t.slug = 'phase-10e-test-inactive-template';

-- ============================================================
-- Switch to anon role
-- ============================================================
set local role anon;
select set_config('request.jwt.claim.sub', '', true);
select set_config('request.jwt.claim.role', 'anon', true);

-- ============================================================
-- D1 — Reference tables
-- ============================================================

-- anon must see at least the active seeded cleaning vertical from 0002.
do $$
declare
  active_count integer;
  inactive_visible integer;
begin
  select count(*) into active_count
  from public.verticals
  where is_active = true;

  if active_count = 0 then
    raise exception 'D1: anon should see at least one active vertical (cleaning seed).';
  end if;

  select count(*) into inactive_visible
  from public.verticals
  where slug = 'phase-10e-test-inactive-vertical';

  if inactive_visible <> 0 then
    raise exception 'D1: anon must not see the inactive fixture vertical.';
  end if;
end;
$$;

-- Same shape for industry_templates.
do $$
declare
  active_count integer;
  inactive_visible integer;
begin
  select count(*) into active_count
  from public.industry_templates
  where is_active = true;

  if active_count = 0 then
    raise exception 'D1: anon should see at least one active industry template (cleaning seed).';
  end if;

  select count(*) into inactive_visible
  from public.industry_templates
  where slug = 'phase-10e-test-inactive-template';

  if inactive_visible <> 0 then
    raise exception 'D1: anon must not see the inactive fixture industry template.';
  end if;
end;
$$;

-- Same shape for industry_template_fields.
do $$
declare
  active_count integer;
  inactive_visible integer;
begin
  select count(*) into active_count
  from public.industry_template_fields
  where is_active = true;

  if active_count = 0 then
    raise exception 'D1: anon should see at least one active template field (cleaning seed).';
  end if;

  select count(*) into inactive_visible
  from public.industry_template_fields
  where field_key = 'inactive_test_field';

  if inactive_visible <> 0 then
    raise exception 'D1: anon must not see the inactive fixture template field.';
  end if;
end;
$$;

-- ============================================================
-- D2 — business_faqs
-- ============================================================

do $$
declare
  visible_active_for_public integer;
  visible_inactive_for_public integer;
  visible_for_private integer;
begin
  -- Active FAQ for the public business must be visible.
  select count(*) into visible_active_for_public
  from public.business_faqs
  where business_id = '40000000-0000-0000-0000-000000000001'
    and is_active = true;

  if visible_active_for_public <> 1 then
    raise exception 'D2: anon should see exactly one active FAQ for the public business, found %.',
      visible_active_for_public;
  end if;

  -- Inactive FAQ for the public business must be hidden.
  select count(*) into visible_inactive_for_public
  from public.business_faqs
  where business_id = '40000000-0000-0000-0000-000000000001'
    and is_active = false;

  if visible_inactive_for_public <> 0 then
    raise exception 'D2: anon must not see inactive FAQs even for businesses with an active public link.';
  end if;

  -- FAQs of the private business (no active public link) must be hidden entirely.
  select count(*) into visible_for_private
  from public.business_faqs
  where business_id = '40000000-0000-0000-0000-000000000002';

  if visible_for_private <> 0 then
    raise exception 'D2: anon must not see any FAQs for a business without an active public link.';
  end if;
end;
$$;

-- ============================================================
-- D2 — business_service_areas
-- ============================================================

do $$
declare
  visible_active_for_public integer;
  visible_inactive_for_public integer;
  visible_for_private integer;
begin
  select count(*) into visible_active_for_public
  from public.business_service_areas
  where business_id = '40000000-0000-0000-0000-000000000001'
    and is_active = true;

  if visible_active_for_public <> 1 then
    raise exception 'D2: anon should see exactly one active service area for the public business, found %.',
      visible_active_for_public;
  end if;

  select count(*) into visible_inactive_for_public
  from public.business_service_areas
  where business_id = '40000000-0000-0000-0000-000000000001'
    and is_active = false;

  if visible_inactive_for_public <> 0 then
    raise exception 'D2: anon must not see inactive service areas even for businesses with an active public link.';
  end if;

  select count(*) into visible_for_private
  from public.business_service_areas
  where business_id = '40000000-0000-0000-0000-000000000002';

  if visible_for_private <> 0 then
    raise exception 'D2: anon must not see any service areas for a business without an active public link.';
  end if;
end;
$$;

rollback;
