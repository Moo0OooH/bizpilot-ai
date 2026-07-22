# BizPilot AI - Production Deployment Runbook v1.0

Updated: 2026-07-22 — recorded the completed Production drift repair and Premium Operations migration through `0026`.

## Purpose

Define the production path for moving BizPilot to a real pilot environment without expanding product scope.

## Target Domain

```text
bizpilo.com
```

## Current Release Status — Dashboard V4.7 and Premium Operations

Use this table as the active deployment truth. Historical phase evidence does not prove a later commit.

| Major Item | Status | Current Evidence |
| --- | --- | --- |
| Historical V4.7 source identity | Local Git fact | Commit `d9e25bbf50ccf42de2da4d70aa235ab7d289dc91` is present locally with tree `17d6b65cc9fb196c8d0d4ccaa46f5fd6f736076d`; the previously documented `a82af72bf8960b2bce1583e6446abca706c2a2bc` object is absent. These local facts do not independently revalidate historical external evidence. |
| Exact-commit CI and deployment | Candidate PASS / Production pending | Candidate `9ae149c` passed GitHub App validation run `29939791308`, Vercel Preview `9Akuehj14QYGPpAM4pFYBT3JySih`, and the 16-state Preview public matrix. Final `main` deployment acceptance remains pending. |
| Production QA mode | Read-only only | Public GET, locale, responsive, security-header, and owner-approved authenticated visual checks may run. Do not sign up, submit quotes, edit settings, create leads/users, or mutate Production for QA. |
| Production auth | Gated | Signup confirmation, reset, Google callback, and session behavior require an approved synthetic non-Production target or a separately controlled no-write authenticated acceptance path. Google login must not create a workspace silently. |
| Supabase/Vercel target | Owner confirmation required | Confirm the exact project and deployment target immediately before any external action. Do not rely on historical identifiers or pull secret values into this environment. |
| Migration/schema state | PASS through `0026` | Repaired verified migration history, replayed idempotent drift migrations `0020`, `0021`, `0023`, and `0024`, then applied `0025` and `0026`. Final schema matches all `36` tables, `54` functions, `65` indexes, and `87` policies; the only dump difference is harmless physical column order. |
| Production read-only smoke | Historical / re-verify | Older public-read figures are not a release proof for the current candidate. Run no-write smoke only after source publication and target confirmation; submission and success-flow proof stays on an approved disposable target. |
| Founder shell activation | Historical / protected acceptance gated | A historical screenshot is not a substitute for current protected/Admin route acceptance or normal-owner denial proof. |
| Backup/export/restore | PASS for code release; real-data policy separate | A current roles/schema/public-data export was created outside git and restored without printing row content. After the reconciled `0023`, `0025`, and `0026` sequence plus the cross-schema auth trigger, the disposable target passed RLS `14/14`, authenticated dashboard/Admin `17/17`, active quote GET `2/2`, and independent EN/fr-CA submissions. |
| OpenAI model-backed demo | Blocked | A real-key synthetic dry run returned HTTP `429`; no model output was generated or quality-checked. |
| First real pilot data | Blocked | Do not collect real customer/pilot data until strict restored-target proof, auth/provider acceptance, privacy/operations gates, final read-only Production acceptance, and explicit owner approval all pass. |

## Preflight

Before production deployment:

```text
pnpm lint
pnpm typecheck
pnpm test:unit
pnpm audit:supabase
pnpm build
secret scan
manual browser QA
```

Run `pnpm test:rls` only against a proven local or disposable restored database. It is a strict real-data prerequisite, not a managed-Production smoke command.

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
0020_founder_test_auth_user_cleanup.sql applied/replayed idempotently and verified
0021_session_policy_and_owner_audit.sql applied/replayed idempotently and verified
0022_custom_quote_field_builder.sql reconciled before any write
0023_public_submission_abuse_log_retention.sql applied and verified
0024_supabase_status_and_rls_performance_hardening.sql applied/replayed idempotently and verified
0025_premium_operations_addons.sql followed by 0026_premium_operations_schedule_integrity.sql applied and verified in Production after passing ordered local/restore proof
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
BIZPILOT_IP_HASH_SALT
OPENAI_API_KEY
```

`NEXT_PUBLIC_SUPABASE_ANON_KEY` and `SUPABASE_SERVICE_ROLE_KEY` are legacy fallbacks during migration only.

`OPENAI_API_KEY` is required for model-backed AI demos. The app must still fail safely when it is absent.

`BIZPILOT_IP_HASH_SALT` is required in Production for public-submission abuse-log hashing; Production fails closed when it is missing. Use a unique secret value and never disclose it in docs, screenshots, logs, or chat.

Do not set real secrets in `.env.example`, docs, screenshots, or chat.

During the Vercel-domain transition, keep the current Vercel production URL in Supabase Auth Redirect URLs if reset emails may still be opened from that host.

## Production Migration Procedure

1. Owner confirms the exact target Supabase project.
2. Take or verify the latest backup/export according to the backup strategy.
3. Query migration history. If `supabase_migrations.schema_migrations` is missing, treat the database as schema-without-standard-migration-history/manual drift.
4. Apply only missing existing repo migrations in numeric order after object verification and owner approval. Do not rename, skip, or replay verified migrations blindly.
5. Do not create ad-hoc columns or guessed compatibility aliases such as `leads.source`; the repo schema uses `leads.source_channel`.
6. Verify `0014` through `0026` by direct read-only SQL object/function/grant/policy checks in the target project; record absent, present, and drifted objects separately.
7. Before proposing Premium Operations for Production, apply `0025` and then `0026` on an approved local/disposable target and pass entitlement, RLS, tenant-isolation, review/copy lifecycle, overlap, provenance/currentness, and concurrency checks.
8. Run the complete RLS suite plus authenticated app/dashboard/intake/isolation proof against a disposable restored target. Do not run `pnpm test:rls` against the managed production database.
9. Treat Phase 24C.0 as historical DB-level partial evidence only; it does not satisfy Step 8.
10. Review Supabase Security Advisor and Performance Advisor before sharing the live quote link.

## Vercel Deployment

1. Connect the repository.
2. Set production env vars.
3. Deploy the exact approved `main` commit; record its SHA and tree rather than relying on a branch label alone.
4. Run only read-only Production smoke tests.
5. Connect `bizpilo.com` in Vercel.
6. Wait for Vercel domain status to show Ready and SSL active.
7. Set `NEXT_PUBLIC_APP_URL=https://bizpilo.com`.
8. Set Supabase Auth Site URL to `https://bizpilo.com`.
9. Add Supabase Auth Redirect URLs:
   - `https://bizpilo.com/auth/callback`
   - `https://bizpilo.com/auth/reset-password`
   - `https://bizpilo.com/auth/check-email`
10. Redeploy production.
11. Re-run the read-only smoke suite after DNS propagation and map evidence to the exact commit/deployment.

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
/dashboard/reports
/dashboard/configuration
/dashboard/business-profile
/dashboard/settings
/dashboard/guide
/quote/[activeSlug]
/quote/[inactiveSlug]
```

Protected routes require an owner-approved no-secret authenticated session and remain read-only in Production. Do not navigate by submitting a quote to reach the success route; test write/success behavior only on the disposable synthetic target.

## Hard Stop Conditions

Do not proceed to real pilots if any of these fail:

```text
RLS tests fail
restored app/dashboard/intake/RLS or tenant-isolation proof is absent
public quote submission fails
tenant isolation fails
service-role key appears in client code
AI appears to send automatically
suspended business quote link still accepts submissions
Google authentication silently creates a workspace
```
