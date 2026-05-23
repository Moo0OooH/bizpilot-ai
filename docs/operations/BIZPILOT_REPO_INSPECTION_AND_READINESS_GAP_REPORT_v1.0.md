# BizPilot Repo Inspection and Readiness Gap Report v1.0

**Project:** BizPilot AI
**Document Type:** Repo inspection, docs-vs-code gap report, and pilot readiness truth table
**Version:** v1.0
**Status:** Active inspection snapshot
**Owner:** MoOoH
**Last Updated:** 2026-05-23
**Related:**
- `docs/CURRENT_CANONICAL_DOCS_v1.7.md`
- `docs/AI_CODING_AGENT_START_HERE_v1.7.md`
- `docs/BIZPILOT_STRATEGIC_ALIGNMENT_UPDATE_v1.6.md`
- `docs/operations/BIZPILOT_PILOT_READINESS_CHECKLIST_v1.0.md`
- `docs/operations/BIZPILOT_PHASE_18A_STANDARDS_AUDIT_v1.0.md`
- `supabase/migrations/README.md`

---

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

At inspection time the branch was `main` and in sync with `origin/main`, with uncommitted changes in:

- `app/auth/forgot-password/page.tsx`
- `app/auth/reset-password/reset-password-form.tsx`
- `app/auth/sign-up/page.tsx`
- `app/page.tsx`
- `lib/i18n/bizpilot-copy.ts`
- `server/actions/auth.actions.ts`

Important note: `app/page.tsx` has a large uncommitted homepage rewrite that removes the previously implemented homepage language switch and localized homepage copy. This conflicts with the product requirement that the public site, auth pages, and dashboard visibly honor the selected language together. This report does not revert that file because it is existing working-tree work, but it must be resolved before committing any homepage-related change.

## 4. Validation Results

| Command | Result | Notes |
| --- | --- | --- |
| `pnpm lint` | Pass | ESLint completed successfully. |
| `pnpm typecheck` | Pass | TypeScript completed successfully. |
| `pnpm test:unit` | Pass | 17 tests passed. Node emitted a non-blocking `MODULE_TYPELESS_PACKAGE_JSON` warning for TS/ESM parsing. |
| `pnpm build` | Pass | Next.js 16.2.4 production build completed successfully. |
| `pnpm test:rls` | Blocked by local environment | Runner refused to run because `DATABASE_URL` is not set. This is expected safety behavior; the runner only allows local DB hosts. |

## 5. Code Inspection Findings

| Area | Status | Evidence |
| --- | --- | --- |
| Auth signup email flow | Pass with current uncommitted hardening | Signup uses `supabase.auth.signUp(...)` in `server/services/auth.service.ts` with `/auth/callback` redirect. Forgot password is the only path using `resetPasswordForEmail(...)`. The uncommitted form-intent guard blocks signup payloads from reaching the password reset action. |
| Auth callback routing | Pass | `/auth/callback` exchanges non-recovery codes. Recovery callbacks are routed to `/auth/reset-password`. Unit tests cover root callbacks, recovery callbacks, safe param copying, and `next` path constraints. |
| Password reset UX | Improved, uncommitted | Reset password now displays a helper saying the old password cannot be reused and maps same-password style provider errors to a clear user message. Supabase rate limiting is still provider-controlled. |
| Public quote security path | Pass by code inspection | Public submission uses server-side page resolution, business/form/consent matching, honeypot, minimum submit-age, per-business/IP rate limiting, and safe public errors. |
| Public submission values hardening | Pass by migration/test coverage | Migration `0012` adds `public_can_insert_submission_value(...)` to block unknown field keys, hidden fields, and cross-form/cross-business value injection. RLS tests cover those negative cases. |
| Abuse logging | Pass by code inspection | Migration `0013` creates service-function-only abuse logging; migration `0016` adds `submitted_too_fast`. Service records rate-limit, honeypot, consent, invalid-form, invalid-field, too-fast, and completed attempts. |
| Supabase migrations | Present locally | Files `0001` through `0017` are present and indexed. Target Supabase application status is not verified from this repo inspection. |
| Service-role boundary | Pass with limited exceptions | `SUPABASE_SERVICE_ROLE_KEY` is read only through server-only env code. Service-role client is used for signup tenant bootstrap and founder admin after founder allowlist authorization. No service-role browser/client usage was found. |
| Dashboard route protection | Pass for dashboard | `proxy.ts` protects `/dashboard/:path*`. `/admin` is not in proxy matcher but the page itself requires authenticated founder allowlist before service-role data is loaded. |
| AI fallback and metadata safety | Partial pass | AI provider errors are sanitized to stable labels before persistence, prompts mask email/phone values, and fallback works when no provider exists. A real `OPENAI_API_KEY` dry run has not been verified in this environment. |
| Raw error leakage | Partial pass | Public/lead/config actions use safe user-message mapping. Several repositories still throw raw provider/database messages internally, and auth/config actions log diagnostics directly with `console.*`. No token logging was found, but safe logger adoption is incomplete. |
| Magic Moment | Pass, with localization gap | Dashboard overview, queue sample state, lead detail, AI summary/reply/follow-up, and copy-only controls exist. Many dashboard strings are still hard-coded English rather than fully using `BizPilotCopy`. |
| Read-time side effects | Open watchpoint | Dashboard and lead detail reads calculate scores, create events/action items, mark first viewed, and update SLA state during page load. This matches current behavior but should remain a documented operational risk. |

## 6. Docs Inspection Findings

| Area | Status | Finding |
| --- | --- | --- |
| Canonical map | Updated in this pass | The current docs map now includes the repo inspection report and the newer dashboard/homepage/design-system specs that were previously easy to miss. |
| Docs inventory | Updated in this pass | The docs inventory was regenerated from the repo so newer Phase 18, production, admin, pricing, and support docs are visible. |
| Mojibake | Partially cleaned in this pass | The actual mojibake occurrences detected by `rg` were concentrated in `product/BIZPILOT_DASHBOARD_DESIGN_SYSTEM_v1.0.md`; those were mechanically normalized to ASCII-safe text. |
| Version mismatch | Open but documented | `BIZPILOT_DESIGN_SYSTEM_SPEC_v1.0.md` and `BIZPILOT_HOMEPAGE_AND_VISUAL_THEME_STANDARD_v1.0.md` have filenames ending in `v1.0` but titles saying `v1.1`. Renaming would require a broader docs reference pass, so this remains an explicit cleanup item rather than a silent rename. |
| Readiness truth | This report is the current truth table | Older readiness docs remain useful evidence, but this report reflects the current repo inspection and the current uncommitted working tree. |

## 7. Single Readiness Truth

| Readiness Item | State | Owner |
| --- | --- | --- |
| Repo builds and typechecks | Pass | Engineering |
| Unit tests | Pass | Engineering |
| RLS tests against local DB | Blocked until `DATABASE_URL` local is set | Engineering/Ops |
| Target Supabase project confirmed | Blocker | Owner/Ops |
| Migrations `0010` through `0017` verified on target | Blocker | Owner/Ops |
| Supabase Auth Site URL and Redirect URLs verified on target | Blocker | Owner/Ops |
| Signup sends confirmation, not recovery | Pass by code inspection; production email template still must be observed after deploy | Engineering/Ops |
| Forgot password sends recovery | Pass by code inspection; production email template still must be observed after deploy | Engineering/Ops |
| Password reset same-password message is clear | Improved in working tree | Engineering |
| `OPENAI_API_KEY` model-backed dry run | Open | Owner/Engineering |
| Fallback AI without key | Pass by design | Engineering |
| Backup/export strategy | Partial | Owner/Ops |
| PITR window, export storage, restore drill | Open | Owner/Ops |
| Pricing/refund/cancellation | Open owner decision | Owner |
| Founder CRM real prospects | Open owner execution | Owner |
| Homepage language switch and global localization | Blocker before language-related commit | Engineering |
| Dashboard full localization | Open product quality gap | Engineering |
| Support/privacy request process | Open owner/ops decision | Owner/Ops |

## 8. Required Owner Actions

Before real pilot traffic:

1. Confirm the exact production/pilot Supabase project.
2. Verify or apply migrations `0010` through `0017` on that target.
3. Set and verify production `NEXT_PUBLIC_APP_URL`.
4. Verify Supabase Auth Site URL and Redirect URLs:
   - `/auth/callback`
   - `/auth/reset-password`
   - `/auth/check-email`
5. Decide whether the active domain spelling is intentionally `bizpilo.com`.
6. Provide `DATABASE_URL` for a local Supabase/Postgres target when RLS tests need to run locally.
7. Provide `OPENAI_API_KEY` only when ready to test model-backed drafts.
8. Decide Supabase plan tier, PITR window, export storage, and first restore-drill timing.
9. Decide pilot price, setup fee, refund, cancellation, and trial wording.
10. Add at least 10 real cleaning prospects to the Founder CRM before expanding features.

## 9. Recommended Engineering Next Order

1. Resolve the current uncommitted `app/page.tsx` language regression before committing homepage work.
2. Commit the auth hardening changes separately from docs/report changes if that auth patch is accepted.
3. Set a local `DATABASE_URL` and rerun `pnpm test:rls`.
4. Run a production-like auth smoke test after Supabase target URLs are verified:
   - signup,
   - confirmation email,
   - confirmation redirect,
   - sign in,
   - forgot password,
   - reset password,
   - same-password reset attempt.
5. Run an AI dry run with a real key and verify no raw prompt, raw customer payload, provider error, or token appears in logs or persisted metadata.
6. Localize the remaining hard-coded dashboard/homepage strings through `BizPilotCopy`.

## 10. Bottom Line

The repo is structurally aligned with the locked MVP: cleaning-first quote recovery, public intake, lead workspace, owner-reviewed AI drafts, and manual owner actions. The app currently passes lint, typecheck, unit tests, and production build.

The main blockers are not more product features. They are target Supabase verification, local RLS rerun, production auth/email verification, real AI-key dry run, owner commercial decisions, backup/restore decisions, and the current uncommitted homepage language regression.
