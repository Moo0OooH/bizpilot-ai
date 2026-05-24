/*
============================================================
File: tests/rls/business-lifecycle-deletion-foundation.test.sql
Project: BizPilot AI
Description: RLS tests for workspace lifecycle and deletion request foundations.
Role: Verifies owner-only production deletion requests and service-role-only tombstones.
Related:
- supabase/migrations/0018_business_lifecycle_deletion_foundation.sql
Author: MoOoH
Created: 2026-05-24
Last Updated: 2026-05-24
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
    'e1000000-0000-0000-0000-000000000001',
    'authenticated', 'authenticated', 'lifecycle-owner-a', 'pw',
    now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    'e1000000-0000-0000-0000-000000000002',
    'authenticated', 'authenticated', 'lifecycle-owner-b', 'pw',
    now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    'e1000000-0000-0000-0000-000000000003',
    'authenticated', 'authenticated', 'lifecycle-admin', 'pw',
    now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    'e1000000-0000-0000-0000-000000000004',
    'authenticated', 'authenticated', 'lifecycle-member', 'pw',
    now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    'e1000000-0000-0000-0000-000000000005',
    'authenticated', 'authenticated', 'lifecycle-disabled-owner', 'pw',
    now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    'e1000000-0000-0000-0000-000000000006',
    'authenticated', 'authenticated', 'lifecycle-outsider', 'pw',
    now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()
  );

insert into public.businesses (
  id, name, slug, owner_user_id, status, workspace_kind, lifecycle_status
)
values
  (
    'e2000000-0000-0000-0000-000000000001',
    'Lifecycle Owner A Cleaning',
    'lifecycle-owner-a-cleaning',
    'e1000000-0000-0000-0000-000000000001',
    'active',
    'production_customer',
    'active'
  ),
  (
    'e2000000-0000-0000-0000-000000000002',
    'Lifecycle Owner B Cleaning',
    'lifecycle-owner-b-cleaning',
    'e1000000-0000-0000-0000-000000000002',
    'active',
    'production_customer',
    'active'
  ),
  (
    'e2000000-0000-0000-0000-000000000003',
    'Lifecycle Disabled Owner Cleaning',
    'lifecycle-disabled-owner-cleaning',
    'e1000000-0000-0000-0000-000000000005',
    'active',
    'production_customer',
    'active'
  ),
  (
    'e2000000-0000-0000-0000-000000000004',
    'Lifecycle Deleting Cleaning',
    'lifecycle-deleting-cleaning',
    'e1000000-0000-0000-0000-000000000001',
    'active',
    'production_customer',
    'deleting'
  ),
  (
    'e2000000-0000-0000-0000-000000000005',
    'Lifecycle Suspended Cleaning',
    'lifecycle-suspended-cleaning',
    'e1000000-0000-0000-0000-000000000001',
    'suspended',
    'production_customer',
    'active'
  ),
  (
    'e2000000-0000-0000-0000-000000000006',
    'Lifecycle Archived Cleaning',
    'lifecycle-archived-cleaning',
    'e1000000-0000-0000-0000-000000000001',
    'active',
    'production_customer',
    'archived'
  );

insert into public.business_members (business_id, user_id, role, status)
values
  (
    'e2000000-0000-0000-0000-000000000001',
    'e1000000-0000-0000-0000-000000000001',
    'owner',
    'active'
  ),
  (
    'e2000000-0000-0000-0000-000000000001',
    'e1000000-0000-0000-0000-000000000003',
    'admin',
    'active'
  ),
  (
    'e2000000-0000-0000-0000-000000000001',
    'e1000000-0000-0000-0000-000000000004',
    'member',
    'active'
  ),
  (
    'e2000000-0000-0000-0000-000000000002',
    'e1000000-0000-0000-0000-000000000002',
    'owner',
    'active'
  ),
  (
    'e2000000-0000-0000-0000-000000000003',
    'e1000000-0000-0000-0000-000000000005',
    'owner',
    'disabled'
  ),
  (
    'e2000000-0000-0000-0000-000000000004',
    'e1000000-0000-0000-0000-000000000001',
    'owner',
    'active'
  ),
  (
    'e2000000-0000-0000-0000-000000000005',
    'e1000000-0000-0000-0000-000000000001',
    'owner',
    'active'
  ),
  (
    'e2000000-0000-0000-0000-000000000006',
    'e1000000-0000-0000-0000-000000000001',
    'owner',
    'active'
  );

insert into public.public_link_variants (
  business_id, slug, display_name, is_active
)
values
  (
    'e2000000-0000-0000-0000-000000000001',
    'lifecycle-owner-a-cleaning',
    'Lifecycle Owner A Cleaning',
    true
  ),
  (
    'e2000000-0000-0000-0000-000000000004',
    'lifecycle-deleting-cleaning',
    'Lifecycle Deleting Cleaning',
    true
  );

set local role authenticated;
select set_config('request.jwt.claim.sub', 'e1000000-0000-0000-0000-000000000001', true);
select set_config('request.jwt.claim.role', 'authenticated', true);

insert into public.business_deletion_requests (
  business_id,
  requested_by_user_id,
  reason_code
)
values (
  'e2000000-0000-0000-0000-000000000001',
  'e1000000-0000-0000-0000-000000000001',
  'no_longer_needed'
);

do $$
declare
  own_visible integer;
  other_visible integer;
  blocked boolean := false;
begin
  select count(*) into own_visible
  from public.business_deletion_requests
  where business_id = 'e2000000-0000-0000-0000-000000000001';

  if own_visible <> 1 then
    raise exception 'T1 FAIL: owner should select own deletion request, found %.', own_visible;
  end if;

  select count(*) into other_visible
  from public.business_deletion_requests
  where business_id = 'e2000000-0000-0000-0000-000000000002';

  if other_visible <> 0 then
    raise exception 'T1 FAIL: owner must not select another business request, found %.', other_visible;
  end if;

  begin
    insert into public.business_deletion_requests (
      business_id,
      requested_by_user_id,
      reason_code
    )
    values (
      'e2000000-0000-0000-0000-000000000001',
      'e1000000-0000-0000-0000-000000000001',
      'other'
    );
  exception when unique_violation then
    blocked := true;
  end;

  if not blocked then
    raise exception 'T1 FAIL: unique active request per business must block duplicate pending requests.';
  end if;
end;
$$;

reset role;
update public.businesses
   set lifecycle_status = 'deletion_requested',
       deletion_requested_at = now()
 where id = 'e2000000-0000-0000-0000-000000000001';

set local role authenticated;
select set_config('request.jwt.claim.sub', 'e1000000-0000-0000-0000-000000000001', true);
select set_config('request.jwt.claim.role', 'authenticated', true);

do $$
declare
  own_visible integer;
begin
  select count(*) into own_visible
  from public.business_deletion_requests
  where business_id = 'e2000000-0000-0000-0000-000000000001';

  if own_visible <> 1 then
    raise exception 'T1B FAIL: owner should still select own deletion request after workspace is locked, found %.', own_visible;
  end if;
end;
$$;

do $$
declare
  blocked boolean := false;
begin
  begin
    update public.business_deletion_requests
       set status = 'cancelled'
     where business_id = 'e2000000-0000-0000-0000-000000000001';
  exception when others then
    blocked := true;
  end;

  if not blocked and exists (
    select 1
    from public.business_deletion_requests
    where business_id = 'e2000000-0000-0000-0000-000000000001'
      and status = 'cancelled'
  ) then
    raise exception 'T2 FAIL: authenticated owner must not update deletion requests in this pass.';
  end if;
end;
$$;

do $$
declare
  before_count integer;
  after_count integer;
begin
  select count(*) into before_count
  from public.business_deletion_requests
  where business_id = 'e2000000-0000-0000-0000-000000000001';

  begin
    delete from public.business_deletion_requests
    where business_id = 'e2000000-0000-0000-0000-000000000001';
  exception when others then
    null;
  end;

  select count(*) into after_count
  from public.business_deletion_requests
  where business_id = 'e2000000-0000-0000-0000-000000000001';

  if before_count <> after_count then
    raise exception 'T3 FAIL: authenticated owner must not delete deletion requests.';
  end if;
end;
$$;

do $$
declare
  blocked boolean := false;
begin
  begin
    insert into public.business_deletion_tombstones (
      business_id,
      workspace_kind,
      deletion_mode,
      completed_by_actor_type
    )
    values (
      'e2000000-0000-0000-0000-000000000001',
      'production_customer',
      'production_anonymization',
      'owner'
    );
  exception when others then
    blocked := true;
  end;

  if not blocked then
    raise exception 'T4 FAIL: normal authenticated user must not insert tombstones.';
  end if;
end;
$$;

do $$
declare
  blocked boolean := false;
begin
  begin
    insert into public.business_deletion_requests (
      business_id,
      requested_by_user_id
    )
    values (
      'e2000000-0000-0000-0000-000000000004',
      'e1000000-0000-0000-0000-000000000001'
    );
  exception when others then
    blocked := true;
  end;

  if not blocked then
    raise exception 'T5 FAIL: owner must not request deletion when lifecycle_status is deleting.';
  end if;

  if public.has_active_public_link('e2000000-0000-0000-0000-000000000004') then
    raise exception 'T5 FAIL: deleting workspace must not keep an active public quote path.';
  end if;
end;
$$;

do $$
declare
  suspended_blocked boolean := false;
  archived_blocked boolean := false;
begin
  begin
    insert into public.business_deletion_requests (
      business_id,
      requested_by_user_id
    )
    values (
      'e2000000-0000-0000-0000-000000000005',
      'e1000000-0000-0000-0000-000000000001'
    );
  exception when others then
    suspended_blocked := true;
  end;

  begin
    insert into public.business_deletion_requests (
      business_id,
      requested_by_user_id
    )
    values (
      'e2000000-0000-0000-0000-000000000006',
      'e1000000-0000-0000-0000-000000000001'
    );
  exception when others then
    archived_blocked := true;
  end;

  if not suspended_blocked then
    raise exception 'T5B FAIL: owner must not create deletion request through RLS for suspended business.';
  end if;

  if not archived_blocked then
    raise exception 'T5B FAIL: owner must not create deletion request through RLS for archived workspace.';
  end if;
end;
$$;

select set_config('request.jwt.claim.sub', 'e1000000-0000-0000-0000-000000000003', true);

do $$
declare
  blocked boolean := false;
begin
  begin
    insert into public.business_deletion_requests (
      business_id,
      requested_by_user_id
    )
    values (
      'e2000000-0000-0000-0000-000000000001',
      'e1000000-0000-0000-0000-000000000003'
    );
  exception when others then
    blocked := true;
  end;

  if not blocked then
    raise exception 'T6 FAIL: admin member must not create owner-only production deletion request.';
  end if;
end;
$$;

select set_config('request.jwt.claim.sub', 'e1000000-0000-0000-0000-000000000004', true);

do $$
declare
  blocked boolean := false;
begin
  begin
    insert into public.business_deletion_requests (
      business_id,
      requested_by_user_id
    )
    values (
      'e2000000-0000-0000-0000-000000000001',
      'e1000000-0000-0000-0000-000000000004'
    );
  exception when others then
    blocked := true;
  end;

  if not blocked then
    raise exception 'T7 FAIL: regular member must not create production deletion request.';
  end if;
end;
$$;

select set_config('request.jwt.claim.sub', 'e1000000-0000-0000-0000-000000000005', true);

do $$
declare
  blocked boolean := false;
begin
  begin
    insert into public.business_deletion_requests (
      business_id,
      requested_by_user_id
    )
    values (
      'e2000000-0000-0000-0000-000000000003',
      'e1000000-0000-0000-0000-000000000005'
    );
  exception when others then
    blocked := true;
  end;

  if not blocked then
    raise exception 'T8 FAIL: disabled owner membership must not create production deletion request.';
  end if;
end;
$$;

select set_config('request.jwt.claim.sub', 'e1000000-0000-0000-0000-000000000006', true);

do $$
declare
  blocked boolean := false;
begin
  begin
    insert into public.business_deletion_requests (
      business_id,
      requested_by_user_id
    )
    values (
      'e2000000-0000-0000-0000-000000000001',
      'e1000000-0000-0000-0000-000000000006'
    );
  exception when others then
    blocked := true;
  end;

  if not blocked then
    raise exception 'T9 FAIL: non-member must not create production deletion request.';
  end if;
end;
$$;

select set_config('request.jwt.claim.sub', 'e1000000-0000-0000-0000-000000000002', true);

do $$
declare
  visible integer;
  blocked boolean := false;
begin
  select count(*) into visible
  from public.business_deletion_requests
  where business_id = 'e2000000-0000-0000-0000-000000000001';

  if visible <> 0 then
    raise exception 'T10 FAIL: other owner must not select another business deletion request.';
  end if;

  begin
    insert into public.business_deletion_requests (
      business_id,
      requested_by_user_id
    )
    values (
      'e2000000-0000-0000-0000-000000000001',
      'e1000000-0000-0000-0000-000000000002'
    );
  exception when others then
    blocked := true;
  end;

  if not blocked then
    raise exception 'T10 FAIL: owner cannot create request for another business.';
  end if;
end;
$$;

set local role anon;
select set_config('request.jwt.claim.sub', '', true);
select set_config('request.jwt.claim.role', 'anon', true);

do $$
declare
  blocked boolean := false;
begin
  begin
    insert into public.business_deletion_requests (
      business_id,
      requested_by_user_id
    )
    values (
      'e2000000-0000-0000-0000-000000000001',
      'e1000000-0000-0000-0000-000000000001'
    );
  exception when others then
    blocked := true;
  end;

  if not blocked then
    raise exception 'T11 FAIL: anon must not create deletion requests.';
  end if;
end;
$$;

do $$
declare
  blocked boolean := false;
begin
  begin
    perform count(*) from public.business_deletion_tombstones;
  exception when others then
    blocked := true;
  end;

  if not blocked then
    raise exception 'T12 FAIL: anon must not access tombstones.';
  end if;
end;
$$;

do $$
begin
  if has_function_privilege(
    'anon',
    'public.can_request_business_deletion(uuid)',
    'EXECUTE'
  ) then
    raise exception 'T13 FAIL: anon must not execute can_request_business_deletion.';
  end if;

  if has_function_privilege(
    'anon',
    'public.can_view_business_deletion_request(uuid)',
    'EXECUTE'
  ) then
    raise exception 'T13 FAIL: anon must not execute can_view_business_deletion_request.';
  end if;

  if has_function_privilege(
    'anon',
    'public.set_business_lifecycle_updated_at()',
    'EXECUTE'
  ) then
    raise exception 'T13 FAIL: anon must not execute set_business_lifecycle_updated_at.';
  end if;

  if not has_function_privilege(
    'authenticated',
    'public.can_request_business_deletion(uuid)',
    'EXECUTE'
  ) then
    raise exception 'T13 FAIL: authenticated must execute can_request_business_deletion.';
  end if;

  if not has_function_privilege(
    'authenticated',
    'public.can_view_business_deletion_request(uuid)',
    'EXECUTE'
  ) then
    raise exception 'T13 FAIL: authenticated must execute can_view_business_deletion_request.';
  end if;

  if has_function_privilege(
    'authenticated',
    'public.set_business_lifecycle_updated_at()',
    'EXECUTE'
  ) then
    raise exception 'T13 FAIL: authenticated must not execute set_business_lifecycle_updated_at.';
  end if;

  if not has_function_privilege(
    'service_role',
    'public.can_request_business_deletion(uuid)',
    'EXECUTE'
  ) then
    raise exception 'T13 FAIL: service_role must execute can_request_business_deletion.';
  end if;

  if not has_function_privilege(
    'service_role',
    'public.can_view_business_deletion_request(uuid)',
    'EXECUTE'
  ) then
    raise exception 'T13 FAIL: service_role must execute can_view_business_deletion_request.';
  end if;

  if not has_function_privilege(
    'service_role',
    'public.set_business_lifecycle_updated_at()',
    'EXECUTE'
  ) then
    raise exception 'T13 FAIL: service_role must execute set_business_lifecycle_updated_at.';
  end if;
end;
$$;

rollback;
