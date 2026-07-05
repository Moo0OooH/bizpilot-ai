# Phase 27A Auth Expansion Planning Only

Date: 2026-07-05
Repo: `E:\bizpilot-ai`
Branch: `main`
Baseline HEAD before this pass: `231921b9e2735ba970367a7d98ed92b5e64b823f`

## Verdict

Auth expansion status: PLANNED ONLY.

Google/Gmail login: NOT IMPLEMENTED.

Phone login: NOT IMPLEMENTED.

This phase inspected the current BizPilot auth architecture and records a safe implementation plan. It does not change auth behavior, dashboard behavior, Supabase settings, production data, RLS, migrations, service-role usage, payment, SMS/WhatsApp automation, autonomous AI, real customer data, or paid pilot readiness.

## Current Auth Architecture

### Public auth screens

- `/auth/sign-in` renders the owner email/password sign-in form.
- The sign-in form posts to `signInAction`.
- `signInAction` validates email/password, calls `signInWithPassword`, and redirects only to a safe dashboard/admin path.
- Safe post-login redirect currently allows `/dashboard`, `/dashboard/*`, and `/admin` from the sign-in form.
- `/auth/sign-up` renders the owner account creation form with display name, business name, email, and password.
- The sign-up form posts to `signUpAction`.
- `/auth/check-email` is the safe holding page after email confirmation is required.
- `/auth/forgot-password` and `/auth/reset-password` keep password recovery separate from normal sign-in.

### Supabase Auth service boundary

- `server/services/auth.service.ts` owns Supabase Auth operations.
- Current supported primary auth method is email/password.
- `signInWithPassword` calls Supabase `auth.signInWithPassword`.
- `signUpWithPassword` calls Supabase `auth.signUp` with `business_name` and `display_name` metadata.
- `exchangeAuthCodeForSession` calls Supabase `auth.exchangeCodeForSession`.
- `getCurrentUser` calls Supabase `auth.getUser` and maps id, email, display name, and business name.
- `signOut` calls Supabase `auth.signOut`.

### Signup workspace bootstrap

- `signUpAction` creates the Supabase auth user first.
- If Supabase reports that a new identity was created, `signUpAction` calls `createFoundingBusiness`.
- `createFoundingBusiness` uses the service-role client only for tenant bootstrap after signup.
- It creates:
  - a business record,
  - an owner membership,
  - default cleaning quote configuration,
  - public quote link dependencies.
- Existing identity responses do not create a new workspace and redirect to `/auth/check-email`.
- Workspace recovery exists for accounts that have auth identity but missing/recoverable workspace state.

### Callback and redirect handling

- `proxy.ts` catches root Supabase callback params and routes them to `/auth/callback` or `/auth/reset-password`.
- `/auth/callback` handles non-recovery auth codes.
- Recovery callbacks are routed to `/auth/reset-password`.
- `lib/auth/auth-callback-routing.ts` constrains callback query params to known keys only.
- Post-confirm `next` redirects are constrained to `/dashboard` and `/dashboard/*`.
- `/admin` is allowed by the sign-in form redirect, but callback helper currently keeps OAuth/email-confirm callback redirects dashboard-only.
- Callback failures are sanitized into safe auth route messages.

### Dashboard route protection

- `proxy.ts` protects `/dashboard/:path*` with `protectDashboardRequest`.
- `protectDashboardRequest` uses Supabase SSR `auth.getUser` and redirects logged-out users to `/auth/sign-in?next=<path>`.
- It also checks the workspace session timeout policy and signs out expired sessions.
- `app/(dashboard)/layout.tsx` repeats server-side user checks with `getCurrentUser`.
- Dashboard pages also check `getCurrentUser` before loading private workspace data.
- Workspace access comes from `getBusinessWorkspace`, which reads businesses and memberships for the current user.
- Owner access depends on active owner membership and accessible business state.

### Logout

- `signOutAction` calls `signOut`.
- After logout, the user is redirected to `/auth/sign-in`.

## Google/Gmail Login Requirements

### Application requirements

- Add a Google sign-in option on `/auth/sign-in` only after the provider is configured locally/safely.
- Keep email/password sign-in as the fallback.
- Add a server action or route that starts Supabase OAuth with provider `google`.
- Use the existing `/auth/callback` route for PKCE code exchange.
- Use a safe `redirectTo` value pointing to `/auth/callback`.
- Preserve existing safe redirect handling and tests.
- Decide whether `/admin` should be allowed after OAuth callback. Default recommendation: keep OAuth callback dashboard-only unless founder admin OAuth QA is explicitly planned.
- After OAuth callback exchange, read `getCurrentUser` and verify workspace membership before allowing dashboard access.
- Do not auto-create a new business/workspace from Google OAuth alone.
- If a Google user has no existing owner membership, route to a safe workspace recovery or support/pilot gate instead of creating a duplicate workspace.
- Keep all provider-token handling out of scope. BizPilot does not need Gmail API access for login.

### Identity linking requirements

- Supabase can automatically link OAuth identities with the same verified email to an existing user.
- BizPilot must not rely on email text alone in app code. The source of truth after login must be the Supabase `user.id`.
- If the Google identity links to the existing owner user id, existing business membership should continue to work.
- If Google creates a new user id, BizPilot must not create a second owner workspace automatically.
- Manual identity linking should be treated as a separate logged-in owner flow if needed.
- Before implementation, add source guards that ensure OAuth callback does not call `createFoundingBusiness`.

### Google risk map

| Risk | Impact | Required mitigation |
| --- | --- | --- |
| Duplicate owner/workspace records | High | Do not bootstrap workspace on OAuth callback. Require existing membership or recovery/support gate. |
| OAuth callback open redirect | High | Keep `next` constrained to internal dashboard paths and add unit coverage. |
| Wrong identity linked to owner account | High | Rely on Supabase verified identity linking and `user.id`, not untrusted email text. |
| Missing provider config in production | Medium | Hide/disable Google button until provider settings are verified. |
| Google consent screen trust issue | Medium | Configure branding/custom domain before owner production QA. |
| Over-scoping Google access | Medium | Request login scopes only. Do not request Gmail API scopes. |
| Founder/admin redirect ambiguity | Medium | Keep OAuth callback dashboard-only until admin OAuth flow is explicitly tested. |
| Provider tokens stored accidentally | Medium | Do not store Google provider/access/refresh tokens in this phase. |

## Phone Login Requirements

### Application requirements

- Phone login must stay planning-only until SMS provider, cost control, rate limits, CAPTCHA, country rules, and owner approval are ready.
- Prefer phone as a secondary linked factor/contact method for an already signed-in owner before allowing phone-first login.
- If phone-first login is considered later, it must require an existing Supabase user id with owner membership.
- A new phone-only Supabase user id with no membership must not create a workspace automatically.
- Phone OTP forms must be separate from SMS/WhatsApp marketing or customer messaging.
- Phone auth copy must say "login verification" only, not customer SMS automation.

### Phone risk map

| Risk | Impact | Required mitigation |
| --- | --- | --- |
| SMS cost abuse | High | Rate limits, CAPTCHA, provider limits, monitoring, and owner approval before enabling. |
| Phone number reassignment | High | Treat phone as login verification only; require existing owner membership before dashboard access. |
| Duplicate owner identity | High | Do not auto-create workspace for phone-only auth. Gate no-membership users. |
| Regulatory/compliance issues | High | Review country-specific SMS rules before production use. |
| Confusion with SMS/WhatsApp automation | Medium | Keep product copy explicit: auth OTP only, no customer messaging automation. |
| OTP brute force or spam | High | Use provider/Supabase limits, short-lived OTP, CAPTCHA, and lockout monitoring. |
| Poor recovery path without email | Medium | Keep email/password owner login available until support flow is proven. |

## Supabase Settings Needed Before Implementation

### Shared URL settings

- Supabase Auth Site URL must match the production BizPilot origin.
- Supabase Redirect URLs must include exact callback paths needed by the app.
- Required production redirect candidates:
  - `https://bizpilo.com/auth/callback`
  - `https://www.bizpilo.com/auth/callback` if the www host is supported
  - `https://bizpilo.com/auth/reset-password`
  - `https://www.bizpilo.com/auth/reset-password` if the www host is supported
- Local redirect candidates:
  - `http://localhost:<port>/auth/callback`
  - `http://127.0.0.1:<port>/auth/callback`
  - matching reset-password URLs for local testing
- Production should prefer exact redirect URLs over broad wildcards.

### Google provider settings

- Google Cloud project.
- Google OAuth consent screen/audience.
- Google OAuth client type: Web application.
- Authorized JavaScript origins for local and production app origins.
- Authorized redirect URI set to the Supabase project callback URL, for example `https://<project-ref>.supabase.co/auth/v1/callback`.
- Supabase Auth Google provider enabled.
- Google Client ID and Client Secret added to the Supabase provider config.
- Minimal scopes only:
  - `openid`
  - email/userinfo email
  - profile/userinfo profile
- No Gmail API scopes for login.
- Local development can use Supabase local config only after owner approval and without production secrets in source.

### Phone provider settings

- Phone provider explicitly enabled in Supabase Auth.
- SMS provider selected and configured, for example Twilio, MessageBird, Vonage, or another supported provider.
- OTP rate limits reviewed and tightened.
- CAPTCHA considered before production exposure.
- OTP expiry and retry behavior confirmed.
- Country-specific SMS regulation review completed.
- No WhatsApp channel unless separately approved for auth-only OTP and not confused with customer messaging automation.

### Identity linking settings

- Confirm automatic identity linking behavior for verified matching emails.
- Consider manual identity linking only as a logged-in owner settings flow.
- If manual linking is used, enable the related Supabase setting only after a dedicated safety review.

## Phase Plan

### Phase 27B - Google auth local-safe implementation

Goal: implement Google login locally without production settings or production data mutation.

Steps:

- Add source-level provider auth helpers without changing signup bootstrap.
- Add a Google login start action/route that calls Supabase OAuth with provider `google`.
- Reuse `/auth/callback` for code exchange.
- Keep callback redirect constrained and covered by unit tests.
- Add guard tests that OAuth callback does not call `createFoundingBusiness`.
- Add a no-membership post-login state that points to workspace recovery/support instead of auto-creating data.
- Keep Google button disabled or hidden unless provider config is present and local-safe.
- Run `pnpm verify`, `git diff --check`, auth callback unit tests, and local-safe manual OAuth QA only.

Exit criteria:

- Existing email/password auth still works.
- Google login can authenticate an existing owner locally/safely.
- Existing owner membership is preserved.
- No duplicate workspace is created.
- No production settings are changed.

### Phase 27C - Google auth owner QA

Goal: owner-provided manual QA for Google login after explicit provider setup approval.

Steps:

- Owner configures Google and Supabase provider settings manually.
- Owner confirms redirect URLs and consent screen branding.
- Owner manually tests Google login with the existing owner email.
- Verify dashboard loads and existing workspace is used.
- Verify logout returns to `/auth/sign-in`.
- Verify no duplicate business or membership is created.
- Verify no Gmail API permissions are requested.
- Record evidence as owner-provided visual/auth QA unless automated proof is separately approved.

Exit criteria:

- Owner confirms Google login works for the existing owner account.
- No data duplication.
- No production mutation beyond normal login/session behavior.
- Docs updated with exact evidence and remaining risks.

### Phase 27D - Phone auth planning or implementation only if safe

Goal: keep phone auth blocked until cost, abuse, compliance, and identity-linking risks are closed.

Planning-first steps:

- Decide whether phone is secondary login only or phone-first login.
- Prefer secondary owner phone verification while signed in.
- Choose SMS provider and estimate cost/abuse exposure.
- Define CAPTCHA/rate-limit posture.
- Define no-membership behavior for phone-created auth users.
- Document country/regulatory scope.

Implementation only if safe:

- Add phone OTP request and verify actions.
- Keep phone auth copy separate from customer SMS/WhatsApp automation.
- Require existing owner membership before dashboard access.
- Do not create workspace from phone-only login.
- Run unit, source, and local-safe checks before any owner QA.

Exit criteria:

- Phone auth remains blocked unless all cost/compliance/abuse gates are satisfied.
- No SMS/WhatsApp customer automation is enabled.
- No duplicate owner/workspace records are created.

## Tests To Preserve Or Add Later

Existing relevant tests:

- `tests/unit/auth-callback-routing.test.mts`
- `tests/unit/signup-quote-bootstrap-source.test.mts`
- dashboard route protection/source tests under the unit suite

Future test additions:

- OAuth callback safe redirect tests.
- Provider login button hidden/disabled without config.
- OAuth callback does not call workspace bootstrap.
- No-membership OAuth user routes to safe recovery/support state.
- Existing owner Google identity uses current membership.
- Phone OTP users without membership cannot reach dashboard.

## Official References Consulted

- Supabase Google provider setup: https://supabase.com/docs/guides/auth/social-login/auth-google
- Supabase redirect URL configuration: https://supabase.com/docs/guides/auth/redirect-urls
- Supabase identity linking: https://supabase.com/docs/guides/auth/auth-identity-linking
- Supabase phone login: https://supabase.com/docs/guides/auth/phone-login

## Restricted Areas Confirmation

- No Google auth was implemented.
- No phone auth was implemented.
- No production Supabase setting was changed.
- No production data was touched.
- No real customer data was enabled.
- No paid pilot was enabled.
- No payment/Stripe behavior was touched.
- No SMS/WhatsApp automation was added.
- No autonomous AI behavior was added.
- No Supabase RLS, migrations, service role usage, or production DB behavior was changed.
- No dashboard feature behavior was changed.
- VerifGo was not touched.
