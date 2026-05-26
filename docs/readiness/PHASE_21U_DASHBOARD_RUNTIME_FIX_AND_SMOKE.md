# Phase 21U Dashboard Runtime Fix And Smoke

Date: 2026-05-26
Branch: `phase-21q-dashboard-redesign`

## Production issue

Owner reported `https://bizpilo.com/dashboard` rendering the generic Next.js
runtime error page after sign-in.

## Root cause

`app/(dashboard)/layout.tsx` passed the full dashboard `settings` copy object
into `DashboardShell`, which renders client components. That object contains the
server-side formatter function `settings.sessionPolicy.afterDuration`. Next.js
cannot serialize functions from Server Components into Client Components, so the
dashboard shell crashed at runtime for authenticated users.

## Fix

- `DashboardShellCopy` now accepts only the shell-safe settings field it needs:
  `settings.plan`.
- `DashboardLayout` now passes a small serializable shell copy instead of the
  full settings dictionary.
- Added global and dashboard error boundaries so future runtime errors render a
  controlled reload state instead of the generic crash screen.
- Added a unit guard to prevent full function-valued Settings copy from being
  passed back into the client shell.
- Added `pnpm smoke:dashboard`, an authenticated synthetic smoke runner that
  creates a fake owner/workspace/lead, signs in through Supabase, sends SSR auth
  cookies, and checks the protected dashboard routes without printing secrets.

## Authenticated smoke

Created a synthetic local-env owner, business, quote setup, lead, and source
metadata. No real customer data was used and no keys/cookies were printed.

Checked authenticated routes:

- `/dashboard`
- `/dashboard/leads`
- `/dashboard/leads/[leadId]`
- `/dashboard/configuration`
- `/dashboard/business-profile`
- `/dashboard/quote-setup` legacy redirect to `/dashboard/configuration`
- `/dashboard/settings`

Result: `pnpm smoke:dashboard -- --base-url=http://localhost:3000` passed
7/7. All primary routes returned HTTP 200, `/dashboard/quote-setup` returned the
expected HTTP 307 redirect to `/dashboard/configuration`, and no route rendered
the generic crash page or internal error markers.

## Production deploy check

After pushing `f1703d5` to `main`, Vercel production reported Ready for:

- `dpl_8pnYf3mZgywrUu7UdFf7KdiMfAWK`
- `https://bizpilo.com`

Production public smoke passed 9/9 after that deployment.

`pnpm smoke:dashboard -- --base-url=https://bizpilo.com` could not complete
from this workstation because the synthetic Supabase session created from the
local environment was redirected to `/auth/sign-in` on production. No secrets
were read from Vercel or printed. A founder-authorized production browser
session, or a production-matched synthetic auth environment, is still needed to
record the authenticated production dashboard smoke.

## Source/contact feature note

The owner requested source attribution and premium customer contact-list
planning. The feature registry and standard now include:

- lead source analytics from `leads.source_channel` and
  `lead_source_metadata`,
- source categories such as website, Instagram, Facebook, Google, direct links,
  and UTM/campaign URLs,
- customer contact list by email/phone contact type for owner/main-admin
  visibility,
- premium/admin gating, guide requirements, and privacy/export cautions.

No `leads.source` column was added.
