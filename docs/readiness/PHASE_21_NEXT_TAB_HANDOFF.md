# Phase 21 Next Tab Handoff

**Project:** BizPilot AI
**Document Type:** Continuation handoff for the next Codex tab
**Status:** Continue Phase 21 database/security closure
**Owner:** MoOoH
**Last Updated:** 2026-05-24

---

## 1. Current One-Line Truth

```text
BizPilot code/MVP is stable enough for founder-controlled synthetic demos, but it is not approved for the first real customer pilot yet. The owner now approves finishing database/security alignment quickly because there are no serious/real customer users yet.
```

## 2. Current Git State

| Item | Current value |
| --- | --- |
| Current branch | `phase-21-production-alignment` |
| Current HEAD | `39113f475e450e7ca5bfd2e74e161285b724a8d8` |
| Current HEAD short | `39113f4 chore: record phase 20 pilot gate findings` |
| `origin/main` | Unchanged at `7fe0475` |
| Phase 19 branch | `origin/phase-19-readiness-findings` contains `a27705f` |
| Phase 20 branch | `origin/phase-20-pilot-gate` contains `39113f4` |
| Working tree | Dirty; do not commit without inspection |
| Production deploy triggered in Phase 21 | No |

Do not push to `origin/main` unless the owner explicitly approves it. Keep production deploy risk visible.

## 3. Latest Owner Decisions

Owner has clarified:

```text
No serious/real customer users yet.
The project is at the beginning.
It is acceptable to make database/security changes now so the phases can be closed quickly and accurately.
No real customer pilot yet.
```

Allowed now:

- read-only production SQL verification,
- repo-backed production database/security alignment,
- applying missing existing repo migrations in order after verification,
- verifying migration `0018` without blindly replaying it,
- PostgREST schema cache reload only if functions exist but API cache is stale,
- synthetic/founder-controlled demos.

Still not allowed:

- real customer pilot with real customer data,
- destructive purge/anonymization,
- ad-hoc schema patches,
- adding `leads.source`,
- weakening RLS,
- committing secrets, `.env` files, dumps, or customer data,
- pushing `main` without approval.

Current schema rule:

```text
Repo schema uses leads.source_channel.
Do not add leads.source.
```

## 4. Production Target

| Item | Current value |
| --- | --- |
| Supabase project name | `bizpilot-production` |
| Supabase project ref | `qfqendrqimqvkoojpjao` |
| Supabase project URL | `https://qfqendrqimqvkoojpjao.supabase.co` |
| Production app URL | `https://bizpilo.com` |
| Supabase plan | Free |
| Vercel plan | Free / not upgraded |
| Scheduled backups | Not available on current plan |
| PITR | Not enabled / unavailable |
| Restore drill | Not done |
| Manual export | Not done |

Owner risk-accepts the missing backup/PITR/export posture only for current no-real-user database/security alignment. This does not approve real customer data.

## 5. What Has Been Done

### Phase 19

- Phase 19 readiness findings committed as `a27705f`.
- Pushed to `origin/phase-19-readiness-findings`.
- `origin/main` was not changed.
- No production auto-deploy was triggered.
- Findings: code stable, production not yet trusted for real pilot data.

### Phase 20

- Phase 20 pilot gate committed as `39113f4`.
- Pushed to `origin/phase-20-pilot-gate`.
- `origin/main` was not changed.
- No production auto-deploy was triggered.
- Final Phase 20 decision: ready only for founder-controlled synthetic demos.

Validation passed in Phase 20:

- `git diff --check`: pass,
- `pnpm lint`: pass,
- `pnpm typecheck`: pass,
- `pnpm test:unit`: pass,
- `pnpm build`: pass,
- `pnpm test:rls`: pass, 12/12 through local-only Docker proxy.

### Phase 21 So Far

- Started from `39113f4` on `phase-21-production-alignment`.
- Corrected production Supabase target to `qfqendrqimqvkoojpjao`.
- Recorded Supabase Free plan / no scheduled backups / no PITR.
- Created owner SQL verification pack.
- Created SQL-only companion file so owner does not paste Markdown into Supabase SQL Editor.
- Owner attempted to paste Markdown and got `syntax error at or near "#"`. This is understood and documented; no data change occurred.
- Owner then ran the migration-history query and got `42P01: relation "supabase_migrations.schema_migrations" does not exist`. This means production has no reliable standard Supabase CLI migration-history table visible there; do not replay migrations blindly.
- Owner reported manually applying `0018_business_lifecycle_deletion_foundation.sql` and receiving OK.
- Owner-run SQL verification now confirms required columns, required functions, expected `0018` lifecycle/deletion objects, RLS-enabled status across all public tables, public RLS policy-list review, safe aggregate counts, and function definitions exist/pass in production.
- Targeted function/grant verification found owner-only lifecycle helpers were still executable by `anon`, likely through broad default EXECUTE.
- Owner approved production grant-only migration `0019_lifecycle_helper_execute_grant_hardening.sql`; Codex applied it through Supabase SQL Editor and verified `checked_functions = 6`, `all_grant_checks_passed = true`.
- Targeted read-only constraint/template verification passed for `submitted_too_fast`, the `fr-CA` language constraints, `businesses_preferred_language_idx`, and the 0014 cleaning template fields `customer_phone`, `customer_email`, and `home_address`.
- Docs now say: do not re-apply `0018` blindly; treat it as manual drift/schema-without-standard-migration-history unless a later approved repair process creates migration history.
- OpenAI real-key test attempted once with synthetic data and returned HTTP `429`; no model output was generated.
- Signup confirmation smoke remains blocked because there is no safe inbox/mail-capture.
- Pilot terms gate exists but is not owner-approved.

Latest Phase 21 validation after local `0019` grant-hardening apply:

- `git diff --check`: pass, CRLF warnings only,
- `pnpm lint`: pass,
- `pnpm typecheck`: pass,
- `pnpm test:unit`: pass, 37/37,
- `pnpm test:rls`: pass, 13/13 through temporary local-only Docker proxy on `127.0.0.1:55432`,
- `pnpm build`: pass.

The temporary local-only Docker proxy was removed after the RLS run.

## 6. Important Dirty Worktree Areas

The working tree contains uncommitted docs and code. Do not assume it is ready to commit.

Important dirty areas include:

- business lifecycle/deletion UI and services,
- founder test cleanup UI/services,
- migration `0018_business_lifecycle_deletion_foundation.sql`,
- RLS test `business-lifecycle-deletion-foundation.test.sql`,
- unit tests for deletion/cleanup/lifecycle lock,
- Phase 21 readiness docs,
- pilot readiness checklist updates,
- database type updates.

Before committing:

1. inspect `git diff --stat`,
2. inspect relevant `git diff`,
3. confirm no secrets/env/dumps/customer data,
4. run validation,
5. commit only coherent Phase 21 scope.

## 7. Highest-Priority Next Steps

### P0 - Owner SQL Verification

Use:

```text
docs/readiness/PHASE_21C_OWNER_SQL_VERIFICATION_PACK.sql
```

Run only sections `1` through `6` in Supabase SQL Editor.

Do not run section `7` / `NOTIFY pgrst` yet.

Owner should paste back sanitized results for:

- migration history,
- if migration history errors with `42P01`, continue with object verification and document manual drift,
- required columns - passed on 2026-05-24,
- `0018` lifecycle columns - passed on 2026-05-24,
- `0018` deletion tables - passed on 2026-05-24,
- required functions/RPCs - passed on 2026-05-24,
- lifecycle helper function details,
- RLS enabled status - passed on 2026-05-24,
- policy list - reviewed on 2026-05-24 with no obvious policy blocker,
- safe table counts only - passed on 2026-05-24: `businesses = 9`, `business_members = 9`, `public_link_variants = 2`, `leads = 0`, `business_deletion_requests = 0`, `business_deletion_tombstones = 0`.

Do not paste:

- connection strings,
- database password,
- service role key,
- anon key,
- OpenAI key,
- auth tokens,
- confirmation links,
- customer names/emails/phones,
- quote payloads,
- full table rows.

### P0 - Analyze SQL Results

After owner provides sanitized output:

1. keep `schema_migrations` status recorded as unavailable/missing because `supabase_migrations.schema_migrations` does not exist,
2. keep `0018` recorded as object-verified manual drift/schema-without-standard-migration-history,
3. keep `0019` recorded as applied/verified grant-only hardening,
4. keep targeted constraints/template seed checks recorded as passed,
5. map any newly discovered missing objects to existing repo migrations,
6. avoid all guessed SQL,
7. avoid `leads.source`.

### P0 - Apply Or Repair Only Existing Repo-Backed Migration State

Allowed only after verification:

- apply missing existing repo migrations in order,
- or repair migration history if schema already matches and project-approved method is clear,
- reload PostgREST schema cache only if functions exist but API cache is stale.

Already completed:

- `0019_lifecycle_helper_execute_grant_hardening.sql` was applied and verified in production as grant-only SQL.
- Verification returned `checked_functions = 6` and `all_grant_checks_passed = true`.
- Read-only constraint/template verification returned 7 passed checks for abuse reason, language constraints/index, and cleaning template contact/address fields.

Not allowed:

- ad-hoc column creation,
- destructive SQL,
- purge/anonymization,
- broad refactors.

### P1 - Production Public Quote Security

Run only after DB/RPC/RLS alignment:

- active public quote link positive test,
- lead and intake values created,
- owner can see lead,
- another owner cannot see lead,
- inactive link blocked,
- wrong business/form mismatch blocked,
- unknown field blocked,
- hidden field blocked,
- field from another form blocked,
- too-fast submission blocked,
- honeypot blocked,
- malformed payload safely rejected,
- raw DB/provider errors not exposed.

Use synthetic data only.

### P1 - fr-CA Production Quote Smoke

Run only after production quote security passes:

- synthetic fr-CA cleaning business/link,
- mobile width around 390px,
- no horizontal overflow,
- French copy acceptable,
- valid submission works,
- dashboard lead appears,
- lead detail opens,
- organized intake values visible,
- AI/fallback section does not crash,
- manual copy/send workflow clear,
- another owner cannot access the lead.

### P1 - OpenAI Real-Key Dry Run

Current blocker:

```text
OpenAI returned HTTP 429.
```

Owner must check:

- billing,
- quota,
- rate limits,
- model access,
- correct project/org,
- key active in runtime.

Do not paste key. Re-run only with synthetic cleaning lead.

### P1 - Signup Confirmation Smoke

Current blocker:

```text
No safe test inbox or mail-capture path.
```

Owner must provide:

- safe email alias, real test inbox, or mail-capture service,
- approval for exactly one signup attempt.

Do not log full email, confirmation link, or token.

### P1 - Pilot Terms Approval

Current blocker:

```text
Recommended terms exist, but owner has not approved final terms.
```

Owner must approve or edit:

- setup fee,
- monthly fee,
- trial,
- refund,
- cancellation,
- payment collection,
- billing start,
- support promise,
- pilot limit,
- included/excluded scope.

Recommended default is documented but not approved.

## 8. Key Docs To Read First In Next Tab

Start here:

1. `docs/readiness/PHASE_21_NEXT_TAB_HANDOFF.md`
2. `docs/readiness/PHASE_21_PILOT_APPROVAL_GATE.md`
3. `docs/readiness/PHASE_21A_PRODUCTION_TARGET_AND_BACKUP_GATE.md`
4. `docs/readiness/PHASE_21B_PRODUCTION_MIGRATION_DRIFT_MAP.md`
5. `docs/readiness/PHASE_21C_OWNER_SQL_VERIFICATION_PACK.md`
6. `docs/readiness/PHASE_21C_OWNER_SQL_VERIFICATION_PACK.sql`
7. `docs/readiness/PHASE_21D_PRODUCTION_MIGRATION_APPLY_RESULT.md`
8. `docs/operations/BIZPILOT_PILOT_READINESS_CHECKLIST_v1.0.md`
9. `docs/business/PILOT_TERMS_DECISION_GATE.md`
10. `docs/ops/BACKUP_EXPORT_RESTORE_RUNBOOK.md`
11. `docs/security/BIZPILOT_BUSINESS_LIFECYCLE_AND_DELETION_POLICY_v1.0.md`
12. `docs/operations/BIZPILOT_DELETION_AND_CLEANUP_RUNBOOK_v1.0.md`

## 9. Important Code/Migration Files

Inspect before commit:

- `supabase/migrations/0018_business_lifecycle_deletion_foundation.sql`
- `supabase/migrations/0019_lifecycle_helper_execute_grant_hardening.sql`
- `tests/rls/business-lifecycle-deletion-foundation.test.sql`
- `types/database.ts`
- `server/actions/business-deletion.actions.ts`
- `server/services/business-deletion.service.ts`
- `server/services/founder-test-cleanup.service.ts`
- `server/actions/founder-admin.actions.ts`
- `server/services/founder-admin.service.ts`
- `server/repositories/founder-admin.repository.ts`
- `lib/business-deletion/*`
- `lib/business-lifecycle/*`
- `lib/founder-cleanup/*`
- `components/dashboard/workspace-deletion-request-form.tsx`
- `components/admin/founder-test-cleanup-form.tsx`

## 10. Important Logs / Evidence

| Evidence | Where recorded |
| --- | --- |
| Phase 20 final gate and validation | `docs/readiness/PHASE_20_PILOT_GATE_SUMMARY.md` |
| Corrected Supabase target | `docs/readiness/PHASE_21A_PRODUCTION_TARGET_AND_BACKUP_GATE.md` |
| Free plan / no backup / no PITR | `docs/readiness/PHASE_21A_PRODUCTION_TARGET_AND_BACKUP_GATE.md` |
| Migration drift map | `docs/readiness/PHASE_21B_PRODUCTION_MIGRATION_DRIFT_MAP.md` |
| Owner SQL syntax error from pasting Markdown | `docs/readiness/PHASE_21C_OWNER_SQL_VERIFICATION_PACK.md` |
| SQL-only owner pack | `docs/readiness/PHASE_21C_OWNER_SQL_VERIFICATION_PACK.sql` |
| Migration apply decision / `0018` owner-reported manual apply | `docs/readiness/PHASE_21D_PRODUCTION_MIGRATION_APPLY_RESULT.md` |
| Production `0019` grant-only apply/verification | `docs/readiness/PHASE_21D_PRODUCTION_MIGRATION_APPLY_RESULT.md` |
| Production constraint/template verification | `docs/readiness/PHASE_21B_PRODUCTION_MIGRATION_DRIFT_MAP.md`, `docs/readiness/PHASE_21C_OWNER_SQL_VERIFICATION_PACK.md`, `docs/readiness/PHASE_21D_PRODUCTION_MIGRATION_APPLY_RESULT.md` |
| Public quote production blocker | `docs/readiness/PHASE_21E_PRODUCTION_PUBLIC_QUOTE_SECURITY.md` |
| fr-CA production blocker | `docs/readiness/PHASE_21F_FR_CA_PRODUCTION_QUOTE_SMOKE.md` |
| OpenAI HTTP `429` blocker | `docs/readiness/PHASE_21G_OPENAI_REAL_KEY_VALIDATION.md` |
| Signup inbox blocker | `docs/readiness/PHASE_21H_SIGNUP_CONFIRMATION_SMOKE.md` |
| Commercial terms blocker | `docs/business/PILOT_TERMS_DECISION_GATE.md` |

## 11. Next Tab Starter Prompt

Use this in the next tab:

```md
Continue BizPilot Phase 21 from:

- branch: phase-21-production-alignment
- HEAD: 39113f4
- origin/main unchanged at 7fe0475
- working tree dirty; inspect before committing

Read first:
- docs/readiness/PHASE_21_NEXT_TAB_HANDOFF.md
- docs/readiness/PHASE_21_PILOT_APPROVAL_GATE.md
- docs/readiness/PHASE_21A_PRODUCTION_TARGET_AND_BACKUP_GATE.md
- docs/readiness/PHASE_21B_PRODUCTION_MIGRATION_DRIFT_MAP.md
- docs/readiness/PHASE_21C_OWNER_SQL_VERIFICATION_PACK.sql

Owner decision:
- no serious/real customer users yet
- owner approves finishing repo-backed database/security alignment quickly
- no real pilot yet
- no ad-hoc schema patches
- do not add leads.source
- do not re-apply 0018 blindly; verify it first
- do not commit secrets/env/dumps/customer data
- do not push main without explicit approval

First task:
Continue from the owner-run SQL verification already received: migration history table is missing, required columns passed, required functions passed, expected 0018 lifecycle/deletion objects passed, RLS-enabled status passed for all public tables, public RLS policy-list review found no obvious policy blocker, safe aggregate counts passed with leads/deletion rows at 0, and function definitions passed. Targeted function/grant verification found owner-only lifecycle helpers executable by anon; repo-backed migration 0019_lifecycle_helper_execute_grant_hardening.sql was then applied and verified in production with checked_functions = 6 and all_grant_checks_passed = true. Targeted constraint/template checks also passed for submitted_too_fast, fr-CA language constraints/index, and 0014 cleaning template fields. Next run production quote/security smoke with synthetic data only. Do not re-apply 0018 and do not add leads.source.
```

## 12. Current Final Decision

```text
Ready only for founder-controlled synthetic demos.
Not ready for first real pilot customer with real customer data.
Database/security alignment is owner-approved to finish now because there are no serious/real users yet.
```
