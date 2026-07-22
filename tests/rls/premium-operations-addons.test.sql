/*
============================================================
File: tests/rls/premium-operations-addons.test.sql
Project: BizPilot AI
Description: Verifies RLS and cross-tenant integrity for Premium Operations add-on records.
Role: Proves that members may read their workspace records, only managers may mutate operational records, entitlement writes remain service-role only, and recipient references cannot cross tenant boundaries.
Related:
- supabase/migrations/0025_premium_operations_addons.sql
- supabase/migrations/0026_premium_operations_schedule_integrity.sql
- server/repositories/premium-operations.repository.ts
- docs/product/BIZPILOT_PREMIUM_OPERATIONS_ADDONS_v1.0.md
Author: MoOoH
Created: 2026-07-21
Last Updated: 2026-07-22
Change Log:
- 2026-07-21: Created tenant-isolation, manager-write, entitlement, and recipient-integrity RLS coverage for Premium Operations add-ons.
- 2026-07-21: Added paid-entitlement, review-transition, immutable-copy, and database-limit RLS coverage.
- 2026-07-22: Added exact-time provenance, earliest-opening, NULL-shape, helper-grant, historical-cancellation, and schedule-integrity regressions.
- 2026-07-22: Added direct exact-date deletion and submission/business cascade regressions.
- 2026-07-22: Corrected the cross-tenant recipient-update assertion block so the executable RLS suite reaches every Premium Operations regression.
- 2026-07-22: Corrected denial fixtures and authenticated tenant context exposed by the first full local execution of the Premium Operations suite.
============================================================
*/

begin;

-- ============================================================
-- Fixtures: one managed workspace, one read-only member, and a
-- separate workspace used solely to prove tenant isolation.
-- ============================================================

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
    'f2500000-0000-0000-0000-000000000001',
    'authenticated',
    'authenticated',
    'premium-owner-a@example.com',
    'test-password',
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"display_name":"Premium Owner A"}',
    now(),
    now()
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    'f2500000-0000-0000-0000-000000000002',
    'authenticated',
    'authenticated',
    'premium-member-a@example.com',
    'test-password',
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"display_name":"Premium Member A"}',
    now(),
    now()
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    'f2500000-0000-0000-0000-000000000003',
    'authenticated',
    'authenticated',
    'premium-owner-b@example.com',
    'test-password',
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"display_name":"Premium Owner B"}',
    now(),
    now()
  );

insert into public.businesses (id, name, slug, owner_user_id, status)
values
  (
    'f2600000-0000-0000-0000-000000000001',
    'Premium Operations A',
    'premium-operations-a',
    'f2500000-0000-0000-0000-000000000001',
    'active'
  ),
  (
    'f2600000-0000-0000-0000-000000000002',
    'Premium Operations B',
    'premium-operations-b',
    'f2500000-0000-0000-0000-000000000003',
    'active'
  );

insert into public.business_members (business_id, user_id, role, status)
values
  (
    'f2600000-0000-0000-0000-000000000001',
    'f2500000-0000-0000-0000-000000000001',
    'owner',
    'active'
  ),
  (
    'f2600000-0000-0000-0000-000000000001',
    'f2500000-0000-0000-0000-000000000002',
    'member',
    'active'
  ),
  (
    'f2600000-0000-0000-0000-000000000002',
    'f2500000-0000-0000-0000-000000000003',
    'owner',
    'active'
  );

insert into public.intake_forms (id, business_id, template_id, name)
values
  (
    'f2700000-0000-0000-0000-000000000001',
    'f2600000-0000-0000-0000-000000000001',
    (select id from public.industry_templates where slug = 'cleaning-smart-quote-v1'),
    'Premium Intake A'
  ),
  (
    'f2700000-0000-0000-0000-000000000002',
    'f2600000-0000-0000-0000-000000000002',
    (select id from public.industry_templates where slug = 'cleaning-smart-quote-v1'),
    'Premium Intake B'
  );

insert into public.consent_versions (id, business_id, version_label, consent_notice)
values
  (
    'f2800000-0000-0000-0000-000000000001',
    'f2600000-0000-0000-0000-000000000001',
    'v1',
    'Customer information is used for manually reviewed quote follow-up.'
  ),
  (
    'f2800000-0000-0000-0000-000000000002',
    'f2600000-0000-0000-0000-000000000002',
    'v1',
    'Customer information is used for manually reviewed quote follow-up.'
  );

insert into public.intake_submissions (
  id,
  business_id,
  intake_form_id,
  consent_version_id,
  privacy_mode,
  consent_accepted_at
)
values
  (
    'f2900000-0000-0000-0000-000000000001',
    'f2600000-0000-0000-0000-000000000001',
    'f2700000-0000-0000-0000-000000000001',
    'f2800000-0000-0000-0000-000000000001',
    'standard',
    now()
  ),
  (
    'f2900000-0000-0000-0000-000000000002',
    'f2600000-0000-0000-0000-000000000002',
    'f2700000-0000-0000-0000-000000000002',
    'f2800000-0000-0000-0000-000000000002',
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
values
  (
    'f2a00000-0000-0000-0000-000000000001',
    'f2600000-0000-0000-0000-000000000001',
    'f2900000-0000-0000-0000-000000000001',
    'Premium Customer A',
    'premium-a@example.com',
    'Deep clean',
    'Toronto'
  ),
  (
    'f2a00000-0000-0000-0000-000000000002',
    'f2600000-0000-0000-0000-000000000002',
    'f2900000-0000-0000-0000-000000000002',
    'Premium Customer B',
    'premium-b@example.com',
    'Move-out clean',
    'Laval'
  );

-- Entitlements are intentionally seeded outside the authenticated role because
-- their production writes are service-role/manual-admin only.
insert into public.business_addon_entitlements (business_id, addon_key, status)
values
  ('f2600000-0000-0000-0000-000000000001', 'availability_coordination', 'enabled'),
  ('f2600000-0000-0000-0000-000000000001', 'bulk_reply_review', 'enabled'),
  ('f2600000-0000-0000-0000-000000000001', 'priority_workbench', 'trial'),
  ('f2600000-0000-0000-0000-000000000002', 'priority_workbench', 'enabled');

-- Tenant B records are fixtures for cross-tenant read and reference checks.
insert into public.lead_priority_rules (
  id,
  business_id,
  name,
  priority_rank,
  service_terms,
  area_terms
)
values (
  'f2b00000-0000-0000-0000-000000000002',
  'f2600000-0000-0000-0000-000000000002',
  'Tenant B priority',
  1,
  array['move-out'],
  array['laval']
);

insert into public.service_time_blocks (
  id,
  business_id,
  lead_id,
  client_name,
  service_label,
  starts_at,
  ends_at,
  status
)
values (
  'f2c00000-0000-0000-0000-000000000002',
  'f2600000-0000-0000-0000-000000000002',
  'f2a00000-0000-0000-0000-000000000002',
  'Premium Customer B',
  'Move-out clean',
  statement_timestamp() + interval '20 days',
  statement_timestamp() + interval '20 days 2 hours',
  'reserved'
);

insert into public.bulk_reply_drafts (
  id,
  business_id,
  title,
  audience_summary,
  message_template
)
values (
  'f2d00000-0000-0000-0000-000000000002',
  'f2600000-0000-0000-0000-000000000002',
  'Tenant B review draft',
  '{"leadCount":1,"manualOnly":true}'::jsonb,
  'Hello {{name}}, this is a draft for your review.'
);

insert into public.bulk_reply_draft_recipients (
  id,
  business_id,
  draft_id,
  lead_id,
  rendered_message
)
values (
  'f2e00000-0000-0000-0000-000000000002',
  'f2600000-0000-0000-0000-000000000002',
  'f2d00000-0000-0000-0000-000000000002',
  'f2a00000-0000-0000-0000-000000000002',
  'Hello Premium Customer B, this is a draft for your review.'
);

-- ============================================================
-- T1: An owner/manager can create and update every mutable
-- Premium Operations table in their own active workspace.
-- ============================================================

set local role authenticated;
select set_config('request.jwt.claim.sub', 'f2500000-0000-0000-0000-000000000001', true);
select set_config('request.jwt.claim.role', 'authenticated', true);

insert into public.lead_priority_rules (
  id,
  business_id,
  name,
  priority_rank,
  service_terms,
  area_terms,
  created_by_user_id
)
values (
  'f2b00000-0000-0000-0000-000000000001',
  'f2600000-0000-0000-0000-000000000001',
  'Toronto deep-clean priority',
  1,
  array['deep clean'],
  array['toronto'],
  'f2500000-0000-0000-0000-000000000001'
);

insert into public.service_time_blocks (
  id,
  business_id,
  lead_id,
  client_name,
  service_label,
  starts_at,
  ends_at,
  status,
  created_by_user_id
)
values (
  'f2c00000-0000-0000-0000-000000000001',
  'f2600000-0000-0000-0000-000000000001',
  'f2a00000-0000-0000-0000-000000000001',
  'Premium Customer A',
  'Deep clean',
  (
    ((statement_timestamp() at time zone 'America/Toronto')::date + 14)
      + time '10:00'
  ) at time zone 'America/Toronto',
  (
    ((statement_timestamp() at time zone 'America/Toronto')::date + 14)
      + time '12:00'
  ) at time zone 'America/Toronto',
  'reserved',
  'f2500000-0000-0000-0000-000000000001'
);

insert into public.bulk_reply_drafts (
  id,
  business_id,
  title,
  audience_summary,
  message_template,
  created_by_user_id
)
values (
  'f2d00000-0000-0000-0000-000000000001',
  'f2600000-0000-0000-0000-000000000001',
  'Toronto availability review',
  '{"leadCount":1,"manualOnly":true}'::jsonb,
  'Hello {{name}}, please review the next available time.',
  'f2500000-0000-0000-0000-000000000001'
);

insert into public.bulk_reply_draft_recipients (
  id,
  business_id,
  draft_id,
  lead_id,
  rendered_message
)
values (
  'f2e00000-0000-0000-0000-000000000001',
  'f2600000-0000-0000-0000-000000000001',
  'f2d00000-0000-0000-0000-000000000001',
  'f2a00000-0000-0000-0000-000000000001',
  'Hello Premium Customer A, please review the next available time.'
);

update public.lead_priority_rules
set description = 'Manager-updated priority description.'
where id = 'f2b00000-0000-0000-0000-000000000001';

update public.service_time_blocks
set status = 'tentative'
where id = 'f2c00000-0000-0000-0000-000000000001';

update public.bulk_reply_drafts
set
  status = 'reviewed',
  reviewed_at = now()
where id = 'f2d00000-0000-0000-0000-000000000001';

update public.bulk_reply_draft_recipients
set copied_at = now()
where id = 'f2e00000-0000-0000-0000-000000000001';

do $$
begin
  if (select count(*) from public.business_addon_entitlements where business_id = 'f2600000-0000-0000-0000-000000000001') <> 3 then
    raise exception 'T1 FAIL: manager should read all own Premium Operations entitlements.';
  end if;

  if (select description from public.lead_priority_rules where id = 'f2b00000-0000-0000-0000-000000000001') <> 'Manager-updated priority description.' then
    raise exception 'T1 FAIL: manager should update an own priority rule.';
  end if;

  if (select status from public.service_time_blocks where id = 'f2c00000-0000-0000-0000-000000000001') <> 'tentative' then
    raise exception 'T1 FAIL: manager should update an own internal time block.';
  end if;

  if (select status from public.bulk_reply_drafts where id = 'f2d00000-0000-0000-0000-000000000001') <> 'reviewed' then
    raise exception 'T1 FAIL: manager should update an own review draft.';
  end if;

  if (
    select reviewed_by_user_id = 'f2500000-0000-0000-0000-000000000001'::uuid
    from public.bulk_reply_drafts
    where id = 'f2d00000-0000-0000-0000-000000000001'
  ) is not true then
    raise exception 'T1 FAIL: review transition must record the authenticated manager.';
  end if;

  if (select copied_at is not null from public.bulk_reply_draft_recipients where id = 'f2e00000-0000-0000-0000-000000000001') is not true then
    raise exception 'T1 FAIL: manager should record an own manual-copy event.';
  end if;

  if (
    select copied_by_user_id = 'f2500000-0000-0000-0000-000000000001'::uuid
    from public.bulk_reply_draft_recipients
    where id = 'f2e00000-0000-0000-0000-000000000001'
  ) is not true then
    raise exception 'T1 FAIL: copy transition must record the authenticated manager.';
  end if;
end;
$$;

-- Keep one own-workspace draft pending so the following cross-tenant
-- recipient check reaches the tenant boundary rather than failing only
-- because a reviewed draft cannot accept more recipients.
insert into public.bulk_reply_drafts (
  id,
  business_id,
  title,
  audience_summary,
  message_template
)
values (
  'f2d00000-0000-0000-0000-000000000004',
  'f2600000-0000-0000-0000-000000000001',
  'Pending tenant-bound recipient check',
  '{"leadCount":1,"manualOnly":true}'::jsonb,
  'Hello {{name}}, this recipient must remain in its workspace.'
);

-- ============================================================
-- T2: A manager cannot read another workspace's Premium
-- Operations records, including its paid-add-on entitlements.
-- ============================================================

do $$
begin
  if (select count(*) from public.business_addon_entitlements where business_id = 'f2600000-0000-0000-0000-000000000002') <> 0 then
    raise exception 'T2 FAIL: manager must not read another workspace entitlement.';
  end if;

  if (select count(*) from public.lead_priority_rules where id = 'f2b00000-0000-0000-0000-000000000002') <> 0 then
    raise exception 'T2 FAIL: manager must not read another workspace priority rule.';
  end if;

  if (select count(*) from public.service_time_blocks where id = 'f2c00000-0000-0000-0000-000000000002') <> 0 then
    raise exception 'T2 FAIL: manager must not read another workspace internal time block.';
  end if;

  if (select count(*) from public.bulk_reply_drafts where id = 'f2d00000-0000-0000-0000-000000000002') <> 0 then
    raise exception 'T2 FAIL: manager must not read another workspace review draft.';
  end if;

  if (select count(*) from public.bulk_reply_draft_recipients where id = 'f2e00000-0000-0000-0000-000000000002') <> 0 then
    raise exception 'T2 FAIL: manager must not read another workspace draft recipient.';
  end if;
end;
$$;

-- ============================================================
-- T3: A manager cannot point an internal block or draft recipient
-- in workspace A at a lead/draft from workspace B. Both the RLS
-- policies and composite recipient foreign keys protect this path.
-- ============================================================

do $$
declare
  recipient_insert_denied boolean := false;
  recipient_update_denied boolean := false;
begin
  begin
    insert into public.service_time_blocks (
      id,
      business_id,
      lead_id,
      client_name,
      service_label,
      starts_at,
      ends_at
    )
    values (
      'f2c00000-0000-0000-0000-000000000003',
      'f2600000-0000-0000-0000-000000000001',
      'f2a00000-0000-0000-0000-000000000002',
      'Wrong tenant lead',
      'Deep clean',
      statement_timestamp() + interval '21 days',
      statement_timestamp() + interval '21 days 1 hour'
    );

    raise exception 'T3 FAIL: manager must not create a time block pointing at another workspace lead.';
  exception
    when insufficient_privilege or foreign_key_violation then
      null;
  end;

  begin
    insert into public.bulk_reply_draft_recipients (
      id,
      business_id,
      draft_id,
      lead_id,
      rendered_message
    )
    values (
      'f2e00000-0000-0000-0000-000000000003',
      'f2600000-0000-0000-0000-000000000001',
      'f2d00000-0000-0000-0000-000000000004',
      'f2a00000-0000-0000-0000-000000000002',
      'This recipient belongs to another workspace.'
    );

  exception
    when insufficient_privilege or foreign_key_violation or raise_exception then
      recipient_insert_denied := true;
  end;

  if recipient_insert_denied is not true then
    raise exception 'T3 FAIL: manager must not create a recipient with another workspace lead.';
  end if;

  begin
    update public.bulk_reply_draft_recipients
    set
      draft_id = 'f2d00000-0000-0000-0000-000000000002',
      lead_id = 'f2a00000-0000-0000-0000-000000000002'
    where id = 'f2e00000-0000-0000-0000-000000000001';

  exception
    when insufficient_privilege or foreign_key_violation or raise_exception then
      recipient_update_denied := true;
  end;

  if recipient_update_denied is not true then
    raise exception 'T3 FAIL: manager must not retarget a recipient to another workspace draft or lead.';
  end if;
end;
$$;

-- ============================================================
-- T3b: A privileged/service path still cannot create a cross-tenant
-- service-time-block lead reference; the composite database FK is the
-- final integrity boundary after RLS is bypassed.
-- ============================================================

reset role;

do $$
declare
  denied boolean := false;
begin
  begin
    insert into public.service_time_blocks (
      id,
      business_id,
      lead_id,
      client_name,
      service_label,
      starts_at,
      ends_at
    )
    values (
      'f2c00000-0000-0000-0000-000000000004',
      'f2600000-0000-0000-0000-000000000001',
      'f2a00000-0000-0000-0000-000000000002',
      'Privileged wrong-tenant lead',
      'Deep clean',
      statement_timestamp() + interval '22 days',
      statement_timestamp() + interval '22 days 1 hour'
    );
  exception
    when foreign_key_violation then
      denied := true;
  end;

  if denied is not true then
    raise exception 'T3b FAIL: privileged writes must preserve service-time-block tenant integrity.';
  end if;
end;
$$;

set local role authenticated;
select set_config('request.jwt.claim.sub', 'f2500000-0000-0000-0000-000000000001', true);
select set_config('request.jwt.claim.role', 'authenticated', true);

-- ============================================================
-- T4: A plain member can read own workspace Premium Operations
-- data but cannot insert or update any mutable table. Entitlement
-- reads are allowed, while authenticated entitlement writes remain
-- service-role/manual-admin only.
-- ============================================================

select set_config('request.jwt.claim.sub', 'f2500000-0000-0000-0000-000000000002', true);
select set_config('request.jwt.claim.role', 'authenticated', true);

do $$
begin
  if (select count(*) from public.business_addon_entitlements where business_id = 'f2600000-0000-0000-0000-000000000001') <> 3 then
    raise exception 'T4 FAIL: plain members should read own workspace entitlements.';
  end if;

  if (select count(*) from public.lead_priority_rules where id = 'f2b00000-0000-0000-0000-000000000001') <> 1 then
    raise exception 'T4 FAIL: plain members should read own priority rules.';
  end if;

  if (select count(*) from public.service_time_blocks where id = 'f2c00000-0000-0000-0000-000000000001') <> 1 then
    raise exception 'T4 FAIL: plain members should read own internal time blocks.';
  end if;

  if (select count(*) from public.bulk_reply_drafts where id = 'f2d00000-0000-0000-0000-000000000001') <> 1 then
    raise exception 'T4 FAIL: plain members should read own review drafts.';
  end if;

  if (select count(*) from public.bulk_reply_draft_recipients where id = 'f2e00000-0000-0000-0000-000000000001') <> 1 then
    raise exception 'T4 FAIL: plain members should read own draft recipients.';
  end if;
end;
$$;

do $$
declare
  denied boolean;
begin
  denied := false;
  begin
    insert into public.lead_priority_rules (business_id, name, priority_rank)
    values ('f2600000-0000-0000-0000-000000000001', 'Member write attempt', 2);
  exception
    when insufficient_privilege or raise_exception then
      denied := true;
  end;

  if denied is not true then
    raise exception 'T4 FAIL: plain member must not insert a priority rule.';
  end if;

  denied := false;
  begin
    insert into public.service_time_blocks (
      business_id,
      client_name,
      service_label,
      starts_at,
      ends_at
    )
    values (
      'f2600000-0000-0000-0000-000000000001',
      'Member write attempt',
      'Deep clean',
      statement_timestamp() + interval '23 days',
      statement_timestamp() + interval '23 days 1 hour'
    );
  exception
    when insufficient_privilege or raise_exception then
      denied := true;
  end;

  if denied is not true then
    raise exception 'T4 FAIL: plain member must not insert an internal time block.';
  end if;

  denied := false;
  begin
    insert into public.bulk_reply_drafts (
      business_id,
      title,
      message_template
    )
    values (
      'f2600000-0000-0000-0000-000000000001',
      'Member write attempt',
      'This must stay a review-only draft.'
    );
  exception
    when insufficient_privilege or raise_exception then
      denied := true;
  end;

  if denied is not true then
    raise exception 'T4 FAIL: plain member must not insert a review draft.';
  end if;

  begin
    denied := false;
    insert into public.bulk_reply_draft_recipients (
      business_id,
      draft_id,
      lead_id,
      rendered_message
    )
    values (
      'f2600000-0000-0000-0000-000000000001',
      'f2d00000-0000-0000-0000-000000000001',
      'f2a00000-0000-0000-0000-000000000001',
      'This must remain unavailable to plain members.'
    );
  exception
    when insufficient_privilege or raise_exception then
      denied := true;
  end;

  if denied is not true then
    raise exception 'T4 FAIL: plain member must not insert a draft recipient.';
  end if;
end;
$$;

do $$
declare
  denied boolean;
begin
  begin
    update public.lead_priority_rules
    set priority_rank = 5
    where id = 'f2b00000-0000-0000-0000-000000000001';
    if found then
      raise exception 'T4 FAIL: plain member must not update a priority rule.';
    end if;
  exception
    when insufficient_privilege then
      null;
  end;

  begin
    update public.service_time_blocks
    set status = 'cancelled'
    where id = 'f2c00000-0000-0000-0000-000000000001';
    if found then
      raise exception 'T4 FAIL: plain member must not update an internal time block.';
    end if;
  exception
    when insufficient_privilege then
      null;
  end;

  begin
    denied := false;
    update public.bulk_reply_drafts
    set
      status = 'draft',
      reviewed_at = null
    where id = 'f2d00000-0000-0000-0000-000000000001';
    denied := not found;
  exception
    when insufficient_privilege or raise_exception then
      denied := true;
  end;

  if denied is not true then
    raise exception 'T4 FAIL: plain member must not update a review draft.';
  end if;

  begin
    denied := false;
    update public.bulk_reply_draft_recipients
    set copied_at = null
    where id = 'f2e00000-0000-0000-0000-000000000001';
    denied := not found;
  exception
    when insufficient_privilege or raise_exception then
      denied := true;
  end;

  if denied is not true then
    raise exception 'T4 FAIL: plain member must not update a draft recipient.';
  end if;
end;
$$;

do $$
begin
  begin
    insert into public.business_addon_entitlements (business_id, addon_key, status)
    values ('f2600000-0000-0000-0000-000000000001', 'priority_workbench', 'disabled');
    raise exception 'T4 FAIL: authenticated users must not insert entitlement records.';
  exception
    when insufficient_privilege then
      null;
  end;

  begin
    update public.business_addon_entitlements
    set status = 'disabled'
    where business_id = 'f2600000-0000-0000-0000-000000000001'
      and addon_key = 'priority_workbench';
    if found then
      raise exception 'T4 FAIL: authenticated users must not update entitlement records.';
    end if;
  exception
    when insufficient_privilege then
      null;
  end;

  if (
    select status
    from public.business_addon_entitlements
    where business_id = 'f2600000-0000-0000-0000-000000000001'
      and addon_key = 'priority_workbench'
  ) <> 'trial' then
    raise exception 'T4 FAIL: entitlement status must remain unchanged after authenticated write attempts.';
  end if;
end;
$$;

-- ============================================================
-- T5: A manager whose workspace did not buy an add-on cannot see
-- or mutate records that were seeded outside RLS. The one separately
-- entitled Priority Workbench remains available.
-- ============================================================

select set_config('request.jwt.claim.sub', 'f2500000-0000-0000-0000-000000000003', true);
select set_config('request.jwt.claim.role', 'authenticated', true);

do $$
begin
  if (select count(*) from public.lead_priority_rules where business_id = 'f2600000-0000-0000-0000-000000000002') <> 1 then
    raise exception 'T5 FAIL: independently entitled Priority Workbench must remain visible.';
  end if;

  if (select count(*) from public.service_time_blocks where business_id = 'f2600000-0000-0000-0000-000000000002') <> 0 then
    raise exception 'T5 FAIL: unavailable Availability Coordination data must be hidden.';
  end if;

  if (select count(*) from public.bulk_reply_drafts where business_id = 'f2600000-0000-0000-0000-000000000002') <> 0 then
    raise exception 'T5 FAIL: unavailable Bulk Reply Review data must be hidden.';
  end if;

  if (select count(*) from public.bulk_reply_draft_recipients where business_id = 'f2600000-0000-0000-0000-000000000002') <> 0 then
    raise exception 'T5 FAIL: unavailable draft recipients must be hidden.';
  end if;
end;
$$;

do $$
declare
  denied boolean;
begin
  denied := false;
  begin
    insert into public.service_time_blocks (
      business_id,
      client_name,
      service_label,
      starts_at,
      ends_at
    )
    values (
      'f2600000-0000-0000-0000-000000000002',
      'Unentitled availability attempt',
      'Move-out clean',
      statement_timestamp() + interval '24 days',
      statement_timestamp() + interval '24 days 1 hour'
    );
  exception
    when insufficient_privilege or raise_exception then
      denied := true;
  end;

  if denied is not true then
    raise exception 'T5 FAIL: unavailable Availability Coordination must deny writes.';
  end if;

  denied := false;
  begin
    insert into public.bulk_reply_drafts (
      business_id,
      title,
      message_template
    )
    values (
      'f2600000-0000-0000-0000-000000000002',
      'Unentitled bulk attempt',
      'This must remain unavailable until Bulk Reply Review is active.'
    );
  exception
    when insufficient_privilege or raise_exception then
      denied := true;
  end;

  if denied is not true then
    raise exception 'T5 FAIL: unavailable Bulk Reply Review must deny writes.';
  end if;
end;
$$;

-- ============================================================
-- T6: The review/manual-copy state machine is durable: direct API
-- writes cannot copy before review or mutate frozen approved content.
-- ============================================================

select set_config('request.jwt.claim.sub', 'f2500000-0000-0000-0000-000000000001', true);
select set_config('request.jwt.claim.role', 'authenticated', true);

insert into public.bulk_reply_drafts (
  id,
  business_id,
  title,
  audience_summary,
  message_template
)
values (
  'f2d00000-0000-0000-0000-000000000003',
  'f2600000-0000-0000-0000-000000000001',
  'Pending review integrity fixture',
  '{"leadCount":1,"manualOnly":true}'::jsonb,
  'This draft must be reviewed before a manual copy is recorded.'
);

insert into public.bulk_reply_draft_recipients (
  id,
  business_id,
  draft_id,
  lead_id,
  rendered_message
)
values (
  'f2e00000-0000-0000-0000-000000000003',
  'f2600000-0000-0000-0000-000000000001',
  'f2d00000-0000-0000-0000-000000000003',
  'f2a00000-0000-0000-0000-000000000001',
  'This message must not be marked copied before review.'
);

do $$
declare
  denied boolean;
begin
  denied := false;
  begin
    update public.bulk_reply_draft_recipients
    set copied_at = now()
    where id = 'f2e00000-0000-0000-0000-000000000003';
  exception
    when insufficient_privilege or raise_exception then
      denied := true;
  end;

  if denied is not true then
    raise exception 'T6 FAIL: manual copy must be denied before manager review.';
  end if;

  denied := false;
  begin
    insert into public.bulk_reply_drafts (
      business_id,
      title,
      message_template,
      status,
      reviewed_at,
      reviewed_by_user_id
    )
    values (
      'f2600000-0000-0000-0000-000000000001',
      'Forged review attempt',
      'A draft cannot enter as reviewed.',
      'reviewed',
      now(),
      'f2500000-0000-0000-0000-000000000001'
    );
  exception
    when raise_exception then
      denied := true;
  end;

  if denied is not true then
    raise exception 'T6 FAIL: a draft cannot be created as already reviewed.';
  end if;

  denied := false;
  begin
    insert into public.bulk_reply_draft_recipients (
      id,
      business_id,
      draft_id,
      lead_id,
      rendered_message,
      copied_at,
      copied_by_user_id
    )
    values (
      'f2e00000-0000-0000-0000-000000000005',
      'f2600000-0000-0000-0000-000000000001',
      'f2d00000-0000-0000-0000-000000000003',
      'f2a00000-0000-0000-0000-000000000001',
      'A recipient cannot be created as already copied.',
      now(),
      'f2500000-0000-0000-0000-000000000001'
    );
  exception
    when raise_exception then
      denied := true;
  end;

  if denied is not true then
    raise exception 'T6 FAIL: a recipient cannot be created as already copied.';
  end if;
end;
$$;

update public.bulk_reply_drafts
set
  status = 'reviewed',
  reviewed_at = now()
where id = 'f2d00000-0000-0000-0000-000000000003';

do $$
declare
  denied boolean;
begin
  denied := false;
  begin
    update public.bulk_reply_drafts
    set message_template = 'Mutated after approval.'
    where id = 'f2d00000-0000-0000-0000-000000000003';
  exception
    when raise_exception then
      denied := true;
  end;

  if denied is not true then
    raise exception 'T6 FAIL: reviewed draft content must be immutable.';
  end if;

  denied := false;
  begin
    update public.bulk_reply_draft_recipients
    set rendered_message = 'Mutated after review.'
    where id = 'f2e00000-0000-0000-0000-000000000003';
  exception
    when raise_exception then
      denied := true;
  end;

  if denied is not true then
    raise exception 'T6 FAIL: recipient content must be immutable.';
  end if;

  delete from public.bulk_reply_drafts
  where id = 'f2d00000-0000-0000-0000-000000000003';

  if found then
    raise exception 'T6 FAIL: a reviewed draft must retain its audit history.';
  end if;

  delete from public.bulk_reply_draft_recipients
  where id = 'f2e00000-0000-0000-0000-000000000003';

  if found then
    raise exception 'T6 FAIL: a reviewed recipient must retain its audit history.';
  end if;
end;
$$;

-- ============================================================
-- T7: Availability-only access remains a narrow one-conflict review path,
-- never a way to create an unentitled group reply.
-- ============================================================

reset role;
update public.business_addon_entitlements
set status = 'disabled'
where business_id = 'f2600000-0000-0000-0000-000000000001'
  and addon_key = 'bulk_reply_review';

insert into public.intake_form_fields (
  business_id,
  intake_form_id,
  template_field_id,
  field_key,
  label,
  field_type,
  is_required,
  is_hidden,
  sort_order
)
values (
  'f2600000-0000-0000-0000-000000000001',
  'f2700000-0000-0000-0000-000000000001',
  (
    select template_field.id
    from public.industry_template_fields template_field
    join public.industry_templates template
      on template.id = template_field.template_id
    where template.slug = 'cleaning-smart-quote-v1'
      and template_field.field_key = 'preferred_date'
  ),
  'preferred_date',
  'Preferred date',
  'date',
  false,
  false,
  70
)
on conflict (intake_form_id, field_key) do nothing;

insert into public.intake_submission_values (
  business_id,
  submission_id,
  field_key,
  field_label,
  field_value
)
values
  (
    'f2600000-0000-0000-0000-000000000001',
    'f2900000-0000-0000-0000-000000000001',
    'preferred_date',
    'Preferred date',
    to_jsonb(
      (
        (statement_timestamp() at time zone 'America/Toronto')::date + 14
      )::text
    )
  ),
  (
    'f2600000-0000-0000-0000-000000000001',
    'f2900000-0000-0000-0000-000000000001',
    'preferred_time',
    'Preferred exact time',
    to_jsonb('10:30'::text)
  );

-- The requested 10:30-11:30 interval conflicts with the 10:00-12:00 block.
-- Holding 12:00-13:00 makes 13:00-14:00 the derived earliest same-day opening.
insert into public.service_time_blocks (
  id,
  business_id,
  client_name,
  service_label,
  starts_at,
  ends_at
)
values (
  'f2c00000-0000-0000-0000-000000000008',
  'f2600000-0000-0000-0000-000000000001',
  'Adjacent boundary fixture',
  'Internal hold',
  (
    ((statement_timestamp() at time zone 'America/Toronto')::date + 14)
      + time '12:00'
  ) at time zone 'America/Toronto',
  (
    ((statement_timestamp() at time zone 'America/Toronto')::date + 14)
      + time '13:00'
  ) at time zone 'America/Toronto'
);

set local role authenticated;
select set_config('request.jwt.claim.sub', 'f2500000-0000-0000-0000-000000000001', true);
select set_config('request.jwt.claim.role', 'authenticated', true);

do $$
declare
  created_draft_id uuid;
  requested_date date :=
    (statement_timestamp() at time zone 'America/Toronto')::date + 14;
  requested_starts_at timestamptz;
  requested_ends_at timestamptz;
  denied boolean := false;
begin
  requested_starts_at :=
    (requested_date + time '10:30') at time zone 'America/Toronto';
  requested_ends_at :=
    (requested_date + time '11:30') at time zone 'America/Toronto';

  created_draft_id := public.create_availability_review_draft(
    'f2600000-0000-0000-0000-000000000001',
    'f2a00000-0000-0000-0000-000000000001',
    'Validated availability review',
    'This availability reply remains manual and requires review.',
    requested_starts_at,
    requested_ends_at,
    (requested_date + time '13:00') at time zone 'America/Toronto',
    (requested_date + time '14:00') at time zone 'America/Toronto',
    jsonb_build_array('f2c00000-0000-0000-0000-000000000001')
  );

  if not exists (
    select 1
    from public.bulk_reply_draft_recipients recipient
    where recipient.draft_id = created_draft_id
      and recipient.lead_id = 'f2a00000-0000-0000-0000-000000000001'
  ) then
    raise exception 'T7 FAIL: availability review creation must be atomic with its recipient.';
  end if;

  begin
    insert into public.bulk_reply_draft_recipients (
      id,
      business_id,
      draft_id,
      lead_id,
      rendered_message
    )
    values (
      'f2e00000-0000-0000-0000-000000000007',
      'f2600000-0000-0000-0000-000000000001',
      created_draft_id,
      'f2a00000-0000-0000-0000-000000000002',
      'An availability-only draft cannot target an arbitrary lead.'
    );
  exception
    when raise_exception or foreign_key_violation or insufficient_privilege then
      denied := true;
  end;

  if denied is not true then
    raise exception 'T7 FAIL: availability-only review must remain scoped to its validated lead.';
  end if;
end;
$$;

-- ============================================================
-- T7b: Availability suggestions stay exact, same-day, same-duration,
-- inside operating hours, and free at the instant the draft is created.
-- Active time blocks use half-open, serialized overlap semantics.
-- ============================================================

insert into public.service_time_blocks (
  id,
  business_id,
  client_name,
  service_label,
  starts_at,
  ends_at
)
values
  (
    'f2c00000-0000-0000-0000-000000000009',
    'f2600000-0000-0000-0000-000000000001',
    'Occupied suggestion fixture',
    'Internal hold',
    (
      ((statement_timestamp() at time zone 'America/Toronto')::date + 14)
        + time '15:00'
    ) at time zone 'America/Toronto',
    (
      ((statement_timestamp() at time zone 'America/Toronto')::date + 14)
        + time '16:00'
    ) at time zone 'America/Toronto'
  );

do $$
declare
  requested_date date :=
    (statement_timestamp() at time zone 'America/Toronto')::date + 14;
  requested_starts_at timestamptz;
  requested_ends_at timestamptz;
  denied boolean;
begin
  requested_starts_at :=
    (requested_date + time '10:30') at time zone 'America/Toronto';
  requested_ends_at :=
    (requested_date + time '11:30') at time zone 'America/Toronto';

  denied := false;
  begin
    perform public.create_availability_review_draft(
      'f2600000-0000-0000-0000-000000000001',
      'f2a00000-0000-0000-0000-000000000001',
      'One-sided suggestion denial',
      'This draft must not persist.',
      requested_starts_at,
      requested_ends_at,
      (requested_date + time '13:00') at time zone 'America/Toronto',
      null,
      jsonb_build_array('f2c00000-0000-0000-0000-000000000001')
    );
  exception
    when raise_exception then
      denied := true;
  end;
  if denied is not true then
    raise exception 'T7b FAIL: a one-sided suggestion must be denied.';
  end if;

  denied := false;
  begin
    perform public.create_availability_review_draft(
      'f2600000-0000-0000-0000-000000000001',
      'f2a00000-0000-0000-0000-000000000001',
      'Missing earliest suggestion denial',
      'This draft must not persist.',
      requested_starts_at,
      requested_ends_at,
      null,
      null,
      jsonb_build_array('f2c00000-0000-0000-0000-000000000001')
    );
  exception
    when raise_exception then
      denied := true;
  end;
  if denied is not true then
    raise exception 'T7b FAIL: an available earliest opening must be saved, not omitted.';
  end if;

  denied := false;
  begin
    perform public.create_availability_review_draft(
      'f2600000-0000-0000-0000-000000000001',
      'f2a00000-0000-0000-0000-000000000001',
      'Later opening denial',
      'This draft must not persist.',
      requested_starts_at,
      requested_ends_at,
      (requested_date + time '14:00') at time zone 'America/Toronto',
      (requested_date + time '15:00') at time zone 'America/Toronto',
      jsonb_build_array('f2c00000-0000-0000-0000-000000000001')
    );
  exception
    when raise_exception then
      denied := true;
  end;
  if denied is not true then
    raise exception 'T7b FAIL: a later free opening must not replace the derived earliest opening.';
  end if;

  denied := false;
  begin
    perform public.create_availability_review_draft(
      'f2600000-0000-0000-0000-000000000001',
      'f2a00000-0000-0000-0000-000000000001',
      'Wrong suggestion duration denial',
      'This draft must not persist.',
      requested_starts_at,
      requested_ends_at,
      (requested_date + time '13:00') at time zone 'America/Toronto',
      (requested_date + time '13:30') at time zone 'America/Toronto',
      jsonb_build_array('f2c00000-0000-0000-0000-000000000001')
    );
  exception
    when raise_exception then
      denied := true;
  end;
  if denied is not true then
    raise exception 'T7b FAIL: a wrong-duration suggestion must be denied.';
  end if;

  denied := false;
  begin
    perform public.create_availability_review_draft(
      'f2600000-0000-0000-0000-000000000001',
      'f2a00000-0000-0000-0000-000000000001',
      'Before-request suggestion denial',
      'This draft must not persist.',
      requested_starts_at,
      requested_ends_at,
      (requested_date + time '09:00') at time zone 'America/Toronto',
      (requested_date + time '10:00') at time zone 'America/Toronto',
      jsonb_build_array('f2c00000-0000-0000-0000-000000000001')
    );
  exception
    when raise_exception then
      denied := true;
  end;
  if denied is not true then
    raise exception 'T7b FAIL: a suggestion before the request must be denied.';
  end if;

  denied := false;
  begin
    perform public.create_availability_review_draft(
      'f2600000-0000-0000-0000-000000000001',
      'f2a00000-0000-0000-0000-000000000001',
      'Cross-day suggestion denial',
      'This draft must not persist.',
      requested_starts_at,
      requested_ends_at,
      ((requested_date + 1) + time '09:00') at time zone 'America/Toronto',
      ((requested_date + 1) + time '10:00') at time zone 'America/Toronto',
      jsonb_build_array('f2c00000-0000-0000-0000-000000000001')
    );
  exception
    when raise_exception then
      denied := true;
  end;
  if denied is not true then
    raise exception 'T7b FAIL: a cross-local-day suggestion must be denied.';
  end if;

  denied := false;
  begin
    perform public.create_availability_review_draft(
      'f2600000-0000-0000-0000-000000000001',
      'f2a00000-0000-0000-0000-000000000001',
      'Outside-hours suggestion denial',
      'This draft must not persist.',
      requested_starts_at,
      requested_ends_at,
      (requested_date + time '06:00') at time zone 'America/Toronto',
      (requested_date + time '07:00') at time zone 'America/Toronto',
      jsonb_build_array('f2c00000-0000-0000-0000-000000000001')
    );
  exception
    when raise_exception then
      denied := true;
  end;
  if denied is not true then
    raise exception 'T7b FAIL: an outside-hours suggestion must be denied.';
  end if;

  denied := false;
  begin
    perform public.create_availability_review_draft(
      'f2600000-0000-0000-0000-000000000001',
      'f2a00000-0000-0000-0000-000000000001',
      'Occupied suggestion denial',
      'This draft must not persist.',
      requested_starts_at,
      requested_ends_at,
      (requested_date + time '15:00') at time zone 'America/Toronto',
      (requested_date + time '16:00') at time zone 'America/Toronto',
      jsonb_build_array('f2c00000-0000-0000-0000-000000000001')
    );
  exception
    when raise_exception then
      denied := true;
  end;
  if denied is not true then
    raise exception 'T7b FAIL: an occupied suggestion must be denied at creation.';
  end if;

  denied := false;
  begin
    perform public.create_availability_review_draft(
      'f2600000-0000-0000-0000-000000000001',
      'f2a00000-0000-0000-0000-000000000001',
      'Wrong request duration denial',
      'This draft must not persist.',
      requested_starts_at,
      requested_starts_at + interval '90 minutes',
      null,
      null,
      jsonb_build_array('f2c00000-0000-0000-0000-000000000001')
    );
  exception
    when raise_exception then
      denied := true;
  end;
  if denied is not true then
    raise exception 'T7b FAIL: a noncanonical request duration must be denied.';
  end if;

  denied := false;
  begin
    insert into public.service_time_blocks (
      business_id,
      client_name,
      service_label,
      starts_at,
      ends_at
    )
    values (
      'f2600000-0000-0000-0000-000000000001',
      'Overlapping block denial',
      'Internal hold',
      (requested_date + time '10:45') at time zone 'America/Toronto',
      (requested_date + time '11:15') at time zone 'America/Toronto'
    );
  exception
    when raise_exception then
      denied := true;
  end;
  if denied is not true then
    raise exception 'T7b FAIL: overlapping active blocks must be denied.';
  end if;

  denied := false;
  begin
    insert into public.service_time_blocks (
      business_id,
      client_name,
      service_label,
      starts_at,
      ends_at
    )
    values (
      'f2600000-0000-0000-0000-000000000001',
      'Past-start block denial',
      'Internal hold',
      statement_timestamp() - interval '30 minutes',
      statement_timestamp() + interval '30 minutes'
    );
  exception
    when raise_exception then
      denied := true;
  end;
  if denied is not true then
    raise exception 'T7b FAIL: an active time block must start in the future.';
  end if;
end;
$$;

do $$
declare
  requested_date date :=
    (statement_timestamp() at time zone 'America/Toronto')::date + 14;
  valid_summary jsonb;
  metadata_key text;
begin
  valid_summary := jsonb_build_object(
    'conflictBlockIds', jsonb_build_array('f2c00000-0000-0000-0000-000000000001'),
    'leadCount', 1,
    'leadId', 'f2a00000-0000-0000-0000-000000000001',
    'manualOnly', true,
    'requestedEndsAt',
      (requested_date + time '11:30') at time zone 'America/Toronto',
    'requestedStartsAt',
      (requested_date + time '10:30') at time zone 'America/Toronto',
    'source', 'availability_conflict',
    'submissionId', 'f2900000-0000-0000-0000-000000000001',
    'suggestedEndsAt',
      (requested_date + time '14:00') at time zone 'America/Toronto',
    'suggestedStartsAt',
      (requested_date + time '13:00') at time zone 'America/Toronto',
    'timeZone', 'America/Toronto'
  );

  foreach metadata_key in array array[
    'source',
    'timeZone',
    'leadCount',
    'manualOnly',
    'conflictBlockIds'
  ] loop
    if public.premium_operations_availability_draft_is_current(
      'f2600000-0000-0000-0000-000000000001',
      valid_summary || jsonb_build_object(metadata_key, null)
    ) then
      raise exception 'T7b FAIL: NULL metadata key % must fail closed.', metadata_key;
    end if;

    if public.premium_operations_availability_draft_is_current(
      'f2600000-0000-0000-0000-000000000001',
      valid_summary - metadata_key
    ) then
      raise exception 'T7b FAIL: missing metadata key % must fail closed.', metadata_key;
    end if;
  end loop;
end;
$$;

reset role;
select set_config('request.jwt.claim.sub', '', true);
select set_config('request.jwt.claim.role', 'service_role', true);

insert into public.intake_submissions (
  id,
  business_id,
  intake_form_id,
  consent_version_id,
  privacy_mode,
  consent_accepted_at
)
values (
  'f2900000-0000-0000-0000-000000000006',
  'f2600000-0000-0000-0000-000000000001',
  'f2700000-0000-0000-0000-000000000001',
  'f2800000-0000-0000-0000-000000000001',
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
values (
  'f2600000-0000-0000-0000-000000000001',
  'f2900000-0000-0000-0000-000000000006',
  'preferred_date',
  'Preferred date',
  to_jsonb('2000-01-15'::text)
);

do $$
declare
  denied boolean := false;
begin
  begin
    insert into public.intake_submission_values (
      business_id,
      submission_id,
      field_key,
      field_label,
      field_value
    )
    values (
      'f2600000-0000-0000-0000-000000000001',
      'f2900000-0000-0000-0000-000000000006',
      'preferred_time',
      'Preferred exact time',
      to_jsonb('10:30'::text)
    );
  exception
    when raise_exception then
      denied := true;
  end;

  if denied is not true then
    raise exception 'T7b FAIL: an exact request whose start is not future must be denied.';
  end if;

  if exists (
    select 1
    from public.intake_submission_values
    where submission_id = 'f2900000-0000-0000-0000-000000000006'
      and field_key = 'preferred_time'
  ) then
    raise exception 'T7b FAIL: a rejected past exact time must not persist.';
  end if;
end;
$$;

-- ============================================================
-- T7c: Named windows never impersonate exact time, and a lead
-- repoint makes a previously valid snapshot stale until restored.
-- ============================================================

reset role;

insert into public.intake_form_fields (
  business_id,
  intake_form_id,
  template_field_id,
  field_key,
  label,
  field_type,
  is_required,
  is_hidden,
  options,
  sort_order
)
values (
  'f2600000-0000-0000-0000-000000000001',
  'f2700000-0000-0000-0000-000000000001',
  (
    select template_field.id
    from public.industry_template_fields template_field
    join public.industry_templates template
      on template.id = template_field.template_id
    where template.slug = 'cleaning-smart-quote-v1'
      and template_field.field_key = 'preferred_time_window'
  ),
  'preferred_time_window',
  'Preferred time window',
  'time_window',
  false,
  false,
  '["morning","afternoon","evening","flexible"]'::jsonb,
  80
)
on conflict (intake_form_id, field_key) do nothing;

insert into public.intake_submissions (
  id,
  business_id,
  intake_form_id,
  consent_version_id,
  privacy_mode,
  consent_accepted_at
)
values
  (
    'f2900000-0000-0000-0000-000000000003',
    'f2600000-0000-0000-0000-000000000001',
    'f2700000-0000-0000-0000-000000000001',
    'f2800000-0000-0000-0000-000000000001',
    'standard',
    now()
  ),
  (
    'f2900000-0000-0000-0000-000000000004',
    'f2600000-0000-0000-0000-000000000001',
    'f2700000-0000-0000-0000-000000000001',
    'f2800000-0000-0000-0000-000000000001',
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
    'f2600000-0000-0000-0000-000000000001',
    'f2900000-0000-0000-0000-000000000003',
    'preferred_date',
    'Preferred date',
    to_jsonb(
      (
        (statement_timestamp() at time zone 'America/Toronto')::date + 14
      )::text
    )
  ),
  (
    'f2600000-0000-0000-0000-000000000001',
    'f2900000-0000-0000-0000-000000000003',
    'preferred_time_window',
    'Preferred time window',
    to_jsonb('morning'::text)
  ),
  (
    'f2600000-0000-0000-0000-000000000001',
    'f2900000-0000-0000-0000-000000000004',
    'preferred_date',
    'Preferred date',
    to_jsonb(
      (
        (statement_timestamp() at time zone 'America/Toronto')::date + 15
      )::text
    )
  ),
  (
    'f2600000-0000-0000-0000-000000000001',
    'f2900000-0000-0000-0000-000000000004',
    'preferred_time',
    'Preferred exact time',
    to_jsonb('10:30'::text)
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
  'f2a00000-0000-0000-0000-000000000003',
  'f2600000-0000-0000-0000-000000000001',
  'f2900000-0000-0000-0000-000000000003',
  'Named Window Customer',
  'named-window@example.com',
  'Deep clean',
  'Toronto'
);

set local role authenticated;
select set_config('request.jwt.claim.sub', 'f2500000-0000-0000-0000-000000000001', true);
select set_config('request.jwt.claim.role', 'authenticated', true);

do $$
declare
  requested_date date :=
    (statement_timestamp() at time zone 'America/Toronto')::date + 14;
  denied boolean := false;
  current_summary jsonb;
begin
  begin
    perform public.create_availability_review_draft(
      'f2600000-0000-0000-0000-000000000001',
      'f2a00000-0000-0000-0000-000000000003',
      'Named-window denial',
      'A named window must never become an exact availability draft.',
      (requested_date + time '10:30') at time zone 'America/Toronto',
      (requested_date + time '11:30') at time zone 'America/Toronto',
      null,
      null,
      jsonb_build_array('f2c00000-0000-0000-0000-000000000001')
    );
  exception
    when raise_exception then
      denied := true;
  end;

  if denied is not true then
    raise exception 'T7c FAIL: named preferred_time_window must not qualify as exact time.';
  end if;

  select draft.audience_summary
    into current_summary
  from public.bulk_reply_drafts draft
  where draft.business_id = 'f2600000-0000-0000-0000-000000000001'
    and draft.audience_summary ->> 'source' = 'availability_conflict'
    and draft.audience_summary ->> 'leadId' = 'f2a00000-0000-0000-0000-000000000001'
  order by draft.created_at desc
  limit 1;

  if not public.premium_operations_availability_draft_is_current(
    'f2600000-0000-0000-0000-000000000001',
    current_summary
  ) then
    raise exception 'T7c FAIL: baseline availability snapshot should be current.';
  end if;
end;
$$;

reset role;
update public.leads
set intake_submission_id = 'f2900000-0000-0000-0000-000000000004'
where id = 'f2a00000-0000-0000-0000-000000000001';

set local role authenticated;
select set_config('request.jwt.claim.sub', 'f2500000-0000-0000-0000-000000000001', true);
select set_config('request.jwt.claim.role', 'authenticated', true);

do $$
declare
  stale_summary jsonb;
begin
  select draft.audience_summary
    into stale_summary
  from public.bulk_reply_drafts draft
  where draft.business_id = 'f2600000-0000-0000-0000-000000000001'
    and draft.audience_summary ->> 'source' = 'availability_conflict'
  order by draft.created_at desc
  limit 1;

  if public.premium_operations_availability_draft_is_current(
    'f2600000-0000-0000-0000-000000000001',
    stale_summary
  ) then
    raise exception 'T7c FAIL: repointing a lead must stale the persisted submissionId snapshot.';
  end if;
end;
$$;

reset role;
update public.leads
set intake_submission_id = 'f2900000-0000-0000-0000-000000000001'
where id = 'f2a00000-0000-0000-0000-000000000001';

set local role authenticated;
select set_config('request.jwt.claim.sub', 'f2500000-0000-0000-0000-000000000001', true);
select set_config('request.jwt.claim.role', 'authenticated', true);

do $$
declare
  restored_summary jsonb;
begin
  select draft.audience_summary
    into restored_summary
  from public.bulk_reply_drafts draft
  where draft.business_id = 'f2600000-0000-0000-0000-000000000001'
    and draft.audience_summary ->> 'source' = 'availability_conflict'
  order by draft.created_at desc
  limit 1;

  if not public.premium_operations_availability_draft_is_current(
    'f2600000-0000-0000-0000-000000000001',
    restored_summary
  ) then
    raise exception 'T7c FAIL: restoring the original exact submission should restore currentness.';
  end if;
end;
$$;

-- ============================================================
-- T7d: A custom field that reuses preferred_time never gains
-- canonical provenance, even when a matching value is persisted.
-- ============================================================

reset role;

insert into public.intake_form_fields (
  business_id,
  intake_form_id,
  template_field_id,
  field_key,
  label,
  field_type,
  is_required,
  is_hidden,
  sort_order
)
values
  (
    'f2600000-0000-0000-0000-000000000002',
    'f2700000-0000-0000-0000-000000000002',
    (
      select template_field.id
      from public.industry_template_fields template_field
      join public.industry_templates template
        on template.id = template_field.template_id
      where template.slug = 'cleaning-smart-quote-v1'
        and template_field.field_key = 'preferred_date'
    ),
    'preferred_date',
    'Preferred date',
    'date',
    false,
    false,
    70
  ),
  (
    'f2600000-0000-0000-0000-000000000002',
    'f2700000-0000-0000-0000-000000000002',
    null,
    'preferred_time',
    'Custom preferred time collision',
    'time',
    false,
    false,
    75
  )
on conflict (intake_form_id, field_key) do nothing;

insert into public.business_addon_entitlements (
  business_id,
  addon_key,
  status
)
values (
  'f2600000-0000-0000-0000-000000000002',
  'availability_coordination',
  'enabled'
);

insert into public.intake_submission_values (
  business_id,
  submission_id,
  field_key,
  field_label,
  field_value
)
values (
  'f2600000-0000-0000-0000-000000000002',
  'f2900000-0000-0000-0000-000000000002',
  'preferred_date',
  'Preferred date',
  to_jsonb(
    (
      (statement_timestamp() at time zone 'America/Toronto')::date + 20
    )::text
  )
);

do $$
declare
  denied boolean := false;
begin
  begin
    insert into public.intake_submission_values (
      business_id,
      submission_id,
      field_key,
      field_label,
      field_value
    )
    values (
      'f2600000-0000-0000-0000-000000000002',
      'f2900000-0000-0000-0000-000000000002',
      'preferred_time',
      'Custom preferred time collision',
      to_jsonb('10:30'::text)
    );
  exception
    when raise_exception then
      denied := true;
  end;

  if denied is not true then
    raise exception 'T7d FAIL: a custom preferred_time collision must be denied.';
  end if;
end;
$$;

alter table public.intake_submission_values
  disable trigger intake_submission_values_enforce_preferred_time_date_pair;

insert into public.intake_submission_values (
  business_id,
  submission_id,
  field_key,
  field_label,
  field_value
)
values (
  'f2600000-0000-0000-0000-000000000002',
  'f2900000-0000-0000-0000-000000000002',
  'preferred_time',
  'Custom preferred time collision',
  to_jsonb('10:30'::text)
);

alter table public.intake_submission_values
  enable trigger intake_submission_values_enforce_preferred_time_date_pair;

set local role authenticated;
select set_config('request.jwt.claim.sub', 'f2500000-0000-0000-0000-000000000003', true);
select set_config('request.jwt.claim.role', 'authenticated', true);

do $$
begin
  if public.public_can_insert_submission_value(
    'f2600000-0000-0000-0000-000000000002',
    'f2900000-0000-0000-0000-000000000002',
    'preferred_time'
  ) then
    raise exception 'T7d FAIL: public insert helper must reject a custom key collision.';
  end if;

  if exists (
    select 1
    from public.premium_operations_exact_request_window(
      'f2600000-0000-0000-0000-000000000002',
      'f2a00000-0000-0000-0000-000000000002'
    )
  ) then
    raise exception 'T7d FAIL: persisted custom key collisions must not produce an exact request.';
  end if;

  if exists (
    select 1
    from public.premium_operations_exact_request_window(
      'f2600000-0000-0000-0000-000000000001',
      'f2a00000-0000-0000-0000-000000000001'
    )
  ) then
    raise exception 'T7d FAIL: exact-time provenance must not cross tenant membership.';
  end if;
end;
$$;

reset role;

do $$
begin
  if public.premium_operations_local_time_is_unique(
    date '2027-03-14',
    time '02:30'
  ) then
    raise exception 'T7d FAIL: Toronto spring-forward gaps must be rejected.';
  end if;

  if public.premium_operations_local_time_is_unique(
    date '2027-11-07',
    time '01:30'
  ) then
    raise exception 'T7d FAIL: Toronto fall-back folds must be rejected.';
  end if;
end;
$$;

set local role authenticated;
select set_config('request.jwt.claim.sub', 'f2500000-0000-0000-0000-000000000003', true);
select set_config('request.jwt.claim.role', 'authenticated', true);

do $$
declare
  denied boolean := false;
begin
  begin
    perform public.create_availability_review_draft(
      'f2600000-0000-0000-0000-000000000002',
      'f2a00000-0000-0000-0000-000000000002',
      'Custom collision denial',
      'This draft must not persist.',
      statement_timestamp() + interval '20 days',
      statement_timestamp() + interval '20 days 1 hour',
      null,
      null,
      jsonb_build_array('f2c00000-0000-0000-0000-000000000002')
    );
  exception
    when raise_exception then
      denied := true;
  end;

  if denied is not true then
    raise exception 'T7d FAIL: a custom preferred_time collision must not create a draft.';
  end if;
end;
$$;

-- ============================================================
-- T7e: Expired legacy requests/blocks remain durable history but
-- can never be created, reviewed, or copied as current work.
-- ============================================================

reset role;
select set_config('request.jwt.claim.sub', '', true);
select set_config('request.jwt.claim.role', 'service_role', true);

insert into public.intake_submissions (
  id,
  business_id,
  intake_form_id,
  consent_version_id,
  privacy_mode,
  consent_accepted_at
)
values (
  'f2900000-0000-0000-0000-000000000005',
  'f2600000-0000-0000-0000-000000000001',
  'f2700000-0000-0000-0000-000000000001',
  'f2800000-0000-0000-0000-000000000001',
  'standard',
  now() - interval '30 days'
);

alter table public.intake_submission_values
  disable trigger intake_submission_values_enforce_preferred_time_date_pair;

insert into public.intake_submission_values (
  business_id,
  submission_id,
  field_key,
  field_label,
  field_value
)
values
  (
    'f2600000-0000-0000-0000-000000000001',
    'f2900000-0000-0000-0000-000000000005',
    'preferred_date',
    'Preferred date',
    to_jsonb(
      (
        (statement_timestamp() at time zone 'America/Toronto')::date - 2
      )::text
    )
  ),
  (
    'f2600000-0000-0000-0000-000000000001',
    'f2900000-0000-0000-0000-000000000005',
    'preferred_time',
    'Preferred exact time',
    to_jsonb('10:30'::text)
  );

alter table public.intake_submission_values
  enable trigger intake_submission_values_enforce_preferred_time_date_pair;

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
  'f2a00000-0000-0000-0000-000000000005',
  'f2600000-0000-0000-0000-000000000001',
  'f2900000-0000-0000-0000-000000000005',
  'Expired Legacy Customer',
  'expired-legacy@example.com',
  'Deep clean',
  'Toronto'
);

alter table public.service_time_blocks
  disable trigger service_time_blocks_enforce_no_overlap;

insert into public.service_time_blocks (
  id,
  business_id,
  lead_id,
  client_name,
  service_label,
  starts_at,
  ends_at,
  status
)
values (
  'f2c00000-0000-0000-0000-000000000010',
  'f2600000-0000-0000-0000-000000000001',
  'f2a00000-0000-0000-0000-000000000005',
  'Expired Legacy Customer',
  'Historical hold',
  (
    ((statement_timestamp() at time zone 'America/Toronto')::date - 2)
      + time '10:00'
  ) at time zone 'America/Toronto',
  (
    ((statement_timestamp() at time zone 'America/Toronto')::date - 2)
      + time '12:00'
  ) at time zone 'America/Toronto',
  'reserved'
);

alter table public.service_time_blocks
  enable trigger service_time_blocks_enforce_no_overlap;

alter table public.bulk_reply_drafts
  disable trigger bulk_reply_drafts_initialize_review_state;

insert into public.bulk_reply_drafts (
  id,
  business_id,
  title,
  audience_summary,
  message_template
)
values (
  'f2d00000-0000-0000-0000-000000000008',
  'f2600000-0000-0000-0000-000000000001',
  'Expired legacy availability draft',
  jsonb_build_object(
    'conflictBlockIds', jsonb_build_array('f2c00000-0000-0000-0000-000000000010'),
    'leadCount', 1,
    'leadId', 'f2a00000-0000-0000-0000-000000000005',
    'manualOnly', true,
    'requestedEndsAt', (
      ((statement_timestamp() at time zone 'America/Toronto')::date - 2)
        + time '11:30'
    ) at time zone 'America/Toronto',
    'requestedStartsAt', (
      ((statement_timestamp() at time zone 'America/Toronto')::date - 2)
        + time '10:30'
    ) at time zone 'America/Toronto',
    'source', 'availability_conflict',
    'submissionId', 'f2900000-0000-0000-0000-000000000005',
    'suggestedEndsAt', null,
    'suggestedStartsAt', null,
    'timeZone', 'America/Toronto'
  ),
  'Historical draft that must never become actionable.'
);

alter table public.bulk_reply_drafts
  enable trigger bulk_reply_drafts_initialize_review_state;

alter table public.bulk_reply_draft_recipients
  disable trigger bulk_reply_draft_recipients_enforce_availability_current;

insert into public.bulk_reply_draft_recipients (
  id,
  business_id,
  draft_id,
  lead_id,
  rendered_message
)
values (
  'f2e00000-0000-0000-0000-000000000008',
  'f2600000-0000-0000-0000-000000000001',
  'f2d00000-0000-0000-0000-000000000008',
  'f2a00000-0000-0000-0000-000000000005',
  'Historical draft that must never become actionable.'
);

alter table public.bulk_reply_draft_recipients
  enable trigger bulk_reply_draft_recipients_enforce_availability_current;

set local role authenticated;
select set_config('request.jwt.claim.sub', 'f2500000-0000-0000-0000-000000000001', true);
select set_config('request.jwt.claim.role', 'authenticated', true);

do $$
declare
  legacy_summary jsonb;
  denied boolean := false;
begin
  select audience_summary
    into legacy_summary
  from public.bulk_reply_drafts
  where id = 'f2d00000-0000-0000-0000-000000000008';

  if public.premium_operations_availability_draft_is_current(
    'f2600000-0000-0000-0000-000000000001',
    legacy_summary
  ) then
    raise exception 'T7e FAIL: an expired legacy block/request must not be current.';
  end if;

  begin
    update public.bulk_reply_drafts
    set status = 'reviewed'
    where id = 'f2d00000-0000-0000-0000-000000000008';
  exception
    when raise_exception then
      denied := true;
  end;

  if denied is not true then
    raise exception 'T7e FAIL: an expired legacy availability draft must not be reviewed.';
  end if;
end;
$$;

reset role;
alter table public.bulk_reply_drafts
  disable trigger bulk_reply_drafts_enforce_availability_current;
alter table public.bulk_reply_drafts
  disable trigger bulk_reply_drafts_enforce_review_transition;

update public.bulk_reply_drafts
set
  status = 'reviewed',
  reviewed_at = now() - interval '1 day',
  reviewed_by_user_id = 'f2500000-0000-0000-0000-000000000001'
where id = 'f2d00000-0000-0000-0000-000000000008';

alter table public.bulk_reply_drafts
  enable trigger bulk_reply_drafts_enforce_availability_current;
alter table public.bulk_reply_drafts
  enable trigger bulk_reply_drafts_enforce_review_transition;

set local role authenticated;
select set_config('request.jwt.claim.sub', 'f2500000-0000-0000-0000-000000000001', true);
select set_config('request.jwt.claim.role', 'authenticated', true);

do $$
declare
  denied boolean := false;
begin
  begin
    update public.bulk_reply_draft_recipients
    set copied_at = now()
    where id = 'f2e00000-0000-0000-0000-000000000008';
  exception
    when raise_exception then
      denied := true;
  end;

  if denied is not true then
    raise exception 'T7e FAIL: an expired legacy availability draft must not be copied.';
  end if;
end;
$$;

do $$
begin
  update public.service_time_blocks
  set status = 'cancelled'
  where id = 'f2c00000-0000-0000-0000-000000000010';

  if not found then
    raise exception 'T7e FAIL: a manager must be able to cancel a historical active block.';
  end if;

  if (
    select status
    from public.service_time_blocks
    where id = 'f2c00000-0000-0000-0000-000000000010'
  ) <> 'cancelled' then
    raise exception 'T7e FAIL: historical cancellation must persist.';
  end if;
end;
$$;

-- ============================================================
-- T7f: Atomic RPCs roll back parents on recipient failure, reject
-- duplicates/cross-tenant calls, and founder entitlement audit is
-- executable only through the service role.
-- ============================================================

reset role;
update public.business_addon_entitlements
set status = 'enabled'
where business_id = 'f2600000-0000-0000-0000-000000000001'
  and addon_key = 'bulk_reply_review';

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
  'f2a00000-0000-0000-0000-000000000006',
  'f2600000-0000-0000-0000-000000000001',
  'f2900000-0000-0000-0000-000000000006',
  'Currentness Regression Customer',
  'currentness-regression@example.com',
  'Standard clean',
  'Toronto'
);

set local role authenticated;
select set_config('request.jwt.claim.sub', 'f2500000-0000-0000-0000-000000000001', true);
select set_config('request.jwt.claim.role', 'authenticated', true);

do $$
declare
  denied boolean;
  terminal_review_draft_id uuid;
  terminal_copy_draft_id uuid;
  terminal_copy_recipient_id uuid;
  missing_copy_draft_id uuid;
  direct_delete_draft_id uuid;
  cascade_delete_draft_id uuid;
begin
  denied := false;
  begin
    perform public.create_premium_reply_draft(
      'f2600000-0000-0000-0000-000000000001',
      'Atomic cross-tenant rollback fixture',
      'A failed recipient must roll back the parent.',
      jsonb_build_object(
        'leadCount', 2,
        'manualOnly', true,
        'source', 'manual_batch'
      ),
      jsonb_build_array(
        jsonb_build_object(
          'leadId', 'f2a00000-0000-0000-0000-000000000001',
          'renderedMessage', 'Valid first recipient.'
        ),
        jsonb_build_object(
          'leadId', 'f2a00000-0000-0000-0000-000000000002',
          'renderedMessage', 'Cross-tenant second recipient.'
        )
      )
    );
  exception
    when raise_exception or insufficient_privilege or foreign_key_violation then
      denied := true;
  end;

  if denied is not true then
    raise exception 'T7f FAIL: a cross-tenant recipient must abort the atomic RPC.';
  end if;

  if exists (
    select 1
    from public.bulk_reply_drafts
    where title = 'Atomic cross-tenant rollback fixture'
  ) then
    raise exception 'T7f FAIL: recipient failure must not orphan a parent draft.';
  end if;

  denied := false;
  begin
    perform public.create_premium_reply_draft(
      'f2600000-0000-0000-0000-000000000001',
      'Atomic duplicate rollback fixture',
      'Duplicate leads must be rejected before inserts.',
      jsonb_build_object(
        'leadCount', 2,
        'manualOnly', true,
        'source', 'manual_batch'
      ),
      jsonb_build_array(
        jsonb_build_object(
          'leadId', 'f2a00000-0000-0000-0000-000000000001',
          'renderedMessage', 'First duplicate.'
        ),
        jsonb_build_object(
          'leadId', 'f2a00000-0000-0000-0000-000000000001',
          'renderedMessage', 'Second duplicate.'
        )
      )
    );
  exception
    when raise_exception then
      denied := true;
  end;

  if denied is not true then
    raise exception 'T7f FAIL: duplicate recipient lead IDs must be denied.';
  end if;

  if exists (
    select 1
    from public.bulk_reply_drafts
    where title = 'Atomic duplicate rollback fixture'
  ) then
    raise exception 'T7f FAIL: duplicate validation must not orphan a parent draft.';
  end if;

  denied := false;
  begin
    perform public.create_availability_review_draft(
      'f2600000-0000-0000-0000-000000000002',
      'f2a00000-0000-0000-0000-000000000002',
      'Cross-tenant availability denial',
      'This draft must not persist.',
      statement_timestamp() + interval '20 days',
      statement_timestamp() + interval '20 days 1 hour',
      null,
      null,
      jsonb_build_array('f2c00000-0000-0000-0000-000000000002')
    );
  exception
    when raise_exception or insufficient_privilege then
      denied := true;
  end;

  if denied is not true then
    raise exception 'T7f FAIL: an owner must not invoke availability creation for another tenant.';
  end if;

  terminal_review_draft_id := public.create_premium_reply_draft(
    'f2600000-0000-0000-0000-000000000001',
    'Terminal lead review denial fixture',
    'A terminal lead must stale this pending draft.',
    jsonb_build_object(
      'leadCount', 1,
      'manualOnly', true,
      'source', 'manual_batch'
    ),
    jsonb_build_array(
      jsonb_build_object(
        'leadId', 'f2a00000-0000-0000-0000-000000000006',
        'renderedMessage', 'Terminal review regression recipient.'
      )
    )
  );

  update public.leads
  set status = 'booked'
  where id = 'f2a00000-0000-0000-0000-000000000006';

  denied := false;
  begin
    update public.bulk_reply_drafts
    set status = 'reviewed'
    where id = terminal_review_draft_id;
  exception
    when raise_exception then
      denied := true;
  end;

  if denied is not true then
    raise exception 'T7f FAIL: a draft with a terminal recipient must not be reviewed.';
  end if;

  update public.leads
  set status = 'new'
  where id = 'f2a00000-0000-0000-0000-000000000006';

  terminal_copy_draft_id := public.create_premium_reply_draft(
    'f2600000-0000-0000-0000-000000000001',
    'Terminal lead copy denial fixture',
    'A terminal lead must stale this reviewed draft before copy.',
    jsonb_build_object(
      'leadCount', 1,
      'manualOnly', true,
      'source', 'manual_batch'
    ),
    jsonb_build_array(
      jsonb_build_object(
        'leadId', 'f2a00000-0000-0000-0000-000000000006',
        'renderedMessage', 'Terminal copy regression recipient.'
      )
    )
  );

  update public.bulk_reply_drafts
  set status = 'reviewed'
  where id = terminal_copy_draft_id;

  select recipient.id
    into terminal_copy_recipient_id
  from public.bulk_reply_draft_recipients recipient
  where recipient.draft_id = terminal_copy_draft_id;

  update public.leads
  set status = 'lost'
  where id = 'f2a00000-0000-0000-0000-000000000006';

  denied := false;
  begin
    update public.bulk_reply_draft_recipients
    set copied_at = now()
    where id = terminal_copy_recipient_id;
  exception
    when raise_exception then
      denied := true;
  end;

  if denied is not true then
    raise exception 'T7f FAIL: a terminal recipient must not be copied.';
  end if;

  update public.leads
  set status = 'new'
  where id = 'f2a00000-0000-0000-0000-000000000006';

  perform public.create_premium_reply_draft(
    'f2600000-0000-0000-0000-000000000001',
    'Missing lead review denial fixture',
    'A missing recipient must stale this pending draft.',
    jsonb_build_object(
      'leadCount', 2,
      'manualOnly', true,
      'source', 'manual_batch'
    ),
    jsonb_build_array(
      jsonb_build_object(
        'leadId', 'f2a00000-0000-0000-0000-000000000001',
        'renderedMessage', 'Surviving review recipient.'
      ),
      jsonb_build_object(
        'leadId', 'f2a00000-0000-0000-0000-000000000006',
        'renderedMessage', 'Recipient deleted before review.'
      )
    )
  );

  missing_copy_draft_id := public.create_premium_reply_draft(
    'f2600000-0000-0000-0000-000000000001',
    'Missing lead copy denial fixture',
    'A missing recipient must stale this reviewed draft before copy.',
    jsonb_build_object(
      'leadCount', 2,
      'manualOnly', true,
      'source', 'manual_batch'
    ),
    jsonb_build_array(
      jsonb_build_object(
        'leadId', 'f2a00000-0000-0000-0000-000000000001',
        'renderedMessage', 'Surviving copy recipient.'
      ),
      jsonb_build_object(
        'leadId', 'f2a00000-0000-0000-0000-000000000006',
        'renderedMessage', 'Recipient deleted before copy.'
      )
    )
  );

  update public.bulk_reply_drafts
  set status = 'reviewed'
  where id = missing_copy_draft_id;

  direct_delete_draft_id := public.create_premium_reply_draft(
    'f2600000-0000-0000-0000-000000000001',
    'Direct recipient deletion denial fixture',
    'Removing one recipient must stale the surviving draft.',
    jsonb_build_object(
      'leadCount', 2,
      'manualOnly', true,
      'source', 'manual_batch'
    ),
    jsonb_build_array(
      jsonb_build_object(
        'leadId', 'f2a00000-0000-0000-0000-000000000001',
        'renderedMessage', 'Surviving direct-delete recipient.'
      ),
      jsonb_build_object(
        'leadId', 'f2a00000-0000-0000-0000-000000000006',
        'renderedMessage', 'Directly deleted recipient.'
      )
    )
  );

  delete from public.bulk_reply_draft_recipients
  where draft_id = direct_delete_draft_id
    and lead_id = 'f2a00000-0000-0000-0000-000000000006';

  if not found then
    raise exception 'T7f FAIL: pending recipient deletion fixture must delete one row.';
  end if;

  denied := false;
  begin
    update public.bulk_reply_drafts
    set status = 'reviewed'
    where id = direct_delete_draft_id;
  exception
    when raise_exception then
      denied := true;
  end;

  if denied is not true then
    raise exception 'T7f FAIL: direct recipient deletion must stale the parent review.';
  end if;

  cascade_delete_draft_id := public.create_premium_reply_draft(
    'f2600000-0000-0000-0000-000000000001',
    'Parent cascade deletion fixture',
    'Deleting a pending parent must cascade without a false currentness error.',
    jsonb_build_object(
      'leadCount', 1,
      'manualOnly', true,
      'source', 'manual_batch'
    ),
    jsonb_build_array(
      jsonb_build_object(
        'leadId', 'f2a00000-0000-0000-0000-000000000001',
        'renderedMessage', 'Parent cascade regression recipient.'
      )
    )
  );

  delete from public.bulk_reply_drafts
  where id = cascade_delete_draft_id;

  if not found then
    raise exception 'T7f FAIL: a pending parent draft must remain deletable.';
  end if;

  if exists (
    select 1
    from public.bulk_reply_draft_recipients recipient
    where recipient.draft_id = cascade_delete_draft_id
  ) then
    raise exception 'T7f FAIL: parent deletion must cascade recipient cleanup.';
  end if;
end;
$$;

reset role;

do $$
declare
  founder_function_signature text :=
    'public.founder_upsert_premium_addon_entitlement(uuid,text,text,uuid,timestamptz,timestamptz,text)';
  exact_request_function_signature text :=
    'public.premium_operations_exact_request_window(uuid,uuid)';
  raw_entitlement_function_signature text :=
    'public.premium_operations_entitlement_record_is_active(uuid,text)';
begin
  if has_function_privilege('anon', founder_function_signature, 'EXECUTE')
    or has_function_privilege('authenticated', founder_function_signature, 'EXECUTE') then
    raise exception 'T7f FAIL: founder entitlement RPC must deny anon/authenticated execution.';
  end if;

  if not has_function_privilege('service_role', founder_function_signature, 'EXECUTE') then
    raise exception 'T7f FAIL: founder entitlement RPC must grant service_role execution.';
  end if;

  if has_function_privilege('anon', exact_request_function_signature, 'EXECUTE')
    or not has_function_privilege(
      'authenticated',
      exact_request_function_signature,
      'EXECUTE'
    )
    or not has_function_privilege(
      'service_role',
      exact_request_function_signature,
      'EXECUTE'
    ) then
    raise exception 'T7f FAIL: exact-request helper grants must be authenticated/service-role only.';
  end if;

  if has_function_privilege('anon', raw_entitlement_function_signature, 'EXECUTE')
    or has_function_privilege(
      'authenticated',
      raw_entitlement_function_signature,
      'EXECUTE'
    )
    or not has_function_privilege(
      'service_role',
      raw_entitlement_function_signature,
      'EXECUTE'
    ) then
    raise exception 'T7f FAIL: raw entitlement helper must be service-role only.';
  end if;

  if to_regprocedure(
    'public.can_public_read_intake_field(uuid,uuid,boolean)'
  ) is not null then
    raise exception 'T7f FAIL: obsolete public intake helper overload must be removed.';
  end if;
end;
$$;

set local role service_role;
select set_config('request.jwt.claim.sub', '', true);
select set_config('request.jwt.claim.role', 'service_role', true);

do $$
declare
  created_draft_id uuid;
begin
  if not exists (
    select 1
    from public.premium_operations_exact_request_window(
      'f2600000-0000-0000-0000-000000000001',
      'f2a00000-0000-0000-0000-000000000001'
    )
  ) then
    raise exception 'T7f FAIL: service role must resolve canonical exact-time provenance.';
  end if;

  if not public.premium_operations_entitlement_record_is_active(
    'f2600000-0000-0000-0000-000000000001',
    'bulk_reply_review'
  ) then
    raise exception 'T7f FAIL: service role must execute the raw entitlement check.';
  end if;

  created_draft_id := public.create_premium_reply_draft(
    'f2600000-0000-0000-0000-000000000001',
    'Service-role atomic draft fixture',
    'Service-role writes remain entitlement-gated and manual-only.',
    jsonb_build_object(
      'leadCount', 1,
      'manualOnly', true,
      'source', 'manual_batch'
    ),
    jsonb_build_array(
      jsonb_build_object(
        'leadId', 'f2a00000-0000-0000-0000-000000000001',
        'renderedMessage', 'Service-role regression recipient.'
      )
    )
  );

  if not exists (
    select 1
    from public.bulk_reply_draft_recipients recipient
    where recipient.draft_id = created_draft_id
      and recipient.lead_id = 'f2a00000-0000-0000-0000-000000000001'
  ) then
    raise exception 'T7f FAIL: service-role atomic draft creation must persist its recipient.';
  end if;
end;
$$;

select *
from public.founder_upsert_premium_addon_entitlement(
  'f2600000-0000-0000-0000-000000000002',
  'availability_coordination',
  'disabled',
  'f2500000-0000-0000-0000-000000000003',
  null,
  null,
  'RLS regression fixture'
);

reset role;

do $$
begin
  if (
    select status
    from public.business_addon_entitlements
    where business_id = 'f2600000-0000-0000-0000-000000000002'
      and addon_key = 'availability_coordination'
  ) <> 'disabled' then
    raise exception 'T7f FAIL: founder RPC must return/persist the final entitlement.';
  end if;

  if not exists (
    select 1
    from public.admin_action_log log
    where log.business_id = 'f2600000-0000-0000-0000-000000000002'
      and log.actor_user_id = 'f2500000-0000-0000-0000-000000000003'
      and log.action_type = 'status_changed'
      and log.new_values ->> 'operation' = 'premium_addon_entitlement_updated'
      and log.previous_values ->> 'status' = 'enabled'
      and log.new_values ->> 'status' = 'disabled'
  ) then
    raise exception 'T7f FAIL: founder entitlement and audit rows must commit atomically.';
  end if;
end;
$$;

delete from public.leads
where id = 'f2a00000-0000-0000-0000-000000000006';

do $$
begin
  if exists (
    select 1
    from public.bulk_reply_draft_recipients recipient
    where recipient.lead_id = 'f2a00000-0000-0000-0000-000000000006'
  ) then
    raise exception 'T7f FAIL: deleting a lead must remove its draft-recipient rows.';
  end if;
end;
$$;

set local role authenticated;
select set_config('request.jwt.claim.sub', 'f2500000-0000-0000-0000-000000000001', true);
select set_config('request.jwt.claim.role', 'authenticated', true);

do $$
declare
  missing_review_draft_id uuid;
  surviving_copy_recipient_id uuid;
  denied boolean;
begin
  select draft.id
    into missing_review_draft_id
  from public.bulk_reply_drafts draft
  where draft.title = 'Missing lead review denial fixture';

  denied := false;
  begin
    update public.bulk_reply_drafts
    set status = 'reviewed'
    where id = missing_review_draft_id;
  exception
    when raise_exception then
      denied := true;
  end;

  if denied is not true then
    raise exception 'T7f FAIL: a draft with a missing recipient must not be reviewed.';
  end if;

  select recipient.id
    into surviving_copy_recipient_id
  from public.bulk_reply_draft_recipients recipient
  join public.bulk_reply_drafts draft
    on draft.id = recipient.draft_id
   and draft.business_id = recipient.business_id
  where draft.title = 'Missing lead copy denial fixture'
    and recipient.lead_id = 'f2a00000-0000-0000-0000-000000000001';

  denied := false;
  begin
    update public.bulk_reply_draft_recipients
    set copied_at = now()
    where id = surviving_copy_recipient_id;
  exception
    when raise_exception then
      denied := true;
  end;

  if denied is not true then
    raise exception 'T7f FAIL: no recipient may be copied after another target disappears.';
  end if;
end;
$$;

-- ============================================================
-- T7g: Exact date/time child integrity rejects direct orphaning,
-- while submission and business parent deletion cascade cleanly.
-- ============================================================

reset role;
select set_config('request.jwt.claim.sub', '', true);
select set_config('request.jwt.claim.role', 'service_role', true);

insert into public.intake_submissions (
  id,
  business_id,
  intake_form_id,
  consent_version_id,
  privacy_mode,
  consent_accepted_at
)
values (
  'f2900000-0000-0000-0000-000000000007',
  'f2600000-0000-0000-0000-000000000001',
  'f2700000-0000-0000-0000-000000000001',
  'f2800000-0000-0000-0000-000000000001',
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
    'f2600000-0000-0000-0000-000000000001',
    'f2900000-0000-0000-0000-000000000007',
    'preferred_date',
    'Preferred date',
    to_jsonb(
      (
        (statement_timestamp() at time zone 'America/Toronto')::date + 40
      )::text
    )
  ),
  (
    'f2600000-0000-0000-0000-000000000001',
    'f2900000-0000-0000-0000-000000000007',
    'preferred_time',
    'Preferred exact time',
    to_jsonb('10:30'::text)
  );

do $$
declare
  denied boolean := false;
begin
  begin
    delete from public.intake_submission_values
    where submission_id = 'f2900000-0000-0000-0000-000000000007'
      and field_key = 'preferred_date';
  exception
    when raise_exception then
      denied := true;
  end;

  if denied is not true then
    raise exception 'T7g FAIL: direct preferred_date deletion must not orphan an exact time.';
  end if;

  if (
    select count(*)
    from public.intake_submission_values
    where submission_id = 'f2900000-0000-0000-0000-000000000007'
      and field_key in ('preferred_date', 'preferred_time')
  ) <> 2 then
    raise exception 'T7g FAIL: rejected direct deletion must preserve the exact pair.';
  end if;
end;
$$;

delete from public.intake_submissions
where id = 'f2900000-0000-0000-0000-000000000007';

do $$
begin
  if exists (
    select 1
    from public.intake_submission_values
    where submission_id = 'f2900000-0000-0000-0000-000000000007'
  ) then
    raise exception 'T7g FAIL: parent submission deletion must cascade the exact pair.';
  end if;
end;
$$;

insert into public.businesses (
  id,
  name,
  slug,
  owner_user_id,
  status,
  workspace_kind
)
values (
  'f2600000-0000-0000-0000-000000000003',
  'Premium Cascade Fixture',
  'premium-cascade-fixture',
  'f2500000-0000-0000-0000-000000000001',
  'active',
  'founder_test'
);

insert into public.intake_forms (id, business_id, template_id, name)
values (
  'f2700000-0000-0000-0000-000000000003',
  'f2600000-0000-0000-0000-000000000003',
  (select id from public.industry_templates where slug = 'cleaning-smart-quote-v1'),
  'Premium Cascade Intake'
);

insert into public.consent_versions (
  id,
  business_id,
  version_label,
  consent_notice
)
values (
  'f2800000-0000-0000-0000-000000000003',
  'f2600000-0000-0000-0000-000000000003',
  'v1',
  'Disposable cascade regression consent.'
);

insert into public.business_addon_entitlements (
  business_id,
  addon_key,
  status
)
values (
  'f2600000-0000-0000-0000-000000000003',
  'availability_coordination',
  'enabled'
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
  'f2900000-0000-0000-0000-000000000008',
  'f2600000-0000-0000-0000-000000000003',
  'f2700000-0000-0000-0000-000000000003',
  'f2800000-0000-0000-0000-000000000003',
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
    'f2600000-0000-0000-0000-000000000003',
    'f2900000-0000-0000-0000-000000000008',
    'preferred_date',
    'Preferred date',
    to_jsonb(
      (
        (statement_timestamp() at time zone 'America/Toronto')::date + 41
      )::text
    )
  ),
  (
    'f2600000-0000-0000-0000-000000000003',
    'f2900000-0000-0000-0000-000000000008',
    'preferred_time',
    'Preferred exact time',
    to_jsonb('10:30'::text)
  );

-- Isolate the business_id cascade exercised by the exact-pair trigger from the
-- older form/consent RESTRICT relationships. The current schema does not make
-- those two references tenant-composite, so this disposable fixture can point
-- them at surviving parents while its own now-unreferenced setup rows are
-- removed. The submission/value rows remain owned by the business under test.
update public.intake_submissions
set
  intake_form_id = 'f2700000-0000-0000-0000-000000000001',
  consent_version_id = 'f2800000-0000-0000-0000-000000000001'
where id = 'f2900000-0000-0000-0000-000000000008';

delete from public.intake_forms
where id = 'f2700000-0000-0000-0000-000000000003';

delete from public.consent_versions
where id = 'f2800000-0000-0000-0000-000000000003';

delete from public.businesses
where id = 'f2600000-0000-0000-0000-000000000003';

do $$
begin
  if exists (
    select 1
    from public.businesses
    where id = 'f2600000-0000-0000-0000-000000000003'
  ) then
    raise exception 'T7g FAIL: disposable parent business must be deleted.';
  end if;

  if exists (
    select 1
    from public.intake_submissions
    where id = 'f2900000-0000-0000-0000-000000000008'
  ) or exists (
    select 1
    from public.intake_submission_values
    where submission_id = 'f2900000-0000-0000-0000-000000000008'
  ) then
    raise exception 'T7g FAIL: parent business deletion must cascade the submission and exact pair.';
  end if;
end;
$$;

-- ============================================================
-- T8: Public callers cannot read any Premium Operations record.
-- ============================================================

set local role anon;
select set_config('request.jwt.claim.sub', '', true);
select set_config('request.jwt.claim.role', 'anon', true);

do $$
begin
  begin
    perform count(*) from public.business_addon_entitlements;
    raise exception 'T8 FAIL: public callers must not read entitlement records.';
  exception
    when insufficient_privilege then
      null;
  end;

  begin
    perform count(*) from public.lead_priority_rules;
    raise exception 'T8 FAIL: public callers must not read priority rules.';
  exception
    when insufficient_privilege then
      null;
  end;

  begin
    perform count(*) from public.service_time_blocks;
    raise exception 'T8 FAIL: public callers must not read internal time blocks.';
  exception
    when insufficient_privilege then
      null;
  end;

  begin
    perform count(*) from public.bulk_reply_drafts;
    raise exception 'T8 FAIL: public callers must not read review drafts.';
  exception
    when insufficient_privilege then
      null;
  end;

  begin
    perform count(*) from public.bulk_reply_draft_recipients;
    raise exception 'T8 FAIL: public callers must not read draft recipients.';
  exception
    when insufficient_privilege then
      null;
  end;
end;
$$;

rollback;
