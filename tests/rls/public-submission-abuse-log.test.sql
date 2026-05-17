/*
File: tests/rls/public-submission-abuse-log.test.sql
Project: BizPilot AI
Phase 13 RLS tests for public_submission_abuse_log.
Verifies anon cannot read/write the table directly; the two helpers
(record_public_submission_attempt + count_recent_public_submission_attempts)
do work; authenticated members only see their own rows.
Last Updated: 2026-05-16
*/

begin;

-- Fixtures
insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at
)
values
  ('00000000-0000-0000-0000-000000000000',
   'b4000000-0000-0000-0000-00000000000a',
   'authenticated', 'authenticated', 'abuse-owner-a@example.com', 'pw', now(),
   '{"provider":"email","providers":["email"]}',
   '{"display_name":"Abuse Owner A"}', now(), now()),
  ('00000000-0000-0000-0000-000000000000',
   'b4000000-0000-0000-0000-00000000000b',
   'authenticated', 'authenticated', 'abuse-owner-b@example.com', 'pw', now(),
   '{"provider":"email","providers":["email"]}',
   '{"display_name":"Abuse Owner B"}', now(), now());

insert into public.businesses (id, name, slug, owner_user_id)
values
  ('c4000000-0000-0000-0000-00000000000a', 'Abuse A', 'abuse-a',
   'b4000000-0000-0000-0000-00000000000a'),
  ('c4000000-0000-0000-0000-00000000000b', 'Abuse B', 'abuse-b',
   'b4000000-0000-0000-0000-00000000000b');

insert into public.business_members (business_id, user_id, role)
values
  ('c4000000-0000-0000-0000-00000000000a', 'b4000000-0000-0000-0000-00000000000a', 'owner'),
  ('c4000000-0000-0000-0000-00000000000b', 'b4000000-0000-0000-0000-00000000000b', 'owner');

-- T1: anon CANNOT directly insert into the abuse log.
set local role anon;
select set_config('request.jwt.claim.sub', '', true);
select set_config('request.jwt.claim.role', 'anon', true);

do $$
declare
  blocked boolean := false;
begin
  begin
    insert into public.public_submission_abuse_log
      (business_id, ip_hash, reason)
    values
      ('c4000000-0000-0000-0000-00000000000a',
       'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
       'honeypot_triggered');
  exception when others then
    blocked := true;
  end;

  if not blocked then
    raise exception 'T1 FAIL: anon must not be able to INSERT directly into public_submission_abuse_log.';
  end if;
end;
$$;

-- T2: anon CAN log an attempt through the security-definer helper.
do $$
begin
  perform public.record_public_submission_attempt(
    'c4000000-0000-0000-0000-00000000000a',
    null,
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    'honeypot_triggered'
  );
exception when others then
  raise exception 'T2 FAIL: anon must be allowed to call helper. SQLSTATE=%, MESSAGE=%',
    sqlstate, sqlerrm;
end;
$$;

-- T3: the helper silently ignores unknown business ids.
-- Snapshot the count as superuser via a session variable, call as anon,
-- then re-check as superuser. Stays simple inside each DO block.
reset role;

do $$
declare
  c integer;
begin
  select count(*) into c from public.public_submission_abuse_log;
  perform set_config('bizpilot.abuse_t3_before', c::text, true);
end;
$$;

set local role anon;
select set_config('request.jwt.claim.role', 'anon', true);

do $$
begin
  begin
    perform public.record_public_submission_attempt(
      '00000000-0000-0000-0000-deadbeefdead',
      null,
      'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      'honeypot_triggered'
    );
  exception when others then
    raise exception 'T3 FAIL: helper must not raise on unknown business id. SQLSTATE=%, MESSAGE=%',
      sqlstate, sqlerrm;
  end;
end;
$$;

reset role;

do $$
declare
  before_total integer;
  after_total integer;
begin
  before_total := current_setting('bizpilot.abuse_t3_before')::integer;
  select count(*) into after_total from public.public_submission_abuse_log;
  if after_total <> before_total then
    raise exception 'T3 FAIL: helper must not insert when business id is unknown. before=% after=%',
      before_total, after_total;
  end if;
end;
$$;

-- T4: count_recent_public_submission_attempts returns the expected count for anon.
-- The fixture from T2 inserted exactly one row for business A.
set local role anon;
select set_config('request.jwt.claim.role', 'anon', true);

do $$
declare
  observed integer;
begin
  observed := public.count_recent_public_submission_attempts(
    'c4000000-0000-0000-0000-00000000000a',
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    60
  );
  if observed <> 1 then
    raise exception 'T4 FAIL: count_recent_public_submission_attempts should return 1, got %.',
      observed;
  end if;

  observed := public.count_recent_public_submission_attempts(
    'c4000000-0000-0000-0000-00000000000a',
    'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
    60
  );
  if observed <> 0 then
    raise exception 'T4 FAIL: count for a different ip_hash should be 0, got %.', observed;
  end if;
end;
$$;

-- T5: anon cannot SELECT from the abuse log directly.
do $$
declare
  visible integer;
begin
  select count(*) into visible from public.public_submission_abuse_log;
  if visible <> 0 then
    raise exception 'T5 FAIL: anon must not SELECT rows from public_submission_abuse_log, got %.',
      visible;
  end if;
end;
$$;

-- T6: authenticated owner A sees the log for their own business only.
reset role;

insert into public.public_submission_abuse_log
  (business_id, ip_hash, reason)
values
  ('c4000000-0000-0000-0000-00000000000b',
   'cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc',
   'submission_completed');

set local role authenticated;
select set_config('request.jwt.claim.sub', 'b4000000-0000-0000-0000-00000000000a', true);
select set_config('request.jwt.claim.role', 'authenticated', true);

do $$
declare
  own_visible integer;
  other_visible integer;
begin
  select count(*) into own_visible from public.public_submission_abuse_log
  where business_id = 'c4000000-0000-0000-0000-00000000000a';
  if own_visible <> 1 then
    raise exception 'T6 FAIL: owner A should see exactly 1 abuse_log row for own business, got %.',
      own_visible;
  end if;

  select count(*) into other_visible from public.public_submission_abuse_log
  where business_id = 'c4000000-0000-0000-0000-00000000000b';
  if other_visible <> 0 then
    raise exception 'T6 FAIL: owner A must not see business B abuse_log rows, got %.', other_visible;
  end if;
end;
$$;

rollback;
