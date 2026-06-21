# BizPilot Final Bilingual Copy And UX Spec v1.0

Date: 2026-06-21
Status: Active F0 final bilingual public copy and UX contract.
Scope: Public marketing routes, auth shells, quote shells, safe report shells,
metadata, policy pages, and the tests that protect these surfaces.

## Purpose

This document installs the F0 copy-and-UX contract for the final public
bilingual acceptance sequence. It is a documentation-only contract: it does not
change production-visible copy, component layout, data behavior, auth, RLS,
database schema, AI provider behavior, billing/payment behavior, or production
data flows.

The contract consolidates the current public copy matrix, Canadian-French
terminology standard, multilingual responsive UI standard, final public-site
standard, and typed dictionary implementation. If a later implementation phase
finds a mismatch, the fix must preserve the product truth below and update the
typed dictionary/tests rather than adding one-off visible strings in routes.

## Product Truth

BizPilot AI is manual-first, cleaning-first, owner-controlled lead recovery for
cleaning businesses.

Approved loop:

```text
Public quote intake -> lead organization -> AI summary/draft -> owner review -> manual copy/send
```

Required boundaries:

- No auto-send.
- No SMS or WhatsApp automation.
- No automatic booking confirmation.
- No invented pricing or availability.
- No invoicing or billing automation.
- No full CRM positioning.
- No guaranteed revenue.
- No active multi-industry support.
- No real customer data before explicit owner approval.
- No paid pilot launch before the separate owner-approved gates close.

## Source-Of-Truth Files

| Source | Role |
| --- | --- |
| `docs/content/BIZPILOT_PUBLIC_COPY_MATRIX_v1.0.md` | Stable message IDs, route ownership, component roles, canonical English source, approved fr-CA intent, prohibited claims, target lengths, line budgets, wrap policy, and accessibility/full-label meaning. |
| `docs/content/BIZPILOT_FR_CA_TERMINOLOGY_v1.0.md` | Approved Canadian-French terminology, forbidden literal/hybrid terms, official-name rules, style rules, and compact-copy accessibility meaning. |
| `docs/product/BIZPILOT_MULTILINGUAL_RESPONSIVE_UI_STANDARD_v1.0.md` | EN/fr-CA sizing parity, CTA anchoring, card-deck alignment, theme contrast, and pseudolocale-safe visual behavior. |
| `docs/product/BIZPILOT_FINAL_PUBLIC_SITE_STANDARD_v1.0.md` | Final public-site UX, route responsibility, theme, shell, and readiness standard. |
| `docs/operations/BIZPILOT_FINAL_EXECUTION_AND_VALIDATION_PRIORITY_STANDARD_v1.0.md` | Execution priority and validation discipline. |
| `docs/readiness/FINAL_BILINGUAL_CONTENT_AND_LAYOUT_ACCEPTANCE.md` | Previous production-verified public bilingual evidence and known acceptance baseline. |
| `docs/readiness/FINAL_PUBLIC_SITE_ACCEPTANCE_2026-06-21.md` | Previous final public-site P0-P5 acceptance evidence. |

This F0 run is intentionally narrower than dashboard D1. Dashboard D1 may start
only after the requested F0-F6 public copy/UX acceptance sequence is finished or
the owner explicitly redirects the work.

## Typed Dictionary Contract

Public visible copy must be sourced from the typed dictionaries below unless a
listed exception applies.

| Dictionary | Current ownership |
| --- | --- |
| `lib/i18n/public-site-copy.ts` | Final public marketing routes, route metadata, auth metadata, quote shell labels, and pricing/pilot/content-studio route copy. |
| `lib/i18n/home-copy.ts` | Public marketing navigation, footer, language labels, and shared public shell labels. |
| `lib/i18n/policy-copy.ts` | Privacy, security, and terms visible copy and metadata. |
| `lib/i18n/bizpilot-copy.ts` | Auth form copy, quote form copy, quote success/unavailable copy, dashboard copy, default quote fields, consent copy, and safe intake messages. |
| `lib/i18n/pricing-copy.ts` | Historical pricing/FAQ dictionary that must remain shape-synced while active tests still cover it. |
| `lib/i18n/language.ts` | Supported production languages and language resolution. |

Every supported production language must keep the same dictionary shape as the
English source language. Added copy must preserve the same keys, arrays,
function arity, placeholders, product names, prices, and protected tokens across
English and fr-CA.

## Matrix Row Requirements

Every user-facing message in the public/auth/quote/report scope must be
traceable to a stable matrix row or to an explicitly documented allowed
exception. Matrix rows must carry:

- stable ID,
- route or route family,
- component role,
- canonical English source,
- approved fr-CA target or intent,
- prohibited claims,
- target length,
- line budget,
- wrap policy,
- accessibility/full-label meaning for compact visible copy.

The active matrix is `docs/content/BIZPILOT_PUBLIC_COPY_MATRIX_v1.0.md`. Do not
fork a second competing table in implementation phases; update the active
matrix when new approved copy is needed.

## Route Coverage

The contract covers:

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
- `/auth/reset-password`
- `/auth/check-email`
- `/quote/[slug]`
- `/quote/[slug]/success`
- inactive quote/unavailable shells
- report shells if present
- public metadata for these routes

## Hardcoded Public String Audit

F0 audit date: 2026-06-21.
Baseline commit: `21b9e9782d87f0cc534d0c08c6bc285f9d2f213f`
(`fix(home): tighten hero first fold layout`).

Observed state:

- Final marketing routes read route copy from `getPublicSiteCopy(...)` and
  shared shell copy from `getHomeCopy(...)`.
- Policy routes read visible copy and metadata from `getPolicyCopy(...)`.
- Auth routes read metadata from `getPublicSiteCopy(...).authMeta` and form
  copy from `getBizPilotCopy(...).auth`.
- The active quote shell reads visible shell copy from
  `getPublicSiteCopy(...).quoteShell`.
- The quote form wizard reads labels, guardrails, consent, errors, options, and
  default field copy from `getBizPilotCopy(...)`.

Allowed or known non-dictionary sources that do not require visible F0 changes:

- `components/public/marketing-ui.tsx` contains `defaultMarketingNavCopy` as a
  fallback/default shell copy object and renders the stable brand name
  `BizPilot AI`.
- `app/layout.tsx` contains global default metadata fallbacks.
- `app/(public)/quote/[slug]/page.tsx` and
  `app/(public)/quote/[slug]/success/page.tsx` contain static metadata
  fallbacks while visible quote shell/success copy remains dictionary-backed.
- `components/public/interactive-cleaning-demo.tsx` contains localized internal
  demo copy for that component. It must not be used to bypass the final public
  route dictionary contract in later phases.
- `components/public/policy-page.tsx` has a defensive `References` fallback.
- Form placeholders such as `you@example.com`, product/brand names, route
  paths, test fixtures, and smoke-test expected strings are acceptable when
  they do not replace visible approved copy.
- Dashboard/admin strings are outside the F0 public acceptance scope unless a
  later phase explicitly includes them.

No F0 code cleanup is authorized by this audit. Later phases may centralize
allowed fallbacks only when that work is required by the phase and covered by
tests.

## UX And Layout Copy Rules

- Visible text may wrap only where the matrix allows wrapping.
- CTA labels and status badges must stay stable in EN and fr-CA at supported
  mobile, tablet, desktop, and wide-desktop viewports.
- French copy must not be solved with language-specific font shrinking,
  clipping, hidden overflow, essential ellipsis, or fragile fixed heights.
- Cards in repeated decks must keep consistent action alignment and stable
  measurement hooks.
- Theme changes must not reduce contrast or hide copy in Light, Dark, or system
  preference modes.
- Compact labels must keep full meaning through nearby context or accessible
  labels.

## Quote-Shell Rules

- Consent copy appears once per quote request flow.
- Honeypot fields stay hidden from normal users and do not create visible UX
  noise.
- Quote submission copy must never imply a booking, price, availability, or
  automated reply.
- Success copy confirms request submission only; it must not confirm a booked
  service.
- Unavailable quote routes must fail safely and clearly.

## F1 Quote Contact Field Audit

The current quote-field dictionary and schema adapters support both a legacy
generic contact field and split contact fields:

- `customer_contact`
- `customer_email`
- `customer_phone`

This can be contradictory if a future owner/template renders the generic
contact field together with both split email and phone fields. F1 does not
change schema, stored field keys, RLS, form submission behavior, or owner
configuration. The approved F1 posture is:

- keep all three keys supported for backwards compatibility;
- keep the generic field label as "Customer contact" and the split fields as
  "Email address" and "Phone number";
- avoid introducing a new default visible form that asks for both the generic
  contact field and both split fields at the same time;
- resolve any template migration or schema simplification only in a later
  owner-approved data/schema phase.

## Test And Verification Contract

F0 must pass:

- `pnpm lint`
- `pnpm typecheck`
- `pnpm test:unit`
- `pnpm build`
- `git diff --check`

Existing tests already enforce the key copy contract:

- `tests/unit/i18n-copy.test.mts` checks dictionary shape parity, fr-CA
  terminology, route dictionary wiring, accent quality, public claim
  boundaries, and source-level copy regressions.
- `tests/unit/public-pseudolocale-visual-contract.test.mts` keeps the
  pseudolocale test-only and checks expansion/visual measurement hooks.
- `tests/unit/public-visual-stability-source.test.mts` protects public layout,
  grid, card, theme, and multilingual visual stability source contracts.
- `tests/smoke/final-ui-matrix-smoke.mts` is the browser-level matrix for
  supported language, theme, and viewport visual acceptance.

Each later phase must add or update tests before claiming closure when visible
copy, localization, layout, theme, or route behavior changes.

## F0 Closeout Requirement

The F0 commit must be documentation-only and use:

```text
docs(content): install final bilingual copy contract
```

After verification and visual review, push the commit before starting F1.
