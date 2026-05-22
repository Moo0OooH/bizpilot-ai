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
RLS helper functions current
explicit grants reviewed
Security Advisor reviewed
Performance Advisor reviewed
backup/export decision recorded
```

## Required Environment Variables

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
BIZPILOT_FOUNDER_EMAILS
OPENAI_API_KEY
```

`OPENAI_API_KEY` is required for model-backed AI demos. The app must still fail safely when it is absent.

## Vercel Deployment

1. Connect the repository.
2. Set production env vars.
3. Deploy from the approved branch only.
4. Run production smoke tests.
5. Connect DNS for `bizpilo.com`.
6. Re-run smoke tests after DNS propagation.

## Production Smoke Test Routes

```text
/
/pricing
/auth/sign-in
/dashboard
/dashboard/leads
/dashboard/configuration
/dashboard/business-profile
/dashboard/settings
/admin
/quote/[activeSlug]
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

