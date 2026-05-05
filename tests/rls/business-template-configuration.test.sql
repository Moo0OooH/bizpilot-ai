/*
============================================================
File: tests/rls/business-template-configuration.test.sql
Project: BizPilot AI
Description: Defines SQL checks for Phase 3 business configuration RLS behavior.
Role: Verifies member access, manager writes, and cross-tenant denial for configuration tables.
Related:
- supabase/migrations/0002_business_template_configuration.sql
- docs/engineering/BIZPILOT_DATABASE_RLS_POLICY_BASELINE_v1.0.md
Author: MoOoH
Created: 2026-05-05
Last Updated: 2026-05-05
Change Log:
- 2026-05-05: Created Phase 3 business configuration RLS baseline tests.
- 2026-05-05: Expanded coverage for FAQs, branding, consent, template settings, and onboarding tasks.
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
values
  (
    '00000000-0000-0000-0000-000000000000',
    '30000000-0000-0000-0000-000000000001',
    'authenticated',
    'authenticated',
    'phase3-owner@example.com',
    'test-password',
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"display_name":"Phase 3 Owner"}',
    now(),
    now()
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '30000000-0000-0000-0000-000000000002',
    'authenticated',
    'authenticated',
    'phase3-outsider@example.com',
    'test-password',
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"display_name":"Phase 3 Outsider"}',
    now(),
    now()
  );

set local role authenticated;
select set_config('request.jwt.claim.sub', '30000000-0000-0000-0000-000000000001', true);
select set_config('request.jwt.claim.role', 'authenticated', true);

insert into public.businesses (id, name, slug, owner_user_id)
values (
  '40000000-0000-0000-0000-000000000001',
  'Phase 3 Cleaning Co',
  'phase-3-cleaning-co',
  '30000000-0000-0000-0000-000000000001'
);

insert into public.business_members (business_id, user_id, role)
values (
  '40000000-0000-0000-0000-000000000001',
  '30000000-0000-0000-0000-000000000001',
  'owner'
);

insert into public.business_services (business_id, name, sort_order)
values (
  '40000000-0000-0000-0000-000000000001',
  'Deep cleaning',
  10
);

insert into public.business_branding (business_id, primary_color, accent_color)
values (
  '40000000-0000-0000-0000-000000000001',
  '#18181b',
  '#0f766e'
);

insert into public.business_faqs (business_id, question, answer, sort_order)
values (
  '40000000-0000-0000-0000-000000000001',
  'Do you bring supplies?',
  'Yes, we bring standard supplies.',
  10
);

delete from public.business_faqs
where business_id = '40000000-0000-0000-0000-000000000001'
  and question = 'Do you bring supplies?';

insert into public.business_faqs (business_id, question, answer, sort_order)
values (
  '40000000-0000-0000-0000-000000000001',
  'Do you clean offices?',
  'Yes, we clean small offices.',
  10
);

insert into public.business_service_areas (business_id, name, sort_order)
values (
  '40000000-0000-0000-0000-000000000001',
  'Toronto',
  10
);

insert into public.business_privacy_settings (business_id, privacy_mode)
values (
  '40000000-0000-0000-0000-000000000001',
  'standard'
);

insert into public.business_consent_settings (
  business_id,
  consent_notice,
  ai_disclosure_enabled
)
values (
  '40000000-0000-0000-0000-000000000001',
  'Customer information is shared with this business for quote follow-up.',
  true
);

insert into public.business_template_settings (
  business_id,
  template_id,
  custom_name,
  field_overrides
)
values (
  '40000000-0000-0000-0000-000000000001',
  (
    select id
    from public.industry_templates
    where slug = 'cleaning-smart-quote-v1'
  ),
  'Custom Cleaning Quote',
  '{"disabledFields":["pets"],"labels":{"notes":"Anything else?"}}'::jsonb
);

insert into public.business_onboarding_tasks (
  business_id,
  task_key,
  label,
  completed_at,
  sort_order
)
values (
  '40000000-0000-0000-0000-000000000001',
  'faqs',
  'At least one FAQ added',
  now(),
  10
);

do $$
begin
  if (select count(*) from public.business_branding) <> 1 then
    raise exception 'Owner should read their configured branding.';
  end if;

  if (select count(*) from public.business_services) <> 1 then
    raise exception 'Owner should read their configured services.';
  end if;

  if (select count(*) from public.business_faqs) <> 1 then
    raise exception 'Owner should read their configured FAQs after replacement.';
  end if;

  if (select count(*) from public.business_service_areas) <> 1 then
    raise exception 'Owner should read their configured service areas.';
  end if;

  if (select count(*) from public.business_privacy_settings) <> 1 then
    raise exception 'Owner should read their privacy settings.';
  end if;

  if (select count(*) from public.business_consent_settings) <> 1 then
    raise exception 'Owner should read their consent settings.';
  end if;

  if (select count(*) from public.business_template_settings) <> 1 then
    raise exception 'Owner should read their template settings.';
  end if;

  if (select count(*) from public.business_onboarding_tasks) <> 1 then
    raise exception 'Owner should read their onboarding tasks.';
  end if;

  if (select count(*) from public.industry_templates where slug = 'cleaning-smart-quote-v1') <> 1 then
    raise exception 'Authenticated owner should read active Cleaning template metadata.';
  end if;
end;
$$;

select set_config('request.jwt.claim.sub', '30000000-0000-0000-0000-000000000002', true);

do $$
begin
  if (select count(*) from public.business_branding) <> 0 then
    raise exception 'Outsider must not read another tenant branding.';
  end if;

  if (select count(*) from public.business_services) <> 0 then
    raise exception 'Outsider must not read another tenant service configuration.';
  end if;

  if (select count(*) from public.business_faqs) <> 0 then
    raise exception 'Outsider must not read another tenant FAQs.';
  end if;

  if (select count(*) from public.business_service_areas) <> 0 then
    raise exception 'Outsider must not read another tenant service area configuration.';
  end if;

  if (select count(*) from public.business_privacy_settings) <> 0 then
    raise exception 'Outsider must not read another tenant privacy settings.';
  end if;

  if (select count(*) from public.business_consent_settings) <> 0 then
    raise exception 'Outsider must not read another tenant consent settings.';
  end if;

  if (select count(*) from public.business_template_settings) <> 0 then
    raise exception 'Outsider must not read another tenant template settings.';
  end if;

  if (select count(*) from public.business_onboarding_tasks) <> 0 then
    raise exception 'Outsider must not read another tenant onboarding tasks.';
  end if;
end;
$$;

do $$
begin
  begin
    insert into public.business_faqs (business_id, question, answer, sort_order)
    values (
      '40000000-0000-0000-0000-000000000001',
      'Can outsiders write FAQs?',
      'No.',
      20
    );

    raise exception 'Outsider must not insert FAQ rows for another tenant.';
  exception
    when insufficient_privilege then
      null;
  end;
end;
$$;

rollback;
