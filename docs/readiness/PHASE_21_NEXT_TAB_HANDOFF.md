# Phase 21 Next Tab Handoff

**Project:** BizPilot AI
**Document Type:** Continuation handoff for the next Codex tab
**Status:** Continue Phase 21 readiness closure
**Owner:** MoOoH
**Last Updated:** 2026-05-24

---

## 1. Current One-Line Truth

```text
BizPilot code/MVP is stable enough for founder-controlled synthetic demos, with repo-backed founder admin cleanup, homepage conversion polish, dashboard i18n systemization, and Smart Intake Routing Lite now added locally, but it is not approved for the first real customer pilot yet.
```

## 2. Current Git State

| Item | Current value |
| --- | --- |
| Current branch | `phase-21-production-alignment` |
| Current branch tip before this handoff refresh | `86c1fd0 feat: systemize dashboard i18n`. Re-run `git log -1 --oneline` before continuing. |
| Latest committed Phase 21 hygiene state | `810e8c4 chore: declare package module type` |
| Latest committed Phase 21 evidence/doc state | `ebd4a04 docs: align production readiness runbooks` |
| Latest committed no-cost CI/cost-gate state | `e690243 ci: add no-cost validation and cost gate` |
| Latest committed Phase 21 implementation | `bd3d2a0 feat: sharpen homepage quote recovery conversion` |
| Founder fake/test auth-user cleanup commit | `daa23c8 feat: add safe founder test auth user deletion` |
| Smart intake routing future-doc commit | `27156c5 docs: capture smart intake routing future concept` |
| Homepage conversion polish commit | `bd3d2a0 feat: sharpen homepage quote recovery conversion` |
| Dashboard i18n systemization commit | `86c1fd0 feat: systemize dashboard i18n` |
| Smart Intake Routing Lite commit | Pending at this handoff refresh; run `git log -1 --oneline` after commit |
| Latest GitHub evidence commit | `5a62e76 docs: record github repository evidence` |
| Latest Vercel evidence commit | `9adde10 docs: record vercel production target evidence` |
| Previous Phase 20 baseline | `39113f4 chore: record phase 20 pilot gate findings` |
| `origin/main` | Unchanged at `7fe0475` |
| Phase 19 branch | `origin/phase-19-readiness-findings` contains `a27705f` |
| Phase 20 branch | `origin/phase-20-pilot-gate` contains `39113f4` |
| GitHub remote branches | `main` at `7fe0475`, `phase-19-readiness-findings` at `a27705f`, `phase-20-pilot-gate` at `39113f4` |
| GitHub open PRs/issues/actions | 0 open PRs, 0 open issues, 0 Actions runs reported by public GitHub API |
| Working tree after `86c1fd0` | Smart Intake Routing Lite changes in progress at this update; re-check status before continuing |
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

Owner also granted GitHub/Vercel/Supabase access for needed verification and continuation. Treat that as permission to inspect and continue repo-backed work, not as permission to push `main`, deploy production, reveal secrets, or start a real pilot.

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
| Vercel project | `moo0ooohs-projects/bizpilot-ai` |
| Vercel project ID | `prj_EHGqbwmTvwDranhRNXAlEJ52z7uJ` |
| Vercel production deployment | `bizpilot-ezv7ttflm-moo0ooohs-projects.vercel.app`, Ready |
| Vercel production aliases | `bizpilo.com`, `bizpilot-ai-gamma.vercel.app`, `bizpilot-ai-moo0ooohs-projects.vercel.app`, `bizpilot-ai-git-main-moo0ooohs-projects.vercel.app` |
| Vercel env names/scopes | Required env names exist encrypted for Production/Preview; values were not pulled or revealed |
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
- Vercel read-only verification confirmed authenticated CLI access, project linkage, production deployment status/aliases, and required encrypted env variable names/scopes. Env values were not pulled or revealed. This was committed as `9adde10`.
- GitHub read-only verification confirmed repo `Moo0OooH/bizpilot-ai` is public, default branch is `main`, remote `main` remains `7fe0475`, only Phase 19/20 branches are pushed, and no open PRs/issues/Actions runs are currently reported. This was committed as `5a62e76`.
- No-cost CI workflow and cost/upgrade gate were added after GitHub evidence: `.github/workflows/ci.yml` and `docs/operations/BIZPILOT_COST_AND_UPGRADE_GATE_v1.0.md`. This was committed as `e690243`.
- Production readiness runbooks and historical readiness docs were realigned with Phase 21 evidence so stale Phase 19C schema blockers no longer appear as current operational truth. This was committed as `ebd4a04`.
- `package.json` now declares `"type": "module"` to remove Node's unit-test module-type warnings. `pnpm verify` passed after the change. This was committed as `810e8c4`.
- Founder Admin now has a repo-backed fake/test auth login deletion path guarded against founder accounts, production-customer users, and workspace owners. Migration `0020_founder_test_auth_user_cleanup.sql` extends the audit action constraint locally. It is not pushed, deployed, or applied to production yet. This was committed as `daa23c8`.
- Smart Intake Routing was first documented as a future product concept in `27156c5`.
- Smart Intake Routing Lite is now implemented locally as a deterministic cleaning-first suggestion layer in Lead Detail: priority, suggested queue, suggested reviewer, reasons, missing-info summary, and next action. It has no migration, no routing persistence, no auto-assignment, no auto-send, no external API usage, and no production deploy. Evidence is recorded in `docs/readiness/PHASE_21J_SMART_INTAKE_ROUTING_LITE.md`.
- Homepage conversion polish tightened the hero, added an operational pain story, made the hero recovery visual outcome-first, added a live workflow demo, preserved the no-auto-send trust anchor, and updated homepage copy tests/standards. This was committed as `bd3d2a0`.
- Dashboard i18n systemization made `businesses.preferred_language` the authenticated dashboard source of truth, moved visible dashboard overview/leads/configuration/settings/business-profile copy into the central dictionary, localized readiness task labels by `taskKey`, kept client shell copy serializable, and added regression tests against mojibake and local dashboard language branches. Evidence is recorded in `docs/readiness/PHASE_21I_DASHBOARD_I18N_SYSTEMIZATION.md`.
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

Latest validation after the founder fake/test auth-user cleanup slice:

- `pnpm verify`: pass,
- `pnpm test:unit`: pass, 42/42,
- local migration `0020_founder_test_auth_user_cleanup.sql` applied to the local Supabase DB only,
- `pnpm test:rls`: pass, 13/13 through temporary local-only Docker proxy on `127.0.0.1:55432`,
- temporary local-only Docker proxy removed after the RLS run.

Latest validation after homepage conversion polish:

- `pnpm verify`: pass,
- `pnpm test:unit`: pass, 42/42,
- local browser QA on `http://127.0.0.1:3000/`: hero and live workflow demo visible,
- local browser QA viewport around 500px: no horizontal overflow detected,
- production deploy: not triggered.

Latest validation after dashboard i18n systemization:

- `pnpm verify`: pass,
- `pnpm test:unit`: pass, 45/45,
- browser QA on `http://localhost:3000/dashboard`, `/dashboard/configuration`, and `/dashboard/leads`: rendered locally after fixing client serialization, no horizontal overflow at mobile-width viewport around 486px,
- browser console on the tested route after the serialization fix: no current console errors,
- production deploy: not triggered,
- production SQL: not touched.

Latest validation after Smart Intake Routing Lite:

- `pnpm test:unit`: pass, 48/48,
- `pnpm typecheck`: pass,
- `pnpm lint`: pass,
- `pnpm build`: pass,
- `git diff --check`: pass, CRLF warnings only,
- changed-file secret scan: no key/token/private-key pattern matches,
- browser QA on local `/dashboard/leads/[leadId]`: Smart Intake Routing panel visible,
- browser QA viewport around 500px: no horizontal overflow,
- production deploy: not triggered,
- production SQL: not touched.

## 6. Important Working Tree Areas

The Phase 21 implementation baseline was committed locally as `56b81a8`; evidence/operations/hygiene commits through `810e8c4` followed it. Later local continuation commits added founder fake/test auth cleanup (`daa23c8`), a future Smart Intake Routing doc (`27156c5`), and homepage conversion polish (`bd3d2a0`). Re-check `git status --short --branch` before any additional commit or push.

Important Phase 21 areas include:

- business lifecycle/deletion UI and services,
- founder test cleanup UI/services,
- migration `0018_business_lifecycle_deletion_foundation.sql`,
- RLS test `business-lifecycle-deletion-foundation.test.sql`,
- unit tests for deletion/cleanup/lifecycle lock,
- Phase 21 readiness docs,
- pilot readiness checklist updates,
- database type updates.
- founder fake/test auth login deletion UI/service/tests and migration `0020`,
- homepage conversion polish in `app/page.tsx`, `lib/i18n/home-copy.ts`, and `app/globals.css`,
- dashboard i18n systemization in `lib/i18n/bizpilot-copy.ts`, `lib/i18n/language.ts`, `app/(dashboard)/**`, and `components/dashboard/**`,
- Smart Intake Routing Lite in `server/services/lead-conversion-rules.service.ts`, `server/services/lead-conversion.service.ts`, `app/(dashboard)/dashboard/leads/[leadId]/page.tsx`, central dashboard copy, and unit tests.

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
13. `docs/operations/BIZPILOT_COST_AND_UPGRADE_GATE_v1.0.md`
14. `docs/readiness/PHASE_21I_DASHBOARD_I18N_SYSTEMIZATION.md`
15. `.github/workflows/ci.yml`
16. `package.json`

## 9. Important Code/Migration Files

Inspect before commit:

- `supabase/migrations/0018_business_lifecycle_deletion_foundation.sql`
- `supabase/migrations/0019_lifecycle_helper_execute_grant_hardening.sql`
- `supabase/migrations/0020_founder_test_auth_user_cleanup.sql`
- `tests/rls/business-lifecycle-deletion-foundation.test.sql`
- `types/database.ts`
- `server/actions/business-deletion.actions.ts`
- `server/services/founder-auth-user-cleanup.service.ts`
- `server/services/business-deletion.service.ts`
- `server/services/founder-test-cleanup.service.ts`
- `server/actions/founder-admin.actions.ts`
- `server/services/founder-admin.service.ts`
- `server/repositories/founder-admin.repository.ts`
- `lib/business-deletion/*`
- `lib/business-lifecycle/*`
- `lib/founder-cleanup/*`
- `components/admin/founder-auth-user-delete-form.tsx`
- `components/dashboard/workspace-deletion-request-form.tsx`
- `components/admin/founder-test-cleanup-form.tsx`
- `app/page.tsx`
- `app/(dashboard)/layout.tsx`
- `app/(dashboard)/dashboard/page.tsx`
- `app/(dashboard)/dashboard/leads/page.tsx`
- `app/(dashboard)/dashboard/configuration/page.tsx`
- `app/(dashboard)/dashboard/business-profile/page.tsx`
- `app/(dashboard)/dashboard/settings/page.tsx`
- `app/globals.css`
- `components/dashboard/dashboard-shell.tsx`
- `components/dashboard/dashboard-sidebar.tsx`
- `components/dashboard/dashboard-topbar.tsx`
- `components/dashboard/lead-workspace-queue.tsx`
- `lib/i18n/home-copy.ts`
- `lib/i18n/bizpilot-copy.ts`
- `lib/i18n/language.ts`
- `tests/unit/i18n-copy.test.mts`
- `docs/product/BIZPILOT_HOMEPAGE_AND_VISUAL_THEME_STANDARD_v1.0.md`
- `docs/product/BIZPILOT_SMART_INTAKE_ROUTING_FUTURE_SPEC_v1.0.md`

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
| Vercel production evidence | `docs/readiness/PHASE_21A_PRODUCTION_TARGET_AND_BACKUP_GATE.md`, `docs/readiness/PHASE_21_PILOT_APPROVAL_GATE.md` |
| GitHub read-only evidence | `docs/readiness/PHASE_21_NEXT_TAB_HANDOFF.md`, `docs/readiness/PHASE_21_PILOT_APPROVAL_GATE.md` |
| Public quote production blocker | `docs/readiness/PHASE_21E_PRODUCTION_PUBLIC_QUOTE_SECURITY.md` |
| fr-CA production blocker | `docs/readiness/PHASE_21F_FR_CA_PRODUCTION_QUOTE_SMOKE.md` |
| OpenAI HTTP `429` blocker | `docs/readiness/PHASE_21G_OPENAI_REAL_KEY_VALIDATION.md` |
| Signup inbox blocker | `docs/readiness/PHASE_21H_SIGNUP_CONFIRMATION_SMOKE.md` |
| Commercial terms blocker | `docs/business/PILOT_TERMS_DECISION_GATE.md` |
| Founder auth-user cleanup and homepage polish | This handoff, `docs/operations/BIZPILOT_DELETION_AND_CLEANUP_RUNBOOK_v1.0.md`, `docs/product/BIZPILOT_HOMEPAGE_AND_VISUAL_THEME_STANDARD_v1.0.md` |
| Dashboard i18n systemization | `docs/readiness/PHASE_21I_DASHBOARD_I18N_SYSTEMIZATION.md`, `tests/unit/i18n-copy.test.mts` |

## 11. Next Tab Starter Prompt

Use this in the next tab:

```md
Continue BizPilot Phase 21 from:

- branch: phase-21-production-alignment
- latest committed Phase 21 evidence/doc state: ebd4a04
- latest committed Phase 21 hygiene state: 810e8c4
- latest committed no-cost CI/cost-gate state: e690243
- latest committed Phase 21 implementation: bd3d2a0
- founder fake/test auth-user cleanup commit: daa23c8
- smart intake routing future-doc commit: 27156c5
- homepage conversion polish commit: bd3d2a0
- dashboard i18n systemization commit: this commit (`feat: systemize dashboard i18n`); run `git log -1 --oneline`
- latest GitHub evidence commit: 5a62e76
- origin/main unchanged at 7fe0475
- GitHub remote has only main/phase-19/phase-20 pushed; phase-21-production-alignment is local-only unless pushed later with approval
- re-check working tree before committing

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
- GitHub/Vercel/Supabase access is approved for needed verification and continuation
- no ad-hoc schema patches
- do not add leads.source
- do not re-apply 0018 blindly; verify it first
- do not commit secrets/env/dumps/customer data
- do not push main without explicit approval
- do not reveal/pull secret env values unless explicitly approved and operationally necessary

Current continuation state:
Owner-run SQL verification already received: migration history table is missing, required columns passed, required functions passed, expected 0018 lifecycle/deletion objects passed, RLS-enabled status passed for all public tables, public RLS policy-list review found no obvious policy blocker, safe aggregate counts passed with leads/deletion rows at 0, and function definitions passed. Targeted function/grant verification found owner-only lifecycle helpers executable by anon; repo-backed migration 0019_lifecycle_helper_execute_grant_hardening.sql was then applied and verified in production with checked_functions = 6 and all_grant_checks_passed = true. Targeted constraint/template checks also passed for submitted_too_fast, fr-CA language constraints/index, and 0014 cleaning template fields. Founder fake/test auth-user deletion is repo-backed/local-verified only; production 0020 is not applied and deployment is not approved. Homepage conversion polish is local-verified and not deployed. Dashboard i18n systemization is local-verified and not deployed; authenticated dashboard language is now business-first instead of stale-cookie-first. Next production task remains quote/security smoke with synthetic data only after owner approval. Do not re-apply 0018 and do not add leads.source.
```

## 12. Current Final Decision

```text
Ready only for founder-controlled synthetic demos.
Not ready for first real pilot customer with real customer data.
Database/security alignment is owner-approved to finish now because there are no serious/real users yet.
Founder fake/test auth-user cleanup and homepage conversion polish are local/repo-backed only until owner-approved push/deploy and production migration `0020` apply.
```
