# Phase 25A - SEO, Comparison, and Structured Data Foundation

Date: 2026-07-04
Repo: `E:\bizpilot-ai`
Branch: `main`
Scope: first implementation slice from
`docs/readiness/PHASE_25_SITE_DASHBOARD_GROWTH_BACKLOG_2026-07-04.md`

## Summary

Phase 25A completed the first public-site SEO and buyer-education slice:

- Added a canonical `/comparison` route for honest buyer education.
- Added EN/fr-CA comparison copy to the central public-site dictionary.
- Added `/comparison` to desktop/compact navigation, footer, proxy language
  handling, sitemap, canonical metadata, hreflang, smokes, and UI matrix.
- Removed roadmap-only `/content-studio` from canonical sitemap indexing by
  switching it to noindex metadata while keeping the route available.
- Refreshed sitemap `lastModified` to `2026-07-04`.
- Added Open Graph/Twitter large preview image metadata and generated
  `/opengraph-image`.
- Added JSON-LD helpers and emitted:
  - WebSite / Organization / SoftwareApplication / Service on the homepage,
  - FAQPage and BreadcrumbList on `/faq`,
  - BreadcrumbList on `/comparison`.
- Expanded FAQ with quote-link placement and booking-boundary questions.

## Product Truth Preserved

This slice did not add:

- auto-send,
- booking,
- invoice/payment automation,
- SMS/WhatsApp automation,
- full CRM claims,
- guaranteed revenue claims,
- real customer data approval,
- paid pilot approval,
- production database or RLS changes.

## Backlog Items Advanced

| Item | Status |
|---:|---|
| 13 | Done - sitemap freshness updated. |
| 15 | Done - OG/Twitter image route and metadata added. |
| 16 | Done - structured-data foundation added. |
| 17 | Done - FAQPage JSON-LD added. |
| 18 | Started - BreadcrumbList added for FAQ and comparison. |
| 19 | Done - roadmap-only Content Studio is noindex and removed from canonical sitemap. |
| 20 | Done - comparison route added. |
| 28 | Started - FAQ expanded for quote-link placement and booking boundary. |
| 30 | Done - canonical/hreflang guard updated for comparison route. |
| 32 | Started - sitemap date and canonical set updated; future priority tuning remains open. |
| 42 | Done - comparison content added without overclaiming. |

## Verification

Passed:

```text
pnpm verify
pnpm test:unit
pnpm typecheck
pnpm build
pnpm smoke:public -- --base-url=http://127.0.0.1:3030
pnpm smoke:responsive -- --base-url=http://127.0.0.1:3030
pnpm smoke:ui-matrix -- --base-url=http://127.0.0.1:3030 --timeout-ms=60000
```

Notes:

- `pnpm smoke:ui-matrix` first aborted when run in parallel with other smokes
  under the default timeout. It passed when rerun alone with a higher timeout.
- No dashboard smoke was run because this slice did not touch protected
  dashboard behavior and dashboard smoke must only run against confirmed
  local/synthetic Supabase targets.

## Next Recommended Slice

Proceed to Phase 25B:

1. Intake attribution: verify and fix `sourceUrl` plus UTM capture.
2. Add source/UTM regression tests.
3. Add a practical quote-link placement guide or section tied to Google
   Business Profile, website, Instagram, saved replies, and email signatures.
4. Prepare local seeded data-rich dashboard/admin QA for the first dashboard
   finalization pass.
