# Final Public Site Copy Polish Audit

Date: 2026-06-21

Status: F7A audit complete. No runtime code changes in this phase.

Dashboard D1 remains blocked. This audit records the remaining public-site
copy, scroll, fr-CA, Cleaning page, and quote form polish gaps before any F7B+
implementation work.

## Scope

Audited public production routes in English and fr-CA where supported:

- `/`
- `/features`
- `/industries/cleaning`
- `/trust`
- `/demo`
- `/pricing`
- `/pilot`
- `/content-studio`
- `/privacy`
- `/security`
- `/terms`
- `/auth/sign-in`
- `/auth/sign-up`
- `/auth/forgot-password`
- `/quote/akora?language=fr-CA` safe GET only
- `/quote/phase1-unavailable-synthetic`
- `/faq` as the expected future full FAQ route

Evidence sources:

- Production HTML GET audit against `https://bizpilo.com` with explicit
  `?language=en` and `?language=fr-CA`.
- Production browser audit for layout/visibility checks.
- Source review of `app/page.tsx`, `app/industries/cleaning/page.tsx`,
  `components/public/marketing-ui.tsx`,
  `components/public/quote-form-wizard.tsx`,
  `lib/i18n/public-site-copy.ts`, `lib/i18n/bizpilot-copy.ts`, and
  `lib/i18n/policy-copy.ts`.

## Product Truth

BizPilot remains a manual-first lead recovery system for cleaning businesses.
AI drafts; the owner decides. The public site must not imply auto-send,
invented prices, automatic booking confirmation, SMS/WhatsApp automation, full
CRM scope, real customer data approval, or paid pilot approval.

## Current Passes

- Production public routes return 200 for the audited existing public,
  legal, auth, and safe quote shell routes.
- Explicit EN and fr-CA route requests resolve the expected document language
  on existing public routes.
- Root horizontal overflow was not observed in the browser audit.
- Nested marketing card scroll was not observed in the browser audit.
- The public quote form was checked with safe GET only; no real quote
  submission was created.
- Current browser visibility check did not show the `Company website` honeypot
  to normal visual users.
- The quote honeypot is out of tab order with `tabIndex=-1`.

## Findings

### F7B Homepage Scroll And FAQ

Severity: High for conversion polish.

Observed:

- Homepage currently renders 7 FAQ `<details>` items in both EN and fr-CA.
- `/faq?language=en` and `/faq?language=fr-CA` currently return 404.
- The footer has no `/faq` link.
- Homepage already has the right high-level order, but the FAQ block still
  carries full-page weight and contributes to scroll length.

Required next fix:

- Keep only 3 mini FAQ questions on the homepage.
- Create `/faq` with full FAQ sections.
- Add localized `/faq` metadata.
- Add a footer FAQ link.
- Keep homepage trust content concise instead of hiding it.

### F7C Cleaning Page Duplication

Severity: High for visual polish and scanability.

Observed in production HTML:

- English Cleaning page repeats each primary service title 3 times.
- fr-CA Cleaning page repeats each primary service title 3 times.
- `Small commercial cleaning` / `Petit nettoyage commercial` appears in the
  detail content even though the requested final surface is six compact service
  cards.
- The rendered page has 6 top compact service cards, but the shared detail area
  repeats grouped service cards again under Homes / Moves / Commercial.
- The detail area uses 3 desktop tabs and 3 mobile accordions, so the mechanism
  is present, but content remains too duplicative.

Required next fix:

- Keep exactly six compact services.
- Remove repeated service mini-cards inside the shared detail panels.
- Remove small-commercial from the public Cleaning page for this final scope.
- Make each detail panel focus on example request, details kept clear, and
  missing details BizPilot can help ask for.
- Keep desktop tabs and mobile accordion with no nested scroll.

### F7D Quote Form Honeypot And Notice

Severity: High for customer trust.

Observed:

- Source renders a honeypot label containing visible text in markup:
  `Company website`.
- Browser check shows that label is currently not visible to normal users and
  the input is `tabIndex=-1`.
- The honeypot does not carry `aria-hidden`.
- Production HTML text extraction still sees `Company website`, which makes the
  current implementation brittle and matches the owner-reported polish risk.
- fr-CA quote page shows the AI/manual-review notice twice:
  `BizPilot peut aider à préparer...` occurs 2 times.
- The duplicate comes from the consent notice text and the separate
  `aiDisclosure` text inside `ConsentBlock`.

Required next fix:

- Keep the honeypot only as a hidden bot trap.
- Hide it from visual users, tab order, and assistive tech where appropriate.
- Keep consent clear and show the AI/manual-review notice once.
- Use the approved final EN and fr-CA quote consent and no-confirmation copy.
- Do not change quote submission backend behavior.
- Do not submit real quote data in tests.

### F7E English And fr-CA Copy Polish

Severity: Medium-high for final professionalism.

Observed:

- Visible public route copy is broadly aligned with product truth.
- Homepage English/fr-CA hero copy matches the approved F7 target.
- Some source-level public copy still uses internal-feeling phrasing such as
  `manual-first path`, `owner review`, and repeated `draft` framing.
- Policy copy is accurate, but Privacy/Security top sections still feel more
  readiness/audit-oriented than customer plain-language in places.
- English policy reference titles use no-accent official French names in the
  English dictionary:
  `Commission d'acces a l'information`.
- fr-CA policy pages preserve accents in visible official names.
- Unused or dashboard-scoped dictionaries still contain no-accent French
  strings; these are outside this public F7 scope, but public tests should keep
  them from leaking into public pages.

Required next fix:

- Polish all public route copy for concise owner-facing wording.
- Keep fr-CA Canadian, accented, and intent-based.
- Replace English policy reference titles with official accented French names.
- Keep legal pages plain-language first with technical readiness notes lower.
- Do not broaden claims.

### F7F Layout, Dark Theme, And Acceptance

Severity: Final gate.

Observed:

- Existing production matrix had zero failures after F6.
- F7 copy changes will touch homepage, FAQ, Cleaning, quote form, and policy
  text, so all line-budget and theme checks must be rerun after implementation.

Required final checks:

- EN and fr-CA.
- Light and Dark.
- 320x568, 360x800, 390x844, 430x932, 768x1024, 1024x768, 1280x720,
  1366x768, 1440x900, 1920x1080.
- No horizontal overflow.
- No nested marketing card scroll.
- Hero CTA visible at 1280x720 and 1366x768.
- Badges/buttons fit.
- Cleaning six-card grid behaves as 3x2 desktop, 2x3 tablet, 1x6 mobile.
- Quote form honeypot hidden and AI notice shown once.
- Auth pages still clean.

## Phase Map

| Phase | Required Work |
| --- | --- |
| F7B | Shorten homepage FAQ, create full `/faq`, add footer FAQ link and metadata. |
| F7C | Remove Cleaning page duplicated service content and keep six compact services. |
| F7D | Harden quote honeypot and remove duplicated AI notice. |
| F7E | Polish EN/fr-CA copy, policy summaries, and official French names. |
| F7F | Run full local/production visual and smoke acceptance; decide Dashboard D1 gate. |

## F7A Decision

F7A audit result: PASS.

Implementation may proceed to F7B after this docs-only audit commit is pushed.

Dashboard D1 remains NO-GO until F7B-F7F are complete, production verified, and
the final F7 acceptance report marks it GO.
