# Phase 25C - Quote-Link Placement Guide

Date: 2026-07-04
Repo: `E:\bizpilot-ai`
Branch: `main`
Scope: local-GTM guide slice from
`docs/readiness/PHASE_25_SITE_DASHBOARD_GROWTH_BACKLOG_2026-07-04.md`

## Summary

Phase 25C adds a practical public guide for placing a BizPilot cleaning quote
link where warm leads already ask for pricing or availability:

- Added canonical `/quote-link-guide`.
- Added EN/fr-CA guide copy to the public-site dictionary.
- Added the guide to sitemap/canonical metadata, language cookie handling,
  footer discovery, public smoke coverage, UI matrix coverage, and SEO source
  contracts.
- Included tracked link examples for website, Google Business Profile,
  Instagram bio, saved replies/DMs, and email signatures.
- Kept the product boundary explicit: quote request only, not booking, pricing,
  payment, scheduling, SMS/WhatsApp, auto-send, or autonomous AI.

## Source-Backed Decisions

External sources checked on 2026-07-04:

- Google Business Profile business links policies:
  https://support.google.com/business/answer/13769188?hl=en
- Google Business Profile representation guidelines:
  https://support.google.com/business/answer/3038177?hl=en
- Instagram profile link help:
  https://help.instagram.com/362497417173378
- Instagram professional inbox saved replies:
  https://help.instagram.com/1264898753662278

Decisions applied:

- Do not tell owners to present a quote request as a confirmed booking.
- Prefer website/contact placement when a platform action label does not match
  the action completed by the BizPilot page.
- Keep Google Business Profile links dedicated, crawlable, HTTPS, and free from
  link shorteners.
- Keep UTM/source tags about placement only; never include customer personal
  data, message text, names, emails, or phone numbers.

## Backlog Items Advanced

| Item | Status |
|---:|---|
| 34 | Done - public quote-link placement guide added. |
| 38 | Started - practical guide/lead-magnet style content exists. |
| 41 | Done - GBP, Instagram, website, saved reply, and email signature placement content added. |
| 68 | Reinforced - guide uses the source tags captured in Phase 25B. |
| 69 | Reinforced - guide examples align with source/UTM regression coverage. |
| 74 | Preserved - no booking, price, or availability confirmation copy added. |

## Verification

Passed:

```text
pnpm test:unit
pnpm typecheck
pnpm build
pnpm verify
pnpm smoke:public -- --base-url=http://127.0.0.1:3030
pnpm smoke:responsive -- --base-url=http://127.0.0.1:3030
pnpm smoke:ui-matrix -- --base-url=http://127.0.0.1:3030 --timeout-ms=60000
```

Notes:

- Local smoke used `next start` on `127.0.0.1:3030`.
- No dashboard smoke was run because no protected dashboard behavior changed
  and dashboard smoke requires confirmed local/synthetic Supabase data.

## Next Recommended Slice

Proceed to Phase 25D:

1. Prepare local seeded data-rich dashboard/admin QA states.
2. Re-test owner/admin routes with long names, dense leads, empty states,
   EN/fr-CA, light/dark, desktop/mobile.
3. Only after data-rich QA, decide whether dashboard source attribution needs
   owner-facing UI polish.
