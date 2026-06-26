# A2 Admin And Owner Console Audit And Implementation Plan

Date: 2026-06-26
Repo: `E:\bizpilot-ai`
Branch: `review/p10-hero-admin-console-polish`

## Decision

```text
A2 implementation is not safe to start in this pass.
Stop after audit/spec and create a security/RLS gate proposal.
```

Reason: owner-facing user/team management would require route design, server
actions, last-owner protection, audit logging, invitation rules, and RLS proof.
Those changes touch security boundaries and must not be mixed into P10 public
homepage polish.

## Files Inspected

- `app/admin/page.tsx`
- `app/(dashboard)/founder/page.tsx`
- `server/actions/founder-admin.actions.ts`
- `server/services/founder-admin.service.ts`
- `server/repositories/founder-admin.repository.ts`
- `server/repositories/business-members.repository.ts`
- `server/policies/business-membership.policy.ts`
- `server/services/owner-system-log.service.ts`
- `types/database.ts`
- `supabase/migrations/0001_auth_tenant_foundation.sql`
- `supabase/migrations/0015_business_access_plan_and_admin_log.sql`
- `tests/rls/rls-helper-functions.test.sql`
- `tests/rls/business-access-plan-admin-log.test.sql`
- `tests/unit/founder-admin-source.test.mts`
- `tests/unit/founder-auth-user-deletion.test.mts`

## Current Architecture

Existing tables/types:

- `auth.users`
- `public.profiles`
- `public.businesses`
- `public.business_members`
- `public.admin_action_log`

Current business member roles:

- `owner`
- `admin`
- `member`
- `concierge_limited`

Current member status:

- `active`
- `disabled`

Current admin/founder surface:

- `/admin` is internal founder-only.
- `/admin` uses founder authorization before service-role-backed operations.
- Founder user search, workspace repair, plan/access controls, quote link
  toggles, health checks, cleanup tools, and auth user deletion guards already
  exist internally.

Current owner dashboard surface:

- No completed `/dashboard/settings/team` route exists.
- Owner/member dashboard is tenant-scoped, but team-management UI and actions
  are not implemented.

## Gaps Blocking A2 Implementation

Owner console/user management needs explicit decisions for:

- Whether owners can invite users or only founder support can add users during
  pilot.
- Whether admins can manage members or only owners can.
- Whether `concierge_limited` is owner-visible.
- Whether disabling a member is soft-remove, suspend, or revoke access.
- Last-owner protection.
- Self-demotion and self-disable rules.
- Audit log ownership: reuse `admin_action_log` or create an owner-visible
  member action log.
- Invitation table and token lifecycle.
- Email delivery path for invites, if any.
- RLS proof for list, invite, update role, disable, and audit reads.
- UI route structure and owner-facing copy.

## Safe Future Route Proposal

Future A2 routes could be:

```text
/dashboard/settings/team
/dashboard/settings/team/invitations
/admin?adminPanel=users
```

Owner routes must remain tenant-scoped. Founder routes must remain internal and
founder-authorized.

## Recommended Implementation Phases

A2-A: security model decision

- Confirm allowed roles and actions.
- Confirm whether owner invites are in scope before real data.
- Confirm audit log model.

A2-B: RLS and schema gate

- Add or confirm required tables/policies.
- Prove tenant isolation in local DB tests.

A2-C: server actions

- Implement tenant-scoped list/invite/update/disable actions.
- Enforce last-owner and self-action protections.

A2-D: owner UI

- Add `/dashboard/settings/team`.
- Keep copy dictionary-backed in EN/fr-CA.
- Avoid service-role client exposure.

A2-E: verification

- `pnpm test:unit`
- `pnpm test:rls`
- `pnpm verify:local-db`
- `pnpm smoke:dashboard -- --base-url=<local-url>` against local/synthetic
  Supabase only.

## Must Not Be Implemented In This Pass

- Client-only role changes.
- Cross-tenant user search for owners.
- Hard delete of real auth users.
- Impersonation.
- Owner granting founder/platform admin privileges.
- Production user mutations during smoke tests.
- Real customer data admin actions.
- Billing/payment changes.

## Recommendation

Create and approve the A2 security/RLS gate before implementation. P10 can ship
public homepage polish and reports without A2 product implementation.

Real data and paid pilot remain blocked.
