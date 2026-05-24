# Phase 21 Pilot Approval Gate

**Project:** BizPilot AI
**Document Type:** Final Phase 21 pilot approval summary
**Status:** Ready only for founder-controlled synthetic demos
**Owner:** MoOoH
**Last Updated:** 2026-05-24

---

## 1. Git

| Item | Result |
| --- | --- |
| Starting commit | `39113f4` |
| Latest committed Phase 21 implementation | `56b81a8` |
| Branch | `phase-21-production-alignment` |
| Pushed | No |
| `origin/main` changed | No; still `7fe0475` |
| Production deploy triggered | No |
| Working tree after `56b81a8` | Clean before Vercel evidence doc update |

## 2. Validation

| Check | Result |
| --- | --- |
| `git diff --check` | Pass; CRLF warnings only |
| `pnpm lint` | Pass |
| `pnpm typecheck` | Pass |
| `pnpm test:unit` | Pass, 37/37 |
| `pnpm test:rls` | Pass, 13/13 through temporary local-only Docker proxy on `127.0.0.1:55432` after applying local `0019` |
| `pnpm build` | Pass |

## 3. Production DB

| Gate | Result |
| --- | --- |
| Target confirmed | Project/domain/env-presence confirmed; corrected Supabase target is `bizpilot-production` / `qfqendrqimqvkoojpjao`, app URL `https://bizpilo.com`; Vercel project is `moo0ooohs-projects/bizpilot-ai`, production deployment is Ready, aliases include `bizpilo.com`, and required env variable names exist encrypted for Production/Preview. Values were not pulled or revealed. |
| Backup/PITR/export safety | Blocked for real customer data; owner confirmed Supabase Free plan, scheduled backups unavailable, PITR not enabled/unavailable, manual export not done, restore drill not done; owner risk-accepts this only for current no-real-customer-data security alignment |
| Migration alignment | Owner-approved for repo-backed database/security closure; owner-run/Codex-run SQL confirms required columns/functions, expected `0018` objects, RLS-enabled status across all public tables, reviewed public RLS policies, safe aggregate counts, function definitions, `0019` grant hardening, and targeted constraints/template seeds. Standard migration history is missing |
| Required columns | Passed owner-run SQL: `businesses.status`, `businesses.internal_note`, `business_members.status`, `public_link_variants.preferred_language`, `leads.source_channel` |
| Required RPCs | Passed owner-run SQL: `public_can_insert_submission_value`, `record_public_submission_attempt`, `count_recent_public_submission_attempts`, `can_request_business_deletion`, `can_view_business_deletion_request` |
| `leads.source` | Not present, as expected; do not add it |
| PostgREST schema cache | RPCs visible by safe probe and owner-run SQL; no schema cache reload run |
| RLS status | Passed owner-run SQL for enabled status and policy-list review: all 31 public tables have `rls_enabled = true`; disabled-RLS anti-query returned 0 rows; 70 public policies reviewed with no obvious policy blocker. |
| Migration `0018` lifecycle/deletion foundation | Owner-run SQL confirms expected lifecycle columns, deletion tables, helper functions, expected deletion-request policies, and function definitions. `supabase_migrations.schema_migrations` is missing, so treat as manual drift/schema-without-standard-migration-history. Least-privilege grant hardening `0019` has been applied and verified. |
| Safe aggregate counts | Passed owner-run SQL: `businesses = 9`, `business_members = 9`, `public_link_variants = 2`, `leads = 0`, `business_deletion_requests = 0`, `business_deletion_tombstones = 0` |
| Function/grant hardening | Passed after `0019`: production verification returned `checked_functions = 6` and `all_grant_checks_passed = true`. Owner-only lifecycle helpers no longer grant `anon` EXECUTE, while public quote helpers kept expected anon/auth/service-role access. |
| Constraint/template verification | Passed targeted production SQL: `submitted_too_fast`, language `fr-CA` checks, language index, and cleaning template fields `customer_phone`, `customer_email`, `home_address` all verified. |

## 4. Production Quote

| Gate | Result |
| --- | --- |
| Public quote security | Not run in production; blocked by backup/migration/history/owner-approval gates |
| fr-CA production smoke | Not run; blocked until production quote security and synthetic fr-CA setup are complete |
| Tenant isolation | Local RLS tests pass; production horizontal-access smoke not run |
| Real customer data intake | Not approved; owner accepts no real pilot yet and wants database/security phases finished first |

## 5. AI

| Gate | Result |
| --- | --- |
| `OPENAI_API_KEY` configured | Present in secure local env template outside repo; not present in local `.env.local` or shell process by default |
| Real-key dry run | Attempted once with synthetic cleaning lead; OpenAI returned HTTP `429`; no model output generated |
| Output quality | Not verified because provider returned `429` |
| Fallback/timeout | Implemented by code inspection; timeout not triggered in real-provider attempt |
| Safe logging | No prompt/customer payload/provider body/key printed; app code sanitizes provider failures to low-cardinality labels |

## 6. Auth

| Gate | Result |
| --- | --- |
| Signup confirmation smoke | Not run |
| Inbox/mail-capture path | Not available |
| Callback behavior | Local callback-routing unit test passed 7/7 |
| Owner action | Provide controlled test inbox/mail-capture and approve exactly one production signup attempt |

## 7. Commercial

| Gate | Result |
| --- | --- |
| Pricing approved | No |
| Trial/refund/cancellation approved | No |
| Payment method approved | No |
| Billing start approved | No |
| Support promise approved | No |
| Pilot limit approved | No |
| Current terms status | Owner decision required |
| Real pilot decision | Owner accepts no real pilot yet |

## 8. Final Decision

Decision:

```text
B. Ready only for founder-controlled synthetic demos
```

Do not choose:

```text
A. Ready for first real pilot customer with real customer data
```

until all blockers below are closed.

## 9. Blockers

| Blocker | Owner/action required | Next step |
| --- | --- | --- |
| Production DB safety incomplete for real customer data | Owner has confirmed Free plan, no scheduled backups/PITR, no export, and no restore drill. Owner approves repo-backed database/security SQL only because no real users exist yet. | Stay synthetic-only until backup/export decision is clear |
| Database/security closure still needs production behavior smoke | Owner now approves repo-backed security/database alignment because no real users exist yet; required columns/functions, expected `0018` objects, RLS-enabled status, policy-list review, safe counts, function definitions, `0019` grants, and targeted constraints/template seeds are verified | Run production quote/security smoke with synthetic data only |
| Migration history missing | `supabase_migrations.schema_migrations` does not exist; direct object verification is now the trusted evidence path | Keep documented as schema-without-standard-migration-history/manual drift; do not replay migrations blindly |
| Owner-reported `0018` manual apply object-verified | Keep `0018` recorded as manual drift/schema-without-standard-migration-history | Do not re-apply blindly; use `0019` for the targeted lifecycle helper grant hardening |
| Production quote security not run | Approve synthetic business/link setup after DB gates close | Run Phase 21E |
| fr-CA production smoke not run | Provide/approve synthetic fr-CA business/link after Phase 21E passes | Run Phase 21F |
| OpenAI real-key output blocked | Resolve OpenAI HTTP `429` through quota/billing/rate-limit/model-access check | Re-run one synthetic dry run |
| Signup confirmation blocked | Provide safe inbox/mail-capture path | Run exactly one signup smoke |
| Commercial terms not approved | Approve setup fee, monthly fee, trial, refund, cancellation, payment, billing start, support, pilot limit | Update terms gate/checklist |

## 10. Security Notes

- no secrets committed,
- no env files committed,
- Vercel env values were not pulled or revealed,
- no dumps committed,
- no customer data committed,
- no full emails/tokens committed,
- production SQL limited to owner-approved grant-only migration `0019`,
- no production deploy or main push,
- no ad-hoc `leads.source` column added.

Owner decision recorded on 2026-05-24:

```text
I accept no real pilot yet.
I do not approve production SQL yet.
Read-only SQL verification is allowed.
No real customer pilot until backup/export decision is clear.
```

Updated owner decision recorded later on 2026-05-24:

```text
No serious/real users yet.
The project is at the beginning.
Changes are allowed so database/security phases can be finished quickly and accurately.
Owner accepts no real pilot yet.
Repo-backed database/security SQL is allowed after target verification.
Do not add ad-hoc columns.
Do not add leads.source.
Do not re-apply 0018 blindly; verify it first.
```

Additional owner approval recorded on 2026-05-24:

```text
Codex may edit the repo, run local validation, prepare commits on the current branch, and apply production grant-only migration 0019 in Supabase.
Main push/deploy remains blocked without separate approval.
```

Additional Vercel evidence recorded on 2026-05-24:

```text
Vercel CLI authenticated as moo0oooh.
Project inspect confirms moo0ooohs-projects/bizpilot-ai, project prj_EHGqbwmTvwDranhRNXAlEJ52z7uJ, Next.js root ".".
Production deployment bizpilot-ezv7ttflm-moo0ooohs-projects.vercel.app is Ready and aliased to bizpilo.com.
Required env variable names exist encrypted for Production/Preview.
No env values were pulled or revealed.
```
