# P8 Public Site Clarity Final Report

Date: 2026-06-26
Repo: `E:\bizpilot-ai`
Branch: `main`
Original review branch: `review/public-site-clarity-and-breathing-room`
Original review commit: `8848259 feat(home): add chaos-to-clarity hero`
Main public-site commit: `6e7cfc3 feat(home): add chaos-to-clarity hero`
D1 main sync commit after this P8 commit: `654a645 fix(dashboard): stabilize d1 owner lead workflow`

## 1. Final Decision

Decision: P8 visually accepted for the public homepage chaos-to-clarity hero scope.

This acceptance covers:

- Public homepage hero UI and copy only.
- Broader quote-request pain headline while still saying BizPilot starts with cleaning.
- Left-to-right desktop story: chaos, BizPilot, clarity.
- Mobile simplified story: reduced chaos cards, compact BizPilot card, one lead card, and one draft snippet.
- EN and fr-CA copy parity.
- Light/dark coverage through the final UI matrix smoke.
- Manual-first and owner-review product boundaries.

This does not approve:

- Real customer data.
- Paid pilot.
- Auto-send.
- Booking confirmation.
- Invented pricing.
- Invoicing or payment automation.
- SMS/WhatsApp automation.
- Full CRM scope.
- Database schema, migrations, RLS, auth, AI provider, billing, payment, dashboard D1, or production data-flow changes.

Current safe statement:

```text
P8 public homepage code/test/visual ready and pushed to main.
D1 dashboard code/test/visual ready on local synthetic data and applied to main.
Real data and paid pilot remain blocked.
```

## 2. Files Changed

P8 source and test files:

```text
app/globals.css
app/page.tsx
lib/i18n/public-site-copy.ts
tests/smoke/public-responsive-smoke.mts
tests/smoke/public-route-smoke.mts
tests/unit/i18n-copy.test.mts
tests/unit/public-visual-stability-source.test.mts
```

P8 report files:

```text
docs/P8_PUBLIC_SITE_CLARITY_AUDIT_2026-06-26.md
docs/P8_PUBLIC_SITE_CLARITY_FINAL_REPORT_2026-06-26.md
```

## 3. Implementation Summary

Hero copy now follows owner direction:

- Eyebrow: local service businesses, starting with cleaning.
- Headline: `Never lose a quote request in the chaos.`
- Subheadline names website, Google, Facebook, Instagram, texts, and missed calls.
- Bullets: capture every request, know what needs reply first, review/copy/send manually.
- Note: founder-led pilot, approval required, no auto-send.
- CTAs: `Join the pilot` and `See how it works`.

Hero visual now follows the chaos-to-clarity concept:

- Left: `THE CHAOS` / messages from everywhere.
- Maximum four desktop source cards: Website, Google, Facebook, Instagram/Text.
- Maximum four desktop short message cards.
- Middle: compact BizPilot card with Capture, Organize, Prioritize, Draft.
- Right: `THE CLARITY` / smart lead queue.
- Maximum two desktop lead cards.
- One draft preview labeled `Draft ready for owner review`.
- Visual button says `Review draft`.

Removed or avoided:

- No start-free-trial copy.
- No credit-card/cancel-anytime copy.
- No fake avatars.
- No fake star ratings.
- No trusted-by claim.
- No more-jobs-won claim.
- No full CRM claim in hero.
- No AI-agent/autonomous-send wording.
- No send icon.

## 4. Visual Review

Local browser review ran against `http://127.0.0.1:3028` on a production Next server using synthetic/local state only.

Desktop 1280x720:

```text
language: en
document scrollWidth == clientWidth
horizontal overflow list: []
hero height: 467
hero bottom: 543
visual width: 644
visual height: 432
sources visible: 4
messages visible: 4
actions visible: 4
leads visible: 2
draft visible: true
next section visible in first viewport: true
risky copy found: []
```

Mobile 390x844 EN:

```text
document scrollWidth == clientWidth
horizontal overflow list: []
sources visible: 2
messages visible: 0
actions visible: 4
leads visible: 1
draft visible: true
risky copy found: []
```

Mobile 390x844 fr-CA:

```text
document scrollWidth == clientWidth
horizontal overflow list: []
sources visible: 2
messages visible: 0
actions visible: 4
leads visible: 1
draft visible: true
risky copy found: []
```

The in-app browser session had a persisted dark preference during final DOM metrics; light and dark behavior were both covered by `smoke:ui-matrix`.

Visual decision:

```text
P8 visually accepted.
```

## 5. Verification Results

Full code verification:

| Command | Result | Notes |
|---|---:|---|
| `pnpm verify` | PASS | Lint, typecheck, 139 unit tests, and production build passed. |
| `pnpm lint` | PASS | Included in `pnpm verify`. |
| `pnpm typecheck` | PASS | Included in `pnpm verify`. |
| `pnpm test:unit` | PASS | 139/139 tests passed. |
| `pnpm build` | PASS | Included in `pnpm verify`. |

Runtime smokes on local production server:

| Command | Result | Notes |
|---|---:|---|
| `pnpm smoke:public -- --base-url=http://127.0.0.1:3028` | PASS | 10/10 passed. |
| `pnpm smoke:responsive -- --base-url=http://127.0.0.1:3028` | PASS | 19 routes checked, 0 failures. |
| `pnpm smoke:ui-matrix -- --base-url=http://127.0.0.1:3028` | PASS | Final UI matrix failures: 0; light/dark and EN/fr-CA covered; optional quote fixtures skipped. |
| `git diff --check` | PASS | Only line-ending warning noted below. |

Not run for P8:

- `pnpm smoke:dashboard`: dashboard D1 files were not touched.
- `pnpm smoke:quote` with active slug: quote routes and quote submit flow were not touched; UI matrix skipped optional quote fixtures.

## 6. Warning Triage

| Warning | Final status | Notes |
|---|---:|---|
| `tests/unit/i18n-copy.test.mts` CRLF warning | NON-BLOCKING | Git warned that CRLF will be replaced by LF next time the file is touched. This is line-ending hygiene, not a runtime/test failure. |
| Browser dark preference persisted | NON-BLOCKING | Final Browser DOM metrics were collected in dark mode; `smoke:ui-matrix` separately passed light and dark. |
| Optional quote fixtures skipped | EXPECTED | P8 did not change quote routes or quote submit logic. |
| Dashboard smoke not rerun for P8 | EXPECTED | P8 did not change dashboard files. |
| Shared real credentials in chat | OPEN SECURITY HYGIENE | Real credentials were not used. Rotate the password after the session. |
| Real data approval | BLOCKED | Not approved. |
| Paid pilot approval | BLOCKED | Not approved. |

## 7. Boundaries Confirmed

P8 did not touch:

```text
app/(dashboard)/**
components/dashboard/**
server/**
lib/supabase/**
supabase/migrations/**
tests/rls/**
app/auth/callback/route.ts
server/actions/auth.actions.ts
server/actions/public-intake.actions.ts
server/services/public-intake.service.ts
AI provider config or provider logic
billing/payment files
environment files and secrets
production data-flow files
real customer data handling
```

Public quote submit behavior was not changed.

## 8. Recommendation

P8 has been committed and pushed to `main`.

Recommended next sequence:

```text
1. Confirm the production deploy picks up main commit 6e7cfc3 or newer.
2. Hard-refresh the homepage after deploy/cache settles.
3. Keep real data blocked.
4. Keep paid pilot blocked.
5. Use the separate D1 report for dashboard status.
6. Run quote slug smoke and local DB/RLS proof before any real-data approval gate.
7. Use a separate owner approval gate before real data.
8. Use a separate ops/payment/support readiness gate before any limited paid pilot.
```

Final recommendation:

```text
P8 visually accepted.
D1 is visually accepted for local synthetic dashboard scope per docs/D1_FULL_PROJECT_REVIEW_AND_QA_REPORT_2026-06-26.md.
Real data and paid pilot remain blocked.
```
