# A1 Admin, Owner, And User Access Audit And Spec

Date: 2026-06-26
Repo: `E:\bizpilot-ai`
Scope: audit/spec only; no implementation

## Decision

```text
A1 implementation is not safe to start in this pass.
Stop after audit/spec.
```

Reason: owner/team access management requires explicit product decisions,
route design, server actions, tests, and likely schema/RLS migration work.
Those are outside post-P8/D1 hygiene and must not be mixed into this cleanup.

## Files Inspected

```text
app/admin/page.tsx
app/(dashboard)/founder/page.tsx
server/services/founder-admin.service.ts
server/repositories/founder-admin.repository.ts
server/actions/founder-admin.actions.ts
server/repositories/business-members.repository.ts
server/policies/business-membership.policy.ts
server/services/business.service.ts
types/database.ts
supabase/migrations/0001_auth_tenant_foundation.sql
supabase/migrations/0015_business_access_plan_and_admin_log.sql
tests/rls/auth-tenant-foundation.test.sql
tests/rls/business-access-plan-admin-log.test.sql
tests/rls/rls-helper-functions.test.sql
tests/unit/founder-admin-source.test.mts
tests/unit/founder-auth-user-deletion.test.mts
```

## 12-Point Audit

### 1. What user/access tables exist?

Current tables/types include:

- Supabase `auth.users` outside the public schema.
- `public.profiles`.
- `public.businesses`.
- `public.business_members`.
- `public.admin_action_log`.

`business_members.role` currently supports:

```text
owner
admin
member
concierge_limited
```

`business_members.status` currently supports:

```text
active
disabled
```

### 2. What roles exist today?

Business workspace roles exist at the membership layer:

- `owner`
- `admin`
- `member`
- `concierge_limited`

Founder/platform admin access is separate from those roles and is authorized by
`assertFounderUser()` using the founder email allowlist.

### 3. Are platform admin/founder and business owner separated?

Yes by current code:

- Founder/platform admin uses `/admin`, `assertFounderUser()`, and service-role
  server code.
- Business owner/member dashboard uses `/dashboard` and workspace membership.

This separation is good but must be preserved in A1.

### 4. Can platform admin safely list all users?

Partially.

The founder admin console can list paged Auth users and linked business context
after founder authorization. This is internal, service-role-backed, and not a
customer-facing team-management feature.

### 5. Can a business owner list only their own workspace members?

Not as a completed owner-facing route.

The data model and RLS allow member-scoped reads, but there is no completed
`/dashboard/settings/team` owner team-management experience.

### 6. Is safe search/filter for members implemented?

Founder admin user search/filter exists internally.

Owner workspace member search/filter is not implemented as a finished feature.

### 7. Can an owner change member roles safely?

Not approved for implementation yet.

RLS has manager update primitives, but owner role changes need explicit rules,
audit logs, self-demotion protection, last-owner protection, tests, and UI copy.

### 8. Can an owner suspend/remove workspace access safely?

Not approved for implementation yet.

`business_members.status` supports `active`/`disabled`, but owner-facing member
suspension/removal needs a dedicated A1 implementation, audit events, and RLS
proof.

### 9. Does A1 require migrations/RLS?

Likely yes.

At minimum, A1 needs a decision on whether existing `business_members.status`
and `admin_action_log` are enough for owner team audit, or whether a dedicated
`member_action_log` / invite table / role-change history is required.

### 10. What must remain blocked?

Blocked until explicit owner approval and tests:

- Hard deleting real auth users.
- Impersonation.
- Cross-tenant owner user search.
- Owner granting founder/platform admin privileges.
- Owner modifying billing/payment state.
- Production mutations during smoke tests.
- Any real-customer-data admin action without approval.

### 11. Recommended route structure

Future A1 route proposal:

```text
/dashboard/settings/team
/dashboard/settings/team/invitations
/admin?adminPanel=users
```

Owner-facing pages should remain tenant-scoped. Founder pages should remain
internal and clearly separated.

### 12. Required tests before A1 ships

Minimum tests:

```text
pnpm test:unit
pnpm test:rls
pnpm smoke:dashboard -- --base-url=<local-url>
```

Specific coverage:

- Owner can list own workspace members only.
- Owner/admin can invite or disable only within their business.
- Plain member cannot manage users.
- Disabled member loses dashboard access.
- Last owner cannot be removed/demoted.
- Owner cannot grant founder/platform admin access.
- Founder admin actions stay founder-only and audit logged.
- No cross-tenant member visibility.

## Current Safe Recommendation

Do not implement A1 in this pass.

Create a separate A1 implementation prompt after local DB/RLS proof and owner
approval for the exact access model. Keep real customer data and paid pilot
blocked.
