# BizPilot AI

BizPilot AI is a bilingual, manual-first Smart Intake and reply-preparation workspace for service businesses. A business shares one intake link where customers already find it; BizPilot gathers structured request details, highlights missing information, prioritizes follow-up, and prepares a draft the owner reviews, edits, copies, and sends through an existing channel.

Cleaning is the first complete pilot vertical. Direct social inbox integrations, autonomous replies, booking confirmation, invented pricing, payments, invoicing, SMS/WhatsApp automation, and a full CRM are not represented as live.

## Current release posture

- Public Website V4: current production-facing marketing and legal experience.
- Dashboard V4: task-first protected owner/admin simplification implemented on `main`.
- Real customer data and paid pilot: still gated.
- Google OAuth: application path exists; external provider configuration and owner QA remain unverified.
- Production database: no migration or data mutation is part of the Dashboard V4 release.

Read these before planning or changing the project:

- [Project source of truth](docs/readiness/BIZPILOT_SOURCE_OF_TRUTH_2026-07-14.md)
- [Machine-readable status](docs/readiness/current-status.json)
- [Canonical documentation V2.0](docs/CURRENT_CANONICAL_DOCS_v2.0.md)
- [Dashboard V4](docs/dashboard-v4/CURRENT.md)
- [Website V4](docs/website-v4/CURRENT.md)
- [Manual QA V2.0](docs/operations/BIZPILOT_MANUAL_QA_CHECKLIST_v2.0.md)
- [Pilot readiness V2.0](docs/operations/BIZPILOT_PILOT_READINESS_CHECKLIST_v2.0.md)
- [Coding-agent start guide](docs/AI_CODING_AGENT_START_HERE_v2.0.md)

## Canonical routes

| Surface | Routes |
| --- | --- |
| Public | `/`, `/features`, `/demo`, `/pricing`, `/pilot`, `/faq`, `/trust`, `/privacy`, `/security`, `/terms` |
| Intake | `/quote`, `/quote/[slug]`, `/quote/[slug]/success` |
| Auth | `/auth/sign-in`, `/auth/sign-up`, `/auth/check-email`, `/auth/forgot-password`, `/auth/reset-password`, `/auth/callback` |
| Owner | `/dashboard`, `/dashboard/leads`, `/dashboard/leads/[leadId]`, `/dashboard/configuration`, `/dashboard/business-profile`, `/dashboard/settings`, `/dashboard/guide` |
| Internal | `/founder` (guarded redirect), `/admin` |

`/dashboard/quote-setup` remains a compatibility redirect to the canonical Quote Setup route. Dashboard V4 adds no route.

## Local verification

```powershell
pnpm lint
pnpm typecheck
pnpm test:unit
pnpm build
```

Authenticated dashboard/database smoke commands require a proven local or disposable synthetic target. Never run synthetic writes against managed Supabase or Production.

## External gates

Tasks that need owner credentials, external-console access, Production authority, or real-data approval are sequenced in [the external-action prompt pack](prompts/BIZPILOT_EXTERNAL_ACTION_PROMPT_PACK_v2.0.md). Do not paste secrets into prompts, logs, docs, or commits.
