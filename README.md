<!--
 * ============================================================
 * File: README.md
 * Project: BizPilot AI
 * Description: Repository entry point for product scope, canonical routes, documentation, and verification.
 * Role: Directs contributors to the current V2.1 authority set and safe execution rules.
 * Related:
 * - docs/project-v2/CURRENT.md
 * - docs/CURRENT_CANONICAL_DOCS_v2.1.md
 * Author: MoOoH
 * Created: 2026-05-02
 * Last Updated: 2026-07-17
 * Change Log:
 * - 2026-07-17: Recorded Dashboard V4.7 configurable intake, resilient client-boundary contracts, responsive shell, navigation controls, OAuth hardening, CI/deployment success, and Production read-only acceptance.
 * - 2026-07-16: Published Dashboard V4.6 Reports and the finalized setup-to-reporting route posture.
 * - 2026-07-15: Updated the repository entry point for Documentation V2.1 and the exhaustive project audit.
 * ============================================================
 -->

# BizPilot AI

BizPilot AI is a bilingual, manual-first Smart Intake and reply-preparation workspace for service businesses. A business shares one intake link where customers already find it; BizPilot gathers structured request details, highlights missing information, prioritizes follow-up, and prepares a draft the owner reviews, edits, copies, and sends through an existing channel.

Cleaning is the first complete pilot vertical. Direct social inbox integrations, autonomous replies, booking confirmation, invented pricing, payments, invoicing, SMS/WhatsApp automation, and a full CRM are not represented as live.

## Current release posture

- Dashboard V4.7: configurable quote-form title, sections, and list/tab/step layouts; source-aware reporting; optional Reports/Guide navigation; a responsive protected shell; Google login hardening; and serializable Server/Client Component boundaries are published on `main` at `d9e25bbf50ccf42de2da4d70aa235ab7d289dc91` (tree `17d6b65cc9fb196c8d0d4ccaa46f5fd6f736076d`). Local lint, typecheck, `295/295` tests, and production build passed. GitHub CI run `29558683869` (`CI #443`), Production deployment `5484816130` / status `15596534668`, and Vercel target `4zpXiTSDYdZjKkwG3ukyaVFj2VwR` succeeded. Production read-only acceptance passed public `46/46`, responsive `20/20`, UI matrix `621/621`, and active/inactive Quote EN/fr-CA `4/4` with no submission or mutation.
- Website V4: remains the current production-facing marketing and legal experience. Commit `c78596b1f1530ff3586b9b076702822b0b711802`, CI run `29517118330`, and Vercel target `CbDDUpqxCVMoG3L8hTgGRoymvi5m` are historical Website V4 / Documentation V2.1 evidence, not Dashboard V4.7 evidence.
- Real customer data and paid pilot: still gated.
- Google OAuth: the application path no longer silently creates a workspace; live callback/provider behavior still requires owner QA.
- Production database: no migration or data mutation is part of the Dashboard V4.7 release.

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
| Owner | `/dashboard`, `/dashboard/leads`, `/dashboard/leads/[leadId]`, `/dashboard/reports`, `/dashboard/configuration`, `/dashboard/business-profile`, `/dashboard/settings`, `/dashboard/guide` |
| Internal | `/founder` (guarded redirect), `/admin` |

`/dashboard/quote-setup` remains a compatibility redirect to the canonical Quote Setup route. Dashboard V4.7 retains the protected `/dashboard/reports` route and adds no public route. Reports and Guide may be hidden from owner navigation through display preferences without changing route authorization; core owner routes and founder authorization are not hidden by that preference.

## Local verification

```powershell
pnpm lint
pnpm typecheck
pnpm test:unit
pnpm build
```

Authenticated dashboard/database smoke commands require a proven local or disposable synthetic target. Never run synthetic writes against managed Supabase or Production.

## External gates

Tasks that need owner credentials, external-console access, Production authority, or real-data approval are sequenced in [the external-action prompt pack](prompts/BIZPILOT_EXTERNAL_ACTION_PROMPT_PACK_v2.1.md). Do not paste secrets into prompts, logs, docs, or commits.
