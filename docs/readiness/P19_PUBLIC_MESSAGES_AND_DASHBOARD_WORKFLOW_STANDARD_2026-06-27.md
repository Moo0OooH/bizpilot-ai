# P19 Public Messages and Dashboard Workflow Standard

Date: 2026-06-27
Repo: `E:\bizpilot-ai`
Branch: `main`
Scope: public/auth messages, owner dashboard flashes, Founder/Admin route flashes, and route-level workflow QA.

## Purpose

This pass standardizes user-facing route messages so BizPilot behaves like a
calm product interface instead of a technical log surface.

The rule is simple:

- Public/auth pages must never render raw `error` or `notice` query text.
- Dashboard/Admin flash messages may show known short product messages.
- Technical, provider, database, token, schema, stack, or overlong messages are
  replaced with safe action-oriented fallback copy.
- English and fr-CA auth route messages stay dictionary-owned.
- Owner dashboard and Founder/Admin stay visually calm, searchable, and
  overflow-safe.

## Standards Applied

- WCAG 2.2 error identification and labels:
  https://www.w3.org/WAI/WCAG22/quickref/
- GOV.UK Design System error message guidance:
  https://design-system.service.gov.uk/components/error-message/
- Material Design data table and dashboard scanability principles:
  https://m3.material.io/components/data-tables/overview
- Nielsen Norman Group dashboard usability guidance:
  https://www.nngroup.com/articles/dashboard-design/

## Implementation

Added `lib/i18n/route-messages.ts` as the central route-flash safety layer.

Updated protected and public route rendering:

- `app/auth/sign-in/page.tsx`
- `app/auth/sign-up/page.tsx`
- `app/auth/forgot-password/page.tsx`
- `app/(public)/quote/[slug]/page.tsx`
- `app/(dashboard)/layout.tsx`
- `app/(dashboard)/dashboard/configuration/page.tsx`
- `app/(dashboard)/dashboard/settings/page.tsx`
- `app/(dashboard)/dashboard/business-profile/page.tsx`
- `app/(dashboard)/dashboard/leads/[leadId]/page.tsx`
- `app/admin/page.tsx`

Updated copy dictionary:

- English and fr-CA auth route messages added under `auth.routeMessages`.
- Owner dashboard route fallback messages added under
  `dashboard.routeMessages`.

Added `tests/unit/route-message-safety.test.mts` to lock the behavior.

## Browser QA Evidence

Local target used: `http://localhost:3053`.

Read-only route checks:

| Route | Result |
|---|---|
| `/auth/sign-in?error=Raw database or provider error&notice=<script>bad</script>` | Visible flash text became safe generic auth notice/error. Raw query text did not render in the flash UI. |
| `/quote/akora?error=Raw database or provider error` | Public quote form rendered. Raw provider/database text did not render; public intake fallback appeared. |
| `/dashboard/configuration?error=Raw database or provider error&notice=Business configuration saved.` | Quote Setup rendered. Generic dashboard error shown. No horizontal overflow at desktop width. |
| `/admin?error=Raw database or provider error&notice=Plan updated.` | Founder/Admin opened on Users. Generic admin error shown. No horizontal overflow at desktop width. |
| `/dashboard` mobile 390px viewport | Start Here visible. No horizontal overflow. |
| `/admin` mobile 390px viewport | Users view visible. No horizontal overflow. |

Admin workflow evidence:

- Default admin route opens on `Users`.
- User directory is present.
- User search input is present with placeholder `Name, email, phone`.
- Page size selector defaults to `10`.
- Pagination/status text indicates the shown user count.

## Verification

Passed:

```text
pnpm typecheck
pnpm test:unit
pnpm lint
pnpm build
```

Unit test total after this pass:

```text
156 passing
0 failing
```

## Safety Notes

- No production cleanup, deletion, or destructive admin action was executed.
- Public quote QA was safe GET only.
- Existing uncommitted homepage visual files were left untouched by this pass.
- Dev server `localhost:3053` was already running; no new persistent server was
  needed for QA.

## Decision

P19 is a product-quality hardening pass, not a new feature expansion.

BizPilot now has a central standard for visible route messages:

```text
URL input is not UI copy.
Known safe product messages may render.
Unknown or technical messages become short guided fallbacks.
```

This supports the two-dashboard standard:

- Owner/User Dashboard: calm, guided, first-run oriented, action-first.
- Founder/Admin Dashboard: users-first, searchable, operational, gated, and
  separated from customer CRM behavior.
