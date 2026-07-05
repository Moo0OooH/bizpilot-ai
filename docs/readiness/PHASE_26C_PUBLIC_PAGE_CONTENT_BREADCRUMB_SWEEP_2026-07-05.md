# Phase 26C - Public Page Content Breadcrumb Sweep

Date: 2026-07-05
Branch: `main`
Scope: safe public website page-content and structured-data finalization after
Phase 26B owner-only cleanup.

## Purpose

Continue the requested page-by-page public website review without expanding
BizPilot beyond the approved manual-first, cleaning-first quote recovery
surface. This pass closes the optional breadcrumb polish item from Phase 25W
for deeper canonical public pages.

## Pages Updated

BreadcrumbList JSON-LD was added to:

- `/features`
- `/industries/cleaning`
- `/demo`
- `/pricing`
- `/pilot`
- `/trust`
- `/privacy`
- `/security`
- `/terms`

Existing BreadcrumbList coverage was preserved for:

- `/faq`
- `/comparison`
- `/quote-link-guide`
- `/faster-quote-replies`

The homepage remains the root WebSite/Organization/SoftwareApplication/Service
JSON-LD surface. `/content-studio` remains noindex and roadmap-only.
Public quote and auth routes remain noindex.

## Files Changed

- `app/features/page.tsx`
- `app/industries/cleaning/page.tsx`
- `app/demo/page.tsx`
- `app/pricing/page.tsx`
- `app/pilot/page.tsx`
- `app/trust/page.tsx`
- `components/public/policy-page.tsx`
- `tests/unit/seo-source.test.mts`

## Product And Gate Notes

- No customer data was opened.
- No Supabase data was read or mutated.
- No paid-pilot, booking, invoice, payment, SMS/WhatsApp, or auto-send claim was
  added.
- The change is SEO/content structure only: it helps crawlers understand deep
  public pages while preserving the existing visible copy.

## Validation

Targeted source guard:

```text
node --test tests/unit/seo-source.test.mts
PASS - 8/8 tests
```

Full validation:

```text
git diff --check
PASS

pnpm test:unit
PASS - 210/210 tests

pnpm lint
PASS

pnpm typecheck
PASS

pnpm build
PASS

pnpm smoke:public -- --base-url=http://127.0.0.1:3050 --timeout-ms=30000
PASS - 14/14 checks

pnpm smoke:responsive -- --base-url=http://127.0.0.1:3050
PASS - 25 routes, 0 failures

pnpm smoke:ui-matrix -- --base-url=http://127.0.0.1:3050 --timeout-ms=30000
PASS - final UI matrix failures 0
```

Startup caveat: `pnpm start -- -p 3050` failed because the argument was treated
as a project directory. `pnpm exec next start -p 3050` started the production
server successfully for smoke validation.

## Remaining Page-By-Page Queue

- Browser visual QA for the same public pages after local server start.
- Protected dashboard/admin keyboard/focus QA after confirmed local/synthetic
  Supabase remains available.
- Real customer data and paid pilot remain blocked until their explicit owner
  gates close.
