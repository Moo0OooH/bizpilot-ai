/*
============================================================
File: supabase/migrations/0025_premium_operations_addons.sql
Project: BizPilot AI
Description: Adds tenant-scoped Premium Operations add-ons for priority work, owner-reviewed bulk drafts, and internal availability coordination.
Role: Keeps paid operational extensions explicitly entitled and manual-first without adding a booking engine, automated messaging, or billing provider.
Related:
- server/services/premium-operations.service.ts
- server/repositories/premium-operations.repository.ts
- docs/product/BIZPILOT_PREMIUM_OPERATIONS_ADDONS_v1.0.md
- tests/rls/premium-operations-addons.test.sql
Author: MoOoH
Created: 2026-07-21
Last Updated: 2026-07-22
Change Log:
- 2026-07-21: Created manual add-on entitlements, priority rules, internal time blocks, and owner-reviewed bulk draft records.
- 2026-07-21: Added standard updated-at triggers for every mutable Premium Operations parent record.
- 2026-07-21: Enforced recipient-to-draft and recipient-to-lead tenant integrity with composite foreign keys and update checks.
- 2026-07-21: Applied the same tenant-safe lead reference to internal service time blocks.
- 2026-07-21: Moved cross-table RLS ownership tests into explicit, non-leaking tenant helper functions.
- 2026-07-21: Enforced each paid add-on and review/copy state transition at the database boundary.
- 2026-07-22: Revoked Supabase default Data API execute grants before applying each explicit Premium Operations function grant.
============================================================
*/

/*
  These tables deliberately support owner review and manual copy/send only.
  They do not hold provider credentials, send messages, confirm bookings, or
  expose availability to an anonymous visitor.
*/

create table if not exists public.business_addon_entitlements (
  business_id uuid not null references public.businesses(id) on delete cascade,
  addon_key text not null check (
    addon_key in (
      'availability_coordination',
      'bulk_reply_review',
      'priority_workbench'
    )
  ),
  status text not null default 'disabled' check (
    status in ('disabled', 'enabled', 'expired', 'trial')
  ),
  activated_at timestamptz,
  expires_at timestamptz,
  managed_by_user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (business_id, addon_key),
  check (expires_at is null or activated_at is null or expires_at > activated_at)
);

create index if not exists business_addon_entitlements_business_status_idx
  on public.business_addon_entitlements(business_id, status);

alter table public.business_addon_entitlements enable row level security;

create policy business_addon_entitlements_select_member
  on public.business_addon_entitlements
  for select
  to authenticated
  using ((select public.is_business_member(business_id)));

revoke all on public.business_addon_entitlements from anon, authenticated;
grant select on public.business_addon_entitlements to authenticated;
grant all on public.business_addon_entitlements to service_role;

-- Keep paid access enforceable even if an authenticated manager calls the
-- Data API directly instead of using a server action. The membership predicate
-- also prevents this helper from exposing another workspace's entitlement.
create or replace function public.premium_operations_addon_is_active(
  target_business_id uuid,
  target_addon_key text
)
returns boolean
language sql
stable
security definer
set search_path = public
set row_security = off
as $$
  select
    (select public.is_business_member(target_business_id))
    and exists (
      select 1
      from public.business_addon_entitlements entitlement
      where entitlement.business_id = target_business_id
        and entitlement.addon_key = target_addon_key
        and entitlement.status in ('enabled', 'trial')
        and (
          entitlement.expires_at is null
          or entitlement.expires_at > now()
        )
    );
$$;

revoke all on function public.premium_operations_addon_is_active(uuid, text)
  from public, anon, authenticated, service_role;
grant execute on function public.premium_operations_addon_is_active(uuid, text)
  to authenticated, service_role;

create table if not exists public.lead_priority_rules (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  name text not null check (char_length(btrim(name)) between 2 and 80),
  description text,
  priority_rank smallint not null default 3 check (priority_rank between 1 and 5),
  service_terms text[] not null default '{}'::text[],
  area_terms text[] not null default '{}'::text[],
  is_active boolean not null default true,
  created_by_user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (cardinality(service_terms) <= 20),
  check (cardinality(area_terms) <= 20)
);

create index if not exists lead_priority_rules_business_rank_idx
  on public.lead_priority_rules(business_id, is_active, priority_rank asc, created_at asc);

alter table public.lead_priority_rules enable row level security;

create policy lead_priority_rules_select_member
  on public.lead_priority_rules
  for select
  to authenticated
  using (
    (select public.is_business_member(business_id))
    and (select public.premium_operations_addon_is_active(business_id, 'priority_workbench'))
  );

create policy lead_priority_rules_insert_manager
  on public.lead_priority_rules
  for insert
  to authenticated
  with check (
    (select public.can_manage_business(business_id))
    and (select public.premium_operations_addon_is_active(business_id, 'priority_workbench'))
  );

create policy lead_priority_rules_update_manager
  on public.lead_priority_rules
  for update
  to authenticated
  using (
    (select public.can_manage_business(business_id))
    and (select public.premium_operations_addon_is_active(business_id, 'priority_workbench'))
  )
  with check (
    (select public.can_manage_business(business_id))
    and (select public.premium_operations_addon_is_active(business_id, 'priority_workbench'))
  );

create policy lead_priority_rules_delete_manager
  on public.lead_priority_rules
  for delete
  to authenticated
  using (
    (select public.can_manage_business(business_id))
    and (select public.premium_operations_addon_is_active(business_id, 'priority_workbench'))
  );

revoke all on public.lead_priority_rules from anon;
grant select, insert, update, delete on public.lead_priority_rules to authenticated;
grant all on public.lead_priority_rules to service_role;

create unique index if not exists leads_business_id_id_uidx
  on public.leads(business_id, id);

create or replace function public.premium_operations_lead_belongs_to_business(
  target_lead_id uuid,
  target_business_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = public
set row_security = off
as $$
  select
    (select public.is_business_member(target_business_id))
    and exists (
    select 1
    from public.leads
    where id = target_lead_id
      and business_id = target_business_id
    );
$$;

revoke all on function public.premium_operations_lead_belongs_to_business(uuid, uuid)
  from public, anon, authenticated, service_role;
grant execute on function public.premium_operations_lead_belongs_to_business(uuid, uuid)
  to authenticated, service_role;

create table if not exists public.service_time_blocks (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  lead_id uuid,
  client_name text not null check (char_length(btrim(client_name)) between 1 and 160),
  company_name text,
  service_label text not null check (char_length(btrim(service_label)) between 1 and 160),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status text not null default 'reserved' check (
    status in ('cancelled', 'reserved', 'tentative')
  ),
  notes text,
  created_by_user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at > starts_at),
  check (ends_at <= starts_at + interval '24 hours'),
  foreign key (business_id, lead_id)
    references public.leads(business_id, id)
    on delete set null (lead_id)
);

create index if not exists service_time_blocks_business_start_idx
  on public.service_time_blocks(business_id, starts_at asc)
  where status in ('reserved', 'tentative');

create index if not exists service_time_blocks_business_lead_idx
  on public.service_time_blocks(business_id, lead_id)
  where lead_id is not null;

alter table public.service_time_blocks enable row level security;

create policy service_time_blocks_select_member
  on public.service_time_blocks
  for select
  to authenticated
  using (
    (select public.is_business_member(business_id))
    and (select public.premium_operations_addon_is_active(business_id, 'availability_coordination'))
  );

create policy service_time_blocks_insert_manager
  on public.service_time_blocks
  for insert
  to authenticated
  with check (
    (select public.can_manage_business(business_id))
    and (select public.premium_operations_addon_is_active(business_id, 'availability_coordination'))
    and (
      lead_id is null
      or (select public.premium_operations_lead_belongs_to_business(lead_id, business_id))
    )
  );

create policy service_time_blocks_update_manager
  on public.service_time_blocks
  for update
  to authenticated
  using (
    (select public.can_manage_business(business_id))
    and (select public.premium_operations_addon_is_active(business_id, 'availability_coordination'))
  )
  with check (
    (select public.can_manage_business(business_id))
    and (select public.premium_operations_addon_is_active(business_id, 'availability_coordination'))
    and (
      lead_id is null
      or (select public.premium_operations_lead_belongs_to_business(lead_id, business_id))
    )
  );

create policy service_time_blocks_delete_manager
  on public.service_time_blocks
  for delete
  to authenticated
  using (
    (select public.can_manage_business(business_id))
    and (select public.premium_operations_addon_is_active(business_id, 'availability_coordination'))
  );

revoke all on public.service_time_blocks from anon;
grant select, insert, update, delete on public.service_time_blocks to authenticated;
grant all on public.service_time_blocks to service_role;

create table if not exists public.bulk_reply_drafts (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  title text not null check (char_length(btrim(title)) between 2 and 120),
  audience_summary jsonb not null default '{}'::jsonb,
  message_template text not null check (char_length(btrim(message_template)) between 1 and 4000),
  status text not null default 'draft' check (status in ('draft', 'reviewed')),
  reviewed_at timestamptz,
  reviewed_by_user_id uuid references auth.users(id) on delete set null,
  created_by_user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (
    (status = 'draft' and reviewed_at is null and reviewed_by_user_id is null)
    or (
      status = 'reviewed'
      and reviewed_at is not null
      and reviewed_by_user_id is not null
    )
  )
);

create index if not exists bulk_reply_drafts_business_created_idx
  on public.bulk_reply_drafts(business_id, created_at desc);

create unique index if not exists bulk_reply_drafts_business_id_id_uidx
  on public.bulk_reply_drafts(business_id, id);

create or replace function public.premium_operations_draft_belongs_to_business(
  target_draft_id uuid,
  target_business_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = public
set row_security = off
as $$
  select
    (select public.is_business_member(target_business_id))
    and exists (
    select 1
    from public.bulk_reply_drafts
    where id = target_draft_id
      and business_id = target_business_id
    );
$$;

revoke all on function public.premium_operations_draft_belongs_to_business(uuid, uuid)
  from public, anon, authenticated, service_role;
grant execute on function public.premium_operations_draft_belongs_to_business(uuid, uuid)
  to authenticated, service_role;

-- Availability Coordination has a deliberately narrow path into the review
-- queue: only rows explicitly marked as an availability conflict. Bulk Reply
-- Review remains required for every other draft.
create or replace function public.premium_operations_can_access_draft(
  target_business_id uuid,
  target_draft_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = public
set row_security = off
as $$
  select
    (select public.is_business_member(target_business_id))
    and exists (
      select 1
      from public.bulk_reply_drafts draft
      where draft.id = target_draft_id
        and draft.business_id = target_business_id
        and (
          (select public.premium_operations_addon_is_active(target_business_id, 'bulk_reply_review'))
          or (
            draft.audience_summary ->> 'source' = 'availability_conflict'
            and (select public.premium_operations_addon_is_active(target_business_id, 'availability_coordination'))
          )
        )
    );
$$;

revoke all on function public.premium_operations_can_access_draft(uuid, uuid)
  from public, anon, authenticated, service_role;
grant execute on function public.premium_operations_can_access_draft(uuid, uuid)
  to authenticated, service_role;

alter table public.bulk_reply_drafts enable row level security;

create policy bulk_reply_drafts_select_member
  on public.bulk_reply_drafts
  for select
  to authenticated
  using (
    (select public.is_business_member(business_id))
    and (select public.premium_operations_can_access_draft(business_id, id))
  );

create policy bulk_reply_drafts_insert_manager
  on public.bulk_reply_drafts
  for insert
  to authenticated
  with check (
    (select public.can_manage_business(business_id))
    and (
      (select public.premium_operations_addon_is_active(business_id, 'bulk_reply_review'))
      or (
        audience_summary ->> 'source' = 'availability_conflict'
        and (select public.premium_operations_addon_is_active(business_id, 'availability_coordination'))
      )
    )
  );

create policy bulk_reply_drafts_update_manager
  on public.bulk_reply_drafts
  for update
  to authenticated
  using (
    (select public.can_manage_business(business_id))
    and (select public.premium_operations_can_access_draft(business_id, id))
  )
  with check (
    (select public.can_manage_business(business_id))
    and (
      (select public.premium_operations_addon_is_active(business_id, 'bulk_reply_review'))
      or (
        audience_summary ->> 'source' = 'availability_conflict'
        and (select public.premium_operations_addon_is_active(business_id, 'availability_coordination'))
      )
    )
  );

create policy bulk_reply_drafts_delete_manager
  on public.bulk_reply_drafts
  for delete
  to authenticated
  using (
    (select public.can_manage_business(business_id))
    and (select public.premium_operations_can_access_draft(business_id, id))
    and status = 'draft'
  );

revoke all on public.bulk_reply_drafts from anon;
grant select, insert, update, delete on public.bulk_reply_drafts to authenticated;
grant all on public.bulk_reply_drafts to service_role;

create table if not exists public.bulk_reply_draft_recipients (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  draft_id uuid not null references public.bulk_reply_drafts(id) on delete cascade,
  lead_id uuid not null references public.leads(id) on delete cascade,
  rendered_message text not null check (char_length(btrim(rendered_message)) between 1 and 5000),
  copied_at timestamptz,
  copied_by_user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  check (
    (copied_at is null and copied_by_user_id is null)
    or (copied_at is not null and copied_by_user_id is not null)
  ),
  unique (draft_id, lead_id),
  foreign key (business_id, draft_id)
    references public.bulk_reply_drafts(business_id, id) on delete cascade,
  foreign key (business_id, lead_id)
    references public.leads(business_id, id) on delete cascade
);

create index if not exists bulk_reply_draft_recipients_business_draft_idx
  on public.bulk_reply_draft_recipients(business_id, draft_id, created_at asc);

create index if not exists bulk_reply_draft_recipients_business_lead_idx
  on public.bulk_reply_draft_recipients(business_id, lead_id);

alter table public.bulk_reply_draft_recipients enable row level security;

create policy bulk_reply_draft_recipients_select_member
  on public.bulk_reply_draft_recipients
  for select
  to authenticated
  using (
    (select public.is_business_member(business_id))
    and (select public.premium_operations_can_access_draft(business_id, draft_id))
  );

create policy bulk_reply_draft_recipients_insert_manager
  on public.bulk_reply_draft_recipients
  for insert
  to authenticated
  with check (
    (select public.can_manage_business(business_id))
    and (select public.premium_operations_can_access_draft(business_id, draft_id))
    and (select public.premium_operations_draft_belongs_to_business(draft_id, business_id))
    and (select public.premium_operations_lead_belongs_to_business(lead_id, business_id))
  );

create policy bulk_reply_draft_recipients_update_manager
  on public.bulk_reply_draft_recipients
  for update
  to authenticated
  using (
    (select public.can_manage_business(business_id))
    and (select public.premium_operations_can_access_draft(business_id, draft_id))
  )
  with check (
    (select public.can_manage_business(business_id))
    and (select public.premium_operations_can_access_draft(business_id, draft_id))
    and (select public.premium_operations_draft_belongs_to_business(draft_id, business_id))
    and (select public.premium_operations_lead_belongs_to_business(lead_id, business_id))
  );

create policy bulk_reply_draft_recipients_delete_manager
  on public.bulk_reply_draft_recipients
  for delete
  to authenticated
  using (
    (select public.can_manage_business(business_id))
    and (select public.premium_operations_can_access_draft(business_id, draft_id))
    and exists (
      select 1
      from public.bulk_reply_drafts draft
      where draft.id = bulk_reply_draft_recipients.draft_id
        and draft.business_id = bulk_reply_draft_recipients.business_id
        and draft.status = 'draft'
    )
  );

revoke all on public.bulk_reply_draft_recipients from anon;
grant select, insert, update, delete on public.bulk_reply_draft_recipients to authenticated;
grant all on public.bulk_reply_draft_recipients to service_role;

drop trigger if exists business_addon_entitlements_set_updated_at
  on public.business_addon_entitlements;
create trigger business_addon_entitlements_set_updated_at
  before update on public.business_addon_entitlements
  for each row
  execute function public.set_updated_at();

drop trigger if exists lead_priority_rules_set_updated_at
  on public.lead_priority_rules;
create trigger lead_priority_rules_set_updated_at
  before update on public.lead_priority_rules
  for each row
  execute function public.set_updated_at();

-- Keep tenant and actor audit fields durable even for direct authenticated
-- Data API calls. Service-role setup may provide the actor explicitly; a
-- signed-in manager is always recorded as the actor they actually are.
create or replace function public.initialize_premium_operations_creator()
returns trigger
language plpgsql
security definer
set search_path = public
set row_security = off
as $$
begin
  if auth.uid() is not null then
    new.created_by_user_id := auth.uid();
  end if;

  return new;
end;
$$;

revoke all on function public.initialize_premium_operations_creator()
  from public, anon, authenticated, service_role;

create or replace function public.enforce_premium_operations_record_identity()
returns trigger
language plpgsql
security definer
set search_path = public
set row_security = off
as $$
begin
  if new.business_id is distinct from old.business_id
    or new.created_by_user_id is distinct from old.created_by_user_id then
    raise exception 'Premium Operations tenant and creator records are immutable.';
  end if;

  return new;
end;
$$;

revoke all on function public.enforce_premium_operations_record_identity()
  from public, anon, authenticated, service_role;

drop trigger if exists lead_priority_rules_initialize_creator
  on public.lead_priority_rules;
create trigger lead_priority_rules_initialize_creator
  before insert on public.lead_priority_rules
  for each row
  execute function public.initialize_premium_operations_creator();

drop trigger if exists lead_priority_rules_enforce_identity
  on public.lead_priority_rules;
create trigger lead_priority_rules_enforce_identity
  before update on public.lead_priority_rules
  for each row
  execute function public.enforce_premium_operations_record_identity();

-- Server validation is helpful UX, but a paid feature's limits must remain
-- true for direct authenticated Data API calls as well. Lock the parent
-- workspace row so concurrent inserts cannot race past the shared limit.
create or replace function public.enforce_premium_operations_priority_rule_limit()
returns trigger
language plpgsql
security definer
set search_path = public
set row_security = off
as $$
begin
  perform 1
  from public.businesses
  where id = new.business_id
  for update;

  if (
    select count(*)
    from public.lead_priority_rules rule
    where rule.business_id = new.business_id
  ) >= 20 then
    raise exception 'Limit reached: up to 20 priority views are supported.';
  end if;

  return new;
end;
$$;

revoke all on function public.enforce_premium_operations_priority_rule_limit()
  from public, anon, authenticated, service_role;

drop trigger if exists lead_priority_rules_enforce_limit
  on public.lead_priority_rules;
create trigger lead_priority_rules_enforce_limit
  before insert on public.lead_priority_rules
  for each row
  execute function public.enforce_premium_operations_priority_rule_limit();

drop trigger if exists service_time_blocks_set_updated_at
  on public.service_time_blocks;
create trigger service_time_blocks_set_updated_at
  before update on public.service_time_blocks
  for each row
  execute function public.set_updated_at();

drop trigger if exists service_time_blocks_initialize_creator
  on public.service_time_blocks;
create trigger service_time_blocks_initialize_creator
  before insert on public.service_time_blocks
  for each row
  execute function public.initialize_premium_operations_creator();

drop trigger if exists service_time_blocks_enforce_identity
  on public.service_time_blocks;
create trigger service_time_blocks_enforce_identity
  before update on public.service_time_blocks
  for each row
  execute function public.enforce_premium_operations_record_identity();

drop trigger if exists bulk_reply_drafts_set_updated_at
  on public.bulk_reply_drafts;
create trigger bulk_reply_drafts_set_updated_at
  before update on public.bulk_reply_drafts
  for each row
  execute function public.set_updated_at();

-- Review metadata is written at the database boundary. Authenticated callers
-- cannot manufacture an already-reviewed draft or impersonate its creator.
create or replace function public.initialize_premium_operations_draft()
returns trigger
language plpgsql
security definer
set search_path = public
set row_security = off
as $$
declare
  availability_lead_id uuid;
  requested_starts_at timestamptz;
  requested_ends_at timestamptz;
begin
  if new.status <> 'draft'
    or new.reviewed_at is not null
    or new.reviewed_by_user_id is not null then
    raise exception 'A Premium Operations draft must be created in review-pending state.';
  end if;

  -- Availability Coordination is intentionally limited to one real, current
  -- conflict. Without this validation, an availability-only manager could use
  -- the narrow review-queue exception as an unentitled bulk-messaging path.
  if new.audience_summary ->> 'source' = 'availability_conflict' then
    if coalesce(jsonb_typeof(new.audience_summary), '') <> 'object'
      or coalesce(new.audience_summary ->> 'leadCount', '') <> '1'
      or coalesce(new.audience_summary ->> 'manualOnly', '') <> 'true'
      or coalesce(jsonb_typeof(new.audience_summary -> 'conflictBlockIds'), '') <> 'array' then
      raise exception 'Availability review drafts require one validated conflict.';
    end if;

    begin
      availability_lead_id := nullif(new.audience_summary ->> 'leadId', '')::uuid;
      requested_starts_at := nullif(new.audience_summary ->> 'requestedStartsAt', '')::timestamptz;
      requested_ends_at := nullif(new.audience_summary ->> 'requestedEndsAt', '')::timestamptz;
    exception
      when invalid_text_representation or invalid_datetime_format or datetime_field_overflow then
        raise exception 'Availability review drafts require one validated conflict.';
    end;

    if availability_lead_id is null
      or requested_starts_at is null
      or requested_ends_at is null
      or requested_ends_at <= requested_starts_at
      or not exists (
        select 1
        from public.leads lead
        where lead.id = availability_lead_id
          and lead.business_id = new.business_id
          and lead.status not in ('archived', 'booked', 'lost')
      )
      or not exists (
        select 1
        from public.service_time_blocks block
        where block.business_id = new.business_id
          and block.status in ('reserved', 'tentative')
          and block.starts_at < requested_ends_at
          and requested_starts_at < block.ends_at
          and (new.audience_summary -> 'conflictBlockIds')
            @> jsonb_build_array(block.id::text)
      ) then
      raise exception 'Availability review drafts require one validated conflict.';
    end if;
  end if;

  if auth.uid() is not null then
    new.created_by_user_id := auth.uid();
  end if;

  return new;
end;
$$;

revoke all on function public.initialize_premium_operations_draft()
  from public, anon, authenticated, service_role;

drop trigger if exists bulk_reply_drafts_initialize_review_state
  on public.bulk_reply_drafts;
create trigger bulk_reply_drafts_initialize_review_state
  before insert on public.bulk_reply_drafts
  for each row
  execute function public.initialize_premium_operations_draft();

-- A reviewed draft is a durable manager decision. The one allowed transition
-- records the actual authenticated reviewer and freezes the rendered content.
create or replace function public.enforce_premium_operations_draft_review()
returns trigger
language plpgsql
security definer
set search_path = public
set row_security = off
as $$
begin
  if old.status = 'reviewed' then
    raise exception 'Reviewed Premium Operations drafts are immutable.';
  end if;

  if new.status <> 'reviewed'
    or new.title is distinct from old.title
    or new.message_template is distinct from old.message_template
    or new.audience_summary is distinct from old.audience_summary
    or new.business_id is distinct from old.business_id
    or new.created_by_user_id is distinct from old.created_by_user_id then
    raise exception 'A Premium Operations draft may only transition once from draft to reviewed.';
  end if;

  if auth.uid() is null then
    raise exception 'A signed-in manager must review this draft.';
  end if;

  new.reviewed_by_user_id := auth.uid();
  new.reviewed_at := now();
  return new;
end;
$$;

revoke all on function public.enforce_premium_operations_draft_review()
  from public, anon, authenticated, service_role;

drop trigger if exists bulk_reply_drafts_enforce_review_transition
  on public.bulk_reply_drafts;
create trigger bulk_reply_drafts_enforce_review_transition
  before update on public.bulk_reply_drafts
  for each row
  execute function public.enforce_premium_operations_draft_review();

-- A recipient may be attached only to a pending review draft, must point to a
-- non-terminal lead in the same workspace, and cannot exceed the durable
-- 50-recipient contract even through direct Data API writes.
create or replace function public.enforce_premium_operations_recipient_insert()
returns trigger
language plpgsql
security definer
set search_path = public
set row_security = off
as $$
declare
  parent_status text;
  parent_audience_summary jsonb;
  availability_lead_id uuid;
  lead_status text;
begin
  if new.copied_at is not null or new.copied_by_user_id is not null then
    raise exception 'Recipients must be created before a manual copy is recorded.';
  end if;

  select draft.status, draft.audience_summary
    into parent_status, parent_audience_summary
  from public.bulk_reply_drafts draft
  where draft.id = new.draft_id
    and draft.business_id = new.business_id
  for update;

  if parent_status is distinct from 'draft' then
    raise exception 'Recipients can only be added to a review-pending draft.';
  end if;

  if parent_audience_summary ->> 'source' = 'availability_conflict' then
    begin
      availability_lead_id := nullif(parent_audience_summary ->> 'leadId', '')::uuid;
    exception
      when invalid_text_representation then
        raise exception 'Availability review drafts require one validated recipient.';
    end;

    if availability_lead_id is null or new.lead_id <> availability_lead_id then
      raise exception 'Availability review drafts require one validated recipient.';
    end if;
  end if;

  select lead.status
    into lead_status
  from public.leads lead
  where lead.id = new.lead_id
    and lead.business_id = new.business_id;

  if lead_status in ('archived', 'booked', 'lost') then
    raise exception 'Booked, lost, and archived leads cannot be added to a draft batch.';
  end if;

  if (
    select count(*)
    from public.bulk_reply_draft_recipients recipient
    where recipient.draft_id = new.draft_id
  ) >= 50 then
    raise exception 'A review batch can contain up to 50 leads.';
  end if;

  return new;
end;
$$;

revoke all on function public.enforce_premium_operations_recipient_insert()
  from public, anon, authenticated, service_role;

drop trigger if exists bulk_reply_draft_recipients_enforce_insert
  on public.bulk_reply_draft_recipients;
create trigger bulk_reply_draft_recipients_enforce_insert
  before insert on public.bulk_reply_draft_recipients
  for each row
  execute function public.enforce_premium_operations_recipient_insert();

-- Recipient content is fixed when it is created. Marking a copy is permitted
-- exactly once and only after its parent draft has a durable review record.
create or replace function public.enforce_premium_operations_recipient_copy()
returns trigger
language plpgsql
security definer
set search_path = public
set row_security = off
as $$
declare
  parent_is_reviewed boolean;
begin
  if new.business_id is distinct from old.business_id
    or new.draft_id is distinct from old.draft_id
    or new.lead_id is distinct from old.lead_id
    or new.rendered_message is distinct from old.rendered_message
    or new.created_at is distinct from old.created_at then
    raise exception 'Premium Operations recipient content is immutable.';
  end if;

  if old.copied_at is not null then
    raise exception 'A Premium Operations copy record is immutable.';
  end if;

  if new.copied_at is null then
    raise exception 'A recipient may only be updated when a manual copy is recorded.';
  end if;

  if auth.uid() is null then
    raise exception 'A signed-in manager must record this manual copy.';
  end if;

  select draft.status = 'reviewed'
    into parent_is_reviewed
  from public.bulk_reply_drafts draft
  where draft.id = old.draft_id
    and draft.business_id = old.business_id;

  if parent_is_reviewed is not true then
    raise exception 'A manager must review this draft before a manual copy is recorded.';
  end if;

  new.copied_by_user_id := auth.uid();
  new.copied_at := now();
  return new;
end;
$$;

revoke all on function public.enforce_premium_operations_recipient_copy()
  from public, anon, authenticated, service_role;

drop trigger if exists bulk_reply_draft_recipients_enforce_copy_transition
  on public.bulk_reply_draft_recipients;
create trigger bulk_reply_draft_recipients_enforce_copy_transition
  before update on public.bulk_reply_draft_recipients
  for each row
  execute function public.enforce_premium_operations_recipient_copy();
