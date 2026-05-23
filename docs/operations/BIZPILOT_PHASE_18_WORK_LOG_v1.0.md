# BizPilot AI - Phase 18 Work Log v1.0

## Purpose

Track Phase 18 founder-led pilot preparation after Phase 17 Pilot Readiness Verification full pass.

## Session

- Date: 2026-05-18
- Operator: Codex
- Phase: 18 - Founder-led cleaning business pilots
- Entry condition: Phase 17 Pilot Readiness Verification marked FULL PASS by owner.

## Canonical Context Read

- `docs/CURRENT_CANONICAL_DOCS_v1.7.md`
- `docs/AI_CODING_AGENT_START_HERE_v1.7.md`
- `docs/BIZPILOT_STRATEGIC_ALIGNMENT_UPDATE_v1.6.md`
- `docs/product/BIZPILOT_BUILD_PLAN_v1.4.md`
- `docs/engineering/BIZPILOT_EXECUTION_ROADMAP_v1.4.md`
- `docs/gtm/BIZPILOT_GTM_PLAYBOOK_v1.1.md`
- `docs/operations/BIZPILOT_PILOT_READINESS_CHECKLIST_v1.0.md`
- `docs/operations/BIZPILOT_PHASE_17_WORK_LOG_v1.0.md`

## Execution Log

- Confirmed no active Phase 17 blocker remains after full pass.
- Confirmed Phase 18 should proceed as founder-led validation, not product feature expansion.
- Created `artifacts/phase18/BizPilot_Phase18_Founder_CRM_Template.xlsx`.
- Created `docs/operations/BIZPILOT_PHASE_18_PILOT_OPERATING_GUIDE_v1.0.md`.
- Created a reusable workbook builder at `scripts/phase18/build-founder-crm-template.mjs`.
- Verified the workbook renders all six sheets: Dashboard, Founder CRM, Weekly Loop, Pilot Retention, Objections, and Concierge Setup.

## Phase 18 Scope Guard

Do not add booking, billing automation, SMS/WhatsApp automation, AI auto-send, second verticals, or full CRM scope before the validation gate.

## Manual Next Steps

1. Open the Founder CRM workbook.
2. Add at least 10 cleaning business prospects.
3. Mark fit score and next action for each prospect.
4. Contact 5 prospects this week.
5. Record exact owner wording, objections, demo status, and willingness to pay.
6. Move only real pilot customers into the Pilot Retention sheet.

## Verification Log

- Workbook builder executed successfully on 2026-05-18.
- Workbook formula error scan completed during build.
- Workbook render verification completed for all sheets during build.

## Phase 18A QA Update

- Date: 2026-05-22
- Operator: Codex
- Scope: Pilot readiness QA, migration verification, and founder-led workflow prep only.
- `git status --short` reviewed before changes; source files and generated artifacts were already dirty from prior work.
- Browser QA covered `/`, `/dashboard`, `/dashboard/leads`, `/dashboard/leads/c20fda35-a508-440d-85f0-186b003c4d74`, `/dashboard/configuration`, `/dashboard/business-profile`, `/dashboard/settings`, and `/quote/spark-shine-phase18a-qa-1779420058961`.
- Created demo-safe QA owner `phase18a.qa.1779420058961@example.com` and business `Spark Shine Phase18A QA 1779420058961`.
- Saved Quote Setup to activate the QA public quote link.
- Submitted a public quote request for `Maria Phase18A QA`.
- Verified tenant-scoped lead creation: lead `c20fda35-a508-440d-85f0-186b003c4d74` belongs to business `1b8f3cc6-4967-4ffe-9490-533c1c34c68b`, matching the active public quote link tenant.
- Confirmed lead detail remains manual owner-reviewed AI only: AI drafts are generated on demand, nothing is sent automatically, and owner copy/status controls are explicit.
- Verified local RLS suite: `pnpm test:rls` passed 11/11 against local `127.0.0.1:54322/postgres`.
- Verified app checks: `pnpm lint`, `pnpm typecheck`, `pnpm test:unit`, and `pnpm build` passed.
- Captured QA screenshots under `artifacts/dashboard-ui-qa/phase18a-lead-detail-qa-2026-05-22.png` and `artifacts/dashboard-ui-qa/phase18a-quote-success-qa-2026-05-22.png`; treat as generated evidence, not commit scope unless explicitly approved.
- Migration `0014_cleaning_template_contact_address_fields.sql` exists and is idempotent, but the current app Supabase project did not contain `customer_phone`, `customer_email`, or `home_address` for `cleaning-smart-quote-v1` on 2026-05-22. Owner should confirm target Supabase environment before applying.
- Added `docs/operations/BIZPILOT_PHASE_18_FOUNDER_LED_PILOT_WORKFLOW_v1.0.md` for Founder CRM, outreach, demo flow, pilot offer decisions, and objection/owner wording tracking.
- Added `docs/operations/BIZPILOT_PHASE_18A_STANDARDS_AUDIT_v1.0.md` to cross-check active standards and record remaining pilot-readiness gaps: target migration `0014`, security headers/CSP, minimum submit-time heuristic, unset `OPENAI_API_KEY`, backup/PITR decisions, pricing/refund decisions, and real prospect list.

## Missing Docs Ingest

- Date: 2026-05-22
- Source: `BizPilot_Missing_Docs_and_Post_Domain_Roadmap_v1_0 (1).zip` from Downloads.
- Placed operations docs:
  - `docs/operations/BIZPILOT_DOMAIN_DEPLOYMENT_RUNBOOK_v1.0.md`
  - `docs/operations/BIZPILOT_PILOT_ONBOARDING_AND_FOUNDER_CRM_WORKFLOW_v1.0.md`
  - `docs/operations/BIZPILOT_POST_DOMAIN_EXECUTION_ROADMAP_v1.0.md`
  - `docs/operations/BIZPILOT_PRODUCTION_QA_CHECKLIST_v1.0.md`
- Placed product specs:
  - `docs/product/BIZPILOT_FOUNDER_ADMIN_MINI_CONSOLE_SPEC_v1.0.md`
  - `docs/product/BIZPILOT_PRICING_PAGE_SPEC_v1.0.md`
- Scope interpretation at ingest time: these were post-domain / production pilot references. Owner later explicitly moved the small founder control layer earlier for payment-ready trials; implementation is recorded in the Phase 18C update below.

## Phase 18C Founder Control / Quote QA Update

- Date: 2026-05-22
- Operator: Codex
- Scope: Owner-approved pilot completion/control layer and bug-fix cleanup; no booking, invoice, calendar, SMS/WhatsApp automation, AI auto-send, marketplace, second vertical, mobile app, or full CRM scope added.
- Added local migration `supabase/migrations/0015_business_access_plan_and_admin_log.sql` for manual plan/access controls:
  - `businesses.status`
  - `businesses.plan_slug`
  - `businesses.plan_started_at`
  - `businesses.plan_expires_at`
  - `businesses.internal_note`
  - `business_members.status`
  - `admin_action_log`
  - updated helper functions for active membership, management, and active public quote links.
- Added RLS coverage in `tests/rls/business-access-plan-admin-log.test.sql`.
- Applied and verified local migrations:
  - `0014_cleaning_template_contact_address_fields.sql` verified locally with `customer_phone`, `customer_email`, and `home_address`.
  - `0015_business_access_plan_and_admin_log.sql` verified locally with `businesses.plan_slug`, `businesses.status`, and `admin_action_log`.
- Added `/admin` as a small founder-only internal console:
  - manual plan assignment
  - business status changes
  - public quote link enable/disable
  - usage/lead/member signals
  - internal notes
  - admin action logging through service-role code after founder email allowlist authorization.
- Added dashboard access-paused fallback when a signed-in user has no active business membership.
- Aligned `/pricing` visible plan names with manual admin plan values: Founder Pilot, Starter, Pro.
- Fixed public quote form QA risk: the form no longer depends on client-side step navigation to reach submit. It renders Service, When & where, and Contact sections directly and submits through the existing server action.
- Browser QA evidence:
  - `/`, `/pricing`, `/admin`, `/dashboard`, `/dashboard/leads`, `/dashboard/configuration`, `/dashboard/business-profile`, `/dashboard/settings`, and `/quote/spark-shine-phase18a-qa-1779420058961` loaded without console errors on `http://127.0.0.1:3000`.
  - `/admin` safely showed "Founder admin is not configured" without `BIZPILOT_FOUNDER_EMAILS`.
  - Lead detail `/dashboard/leads/b98fb510-b9ec-4774-b30f-20cf8d9421e3` showed summary, missing info, reply draft, follow-up controls, and copy-only actions.
  - Public quote submission after the form fix created lead `f2a2a970-4184-419a-8f85-faa063bf1292`.
  - Verified tenant scope: lead `business_id` matched public link business `1b8f3cc6-4967-4ffe-9490-533c1c34c68b`.
- Verification:
  - `pnpm lint` passed.
  - `pnpm typecheck` passed.
  - `pnpm test:unit` passed, with existing Node module-type warning only.
  - `pnpm test:rls` passed 12/12 against local Supabase through temporary Docker proxy `127.0.0.1:15432` because Docker Desktop did not publish `54322` to the Windows host.
  - `pnpm build` passed.
- Added missing active docs:
  - `docs/product/BIZPILOT_FOUNDER_ADMIN_CONSOLE_SPEC_v1.0.md`
  - `docs/product/BIZPILOT_PLAN_ENTITLEMENTS_AND_MANUAL_BILLING_SPEC_v1.0.md`
  - `docs/security/BIZPILOT_ACCESS_CONTROL_AND_SUSPENSION_STANDARD_v1.0.md`
  - `docs/product/BIZPILOT_MAGIC_DEMO_DATA_SPEC_v1.0.md`
  - `docs/operations/BIZPILOT_PRODUCTION_DEPLOYMENT_RUNBOOK_v1.0.md`
  - `docs/operations/BIZPILOT_BUG_TRIAGE_AND_RELEASE_QA_STANDARD_v1.0.md`
  - `docs/operations/BIZPILOT_FOUNDER_CRM_AND_PILOT_TRACKING_WORKFLOW_v1.0.md`
  - `docs/operations/BIZPILOT_CUSTOMER_ONBOARDING_CHECKLIST_v1.0.md`
  - `docs/operations/BIZPILOT_SUPPORT_AND_INTERNAL_NOTES_WORKFLOW_v1.0.md`
- Remaining owner decisions:
  - confirm target Supabase environment before applying `0014`, `0015`, and `0016` remotely,
  - set `BIZPILOT_FOUNDER_EMAILS`,
  - provide 10 real cleaning prospects,
  - approve pilot price/setup fee/trial/refund handling,
  - approve final homepage direction to stop design churn and move to validation.

## Phase 18C Security / Submit-Age Hardening Update

- Date: 2026-05-22
- Operator: Codex
- Scope: Pilot-readiness cleanup for public quote safety, security headers, migration evidence, and QA proof.
- Added security headers in `next.config.ts`:
  - Content-Security-Policy with `default-src 'self'`, `frame-ancestors 'none'`, `form-action 'self'`, Supabase connect sources, HTTPS image allowance for customer logo previews, and dev-only localhost websocket/connect allowances.
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()`
- Verified headers on `http://127.0.0.1:3000/pricing` with `Invoke-WebRequest`.
- Added public quote minimum submit-age protection:
  - `components/public/submit-age-input.tsx` renders hidden `formRenderedAt`.
  - `server/actions/public-intake.actions.ts` passes `formRenderedAt` into intake submission.
  - `server/services/public-intake.service.ts` rejects missing or too-fast submissions with safe copy.
  - `server/services/abuse-protection.service.ts` includes `submitted_too_fast`.
  - `supabase/migrations/0016_public_submission_minimum_submit_age_reason.sql` extends the abuse-log reason constraint.
  - `tests/rls/public-submission-abuse-log.test.sql` covers the new reason.
- Applied and verified local migration `0016_public_submission_minimum_submit_age_reason.sql`; local constraint now accepts `submitted_too_fast`.
- Submit-age QA evidence:
  - Fast form POST for `Phase18CFast1779480270544` returned 303 to `/quote/spark-shine-phase18a-qa-1779420058961?error=Please%20wait%20a%20moment%20and%20submit%20the%20quote%20request%20again.` and created no lead.
  - Delayed form POST for `Phase18CPost1779480235115` created lead `fee660c2-c3aa-43d5-a234-1c58502510b0`.
  - Lead `fee660c2-c3aa-43d5-a234-1c58502510b0` had `business_id = 1b8f3cc6-4967-4ffe-9490-533c1c34c68b`, matching active public link `/quote/spark-shine-phase18a-qa-1779420058961`.
- Final browser QA route sweep on `http://127.0.0.1:3000`:
  - `/`
  - `/pricing`
  - `/admin`
  - `/dashboard`
  - `/dashboard/leads`
  - `/dashboard/leads/b98fb510-b9ec-4774-b30f-20cf8d9421e3`
  - `/dashboard/configuration`
  - `/dashboard/business-profile`
  - `/dashboard/settings`
  - `/quote/spark-shine-phase18a-qa-1779420058961`
  - Result: no application error text and no console errors during the sweep. Quote page rendered a non-empty `formRenderedAt` hidden value.
- Post-CSP restart smoke checked `/pricing`, `/dashboard/configuration`, and `/quote/spark-shine-phase18a-qa-1779420058961`; no application errors or console errors were observed.
- Final verification:
  - `pnpm lint` passed.
  - `pnpm typecheck` passed.
  - `pnpm test:unit` passed, with existing Node module-type warning only.
  - `pnpm test:rls` passed 12/12 against local Supabase through temporary Docker proxy `127.0.0.1:15432`.
  - `pnpm build` passed.
- Remaining owner decisions:
  - confirm target Supabase environment before applying `0014`, `0015`, and `0016` remotely,
  - set `BIZPILOT_FOUNDER_EMAILS` for `/admin`,
  - provide 10 real cleaning business prospects,
  - approve pilot price/setup fee/trial/refund handling,
  - provide/approve production demo business details and final homepage stop point.

## Phase 18 Production Auth / Language / Readiness Reconciliation

- Date: 2026-05-23
- Operator: Codex
- Scope: Final Phase 18 hardening and documentation truth sync only; no booking, invoices, calendar sync, SMS/WhatsApp/Instagram automation, AI auto-send, full CRM, mobile app, advanced analytics, or new product scope added.
- Current production-facing auth state:
  - signup uses `/auth/callback`,
  - password recovery uses `/auth/reset-password`,
  - recovery sessions are cleared after password update,
  - reset links with invalid/expired/reused codes show safe errors,
  - password reset rate limits show safe non-enumerating copy.
- Current language state:
  - global EN/FR switching exists,
  - `0017_business_preferred_language.sql` adds business preferred language support,
  - public quote, success, auth, homepage, and AI draft guidance have MVP-safe Canadian French support,
  - future customer-facing copy changes should go through the shared dictionary so languages stay synchronized.
- Owner reported production migrations `0001` through `0017` were successfully applied to `bizpilot-production`; this local pass still treats independent SQL verification as a remaining ops check.
- Reconciled Phase 18 docs/checklists so stale "0014-0016 not applied" and old homepage-language-blocker statements no longer read as current truth.
- Tightened runtime server diagnostics by moving auth/config action logs through `safeLogger` with email-domain-only auth metadata and no raw provider error objects, tokens, passwords, cookies, headers, or secrets.
- Verification on 2026-05-23:
  - `pnpm lint` passed.
  - `pnpm typecheck` passed.
  - `pnpm test:unit` passed 19/19, with existing Node module-type warnings only.
  - `pnpm build` passed.
  - `pnpm test:rls` was blocked because `DATABASE_URL` is not set in this shell; the runner exited before connecting, and no RLS assertion failure was observed.
  - Git hygiene sweep found no tracked zip/rar/archive/artifact/browser-profile/screenshot/secret files other than safe `.env.example` placeholders.
  - `.gitignore` covers env files, archives, temp files, generated artifacts, browser profiles, screenshots, Vercel state, and Supabase temp files.
  - Tracked source search found server-only keys only in `.env.example`, `lib/env/server-env.ts`, `lib/supabase/server.ts`, and server AI provider wiring; no client-side service-role/OpenAI key usage was found.
- Remaining before live outreach:
  - run one production signup confirmation smoke test on `https://bizpilo.com`,
  - run one production password reset smoke test after Supabase email rate limits clear,
  - run one `fr-CA` business quote/success/AI smoke test,
  - independently verify production functions/RLS/grants/admin log/preferred-language columns,
  - decide Supabase plan/PITR/export/restore posture,
  - decide pilot price/setup/trial/refund/cancellation terms,
  - add 10 real cleaning business prospects and run the founder demo/outreach loop.
