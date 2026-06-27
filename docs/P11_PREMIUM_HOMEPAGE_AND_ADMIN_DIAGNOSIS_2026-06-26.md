# P11 Premium Homepage And Admin Diagnosis

Date: 2026-06-26
Repo: `E:\bizpilot-ai`
Branch: `review/p11-premium-home-admin-foundation`
Base commit: `ebb2156e71c6bb3d41b42827b7e63020b16ce8a0`

## Decision Before Implementation

P11 can start as a scoped public homepage and safe founder-admin UX pass.

Real customer data, paid pilot, production writes, schema/RLS changes, auth
changes, AI provider changes, billing/payment changes, and autonomous sending
remain blocked.

## Documents Read

- `docs/CURRENT_CANONICAL_DOCS_v1.7.md` - latest source-of-truth map.
- `docs/AI_CODING_AGENT_START_HERE_v1.7.md` - execution and safety rules.
- `docs/readiness/CURRENT_PROJECT_STATUS_2026-06-26.md` - current P8/D1/P9/A1 state.
- `docs/readiness/POST_P8_D1_RELEASE_HYGIENE_AND_NEXT_GATES_2026-06-26.md` - hygiene, warning triage, and current blockers.
- `docs/P10_PUBLIC_SITE_VISUAL_AND_LANGUAGE_FINAL_REPORT_2026-06-26.md` - prior public visual status.
- `docs/readiness/P10_A2_PREMIUM_HERO_ADMIN_CONSOLE_REPORT_2026-06-26.md` - P10 test and A2 gate status.
- `docs/A2_ADMIN_OWNER_CONSOLE_SECURITY_RLS_GATE_PROPOSAL_2026-06-26.md` - admin/owner access gate.
- `docs/D1_FULL_PROJECT_REVIEW_AND_QA_REPORT_2026-06-26.md` - dashboard D1 evidence and boundaries.

## Current Repo State

- Working tree before implementation: clean.
- `HEAD` and `origin/main`: `ebb2156e71c6bb3d41b42827b7e63020b16ce8a0`.
- Package manager: `pnpm@10.18.3`.
- Key scripts: `verify`, `verify:local-db`, `smoke:public`, `smoke:responsive`, `smoke:quote`, `smoke:ui-matrix`, `smoke:dashboard`.

## Visual And Route Diagnosis

Homepage:

- Current hero has the correct chaos-to-clarity story and manual-first copy.
- Current hero visual still reads too much like a diagram: chips, cards, and arrows are functional but not premium enough.
- Channel/source cards are text-first; the pain would be clearer with recognizable icon treatments.
- Output panel can feel more valuable with stronger priority/draft hierarchy.
- Mobile simplification is already present, but the visual can be made calmer and more intentional.

Public routes:

- Existing route and smoke coverage already covers the public pages requested in the prompt.
- No public page should introduce trial, fake proof, full CRM, auto-send, invented price, booking, billing, invoice, SMS, or WhatsApp claims.
- Legal/privacy/security meaning should not be rewritten.

Admin/founder:

- `/admin` already has a founder-only service-backed user list, search, filters, and expandable user details.
- Existing `/admin?adminPanel=users` still shows a business master/detail rail beside the users list, which can make the Users tab feel like a Businesses panel.
- Several account tools are real founder-only mutations. P11 must not add owner-facing user management or new mutation paths.
- Safe fix: make the Users tab visually start with Users, search/filter/list/detail, and show access-management actions as disabled behind the owner-approved security gate.

## Exact Files Likely To Change

Implementation:

- `app/page.tsx`
- `app/globals.css`
- `app/admin/page.tsx`

Copy/tests if required:

- `lib/i18n/public-site-copy.ts`
- `tests/unit/i18n-copy.test.mts`
- `tests/unit/public-visual-stability-source.test.mts`

Reports:

- `docs/P11_PREMIUM_HOMEPAGE_AND_ADMIN_DIAGNOSIS_2026-06-26.md`
- `docs/P11_PUBLIC_SITE_FINAL_VISUAL_QA_REPORT_2026-06-26.md`
- `docs/P11_DASHBOARD_ADMIN_LANGUAGE_AND_UX_AUDIT_2026-06-26.md`
- `docs/A2_ADMIN_OWNER_CONSOLE_SECURITY_RLS_GATE_PROPOSAL_2026-06-26.md`
- `docs/A2_ADMIN_OWNER_CONSOLE_FOUNDATION_REPORT_2026-06-26.md` if a safe foundation is implemented.
- `docs/readiness/P11_PREMIUM_PUBLIC_SITE_AND_ADMIN_FOUNDATION_REPORT_2026-06-26.md`

## Files Forbidden For This Pass

- `supabase/**`
- `types/database.ts`
- `lib/supabase/**`
- auth route/callback behavior
- AI provider files
- billing/payment files
- production data-flow files
- migrations
- real customer data handling

## Implementation Plan

1. Upgrade homepage hero into a premium signal-flow board using existing CSS and icon primitives only.
2. Keep EN/fr-CA public copy structurally synced and manual-first.
3. Do a light public-site pass for claim/scope safety without rewriting legal meaning.
4. Adjust `/admin?adminPanel=users` so the selected Users view starts with a clear user list/search/detail pattern instead of a Businesses-first rail.
5. Keep all new access-management actions disabled with `Requires owner-approved security gate.`.
6. Create P11 QA/foundation/readiness reports.
7. Run `pnpm verify`, `git diff --check`, local public smokes, browser visual checks, and DB/dashboard checks only when local targets are confirmed.

## Owner Visual Acceptance Criteria

- Homepage looks premium and calmer than P8/P10.
- Pain is obvious in under five seconds.
- Chaos side shows recognizable channels without visual clutter.
- BizPilot node clearly represents capture, organize, prioritize, draft.
- Clarity side clearly shows a lead queue and owner-review draft.
- No send icon or auto-send implication.
- EN/fr-CA, light/dark, desktop/mobile fit without horizontal overflow.
- Users tab in admin no longer visually reads as Businesses.

