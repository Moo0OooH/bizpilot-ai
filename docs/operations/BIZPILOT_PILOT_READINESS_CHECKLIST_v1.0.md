# BizPilot AI - Pilot Readiness Checklist v1.0

**Project:** BizPilot AI  
**Document Type:** Pilot Readiness Checklist  
**Version:** v1.0  
**Status:** Required Before Phase 18 Pilot  
**Owner:** MoOoH  
**Last Updated:** 2026-05-25
**Related:**
- `docs/CURRENT_CANONICAL_DOCS_v1.7.md`
- `docs/BIZPILOT_STRATEGIC_ALIGNMENT_UPDATE_v1.6.md`
- `docs/operations/BIZPILOT_MANUAL_QA_CHECKLIST_v1.0.md`
- `docs/operations/BIZPILOT_BACKUP_AND_EXPORT_STRATEGY_v1.0.md`
- `docs/ops/BACKUP_EXPORT_RESTORE_RUNBOOK.md`
- `docs/business/PILOT_TERMS_DECISION_GATE.md`
- `docs/business/PILOT_OFFER_AND_PRICING_DECISIONS.md`
- `docs/sales/FOUNDER_CRM_AND_OUTREACH_PLAYBOOK.md`
- `docs/gtm/BIZPILOT_GTM_PLAYBOOK_v1.1.md`
- `docs/finance/BIZPILOT_COST_CONTROL_AND_UNIT_ECONOMICS_v1.0.md`

---

## 1. Purpose

This checklist decides whether BizPilot AI is ready to begin Phase 18: founder-led pilots with three cleaning businesses.

Pilot readiness is not feature expansion. It confirms that the current Lead Recovery & Response MVP is safe, focused, demoable, and operationally calm enough to put in front of real cleaning-business owners.

## 1A. Phase 21 Current Pilot Gate Status

Use this table as the current Phase 21 truth. It supersedes older Phase 19/20 probe results where the production target or local RLS state has changed.

| Major Item | Status | Current Evidence |
| --- | --- | --- |
| Git/deploy safety | Pass (updated 2026-05-25) | `main` was fast-forwarded to `b10f1a4` and deployed to production on 2026-05-25. Rollback tags `backup/main-pre-phase21-20260525-004550` and `backup/phase21-pre-production-20260525-004550` were pushed before deploy. Bootstrap fix `5758a0b` and doc commits `d0c4539`, `4f64110`, `862b716` were pushed to `main` and deployed. `.gitattributes` hygiene commit `8bf3387` was applied locally (awaiting push). Both `main` and `phase-21-production-alignment` are locally at `8bf3387`. |
| Baseline app validation | Pass (updated 2026-05-25) | `pnpm test:unit` 53/53 passed in the current session. Prior full `pnpm verify` (lint, typecheck, unit, build) passed through the production deploy session. `pnpm test:rls` 13/13 passed through local Docker proxy in an earlier session. |
| Production target | Deployed and verified (updated 2026-05-25) | `bizpilot-production` / `qfqendrqimqvkoojpjao` / `https://bizpilo.com`. Latest Vercel production deployment `dpl_7Z7kh6Z2PH9y2ho5QUtpyDrHCks6` is Ready. Post-deploy route smoke: HTTP 200 for `/`, `/pricing`, all auth pages, logged-out `/admin` redirect, inactive quote slug. Env values not pulled or revealed. |
| Backup/PITR/export/restore | Blocked for real customer data | Supabase Free plan; no scheduled backups, no PITR. Manual export not done; restore drill not done. Owner risk-accepted for current no-real-user align. Not acceptable for real customer data. |
| Migration drift/history | Verified (no history table) | Required columns, functions, `0018` objects, RLS on all 31 tables, policies, `0019` grants, and targeted constraints/seeds verified by owner-run SQL. `supabase_migrations.schema_migrations` missing; manual drift accepted. Do not re-apply `0018` blindly. |
| Migration `0018` lifecycle/deletion status | Object-verified; manual drift | Owner-run SQL verified all `0018` objects, columns, policies, and functions. `0019` grant hardening applied and verified: `checked_functions = 6`, `all_grant_checks_passed = true`. Treat as manual drift; do not replay. |
| Production migration apply | `0019` done; `0020` pending owner decision | `0019` grant-only apply verified. `0020_founder_test_auth_user_cleanup.sql` is repo-backed and locally validated only. Apply `0020` only after explicit owner approval. |
| Founder fake/test auth user cleanup | Repo-backed + local; not production-deployed | Admin has a guarded fake/test auth login deletion UI. `0020` not applied to production. Cleanup UX has production-safe warnings and dry-run requirement. |
| Production public quote security | Partially started; bootstrap fix deployed (2026-05-25) | Signup smoke revealed new-workspace quote URL showed `Quote page unavailable`. Bootstrap fix `5758a0b` deployed. Post-fix signup retest blocked by Auth rate limiting during same session. Full Phase 21E security smoke (positive + negative matrix from Phase 21N) still not run. |
| fr-CA production quote smoke | Blocked | Depends on Phase 21E passing first and approved fr-CA synthetic workspace. |
| OpenAI real-key validation | Blocked | HTTP `429` from provider. Owner must check billing, quota, model access, and rate limits, then run exactly one synthetic dry run. |
| Signup confirmation smoke | Passed (2026-05-25) | Synthetic disposable inbox used; confirmed owner reached `/dashboard`. Credentials and artifacts stored outside repo. Post-fix retest blocked by Auth rate limiting; should retest when limits clear. |
| Pilot commercial terms | Owner decision required | Recommended default (`$199 setup + $49/month`) not yet approved. Pricing mismatch across pages not resolved. |
| First real pilot customer readiness | Blocked | Still not ready. Remaining blockers: production quote security smoke, fr-CA smoke, OpenAI validation, backup/export posture, commercial terms, live admin visual QA, horizontal-access smoke. |

## 1B. Phase 19H Historical Readiness Status

The Phase 19 table below remains for context. Use Section 1A as the current Phase 21 gate status when the two disagree.

| Major Item | Status | Current Evidence |
| --- | --- | --- |
| Product scope lock | Pass | Cleaning-first quote recovery remains locked; no booking, invoicing, calendar, WhatsApp/SMS automation, Instagram API, full CRM, auto-send, or multi-vertical work was added. |
| Baseline app validation | Pass | 2026-05-24 rerun passed `pnpm lint`, `pnpm typecheck`, `pnpm test:unit` (22/22), and `pnpm build`. |
| Auth callback messaging | Pass | Commit `7fe0475` fixed misleading signup confirmation callback failure copy while preserving invalid/expired reset handling. |
| Final production auth smoke | Open | Signup action no longer crashes, but Supabase rate limiting prevented final clean signup confirmation verification. Password reset should be re-smoked after rate limits clear. |
| Production Supabase target/schema | Blocked | Owner reported migrations through `0017`, but Phase 19C/2026-05-24 probes against the Supabase host available from `.env.local` found missing current app columns and public quote hardening RPCs. Confirm actual Vercel production project, applied migrations, grants, and schema cache before real pilot data. |
| Migrations `0014`-`0017` | Historical open item, superseded by Phase 21 object verification | Do not treat old migration blockers as current facts. Phase 21 direct SQL verified the key objects, while standard migration history remains unavailable/manual drift. |
| fr-CA production quote flow | Blocked | Disposable fr-CA business/link/lead could not be created because the checked Supabase target did not match current multilingual schema. |
| Backup/export runbook | Pass | Phase 19B runbook exists and documents export cadence, storage/access rules, restore procedure, deletion/export requests, privacy incident process, and git safety rules. |
| PITR/export/restore execution | Blocked | PITR/storage require owner dashboard decisions; `pg_dump`, `psql`, and a restore target were unavailable; no restore drill was performed. |
| AI fallback | Pass | Rule fallback remains owner-reviewed, manual copy/send only, and sanitized. |
| OpenAI real-key model output | Blocked | No non-empty `OPENAI_API_KEY` was configured, so no model-backed output was generated or quality-checked. |
| Pricing/offer documentation | Pass | Phase 19F decision doc and Phase 20 terms gate exist; both document current `/pricing` mismatch and recommended draft without treating it as final. |
| Final commercial terms | Owner decision required | `docs/business/PILOT_TERMS_DECISION_GATE.md` blocks any real pilot until setup fee, monthly fee, trial, refund, cancellation, payment collection, billing start, included/excluded wording, support promise, and non-responsive customer handling are owner-approved. |
| Founder CRM setup | Pass | Phase 19G playbook and CSV template exist. |
| Real customer validation | Owner decision required | No real prospects were supplied; 10 prospects, 20 outreach attempts, 5 demos, 3 pilot candidates, and 1 payment/setup-ready business remain owner execution. |
| First real pilot customer readiness | Blocked | Not ready for real customer data until production schema, auth smoke, backup/restore posture, OpenAI/fallback decision, commercial terms, and real prospect pipeline are resolved. |

## 2. Entry Criteria

Do not begin Phase 18 until these are true:

| Gate | PASS | FAIL | Evidence |
| --- | --- | --- | --- |
| `pnpm test:rls` passes all files. | [x] | [ ] | 2026-05-24 current rerun passed 13/13 against local Supabase Postgres through temporary local-only Docker proxy `127.0.0.1:55432/postgres` after applying local migration `0019_lifecycle_helper_execute_grant_hardening.sql`; the proxy was removed after the run. |
| `pnpm typecheck` is clean. | [x] | [ ] | 2026-05-23: `pnpm typecheck` passed. |
| `pnpm build` succeeds. | [x] | [ ] | 2026-05-23: `pnpm build` passed with Next.js 16.2.4. |
| Manual QA checklist is complete or explicitly risk-accepted. | [x] | [ ] | 2026-05-22 browser QA passed core routes with no application or console errors. Public quote submission was verified through the rendered Next form action after the quote-form and submit-age safety fixes. Phase 21 production object verification now supersedes older schema-drift findings; final production quote/auth/language smoke tests remain required before outreach. |
| Business configuration save round-trip works. | [x] | [ ] | 2026-05-22 browser QA: fresh QA workspace saved Quote Setup, then `/quote/spark-shine-phase18a-qa-1779420058961` became active. |
| Public quote submission creates a tenant-scoped lead. | [x] | [ ] | 2026-05-22: `/quote/spark-shine-phase18a-qa-1779420058961` created lead `fee660c2-c3aa-43d5-a234-1c58502510b0`; lead `business_id` matched active public link tenant `1b8f3cc6-4967-4ffe-9490-533c1c34c68b`. Earlier browser QA also created lead `f2a2a970-4184-419a-8f85-faa063bf1292`. |
| AI remains manual, owner-reviewed, and non-sending. | [x] | [ ] | 2026-05-22 browser QA: `/dashboard/leads/b98fb510-b9ec-4774-b30f-20cf8d9421e3` showed AI summary, missing info, reply draft, follow-up controls, and manual copy actions only (`Copy reply`, `Copy follow-up`). |

## 3. Infrastructure Readiness

| Item | PASS | FAIL | Notes |
| --- | --- | --- | --- |
| Supabase project plan tier is documented. | [ ] | [x] | Phase 19B repo/CLI check could not determine plan tier. Owner must verify in Supabase dashboard for `bizpilot-production`; do not infer from code. |
| Supabase point-in-time recovery window is documented. | [ ] | [x] | Phase 19B repo/CLI check could not determine PITR support or retention. Owner must record exact PITR status/window from Supabase dashboard before real pilot data. |
| Supabase Security Advisor reviewed. | [ ] | [ ] |  |
| Supabase Performance Advisor reviewed. | [ ] | [ ] |  |
| Migrations `0010`, `0011`, `0012`, and `0013` are applied in the target project. | [ ] | [ ] | Standard migration history is missing, so this cannot be proven by `schema_migrations`. Key public-quote objects from these migrations are object-verified by direct SQL and local RLS tests, but full historical reconciliation remains manual drift. |
| Migration `0014_cleaning_template_contact_address_fields.sql` is applied in the target project. | [x] | [ ] | 2026-05-24 direct production SQL verified `customer_phone`, `customer_email`, and `home_address` exist on `cleaning-smart-quote-v1`, are active, and match expected type/required/sort-order metadata. Standard migration history is missing, so this is object verification rather than CLI migration-history proof. |
| Migration `0015_business_access_plan_and_admin_log.sql` is applied in the target project. | [x] | [ ] | 2026-05-24 owner-run SQL on corrected production target verified `businesses.status`, `businesses.internal_note`, and `business_members.status` exist. Standard migration history is missing, so this is object verification rather than CLI migration-history proof. |
| Migration `0016_public_submission_minimum_submit_age_reason.sql` is applied in the target project. | [x] | [ ] | 2026-05-24 direct production SQL verified `public_submission_abuse_log_reason_check` includes `submitted_too_fast`. Standard migration history is missing, so this is object verification rather than CLI migration-history proof. |
| Migration `0017_business_preferred_language.sql` is applied in the target project. | [x] | [ ] | 2026-05-24 owner-run/direct production SQL verified `public_link_variants.preferred_language` exists, `businesses.preferred_language` was visible by earlier safe probe, both language constraints include `fr-CA`, and `businesses_preferred_language_idx` exists. Standard migration history is missing, so this is object verification rather than CLI migration-history proof. |
| `public.public_can_insert_submission_value` exists and grants EXECUTE to `anon`, `authenticated`, `service_role`. | [x] | [ ] | 2026-05-24 owner-run SQL verified the function exists in `public`, is `security_definer`, has `search_path=public` and `row_security=off`, and grants EXECUTE to all three required roles. |
| `public.record_public_submission_attempt` exists and grants EXECUTE to `anon`, `authenticated`, `service_role`. | [x] | [ ] | 2026-05-24 owner-run SQL verified the function exists in `public`, is `security_definer`, has `search_path=public` and `row_security=off`, is correctly `volatile`, and grants EXECUTE to all three required roles. |
| `public.count_recent_public_submission_attempts` exists and grants EXECUTE to `anon`, `authenticated`, `service_role`. | [x] | [ ] | 2026-05-24 owner-run SQL verified the function exists in `public`, is `security_definer`, has `search_path=public` and `row_security=off`, is `stable`, and grants EXECUTE to all three required roles. |
| `0019_lifecycle_helper_execute_grant_hardening.sql` is applied in the target project. | [x] | [ ] | 2026-05-24 production grant-only apply returned `Success. No rows returned`; verification returned `checked_functions = 6` and `all_grant_checks_passed = true`. |
| RLS test cadence is documented if CI is not wired yet. | [ ] | [ ] |  |
| No service-role key is present in browser/client code. | [ ] | [ ] |  |
| Security headers/CSP baseline is configured or explicitly risk-accepted. | [x] | [ ] | 2026-05-22: `next.config.ts` now sets CSP, Referrer-Policy, X-Content-Type-Options, X-Frame-Options, and Permissions-Policy. Verified on `http://127.0.0.1:3000/pricing` with `Invoke-WebRequest`. |
| Minimum submit-time heuristic is configured or explicitly risk-accepted. | [x] | [ ] | 2026-05-22: public quote form now submits a hidden render-time marker; server rejects missing/too-fast submissions with safe copy and logs `submitted_too_fast`. Fast POST returned 303 error and created no lead; delayed POST created lead `fee660c2-c3aa-43d5-a234-1c58502510b0`. |

## 4. Environment and Secrets

| Item | PASS | FAIL | Notes |
| --- | --- | --- | --- |
| `.env.local` has valid Supabase URL and anon key. | [x] | [ ] | 2026-05-22: present and used for browser QA against the configured app project. |
| `.env.local` has service-role key only for server-side bootstrap use. | [x] | [ ] | 2026-05-22: service-role key is present; no browser/client service-role exposure was found in source search. |
| `OPENAI_API_KEY` is present for model-backed demo testing. | [ ] | [x] | 2026-05-23 Phase 19D: `.env.local` exists and the `OPENAI_API_KEY` name is present, but the value is empty and process env does not provide a key. Real-key model dry run was blocked; do not mark model-backed AI ready. |
| App still works with `OPENAI_API_KEY` unset through rule fallback. | [x] | [ ] | Fallback remains the only verified AI mode in this environment. Phase 21 OpenAI real-key dry run returned HTTP `429`, so real model output still needs a successful synthetic retry; full production dashboard re-smoke depends on synthetic lead setup, not the older Phase 19C schema finding. |
| `.env.example` matches required env variables without real secrets. | [x] | [ ] | 2026-05-22: `.env.example` includes `BIZPILOT_FOUNDER_EMAILS` for founder-only `/admin`; no real secrets added. |
| Vercel production env variable names/scopes are present. | [x] | [ ] | 2026-05-24 `vercel env ls` confirmed `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_APP_URL`, `BIZPILOT_FOUNDER_EMAILS`, and `OPENAI_API_KEY` exist encrypted for Production and Preview. Values were not pulled or revealed. |
| Secret scan performed before pilot branch/deploy. | [x] | [ ] | 2026-05-24 staged diff secret scan found no real secrets; only a documented local RLS README connection string had matched the broader workspace scan earlier. |
| Supabase and GitHub owner/admin accounts use MFA. | [ ] | [ ] |  |
| GitHub CI workflow exists for no-secret app validation. | [x] | [ ] | 2026-05-24 added `.github/workflows/ci.yml` to run lint, typecheck, unit tests, and build on `main`, `phase-*`, pull requests, and manual dispatch. RLS remains local-only until CI database setup is added safely. |

## 5. Backup and Export Readiness

| Item | PASS | FAIL | Notes |
| --- | --- | --- | --- |
| Backup/export strategy document reviewed. | [x] | [ ] | 2026-05-22 standards audit reviewed `BIZPILOT_BACKUP_AND_EXPORT_STRATEGY_v1.0.md`. |
| Minimum backup/export/restore runbook exists. | [x] | [ ] | 2026-05-23 Phase 19B added `docs/ops/BACKUP_EXPORT_RESTORE_RUNBOOK.md` with export cadence, storage/access rules, schema/data backup commands, restore drill procedure, deletion/export request handling, privacy incident process, and git safety rules. |
| Critical data tables are documented. | [x] | [ ] | Backup/export strategy Section 4 maps identity, tenant, configuration, public intake, submissions/leads, lead intelligence, AI artifacts, and reference tables. |
| Manual export path is understood by the operator. | [ ] | [x] | Phase 19B runbook documents schema-only and data export commands, but `pg_dump` and `psql` are not on PATH and no export has been performed. |
| Export storage location is decided and encrypted. | [ ] | [x] | Owner decision still required. Runbook requires encrypted storage outside git and a named access list. |
| PITR support and retention are recorded. | [ ] | [x] | Cannot be checked from repo/CLI. Owner must verify Supabase plan/PITR in dashboard and record exact result. |
| Schema-only backup has been created and verified. | [ ] | [x] | Blocked on missing `pg_dump` and unavailable local DB connection. No dump created and no customer data printed. |
| Auth migration risk is accepted for pilot. | [x] | [ ] | Backup/export strategy Section 8 accepts Supabase Auth migration risk for pilot. |
| Restore drill is scheduled or explicitly deferred with reason. | [ ] | [x] | Phase 19B restore drill not performed. Blockers: local `DATABASE_URL` points to `127.0.0.1` but connection is refused; `pg_dump` and `psql` are not installed; no approved staging restore target. |
| Customer deletion/export request process is documented. | [x] | [ ] | Phase 19B runbook documents manual pilot process for customer deletion/minimization requests and customer export requests. |
| Privacy incident process is documented. | [x] | [ ] | Phase 19B runbook documents private incident handling and register fields. The incident register itself must stay outside git if it contains personal data. |
| Git ignore rules prevent backup/export dump commits. | [x] | [ ] | 2026-05-23: `.gitignore` now blocks BizPilot dump/export patterns and backup/restore temp folders while keeping migration SQL files trackable. |
| Export is performed before first real pilot data is collected, or accepted as risk. | [ ] | [ ] |  |

## 6. Product and Demo Readiness

| Item | PASS | FAIL | Notes |
| --- | --- | --- | --- |
| Demo business is configured as a cleaning business. | [ ] | [ ] |  |
| Demo public quote link is active. | [x] | [ ] | 2026-05-22: QA quote link `/quote/spark-shine-phase18a-qa-1779420058961` active after Quote Setup save. |
| Demo sample lead exists or can be created live. | [x] | [ ] | 2026-05-22: live QA lead `fee660c2-c3aa-43d5-a234-1c58502510b0` created from public quote submission after the form and submit-age safety fixes. |
| Dashboard shows a clear first-three-minute Magic Moment. | [x] | [ ] | 2026-05-22: `/dashboard` showed urgent lead review CTA, lead queue preview, quote link readiness, and manual owner control language. |
| Lead detail includes summary, missing info, reply draft, and follow-up action. | [x] | [ ] | 2026-05-22: `/dashboard/leads/b98fb510-b9ec-4774-b30f-20cf8d9421e3` showed lead details, missing info, recommended action, AI summary panel, and copy-only follow-up controls. |
| Founder can copy a reply but nothing is sent automatically. | [x] | [ ] | 2026-05-22: lead detail exposes `Copy reply` and `Copy follow-up`; no customer send action was present. |
| Mini Founder Admin exists for manual plan/access control. | [x] | [ ] | 2026-05-22: `/admin` added as founder-only internal route with plan/status/quote-link/internal-note controls. Full data view requires `BIZPILOT_FOUNDER_EMAILS`; owner reported target migration `0015` is applied in production. |
| MVP-safe English / Canadian French support is available. | [x] | [ ] | 2026-05-23: global language switching, business `preferred_language`, localized public quote/success/auth/home surfaces, and AI language guidance were implemented. Production smoke must verify one FR business end to end before outreach. |
| Public quote form can be submitted without client-side step navigation risk. | [x] | [ ] | 2026-05-22: public quote form was changed to visible Service / When & where / Contact sections with direct submit; final route QA confirmed the quote page rendered a submit-age value and the rendered Next form action created tenant-scoped lead `fee660c2-c3aa-43d5-a234-1c58502510b0`. |
| Demo script leads with quote recovery, not generic AI platform language. | [ ] | [ ] |  |
| Landing page or sales one-pager draft uses cleaning-first positioning. | [ ] | [ ] |  |

## 7. Founder-Led GTM Readiness

| Item | PASS | FAIL | Notes |
| --- | --- | --- | --- |
| Founder/admin route is protected. | [x] | [ ] | 2026-05-23 Phase 19G code inspection: `/admin` redirects signed-out users to `/auth/sign-in`; founder service requires signed-in email to match `BIZPILOT_FOUNDER_EMAILS` before service-role overview/actions. |
| Normal owners are blocked from founder admin data. | [x] | [ ] | Code-level guard exists through `assertFounderUser`; a production negative smoke with a non-founder owner account is still recommended before live outreach. |
| Founder can create/view/update prospects in the app. | [ ] | [x] | No in-app prospect CRM exists. `/admin` is a founder-only pilot account/control console for existing businesses, users, plans, quote-link state, usage signals, and internal notes. Prospect tracking remains external by design. |
| Founder CRM tracker template exists. | [x] | [ ] | 2026-05-23 Phase 19G added `docs/sales/FOUNDER_CRM_PROSPECT_TEMPLATE.csv` and `docs/sales/FOUNDER_CRM_AND_OUTREACH_PLAYBOOK.md`. The older workbook path `artifacts/phase18/BizPilot_Phase18_Founder_CRM_Template.xlsx` is not present in this workspace. |
| Outreach status is tracked. | [x] | [ ] | Phase 19G CSV/playbook includes outreach status, contact channel, follow-up date, outcome, and next action. |
| Owner objections and exact customer language are tracked. | [x] | [ ] | Phase 19G playbook requires exact owner wording and separates objections from feature requests. |
| Demo dates and follow-up dates are tracked. | [x] | [ ] | CSV template includes `follow_up_date`; playbook defines demo tracking and follow-up rhythm. |
| Willingness-to-pay notes are tracked. | [x] | [ ] | CSV template includes `willingness_to_pay`; playbook defines payment-ready rules. |
| Pilot retention notes are tracked weekly. | [x] | [ ] | Existing operations docs define weekly pilot retention tracking; Phase 19G playbook adds weekly validation review. |
| Concierge onboarding checklist is ready for the first customer. | [x] | [ ] | Existing Phase 18 workflow docs define onboarding steps; `/admin` can manage plan/access after a business exists. |
| 10 real cleaning prospects entered. | [ ] | [x] | Owner action required. No real prospects were supplied in Phase 19G, so no real or fake prospect rows were added. |
| 20 outreach attempts completed. | [ ] | [x] | Owner action required. |
| 5 demo/conversation attempts completed. | [ ] | [x] | Owner action required. |
| 3 strong pilot candidates identified. | [ ] | [x] | Owner action required after real outreach. |
| 1 payment-ready or setup-ready business identified. | [ ] | [x] | Owner action required after real outreach and approved commercial terms. |

## 8. Pricing and Commercial Readiness

| Item | PASS | FAIL | Notes |
| --- | --- | --- | --- |
| Pilot offer/pricing decision doc exists. | [x] | [ ] | 2026-05-23 Phase 19F added `docs/business/PILOT_OFFER_AND_PRICING_DECISIONS.md` with current public pricing evidence, recommended default, mismatch notes, and owner-approval checklist. |
| Pilot terms decision gate exists. | [x] | [ ] | 2026-05-24 added `docs/business/PILOT_TERMS_DECISION_GATE.md`; it records recommended defaults as recommendations only and blocks real pilots until owner approval. |
| All pilot business terms are owner-approved. | [ ] | [x] | Owner decision required for setup fee, monthly fee, trial, refund, cancellation, payment collection, billing start, included scope, support promise, and non-responsive customer handling. |
| Pricing locked for paid outreach. | [ ] | [x] | Not yet owner-approved. Recommended default is Founder Pilot at `$199 setup + $49/month`, but public `/pricing` currently shows Founder Pilot as `manual offer` / `14-day pilot` and puts `$199 setup + $49/mo` under Starter. Older GTM docs also call Founder Plus at `$299 setup + $79/mo` the recommended default. |
| Setup fee, if any, is decided. | [ ] | [x] | Recommended default is `$199 setup`; owner approval still required before paid outreach. |
| Trial yes/no is locked. | [ ] | [x] | Public Founder Pilot card says `14-day pilot`, but whether that is free, paid, credited, or simply an onboarding window is not approved. |
| Billing is manual for pilot; no Stripe implementation is required. | [x] | [ ] | 2026-05-22: `/admin` manual plan assignment and plan entitlement docs added; no Stripe Billing implementation added. |
| Manual billing process is ready. | [ ] | [x] | Manual billing process is documented as invoice or separate Stripe Payment Link plus `/admin` plan assignment, but actual payment collection asset/process has not been verified. |
| Refund/cancellation handling is locked. | [ ] | [x] | Phase 19F documents draft direction only; exact refund and cancellation wording remains owner-required. |
| Owner knows this is a pilot and not a full CRM/booking product. | [ ] | [ ] |  |

## 9. Support and Incident Readiness

| Item | PASS | FAIL | Notes |
| --- | --- | --- | --- |
| Support contact channel is defined. | [ ] | [x] | Support/internal notes workflow exists, but the actual support channel owner should use with customers is still an owner decision. |
| Support promise is commercially approved. | [ ] | [x] | Phase 20 terms gate recommends founder support during the pilot, but support channel, response expectation, and end date remain owner decisions. |
| Manual data deletion/minimization request process is documented or accepted as deferred risk. | [x] | [ ] | Phase 19B runbook documents the manual pilot process. Productized self-serve deletion remains deferred. |
| Privacy incident register process exists or is accepted as deferred risk. | [x] | [ ] | Phase 19B runbook documents incident process and register fields. Any actual incident register with personal data must remain outside git. |
| Public quote abuse response path is known. | [ ] | [ ] |  |
| Owner-facing fallback plan exists if AI provider is unavailable. | [x] | [ ] | Phase 19D: rule fallback produces owner-reviewed drafts, labels fallback honestly, keeps manual copy/send only, and stores sanitized failure metadata. Real OpenAI output still requires a non-empty key. |
| Rollback plan for deploy issues is documented. | [ ] | [ ] |  |

## 10. Validation Gate Before Expansion

Do not begin Phase 8 expansion, Phase 9 second vertical, booking, billing, messaging automation, or full CRM work until BizPilot has:

| Validation Signal | PASS | FAIL | Evidence |
| --- | --- | --- | --- |
| At least 3 paying or payment-ready cleaning businesses. | [ ] | [ ] |  |
| Repeated weekly usage. | [ ] | [ ] |  |
| Healthy retention signal. | [ ] | [ ] |  |
| Real quote submissions. | [ ] | [ ] |  |
| Evidence that AI drafts save owner time. | [ ] | [ ] |  |
| At least one testimonial or strong qualitative proof. | [ ] | [ ] |  |
| Founder-led onboarding notes from real customers. | [ ] | [ ] |  |

## 11. Phase 18 Start Decision

Phase 18 may start only when:

```text
Manual QA is complete
+ pilot infrastructure is understood
+ backup/export risk is accepted
+ founder GTM tracking is ready
+ demo flow proves value in under 3 minutes
+ pricing and pilot terms are decided
+ no deferred item weakens RLS, privacy, or customer trust
```

Record the decision:

| Decision | Owner | Date | Notes |
| --- | --- | --- | --- |
| [ ] Start Phase 18 pilot |  |  |  |
| [ ] Do not start; blockers remain |  |  |  |
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                