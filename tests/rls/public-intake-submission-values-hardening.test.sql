/*
============================================================
File: tests/rls/public-intake-submission-values-hardening.test.sql
Project: BizPilot AI
Description: Phase 12 RLS tests for the hardened public insert path on intake_submission_values.
Role: Verifies that anon can insert values only for visible fields that belong to the
      submission's own form and business; unknown keys, hidden fields, and cross-form
      values are rejected.
Related:
- supabase/migrations/0012_intake_submission_values_minimal_rls_hardening.sql
- docs/security/BIZPILOT_SUPABASE_EXPLICIT_GRANTS_AUDIT_v1.0.md
Author: MoOoH
Created: 2026-05-15
Last Updated: 2026-05-15
Change Log:
- 2026-05-15: Created Phase 12 hardening verification tests.
============================================================
*/

begin;

-- ============================================================
-- Fixtures
-- ============================================================
-- Two businesses, each with its own form/consent/public link/submission.
-- Business A has a visible field "visible_a" and a hidden field "hidden_a".
-- Business B has a visible field "visible_b" so we can test cross-form/business mixing.

insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at
)
values
  (
    '00000000-0000-0000-0000-000000000000',
    '50000000-0000-0000-0000-00000000000a',
    'authenticated', 'authenticated',
    'owner-a@example.com', 'test-password', now(),
    '{"provider":"email","providers":["email"]}',
    '{"display_name":"Owner A"}',
    now(), now()
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '50000000-0000-0000-0000-00000000000b',
    'authenticated', 'authenticated',
    'owner-b@example.com', 'test-password', now(),
    '{"provider":"email","providers":["email"]}',
    '{"display_name":"Owner B"}',
    now(), now()
  );

insert into public.businesses (id, name, slug, owner_user_id)
values
  ('60000000-0000-0000-0000-00000000000a', 'Cleaning A', 'cleaning-a', '50000000-0000-0000-0000-00000000000a'),
  ('60000000-0000-0000-0000-00000000000b', 'Cleaning B', 'cleaning-b', '50000000-0000-0000-0000-00000000000b');

insert into public.business_members (business_id, user_id, role)
values
  ('60000000-0000-0000-0000-00000000000a', '50000000-0000-0000-0000-00000000000a', 'owner'),
  ('60000000-0000-0000-0000-00000000000b', '50000000-0000-0000-0000-00000000000b', 'owner');

-- Each business needs an industry template reference. Reuse the seeded
-- cleaning template from migration 0002.
do $$
declare
  template_id uuid;
begin
  select id into template_id from public.industry_templates
  where slug = 'cleaning-smart-quote-v1' limit 1;

  if template_id is null then
    raise exception 'Seeded cleaning template missing; cannot run Phase 12 tests.';
  end if;

  insert into public.intake_forms (id, business_id, template_id, name, is_active, privacy_mode)
  values
    ('70000000-0000-0000-0000-00000000000a', '60000000-0000-0000-0000-00000000000a',
     template_id, 'Cleaning A form', true, 'standard'),
    ('70000000-0000-0000-0000-00000000000b', '60000000-0000-0000-0000-00000000000b',
     template_id, 'Cleaning B form', true, 'standard');
end;
$$;

-- Fields: a visible one and a hidden one for business A; a visible one for business B.
insert into public.intake_form_fields (
  id, business_id, intake_form_id, field_key, label, field_type,
  is_required, is_hidden, options, sort_order
)
values
  (
    '80000000-0000-0000-0000-00000000000a',
    '60000000-0000-0000-0000-00000000000a',
    '70000000-0000-0000-0000-00000000000a',
    'visible_a', 'Visible A', 'text', false, false, '[]'::jsonb, 10
  ),
  (
    '80000000-0000-0000-0000-00000000000c',
    '60000000-0000-0000-0000-00000000000a',
    '70000000-0000-0000-0000-00000000000a',
    'hidden_a', 'Hidden A', 'text', false, true, '[]'::jsonb, 20
  ),
  (
    '80000000-0000-0000-0000-00000000000b',
    '60000000-0000-0000-0000-00000000000b',
    '70000000-0000-0000-0000-00000000000b',
    'visible_b', 'Visible B', 'text', false, false, '[]'::jsonb, 10
  );

insert into public.consent_versions (id, business_id, version_label, consent_notice, is_active)
values
  (
    '90000000-0000-0000-0000-00000000000a',
    '60000000-0000-0000-0000-00000000000a',
    'v1', 'Test consent A.', true
  ),
  (
    '90000000-0000-0000-0000-00000000000b',
    '60000000-0000-0000-0000-00000000000b',
    'v1', 'Test consent B.', true
  );

insert into public.public_link_variants (business_id, slug, display_name, is_active)
values
  ('60000000-0000-0000-0000-00000000000a', 'cleaning-a-quote', 'Cleaning A Quote', true),
  ('60000000-0000-0000-0000-00000000000b', 'cleaning-b-quote', 'Cleaning B Quote', true);

-- One submission per business. Insertion as postgres bypasses RLS,
-- which is fine for fixture setup.
insert into public.intake_submissions (
  id, business_id, intake_form_id, consent_version_id, privacy_mode,
  consent_accepted_at, status
)
values
  (
    'a0000000-0000-0000-0000-00000000000a',
    '60000000-0000-0000-0000-00000000000a',
    '70000000-0000-0000-0000-00000000000a',
    '90000000-0000-0000-0000-00000000000a',
    'standard', now(), 'submitted'
  ),
  (
    'a0000000-0000-0000-0000-00000000000b',
    '60000000-0000-0000-0000-00000000000b',
    '70000000-0000-0000-0000-00000000000b',
    '90000000-0000-0000-0000-00000000000b',
    'standard', now(), 'submitted'
  );

-- ============================================================
-- Switch to anon role
-- ============================================================
set local role anon;
select set_config('request.jwt.claim.sub', '', true);
select set_config('request.jwt.claim.role', 'anon', true);

-- ============================================================
-- T1: anon CAN insert a value for a visible field on the matching submission.
-- ============================================================
do $$
begin
  insert into public.intake_submission_values (
    business_id, submission_id, field_key, field_label, field_value
  )
  values (
    '60000000-0000-0000-0000-00000000000a',
    'a0000000-0000-0000-0000-00000000000a',
    'visible_a',
    'Visible A',
    to_jsonb('hello'::text)
  );
exception when others then
  raise exception 'T1 FAIL: anon should be allowed to insert a visible-field value. SQLSTATE=%, MESSAGE=%',
    sqlstate, sqlerrm;
end;
$$;

-- ============================================================
-- T2: anon CANNOT insert a value with an unknown field_key.
-- ============================================================
do $$
declare
  blocked boolean := false;
begin
  begin
    insert into public.intake_submission_values (
      business_id, submission_id, field_key, field_label, field_value
    )
    values (
      '60000000-0000-0000-0000-00000000000a',
      'a0000000-0000-0000-0000-00000000000a',
      'does_not_exist',
      'Does Not Exist',
      to_jsonb('payload'::text)
    );
  exception when others then
    blocked := true;
  end;

  if not blocked then
    raise exception 'T2 FAIL: anon must not be able to insert a value with an unknown field_key.';
  end if;
end;
$$;

-- ============================================================
-- T3: anon CANNOT insert a value for a hidden field, even if the key exists.
-- ============================================================
do $$
declare
  blocked boolean := false;
begin
  begin
    insert into public.intake_submission_values (
      business_id, submission_id, field_key, field_label, field_value
    )
    values (
      '60000000-0000-0000-0000-00000000000a',
      'a0000000-0000-0000-0000-00000000000a',
      'hidden_a',
      'Hidden A',
      to_jsonb('exfiltration attempt'::text)
    );
  exception when others then
    blocked := true;
  end;

  if not blocked then
    raise exception 'T3 FAIL: anon must not be able to insert a value for a hidden field.';
  end if;
end;
$$;

-- ============================================================
-- T4: anon CANNOT mix submissions and field_keys across businesses/forms.
-- The field "visible_b" exists, but only on Business B's form. Inserting it
-- against Business A's submission must be rejected.
-- ============================================================
do $$
declare
  blocked boolean := false;
begin
  begin
    insert into public.intake_submission_values (
      business_id, submission_id, field_key, field_label, field_value
    )
    values (
      '60000000-0000-0000-0000-00000000000a',
      'a0000000-0000-0000-0000-00000000000a',
      'visible_b',
      'Visible B',
      to_jsonb('cross-form'::text)
    );
  exception when others then
    blocked := true;
  end;

  if not blocked then
    raise exception 'T4 FAIL: anon must not be able to insert a field_key that does not belong to the submission''s own form.';
  end if;
end;
$$;

-- ============================================================
-- T5: anon CANNOT mix business_id with another business's submission.
-- ============================================================
do $$
declare
  blocked boolean := false;
begin
  begin
    insert into public.intake_submission_values (
      business_id, submission_id, field_key, field_label, field_value
    )
    values (
      '60000000-0000-0000-0000-00000000000b',
      'a0000000-0000-0000-0000-00000000000a',
      'visible_b',
      'Visible B',
      to_jsonb('cross-business'::text)
    );
  exception when others then
    blocked := true;
  end;

  if not blocked then
    raise exception 'T5 FAIL: anon must not be able to insert a value where business_id and submission_id refer to different businesses.';
  end if;
end;
$$;

rollback;
