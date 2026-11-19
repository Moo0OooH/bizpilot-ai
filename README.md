<!--
 * ============================================================
 * File: README.md
 * Project: BizPilot AI
 * Description: Repository entry point for product scope, canonical routes, runtime, documentation, and release verification.
 * Role: Directs contributors to the current GitHub verification baseline, V2.1 authority set, and safe execution rules.
 * Related:
 * - docs/project-v2/CURRENT.md
 * - docs/CURRENT_CANONICAL_DOCS_v2.1.md
 * - docs/product/BIZPILOT_PREMIUM_OPERATIONS_ADDONS_v1.0.md
 * - docs/readiness/GITHUB_BASELINE_2026-11-19.md
 * - docs/readiness/FINAL_SYNC_2026-11-19.md
 * Author: MoOoH
 * Created: 2026-05-02
 * Last Updated: 2026-11-19
 * Change Log:
 * - 2026-11-19: Replaced stale candidate gates with the completed GitHub/Supabase/Vercel synchronization and final release authority.
 * - 2026-11-19: Pointed to the current GitHub baseline and audited Next.js 16.4.6 dependency update; kept July release receipts historical.
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

- Application release: PR #14 is merged to `main` as `c4257025f65f434b1abefadb5bf7f02878f1d9b6`; main CI and Vercel Production passed.
- Runtime: Node `>=24 <25`, pnpm `10.34.5`, Next.js `16.4.6`, and React/React DOM `19.2.7`; dependency audit reports no known vulnerabilities.
- Database: local and linked Supabase histories match through `0027`; linked lint has no schema errors; executable local RLS passes `14/14`.
- Functional acceptance: local and Production public suites pass, and the local dense synthetic Owner/Founder/Admin suite passes `17/17`.
- Data boundary: all 36 public Production tables report an estimated row count of zero. Real customer data and paid-pilot activation remain gated.
- Remaining gates: live Google OAuth, owner-controlled Production authenticated acceptance, secret-inventory confirmation, restore drill on the final backup, and real-data/commercial approval.

See the [final synchronization report](docs/readiness/FINAL_SYNC_2026-11-19.md) for exact receipts, weaknesses, and remaining phases. Older July release evidence is historical where it conflicts with the November status.

Read these before planning or changing the project:

- [Final synchronization and remaining phases](docs/readiness/FINAL_SYNC_2026-11-19.md)
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
