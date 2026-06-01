# BizPilot AI - Project Gap and Suggestions Audit

Date: 2026-06-01
Status: Advisory audit after repository, documentation, code, and local validation review
Scope: `E:\bizpilot-ai`
Production mutation: None
Real customer data reviewed: No
Priority override applied: `docs/operations/BIZPILOT_FINAL_EXECUTION_AND_VALIDATION_PRIORITY_STANDARD_v1.0.md`
Second-pass companion: `docs/readiness/BIZPILOT_SECOND_PASS_PROJECT_GAP_AND_SUGGESTIONS_2026-06-01.md`
Shortest current status: `docs/readiness/CURRENT_PROJECT_STATUS_2026-06-01.md`

## Executive Result

BizPilot is directionally strong and internally coherent as a cleaning-first lead recovery MVP. The core product boundary is clear: public quote intake, owner dashboard, owner-reviewed AI drafts, manual copy/send, and follow-up support. The codebase generally follows the documented architecture: App Router UI, server actions, services, repositories, Supabase RLS, server-only secrets, provider abstraction, safe logging, and explicit feature gates.

The main readiness conclusion is simple:

- The project is locally healthy for ordinary build quality: lint, typecheck, unit tests, and production build passed.
- The project is not yet approved for real customer data.
- The next correct gate is Phase 24F final no-secret production smoke, followed by Phase 24G explicit owner approval.
- The largest practical gaps are not broad rewrites; they are final real-data gating, product polish, demo readiness, manual email templates, and customer validation.

## Local Verification Run

Commands run from `E:\bizpilot-ai`:

- `pnpm lint` - passed
- `pnpm typecheck` - passed
- `pnpm test:unit` - passed, 78 tests across 18 suites
- `pnpm build` - passed
- `pnpm test:rls` - blocked because `DATABASE_URL` was not available to the command

RLS note: the RLS runner is intentionally guarded to local database hosts only. This is the right posture, but the local developer path is currently incomplete because the environment does not expose a local `DATABASE_URL` during the command.

## Current Readiness Decision

Do not onboard real customer data yet.

The current readiness state is:

1. Phase 23 synthetic production proof is documented as passed.
2. Auth email/custom SMTP proof is documented as owner-reported and recorded.
3. Phase 24C.0 DB-level backup/export/restore proof is documented as passed.
4. Strict restored app/dashboard/RLS proof is not passed and is deferred to P1 before paid pilot, production migrations, or destructive/bulk data work.
5. Phase 24F final no-secret production smoke remains the immediate P0 gate.
6. Phase 24G explicit owner approval remains required before any real customer data.

## Active Execution Priority Override

The 2026-06-01 priority standard changes the practical execution order.

After Phase 24F/24G, the main risk is no longer broad infrastructure readiness. The main risk is:

- Product readiness
- Demo readiness
- Customer validation

Highest current execution sequence:

1. Homepage polish
2. Dashboard polish
3. Manual email templates
4. End-to-end smoke test
5. Demo creation
6. Demo video
7. Founder-led customer outreach

Feature expansion is forbidden until validation evidence exists.

## P0 Before Real Customer Data

### 1. Complete Phase 24F Final No-Secret Production Smoke

Current gap:

- The final synthetic/read-only production smoke is planned but not completed.
- The existing Phase 24 readiness doc already has a Phase 24F checklist added in the working tree.

Recommendation:

- Run the final no-secret production smoke exactly as documented.
- Record only pass/fail evidence, timestamps, route names, and non-sensitive observations.
- Do not paste secrets, tokens, customer data, or provider dashboards containing private data.

### 2. Record Phase 24G Explicit Owner Real-Data Approval

Current gap:

- There is no final owner approval for real customer data.

Recommendation:

- After Phase 24F passes, add a short approval record with the exact date, approver, scope, and constraints.
- Keep first pilot scope narrow: cleaning-only, manual owner review, no AI auto-send, no SMS/WhatsApp, no booking engine, no invoices.

### 3. Make Local RLS Verification Repeatable

Current gap:

- `pnpm test:rls` could not run because `DATABASE_URL` was not present in the command environment.
- `.env.example` does not document a local-only `DATABASE_URL` value for RLS tests.

Recommendation:

- Add a documented local-only database URL example, preferably in `.env.example` or a dedicated `.env.test.example`.
- Add a short runbook section explaining how to start local Supabase/Postgres and run `pnpm test:rls`.
- Keep the current host guard. Do not allow RLS tests to run against production.

## Product Readiness Sprint - Before Outreach

### 4. Reconcile Feature Registry With Phase 23/24 Truth

Files:

- `lib/features/feature-registry.ts`
- `app/(dashboard)/dashboard/settings/page.tsx`

Current gap:

- `ai_draft_assistant` still reads like it is blocked by OpenAI quota, while Phase 23/24 docs record targeted provider proof as passed.
- `custom_smtp_auth_email` still reads as setup-required, while Auth email proof is recorded as passed.
- `backup_restore_posture` does not clearly distinguish DB-level backup proof passed from strict restored app/RLS proof deferred.

Recommendation:

- Update feature states to reflect current truth:
  - AI draft assistant: synthetic provider proof passed; real-pilot use still gated by owner approval and final smoke.
  - Auth email: proof passed for authentication email; lead owner notification email remains deferred.
  - Backup/restore: DB-level export/restore passed; strict restored app/dashboard/RLS proof remains P1.

### 5. Fix Notification Copy In Configuration

File:

- `app/(dashboard)/dashboard/configuration/page.tsx`

Current gap:

- The Notifications section defaults to "Email active - SMS/WhatsApp disabled".
- Product decisions say owner notification email is intentionally deferred for the first pilot.

Risk:

- A pilot operator may believe lead notification email exists and is active.

Recommendation:

- Change this UI to "Manual dashboard check only" or "Owner notification deferred".
- Keep SMS/WhatsApp disabled.
- If notification email is later added, gate it through the feature registry, provider proof, settings, and synthetic smoke.

### 6. Update Public Trust/Policy Copy

File:

- `lib/i18n/policy-copy.ts`

Current gap:

- Some public-facing trust copy still says real customer data is waiting for OpenAI validation, stable email, and backup/export readiness.
- The current blockers are more specific: Phase 24F final no-secret smoke and Phase 24G owner approval. Strict restored app/RLS proof is deferred to P1.

Recommendation:

- Update English and fr-CA copy to reflect the current readiness state.
- Avoid implying that passed gates are still undone.
- Avoid implying real customer data is already approved.

### 7. Update Commercial Terms Gate To Current Technical Truth

File:

- `docs/business/PILOT_TERMS_DECISION_GATE.md`

Current gap:

- The document says staged commercial terms are approved, but still lists older technical gates as remaining.
- OpenAI proof, Auth email proof, and DB-level backup/export/restore have moved forward since the original terms gate.

Recommendation:

- Replace stale remaining-gate language with the current blockers:
  - Phase 24F final no-secret production smoke
  - Phase 24G owner approval
  - payment collection process/assets before charging
  - support and refund handling before paid pilot

### 8. Make Pricing Source Of Truth Explicit

Files:

- `app/pricing/page.tsx`
- `lib/i18n/pricing-copy.ts`
- `docs/business/PILOT_OFFER_AND_PRICING_DECISIONS.md`
- `docs/business/PILOT_TERMS_DECISION_GATE.md`

Current gap:

- The app pricing copy appears aligned with staged terms.
- Older pricing decision docs contain draft numbers that could be reused by mistake.

Recommendation:

- Add a short note to older draft docs that current public pricing source is `lib/i18n/pricing-copy.ts` plus the latest terms gate.
- Keep one canonical pricing decision record for future agents.

### 9. Polish Homepage, Dashboard, Lead Workspace, Empty States, And Error States

Reference:

- `docs/operations/BIZPILOT_FINAL_EXECUTION_AND_VALIDATION_PRIORITY_STANDARD_v1.0.md`

Current gap:

- The new priority standard says product readiness is incomplete and must be completed before outreach.
- The highest product targets are homepage quality, dashboard quality, lead workspace polish, email templates, empty states, loading states, and error states.

Recommendation:

- Homepage goal: a cleaning business owner understands the product in 30 seconds.
- Dashboard goal: first value is visible in 60 seconds.
- Lead workspace goal: owner can immediately understand the lead, review the AI summary/draft, and manually respond.
- Empty/error state goal: no dead screens and no amateur failure experience.

### 10. Create Manual Email Templates Before Outreach

Current gap:

- The product has AI draft flow, but the priority standard calls out manual email templates as a required readiness item.

Recommendation:

- Create owner-reviewed/manual templates for:
  - initial reply
  - follow-up
  - re-engagement
- Keep these manual-only. Do not add auto-send or automation.

### 11. Prepare Demo Scenario, Demo Script, And Demo Video

Current gap:

- Demo readiness is not complete.

Recommendation:

- Create a 3 to 5 minute demo scenario:
  - lead arrives
  - dashboard opens
  - AI summary appears
  - AI draft is reviewed
  - owner manually responds
- Create a 60 to 120 second demo video:
  - problem
  - lost lead
  - BizPilot
  - faster response
  - call to action

### 12. Resolve `forward_only` Privacy Mode Mismatch

Files:

- `app/(dashboard)/dashboard/configuration/page.tsx`
- `server/services/public-intake.service.ts`
- `components/public/quote-form-wizard.tsx`

Current gap:

- Configuration exposes `forward_only`.
- Public intake form supports only `standard` and `minimal`.
- Server logic maps unsupported modes back to a supported public intake mode.

Risk:

- The setting can imply behavior that the public intake path does not actually provide.

Recommendation:

- Hide or disable `forward_only` until it has real product behavior.
- Or label it as planned/setup-required and keep it unavailable for pilot.

## P1 After Validation Evidence

Only start these after real validation evidence exists unless the owner explicitly reclassifies one of them.

### 13. Persist Owner Notes Or Make The Manual CRM Boundary Explicit

File:

- `app/(dashboard)/dashboard/leads/[leadId]/page.tsx`

Current gap:

- Owner notes are visible as a UI concept but storage is not wired.
- Pilot learning depends heavily on objections, follow-up notes, and conversion context.

Recommendation:

- Either add persisted lead notes through a server action, service, repository, migration, and RLS policy.
- Or remove/soften the in-app notes affordance and explicitly route pilot notes to the Founder CRM until notes are built.

### 14. Add Source Attribution Capture

Files:

- `components/public/quote-form-wizard.tsx`
- `server/services/public-intake.service.ts`
- `server/repositories/public-intake.repository.ts`

Current gap:

- Schema foundations exist for source metadata.
- The client currently does not appear to provide a useful `sourceUrl` value.

Recommendation:

- Capture safe source URL/referrer context with privacy limits.
- Add an owner-visible or founder-visible attribution summary after the privacy and analytics boundary is documented.

### 15. Productize The Validation Dashboard

Reference:

- `docs/product/BIZPILOT_VALIDATION_DASHBOARD_SPEC_v1.1.md`

Current gap:

- Validation metrics are well specified in docs but not fully productized.

Recommendation:

- Start with founder/admin reporting from existing `usage_events`, `lead_events`, and manual CRM records.
- Prioritize:
  - weekly active owners
  - leads created
  - AI draft generated/copied
  - follow-up draft usage
  - time to first value
  - owner retention signal

### 16. Add Payment And Support Process

Current gap:

- Paid pilot readiness needs payment and support handling, but these should not outrank product/demo/customer validation work.

Recommendation:

- Define payment collection assets/process before charging.
- Define support channel, response expectations, and refund handling before paid pilot.

### 17. Defer French Pilot Expansion Until Validation

Current gap:

- fr-CA foundations exist, but the priority standard puts French pilot expansion after validation evidence.

Recommendation:

- Keep current bilingual support stable.
- Do not prioritize French expansion ahead of homepage polish, dashboard polish, email templates, demo readiness, and first customer outreach.

### 18. Complete Strict Restored App/RLS Proof Before Paid Pilot Or Risky Data Work

Current gap:

- DB-level restore proof passed, but strict restored app/dashboard/RLS proof remains incomplete.

Recommendation:

- Complete strict restored app/RLS smoke before paid pilot, production migrations, or destructive/bulk data work.

## P2 Security And Privacy Hardening

### 19. Use A Server-Only IP Hash Salt

File:

- `server/services/abuse-protection.service.ts`

Current gap:

- IP hashing currently derives salt from a public app URL fallback.

Recommendation:

- Add a server-only environment variable such as `BIZPILOT_IP_HASH_SALT`.
- Document it in the env example without real values.
- Keep a deterministic local fallback only for development/test.

### 20. Add Security/Privacy Operations Tables Or Manual Registers

Current gap:

- Documentation recommends security events, privacy requests, vendor/processor register, incident register, and retention posture.
- The current repo appears to rely mostly on docs/manual posture rather than productized tables.

Recommendation:

- Before paid pilot, add either:
  - simple database-backed registers with admin-only access, or
  - explicit manual operating registers with owner-assigned custody.

### 21. Add Retention Cleanup For Abuse Metadata

File:

- `server/services/abuse-protection.service.ts`

Current gap:

- Abuse/rate-limit metadata is logged, but no routine retention cleanup was verified.

Recommendation:

- Add a small retention cleanup script or documented SQL procedure.
- Align retention with the privacy posture, likely 30 to 90 days unless needed for security investigation.

### 22. Tighten CSP Later

File:

- `next.config.ts`

Current gap:

- Security headers exist, but CSP allows inline script/style.

Recommendation:

- Accept this as an MVP risk if needed.
- Later move toward report-only CSP, then hashes/nonces once the app has stable rendering needs.

## P2 Engineering And Process Cleanup

### 23. Add Node Runtime Declaration

Files:

- `package.json`
- optional `.nvmrc`

Current gap:

- CI uses Node 24, and engineering standards mention Node 24 LTS, but package metadata does not enforce it.

Recommendation:

- Add an `engines` field such as `node >=24 <25`.
- Optionally add `.nvmrc` with `24`.

### 24. Add A Local DB Verification Script

File:

- `package.json`

Current gap:

- `pnpm verify` covers lint, typecheck, unit tests, and build.
- RLS and smoke checks are separate, which is reasonable, but the local full-readiness path is not one command.

Recommendation:

- Add a `verify:local-db` script that runs unit tests plus RLS tests and local smoke checks when local Supabase is running.
- Keep production-protection guards.

### 25. Clean Up Diagnostic GitHub Workflows

Files:

- `.github/workflows/checkout-debug.yml`
- `.github/workflows/checkout-diagnostic.yml`

Current gap:

- These appear to be diagnostic leftovers.

Recommendation:

- Keep them only if the checkout/debug issue is still active.
- Otherwise remove or archive them to reduce CI/workflow noise.

### 26. Finish Header Standard Cleanup

Reference:

- `AGENTS.md`

Files noticed during spot-check:

- `components/public/marketing-ui.tsx`
- `lib/features/feature-registry.ts`
- `app/error.tsx`
- `next.config.ts`
- `app/(dashboard)/dashboard/error.tsx`

Current gap:

- Some files have missing or partial BizPilot file headers.

Recommendation:

- Do a small standards cleanup pass after readiness gates.
- Keep it separate from product-readiness changes to reduce review noise.

## Strengths To Preserve

- Clear MVP boundary: cleaning-first quote recovery, not a CRM, booking engine, invoice product, or AI operator.
- Manual owner review is preserved; AI does not auto-send customer messages.
- Public intake has active slug resolution, validation, hidden-field filtering, consent capture, minimum submit age, and abuse protection.
- AI provider code is server-side, schema-bound, privacy-filtered, and has fallback behavior.
- Dashboard has useful owner flows: queue, lead detail, status/outcome actions, AI draft copy actions, and empty/demo state handling.
- Supabase boundaries are well separated between browser client, server client, and service role.
- Build and ordinary test posture are currently healthy.
- Export/dump patterns are guarded by `.gitignore`.

## Suggested Implementation Order

1. Run and record Phase 24F final no-secret production smoke.
2. Record Phase 24G owner approval if Phase 24F passes.
3. Polish homepage for 30-second cleaning-owner understanding.
4. Polish dashboard and lead workspace for 60-second first value.
5. Create manual initial reply, follow-up, and re-engagement email templates.
6. Run and record the end-to-end smoke: signup, verify email, login, create business, submit lead, dashboard, AI summary, AI draft, copy reply, logout, password reset, login again.
7. Create demo scenario, demo script, and 60 to 120 second demo video.
8. Start founder-led outreach to 20 to 30 cleaning businesses.
9. After validation evidence, start P1 items: owner notes, source attribution, validation dashboard, payment/support process, French pilot expansion, strict restored app/RLS proof.
10. Then complete P2 hardening and cleanup.

## Bottom Line

The project does not need a conceptual reset. It needs a disciplined final readiness pass.

The most important thing is to avoid mixing three states:

- synthetic proof passed
- real customer data approved
- paid pilot ready

Today, BizPilot is closest to "synthetic proof passed, pending final no-secret smoke and owner approval." Once those are recorded, the next highest work is product readiness, demo readiness, and customer validation. The core question is no longer "can we build it?" The core question is "will real cleaning businesses use it?"
