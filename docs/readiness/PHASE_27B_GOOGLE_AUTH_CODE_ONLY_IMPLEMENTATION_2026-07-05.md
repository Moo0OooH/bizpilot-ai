# Phase 27B - Google Auth Code-Only Implementation

Date: 2026-07-05
Repo: `E:\bizpilot-ai`
Branch: `main`
Baseline HEAD before implementation: `a62c3b983e1dbeb18363380d036586a2e55603d6`

## Verdict

Google login code: IMPLEMENTED.

Production Supabase Google provider settings: NOT CHANGED.

Phone login: NOT IMPLEMENTED and remains BLOCKED.

This phase adds the application-side Google login entry while preserving the current email/password signup bootstrap and dashboard access boundaries. It does not enable production Google provider settings, request Gmail scopes, add phone OTP, touch production data, change RLS, add migrations, change service-role usage, open paid pilot, add payment behavior, add SMS/WhatsApp automation, or add autonomous AI.

## Implementation Summary

- Added a shared Supabase OAuth helper, `signInWithGoogleOAuth`, in `server/services/auth.service.ts`.
- The helper calls Supabase Auth with `provider: "google"`.
- The helper uses explicit login-only scopes: `openid email profile`.
- The helper does not request Gmail API scopes.
- Added `signInWithGoogleAction` in `server/actions/auth.actions.ts`.
- The action builds a redirect to the existing `/auth/callback` route.
- The action preserves dashboard-safe redirect handling through `getSafeAuthCallbackNextPath`.
- The action redirects the browser to the Supabase-generated Google OAuth URL.
- The action does not call `createFoundingBusiness`.
- The action does not call `signUpWithPassword`.
- The callback route remains the existing Supabase code exchange path.

## Sign-In Surface

`/auth/sign-in` now shows a Google login button above the email/password form.

The page still keeps:

- email/password sign-in,
- forgot-password access,
- safe route feedback,
- pilot approval guidance,
- no Gmail integration claim,
- no auto-workspace claim.

The Google helper text states that this is login only, does not request Gmail access, and does not create a workspace from Google.

## Sign-Up Surface

`/auth/sign-up` now shows the same Google login entry for already approved owner accounts with existing workspaces.

The sign-up page still keeps the email/password workspace creation form as the only path that can create a founding workspace.

The Google copy explicitly says:

- Google is for already approved owner accounts with an existing workspace.
- New workspace creation still uses the email form.

## Callback Behavior

Google OAuth reuses `/auth/callback`.

The callback still:

- exchanges the Supabase auth code,
- treats recovery links separately,
- sanitizes provider/callback errors,
- redirects only to dashboard-safe next paths,
- does not create or recover a workspace by itself.

If a Google-authenticated account has no existing workspace or owner membership, the dashboard layer remains responsible for showing the existing safe blocked/recovery path. OAuth itself does not silently bootstrap a workspace.

## Workspace Bootstrap Boundary

Workspace creation remains limited to the guarded email/password signup path:

- `signUpAction`
- `signUpWithPassword`
- `createFoundingBusiness`
- owner membership creation
- quote setup bootstrap

Google OAuth does not enter that path.

This prevents duplicate owner/workspace records when Google creates a separate Supabase identity.

## Provider-Disabled Behavior

If Supabase/Google OAuth cannot start, the server action redirects back to sign-in with a sanitized owner-facing message:

`Google sign-in is not ready yet. Use email and password or ask the founder to enable it.`

The route-message sanitizer maps that exact message to localized auth copy instead of showing raw provider or Supabase details.

## Phone Auth Status

Phone auth remains blocked.

No app code was added for:

- `signInWithOtp`,
- `verifyOtp`,
- phone provider auth,
- SMS channel auth,
- WhatsApp auth.

Customer SMS/WhatsApp automation remains out of scope.

## Source Guards Added

Added `tests/unit/google-auth-source.test.mts` to prove:

- Google OAuth uses the existing callback route.
- Google OAuth uses only `openid email profile`.
- Gmail scopes are not requested.
- Google OAuth does not call signup workspace bootstrap.
- Email/password sign-in and signup remain wired.
- Phone auth is not enabled in auth entry code.

Existing auth guards still cover:

- callback route classification,
- safe dashboard redirects,
- signup quote bootstrap after owner membership,
- no RLS weakening from signup bootstrap.

## Required External Settings Before Owner QA

These settings are still manual and were not changed in this phase:

- Configure Google OAuth in Google Cloud.
- Configure the Google provider in Supabase Auth.
- Add exact Supabase redirect URLs in the Google OAuth client.
- Add exact app callback URLs in Supabase redirect allowlist.
- Confirm production consent screen branding.
- Confirm identity linking behavior for the existing owner email.
- Confirm no Gmail API scopes are added.

## Phase 27C Owner QA Gate

Before calling Google auth production-ready, owner QA must prove:

- existing owner can log in with Google,
- existing owner lands in the existing dashboard workspace,
- no duplicate workspace appears,
- email/password login still works,
- logout still returns to `/auth/sign-in`,
- no Gmail permission is requested,
- no phone auth appears,
- no production data is created or mutated by the QA flow.

## Restricted Areas Confirmation

- Production data: not touched.
- Production Supabase settings: not changed.
- Supabase RLS: not changed.
- Supabase migrations: not changed.
- Service-role usage: not changed.
- Phone auth: not implemented.
- SMS/WhatsApp automation: not added.
- Gmail integration: not added.
- Payment/Stripe: not touched.
- Paid pilot: not enabled.
- Autonomous AI: not added.
- VerifGo: not touched.
