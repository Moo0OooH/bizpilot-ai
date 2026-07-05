# Phase 26H Dashboard Lead Queue Focus Command

Date: 2026-07-05
Repo: `E:\bizpilot-ai`
Branch: `main`
Baseline HEAD before this pass: `fa1b409835cb4246353e3ad4e6715bc1c63a0a95`

## Verdict

PASS WITH RISKS.

The owner lead queue now has a focus-aware command strip that explains the
current queue lane, the safest next manual action, and the first matching lead
to review. Source, type, unit, and production build validation pass. The
remaining risk is unchanged: authenticated owner visual smoke against a real or
approved owner session is still not closed in this pass.

## What Changed

- Added a route-level command strip to `/dashboard/leads`.
- Preserved URL-driven focus lanes:
  - `all`
  - `needs_reply`
  - `at_risk`
  - `missing_info`
  - `ai_ready`
  - `reviewed`
  - `won`
  - `lost`
- The command strip now:
  - shows the lane count,
  - names manual review as the safety boundary,
  - links to the first matching lead when one exists,
  - falls back to the full queue or quote setup when the lane is empty,
  - links to the owner operating guide as secondary support.
- Demoted the `/dashboard/leads` quote-page preview action from primary to
  secondary so the lead recovery action remains dominant.
- Added bilingual EN/fr-CA copy for every queue lane.
- Added source guards for the command strip, focus matching, priority selection,
  and secondary quote-page CTA posture.

## Product Boundary

- No production data was opened, created, updated, or deleted.
- No synthetic data was created on managed Supabase.
- No payment, booking, invoice, SMS/WhatsApp, auto-send, AI-provider,
  auth-flow, RLS, migration, billing, or real customer workflow was changed.
- The owner dashboard remains manual-first quote recovery only.

## Verification

Commands run:

```text
pnpm typecheck
PASS

pnpm test:unit -- --test-name-pattern "dashboard|language copy"
PASS - runner executed the unit suite; 211/211 tests passed

pnpm verify
PASS - lint, typecheck, unit tests, production build

git diff --check
PASS

pnpm check:dashboard-local
BLOCKED AS DESIGNED - NEXT_PUBLIC_SUPABASE_URL is managed/non-local

curl.exe -I --max-time 10 http://127.0.0.1:3044/dashboard/leads?focus=at_risk
PASS - 307 redirect to /auth/sign-in for logged-out protected access

curl.exe -I --max-time 10 http://127.0.0.1:3044/dashboard/guide
PASS - 307 redirect to /auth/sign-in for logged-out protected access

curl.exe -I --max-time 10 http://127.0.0.1:3044/auth/sign-in
PASS - 200
```

## Remaining Risks

- Owner-authenticated dashboard visual smoke is not proven in this pass.
- `pnpm check:dashboard-local` correctly blocks because `.env.local` points
  `NEXT_PUBLIC_SUPABASE_URL` at managed Supabase.
- Synthetic dashboard smoke must remain local-only.
- Production-ready dashboard final status still requires owner-approved
  authenticated access and production-safe visual smoke.

## Next Safe Dashboard Work

- Run owner-authenticated visual QA only after an owner-approved existing
  session or local synthetic target is available.
- Continue page-level dashboard polish in small slices:
  - lead detail manual workflow density,
  - quote setup readiness scanability,
  - business profile setup clarity,
  - admin users/businesses visual QA.
