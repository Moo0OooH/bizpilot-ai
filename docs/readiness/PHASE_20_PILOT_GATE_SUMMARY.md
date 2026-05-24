# Phase 20 Pilot Gate Summary

**Project:** BizPilot AI
**Document Type:** Final Phase 20 pilot gate
**Status:** Ready only for founder-controlled synthetic demos
**Owner:** MoOoH
**Last Updated:** 2026-05-24

---

## 1. Baseline

| Item | Result |
| --- | --- |
| Starting commit | `a27705f9cf6ddfef8e9e3e97d4af65f0307861f2` (`a27705f chore: record phase 19 readiness findings`) |
| Ending commit | Recorded by the post-validation git commit; see final command report / latest Phase 20 commit. |
| Branch | `main` |
| Local branch state | `main...origin/main [ahead 1]` |
| Was `a27705f` pushed? | Yes, remote ref `origin/phase-19-readiness-findings` points to `a27705f`. |
| Was `origin/main` changed? | No. `origin/main` remains `7fe0475d08ba32b904c9ae49ab711c12de73e241`. |
| Production auto-deploy triggered by pushing `main`? | No evidence of this; `origin/main` was not changed. |
| Working tree | Phase 20 changes reviewed for an intentional readiness commit after validation. |

Files reviewed for the Phase 20 readiness commit:

```text
M  app/auth/check-email/page.tsx
M  docs/operations/BIZPILOT_PILOT_READINESS_CHECKLIST_v1.0.md
M  docs/ops/BACKUP_EXPORT_RESTORE_RUNBOOK.md
M  lib/i18n/bizpilot-copy.ts
M  server/actions/auth.actions.ts
M  server/services/auth.service.ts
?? docs/business/PILOT_TERMS_DECISION_GATE.md
?? docs/readiness/PHASE_20A_PRODUCTION_SUPABASE_TARGET.md
?? docs/readiness/PHASE_20B_PRODUCTION_DB_SAFETY.md
?? docs/readiness/PHASE_20C_PRODUCTION_MIGRATION_ALIGNMENT.md
?? docs/readiness/PHASE_20D_LOCAL_RLS_TEST_RESULT.md
?? docs/readiness/PHASE_20E_PUBLIC_QUOTE_SECURITY_VERIFICATION.md
?? docs/readiness/PHASE_20F_FR_CA_QUOTE_FLOW_SMOKE.md
?? docs/readiness/PHASE_20G_OPENAI_REAL_KEY_DRY_RUN.md
?? docs/readiness/PHASE_20H_SIGNUP_CONFIRMATION_FINAL_SMOKE.md
?? docs/readiness/PHASE_20_PILOT_GATE_SUMMARY.md
```

## 2. Validation

| Check | Result | Evidence |
| --- | --- | --- |
| `pnpm lint` | Pass | Re-run on 2026-05-24; exit code 0. |
| `pnpm typecheck` | Pass | Re-run on 2026-05-24; exit code 0. |
| `pnpm test:unit` | Pass | Re-run on 2026-05-24; 22/22 tests passed. |
| `pnpm build` | Pass | Re-run on 2026-05-24; Next.js production build completed. |
| `pnpm test:rls` | Pass locally | Re-run on 2026-05-24 against local Docker-backed Postgres through temporary proxy; 12/12 SQL RLS tests passed. Not run against production. |
| Route smoke | Pass | Production GET smoke returned 200 for `/`, `/pricing`, `/auth/sign-up`, `/auth/check-email`, `/auth/forgot-password`, `/auth/reset-password`. |
| Public quote smoke | Partial / blocked for production | Local production-equivalent RLS public quote checks passed in Phase 20E. Production public quote submission was not verified because schema/RPC alignment is blocked. |
| fr-CA smoke | Blocked | Phase 20F was not run; checked production target still lacks language/status/RPC objects. |
| OpenAI dry run | Blocked | Phase 20G found `OPENAI_API_KEY` present but empty in `.env.local`; no OpenAI request was made. |
| Signup final smoke | Blocked | Phase 20H did not send a production signup request because no accessible safe test inbox/mail-capture path was available. Callback routing unit test passed 7/7. |

## 3. Production DB

| Gate | Result | Notes |
| --- | --- | --- |
| Production target confirmed | No | Vercel production env target was not independently confirmed. Local env points to Supabase ref `cwiuajpbpyybxxtodpaq`; owner-reported project name is `bizpilot-production`. |
| Migration alignment | No | Checked target is not aligned with repo migrations. |
| Missing objects resolved | No | Missing objects still include `businesses.status`, `business_members.status`, `public_link_variants.preferred_language`, `public_submission_abuse_log`, and related hardening RPCs. |
| RPCs available | No | `public_can_insert_submission_value`, `record_public_submission_attempt`, and `count_recent_public_submission_attempts` are not available from the checked PostgREST schema cache. |
| PostgREST schema cache OK | No | PostgREST still reports missing current tables/functions on the checked target. |
| Production RLS verified | No | Local RLS passed 12/12. Production RLS policy/function verification was blocked by missing direct SQL access and unsafe production-change posture. |
| Production SQL approved | No | Phase 20A/20B safety gates are not satisfied. |

## 4. Backup / Data Safety

| Gate | Result | Notes |
| --- | --- | --- |
| PITR known | No | Owner must verify Supabase plan/PITR in dashboard. |
| Backup retention known | No | Owner action required. |
| Export done | No | `pg_dump`, `psql`, Supabase CLI, production connection, and approved export storage were unavailable. |
| Schema dump done | No | Blocked. |
| Restore drill done | No | Blocked; no dump and no restore target. |
| Deletion/export process exists | Yes | Manual pilot process documented in `docs/ops/BACKUP_EXPORT_RESTORE_RUNBOOK.md`. |
| Privacy incident process exists | Yes | Manual process documented; any real incident log must stay outside git if it contains personal data. |
| Checked DB data classification | `unknown_or_possible_real_data_present` | Do not treat the checked DB as disposable. |

## 5. Commercial Readiness

| Gate | Result | Notes |
| --- | --- | --- |
| Pilot terms approved | No | `docs/business/PILOT_TERMS_DECISION_GATE.md` marks setup fee, monthly fee, trial, refund, cancellation, payment collection, billing start, included scope, support promise, and non-responsive-customer handling as owner decisions. |
| Pricing approved | No | `$199 setup + $49/month` is recommended only, not final. Public pricing still shows Founder Pilot as `manual offer` / `14-day pilot`. |
| Payment collection ready | No | Manual invoice or Stripe Payment Link is recommended, but no actual collection process/asset is verified. |
| Product exclusions approved | Yes | No auto-send, booking, invoicing, calendar sync, SMS/WhatsApp automation, Instagram API, multi-vertical expansion, or full CRM expansion. |

## 6. Final Decision

**B. Ready only for founder-controlled synthetic demos**

BizPilot is not ready for the first real pilot customer with real customer data.

It is acceptable only for founder-controlled demos using synthetic data, with blockers disclosed and without representing production as trusted.

## 7. Exact Blockers

| Blocker | Owner/action required | Next step |
| --- | --- | --- |
| Production Supabase target not fully confirmed | Owner must confirm Vercel production `NEXT_PUBLIC_SUPABASE_URL` and matching Supabase project ref/name without exposing keys. | Record target proof in Phase 20A, then re-run safe schema/RPC probes. |
| Production schema/RPC drift remains | Owner/operator must approve production SQL only after target and backup gates are satisfied. | Read migration history, apply existing repo migrations in order, verify columns/functions/policies, reload PostgREST cache if needed. |
| Public quote hardening RPCs unavailable on checked target | Operator must verify/apply migrations `0012`, `0013`, `0016` on the actual production DB. | Confirm `public_can_insert_submission_value`, `record_public_submission_attempt`, and `count_recent_public_submission_attempts` through SQL and REST/RPC probes. |
| Production RLS not verified | Direct SQL access or approved verification path required. | Run requested `pg_class`/`pg_policies`/function verification after migrations and cache refresh. |
| PITR/backup/export safety unknown | Owner must record Supabase plan, PITR, retention, export storage, and access list. | Create schema-only export or explicit owner risk acceptance, then complete restore drill. |
| Production fr-CA quote smoke blocked | Requires aligned production schema/RPCs and safe synthetic test setup. | Create disposable fr-CA cleaning business/link, submit one safe test quote, verify dashboard/lead/tenant isolation, then clean up if required. |
| OpenAI real-key dry run blocked | Owner must configure non-empty `OPENAI_API_KEY` through approved secret path. | Run one synthetic cleaning lead AI dry run and review summary/reply/follow-up quality and guardrails. |
| Signup confirmation final smoke blocked | Owner/operator must provide a controlled test inbox/mail-capture path. | Run exactly one production signup, open confirmation email, verify `/auth/callback`, stop if rate-limited. |
| Pilot terms not approved | Owner must approve setup fee, monthly fee, trial, refund, cancellation, payment collection, billing start, included scope, support promise, and non-responsive-customer handling. | Update `PILOT_TERMS_DECISION_GATE.md`; only then treat terms as final. |
| Payment collection not ready | Owner must choose and verify manual invoice or Stripe Payment Link process. | Create/test payment collection asset outside app billing automation. |
