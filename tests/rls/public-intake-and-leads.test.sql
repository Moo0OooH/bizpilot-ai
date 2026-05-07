/*
============================================================
File: tests/rls/public-intake-and-leads.test.sql
Project: BizPilot AI
Description: Defines SQL checks for Phase 4 public intake and lead RLS behavior.
Role: Verifies public-safe reads, scoped public inserts, and private data denial.
Related:
- supabase/migrations/0005_public_intake_and_leads.sql
- docs/engineering/BIZPILOT_DATABASE_RLS_POLICY_BASELINE_v1.0.md
Author: MoOoH
Created: 2026-05-06
Last Updated: 2026-05-07
Change Log:
- 2026-05-07: Synced intake field helper checks with hardened business_id + form_id signature.
- 2026-05-06: Created Phase 4 public intake RLS baseline tests.
- 2026-05-06: Added no-public-link fixture to prevent broad public config reads.
============================================================
*/

begin;

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
values (
  '00000000-0000-0000-0000-000000000000',
  '50000000-0000-0000-0000-000000000001',
  'authenticated',
  'authenticated',
  'phase4-owner@example.com',
  'test-password',
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"display_name":"Phase 4 Owner"}',
  now(),
  now()
);

set local role authenticated;
select set_config('request.jwt.claim.sub', '50000000-0000-0000-0000-000000000001', true);
select set_config('request.jwt.claim.role', 'authenticated', true);

insert into public.businesses (id, name, slug, owner_user_id)
values (
  '60000000-0000-0000-0000-000000000001',
  'Phase 4 Cleaning Co',
  'phase-4-cleaning-co',
  '50000000-0000-0000-0000-000000000001'
);

insert into public.business_members (business_id, user_id, role)
values (
  '60000000-0000-0000-0000-000000000001',
  '50000000-0000-0000-0000-000000000001',
  'owner'
);

insert into public.business_branding (business_id, primary_color, accent_color)
values (
  '60000000-0000-0000-0000-000000000001',
  '#18181b',
  '#0f766e'
);

insert into public.business_privacy_settings (business_id, privacy_mode)
values (
  '60000000-0000-0000-0000-000000000001',
  'standard'
);

insert into public.public_link_variants (
  id,
  business_id,
  slug,
  display_name
)
values (
  '61000000-0000-0000-0000-000000000001',
  '60000000-0000-0000-0000-000000000001',
  'phase-4-cleaning-co',
  'Phase 4 Cleaning Co'
);

insert into public.intake_forms (
  id,
  business_id,
  template_id,
  name
)
values (
  '62000000-0000-0000-0000-000000000001',
  '60000000-0000-0000-0000-000000000001',
  (
    select id
    from public.industry_templates
    where slug = 'cleaning-smart-quote-v1'
  ),
  'Cleaning Smart Quote'
);

insert into public.intake_form_fields (
  business_id,
  intake_form_id,
  field_key,
  label,
  field_type,
  is_required,
  sort_order
)
values
  (
    '60000000-0000-0000-0000-000000000001',
    '62000000-0000-0000-0000-000000000001',
    'customer_name',
    'Customer name',
    'text',
    true,
    10
  ),
  (
    '60000000-0000-0000-0000-000000000001',
    '62000000-0000-0000-0000-000000000001',
    'customer_contact',
    'Customer contact',
    'text',
    true,
    20
  );

insert into public.consent_versions (
  id,
  business_id,
  version_label,
  consent_notice
)
values (
  '63000000-0000-0000-0000-000000000001',
  '60000000-0000-0000-0000-000000000001',
  'v1',
  'Customer information is shared with this business for quote follow-up.'
);

insert into public.businesses (id, name, slug, owner_user_id)
values (
  '60000000-0000-0000-0000-000000000002',
  'No Link Cleaning Co',
  'no-link-cleaning-co',
  '50000000-0000-0000-0000-000000000001'
);

insert into public.business_members (business_id, user_id, role)
values (
  '60000000-0000-0000-0000-000000000002',
  '50000000-0000-0000-0000-000000000001',
  'owner'
);

insert into public.business_branding (business_id, primary_color, accent_color)
values (
  '60000000-0000-0000-0000-000000000002',
  '#111827',
  '#dc2626'
);

insert into public.businesses (id, name, slug, owner_user_id)
values (
  '60000000-0000-0000-0000-000000000003',
  'Inactive Form Cleaning Co',
  'inactive-form-cleaning-co',
  '50000000-0000-0000-0000-000000000001'
);

insert into public.business_members (business_id, user_id, role)
values (
  '60000000-0000-0000-0000-000000000003',
  '50000000-0000-0000-0000-000000000001',
  'owner'
);

insert into public.public_link_variants (
  id,
  business_id,
  slug,
  display_name
)
values (
  '61000000-0000-0000-0000-000000000003',
  '60000000-0000-0000-0000-000000000003',
  'inactive-form-cleaning-co',
  'Inactive Form Cleaning Co'
);

insert into public.intake_forms (
  id,
  business_id,
  template_id,
  name
)
values (
  '62000000-0000-0000-0000-000000000002',
  '60000000-0000-0000-0000-000000000002',
  (
    select id
    from public.industry_templates
    where slug = 'cleaning-smart-quote-v1'
  ),
  'Hidden Without Public Link'
);

insert into public.intake_forms (
  id,
  business_id,
  template_id,
  name,
  is_active
)
values (
  '62000000-0000-0000-0000-000000000003',
  '60000000-0000-0000-0000-000000000003',
  (
    select id
    from public.industry_templates
    where slug = 'cleaning-smart-quote-v1'
  ),
  'Inactive Public Form',
  false
);

insert into public.intake_form_fields (
  business_id,
  intake_form_id,
  field_key,
  label,
  field_type,
  is_required,
  sort_order
)
values (
  '60000000-0000-0000-0000-000000000002',
  '62000000-0000-0000-0000-000000000002',
  'customer_name',
  'Customer name',
  'text',
  true,
  10
);

insert into public.consent_versions (
  id,
  business_id,
  version_label,
  consent_notice
)
values (
  '63000000-0000-0000-0000-000000000002',
  '60000000-0000-0000-0000-000000000002',
  'v1',
  'This inactive public-link fixture must not be publicly readable.'
);

do $$
begin
  if (select count(*) from public.public_link_variants where slug = 'phase-4-cleaning-co') <> 1 then
    raise exception 'Setup failed: owner should create active public link variant.';
  end if;

  if (select count(*) from public.intake_forms where id = '62000000-0000-0000-0000-000000000001') <> 1 then
    raise exception 'Setup failed: owner should create active intake form.';
  end if;

  if (select count(*) from public.intake_form_fields where intake_form_id = '62000000-0000-0000-0000-000000000001') <> 2 then
    raise exception 'Setup failed: owner should create intake form fields.';
  end if;

  if (select count(*) from public.consent_versions where id = '63000000-0000-0000-0000-000000000001') <> 1 then
    raise exception 'Setup failed: owner should create consent version.';
  end if;
end;
$$;

set local role anon;
select set_config('request.jwt.claim.sub', '', true);
select set_config('request.jwt.claim.role', 'anon', true);

do $$
begin
  if (select count(*) from public.public_link_variants where slug = 'phase-4-cleaning-co') <> 1 then
    raise exception 'Public should read active public link variant.';
  end if;

  if not public.has_active_public_link('60000000-0000-0000-0000-000000000001') then
    raise exception 'Public fixture should resolve an active public link inside this transaction.';
  end if;

  if not public.can_public_read_intake_form(
    '60000000-0000-0000-0000-000000000001',
    true
  ) then
    raise exception 'Public fixture should resolve the active intake form through the helper.';
  end if;

  if public.can_public_read_intake_form(
    '60000000-0000-0000-0000-000000000002',
    true
  ) then
    raise exception 'Public fixture must not resolve a form without an active public link.';
  end if;

  if not public.can_public_read_intake_field(
    '60000000-0000-0000-0000-000000000001',
    '62000000-0000-0000-0000-000000000001',
    false
  ) then
    raise exception 'Public fixture should resolve visible intake fields through the helper.';
  end if;

  if public.can_public_read_intake_field(
    '60000000-0000-0000-0000-000000000002',
    '62000000-0000-0000-0000-000000000002',
    false
  ) then
    raise exception 'Public fixture must not resolve fields without an active public link.';
  end if;

  if public.can_public_read_intake_field(
    '60000000-0000-0000-0000-000000000001',
    '62000000-0000-0000-0000-000000000001',
    true
  ) then
    raise exception 'Public fixture must not resolve hidden intake fields.';
  end if;

  if public.can_public_read_intake_field(
    '60000000-0000-0000-0000-000000000003',
    '62000000-0000-0000-0000-000000000003',
    false
  ) then
    raise exception 'Public fixture must not resolve fields for inactive intake forms.';
  end if;

  if (select count(*) from public.intake_forms where id = '62000000-0000-0000-0000-000000000001') <> 1 then
    raise exception 'Public should read active intake form.';
  end if;

  if (select count(*) from public.intake_forms where id = '62000000-0000-0000-0000-000000000002') <> 0 then
    raise exception 'Public must not read intake forms without an active public link.';
  end if;

  if (
    select count(*)
    from public.intake_form_fields
    where business_id = '60000000-0000-0000-0000-000000000001'
      and intake_form_id = '62000000-0000-0000-0000-000000000001'
  ) <> 2 then
    raise exception
      'Public should read the 2 active visible intake fields for the fixture. Actual fixture count: %',
      (
        select count(*)
        from public.intake_form_fields
        where business_id = '60000000-0000-0000-0000-000000000001'
          and intake_form_id = '62000000-0000-0000-0000-000000000001'
      );
  end if;

  if (
    select count(*)
    from public.intake_form_fields
    where business_id = '60000000-0000-0000-0000-000000000002'
      and intake_form_id = '62000000-0000-0000-0000-000000000002'
  ) <> 0 then
    raise exception 'Public must not read fixture fields without an active public link.';
  end if;

  if (
    select count(*)
    from public.intake_form_fields
    where business_id = '60000000-0000-0000-0000-000000000003'
      and intake_form_id = '62000000-0000-0000-0000-000000000003'
  ) <> 0 then
    raise exception 'Public must not read fixture fields for inactive intake forms.';
  end if;

  if (
    select count(*)
    from public.consent_versions
    where id = '63000000-0000-0000-0000-000000000001'
  ) <> 1 then
    raise exception 'Public should read the active fixture consent version.';
  end if;

  if (
    select count(*)
    from public.consent_versions
    where id = '63000000-0000-0000-0000-000000000002'
  ) <> 0 then
    raise exception 'Public must not read fixture consent versions without an active public link.';
  end if;

  if (
    select count(*)
    from public.business_branding
    where business_id = '60000000-0000-0000-0000-000000000001'
  ) <> 1 then
    raise exception 'Public should read fixture branding only behind an active public link.';
  end if;

  if (
    select count(*)
    from public.business_branding
    where business_id = '60000000-0000-0000-0000-000000000002'
  ) <> 0 then
    raise exception 'Public must not read fixture branding without an active public link.';
  end if;

  if (select count(*) from public.businesses) <> 0 then
    raise exception 'Public must not read private business rows.';
  end if;

  if (select count(*) from public.business_privacy_settings) <> 0 then
    raise exception 'Public must not read private privacy settings.';
  end if;
end;
$$;

insert into public.intake_submissions (
  id,
  business_id,
  intake_form_id,
  consent_version_id,
  privacy_mode,
  consent_accepted_at
)
values (
  '64000000-0000-0000-0000-000000000001',
  '60000000-0000-0000-0000-000000000001',
  '62000000-0000-0000-0000-000000000001',
  '63000000-0000-0000-0000-000000000001',
  'standard',
  now()
);

insert into public.intake_submission_values (
  business_id,
  submission_id,
  field_key,
  field_label,
  field_value
)
values
  (
    '60000000-0000-0000-0000-000000000001',
    '64000000-0000-0000-0000-000000000001',
    'customer_name',
    'Customer name',
    '"Test Customer"'::jsonb
  ),
  (
    '60000000-0000-0000-0000-000000000001',
    '64000000-0000-0000-0000-000000000001',
    'customer_contact',
    'Customer contact',
    '"test@example.com"'::jsonb
  );

insert into public.leads (
  id,
  business_id,
  intake_submission_id,
  customer_name,
  customer_contact,
  source_channel
)
values (
  '65000000-0000-0000-0000-000000000001',
  '60000000-0000-0000-0000-000000000001',
  '64000000-0000-0000-0000-000000000001',
  'Test Customer',
  'test@example.com',
  'public_quote_link'
);

insert into public.lead_source_metadata (
  business_id,
  lead_id,
  source_channel,
  utm_source
)
values (
  '60000000-0000-0000-0000-000000000001',
  '65000000-0000-0000-0000-000000000001',
  'public_quote_link',
  'website'
);

do $$
begin
  if (
    select count(*)
    from public.intake_submissions
    where id = '64000000-0000-0000-0000-000000000001'
  ) <> 0 then
    raise exception 'Public must not read the fixture intake submission after insert.';
  end if;

  if (
    select count(*)
    from public.leads
    where id = '65000000-0000-0000-0000-000000000001'
  ) <> 0 then
    raise exception 'Public must not read the fixture lead after insert.';
  end if;

  if (
    select count(*)
    from public.intake_submission_values
    where submission_id = '64000000-0000-0000-0000-000000000001'
  ) <> 0 then
    raise exception 'Public must not read the fixture intake submission values after insert.';
  end if;

  if (
    select count(*)
    from public.lead_source_metadata
    where lead_id = '65000000-0000-0000-0000-000000000001'
  ) <> 0 then
    raise exception 'Public must not read the fixture lead source metadata after insert.';
  end if;
end;
$$;

set local role authenticated;
select set_config('request.jwt.claim.sub', '50000000-0000-0000-0000-000000000001', true);
select set_config('request.jwt.claim.role', 'authenticated', true);

do $$
begin
  if (
    select count(*)
    from public.intake_submissions
    where id = '64000000-0000-0000-0000-000000000001'
  ) <> 1 then
    raise exception 'Owner should read the fixture submitted intake submission.';
  end if;

  if (
    select count(*)
    from public.intake_submission_values
    where submission_id = '64000000-0000-0000-0000-000000000001'
  ) <> 2 then
    raise exception 'Owner should read the fixture submitted intake values.';
  end if;

  if (
    select count(*)
    from public.leads
    where id = '65000000-0000-0000-0000-000000000001'
  ) <> 1 then
    raise exception 'Owner should read the fixture generated lead.';
  end if;

  if (
    select count(*)
    from public.lead_source_metadata
    where lead_id = '65000000-0000-0000-0000-000000000001'
  ) <> 1 then
    raise exception 'Owner should read the fixture lead source metadata.';
  end if;
end;
$$;

rollback;
