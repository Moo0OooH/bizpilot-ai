# Phase 25K - Search Console and Core Web Vitals Baseline

Date: 2026-07-04
Repo: `E:\bizpilot-ai`
Branch: `main`

## Decision

Create a source-backed indexing and Core Web Vitals operating checklist for the
current public site, then capture a local Lighthouse lab baseline for the key
conversion routes.

This does not claim Search Console approval, Google indexing, field Core Web
Vitals, or ranking improvement. It records what is wired in the app and what the
owner must verify after deployment.

## Official Sources Checked

- Google Search Central, sitemap submission:
  `https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap`
- Google Search Central, robots.txt:
  `https://developers.google.com/search/docs/crawling-indexing/robots/intro`
- Google Search Central, mobile-first indexing:
  `https://developers.google.com/search/docs/crawling-indexing/mobile/mobile-sites-mobile-first-indexing`
- Google Search Central, Core Web Vitals:
  `https://developers.google.com/search/docs/appearance/core-web-vitals`
- Google PageSpeed Insights, Core Web Vitals assessment:
  `https://developers.google.com/speed/docs/insights/v5/about`
- Google Search Central documentation updates:
  `https://developers.google.com/search/updates`

## Current App SEO State

- `lib/seo.ts` owns canonical public route definitions, canonical URLs,
  `en-CA`/`fr-CA`/`x-default` hreflang alternates, Open Graph, and Twitter
  metadata.
- `app/sitemap.ts` emits 13 real public routes with localized alternates and
  `lastModified` set to `2026-07-04`.
- `app/robots.ts` exposes the sitemap and disallows `/admin`, `/auth`,
  `/dashboard`, `/founder`, and `/quote`.
- Auth routes, public quote intake routes, and roadmap-only Content Studio stay
  `noindex`.
- Final UI matrix smoke verifies route metadata, sitemap route count,
  localized alternates, robots private-path boundaries, and sitemap exclusion of
  auth/quote intake.

## Search Console Checklist

1. Verify the canonical domain property for `https://bizpilo.com`.
2. Submit `https://bizpilo.com/sitemap.xml` in the Search Console Sitemaps
   report.
3. Confirm Search Console can fetch the sitemap without parsing errors.
4. Use URL Inspection on:
   - `https://bizpilo.com/`
   - `https://bizpilo.com/comparison`
   - `https://bizpilo.com/quote-link-guide`
   - `https://bizpilo.com/pricing`
   - `https://bizpilo.com/pilot`
5. Confirm the indexed canonical URL matches the app canonical.
6. Confirm private and intake routes are not indexed:
   - `/auth/*`
   - `/dashboard/*`
   - `/founder/*`
   - `/quote/*`
7. Confirm `fr-CA` alternates are visible through hreflang inspection or rendered
   source checks.
8. Review Core Web Vitals and Page Experience reports after enough real traffic
   exists.

Google treats sitemap submission as a discovery hint, not an indexing
guarantee. `robots.txt` controls crawler access; it is not a noindex mechanism.

## Core Web Vitals Baseline

Official Google targets remain:

```text
LCP good: <= 2.5s
INP good: <= 200ms
CLS good: <= 0.1
Assessment basis: 75th percentile field data when available
```

Local Lighthouse 13.4.0 lab run:

```text
Base URL: http://127.0.0.1:3034
Mode: local Next dev server
Date: 2026-07-04
Chrome cleanup caveat: Lighthouse wrote JSON outputs, but Chrome temp cleanup returned EPERM after each run.
Stored local artifacts: .codex-screenshots/lighthouse-*-phase25k.json
```

| Route | Performance Score | Lab LCP | Lab CLS | Lab TBT |
| --- | ---: | ---: | ---: | ---: |
| `/` | 65 | 6505ms | 0.000 | 419ms |
| `/pricing` | 78 | 3986ms | 0.000 | 398ms |
| `/pilot` | 85 | 3017ms | 0.000 | 401ms |
| `/trust` | 90 | 2871ms | 0.000 | 269ms |

## Interpretation

- CLS is currently stable in the lab baseline for the measured routes.
- Lab LCP is above the good threshold on all four measured routes, with `/`
  being the highest-risk route.
- Lighthouse lab TBT is not the same as field INP. INP must be verified through
  Search Console, CrUX/PageSpeed field data, or a future RUM implementation
  after real traffic exists.
- The next performance slice should target public first-fold work on `/` before
  adding heavier public visuals.

## Product Boundary

This does not enable analytics tracking, paid acquisition, real customer data,
or production experiments. It creates an owner checklist and lab baseline for
public SEO/indexing/CWV follow-up.

## Backlog Items Advanced

```text
30 verified
31 verified
33 done
35 baseline captured with INP field-data caveat
76 prepared
77 prepared
79 prepared
90 preserved
```

## Verification

```text
npx --yes lighthouse@latest --version PASS - 13.4.0
Lighthouse local lab baseline PASS with Chrome cleanup caveat
git diff --check PASS
pnpm test:unit PASS
pnpm lint PASS
pnpm typecheck PASS
pnpm build PASS
```
