# BizPilot AI — Phase 1 Start Checklist v1.0

**Project:** BizPilot AI  
**Document Type:** Phase 1 Start Checklist  
**Version:** v1.0  
**Status:** Ready for Execution  
**Owner:** MoOoH  
**Last Updated:** 2026-05-03

---

## 1. Phase 1 Goal

Create the technical foundation only.

Do not build product features in Phase 1.

---

## 2. Install / Verify Tools

Run:

```powershell
node -v
pnpm -v
git --version
```

Required:

- Node.js 24 LTS
- pnpm pinned after project setup
- Git
- VS Code
- Chrome
- Supabase account
- GitHub account

---

## 3. Create Project

```powershell
E:
mkdir bizpilot-ai
cd bizpilot-ai
pnpm create next-app@latest .
```

Selections:

```text
TypeScript: Yes
ESLint: Yes
Tailwind CSS: Yes
src directory: No
App Router: Yes
Turbopack: Yes
Import alias: @/*
```

---

## 4. Install shadcn/ui

```powershell
pnpm dlx shadcn@latest init
```

---

## 5. Create Base Folders

```text
app/
components/
features/
server/actions/
server/services/
server/repositories/
server/policies/
server/ai/
lib/supabase/
lib/env/
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

---

## 6. Create Environment Files

`.env.example`:

```env
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# OpenAI - Phase 6
OPENAI_API_KEY=

# Email - Phase 7
RESEND_API_KEY=

# Stripe - Phase 7
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

`.env.local` must not be committed.

---

## 7. Required Phase 1 Files

- lib/env/server-env.ts
- lib/env/public-env.ts
- lib/supabase/client.ts
- lib/supabase/server.ts
- lib/utils/cn.ts
- README.md
- .env.example

---

## 8. Phase 1 Forbidden List

Do not implement:

- Real auth flow
- Database tables
- Lead workflow
- AI generation
- Email sending
- Billing
- Public quote submission
- Product dashboard logic

---

## 9. End-of-Phase Commands

```powershell
pnpm lint
pnpm build
pnpm dev
```

---

## 10. Definition of Done

Phase 1 is complete when:

- App runs locally.
- Lint passes.
- Build passes.
- Folder structure exists.
- Env example exists.
- Supabase client placeholder exists.
- README skeleton exists.
- No product features implemented.
- Git commit pushed.
