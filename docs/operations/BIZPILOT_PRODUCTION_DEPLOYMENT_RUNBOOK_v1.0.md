# BizPilot AI - Production Deployment Runbook v1.0

## Purpose

Define the production path for moving BizPilot to a real pilot environment without expanding product scope.

## Target Domain

```text
bizpilo.com
```

## Preflight

Before production deployment:

```text
pnpm lint
pnpm typecheck
pnpm test:unit
pnpm test:rls
pnpm build
secret scan
manual browser QA
```

## Supabase Checklist

Confirm the target Supabase project before applying migrations.

Required migration verification:

```text
0010 through 0013 applied
0014_cleaning_template_contact_address_fields.sql applied
0015_business_access_plan_and_admin_log.sql applied
0016_public_submission_minimum_submit_age_reason.sql applied
RLS helper functions current
explicit grants reviewed
Security Advisor reviewed
Performance Advisor reviewed
backup/export decision recorded
```

## Required Environment Variables

```text
NEXT_PUBLIC_APP_URL=https://bizpilo.com
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
BIZPILOT_FOUNDER_EMAILS
OPENAI_API_KEY
```

`OPENAI_API_KEY` is required for model-backed AI demos. The app must still fail safely when it is absent.

Do not set real secrets in `.env.example`, docs, screenshots, or chat.

During the Vercel-domain transition, keep the current Vercel production URL in Supabase Auth Redirect URLs if reset emails may still be opened from that host.

## Production Migration Procedure

1. Owner confirms the exact target Supabase project.
2. Take or verify the latest backup/export according to the backup strategy.
3. Apply migrations in numeric order only. Do not rename or skip files.
4. Verify `0014`, `0015`, and `0016` with SQL inspection in the target project.
5. Run the RLS suite against a local production-equivalent database or restored staging clone. Do not run `pnpm test:rls` against the managed production database.
6. Review Supabase Security Advisor and Performance Advisor before sharing the live quote link.

## Vercel Deployment

1. Connect the repository.
2. Set production env vars.
3. Deploy from the approved branch only.
4. Run production smoke tests.
5. Connect `bizpilo.com` in Vercel.
6. Wait for Vercel domain status to show Ready and SSL active.
7. Set `NEXT_PUBLIC_APP_URL=https://bizpilo.com`.
8. Set Supabase Auth Site URL to `https://bizpilo.com`.
9. Add Supabase Auth Redirect URLs:
   - `https://bizpilo.com/auth/callback`
   - `https://bizpilo.com/auth/reset-password`
   - `https://bizpilo.com/auth/check-email`
10. Redeploy production.
11. Re-run smoke tests after DNS propagation.

## Production Smoke Test Routes

```text
/
/pricing
/auth/sign-in
/auth/sign-up
/auth/forgot-password
/auth/reset-password
/admin
/dashboard
/dashboard/leads
/dashboard/configuration
/dashboard/business-profile
/dashboard/settings
/quote/[activeSlug]
/quote/[activeSlug]/success
```

## Hard Stop Conditions

Do not proceed to real pilots if any of these fail:

```text
RLS tests fail
public quote submission fails
tenant isolation fails
service-role key appears in client code
AI appears to send automatically
suspended business quote link still accepts submissions
```
