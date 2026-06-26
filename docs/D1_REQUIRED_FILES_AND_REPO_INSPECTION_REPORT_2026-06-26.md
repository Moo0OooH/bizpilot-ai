# TEMP D1 Required Files And Repo Inspection Report

Date: 2026-06-26
Repo: `E:\bizpilot-ai`
Scope: D1 dashboard shell and lead workflow visual stabilization only

## A. Current Repo State

| Item | Result |
|---|---|
| Branch | `main` |
| Remote branch | `origin/main` |
| Latest synced baseline | `dff69bcfd0de931fb58d9429e199ae3f47f05bfb` |
| Package manager | `pnpm@10.18.3` |
| Framework | Next.js `16.2.4`, React `19.2.4` |

Relevant scripts found in `package.json`:

```text
pnpm dev
pnpm build
pnpm start
pnpm lint
pnpm typecheck
pnpm verify
pnpm verify:local-db
pnpm test:unit
pnpm test:rls
pnpm smoke:dashboard
pnpm smoke:public
pnpm smoke:responsive
pnpm smoke:quote
pnpm smoke:ui-matrix
```

## B. Canonical Docs Read

| File | Why it matters | Latest decision found | Conflict notes |
|---|---|---|---|
| `docs/CURRENT_CANONICAL_DOCS_v1.7.md` | Active source-of-truth map. | P8 and D1 are on `main`; real data and paid pilot remain blocked. | Older broad platform language is long-term only. |
| `docs/AI_CODING_AGENT_START_HERE_v1.7.md` | Agent execution rules. | Inspect repo first; do not expand scope; AI stays owner-reviewed. | None for D1. |
| `docs/readiness/CURRENT_PROJECT_STATUS_2026-06-26.md` | Short active project state. | D1 is code/test/visual ready on local synthetic data. | Dashboard smoke requires local Supabase only. |
| `docs/P8_PUBLIC_SITE_CLARITY_FINAL_REPORT_2026-06-26.md` | Public homepage acceptance. | Public site P8 is on `main`; no auto-send or trial copy. | Public work should not be reopened unless a defect is found. |
| `docs/D1_FULL_PROJECT_REVIEW_AND_QA_REPORT_2026-06-26.md` | D1 acceptance evidence. | D1 visually accepted for local synthetic dashboard scope. | Does not approve real data or paid pilot. |
| `docs/readiness/CRITICAL_PUBLIC_SITE_VISUAL_ACCEPTANCE_2026-06-21.md` | Public-site visual baseline. | Public site GO before D1. | Superseded where 2026-06-26 status differs. |
| `docs/readiness/FINAL_GLOBAL_VISUAL_SIZING_ACCEPTANCE_2026-06-21.md` | EN/fr-CA sizing and visual standard evidence. | Multilingual responsive sizing accepted. | Applies to D1 copy fit and visual checks. |

## C. Existing Dashboard Files Found

Dashboard routes:

```text
app/(dashboard)/layout.tsx
app/(dashboard)/dashboard/page.tsx
app/(dashboard)/dashboard/error.tsx
app/(dashboard)/dashboard/leads/page.tsx
app/(dashboard)/dashboard/leads/[leadId]/page.tsx
app/(dashboard)/dashboard/business-profile/page.tsx
app/(dashboard)/dashboard/configuration/page.tsx
app/(dashboard)/dashboard/quote-setup/page.tsx
app/(dashboard)/dashboard/settings/page.tsx
app/(dashboard)/founder/page.tsx
app/admin/page.tsx
```

Dashboard components:

```text
components/dashboard/dashboard-shell.tsx
components/dashboard/dashboard-sidebar.tsx
components/dashboard/dashboard-theme.tsx
components/dashboard/dashboard-topbar.tsx
components/dashboard/dashboard-ui.tsx
components/dashboard/lead-workspace-queue.tsx
components/dashboard/copy-button.tsx
components/dashboard/flash-message.tsx
components/dashboard/configuration-tabs.tsx
components/dashboard/custom-quote-field-builder.tsx
components/dashboard/workspace-deletion-request-form.tsx
```

Lead workflow and services:

```text
server/services/lead-conversion.service.ts
server/services/lead-conversion-rules.service.ts
server/services/ai/lead-conversion-assistant.service.ts
server/actions/ai-lead-assistant.actions.ts
server/actions/lead-conversion.actions.ts
server/repositories/lead-conversion.repository.ts
```

Copy/localization:

```text
lib/i18n/bizpilot-copy.ts
lib/i18n/language.ts
lib/i18n/README.md
```

CSS/tokens:

```text
app/globals.css
components/dashboard/dashboard-theme.tsx
components/dashboard/dashboard-ui.tsx
```

Tests and smokes:

```text
tests/unit/i18n-copy.test.mts
tests/unit/dashboard-shell-copy.test.mts
tests/unit/lead-conversion-rules.test.mts
tests/smoke/dashboard-auth-smoke.mts
tests/smoke/final-ui-matrix-smoke.mts
tests/rls/lead-conversion-desk.test.sql
tests/rls/auth-tenant-foundation.test.sql
```

## D. Files Likely Needed For D1

1. Dashboard shell

```text
app/(dashboard)/layout.tsx
components/dashboard/dashboard-shell.tsx
components/dashboard/dashboard-theme.tsx
components/dashboard/dashboard-ui.tsx
```

2. Dashboard topbar/sidebar

```text
components/dashboard/dashboard-topbar.tsx
components/dashboard/dashboard-sidebar.tsx
```

3. Dashboard overview

```text
app/(dashboard)/dashboard/page.tsx
components/dashboard/lead-workspace-queue.tsx
lib/i18n/bizpilot-copy.ts
```

4. Leads inbox/list

```text
app/(dashboard)/dashboard/leads/page.tsx
components/dashboard/lead-workspace-queue.tsx
server/services/lead-conversion.service.ts
```

5. Lead detail page

```text
app/(dashboard)/dashboard/leads/[leadId]/page.tsx
server/services/lead-conversion.service.ts
server/services/lead-conversion-rules.service.ts
```

6. AI draft / owner-review UI

```text
app/(dashboard)/dashboard/leads/[leadId]/page.tsx
components/dashboard/copy-button.tsx
server/actions/ai-lead-assistant.actions.ts
server/services/ai/lead-conversion-assistant.service.ts
```

7. Empty/sample states

```text
app/(dashboard)/dashboard/page.tsx
app/(dashboard)/dashboard/leads/page.tsx
lib/i18n/bizpilot-copy.ts
```

8. Copy/localization EN/fr-CA

```text
lib/i18n/bizpilot-copy.ts
lib/i18n/language.ts
tests/unit/i18n-copy.test.mts
```

9. Visual tokens/CSS

```text
app/globals.css
components/dashboard/dashboard-theme.tsx
components/dashboard/dashboard-ui.tsx
```

10. Tests/smoke

```text
tests/unit/i18n-copy.test.mts
tests/unit/dashboard-shell-copy.test.mts
tests/unit/lead-conversion-rules.test.mts
tests/smoke/dashboard-auth-smoke.mts
tests/smoke/final-ui-matrix-smoke.mts
```

## E. Files That Must Not Be Touched For D1

Do not touch these without a separate owner-approved gate:

```text
supabase/migrations/**
types/database.ts
lib/supabase/**
server/services/auth.service.ts
server/actions/auth.actions.ts
server/services/ai/provider or provider config files
billing/payment/Stripe files, if added later
production data-flow files that create or mutate real customer data
real customer data exports/imports
```

## F. Safe D1 Implementation Plan

| Phase | Scope |
|---|---|
| D1-A | Dashboard inventory and acceptance criteria. |
| D1-B | Shell, topbar, and sidebar visual stabilization. |
| D1-C | Lead inbox/list clarity. |
| D1-D | Lead detail manual workflow clarity. |
| D1-E | EN/fr-CA copy parity and manual-first wording. |
| D1-F | Safe smoke tests and final report. |

## G. Exact Tests That Can Be Safely Run

Commands exist in `package.json`:

```text
pnpm verify
pnpm test:unit
pnpm smoke:public
pnpm smoke:responsive
pnpm smoke:ui-matrix
pnpm smoke:quote
pnpm smoke:dashboard
pnpm verify:local-db
pnpm test:rls
```

Safety constraints:

- `pnpm smoke:dashboard` is safe only against a confirmed local/synthetic Supabase target.
- `pnpm verify:local-db` and `pnpm test:rls` are safe only against a confirmed local database target.
- Production checks must be GET/DOM only and must not submit real data.

## H. Final Recommendation

D1 was safe to start only as local synthetic dashboard visual stabilization.
It was not safe to start real-data, paid-pilot, billing, auth/RLS/database,
AI-provider, or production-data-flow work.

Files that D1 could touch were limited to dashboard UI, copy, visual tokens, and
tests. Real data and paid pilot remain blocked until explicit owner approval and
local DB/RLS proof are recorded.
