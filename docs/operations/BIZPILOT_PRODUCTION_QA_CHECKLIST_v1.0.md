# BizPilot AI — Production QA Checklist v1.0

## Purpose
Checklist before sending the live domain to pilot prospects.

## Phase 19H Actual QA Status

| Area | Status | Evidence / Next Action |
| --- | --- | --- |
| Static/public route smoke | Pass | Recent production smoke covered `/`, `/pricing`, auth surfaces, mobile width, language switch, and no horizontal overflow. |
| Build validation | Pass | Latest recorded `pnpm lint`, `pnpm typecheck`, `pnpm test:unit`, and `pnpm build` passed. |
| Signup confirmation | Open | Signup production action no longer crashes, but Supabase throttling prevented final confirmation-email/callback verification after the latest callback messaging fix. |
| Forgot/reset password | Open | Forgot-password production request was clicked; reset flow should be re-smoked after Supabase rate limits clear. |
| Production Supabase schema | Blocked | Phase 19C found missing language/admin columns on the checked Supabase host. Confirm actual production target and schema before quote/dashboard smoke. |
| fr-CA quote flow | Blocked | No disposable fr-CA business/link/lead could be created due schema drift. |
| Dashboard lead workflow | Blocked | Requires valid production quote submission and lead creation after schema alignment. |
| Tenant isolation production smoke | Blocked | Requires valid production test lead and second owner after schema alignment. |
| OpenAI model-backed AI | Blocked | No non-empty `OPENAI_API_KEY`; no real model output was generated. |
| AI fallback | Pass | Fallback path is verified by code/design and remains owner-reviewed/manual copy-send only. |
| Backup/export/restore | Blocked | Runbook exists, but no dump or restore drill was performed; PITR/storage require owner decision. |
| Customer validation readiness | Owner decision required | No real prospects supplied; outreach/demo targets remain owner execution. |

## Technical Checks
- `pnpm lint`
- `pnpm typecheck`
- `pnpm build`
- `pnpm test:rls`
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
