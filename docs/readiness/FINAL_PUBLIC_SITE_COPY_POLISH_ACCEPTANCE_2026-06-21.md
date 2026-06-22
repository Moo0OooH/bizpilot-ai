# Final Public Site Copy Polish Acceptance

Date: 2026-06-21

Status: F7F acceptance complete.

Dashboard D1 status: GO after this public-site polish gate. Do not start D1
without the next implementation prompt.

## Scope

This acceptance report covers the final public site copy, scroll, fr-CA,
Cleaning page, quote form, dark theme, and responsive layout checks for:

- `/`
- `/features`
- `/industries/cleaning`
- `/trust`
- `/demo`
- `/pricing`
- `/pilot`
- `/faq`
- `/content-studio`
- `/privacy`
- `/security`
- `/terms`
- public auth pages
- safe quote GET routes

No database schema, RLS, auth behavior, AI provider logic, payment/billing
implementation, production data flow, real customer data gate, pricing value, or
dashboard implementation changed in this phase set.

## Production Evidence

Latest accepted commit:

- `b9d910a fix(copy): polish final english and canadian french content`

Deployment:

- Vercel status: success
- Vercel deployment:
  `https://vercel.com/moo0ooohs-projects/bizpilot-ai/C7roe3YgHgZb9s7M5FbUyrjwUF12`
- Production base: `https://bizpilo.com`

Local verification before push:

- `pnpm verify`: pass
- `pnpm smoke:quote -- --base-url=http://127.0.0.1:3100 --active-slug=akora?language=en --fr-slug=akora?language=fr-CA --inactive-slug=phase1-unavailable-synthetic`: 3 passed, 0 failed
- `pnpm smoke:public -- --base-url=http://127.0.0.1:3100`: 10 passed, 0 failed
- `pnpm smoke:responsive -- --base-url=http://127.0.0.1:3100`: 19 routes, 0 failures
- `pnpm smoke:ui-matrix -- --base-url=http://127.0.0.1:3100 --en-quote-url=http://127.0.0.1:3100/quote/akora?language=en --fr-quote-url=http://127.0.0.1:3100/quote/akora?language=fr-CA`: 0 failures
- Browser visual audit against local production build: 58 explicit-language route and viewport checks, 0 failures
- `git diff --check`: pass

Production verification after deployment:

- `pnpm smoke:quote -- --base-url=https://bizpilo.com --active-slug=akora?language=en --fr-slug=akora?language=fr-CA --inactive-slug=phase1-unavailable-synthetic`: 3 passed, 0 failed
- `pnpm smoke:public -- --base-url=https://bizpilo.com`: 10 passed, 0 failed
- `pnpm smoke:responsive -- --base-url=https://bizpilo.com`: 19 routes, 0 failures
- `pnpm smoke:ui-matrix -- --base-url=https://bizpilo.com --en-quote-url=https://bizpilo.com/quote/akora?language=en --fr-quote-url=https://bizpilo.com/quote/akora?language=fr-CA`: 0 failures
- Production browser visual audit: 58 explicit-language route and viewport checks, 0 failures

The UI matrix covered light and dark themes, public/auth/quote routes,
metadata, canonical and hreflang links, sitemap, robots, internal links,
no-overflow checks, missing-copy checks, pseudolocale exclusion, quote noindex,
and hidden honeypot visibility checks.

## Acceptance Answers

1. Is homepage shorter?

Yes. The homepage now keeps a short mini FAQ and avoids repeating the full
workflow outside the demo.

2. Is full FAQ moved to `/faq`?

Yes. The full localized FAQ lives at `/faq`, and the footer links to it.

3. Is Cleaning page duplication removed?

Yes. The Cleaning page uses six compact service cards and a shared detail area
with desktop tabs and mobile accordion behavior. The previous repeated service
mega-card content was removed.

4. Is quote honeypot hidden?

Yes. The honeypot remains in the form as a hidden bot trap, is out of normal
visual flow, out of tab order, and hidden from assistive technology.

5. Is quote AI notice shown once?

Yes. The consent/manual-review notice appears once. The separate duplicated AI
disclosure was removed.

6. Is English copy final?

Yes. Public English copy was polished to avoid internal labels, awkward
owner-reviewed wording, duplicated ideas, hype, and unsupported claims.

7. Is fr-CA copy natural and accented?

Yes. Public fr-CA copy uses Canadian French terminology, preserves accents, and
uses the official name `Commission d’accès à l’information du Québec`.

8. Are legal pages plain-language first?

Yes. Privacy and Security now lead with plain-language summaries and keep more
technical readiness details lower on the page.

9. Does Dark mode remain readable?

Yes. The final UI matrix passed light and dark theme checks across the required
viewport matrix, including mobile, tablet, desktop, and wide desktop sizes.

10. Is Dashboard D1 now GO or NO-GO?

GO. Public-site F7 acceptance passed on production. Dashboard D1 can start only
after the next explicit implementation prompt, and the existing real customer
data, payment, and production readiness gates still remain separate.

## Notes

- Product truth remains unchanged: BizPilot is a manual-first lead recovery
  system for cleaning businesses. AI drafts; the business decides. There is no
  auto-send, invented pricing, automatic booking confirmation, SMS/WhatsApp
  automation, or full CRM claim.
- Production checks used safe GET-only quote routes and did not create real
  quote submissions.
