# BizPilot AI — Production QA Checklist v1.0

## Purpose
Checklist before sending the live domain to pilot prospects.

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
