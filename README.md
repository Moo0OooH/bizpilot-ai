<!--
 * ============================================================
 * File: README.md
 * Project: BizPilot AI
 * Description: Repository entry point for product scope, canonical routes, runtime, documentation, and release verification.
 * Role: Directs contributors to the current V2.1 authority set, Premium Operations candidate, and safe execution rules.
 * Related:
 * - docs/project-v2/CURRENT.md
 * - docs/CURRENT_CANONICAL_DOCS_v2.1.md
 * - docs/product/BIZPILOT_PREMIUM_OPERATIONS_ADDONS_v1.0.md
 * Author: MoOoH
 * Created: 2026-05-02
 * Last Updated: 2026-07-22
 * Change Log:
 * - 2026-07-22: Recorded the hardened Premium Operations/public-catalog candidate, ordered `0025` + `0026` migration gate, current runtime versions, and separation of local, CI, Vercel, and Production evidence.
 * - 2026-07-22: Corrected the historical V4.7 local object identity without treating it as current CI, Vercel, or Production evidence.
 * - 2026-07-21: Separated local Git facts from remote, deployment, and Production gates; recorded the Premium Operations migration gate.
 * - 2026-07-17: Recorded Dashboard V4.7 configurable intake, resilient client-boundary contracts, responsive shell, navigation controls, OAuth hardening, CI/deployment success, and Production read-only acceptance.
 * - 2026-07-16: Published Dashboard V4.6 Reports and the finalized setup-to-reporting route posture.
 * - 2026-07-15: Updated the repository entry point for Documentation V2.1 and the exhaustive project audit.
 * ============================================================
 -->

# BizPilot AI

BizPilot AI is a bilingual-public, manual-first Smart Intake and reply-preparation workspace for service businesses. A business shares one intake link where customers already find it; BizPilot gathers structured request details, highlights missing information, prioritizes follow-up, and prepares a draft the owner reviews, edits, copies, and sends through an existing channel. The protected dashboard interface supports English, Canadian French, Persian, Arabic, and Spanish independently of the customer-content language.

Cleaning is the first complete pilot vertical. Direct social inbox integrations, autonomous replies, booking confirmation, invented pricing, payments, invoicing, SMS/WhatsApp automation, and a full CRM are not represented as live.

## Current release posture

- Dashboard V4.7: configurable quote-form title, sections, and list/tab/step layouts; source-aware reporting; optional Reports/Guide navigation; a responsive protected shell; Google login hardening; and serializable Server/Client Component boundaries. Local Git verifies that commit `d9e25bbf50ccf42de2da4d70aa235ab7d289dc91` is present with tree `17d6b65cc9fb196c8d0d4ccaa46f5fd6f736076d`; the previously documented `a82af72bf8960b2bce1583e6446abca706c2a2bc` object is absent from this checkout. These local object facts do not independently revalidate historical CI, Vercel, or Production evidence and are not evidence for the current Premium Operations candidate.
- Premium Operations hardening candidate: the separately sold Priority Workbench, Bulk Reply Review, and Availability Coordination are implemented on `/dashboard/operations`. Availability uses a canonical `preferred_time` field of type `time`, fixed `America/Toronto` interpretation, atomic review-draft creation, conflict/currentness revalidation, and manager-reviewed manual copy. An authorized founder explicitly enables or disables each add-on from the guarded Admin console; no base plan receives it automatically.
- Premium Operations database: apply `0025_premium_operations_addons.sql` and then additive `0026_premium_operations_schedule_integrity.sql`, in order, only on an approved local/disposable target first. RLS/tenant isolation remains unexecuted in this worktree without that target. A separate explicit plan is required before any Production migration.
- Public website extension: Product, Pricing, and FAQ describe the three optional add-ons in EN/fr-CA without inventing add-on prices or implying automatic send or booking. Local exact-tree build and public smoke pass; CI publication, Vercel deployment, and live-site acceptance remain separate gates.
- Website V4: remains the current production-facing marketing and legal experience. Commit `c78596b1f1530ff3586b9b076702822b0b711802`, CI run `29517118330`, and Vercel target `CbDDUpqxCVMoG3L8hTgGRoymvi5m` are historical Website V4 / Documentation V2.1 evidence, not Dashboard V4.7 evidence.
- Real customer data and paid pilot: still gated.
- Google OAuth: the application path no longer silently creates a workspace; live callback/provider behavior still requires owner QA.
- Production database: no migration or data mutation is authorized by this repository state. The historical V4.7 intake work reused existing storage; Premium Operations introduces the ordered `0025` + `0026` source sequence and needs its own non-Production proof and explicit Production approval.

Current candidate runtime: Node `>=24 <25` (verified on `24.14.0`), pnpm `10.34.5`, Next.js `16.2.11`, and React / React DOM `19.2.7`. Local exact-tree evidence: zero dependency-audit vulnerabilities, lint and typecheck PASS, `359/359` unit/source tests, static Supabase RLS/grant audit PASS, production build PASS, public `46/46`, responsive `20/20`, UI matrix zero failures, inactive Quote `2/2`, and image optimizer HTTP 200. Browser interaction is environment-gated without Chrome; database-backed RLS and authenticated QA require an approved local/disposable target.

Read these before planning or changing the project:

- [Project source of truth](docs/readiness/BIZPILOT_SOURCE_OF_TRUTH_2026-07-14.md)
- [Machine-readable status](docs/readiness/current-status.json)
- [Project V2.1 current entry](docs/project-v2/CURRENT.md)
- [Master phase and finalization plan](docs/project-v2/MASTER_PHASE_AND_FINALIZATION_PLAN_2026-07-15.md)
- [Bilingual route and flow audit](docs/project-v2/BILINGUAL_ROUTE_AND_FLOW_AUDIT_2026-07-15.md)
- [Canonical documentation V2.1](docs/CURRENT_CANONICAL_DOCS_v2.1.md)
- [Dashboard V4](docs/dashboard-v4/CURRENT.md)
- [Website V4](docs/website-v4/CURRENT.md)
- [Manual QA V2.0](docs/operations/BIZPILOT_MANUAL_QA_CHECKLIST_v2.0.md)
- [Pilot readiness V2.0](docs/operations/BIZPILOT_PILOT_READINESS_CHECKLIST_v2.0.md)
- [Coding-agent start guide](docs/AI_CODING_AGENT_START_HERE_v2.1.md)

## Canonical routes

| Surface | Routes |
| --- | --- |
| Public | `/`, `/features`, `/demo`, `/pricing`, `/pilot`, `/faq`, `/trust`, `/privacy`, `/security`, `/terms` |
| Intake | `/quote`, `/quote/[slug]`, `/quote/[slug]/success` |
| Auth | `/auth/sign-in`, `/auth/sign-up`, `/auth/check-email`, `/auth/forgot-password`, `/auth/reset-password`, `/auth/callback` |
| Owner | `/dashboard`, `/dashboard/leads`, `/dashboard/leads/[leadId]`, `/dashboard/operations`, `/dashboard/reports`, `/dashboard/configuration`, `/dashboard/business-profile`, `/dashboard/settings`, `/dashboard/guide` |
| Internal | `/founder` (guarded redirect), `/admin` |

`/dashboard/quote-setup` remains a compatibility redirect to the canonical Quote Setup route. Dashboard V4.7 retains the protected `/dashboard/reports` route and adds no public route. Reports and Guide may be hidden from owner navigation through display preferences without changing route authorization; core owner routes and founder authorization are not hidden by that preference.

## Local verification

```powershell
pnpm audit
pnpm lint
pnpm typecheck
pnpm test:unit
pnpm build
```

Authenticated dashboard/database smoke commands require a proven local or disposable synthetic target. The RLS runner requires the ordered `0025` + `0026` migrations on that safe target. Never run synthetic writes against managed Supabase or Production.

## External gates

Tasks that need owner credentials, external-console access, Production authority, or real-data approval are sequenced in [the external-action prompt pack](prompts/BIZPILOT_EXTERNAL_ACTION_PROMPT_PACK_v2.1.md). Do not paste secrets into prompts, logs, docs, or commits.
