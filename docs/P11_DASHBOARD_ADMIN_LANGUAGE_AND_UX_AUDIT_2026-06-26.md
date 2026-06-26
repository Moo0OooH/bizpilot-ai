# P11 Dashboard Admin Language And UX Audit

Date: 2026-06-26
Repo: `E:\bizpilot-ai`
Branch: `review/p11-premium-home-admin-foundation`

## Scope

Dashboard D1 owner routes were audited but not redesigned. P11 changed only the
founder-only `/admin` Users tab UX so it no longer visually starts as a
Businesses panel when Users is selected.

## Dashboard Routes Reviewed

```text
/dashboard
/dashboard/leads
/dashboard/leads/[leadId]
/dashboard/business-profile
/dashboard/configuration
/dashboard/settings
/dashboard/quote-setup
/dashboard/error
/admin
/founder
```

## Findings

- D1 dashboard remains local synthetic only.
- Owner-facing dashboard surfaces already use the EN/fr-CA dictionary for the
  inspected D1 routes.
- `/admin` is intentionally founder-only and operational English.
- The Users tab previously displayed a business master/detail rail before the
  user list, which made the selected tab feel inconsistent.
- Existing founder admin service code can list/search users after founder-only
  authorization, but owner-facing team management is still not approved.

## Implemented Safe UX Fix

Changed `/admin?adminPanel=users` to:

- start with a Users page header,
- show user summary metrics,
- preserve search/filter/list/detail,
- label expandable user rows as `Details`, not `Modify`,
- show read-only account/workspace detail,
- show disabled access-management actions with:
  `Requires owner-approved security gate.`

No admin server actions, repositories, service-role logic, RLS, auth, schema, or
database code was changed.

## Files Changed

```text
app/admin/page.tsx
```

## Remaining Blockers

- Owner-facing `/dashboard/settings/team` remains blocked.
- Access mutation actions require owner-approved schema/RLS/security gate.
- Real data and paid pilot remain blocked.

