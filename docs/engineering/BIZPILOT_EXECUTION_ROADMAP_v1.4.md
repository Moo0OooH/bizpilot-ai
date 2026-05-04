# BizPilot AI — Execution Roadmap v1.4

**Project:** BizPilot AI  
**Document Type:** Execution Roadmap  
**Version:** v1.4  
**Status:** Final Founder-Grade Canonical Draft  
**Owner:** MoOoH  
**Last Updated:** 2026-05-03

---

## 1. Final Execution Principle

```text
Build small.
Sell manually.
Keep server cost near zero.
Use AI only where it creates visible value.
Measure validation before expansion.
```

---

## 2. Required Tools

- Node.js 24 LTS
- pnpm pinned after project creation
- Git latest
- VS Code latest
- Chrome latest
- Supabase account
- GitHub account

Later:

- OpenAI API key
- Resend account
- Stripe account
- Vercel account

---

## 3. Initial Commands

```powershell
node -v
pnpm -v
git --version
```

Create project:

```powershell
E:
mkdir bizpilot-ai
cd bizpilot-ai
pnpm create next-app@latest .
```

Recommended selections:

```text
TypeScript: Yes
ESLint: Yes
Tailwind CSS: Yes
src directory: No
App Router: Yes
Turbopack: Yes
Import alias: @/*
```

Install shadcn/ui:

```powershell
pnpm dlx shadcn@latest init
```

---

## 4. Environment Variables

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

---

## 5. Canonical Folder Structure

```text
bizpilot-ai/
├─ app/
├─ components/
├─ features/
├─ server/
├─ lib/
├─ prompts/
├─ types/
├─ supabase/
├─ docs/
├─ tests/
├─ scripts/
├─ .env.example
├─ .env.local
├─ package.json
├─ tsconfig.json
├─ next.config.ts
└─ README.md
```

---

## 6. Phase Execution Order

1. Phase 0 — Docs Lock
2. Phase 1 — Project Foundation
3. Phase 2 — Auth + Tenant + RLS
4. Phase 3 — Business + Template Config
5. Phase 4 — Public Quote Link
6. Phase 5 — Lead Conversion Desk
7. Phase 6 — AI Assistant
8. Phase 7 — Sales-ready MVP
9. Validation Gate
10. Expansion only after proof

---

## 7. No-Build List Before Validation

Do not build:

- Full CRM
- Booking engine
- Calendar sync
- WhatsApp/SMS/Instagram integration
- AI operator
- Mobile app
- Marketplace
- Second vertical
- Growth Studio
- Full Stripe Billing
- Advanced analytics
- Vector database
- Microservices
- Kubernetes
- Always-on workers
- Background AI agents

---

## 8. Operating Cadence

Weekly founder cadence:

1. Build one small approved phase item.
2. Run lint/build/tests.
3. Commit.
4. Show demo to at least one prospect when demo-able.
5. Track customer reactions.
6. Do not expand roadmap unless validation data proves demand.

---

## 9. Final Reminder

The project is successful when a cleaning business says:

```text
This helps me stop losing quote requests, reply faster, and follow up better.
I’m willing to pay for it.
```
