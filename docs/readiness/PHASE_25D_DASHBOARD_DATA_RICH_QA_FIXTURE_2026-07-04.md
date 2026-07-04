# Phase 25D - Dashboard Data-Rich QA Fixture

Date: 2026-07-04
Repo: `E:\bizpilot-ai`
Branch: `main`

## Decision

Prepared dashboard/admin final QA by extending the authenticated dashboard
smoke with an opt-in synthetic fixture profile:

```text
pnpm smoke:dashboard -- --base-url=http://127.0.0.1:3030 --fixture-profile=dense
```

The default profile remains `basic` so routine smoke checks keep the previous
single-lead behavior. The new `dense` profile is for final dashboard review
only, after the Supabase target is confirmed local/synthetic-safe.

## What Changed

- Added `DashboardFixtureProfile` with `basic` and `dense` options.
- Added CLI/env resolution through `--fixture-profile=dense` or
  `BIZPILOT_DASHBOARD_SMOKE_FIXTURE_PROFILE=dense`.
- Refactored synthetic lead creation into a reusable helper that creates:
  - `intake_submissions`
  - `intake_submission_values`
  - `leads`
  - `lead_source_metadata`
- Added dense synthetic scenarios for:
  - Google Business Profile quote-link source with long customer/service text.
  - Website/contact-page lead.
  - Instagram follow-up due flow after copied reply.
  - Email-signature lead missing contact info.
  - Facebook/outside-service-area lead.
  - Saved-reply lead with booked/manual-outcome state.
- Added source guards to keep the dense profile, source variety, and
  production-prohibited safety markers in place.

## Safety Boundary

This work does not approve real customer data, paid pilot launch, production
mutations, booking, invoices, SMS/WhatsApp, autonomous AI, or auto-send
behavior.

`smoke:dashboard` still creates auth users, businesses, submissions, leads, and
source metadata. It must not run against production or managed/non-local
Supabase unless a separate owner-approved synthetic preview target is explicitly
recorded. In the current finalization workflow, the command is intended for a
confirmed local Supabase target only.

The existing production guard remains in place for:

- `VERCEL_ENV=production`
- `NEXT_PUBLIC_APP_URL` containing `bizpilo.com`
- canonical production Supabase project id `qfqendrqimqvkoojpjao`
- smoke base URL containing `bizpilo.com`

## Backlog Items Advanced

```text
48 done
49 prepared
51 prepared
54 prepared
59 prepared
62 prepared
63 prepared
66 prepared
67 prepared
74 preserved
```

## How To Use For Final Dashboard QA

1. Confirm the app is running locally.
2. Confirm `NEXT_PUBLIC_SUPABASE_URL` points to a local/synthetic Supabase
   environment, not production and not the canonical managed production DB.
3. Run:

```text
pnpm smoke:dashboard -- --base-url=http://127.0.0.1:3030 --fixture-profile=dense
```

4. Use the generated workspace/lead output to inspect:
   - `/dashboard`
   - `/dashboard/leads`
   - `/dashboard/leads/[leadId]`
   - `/dashboard/business-profile`
   - `/dashboard/configuration`
   - `/dashboard/settings`
   - `/admin` only when founder/admin access and local synthetic data are
     intentionally configured.

## Verification

```text
git diff --check PASS
pnpm test:unit PASS
pnpm lint PASS
pnpm typecheck PASS
pnpm build PASS
pnpm smoke:dashboard -- --base-url=http://127.0.0.1:3030 --fixture-profile=dense SKIPPED
```

Dashboard smoke was intentionally not run because the current
`NEXT_PUBLIC_SUPABASE_URL` classification is canonical production blocked:
`qfqendrqimqvkoojpjao.supabase.co`. The dense fixture is ready, but it must only
be executed after the Supabase target is confirmed local/synthetic-safe.
