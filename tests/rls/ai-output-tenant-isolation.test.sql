/*
============================================================
File: tests/rls/ai-output-tenant-isolation.test.sql
Project: BizPilot AI
Description: Phase 11 RLS tests for ai_outputs tenant isolation.
Role: Verifies authenticated owner can read/insert/update own ai_outputs only;
      anon cannot read any; owner A cannot read business B's ai_outputs.
Related:
- supabase/migrations/0009_ai_lead_conversion_assistant.sql
- supabase/migrations/0010_explicit_data_api_grants.sql
- docs/security/BIZPILOT_SUPABASE_EXPLICIT_GRANTS_AUDIT_v1.0.md (Section 12 T7)
Author: MoOoH
Created: 2026-05-15
Last Updated: 2026-05-15
Change Log:
- 2026-05-15: Created Phase 11 ai_outputs tenant isolation tests.
============================================================
*/

begin;

-- ============================================================
-- Fixtures: two businesses, two owners, a lead per business,
-- and a seeded ai_output for each business.
-- ============================================================

insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at
)
values
  ('00000000-0000-0000-0000-000000000000',
   'b0000000-0000-0000-0000-00000000000a',
   'authenticated', 'authenticated',
   'ai-owner-a@example.com', 'test-password', now(),
   '{"provider":"email","providers":["email"]}',
   '{"display_name":"AI Owner A"}', now(), now()),
  ('00000000-0000-0000-0000-000000000000',
   'b0000000-0000-0000-0000-00000000000b',
   'authenticated', 'authenticated',
   'ai-owner-b@example.com', 'test-password', now(),
   '{"provider":"email","providers":["email"]}',
   '{"display_name":"AI Owner B"}', now(), now());

insert into public.businesses (id, name, slug, owner_user_id)
values
  ('c0000000-0000-0000-0000-00000000000a', 'AI Cleaning A', 'ai-cleaning-a', 'b0000000-0000-0000-0000-00000000000a'),
  ('c0000000-0000-0000-0000-00000000000b', 'AI Cleaning B', 'ai-cleaning-b', 'b0000000-0000-0000-0000-00000000000b');

insert into public.business_members (business_id, user_id, role)
values
  ('c0000000-0000-0000-0000-00000000000a', 'b0000000-0000-0000-0000-00000000000a', 'owner'),
  ('c0000000-0000-0000-0000-00000000000b', 'b0000000-0000-0000-0000-00000000000b', 'owner');

-- Each business needs a submission to point a lead at.
do $$
declare
  template_id uuid;
begin
  select id into template_id from public.industry_templates
  where slug = 'cleaning-smart-quote-v1' limit 1;

  if template_id is null then
    raise exception 'Seeded cleaning template missing; cannot run Phase 11 AI isolation tests.';
  end if;

  insert into public.intake_forms (id, business_id, template_id, name, is_active, privacy_mode)
  values
    ('d0000000-0000-0000-0000-00000000000a', 'c0000000-0000-0000-0000-00000000000a',
     template_id, 'AI A form', true, 'standard'),
    ('d0000000-0000-0000-0000-00000000000b', 'c0000000-0000-0000-0000-00000000000b',
     template_id, 'AI B form', true, 'standard');
end;
$$;

insert into public.consent_versions (id, business_id, version_label, consent_notice, is_active)
values
  ('e0000000-0000-0000-0000-00000000000a', 'c0000000-0000-0000-0000-00000000000a', 'v1', 'A consent.', true),
  ('e0000000-0000-0000-0000-00000000000b', 'c0000000-0000-0000-0000-00000000000b', 'v1', 'B consent.', true);

insert into public.intake_submissions (
  id, business_id, intake_form_id, consent_version_id, privacy_mode,
  consent_accepted_at, status
)
values
  ('f0000000-0000-0000-0000-00000000000a', 'c0000000-0000-0000-0000-00000000000a',
   'd0000000-0000-0000-0000-00000000000a', 'e0000000-0000-0000-0000-00000000000a',
   'standard', now(), 'submitted'),
  ('f0000000-0000-0000-0000-00000000000b', 'c0000000-0000-0000-0000-00000000000b',
   'd0000000-0000-0000-0000-00000000000b', 'e0000000-0000-0000-0000-00000000000b',
   'standard', now(), 'submitted');

insert into public.leads (id, business_id, intake_submission_id, status)
values
  ('11111111-1111-1111-1111-11111111111a', 'c0000000-0000-0000-0000-00000000000a',
   'f0000000-0000-0000-0000-00000000000a', 'new'),
  ('11111111-1111-1111-1111-11111111111b', 'c0000000-0000-0000-0000-00000000000b',
   'f0000000-0000-0000-0000-00000000000b', 'new');

insert into public.ai_outputs (
  business_id, lead_id, output_type, prompt_name, prompt_version,
  model, provider, input_hash, output, status
)
values
  ('c0000000-0000-0000-0000-00000000000a', '11111111-1111-1111-1111-11111111111a',
   'lead_conversion_bundle', 'lead_conversion_bundle', '2026-05-11.v1',
   'gpt-5.1', 'openai', 'hash-a',
   '{"replyDraft": "draft for A"}'::jsonb, 'generated'),
  ('c0000000-0000-0000-0000-00000000000b', '11111111-1111-1111-1111-11111111111b',
   'lead_conversion_bundle', 'lead_conversion_bundle', '2026-05-11.v1',
   'gpt-5.1', 'openai', 'hash-b',
   '{"replyDraft": "draft for B"}'::jsonb, 'generated');

-- ============================================================
-- T1: Owner A reads exactly their own ai_output.
-- ============================================================
set local role authenticated;
select set_config('request.jwt.claim.sub', 'b0000000-0000-0000-0000-00000000000a', true);
select set_config('request.jwt.claim.role', 'authenticated', true);

do $$
declare
  own_visible integer;
  other_visible integer;
begin
  select count(*) into own_visible
  from public.ai_outputs where business_id = 'c0000000-0000-0000-0000-00000000000a';

  if own_visible <> 1 then
    raise exception 'T1 FAIL: Owner A should see exactly 1 own ai_output, found %.', own_visible;
  end if;

  select count(*) into other_visible
  from public.ai_outputs where business_id = 'c0000000-0000-0000-0000-00000000000b';

  if other_visible <> 0 then
    raise exception 'T1 FAIL: Owner A must not see business B ai_outputs, found %.', other_visible;
  end if;
end;
$$;

-- ============================================================
-- T2: Owner A cannot insert an ai_output into business B.
-- ============================================================
do $$
declare
  blocked boolean := false;
begin
  begin
    insert into public.ai_outputs (
      business_id, lead_id, output_type, prompt_name, prompt_version,
      model, provider, input_hash, output, status
    )
    values (
      'c0000000-0000-0000-0000-00000000000b',
      '11111111-1111-1111-1111-11111111111b',
      'lead_conversion_bundle', 'lead_conversion_bundle', '2026-05-11.v1',
      'gpt-5.1', 'openai', 'attack-hash',
      '{"replyDraft": "attack"}'::jsonb, 'generated'
    );
  exception when others then
    blocked := true;
  end;

  if not blocked then
    raise exception 'T2 FAIL: Owner A must not be able to insert an ai_output into business B.';
  end if;
end;
$$;

-- ============================================================
-- T3: Owner B reads exactly their own ai_output.
-- ============================================================
select set_config('request.jwt.claim.sub', 'b0000000-0000-0000-0000-00000000000b', true);

do $$
declare
  own_visible integer;
  other_visible integer;
begin
  select count(*) into own_visible
  from public.ai_outputs where business_id = 'c0000000-0000-0000-0000-00000000000b';

  if own_visible <> 1 then
    raise exception 'T3 FAIL: Owner B should see exactly 1 own ai_output, found %.', own_visible;
  end if;

  select count(*) into other_visible
  from public.ai_outputs where business_id = 'c0000000-0000-0000-0000-00000000000a';

  if other_visible <> 0 then
    raise exception 'T3 FAIL: Owner B must not see business A ai_outputs, found %.', other_visible;
  end if;
end;
$$;

-- ============================================================
-- T4: Anon cannot read ai_outputs at all.
-- ============================================================
set local role anon;
select set_config('request.jwt.claim.sub', '', true);
select set_config('request.jwt.claim.role', 'anon', true);

do $$
declare
  visible integer;
begin
  select count(*) into visible from public.ai_outputs;
  if visible <> 0 then
    raise exception 'T4 FAIL: Anon must not see any ai_outputs, found %.', visible;
  end if;
end;
$$;

rollback;
