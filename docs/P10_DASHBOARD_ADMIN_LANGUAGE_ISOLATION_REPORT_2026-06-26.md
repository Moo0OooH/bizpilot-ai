# P10 Dashboard And Admin Language Isolation Report

Date: 2026-06-26
Repo: `E:\bizpilot-ai`
Branch: `review/p10-hero-admin-console-polish`

## Decision

Dashboard language isolation remains acceptable for P10.

No dashboard, admin, server, database, RLS, auth, AI provider, billing, or
production data-flow code was changed in this phase.

## Scope Audited

Owner-facing dashboard files:

- `app/(dashboard)/layout.tsx`
- `app/(dashboard)/dashboard/page.tsx`
- `app/(dashboard)/dashboard/leads/page.tsx`
- `app/(dashboard)/dashboard/leads/[leadId]/page.tsx`
- `app/(dashboard)/dashboard/error.tsx`
- `app/(dashboard)/dashboard/settings/page.tsx`
- `app/(dashboard)/dashboard/business-profile/page.tsx`
- `app/(dashboard)/dashboard/configuration/page.tsx`
- `components/dashboard/dashboard-shell.tsx`
- `components/dashboard/dashboard-sidebar.tsx`
- `components/dashboard/dashboard-topbar.tsx`
- `components/dashboard/lead-workspace-queue.tsx`
- `components/dashboard/workspace-deletion-request-form.tsx`
- `lib/i18n/bizpilot-copy.ts`
- `tests/unit/i18n-copy.test.mts`
- `tests/unit/dashboard-shell-copy.test.mts`

Internal admin/founder files sampled:

- `app/admin/page.tsx`
- `app/(dashboard)/founder/page.tsx`
- `server/actions/founder-admin.actions.ts`
- `server/services/founder-admin.service.ts`
- `server/repositories/founder-admin.repository.ts`

## Findings

Owner-facing dashboard:

- Routes and components read visible dashboard labels from
  `getBizPilotCopy(activeLanguage).dashboard`.
- The active dashboard language is resolved through
  `resolveWorkspaceInterfaceLanguage`.
- The D1 error boundary reads `dashboard.errorBoundary` from the dictionary.
- Unit coverage confirms EN/fr-CA dashboard copy shape, legacy wording guards,
  and the error-boundary dictionary path.

Internal admin/founder:

- `/admin` is founder-only and internal.
- `/dashboard/founder` is explicitly marked not owner-facing.
- These surfaces contain English operational labels by design and are not part
  of P10 public language polish.
- Changing admin/founder language in this pass would mix localization with
  access-management scope and is not recommended.

## Safe Exceptions

The following are intentional and not P10 defects:

- `BizPilot` brand text.
- Technical filenames, route names, enum values, test names, comments, and
  internal IDs.
- Internal founder/admin operational copy.
- Server-side error allowlists that sanitize founder admin redirects.

## Verification

Already run during P10 implementation:

```text
pnpm test:unit
```

Result:

```text
PASS - 139/139 tests
```

## Recommendation

Do not change dashboard/admin language behavior in P10.

Keep admin/owner user-management work in A2 audit/gate scope. Real data and
paid pilot remain blocked.
