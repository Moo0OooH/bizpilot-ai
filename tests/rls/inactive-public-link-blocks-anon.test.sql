/*
============================================================
File: tests/rls/inactive-public-link-blocks-anon.test.sql
Project: BizPilot AI
Description: Phase 11 end-to-end test that an inactive public_link_variants row
             closes off every anon-visible surface for the owning business.
Role: Verifies has_active_public_link gate by toggling is_active and re-checking
      anon visibility on intake_forms, intake_form_fields, consent_versions,
      business_branding, business_faqs, business_service_areas.
Related:
- supabase/migrations/0005_public_intake_and_leads.sql
- supabase/migrations/0011_anon_select_policies_for_reference_and_faqs.sql
- docs/security/BIZPILOT_SUPABASE_EXPLICIT_GRANTS_AUDIT_v1.0.md (Section 12)
Author: MoOoH
Created: 2026-05-15
Last Updated: 2026-05-15
Change Log:
- 2026-05-15: Created Phase 11 inactive-link end-to-end blocking test.
============================================================
*/

begin;

-- ============================================================
-- Fixtures
-- ============================================================
-- One business with a full public stack and a public link variant that we
-- will toggle between active and inactive to test both sides of the gate.

insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at
)
values (
  '00000000-0000-0000-0000-000000000000',
  'b2000000-0000-0000-0000-000000000001',
  'authenticated', 'authenticated',
  'link-toggle-owner@example.com', 'test-password', now(),
  '{"provider":"email","providers":["email"]}',
  '{"display_name":"Link Toggle Owner"}',
  now(), now()
);

insert into public.businesses (id, name, slug, owner_user_id)
values (
  'c2000000-0000-0000-0000-000000000001',
  'Link Toggle Co',
  'link-toggle-co',
  'b2000000-0000-0000-0000-000000000001'
);

insert into public.business_members (business_id, user_id, role)
values (
  'c2000000-0000-0000-0000-000000000001',
  'b2000000-0000-0000-0000-000000000001',
  'owner'
);

-- Branding for the business.
insert into public.business_branding (business_id)
values ('c2000000-0000-0000-0000-000000000001');

-- One active FAQ and one active service area.
insert into public.business_faqs (business_id, question, answer, is_active, sort_order)
values (
  'c2000000-0000-0000-0000-000000000001',
  'Do you offer move-out cleaning?', 'Yes we do.', true, 10
);

insert into public.business_service_areas (business_id, name, is_active, sort_order)
values (
  'c2000000-0000-0000-0000-000000000001',
  'Downtown', true, 10
);

-- Active intake form, consent version, and one visible field so anon would
-- normally see them through the helpers.
do $$
declare
  template_id uuid;
begin
  select id into template_id from public.industry_templates
  where slug = 'cleaning-smart-quote-v1' limit 1;

  if template_id is null then
    raise exception 'Seeded cleaning template missing; cannot run inactive-link test.';
  end if;

  insert into public.intake_forms (id, business_id, template_id, name, is_active, privacy_mode)
  values (
    'd2000000-0000-0000-0000-000000000001',
    'c2000000-0000-0000-0000-000000000001',
    template_id, 'Link toggle form', true, 'standard'
  );
end;
$$;

insert into public.intake_form_fields (
  id, business_id, intake_form_id, field_key, label, field_type,
  is_required, is_hidden, options, sort_order
)
values (
  '82000000-0000-0000-0000-000000000001',
  'c2000000-0000-0000-0000-000000000001',
  'd2000000-0000-0000-0000-000000000001',
  'visible_field', 'Visible Field', 'text', false, false, '[]'::jsonb, 10
);

insert into public.consent_versions (id, business_id, version_label, consent_notice, is_active)
values (
  'e2000000-0000-0000-0000-000000000001',
  'c2000000-0000-0000-0000-000000000001',
  'v1', 'Link toggle consent.', true
);

-- Start with the public link active.
insert into public.public_link_variants (id, business_id, slug, display_name, is_active)
values (
  '92000000-0000-0000-0000-000000000001',
  'c2000000-0000-0000-0000-000000000001',
  'link-toggle-quote', 'Link Toggle Quote', true
);

-- ============================================================
-- Side A: link active → anon must see public-safe rows.
-- ============================================================
set local role anon;
select set_config('request.jwt.claim.sub', '', true);
select set_config('request.jwt.claim.role', 'anon', true);

do $$
declare
  forms_visible integer;
  fields_visible integer;
  consents_visible integer;
  branding_visible integer;
  faqs_visible integer;
  areas_visible integer;
begin
  select count(*) into forms_visible
  from public.intake_forms where business_id = 'c2000000-0000-0000-0000-000000000001';

  select count(*) into fields_visible
  from public.intake_form_fields where business_id = 'c2000000-0000-0000-0000-000000000001';

  select count(*) into consents_visible
  from public.consent_versions where business_id = 'c2000000-0000-0000-0000-000000000001';

  select count(*) into branding_visible
  from public.business_branding where business_id = 'c2000000-0000-0000-0000-000000000001';

  select count(*) into faqs_visible
  from public.business_faqs where business_id = 'c2000000-0000-0000-0000-000000000001';

  select count(*) into areas_visible
  from public.business_service_areas where business_id = 'c2000000-0000-0000-0000-000000000001';

  if forms_visible <> 1 or fields_visible <> 1 or consents_visible <> 1
     or branding_visible <> 1 or faqs_visible <> 1 or areas_visible <> 1 then
    raise exception
      'Side A FAIL: with active link, anon should see all 6 public surfaces. '
      'Got forms=%, fields=%, consents=%, branding=%, faqs=%, areas=%.',
      forms_visible, fields_visible, consents_visible, branding_visible, faqs_visible, areas_visible;
  end if;
end;
$$;

-- ============================================================
-- Toggle the link to inactive (as superuser, via reset_role).
-- ============================================================
reset role;

update public.public_link_variants
   set is_active = false
 where id = '92000000-0000-0000-0000-000000000001';

-- ============================================================
-- Side B: link inactive → anon must see zero rows for the same business.
-- ============================================================
set local role anon;
select set_config('request.jwt.claim.sub', '', true);
select set_config('request.jwt.claim.role', 'anon', true);

do $$
declare
  forms_visible integer;
  fields_visible integer;
  consents_visible integer;
  branding_visible integer;
  faqs_visible integer;
  areas_visible integer;
begin
  select count(*) into forms_visible
  from public.intake_forms where business_id = 'c2000000-0000-0000-0000-000000000001';

  select count(*) into fields_visible
  from public.intake_form_fields where business_id = 'c2000000-0000-0000-0000-000000000001';

  select count(*) into consents_visible
  from public.consent_versions where business_id = 'c2000000-0000-0000-0000-000000000001';

  select count(*) into branding_visible
  from public.business_branding where business_id = 'c2000000-0000-0000-0000-000000000001';

  select count(*) into faqs_visible
  from public.business_faqs where business_id = 'c2000000-0000-0000-0000-000000000001';

  select count(*) into areas_visible
  from public.business_service_areas where business_id = 'c2000000-0000-0000-0000-000000000001';

  if forms_visible <> 0 or fields_visible <> 0 or consents_visible <> 0
     or branding_visible <> 0 or faqs_visible <> 0 or areas_visible <> 0 then
    raise exception
      'Side B FAIL: with inactive link, anon should see ZERO public surfaces. '
      'Got forms=%, fields=%, consents=%, branding=%, faqs=%, areas=%.',
      forms_visible, fields_visible, consents_visible, branding_visible, faqs_visible, areas_visible;
  end if;
end;
$$;

-- ============================================================
-- Side B2: anon cannot insert a submission for the inactive-link form.
-- ============================================================
do $$
declare
  blocked boolean := false;
begin
  begin
    insert into public.intake_submissions (
      id, business_id, intake_form_id, consent_version_id, privacy_mode,
      consent_accepted_at, status
    )
    values (
      'f2000000-0000-0000-0000-000000000001',
      'c2000000-0000-0000-0000-000000000001',
      'd2000000-0000-0000-0000-000000000001',
      'e2000000-0000-0000-0000-000000000001',
      'standard', now(), 'submitted'
    );
  exception when others then
    blocked := true;
  end;

  if not blocked then
    raise exception 'Side B2 FAIL: anon must not insert a submission for a form whose business has no active public link.';
  end if;
end;
$$;

rollback;
