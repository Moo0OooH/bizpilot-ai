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
 * Last Updated: 2026-07-17
 * Change Log:
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
| Date and tester | 2026-07-17, Codex V4.7 source/build verification |
| Commit SHA and tree | Remote functional commit `d9e25bbf50ccf42de2da4d70aa235ab7d289dc91`; tree `17d6b65cc9fb196c8d0d4ccaa46f5fd6f736076d` |
| Target URL and environment | `https://bizpilo.com`, exact V4.7 Production deployment, GET/read-only smoke only |
| Browser, OS, and viewports | Automated source/build and HTTP responsive matrix on Linux; responsive 20/20 passed. Full authenticated interaction remains GATED. |
| Test workspace/user classification |  |
| Screenshots or run links | Owner screenshot visibly renders the role-gated Founder Admin entry; this observes allowlist activation but does not prove protected/Admin route acceptance. |

## Automated gate

Record the exact result of each command. Missing environment variables are `GATED`, not `PASS`.

| Check | Expected | Result/evidence |
| --- | --- | --- |
| `pnpm lint` or direct ESLint binary | Zero errors and warnings | PASS, zero warnings |
| `pnpm typecheck` or `tsc --noEmit` | PASS | PASS |
| `pnpm test:unit` or direct Node test runner | All current tests pass | PASS, 295/295 |
| `pnpm build` or direct Next build | Next.js production build passes | PASS |
| Exact-commit CI and Vercel deployment | Successful checks map to the recorded commit | PASS: GitHub CI run `29558683869` (CI #443); deployment `5484816130` / status `15596534668`; Vercel target `4zpXiTSDYdZjKkwG3ukyaVFj2VwR` |
| Production safe HTTP smokes | Public/locale/responsive/UI/active and inactive Quote GET contracts pass without writes | PASS: public 46/46; responsive 20/20; UI 621/621; active + inactive Quote EN/fr-CA 4/4 HTTP 200; no submission or mutation |
| Local target classifier | Explicitly local/synthetic for authenticated or write smoke | GATED: App/Supabase/DB target variables missing; no authenticated/write smoke authorized |

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

- [ ] Owner A cannot read or mutate Owner B data.
- [ ] Public quote access is limited to active public slugs and approved fields.
- [ ] Google sign-in never creates a workspace silently; a successful provider callback without an existing membership reaches the explicit setup path, while callback/cancel/error behavior remains verified only on an approved synthetic target.
- [ ] Logs, errors, screenshots, and browser output contain no secrets, service-role keys, reset tokens, or unnecessary personal data.
- [ ] No production migration, cleanup, fake user, test lead, or real-customer mutation was performed by this checklist.

## Exit rule

Automated checks plus public read-only QA may complete the code-release gate. Real-data and paid-pilot readiness remain separately `GATED` until the V2 pilot checklist has named evidence for every required row.
