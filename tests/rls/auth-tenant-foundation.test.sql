/*
============================================================
File: tests/rls/auth-tenant-foundation.test.sql
Project: BizPilot AI
Description: Defines SQL checks for Phase 2 auth and tenant RLS behavior.
Role: Verifies own-profile access, member-only business access, and cross-tenant denial.
Related:
- supabase/migrations/0001_auth_tenant_foundation.sql
- docs/engineering/BIZPILOT_DATABASE_RLS_POLICY_BASELINE_v1.0.md
Author: MoOoH
Created: 2026-05-04
Last Updated: 2026-05-04
Change Log:
- 2026-05-04: Created Phase 2 RLS baseline tests.
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
    '10000000-0000-0000-0000-000000000001',
    'authenticated',
    'authenticated',
    'owner@example.com',
    'test-password',
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"display_name":"Owner User"}',
    now(),
    now()
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '10000000-0000-0000-0000-000000000002',
    'authenticated',
    'authenticated',
    'outsider@example.com',
    'test-password',
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"display_name":"Outside User"}',
    now(),
    now()
  );

set local role authenticated;
select set_config('request.jwt.claim.sub', '10000000-0000-0000-0000-000000000001', true);
select set_config('request.jwt.claim.role', 'authenticated', true);

do $$
begin
  if (select count(*) from public.profiles) <> 1 then
    raise exception 'Owner should only read their own profile.';
  end if;
end;
$$;

insert into public.businesses (id, name, slug, owner_user_id)
values (
  '20000000-0000-0000-0000-000000000001',
  'Owner Cleaning Co',
  'owner-cleaning-co',
  '10000000-0000-0000-0000-000000000001'
);

insert into public.business_members (business_id, user_id, role)
values (
  '20000000-0000-0000-0000-000000000001',
  '10000000-0000-0000-0000-000000000001',
  'owner'
);

do $$
begin
  if (select count(*) from public.businesses) <> 1 then
    raise exception 'Owner should read their own business after membership exists.';
  end if;

  if (select count(*) from public.business_members) <> 1 then
    raise exception 'Owner should read their own membership.';
  end if;
end;
$$;

select set_config('request.jwt.claim.sub', '10000000-0000-0000-0000-000000000002', true);

do $$
begin
  if (select count(*) from public.businesses) <> 0 then
    raise exception 'Outsider must not read another tenant business.';
  end if;

  if (select count(*) from public.business_members) <> 0 then
    raise exception 'Outsider must not read another tenant membership.';
  end if;
end;
$$;

set local role anon;
select set_config('request.jwt.claim.sub', '', true);
select set_config('request.jwt.claim.role', 'anon', true);

do $$
begin
  if (select count(*) from public.businesses) <> 0 then
    raise exception 'Anonymous users must not read private business data.';
  end if;

  if (select count(*) from public.profiles) <> 0 then
    raise exception 'Anonymous users must not read profiles.';
  end if;
end;
$$;

rollback;
