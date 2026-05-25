# BizPilot AI — Production QA Checklist v1.0

## Purpose
Checklist before sending the live domain to pilot prospects.

## Phase 21 Current QA Status

Use this table as the active production QA truth. Older Phase 19H/20 blockers remain useful history, but the corrected Phase 21 production target and SQL verification supersede the earlier schema-drift finding.

| Area | Status | Evidence / Next Action |
| --- | --- | --- |
| Static/public route smoke | Pass with repeatable script | Production `https://bizpilo.com` returned HTTP 200 in Phase 21. `pnpm smoke:public` now covers `/`, `/pricing`, `/privacy`, `/security`, `/terms`, and auth surfaces against local or production with `BIZPILOT_SMOKE_BASE_URL`. |
| Local validation | Pass | Phase 21 local gates passed: `pnpm verify`, `pnpm test:rls` 13/13 through a temporary local-only proxy, and `git diff --check`. |
| CI validation | Ready but not remote-run yet | `.github/workflows/ci.yml` now runs no-secret lint, typecheck, unit tests, and build on `main`, `phase-*`, PRs, and manual dispatch. It will run after an approved push. |
| Founder admin fake/test user cleanup | Repo-backed; production smoke pending | `/admin` now includes a founder-only fake/test auth login deletion control. It blocks founder accounts, production-customer users, and workspace owners. Requires approved deploy plus synthetic admin smoke before use in production. |
| Signup confirmation | Passed once; SMTP posture blocked | A synthetic disposable-inbox signup smoke passed on 2026-05-25, but repeatable real-pilot posture still requires custom SMTP and reset-password smoke. See `docs/operations/BIZPILOT_AUTH_EMAIL_SMTP_INTEGRATION_PLAN_v1.0.md`. |
| Forgot/reset password | Open | Reset flow still needs one controlled production smoke with an approved inbox after signup-confirmation setup exists. |
| Production Supabase schema/RLS | Object-verified; migration history unavailable | Corrected target `qfqendrqimqvkoojpjao` has required columns/functions, expected `0018` lifecycle/deletion objects, RLS enabled on all 31 public tables, 70 reviewed policies, targeted constraints/seeds, and verified `0019` grants. `supabase_migrations.schema_migrations` is missing, so treat production as schema-without-standard-migration-history/manual drift. |
| Public quote security | Blocked | Phase 21E not run. Phase 21N records the synthetic production smoke plan, but execution still requires owner approval for deploy/URL, accounts, payload, and cleanup. Use synthetic data only. |
| fr-CA quote flow | Blocked | Phase 21F not run. Depends on Phase 21E and owner approval of the Phase 21N disposable fr-CA cleaning link/session plan. |
| Dashboard lead workflow | Blocked | Requires a valid synthetic production quote submission and founder/owner dashboard smoke. |
| Tenant isolation production smoke | Blocked | Requires synthetic production lead plus a second synthetic owner account. Local RLS tests pass, but production browser smoke is still needed. |
| OpenAI model-backed AI | Blocked | A real-key synthetic dry run returned HTTP `429`; no model output was generated or quality-checked. Owner/operator must check OpenAI quota/billing/model access before retry. |
| AI fallback | Pass | Fallback path is verified by code/design and remains owner-reviewed/manual copy-send only. |
| Backup/export/restore | Blocked for real customer data | Supabase Free/no-PITR posture is acceptable only for synthetic demos; no manual export or restore drill has been done. See `docs/operations/BIZPILOT_BACKUP_EXPORT_RESTORE_DECISION_MATRIX_v1.0.md`. |
| Customer validation readiness | Owner decision required | Real outreach, pilot terms approval, support channel, and commercial process remain owner execution. |

## Technical Checks
- `pnpm lint`
- `pnpm typecheck`
- `pnpm build`
- `pnpm test:rls`
- `pnpm smoke:public`
- `BIZPILOT_SMOKE_BASE_URL=https://bizpilo.com pnpm smoke:public`
- production env vars set
- no server secrets exposed to client bundle
- safe errors visible to users
- logs do not leak sensitive data

## Public Pages
- homepage loads
- pricing loads
- sign-in loads
- sign-up loads
- public quote page loads
- quote success page loads
- mobile layout acceptable

## Auth
- sign-up works
- confirmation email opens `/auth/callback` and creates the owner workspace
- sign-in works
- sign-out works
- forgot-password sends a recovery email without revealing whether the email exists
- password reset opens `/auth/reset-password`, updates the password, clears the recovery session, and returns to sign-in
- expired or reused reset links show a safe error
- protected dashboard redirects correctly
- logged-in user reaches dashboard

## Dashboard
- overview loads
- leads page loads
- lead detail loads
- quote setup/configuration saves
- business profile/settings work where implemented
- Magic Moment/demo state does not feel empty

## Public Quote Path
- active quote link works
- inactive quote link blocked
- hidden fields cannot be submitted
- required fields validated
- consent captured if required
- success page shown
- owner can see submitted lead

## Language
- EN/FR switch appears on public and auth surfaces
- business preferred language persists for quote pages
- quote form, validation errors, and success page render in the selected business language
- AI summary, reply draft, follow-up draft, and missing-info guidance use the business preferred language
- custom owner field labels are preserved when language changes

## AI
- AI summary generated server-side
- reply draft generated
- follow-up draft generated
- missing info guidance works
- AI does not invent pricing/availability
- AI does not auto-send
