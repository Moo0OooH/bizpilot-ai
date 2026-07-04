# Phase 25B - Intake Attribution Source URL

Date: 2026-07-04
Repo: `E:\bizpilot-ai`
Branch: `main`
Scope: intake attribution slice from
`docs/readiness/PHASE_25_SITE_DASHBOARD_GROWTH_BACKLOG_2026-07-04.md`

## Summary

Phase 25B fixes the public quote attribution gap found in the Phase 25 audit:

- Added `lib/quote-attribution.ts` as the safe source/UTM allowlist helper.
- Filled the quote form `sourceUrl` hidden field with a generated public quote
  URL instead of submitting an empty value.
- Preserved `source`, `ref`, `utm_source`, `utm_medium`, and `utm_campaign`
  when visitors switch quote-page language.
- Kept arbitrary query parameters out of lead source metadata, including
  customer email, phone, message, and redirect fields.
- Added regression tests for approved attribution parameters, blocked customer
  query data, language switching, unsupported languages, control characters,
  and max attribution length.

## Product Truth Preserved

This slice did not add:

- customer-facing automation,
- auto-send,
- booking or price confirmation,
- SMS/WhatsApp,
- payment/invoice automation,
- full CRM behavior,
- real customer data approval,
- paid pilot approval,
- production database changes.

## Backlog Items Advanced

| Item | Status |
|---:|---|
| 68 | Done - quote `sourceUrl` is now captured safely and documented. |
| 69 | Done - source/UTM regression tests cover capture and language switching. |
| 73 | Unchanged - quote success copy remains a later intake polish item. |
| 74 | Preserved - no booking/price confirmation copy was introduced. |

## Verification

Passed:

```text
pnpm test:unit
pnpm typecheck
pnpm build
pnpm verify
pnpm smoke:quote -- --base-url=http://127.0.0.1:3030 --inactive-slug=phase1-unavailable-synthetic
```

Notes:

- Quote smoke used only the inactive/unavailable synthetic slug and a local
  `next start` server on `127.0.0.1:3030`.
- No dashboard smoke was run because this slice did not touch protected
  dashboard behavior and dashboard smoke requires confirmed local/synthetic
  Supabase data.

## Next Recommended Slice

Proceed to Phase 25C:

1. Add the practical quote-link placement guide for website, Google Business
   Profile, Instagram, saved replies, and email signatures.
2. Prepare local seeded data-rich dashboard/admin QA states.
3. Re-run dashboard/admin visual and route QA only against local/synthetic data.
