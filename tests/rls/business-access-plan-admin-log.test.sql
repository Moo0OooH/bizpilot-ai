/*
============================================================
File: tests/rls/business-access-plan-admin-log.test.sql
Project: BizPilot AI
Description: Phase 18C RLS tests for manual plan/access controls and admin log privacy.
Role: Verifies suspended businesses and disabled memberships block tenant/public access.
Related:
- supabase/migrations/0015_business_access_plan_and_admin_log.sql
Author: MoOoH
Created: 2026-05-22
Last Updated: 2026-05-22
============================================================
*/

begin;

insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at
)
values
  (
    '00000000-0000-0000-0000-000000000000',
    'd5000000-0000-0000-0000-000000000001',
    'authenticated', 'authenticated', 'access-owner@example.com', 'pw',
    now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    'd5000000-0000-0000-0000-000000000002',
    'authenticated', 'authenticated', 'disabled-member@example.com', 'pw',
    now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()
  );

insert into public.businesses (
  id, name, slug, owner_user_id, status, plan_slug
)
values (
  'd6000000-0000-0000-0000-000000000001',
  'Access Test Cleaning',
  'access-test-cleaning',
  'd5000000-0000-0000-0000-000000000001',
  'active',
  'founder_pilot'
);

insert into public.business_members (business_id, user_id, role, status)
values
  (
    'd6000000-0000-0000-0000-000000000001',
    'd5000000-0000-0000-0000-000000000001',
    'owner',
    'active'
  ),
  (
    'd6000000-0000-0000-0000-000000000001',
    'd5000000-0000-0000-0000-000000000002',
    'member',
    'disabled'
  );

insert into public.public_link_variants (business_id, slug, display_name, is_active)
values (
  'd6000000-0000-0000-0000-000000000001',
  'access-test-cleaning',
  'Access Test Cleaning',
  true
);

insert into public.admin_action_log (
  business_id, actor_user_id, action_type, previous_values, new_values, note
)
values (
  'd6000000-0000-0000-0000-000000000001',
  'd5000000-0000-0000-0000-000000000001',
  'plan_changed',
  '{"plan_slug":"founder_pilot"}',
  '{"plan_slug":"pro"}',
  'test log'
);

set local role authenticated;
select set_config('request.jwt.claim.sub', 'd5000000-0000-0000-0000-000000000001', true);
select set_config('request.jwt.claim.role', 'authenticated', true);

do $$
begin
  if not public.is_business_member('d6000000-0000-0000-0000-000000000001') then
    raise exception 'T1 FAIL: active owner should be a business member.';
  end if;

  if not public.has_active_public_link('d6000000-0000-0000-0000-000000000001') then
    raise exception 'T1 FAIL: active business should have active public link.';
  end if;

  begin
    perform count(*) from public.admin_action_log;
    raise exception 'T1 FAIL: authenticated users must not read admin_action_log.';
  exception
    when insufficient_privilege then
      null;
  end;
end;
$$;

select set_config('request.jwt.claim.sub', 'd5000000-0000-0000-0000-000000000002', true);

do $$
begin
  if public.is_business_member('d6000000-0000-0000-0000-000000000001') then
    raise exception 'T2 FAIL: disabled member should not be treated as active member.';
  end if;

  if (select count(*) from public.businesses) <> 0 then
    raise exception 'T2 FAIL: disabled member should not read business data.';
  end if;
end;
$$;

reset role;

update public.businesses
set status = 'suspended'
where id = 'd6000000-0000-0000-0000-000000000001';

set local role authenticated;
select set_config('request.jwt.claim.sub', 'd5000000-0000-0000-0000-000000000001', true);
select set_config('request.jwt.claim.role', 'authenticated', true);

do $$
begin
  if public.is_business_member('d6000000-0000-0000-0000-000000000001') then
    raise exception 'T3 FAIL: suspended business should block member helper.';
  end if;

  if public.has_active_public_link('d6000000-0000-0000-0000-000000000001') then
    raise exception 'T3 FAIL: suspended business should block public quote link helper.';
  end if;

  if (select count(*) from public.businesses) <> 0 then
    raise exception 'T3 FAIL: suspended business should not be visible to owner dashboard RLS.';
  end if;
end;
$$;

reset role;

update public.businesses
set status = 'active',
    plan_slug = 'paused'
where id = 'd6000000-0000-0000-0000-000000000001';

set local role authenticated;
select set_config('request.jwt.claim.sub', 'd5000000-0000-0000-0000-000000000001', true);
select set_config('request.jwt.claim.role', 'authenticated', true);

do $$
begin
  if not public.is_business_member('d6000000-0000-0000-0000-000000000001') then
    raise exception 'T4 FAIL: paused plan should retain authenticated member dashboard access for safe/limited account handling.';
  end if;

  if public.has_active_public_link('d6000000-0000-0000-0000-000000000001') then
    raise exception 'T4 FAIL: paused plan should block active public quote helper even if a link row remains active.';
  end if;
end;
$$;

reset role;

update public.businesses
set status = 'cancelled',
    plan_slug = 'founder_pilot'
where id = 'd6000000-0000-0000-0000-000000000001';

set local role authenticated;
select set_config('request.jwt.claim.sub', 'd5000000-0000-0000-0000-000000000001', true);
select set_config('request.jwt.claim.role', 'authenticated', true);

do $$
begin
  if public.is_business_member('d6000000-0000-0000-0000-000000000001') then
    raise exception 'T5 FAIL: cancelled business should block member helper.';
  end if;

  if public.has_active_public_link('d6000000-0000-0000-0000-000000000001') then
    raise exception 'T5 FAIL: cancelled business should block public quote link helper.';
  end if;

  if (select count(*) from public.businesses) <> 0 then
    raise exception 'T5 FAIL: cancelled business should not be visible to owner dashboard RLS.';
  end if;
end;
$$;

rollback;
