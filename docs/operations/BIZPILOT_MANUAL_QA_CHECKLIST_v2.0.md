<!--
 * ============================================================
 * File: docs/operations/BIZPILOT_MANUAL_QA_CHECKLIST_v2.0.md
 * Project: BizPilot AI
 * Description: Current manual acceptance checklist for public, owner, and founder surfaces.
 * Role: Defines evidence required after automated checks and before any real-data or paid-pilot approval.
 * Related:
 * - docs/readiness/BIZPILOT_SOURCE_OF_TRUTH_2026-07-14.md
 * - docs/dashboard-v4/CURRENT.md
 * - docs/operations/BIZPILOT_PILOT_READINESS_CHECKLIST_v2.0.md
 * Author: MoOoH
 * Created: 2026-07-14
 * Last Updated: 2026-07-14
 * Change Log:
 * - 2026-07-14: Replaced the stale phase-specific checklist with the V2 route, language, workflow, and safety acceptance gate.
 * ============================================================
 -->

# BizPilot AI Manual QA Checklist V2.0

Status: current. Run only against an approved local, Preview, or synthetic target. Do not use real customer data to complete this checklist.

## Evidence record

| Field | Value |
| --- | --- |
| Date and tester |  |
| Commit SHA and branch |  |
| Target URL and environment |  |
| Browser, OS, and viewports |  |
| Test workspace/user classification |  |
| Screenshots or run links |  |

## Automated gate

Record the exact result of each command. Missing environment variables are `GATED`, not `PASS`.

| Check | Expected | Result/evidence |
| --- | --- | --- |
| `pnpm lint` or direct ESLint binary | Zero errors and warnings |  |
| `pnpm typecheck` or `tsc --noEmit` | PASS |  |
| `pnpm test:unit` | All current tests pass |  |
| `pnpm build` | Next.js production build passes |  |
| Local target classifier | Explicitly local/synthetic for authenticated or write smoke |  |

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
- [ ] Desktop and mobile navigation expose exactly the essential destinations: Overview, Leads, Quote Setup, Business Profile, and Settings.
- [ ] Overview shows one clear primary action, compact readiness, honest metrics, current priorities, and a short lead queue.
- [ ] Leads filters, empty states, pagination, status badges, urgency, and deep links remain usable in both languages.
- [ ] Lead detail exposes source answers and missing information, lets the owner edit and copy a draft, and never sends automatically.
- [ ] Quote Setup uses the six current sections; save, refresh, validation, success, and error states work on an approved synthetic target.
- [ ] Business Profile and Settings avoid duplicate configuration; language and theme persist as designed.
- [ ] Long names, email addresses, URLs, French labels, and customer answers wrap without overlap or horizontal scroll.
- [ ] Loading, empty, partial-data, provider-fallback, and permission-error states remain calm and actionable.

## Founder/Admin

- [ ] Signed-out users redirect to sign-in and normal owners cannot view founder data.
- [ ] `/founder` resolves to the authorized destination without bypassing founder checks.
- [ ] Overview uses localized, honest account/health data and does not present decorative revenue or conversion claims.
- [ ] Search, tabs, pagination, status controls, audit history, and guarded actions work for a founder-approved synthetic account.
- [ ] Any destructive, access, lifecycle, or production-data control requires its documented confirmation and evidence procedure.

## Tenant and data safety

- [ ] Owner A cannot read or mutate Owner B data.
- [ ] Public quote access is limited to active public slugs and approved fields.
- [ ] Logs, errors, screenshots, and browser output contain no secrets, service-role keys, reset tokens, or unnecessary personal data.
- [ ] No production migration, cleanup, fake user, test lead, or real-customer mutation was performed by this checklist.

## Exit rule

Automated checks plus public read-only QA may complete the code-release gate. Real-data and paid-pilot readiness remain separately `GATED` until the V2 pilot checklist has named evidence for every required row.
