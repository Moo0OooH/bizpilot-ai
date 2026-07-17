<!--
 * ============================================================
 * File: docs/project-v2/BILINGUAL_ROUTE_AND_FLOW_AUDIT_2026-07-15.md
 * Project: BizPilot AI
 * Description: Complete route, locale, navigation, metadata, state, and workflow audit for the current application.
 * Role: Records what is source-verified, read-only Production-verifiable, or gated by authenticated/synthetic access.
 * Related:
 * - tests/smoke/public-route-smoke.mts
 * - tests/smoke/dashboard-auth-smoke.mts
 * - docs/operations/BIZPILOT_MANUAL_QA_CHECKLIST_v2.0.md
 * Author: MoOoH
 * Created: 2026-07-15
 * Last Updated: 2026-07-17
 * Change Log:
 * - 2026-07-17: Added Dashboard V4.7 form layouts, Reports/navigation controls, single Admin entry, Google callback safety, and exact-release evidence boundaries.
 * - 2026-07-16: Added the protected bilingual Reports route and source-reporting evidence boundary.
 * - 2026-07-15: Created the exhaustive EN/fr-CA route, state, and end-to-end workflow audit.
 * ============================================================
 -->

# BizPilot Bilingual Route and Flow Audit — 2026-07-15

## Audit model

- `SOURCE PASS`: implementation and source/unit contracts prove the stated behavior.
- `PUBLIC PASS`: safe GET/read-only Production check proves the rendered surface.
- `GATED`: the workflow needs an approved authenticated or write-capable synthetic target.
- `NOT APPLICABLE`: internal callback/redirect has no standalone content page.

Current V4.7 baseline: functional remote commit `d9e25bbf50ccf42de2da4d70aa235ab7d289dc91`, tree `17d6b65cc9fb196c8d0d4ccaa46f5fd6f736076d`; local lint, typecheck, build, and 295/295 tests pass. GitHub CI run `29558683869` (CI #443), deployment `5484816130` / status `15596534668`, and Vercel target `4zpXiTSDYdZjKkwG3ukyaVFj2VwR` succeeded. Production read-only smoke passed at public 46/46, responsive 20/20, UI 621/621, and active + inactive Quote EN/fr-CA 4/4 HTTP 200 without submission or mutation.

## Route inventory

| Surface | Route(s) | EN/fr-CA source | Runtime/evidence state | Notes |
| --- | --- | --- | --- | --- |
| Marketing | `/` | SOURCE PASS | Public smoke included | Product problem, one-link workflow, human review |
| Marketing | `/features` | SOURCE PASS | Public smoke included | Capability/boundary page |
| Demo | `/demo` | SOURCE PASS | Public smoke included | Cleaning-first, no submission/send |
| Pricing | `/pricing` | SOURCE PASS | Public smoke included | Manual approval/billing boundary |
| Pilot | `/pilot` | SOURCE PASS | Public smoke included | Copy-only founder application flow |
| Resources | `/faq`, `/trust` | SOURCE PASS | Public smoke included | Objections, controls, evidence boundaries |
| Legal | `/privacy`, `/security`, `/terms` | SOURCE PASS | Public smoke included | Shared bilingual policy renderer |
| Compatibility redirects | `/comparison`, `/quote-link-guide`, `/faster-quote-replies`, `/content-studio`, `/industries/cleaning` | Query/hash persistence SOURCE PASS | Exact 308 smoke included | No duplicate page restored |
| Auth | `/auth/sign-in`, `/auth/sign-up`, `/auth/check-email`, `/auth/forgot-password`, `/auth/reset-password` | SOURCE PASS | Direct EN/fr-CA GET smoke included | Forms remain noindex; write/email flows GATED |
| Auth callback | `/auth/callback` | NOT APPLICABLE | Unit routing PASS; provider runtime GATED | Constrained callback destinations; Google login does not silently create a workspace |
| Intake base | `/quote` | SOURCE PASS | Direct EN/fr-CA unavailable GET smoke included | Safe missing-link state |
| Intake dynamic | `/quote/[slug]` | SOURCE PASS | Active + inactive EN/fr-CA GET 4/4 PASS; submission flow GATED | No Production submission |
| Intake success | `/quote/[slug]/success` | SOURCE PASS | GATED by approved active synthetic flow | No booking/price/availability promise |
| Owner | `/dashboard` | SOURCE PASS | Authenticated visual/data flow GATED | Overview and next action |
| Owner | `/dashboard/leads` | SOURCE PASS | Authenticated visual/data flow GATED | Search/filter/sort/pagination |
| Owner | `/dashboard/leads/[leadId]` | SOURCE PASS | Authenticated edit/copy/status flow GATED | Owner-reviewed manual workflow |
| Owner | `/dashboard/reports` | SOURCE PASS | Authenticated visual/data flow GATED | Tenant-scoped submitted-request source, campaign, status, and manual-outcome report; no click/revenue claim; optionally hidden from secondary navigation only |
| Owner | `/dashboard/configuration` | SOURCE PASS | Authenticated save/refresh flow GATED | Canonical Quote Setup with configurable section title/description, ordering, and list/tabs/steps presentation |
| Owner | `/dashboard/business-profile` | SOURCE PASS | Authenticated save flow GATED | Identity/contact only |
| Owner | `/dashboard/settings` | SOURCE PASS | Authenticated persistence flow GATED | Account/language/theme/history/lifecycle plus optional Reports/Guide navigation visibility |
| Owner help | `/dashboard/guide` | SOURCE PASS | Authenticated visual flow GATED | Secondary guidance; may be hidden from navigation without removing route authorization |
| Compatibility | `/dashboard/quote-setup` | SOURCE PASS | Redirect contract | No additional destination |
| Founder | `/founder` | SOURCE PASS | Authorization runtime GATED | Founder check, then `/admin`; compatibility path does not add another shell entry |
| Internal admin | `/admin` | SOURCE PASS | Founder/normal-owner negative proof GATED | Guarded oversight/actions; exactly one authorized shell entry |
| System | unmatched URL / 404 | SOURCE PASS | Direct EN/fr-CA public smoke included | Custom accessible shell; not a product route |
| System | global runtime error | SOURCE PASS | Source contract | Localized recovery; internal details hidden |
| System | dashboard runtime error | SOURCE PASS | Source contract | Localized protected recovery |

## Shared shell audit

| Item | Result | Evidence/decision |
| --- | --- | --- |
| Desktop and compact navigation | PASS in source | V4.7 shell preserves complete navigation, optional Reports/Guide visibility, and one authorized Admin entry across measured widths |
| Language switch | PASS in source/public smoke | EN ↔ fr-CA, cookie persistence, query/hash preservation |
| Theme control | PASS in source/UI matrix | Light/dark/system tokenized; no blocking webfont request |
| Footer information architecture | PASS in source | Product, Get started, Resources, Trust/legal; no duplicate Sign in |
| Internal links | PASS in source/smoke | fr-CA persistence checked across public routes |
| Metadata/hreflang/canonical | PASS in source/UI matrix | Ten canonical routes; `en-CA`, `fr-CA`, `x-default` |
| Sitemap/robots/noindex | PASS in source/UI matrix | Auth, dashboard, founder, admin, and quote intake excluded/blocked appropriately |
| Responsive containment | PUBLIC PASS | Exact-release Production responsive matrix 20/20; no write behavior involved |
| Keyboard/reduced motion/landmarks | PASS in source contracts | Skip link, focus rings, correct main/header/footer landmarks |

## End-to-end workflow control

### Public discovery → pilot

`Marketing page → Demo/Pricing/FAQ/Trust → Pilot template copy → founder-led external follow-up`

Status: public read-only/source behavior implemented. There is no fake form submission, automated outreach, checkout, or activation.

### Customer intake → owner reply

`Shared link → active quote page → structured answers + consent → validated request → lead → missing-info/priority → AI/rule draft → owner edit → copy → manual send → manual status/follow-up`

Status: source and unit logic implemented. Full active EN/fr-CA proof is `GATED` until a disposable synthetic target is approved. Production writes are prohibited for QA.

### Authentication → workspace

`Approved owner → email/password sign-up or sign-in → confirmation/callback → protected workspace → reset/sign-out`

Status: source/unit behavior implemented; email delivery, callback, session, two-owner isolation, and authenticated browser proof are `GATED`. Google login remains externally unverified and never silently provisions a workspace: an authenticated user without membership follows the explicit setup path.

### Founder oversight

`Founder allowlist → /founder authorization → /admin overview/directory/detail → guarded action/dry run → audit record`

Status: source safety contracts implemented. Owner screenshot visibly renders the role-gated Founder Admin entry, so allowlist activation is observed; protected route success and normal-owner denial on a live safe target remain `GATED`.

### Data lifecycle

`Consent → minimum collection → tenant-isolated use → safe logs → access/export/correction → retention/deletion → incident/restore/rollback`

Status: policies, migrations, service boundaries, and source tests exist. Current managed-schema reconciliation and restored-target app/RLS proof remain `GATED`; real customer data is not approved.

## Findings closed in this audit

- Added direct EN/fr-CA public smoke coverage for all five Auth pages.
- Added direct EN/fr-CA checks for base quote-unavailable state.
- Added GET-only inactive dynamic quote support in both languages.
- Added document-language assertions to the public route smoke.
- Added a custom bilingual 404 on the shared public shell.
- Localized the global runtime error boundary.
- Preserved the focused footer without a low-value duplicate Sign in link.
- Added source contracts so these states cannot silently regress.
- Added the V4.7 Reports route, configurable list/tabs/steps quote form, optional Reports/Guide navigation controls, and duplicate-Admin prevention contracts.

## Remaining evidence gates

1. Approved disposable Auth/Supabase target and synthetic credentials.
2. Active quote slug(s) for EN/fr-CA synthetic submission and success flow.
3. Two synthetic owners for horizontal isolation and normal-owner founder denial.
4. Synthetic founder for guarded Admin success checks.
5. Current managed migration/backup inspection plus strict restored app/dashboard/intake/RLS proof on a disposable target; Phase 24C.0 is historical DB-level partial evidence only.
6. Owner-approved no-secret Production authenticated read-only procedure.
7. Chrome/Chromium-capable environment for real interaction smoke if not otherwise supplied.

These are access/evidence gates, not permission to use Production for synthetic writes. Production acceptance is GET/read-only; submissions and configuration mutations belong only on the approved disposable target.
