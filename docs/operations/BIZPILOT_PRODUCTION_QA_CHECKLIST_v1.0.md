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
- sign-in works
- sign-out works
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

## AI
- AI summary generated server-side
- reply draft generated
- follow-up draft generated
- missing info guidance works
- AI does not invent pricing/availability
- AI does not auto-send
