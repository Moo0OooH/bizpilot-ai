# BizPilot AI

BizPilot AI is in Phase 5: Lead Conversion Desk.

The canonical product direction is locked in `docs/` as the v1.4 founder-grade package. Phase 1 is technical foundation only.

## Locked Direction

```text
BizPilot AI = AI Quote Recovery & Lead Conversion Desk
Core = Universal Smart Intake Core + AI Lead Conversion Core
GTM = Cleaning-first
MVP = Editable Cleaning Smart Quote Template + Lead Conversion Desk + AI Drafts
Operating Mode = Rule-first, AI-on-demand, cache-heavy, validation-first
```

## Current Phase 5 Scope

Allowed:

- Owner lead list
- Owner lead detail
- Lead status display and updates
- Rule-based Lead Quality Score
- Rule-based Missing Info Detection
- Response SLA State
- Lead Events Timeline
- Today's Action Panel
- Follow-Up Needed rule
- Copy actions that update timestamps
- Manual Outcome Tracking
- Revenue Recovery Proof basics
- RLS tests for Phase 5 tables and policies

Forbidden:

- AI
- Email
- Billing
- Booking engine
- CRM expansion
- Calendar sync
- WhatsApp/SMS/Instagram APIs
- Background workers
- Second vertical launch
- Growth Studio
- Advanced analytics warehouse

## Completed Phase 4 Scope

- Public branded quote page
- Dynamic Cleaning template rendering
- Lead submission
- Consent capture
- Source tracking
- Success page
- Basic spam protection
- Public-safe RLS policies and RLS tests

## Completed Phase 3 Scope

- Business profile configuration
- Branding configuration
- Services, FAQ, and service areas
- Privacy and consent settings
- Vertical = Cleaning
- Editable Cleaning Smart Quote Template
- Business Readiness Score
- RLS policies and RLS tests for configuration tables

## Completed Phase 2 Scope

- Supabase Auth sign-in/sign-up
- `profiles`, `businesses`, and `business_members`
- RLS policies and RLS tests
- Protected dashboard shell
- Business membership checks

## Completed Phase 1 Scope

Allowed:

- Next.js App Router foundation
- TypeScript strict setup
- Tailwind CSS setup
- shadcn/ui-ready structure
- Base folders
- Environment validation
- Supabase client/server placeholders
- README skeleton
- lint/build/dev scripts

Forbidden:

- Real auth flow
- Database tables
- Lead workflow
- AI generation
- Email sending
- Billing
- Public quote submission
- Product dashboard logic

## Structure

```text
app/
components/
features/
server/actions/
server/services/
server/repositories/
server/policies/
server/ai/
lib/env/
lib/supabase/
lib/utils/
prompts/registry/
types/
supabase/migrations/
docs/
tests/rls/
tests/unit/
tests/integration/
scripts/
```

## Setup

```powershell
pnpm install
```

The project pins pnpm through `packageManager` in `package.json`.

Create `.env.local` from `.env.example`.

Required for Phase 1 local validation:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://example.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder
```

Server-only keys are present in `.env.example` for future phases, but they are not required for Phase 1 feature work.

## Verification

```powershell
pnpm lint
pnpm typecheck
pnpm build
pnpm dev
```

## Phase 5 Definition of Done

- Owner sees only own leads.
- Lead quality works.
- Missing info works.
- Response SLA works.
- Timeline works.
- Copy actions update timestamps.
- Manual outcome can be set.
- Revenue Recovery Proof summary appears.
- RLS tests pass.

## Phase 2 Definition of Done

- User can sign up/login.
- User profile exists.
- Business exists.
- User belongs to business.
- Dashboard is protected.
- RLS tests pass.
- Cross-tenant access is blocked.

## Phase 3 Definition of Done

- Business can configure profile.
- Business can configure services, FAQ, service areas.
- Cleaning template can be edited.
- Business Readiness Score works.
- RLS tests pass.

## Phase 4 Definition of Done

- Public quote page works.
- Dynamic fields render from config.
- Lead submission works.
- Lead belongs to correct business.
- Source tracking works.
- Consent version is captured.
- Public page cannot read private data.
- RLS tests pass.

## Phase 1 Definition of Done

- App runs locally.
- Lint passes.
- Build passes.
- Folder structure exists.
- Env example exists.
- Supabase client placeholder exists.
- README skeleton exists.
- No product features are implemented.
- Git commit pushed.
