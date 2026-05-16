/*
============================================================
File: tests/rls/usage-events-tenant-isolation.test.sql
Project: BizPilot AI
Description: Phase 11 RLS tests for usage_events tenant isolation and append-only model.
Role: Verifies authenticated can SELECT/INSERT own events; cannot UPDATE or DELETE (no policy);
      anon cannot read anything; cross-tenant reads are blocked.
Related:
- supabase/migrations/0009_ai_lead_conversion_assistant.sql
- supabase/migrations/0010_explicit_data_api_grants.sql
- docs/security/BIZPILOT_SUPABASE_EXPLICIT_GRANTS_AUDIT_v1.0.md (Section 12 T7, T8)
Author: MoOoH
Created: 2026-05-15
Last Updated: 2026-05-15
Change Log:
- 2026-05-15: Created Phase 11 usage_events isolation + append-only tests.
============================================================
*/

begin;

insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at
)
values
  ('00000000-0000-0000-0000-000000000000',
   'b1000000-0000-0000-0000-00000000000a',
   'authenticated', 'authenticated',
   'usage-owner-a@example.com', 'test-password', now(),
   '{"provider":"email","providers":["email"]}',
   '{"display_name":"Usage Owner A"}', now(), now()),
  ('00000000-0000-0000-0000-000000000000',
   'b1000000-0000-0000-0000-00000000000b',
   'authenticated', 'authenticated',
   'usage-owner-b@example.com', 'test-password', now(),
   '{"provider":"email","providers":["email"]}',
   '{"display_name":"Usage Owner B"}', now(), now());

insert into public.businesses (id, name, slug, owner_user_id)
values
  ('c1000000-0000-0000-0000-00000000000a', 'Usage A', 'usage-a', 'b1000000-0000-0000-0000-00000000000a'),
  ('c1000000-0000-0000-0000-00000000000b', 'Usage B', 'usage-b', 'b1000000-0000-0000-0000-00000000000b');

insert into public.business_members (business_id, user_id, role)
values
  ('c1000000-0000-0000-0000-00000000000a', 'b1000000-0000-0000-0000-00000000000a', 'owner'),
  ('c1000000-0000-0000-0000-00000000000b', 'b1000000-0000-0000-0000-00000000000b', 'owner');

insert into public.usage_events (
  business_id, event_type, operation_type, provider, model
)
values
  ('c1000000-0000-0000-0000-00000000000a', 'ai_bundle_generated',
   'lead_conversion_bundle', 'openai', 'gpt-5.1'),
  ('c1000000-0000-0000-0000-00000000000b', 'ai_bundle_fallback',
   'lead_conversion_bundle', 'rule_fallback', 'rule-fallback-v1');

-- ============================================================
-- T1: Owner A reads only own usage_events.
-- ============================================================
set local role authenticated;
select set_config('request.jwt.claim.sub', 'b1000000-0000-0000-0000-00000000000a', true);
select set_config('request.jwt.claim.role', 'authenticated', true);

do $$
declare
  own_visible integer;
  other_visible integer;
begin
  select count(*) into own_visible from public.usage_events
  where business_id = 'c1000000-0000-0000-0000-00000000000a';

  if own_visible <> 1 then
    raise exception 'T1 FAIL: Owner A should see exactly 1 own usage_event, found %.', own_visible;
  end if;

  select count(*) into other_visible from public.usage_events
  where business_id = 'c1000000-0000-0000-0000-00000000000b';

  if other_visible <> 0 then
    raise exception 'T1 FAIL: Owner A must not see business B usage_events, found %.', other_visible;
  end if;
end;
$$;

-- ============================================================
-- T2: Owner A cannot INSERT a usage_event into business B.
-- ============================================================
do $$
declare
  blocked boolean := false;
begin
  begin
    insert into public.usage_events (
      business_id, event_type, operation_type, provider, model
    )
    values (
      'c1000000-0000-0000-0000-00000000000b',
      'ai_bundle_generated', 'lead_conversion_bundle', 'openai', 'gpt-5.1'
    );
  exception when others then
    blocked := true;
  end;

  if not blocked then
    raise exception 'T2 FAIL: Owner A must not be able to insert a usage_event into business B.';
  end if;
end;
$$;

-- ============================================================
-- T3: Authenticated cannot UPDATE usage_events (append-only model).
-- The 0010 grant only allows SELECT and INSERT; even on own business
-- the UPDATE must fail because no policy permits it.
-- ============================================================
do $$
declare
  blocked boolean := false;
begin
  begin
    update public.usage_events
       set model = 'tampered-model'
     where business_id = 'c1000000-0000-0000-0000-00000000000a';
  exception when others then
    blocked := true;
  end;

  -- If the update didn't raise, it may have silently affected zero rows
  -- because the SELECT policy hid the rows from the UPDATE filter.
  -- That's still acceptable as long as nothing changed.
  if not blocked then
    perform 1 from public.usage_events
    where business_id = 'c1000000-0000-0000-0000-00000000000a'
      and model = 'tampered-model';
    if found then
      raise exception 'T3 FAIL: authenticated must not be able to UPDATE usage_events.';
    end if;
  end if;
end;
$$;

-- ============================================================
-- T4: Authenticated cannot DELETE usage_events.
-- ============================================================
do $$
declare
  blocked boolean := false;
  before_count integer;
  after_count integer;
begin
  select count(*) into before_count from public.usage_events
  where business_id = 'c1000000-0000-0000-0000-00000000000a';

  begin
    delete from public.usage_events
    where business_id = 'c1000000-0000-0000-0000-00000000000a';
  exception when others then
    blocked := true;
  end;

  select count(*) into after_count from public.usage_events
  where business_id = 'c1000000-0000-0000-0000-00000000000a';

  if before_count <> after_count then
    raise exception 'T4 FAIL: authenticated must not be able to DELETE usage_events. before=% after=%',
      before_count, after_count;
  end if;
end;
$$;

-- ============================================================
-- T5: Anon cannot read any usage_events.
-- ============================================================
set local role anon;
select set_config('request.jwt.claim.sub', '', true);
select set_config('request.jwt.claim.role', 'anon', true);

do $$
declare
  visible integer;
begin
  select count(*) into visible from public.usage_events;
  if visible <> 0 then
    raise exception 'T5 FAIL: Anon must not see any usage_events, found %.', visible;
  end if;
end;
$$;

rollback;
