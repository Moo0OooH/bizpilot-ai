# BizPilot AI

BizPilot AI is currently in Phase 1: Project Foundation.

Phase 0 documentation is locked in `docs/`. Phase 1 is technical foundation only. It must not include product features, business logic, lead workflows, AI generation, billing, or customer-facing quote functionality.

## Stack

- Next.js App Router
- TypeScript strict
- Tailwind CSS
- shadcn/ui-ready structure
- Supabase foundation
- Vercel + Supabase hosting target

## Project Structure

```text
app/
  (auth)/
  (dashboard)/
  (public)/
  api/
components/
  ui/
features/
lib/
  supabase/
server/
  services/
  repositories/
  policies/
  ai/
prompts/
types/
styles/
supabase/
  migrations/
docs/
  product/
  engineering/
  architecture/
```

## Local Setup

```powershell
pnpm install
pnpm dev
```

## Verification

```powershell
pnpm lint
pnpm typecheck
pnpm build
```

## Phase 1 Acceptance Criteria

- App runs locally.
- TypeScript strict mode is enabled.
- Tailwind CSS is available.
- Base folder structure is ready.
- Environment validation exists.
- Supabase foundation exists without product workflows.
- Lint, typecheck, and build pass.
- No product features are implemented.
