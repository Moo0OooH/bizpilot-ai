# BizPilot AI

BizPilot AI is a **cleaning-first quote recovery and lead conversion desk**.
It helps a business owner collect quote requests, identify missing information,
prioritize manual follow-up, and prepare an AI-assisted draft that the owner
reviews, edits, copies, and sends through their existing channel.

## Current release posture

The bilingual Website V3 is production accepted at
[bizpilo.com](https://bizpilo.com) from reviewed `main` SHA
`7d262812efd0c06e6af01fb3bd640a193a5bc19e`. BizPilot is still **not approved
for real customer data or a paid pilot**. The owner dashboard retains its
local/synthetic and owner-manual evidence; real-data, restored-target, and
paid-pilot gates remain open.

Read the controlling status before planning, implementing, or claiming
readiness:

- [Final project source of truth](docs/readiness/BIZPILOT_FINAL_SOURCE_OF_TRUTH_2026-07-12.md)
- [Machine-readable current status](docs/readiness/current-status.json)
- [Documentation authority map](docs/CURRENT_CANONICAL_DOCS_v1.7.md)
- [Agent starting guide](docs/AI_CODING_AGENT_START_HERE_v1.7.md)
- [Website V4 current report](docs/website-v4/CURRENT.md)

Historical phase reports are evidence, not current authorization. See
[the archive guide](docs/archive/README.md).

## Product boundaries

- Cleaning-first GTM and founder-led onboarding.
- Manual-first lead recovery: owners review, copy/edit, and send manually.
- AI is draft assistance only; no autonomous action, auto-send, invented price,
  or availability promise.
- No full CRM, booking, invoice, payment processing, SMS/WhatsApp automation,
  or self-serve activation is represented as live.
- Google OAuth code exists, but its external provider configuration and owner QA
  are unverified; phone auth is not implemented.

## Canonical routes

| Surface | Routes |
| --- | --- |
| Public site | `/`, `/features`, `/demo`, `/pricing`, `/pilot`, `/faq`, `/trust`, `/privacy`, `/security`, `/terms` |
| Quote intake | `/quote`, `/quote/[slug]`, `/quote/[slug]/success` |
| Auth | `/auth/sign-in`, `/auth/sign-up`, `/auth/check-email`, `/auth/forgot-password`, `/auth/reset-password`, `/auth/callback` |
| Owner dashboard | `/dashboard`, `/dashboard/leads`, `/dashboard/leads/[leadId]`, `/dashboard/configuration`, `/dashboard/quote-setup`, `/dashboard/business-profile`, `/dashboard/settings`, `/dashboard/guide` |
| Internal oversight | `/founder`, `/admin` |

## Local verification

```powershell
pnpm lint
pnpm typecheck
pnpm test:unit
pnpm build
```

Run database or dashboard smoke commands only against a confirmed local or
synthetic target. Do not use these checks to mutate managed production data.

## Release blockers

Before real customer data or a paid pilot, the project needs a safe production
verification plan, explicit owner approval, restored-target app/dashboard/RLS
proof, Vercel/domain/Auth redirect verification, and a rehearsed
payment/support/refund/rollback process. Details and evidence boundaries are in
the [final source of truth](docs/readiness/BIZPILOT_FINAL_SOURCE_OF_TRUTH_2026-07-12.md).
