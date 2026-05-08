/*
============================================================
File: tests/rls/lead-conversion-desk.test.sql
Project: BizPilot AI
Description: Defines SQL checks for Phase 5 Lead Conversion Desk RLS behavior.
Role: Verifies member-only dashboard lead updates, score reads, action items, and timeline events.
Related:
- supabase/migrations/0007_lead_conversion_desk.sql
- docs/engineering/BIZPILOT_DATABASE_RLS_POLICY_BASELINE_v1.0.md
Author: MoOoH
Created: 2026-05-07
Last Updated: 2026-05-07
Change Log:
- 2026-05-07: Created Phase 5 RLS baseline tests.
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
    '70000000-0000-0000-0000-000000000001',
    'authenticated',
    'authenticated',
    'phase5-owner@example.com',
    'test-password',
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"display_name":"Phase 5 Owner"}',
    now(),
    now()
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '70000000-0000-0000-0000-000000000002',
    'authenticated',
    'authenticated',
    'phase5-outsider@example.com',
    'test-password',
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"display_name":"Phase 5 Outsider"}',
    now(),
    now()
  );

set local role authenticated;
select set_config('request.jwt.claim.sub', '70000000-0000-0000-0000-000000000001', true);
select set_config('request.jwt.claim.role', 'authenticated', true);

insert into public.businesses (id, name, slug, owner_user_id)
values (
  '71000000-0000-0000-0000-000000000001',
  'Phase 5 Cleaning Co',
  'phase-5-cleaning-co',
  '70000000-0000-0000-0000-000000000001'
);

insert into public.business_members (business_id, user_id, role)
values (
  '71000000-0000-0000-0000-000000000001',
  '70000000-0000-0000-0000-000000000001',
  'owner'
);

insert into public.public_link_variants (
  id,
  business_id,
  slug,
  display_name
)
values (
  '72000000-0000-0000-0000-000000000001',
  '71000000-0000-0000-0000-000000000001',
  'phase-5-cleaning-co',
  'Phase 5 Cleaning Co'
);

insert into public.intake_forms (
  id,
  business_id,
  template_id,
  name
)
values (
  '73000000-0000-0000-0000-000000000001',
  '71000000-0000-0000-0000-000000000001',
  (
    select id
    from public.industry_templates
    where slug = 'cleaning-smart-quote-v1'
  ),
  'Cleaning Smart Quote'
);

insert into public.consent_versions (
  id,
  business_id,
  version_label,
  consent_notice
)
values (
  '74000000-0000-0000-0000-000000000001',
  '71000000-0000-0000-0000-000000000001',
  'v1',
  'Customer information is shared for quote follow-up.'
);

insert into public.intake_submissions (
  id,
  business_id,
  intake_form_id,
  consent_version_id,
  privacy_mode,
  consent_accepted_at
)
values (
  '75000000-0000-0000-0000-000000000001',
  '71000000-0000-0000-0000-000000000001',
  '73000000-0000-0000-0000-000000000001',
  '74000000-0000-0000-0000-000000000001',
  'standard',
  now()
);

insert into public.leads (
  id,
  business_id,
  intake_submission_id,
  customer_name,
  customer_contact,
  service_type,
  city_or_service_area
)
values (
  '76000000-0000-0000-0000-000000000001',
  '71000000-0000-0000-0000-000000000001',
  '75000000-0000-0000-0000-000000000001',
  'Phase 5 Customer',
  'phase5@example.com',
  'Deep clean',
  'Toronto'
);

update public.leads
set
  first_viewed_at = now(),
  response_status = 'viewed',
  response_sla_state = 'viewed'
where id = '76000000-0000-0000-0000-000000000001';

insert into public.lead_quality_scores (
  id,
  business_id,
  lead_id,
  quality_level,
  completeness_score,
  completeness_label,
  missing_info_keys,
  explanation
)
values (
  '77000000-0000-0000-0000-000000000001',
  '71000000-0000-0000-0000-000000000001',
  '76000000-0000-0000-0000-000000000001',
  'good',
  80,
  'mostly_complete',
  array['preferred_date'],
  'Contact, service, and area are present.'
);

insert into public.lead_action_items (
  id,
  business_id,
  lead_id,
  action_type,
  title
)
values (
  '78000000-0000-0000-0000-000000000001',
  '71000000-0000-0000-0000-000000000001',
  '76000000-0000-0000-0000-000000000001',
  'ask_info',
  'Ask for preferred date'
);

insert into public.lead_events (
  id,
  business_id,
  lead_id,
  event_type,
  event_label
)
values (
  '79000000-0000-0000-0000-000000000001',
  '71000000-0000-0000-0000-000000000001',
  '76000000-0000-0000-0000-000000000001',
  'lead_viewed',
  'Lead viewed'
);

do $$
begin
  if (
    select count(*)
    from public.lead_quality_scores
    where lead_id = '76000000-0000-0000-0000-000000000001'
  ) <> 1 then
    raise exception 'Owner should read own lead quality score.';
  end if;

  if (
    select count(*)
    from public.lead_action_items
    where lead_id = '76000000-0000-0000-0000-000000000001'
  ) <> 1 then
    raise exception 'Owner should read own lead action item.';
  end if;

  if (
    select count(*)
    from public.lead_events
    where lead_id = '76000000-0000-0000-0000-000000000001'
  ) <> 1 then
    raise exception 'Owner should read own lead timeline event.';
  end if;
end;
$$;

set local role anon;
select set_config('request.jwt.claim.sub', '', true);
select set_config('request.jwt.claim.role', 'anon', true);

do $$
begin
  if (select count(*) from public.leads where id = '76000000-0000-0000-0000-000000000001') <> 0 then
    raise exception 'Public must not read dashboard lead records.';
  end if;

  if (select count(*) from public.lead_quality_scores) <> 0 then
    raise exception 'Public must not read lead quality scores.';
  end if;

  if (select count(*) from public.lead_action_items) <> 0 then
    raise exception 'Public must not read lead action items.';
  end if;

  if (select count(*) from public.lead_events) <> 0 then
    raise exception 'Public must not read lead timeline events.';
  end if;
end;
$$;

set local role authenticated;
select set_config('request.jwt.claim.sub', '70000000-0000-0000-0000-000000000002', true);
select set_config('request.jwt.claim.role', 'authenticated', true);

do $$
begin
  if (select count(*) from public.leads where id = '76000000-0000-0000-0000-000000000001') <> 0 then
    raise exception 'Non-member must not read another business lead.';
  end if;

  if (select count(*) from public.lead_quality_scores where id = '77000000-0000-0000-0000-000000000001') <> 0 then
    raise exception 'Non-member must not read another business score.';
  end if;

  if (select count(*) from public.lead_action_items where id = '78000000-0000-0000-0000-000000000001') <> 0 then
    raise exception 'Non-member must not read another business action item.';
  end if;

  if (select count(*) from public.lead_events where id = '79000000-0000-0000-0000-000000000001') <> 0 then
    raise exception 'Non-member must not read another business timeline event.';
  end if;
end;
$$;

update public.leads
set response_status = 'reply_copied'
where id = '76000000-0000-0000-0000-000000000001';

select set_config('request.jwt.claim.sub', '70000000-0000-0000-0000-000000000001', true);
select set_config('request.jwt.claim.role', 'authenticated', true);

do $$
begin
  if (
    select response_status
    from public.leads
    where id = '76000000-0000-0000-0000-000000000001'
  ) <> 'viewed' then
    raise exception 'Non-member must not update another business lead.';
  end if;
end;
$$;

rollback;
