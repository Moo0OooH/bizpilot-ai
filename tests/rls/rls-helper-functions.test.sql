/*
============================================================
File: tests/rls/rls-helper-functions.test.sql
Project: BizPilot AI
Description: Phase 11 direct unit tests for the three internal RLS helper functions:
             is_business_member, can_manage_business, owns_business.
Role: Catches regressions in any helper before they cascade into every RLS policy.
Related:
- supabase/migrations/0001_auth_tenant_foundation.sql
- supabase/migrations/0010_explicit_data_api_grants.sql
- docs/security/BIZPILOT_SUPABASE_EXPLICIT_GRANTS_AUDIT_v1.0.md (Section 12 T10)
Author: MoOoH
Created: 2026-05-15
Last Updated: 2026-05-15
Change Log:
- 2026-05-15: Created Phase 11 RLS helper unit tests.
============================================================
*/

begin;

-- ============================================================
-- Fixtures: one business with owner, admin, member, and an unrelated user.
-- ============================================================

insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at
)
values
  ('00000000-0000-0000-0000-000000000000',
   'b3000000-0000-0000-0000-000000000001',
   'authenticated', 'authenticated', 'helper-owner@example.com', 'pw', now(),
   '{"provider":"email","providers":["email"]}',
   '{"display_name":"Helper Owner"}', now(), now()),
  ('00000000-0000-0000-0000-000000000000',
   'b3000000-0000-0000-0000-000000000002',
   'authenticated', 'authenticated', 'helper-admin@example.com', 'pw', now(),
   '{"provider":"email","providers":["email"]}',
   '{"display_name":"Helper Admin"}', now(), now()),
  ('00000000-0000-0000-0000-000000000000',
   'b3000000-0000-0000-0000-000000000003',
   'authenticated', 'authenticated', 'helper-member@example.com', 'pw', now(),
   '{"provider":"email","providers":["email"]}',
   '{"display_name":"Helper Member"}', now(), now()),
  ('00000000-0000-0000-0000-000000000000',
   'b3000000-0000-0000-0000-000000000004',
   'authenticated', 'authenticated', 'helper-outsider@example.com', 'pw', now(),
   '{"provider":"email","providers":["email"]}',
   '{"display_name":"Helper Outsider"}', now(), now());

insert into public.businesses (id, name, slug, owner_user_id)
values (
  'c3000000-0000-0000-0000-000000000001', 'Helper Co', 'helper-co',
  'b3000000-0000-0000-0000-000000000001'
);

insert into public.business_members (business_id, user_id, role)
values
  ('c3000000-0000-0000-0000-000000000001', 'b3000000-0000-0000-0000-000000000001', 'owner'),
  ('c3000000-0000-0000-0000-000000000001', 'b3000000-0000-0000-0000-000000000002', 'admin'),
  ('c3000000-0000-0000-0000-000000000001', 'b3000000-0000-0000-0000-000000000003', 'member');

-- ============================================================
-- T1: is_business_member returns true for the three members,
--     false for the outsider, false for an anonymous session.
-- ============================================================
set local role authenticated;

select set_config('request.jwt.claim.sub', 'b3000000-0000-0000-0000-000000000001', true);
select set_config('request.jwt.claim.role', 'authenticated', true);
do $$
begin
  if not public.is_business_member('c3000000-0000-0000-0000-000000000001') then
    raise exception 'T1.owner FAIL: is_business_member should be true for the owner.';
  end if;
end;
$$;

select set_config('request.jwt.claim.sub', 'b3000000-0000-0000-0000-000000000002', true);
do $$
begin
  if not public.is_business_member('c3000000-0000-0000-0000-000000000001') then
    raise exception 'T1.admin FAIL: is_business_member should be true for the admin.';
  end if;
end;
$$;

select set_config('request.jwt.claim.sub', 'b3000000-0000-0000-0000-000000000003', true);
do $$
begin
  if not public.is_business_member('c3000000-0000-0000-0000-000000000001') then
    raise exception 'T1.member FAIL: is_business_member should be true for the member.';
  end if;
end;
$$;

select set_config('request.jwt.claim.sub', 'b3000000-0000-0000-0000-000000000004', true);
do $$
begin
  if public.is_business_member('c3000000-0000-0000-0000-000000000001') then
    raise exception 'T1.outsider FAIL: is_business_member must be false for an outsider.';
  end if;
end;
$$;

set local role anon;
select set_config('request.jwt.claim.sub', '', true);
select set_config('request.jwt.claim.role', 'anon', true);
do $$
begin
  if public.is_business_member('c3000000-0000-0000-0000-000000000001') then
    raise exception 'T1.anon FAIL: is_business_member must be false for anon.';
  end if;
end;
$$;

-- ============================================================
-- T2: can_manage_business is true for owner and admin only.
-- ============================================================
set local role authenticated;

select set_config('request.jwt.claim.sub', 'b3000000-0000-0000-0000-000000000001', true);
do $$
begin
  if not public.can_manage_business('c3000000-0000-0000-0000-000000000001') then
    raise exception 'T2.owner FAIL: can_manage_business should be true for owner.';
  end if;
end;
$$;

select set_config('request.jwt.claim.sub', 'b3000000-0000-0000-0000-000000000002', true);
do $$
begin
  if not public.can_manage_business('c3000000-0000-0000-0000-000000000001') then
    raise exception 'T2.admin FAIL: can_manage_business should be true for admin.';
  end if;
end;
$$;

select set_config('request.jwt.claim.sub', 'b3000000-0000-0000-0000-000000000003', true);
do $$
begin
  if public.can_manage_business('c3000000-0000-0000-0000-000000000001') then
    raise exception 'T2.member FAIL: can_manage_business must be false for plain member.';
  end if;
end;
$$;

select set_config('request.jwt.claim.sub', 'b3000000-0000-0000-0000-000000000004', true);
do $$
begin
  if public.can_manage_business('c3000000-0000-0000-0000-000000000001') then
    raise exception 'T2.outsider FAIL: can_manage_business must be false for outsider.';
  end if;
end;
$$;

-- ============================================================
-- T3: owns_business matches businesses.owner_user_id exactly.
-- ============================================================
select set_config('request.jwt.claim.sub', 'b3000000-0000-0000-0000-000000000001', true);
do $$
begin
  if not public.owns_business('c3000000-0000-0000-0000-000000000001') then
    raise exception 'T3.owner FAIL: owns_business should be true for businesses.owner_user_id.';
  end if;
end;
$$;

select set_config('request.jwt.claim.sub', 'b3000000-0000-0000-0000-000000000002', true);
do $$
begin
  -- Admin is a member with elevated role but does not own the businesses row.
  if public.owns_business('c3000000-0000-0000-0000-000000000001') then
    raise exception 'T3.admin FAIL: owns_business must be false for admin who is not the businesses.owner_user_id.';
  end if;
end;
$$;

select set_config('request.jwt.claim.sub', 'b3000000-0000-0000-0000-000000000004', true);
do $$
begin
  if public.owns_business('c3000000-0000-0000-0000-000000000001') then
    raise exception 'T3.outsider FAIL: owns_business must be false for an outsider.';
  end if;
end;
$$;

-- ============================================================
-- T4: All three helpers return false for a non-existent business id.
-- ============================================================
select set_config('request.jwt.claim.sub', 'b3000000-0000-0000-0000-000000000001', true);
do $$
begin
  if public.is_business_member('00000000-0000-0000-0000-deadbeefdead') then
    raise exception 'T4 FAIL: is_business_member should be false for unknown business id.';
  end if;
  if public.can_manage_business('00000000-0000-0000-0000-deadbeefdead') then
    raise exception 'T4 FAIL: can_manage_business should be false for unknown business id.';
  end if;
  if public.owns_business('00000000-0000-0000-0000-deadbeefdead') then
    raise exception 'T4 FAIL: owns_business should be false for unknown business id.';
  end if;
end;
$$;

rollback;
