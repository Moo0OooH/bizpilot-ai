# BizPilot AI

BizPilot AI is in Phase 1: Project Foundation.

The canonical product direction is locked in `docs/` as the v1.4 founder-grade package. Phase 1 is technical foundation only.

## Locked Direction

```text
BizPilot AI = AI Quote Recovery & Lead Conversion Desk
Core = Universal Smart Intake Core + AI Lead Conversion Core
GTM = Cleaning-first
MVP = Editable Cleaning Smart Quote Template + Lead Conversion Desk + AI Drafts
Operating Mode = Rule-first, AI-on-demand, cache-heavy, validation-first
```

## Phase 1 Scope

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

Create `.env.local` from `.env.example`.

## Verification

```powershell
pnpm lint
pnpm typecheck
pnpm build
pnpm dev
```

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
