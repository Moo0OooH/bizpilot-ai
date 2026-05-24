# BizPilot AI - Production Deployment Runbook v1.0

## Purpose

Define the production path for moving BizPilot to a real pilot environment without expanding product scope.

## Target Domain

```text
bizpilo.com
```

## Phase 19H Current Deployment Status

| Major Item | Status | Current Evidence |
| --- | --- | --- |
| Domain app route smoke | Pass | Recent production route smoke covered `/`, `/pricing`, auth pages, mobile width, language switch, and no horizontal overflow. |
| Production auth | Open | Signup action no longer crashes and forgot-password production request was clicked, but Supabase email throttling prevented a final clean signup confirmation/reset smoke after the latest auth callback fix. |
| Supabase production target | Blocked | Owner reported `bizpilot-production` with migrations through `0017`, but Phase 19C probes against the Supabase host available from local env found missing current schema columns. Confirm whether Vercel production uses a different project or fix the checked target. |
| Migrations `0014`-`0017` | Open | Do not leave these as stale blockers, but do not mark them independently verified either. Direct SQL/schema verification on the actual production target is still required. |
| fr-CA production quote flow | Blocked | Cannot certify until the actual production schema supports language/admin columns and a disposable fr-CA cleaning workspace can be created. |
| Backup/export/restore | Blocked | Runbook exists, but PITR/export storage/restore target are not decided and no restore drill was performed. |
| OpenAI model-backed demo | Blocked | No non-empty `OPENAI_API_KEY` was available in the checked environment; fallback-only behavior is the verified path. |
| First real pilot data | Blocked | Do not collect real customer/pilot data until schema, auth, backup/restore, and commercial/customer-validation owner actions are resolved or explicitly risk-accepted. |

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
0017_business_preferred_language.sql applied
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
4. Verify `0014`, `0015`, `0016`, and `0017` with SQL inspection in the target project.
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
