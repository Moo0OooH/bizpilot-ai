<!--
 * ============================================================
 * File: docs/operations/BIZPILOT_MANUAL_QA_CHECKLIST_v2.0.md
 * Project: BizPilot AI
 * Description: Current manual acceptance checklist for public, owner, and founder surfaces.
 * Role: Defines evidence required after automated checks and before any real-data or paid-pilot approval.
 * Related:
 * - docs/readiness/BIZPILOT_SOURCE_OF_TRUTH_2026-07-14.md
 * - docs/project-v2/BILINGUAL_ROUTE_AND_FLOW_AUDIT_2026-07-15.md
 * - docs/dashboard-v4/CURRENT.md
 * - docs/operations/BIZPILOT_PILOT_READINESS_CHECKLIST_v2.0.md
 * Author: MoOoH
 * Created: 2026-07-14
 * Last Updated: 2026-07-22
 * Change Log:
 * - 2026-07-22: Recorded final `main`/Vercel Production public and authorized protected read-only acceptance.
 * - 2026-07-22: Recorded restored-target authenticated, Admin, Premium Operations, EN/fr-CA intake, RLS, and Preview visual acceptance.
 * - 2026-07-22: Corrected the historical V4.7 local identity and expanded the Premium Operations database gate to ordered migrations `0025` then `0026`.
 * - 2026-07-21: Corrected V4.7 local Git identity and converted stale remote/Production rows into revalidation gates; added the Premium Operations schema gate.
 * - 2026-07-17: Aligned the checklist with Dashboard V4.7, read-only Production QA, configurable form layouts, optional navigation, Reports, and the single Admin entry.
 * - 2026-07-16: Updated the owner/admin acceptance matrix for Dashboard V4.5 navigation and seven Quote Setup tasks.
 * - 2026-07-15: Recorded the complete V2.1 automated candidate gate and explicit browser/auth/RLS environment gates.
 * - 2026-07-15: Added the complete route/flow audit as the current bilingual acceptance matrix.
 * - 2026-07-14: Replaced the stale phase-specific checklist with the V2 route, language, workflow, and safety acceptance gate.
 * ============================================================
 -->

# BizPilot AI Manual QA Checklist V2.0

Status: current. Interactive, authenticated, or write-capable QA runs only against an approved local, Preview, or disposable synthetic target. Production QA is read-only: do not sign up, submit a quote, create or edit records, change configuration, or use real customer data to complete this checklist.

## Evidence record

| Field | Value |
| --- | --- |
| Date and tester | 2026-07-22, Codex under explicit owner release authorization |
| Commit SHA and tree | Application release merge `6fd1f96a11df4d21a6b7f423e88746b08d2b0fc6` on `main`; final evidence-only attestation resolves with `git rev-parse HEAD`. |
| Target URL and environment | Disposable restored local Supabase + local Next `16.2.11` for write/auth smoke; Vercel PR Preview; `https://bizpilo.com` Production read-only acceptance. |
| Browser, OS, and viewports | Windows; in-app Chromium; public Preview matrix at `1440×900` and `390×844`; authenticated restored-target route smoke. |
| Test workspace/user classification | Generated `@example.test` synthetic owner/founder workspaces only; removed by final local database reset. |
| Screenshots or run links | Preview public matrix covered Home, Features, Pricing, FAQ in EN/fr-CA; restored authenticated smoke covered Operations and all Admin panels without printing secrets or customer rows. |

## Automated gate

Record the exact result of each command. Missing environment variables are `GATED`, not `PASS`.

| Check | Expected | Result/evidence |
| --- | --- | --- |
| `pnpm lint` or direct ESLint binary | Zero errors and warnings | PASS on the exact local candidate. |
| `pnpm typecheck` or `tsc --noEmit` | PASS | PASS on the exact local candidate. |
| `pnpm test:unit` or direct Node test runner | All current tests pass | PASS: `359/359` across 64 suites. |
| `pnpm audit:supabase` and local `pnpm test:rls` | Policies and explicit grants pass; RLS target is approved local/disposable | PASS: static audit has zero missing/overbroad grants; executable RLS passes `14/14` on clean local and `14/14` on the restored Production export after reconciled `0023`, `0025`, `0026`. |
| `pnpm build` or direct Next build | Next.js production build passes | PASS with Next.js `16.2.11`; `/dashboard/operations` appears in the production route manifest. |
| Exact-commit CI and Vercel deployment | Successful checks map to the recorded candidate commit | PASS: main CI `29940488561`; Vercel Production `GtnfSgbNT3u2tSgjiVnmKxVXgpAY` Ready for merge SHA `6fd1f96`. |
| Production safe HTTP smokes | Public/locale/responsive/UI/active and inactive Quote GET contracts pass without writes | PASS for public acceptance: `16/16` Home/Features/Pricing/FAQ EN/fr-CA desktop/mobile states with zero recorded failure. Active submission remains disposable-target-only and passed there. |
| Local target classifier | Explicitly local/synthetic for authenticated or write smoke | PASS: local Supabase/API/DB targets were injected only into the disposable smoke process; dense authenticated dashboard/Admin passed `17/17`, active quote GET `2/2`, and independent EN/fr-CA submissions reached success. |

## Public website

Test English and Canadian French at 390, 768, 1280, and 1440 CSS pixels plus keyboard-only navigation.

- [ ] Header, mobile menu, language switcher, theme control, footer, and all internal links work.
- [ ] Changing language updates visible navigation, headings, forms, errors, metadata, and footer without mixed-language fragments.
- [ ] Hero is readable without clipping, horizontal overflow, oversized type, or a first-viewport nested scroll.
- [ ] Product claims accurately describe a shared Smart Intake Link, structured requests, owner-reviewed drafts, and manual copy/send.
- [ ] No page implies direct social inbox integration, autonomous sending, booking confirmation, invented pricing, payment collection, or a full CRM.
- [ ] Sign-in, sign-up, password-reset, privacy, terms, demo, pricing, and contact/pilot CTAs resolve correctly.
- [ ] Focus indicators, labels, landmarks, contrast, reduced motion, zoom at 200%, and touch targets are usable.
- [ ] No severe console error, failed first-party request, missing asset, layout shift, or stuck loading state appears.

## Owner dashboard

- [ ] Signed-out dashboard access redirects safely to sign-in.
- [ ] Desktop sidebar exposes grouped Overview, Leads, Reports, Quote Setup, Business Profile, Settings, and the enabled Guide route; compact/mobile navigation remains complete without clipping or horizontal overflow.
- [ ] Overview shows one clear primary action, compact readiness, honest metrics, current priorities, and a short lead queue.
- [ ] Leads filters, empty states, pagination, status badges, urgency, and deep links remain usable in both languages.
- [ ] Lead detail exposes source answers and missing information, lets the owner edit and copy a draft, and never sends automatically.
- [ ] Quote Setup uses its seven canonical tasks (Overview, Services, Form Questions, Branding, AI Instructions, Privacy, Public Link); the setup stages point to the correct task and save, refresh, validation, success, and error states work on an approved synthetic target.
- [ ] Form Questions lets the owner configure customer-facing section titles/descriptions, assign fields, reorder sections, and choose list, tabs, or multi-step presentation without losing legacy form data.
- [ ] Reports shows tenant-scoped source/campaign, status, and manually recorded outcome summaries without inventing clicks, revenue, or attribution.
- [ ] Business Profile and Settings avoid duplicate configuration; language and theme persist, and optional Reports/Guide visibility changes only those secondary navigation entries.
- [ ] Long names, email addresses, URLs, French labels, and customer answers wrap without overlap or horizontal scroll.
- [ ] Loading, empty, partial-data, provider-fallback, and permission-error states remain calm and actionable.

## Founder/Admin

- [ ] Signed-out users redirect to sign-in and normal owners cannot view founder data.
- [ ] `/founder` resolves to the authorized destination without bypassing founder checks.
- [ ] Authorized founders see exactly one Founder Admin entry in the shell; there is no duplicate top/bottom Admin control. Unauthorized owners never see it and cannot open `/admin` directly.
- [ ] Overview uses localized, honest account/health data and does not present decorative revenue or conversion claims.
- [ ] Search, tabs, pagination, status controls, audit history, and guarded actions work for a founder-approved synthetic account.
- [ ] Any destructive, access, lifecycle, or production-data control requires its documented confirmation and evidence procedure.

## Tenant and data safety

- [x] Owner A cannot read or mutate Owner B data; executable RLS tenant-isolation fixtures pass.
- [x] Public quote access is limited to active public slugs and approved fields; active/inactive and cross-form RLS fixtures pass.
- [ ] Google sign-in never creates a workspace silently; a successful provider callback without an existing membership reaches the explicit setup path, while callback/cancel/error behavior remains verified only on an approved synthetic target.
- [x] Logs, errors, screenshots, and browser output contain no secrets, service-role keys, reset tokens, or unnecessary personal data.
- [x] No Production cleanup, fake user, test lead, real-customer mutation, or entitlement activation was performed by this checklist; all writes were disposable synthetic fixtures.

## Exit rule

Automated checks plus public read-only QA may complete the code-release gate. Real-data and paid-pilot readiness remain separately `GATED` until the V2 pilot checklist has named evidence for every required row.
