# BizPilot AI - Production Deployment Runbook v1.0

## Purpose

Define the production path for moving BizPilot to a real pilot environment without expanding product scope.

## Target Domain

```text
bizpilo.com
```

## Phase 21 Current Deployment Status

Use this table as the active deployment truth. It supersedes older Phase 19H/20 production-target notes where they conflict with the corrected Phase 21 evidence.

| Major Item | Status | Current Evidence |
| --- | --- | --- |
| Domain app route smoke | Pass | Production `https://bizpilo.com` returned HTTP 200 in Phase 21. Earlier route smoke covered `/`, `/pricing`, auth pages, mobile width, language switch, and no horizontal overflow. |
| Production auth | Blocked | Signup confirmation and reset need one controlled production smoke with an approved inbox/mail-capture path. No production signup was sent in Phase 21H. |
| Supabase production target | Confirmed | Corrected project is `bizpilot-production` / `qfqendrqimqvkoojpjao`; Vercel project `moo0ooohs-projects/bizpilot-ai` has a Ready production deployment with aliases including `bizpilo.com`. Required env variable names exist encrypted for Production/Preview; values were not pulled or revealed. |
| Migration/schema state | Object-verified; history unavailable | Required columns/functions, expected `0018` lifecycle/deletion objects, all-public-table RLS enablement, reviewed policies, safe aggregate counts, targeted constraints/seeds, and grant-only `0019` hardening are verified. `supabase_migrations.schema_migrations` is missing, so production remains schema-without-standard-migration-history/manual drift. Do not re-apply `0018` blindly. |
| fr-CA production quote flow | Blocked | Schema support is now object-verified, but Phase 21F still needs an approved disposable fr-CA cleaning business/link and synthetic submission path. |
| Backup/export/restore | Blocked for real customer data | Supabase Free plan has no scheduled backup/PITR available; no manual export or restore drill has been done. This is risk-accepted only for current no-real-user database/security alignment. |
| OpenAI model-backed demo | Blocked | A real-key synthetic dry run returned HTTP `429`; no model output was generated or quality-checked. |
| First real pilot data | Blocked | Do not collect real customer/pilot data until production quote/auth smoke, backup/export/restore posture, OpenAI decision, and commercial/customer-validation owner actions are resolved or explicitly approved. |

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

Confirm the target Supabase project before applying migrations or data-bearing smoke tests.

Required migration verification:

```text
0010 through 0013 applied
0014_cleaning_template_contact_address_fields.sql applied
0015_business_access_plan_and_admin_log.sql applied
0016_public_submission_minimum_submit_age_reason.sql applied
0017_business_preferred_language.sql applied
0018_business_lifecycle_deletion_foundation.sql object/RLS/function state verified, do not blindly replay
0019_lifecycle_helper_execute_grant_hardening.sql applied and verified
0020_founder_test_auth_user_cleanup.sql pending production approval/apply if admin auth-user deletion is deployed
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
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
SUPABASE_SECRET_KEY
BIZPILOT_FOUNDER_EMAILS
OPENAI_API_KEY
```

`NEXT_PUBLIC_SUPABASE_ANON_KEY` and `SUPABASE_SERVICE_ROLE_KEY` are legacy fallbacks during migration only.

`OPENAI_API_KEY` is required for model-backed AI demos. The app must still fail safely when it is absent.

Do not set real secrets in `.env.example`, docs, screenshots, or chat.

During the Vercel-domain transition, keep the current Vercel production URL in Supabase Auth Redirect URLs if reset emails may still be opened from that host.

## Production Migration Procedure

1. Owner confirms the exact target Supabase project.
2. Take or verify the latest backup/export according to the backup strategy.
3. Query migration history. If `supabase_migrations.schema_migrations` is missing, treat the database as schema-without-standard-migration-history/manual drift.
4. Apply only missing existing repo migrations in numeric order after object verification and owner approval. Do not rename, skip, or replay verified migrations blindly.
5. Do not create ad-hoc columns or guessed compatibility aliases such as `leads.source`; the repo schema uses `leads.source_channel`.
6. Verify `0014` through `0019`, and `0020` if deployed, by direct SQL object/function/grant/policy checks in the target project.
7. Run the RLS suite against a local production-equivalent database or restored staging clone. Do not run `pnpm test:rls` against the managed production database.
8. Review Supabase Security Advisor and Performance Advisor before sharing the live quote link.

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

Do not push to `origin/main` or trigger a production deployment from this Phase 21 branch without separate explicit owner approval. The current branch is repo-backed preparation and evidence, not an approved production deploy request.

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
