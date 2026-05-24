# BizPilot Repo Inspection and Readiness Gap Report v1.0

**Project:** BizPilot AI
**Document Type:** Repo inspection, docs-vs-code gap report, and pilot readiness truth table
**Version:** v1.0
**Status:** Active inspection snapshot
**Owner:** MoOoH
**Last Updated:** 2026-05-24
**Related:**
- `docs/CURRENT_CANONICAL_DOCS_v1.7.md`
- `docs/AI_CODING_AGENT_START_HERE_v1.7.md`
- `docs/BIZPILOT_STRATEGIC_ALIGNMENT_UPDATE_v1.6.md`
- `docs/operations/BIZPILOT_PILOT_READINESS_CHECKLIST_v1.0.md`
- `docs/operations/BIZPILOT_PHASE_18A_STANDARDS_AUDIT_v1.0.md`
- `supabase/migrations/README.md`

---

## 0. Phase 21 Overlay

This report began as the Phase 18 repository inspection snapshot. The Phase 21 evidence below is the current operational overlay and supersedes older production-target/schema notes in this file where they conflict.

| Area | Current Phase 21 truth |
| --- | --- |
| Git branch | Active work is on `phase-21-production-alignment`; do not push `origin/main` without separate owner approval. |
| Latest local validation | `pnpm verify` passed; `pnpm test:rls` passed 13/13 through a temporary local-only proxy; `git diff --check` passed. |
| CI | `.github/workflows/ci.yml` now exists for no-secret lint/typecheck/unit/build validation on `main`, `phase-*`, PRs, and manual dispatch. It has not run remotely until an approved push occurs. |
| Production target | Corrected production Supabase project is `bizpilot-production` / `qfqendrqimqvkoojpjao`; Vercel production project/deployment/aliases and required encrypted env names were verified without revealing values. |
| Production schema/RLS | Required columns/functions, expected `0018` lifecycle/deletion objects, all-public-table RLS enablement, public policy list, safe aggregate counts, targeted constraints/seeds, and grant-only `0019` hardening are verified. |
| Migration history | `supabase_migrations.schema_migrations` is missing, so production is treated as schema-without-standard-migration-history/manual drift. Do not replay `0018` blindly and do not add `leads.source`. |
| Backup/PITR | Supabase Free plan has no scheduled backups/PITR available; no manual export or restore drill has been done. This blocks real customer data, but is risk-accepted only for no-real-user database/security alignment. |
| Remaining pilot blockers | Production quote/security smoke, fr-CA smoke, signup inbox smoke, OpenAI 429 resolution, commercial terms, support channel, real prospect/customer validation, and real-data backup/export/restore decisions. |

## 1. Purpose

This report converts the documentation-package review into an actual repository inspection.

The active product identity remains locked:

> Quote Recovery Command Center for Cleaning Businesses.

MVP boundaries remain locked:

- cleaning-first quote intake and recovery,
- owner-reviewed AI drafts only,
- manual copy/send by the owner,
- founder-led setup and validation,
- no booking, invoices, SMS/WhatsApp automation, Instagram API automation, AI auto-send, full CRM, marketplace, mobile app, multi-vertical expansion, or advanced analytics warehouse.

## 2. Inspection Scope

Inspected on 2026-05-23:

- package scripts and validation commands,
- Next.js route structure and protected route guard,
- Supabase client architecture and service-role boundary,
- auth signup, confirmation, callback, forgot-password, and reset-password flow,
- public quote page, submission action, service, repository, and RLS coverage,
- migrations `0001` through `0017`,
- RLS tests and runner behavior,
- AI provider, fallback, prompt privacy, and persisted metadata path,
- dashboard overview, lead queue, lead detail, Magic Moment surface, and read-time side effects,
- founder admin service-role flow,
- docs map, docs inventory, readiness checklist, and standards audit.

## 3. Current Working Tree Context

At the 2026-05-23 Phase 18 reconciliation pass, recent auth and language work had been committed through:

- `501451a fix: prevent auth redirect env crashes`
- `a487e62 fix: clear recovery session after password reset`
- `76a9f8f fix: improve mobile responsiveness and FR localization polish`
- `d6fe774 feat: localize homepage copy`
- `afc63fd Add global language switching`
- `d0c6fbd test: enforce multilingual copy sync`

The current working tree contains a small Phase 18 hardening/doc-sync pass:

- safe auth/config server-action logging cleanup,
- production/Phase 18 checklist updates for migrations through `0017`,
- production QA checklist additions for auth and language smoke tests.

No product-scope expansion is included in this pass.

## 4. Validation Results

| Command | Result | Notes |
| --- | --- | --- |
| `pnpm lint` | Pass | 2026-05-23: ESLint completed successfully. |
| `pnpm typecheck` | Pass | 2026-05-23: TypeScript completed successfully. |
| `pnpm test:unit` | Pass | 2026-05-23: 19 tests passed. Node emitted non-blocking `MODULE_TYPELESS_PACKAGE_JSON` warnings for TS/ESM parsing. |
| `pnpm build` | Pass | 2026-05-23: Next.js 16.2.4 production build completed successfully. |
| `pnpm test:rls` | Blocked by local environment | 2026-05-23: Runner refused to run because `DATABASE_URL` is not set. This is expected safety behavior; the runner only allows local DB hosts and must not be pointed at managed production. |

## 5. Code Inspection Findings

| Area | Status | Evidence |
| --- | --- | --- |
| Auth signup email flow | Pass by code inspection; production smoke still required | Signup uses `supabase.auth.signUp(...)` in `server/services/auth.service.ts` with `/auth/callback` redirect. Forgot password is the only path using `resetPasswordForEmail(...)`. Form-intent guards prevent signup payloads from reaching the password reset action. |
| Auth callback routing | Pass | `/auth/callback` exchanges non-recovery codes. Recovery callbacks are routed to `/auth/reset-password`. Unit tests cover root callbacks, recovery callbacks, safe param copying, and `next` path constraints. |
| Password reset UX | Pass by code inspection; production smoke still required | Reset password opens `/auth/reset-password`, maps same-password provider errors to clear safe copy, clears the recovery session after success, and returns to sign-in. Supabase rate limiting is provider-controlled and surfaced with safe non-enumerating UX. |
| Public quote security path | Pass by code inspection | Public submission uses server-side page resolution, business/form/consent matching, honeypot, minimum submit-age, per-business/IP rate limiting, and safe public errors. |
| Public submission values hardening | Pass by migration/test coverage | Migration `0012` adds `public_can_insert_submission_value(...)` to block unknown field keys, hidden fields, and cross-form/cross-business value injection. RLS tests cover those negative cases. |
| Abuse logging | Pass by code inspection | Migration `0013` creates service-function-only abuse logging; migration `0016` adds `submitted_too_fast`. Service records rate-limit, honeypot, consent, invalid-form, invalid-field, too-fast, and completed attempts. |
| Supabase migrations | Present locally; production application owner-reported | Files `0001` through `0017` are present and indexed. Owner reported migrations `0001` through `0017` were applied to `bizpilot-production`; this repo pass still treats independent production SQL verification as an ops step. |
| Service-role boundary | Pass with limited exceptions | `SUPABASE_SERVICE_ROLE_KEY` is read only through server-only env code. Service-role client is used for signup tenant bootstrap and founder admin after founder allowlist authorization. No service-role browser/client usage was found. |
| Dashboard route protection | Pass for dashboard | `proxy.ts` protects `/dashboard/:path*`. `/admin` is not in proxy matcher but the page itself requires authenticated founder allowlist before service-role data is loaded. |
| AI fallback and metadata safety | Partial pass | AI provider errors are sanitized to stable labels before persistence, prompts mask email/phone values, and fallback works when no provider exists. A real `OPENAI_API_KEY` dry run has not been verified in this environment. |
| Raw error leakage | Improved in current pass | Runtime app/server paths now route auth and business configuration diagnostics through `safeLogger` instead of direct raw `console.*` calls. Repositories may still throw provider/database errors internally for safe boundary mapping. |
| Magic Moment | Pass with MVP-safe EN/FR language support | Dashboard overview, queue sample state, lead detail, AI summary/reply/follow-up, and copy-only controls exist. MVP-safe language support covers global switching, business preferred language, public quote/success/auth surfaces, and AI language guidance; full enterprise i18n remains intentionally out of scope. |
| Read-time side effects | Open watchpoint | Dashboard and lead detail reads calculate scores, create events/action items, mark first viewed, and update SLA state during page load. This matches current behavior but should remain a documented operational risk. |

## 6. Docs Inspection Findings

| Area | Status | Finding |
| --- | --- | --- |
| Canonical map | Updated in this pass | The current docs map now includes the repo inspection report and the newer dashboard/homepage/design-system specs that were previously easy to miss. |
| Docs inventory | Updated in this pass | The docs inventory was regenerated from the repo so newer Phase 18, production, admin, pricing, and support docs are visible. |
| Mojibake | Partially cleaned in this pass | The actual mojibake occurrences detected by `rg` were concentrated in `product/BIZPILOT_DASHBOARD_DESIGN_SYSTEM_v1.0.md`; those were mechanically normalized to ASCII-safe text. |
| Version mismatch | Open but documented | `BIZPILOT_DESIGN_SYSTEM_SPEC_v1.0.md` and `BIZPILOT_HOMEPAGE_AND_VISUAL_THEME_STANDARD_v1.0.md` have filenames ending in `v1.0` but titles saying `v1.1`. Renaming would require a broader docs reference pass, so this remains an explicit cleanup item rather than a silent rename. |
| Readiness truth | This report is the current truth table | Older readiness docs remain useful evidence, but this report reflects the current repo inspection, recent auth/language commits, and this Phase 18 hardening/doc-sync pass. |

## 7. Single Readiness Truth

| Readiness Item | State | Owner |
| --- | --- | --- |
| Repo builds and typechecks | Pass | Engineering |
| Unit tests | Pass | Engineering |
| RLS tests against local DB | Blocked until `DATABASE_URL` local is set | Engineering/Ops |
| Target Supabase project confirmed | Owner reports `bizpilot-production` | Owner/Ops |
| Migrations `0010` through `0017` verified on target | Owner-reported applied; independent SQL verification remains | Owner/Ops |
| Supabase Auth Site URL and Redirect URLs verified on target | Blocker | Owner/Ops |
| Signup sends confirmation, not recovery | Pass by code inspection; production email template still must be observed after deploy | Engineering/Ops |
| Forgot password sends recovery | Pass by code inspection; production email template still must be observed after deploy | Engineering/Ops |
| Password reset same-password message is clear | Pass by code inspection | Engineering |
| `OPENAI_API_KEY` model-backed dry run | Open | Owner/Engineering |
| Fallback AI without key | Pass by design | Engineering |
| Backup/export strategy | Partial | Owner/Ops |
| PITR window, export storage, restore drill | Open | Owner/Ops |
| Pricing/refund/cancellation | Open owner decision | Owner |
| Founder CRM real prospects | Open owner execution | Owner |
| Homepage language switch and global localization | Pass for MVP-safe EN/FR | Engineering |
| Dashboard full localization | MVP-safe; continue through dictionary when touching pages | Engineering |
| Support/privacy request process | Open owner/ops decision | Owner/Ops |

## 8. Required Owner Actions

Before real pilot traffic:

1. Keep `bizpilot-production` as the confirmed production Supabase project, or explicitly record any change.
2. Independently verify migrations `0010` through `0017` on that target with SQL inspection of key columns, functions, grants, RLS, `admin_action_log`, and `businesses.preferred_language`.
3. Set and verify production `NEXT_PUBLIC_APP_URL=https://bizpilo.com`.
4. Verify Supabase Auth Site URL and Redirect URLs:
   - `/auth/callback`
   - `/auth/reset-password`
   - `/auth/check-email`
5. Wait for Supabase email rate limits to clear, then test one fresh signup confirmation and one password reset on `https://bizpilo.com`.
6. Provide `DATABASE_URL` for a local Supabase/Postgres target when RLS tests need to run locally.
7. Provide `OPENAI_API_KEY` only when ready to test model-backed drafts.
8. Decide Supabase plan tier, PITR window, export storage, and first restore-drill timing.
9. Decide pilot price, setup fee, refund, cancellation, and trial wording.
10. Add at least 10 real cleaning prospects to the Founder CRM before expanding features.

## 9. Recommended Engineering Next Order

1. Finish this Phase 18 hardening/doc-sync pass and run full local gates.
2. Set a local `DATABASE_URL` and rerun `pnpm test:rls` whenever local Supabase/Postgres is reachable.
3. Run a production-like auth smoke test after Supabase target URLs are verified:
   - signup,
   - confirmation email,
   - confirmation redirect,
   - sign in,
   - forgot password,
   - reset password,
   - same-password reset attempt.
4. Run one FR smoke test with a `fr-CA` business: public quote, validation error, success page, and AI drafts.
5. Run an AI dry run with a real key and verify no raw prompt, raw customer payload, provider error, or token appears in logs or persisted metadata.
6. Continue localization through the shared dictionary when any customer-facing UI copy is changed.

## 10. Bottom Line

The repo is structurally aligned with the locked MVP: cleaning-first quote recovery, public intake, lead workspace, owner-reviewed AI drafts, and manual owner actions. The app currently passes lint, typecheck, unit tests, and production build.

The main blockers are not more product features. They are independent production Supabase verification, local RLS rerun when a safe local database URL is available, production auth/email verification, real AI-key dry run, owner commercial decisions, backup/restore decisions, and real prospect outreach.
