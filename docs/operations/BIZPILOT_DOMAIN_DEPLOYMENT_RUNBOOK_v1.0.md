# BizPilot AI — Domain & Production Deployment Runbook v1.0

## Purpose
This runbook defines the exact post-domain purchase steps for moving BizPilot AI from local/demo mode to a safe pilot-ready production deployment.

## Current Domain Note
The purchased domain shown by the founder appears to be `bizpilo.com`. Before connecting DNS, confirm whether this spelling is intentional. If the intended brand is `BizPilot AI`, check whether a corrected/backup brand domain should also be secured.

## Phase
Applies to late Phase 18 / production pilot preparation.

## Step 1 — Domain Safety
- Confirm spelling.
- Enable registrar account 2FA.
- Keep domain privacy protection enabled.
- Save registrar login details in a secure password manager.
- Do not point DNS to production until Vercel/Supabase production environment is ready.

## Step 2 — Vercel Production Project
- Connect the GitHub repository to Vercel.
- Use the existing Next.js project root.
- Configure build command: `pnpm build`.
- Configure install command: `pnpm install`.
- Configure production branch: `main`.

## Step 3 — Production Environment Variables
Required:
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`
- `RESEND_API_KEY` if email is enabled

Rules:
- `SUPABASE_SERVICE_ROLE_KEY`, `OPENAI_API_KEY`, and `RESEND_API_KEY` must stay server-only.
- Never expose service role keys to client code.
- Redeploy after environment variable changes.

## Step 4 — Supabase Production Project
- Create or confirm production Supabase project.
- Run SQL-first migrations.
- Confirm explicit GRANTs.
- Confirm RLS enabled on tenant/public quote tables.
- Run RLS tests against the intended database connection.
- Confirm public quote submission path only exposes public-safe data.

## Step 5 — DNS Connection
Recommended:
- Add the apex/root domain and `www` domain in Vercel project settings.
- Use the DNS records Vercel shows in the dashboard.
- Set canonical redirect: usually `www` -> root or root -> `www`, but pick one and stay consistent.
- Do not add random DNS records outside the deployment plan.

## Step 6 — Production Smoke Test
Check:
- `/`
- `/pricing`
- `/auth/sign-in`
- `/auth/sign-up`
- `/quote/[slug]`
- `/quote/[slug]/success`
- `/dashboard`
- `/dashboard/leads`
- `/dashboard/configuration`

## Step 7 — Pilot Readiness Gate
Before sending link to real prospects:
- `pnpm lint` pass
- `pnpm typecheck` pass
- `pnpm build` pass
- `pnpm test:rls` pass or documented production-equivalent RLS verification
- Auth redirect QA pass
- Public quote submission QA pass
- AI draft generation QA pass
- Safe error handling QA pass
- Mobile smoke pass

## Non-Goals
Do not add:
- booking
- invoices
- calendar sync
- WhatsApp/SMS/Instagram automation
- AI auto-send
- full Stripe Billing
- full CRM replacement
