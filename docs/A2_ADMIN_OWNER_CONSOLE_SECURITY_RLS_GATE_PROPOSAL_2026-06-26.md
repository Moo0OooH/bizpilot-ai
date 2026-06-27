# A2 Admin Owner Console Security And RLS Gate Proposal

Date: 2026-06-26
Repo: `E:\bizpilot-ai`
Status: proposal only

## Gate Decision Required

A2 owner/admin user management must not start until this gate is approved.

The repo has a safe founder-only admin console and a tenant-scoped owner
dashboard, but it does not yet have a completed owner-facing team-management
route with local RLS proof.

## P11 Foundation Addendum

P11 added a safe founder-admin Users foundation in `/admin?adminPanel=users`.
This is read-only at the Users-tab level and does not approve owner-facing
access management.

The P11 Users view may show future actions such as invite, change role,
suspend access, and remove access, but those actions are disabled and labeled:

```text
Requires owner-approved security gate.
```

This addendum does not approve schema, RLS, auth, migrations, owner team
management, cross-tenant owner visibility, real customer data, or paid pilot.

## Proposed Owner-Approved Scope

Allowed after gate approval:

- Owner lists members in their own business only.
- Owner/admin sees member name, email, role, status, created date, and last
  activity if already available.
- Owner/admin can disable a non-owner member within the same business.
- Owner can change member/admin roles within the same business if explicitly
  approved.
- Owner cannot remove or demote the last owner.
- Owner cannot grant founder/platform admin access.
- All actions are audited.

Still blocked unless separately approved:

- Hard delete auth users.
- Impersonation.
- Cross-tenant user search.
- Production synthetic writes.
- Billing/payment changes.
- SMS/WhatsApp/email automation.
- Real-customer-data actions before real-data approval.

## RLS Proof Required

Minimum local DB/RLS tests:

- Owner can list own members.
- Owner cannot list another business's members.
- Admin can list own members only if product decision allows it.
- Member cannot manage users.
- Disabled member loses dashboard/member helper access.
- Owner cannot disable/demote last owner.
- Owner cannot change `auth.users` directly.
- Owner cannot grant founder/platform admin.
- Founder admin remains founder-only and service-role-backed.

## Schema Decision Needed

Choose one:

1. Reuse `business_members.status` and `admin_action_log`.
2. Add a dedicated owner-visible member audit log.
3. Add invitations table and token lifecycle.

If option 2 or 3 is selected, migrations and RLS policies are required and must
be approved separately.

## Server Action Requirements

Future server actions must:

- Run server-only.
- Resolve current user from Supabase auth.
- Resolve active business membership.
- Enforce tenant scope before every read/write.
- Re-check last-owner/self-action protections server-side.
- Log a sanitized audit event.
- Never expose service-role clients to the browser.

## UI Requirements

Future UI must:

- Live under `/dashboard/settings/team`.
- Use `lib/i18n/bizpilot-copy.ts` for EN/fr-CA.
- Show clear manual/support boundaries.
- Avoid "full CRM" wording.
- Avoid implying automated onboarding or billing.

## Recommended Next Prompt

```text
Approve A2 security/RLS gate for local-only owner team management.
Work only in E:\bizpilot-ai on a review branch.
Do not touch production data.
Design and implement /dashboard/settings/team only after adding local RLS proof
for tenant-scoped member listing and member status changes.
If a migration is required, create it separately and run pnpm verify:local-db.
Real data and paid pilot remain blocked.
```
