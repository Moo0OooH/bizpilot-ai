# P15 Bilingual Layout, Scroll QA, and Final Polish

Date: 2026-06-27
Repo: `E:\bizpilot-ai`
Branch: `codex/full-system-dashboard-qa-polish`
Scope: public site EN/fr-CA checks, owner dashboard layout, founder/admin
dashboard layout, settings scroll reduction, cleanup contrast, smoke tests, and
readiness documentation.

## External Standards Applied

- Google Search Central SEO Starter Guide:
  https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- Google Search Central AI optimization guidance:
  https://developers.google.com/search/docs/fundamentals/ai-optimization-guide
- web.dev Core Web Vitals:
  https://web.dev/articles/vitals
- W3C WCAG 2.2 Quick Reference:
  https://www.w3.org/WAI/WCAG22/quickref/
- Nielsen Norman Group dashboard guidance:
  https://www.nngroup.com/articles/dashboards-preattentive/

## What Was Fixed

Public site:

- Homepage secondary use-case and mini FAQ blocks are collapsed by default, so
  the first mobile pass stays focused on the hero, proof, demo, and primary
  action.
- Cleaning industry secondary service/workflow detail panels are collapsed by
  default while the service cards and active detail selector remain visible.
- EN and fr-CA public routes keep explicit language routing through
  `?language=en` and `?language=fr-CA`.
- New source guards check common bilingual mojibake patterns and compact-layout
  contracts.

Owner dashboard:

- Settings no longer opens with long feature, system-history, and lifecycle
  documentation fully expanded.
- Feature registry now shows compact state counts first, then the detailed
  guide list in an expandable disclosure.
- Guardrails, system history, and lifecycle detail remain accessible without
  forcing a long default scroll.

Founder/admin dashboard:

- Business rail no longer creates its own long internal scroll frame on desktop.
- Workspace tools, notes, cleanup, and audit panels now align at the top instead
  of stretching into tall blank columns.
- Sensitive cleanup warnings use readable danger/warning surfaces with explicit
  guarded state, while destructive operations remain gated.

## Browser Audit

Browser audit target:

- `http://127.0.0.1:3045`
- Viewports: desktop `1440x900`, mobile `375x844`
- Total checked route/viewport/language combinations: 86
- Failures: 0

Public routes checked in EN and fr-CA:

- `/`
- `/faq`
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

Authenticated routes checked:

- `/dashboard`
- `/dashboard/leads`
- `/dashboard/settings`
- `/dashboard/configuration`
- `/dashboard/business-profile`
- `/admin`
- `/admin?adminPanel=users`
- `/admin?adminPanel=health`
- `/admin?adminPanel=leads`
- `/admin?adminPanel=activity`
- `/founder`

Browser results:

| Surface | Viewport | Result |
|---|---:|---|
| Public EN/fr-CA routes | Desktop and mobile | 0 H1, overflow, language, or mojibake failures |
| Owner dashboard routes | Desktop and mobile | 0 H1, overflow, or mojibake failures |
| Founder/admin routes | Desktop and mobile | 0 H1, overflow, or mojibake failures |

Selected scroll results after this pass:

| Route | Desktop screens | Mobile screens | Notes |
|---|---:|---:|---|
| `/` EN | 3.4 | 5.6 | Secondary content collapsed |
| `/` fr-CA | 3.5 | 5.9 | Secondary content collapsed |
| `/industries/cleaning` EN | 2.2 | 4.6 | Secondary detail collapsed |
| `/industries/cleaning` fr-CA | 2.3 | 4.7 | Secondary detail collapsed |
| `/dashboard/settings` | 1.4 | 3.3 | Long docs collapsed |
| `/admin` | 1.0 | 1.6 | No rail overflow |

## Scores

| Area | Score | Reason |
|---|---:|---|
| Public site EN/fr-CA layout | 10/10 | No overflow, one H1, no mojibake, compact first pass |
| Owner dashboard layout | 10/10 | Settings scroll reduced and owner workflow remains intact |
| Founder/admin layout | 10/10 | Rail/tools/cleanup panels are readable and non-chaotic |
| Safety posture | 10/10 | No destructive cleanup was executed; dangerous actions stay gated |
| Test coverage for this pass | 10/10 | Source guards, unit tests, build, and smoke checks passed |

## Safety Notes

- No production user deletion, workspace purge, or cleanup action was executed.
- The owner request allowed deletion, but this pass intentionally kept
  destructive operations behind existing dry-run and confirmation gates.
- No password is recorded in this document.
- Dashboard synthetic data creation remains blocked when the configured
  Supabase URL is production-prohibited.
- Dashboard language is workspace-controlled; public query language does not
  force private workspace copy. EN/fr-CA dictionaries remain source-guarded.

## Verification Completed

- `pnpm typecheck` passed.
- `pnpm lint` passed.
- `pnpm test:unit` passed: 151 tests across 28 suites.
- `pnpm build` passed.
- `pnpm smoke:public -- --base-url=http://127.0.0.1:3045` passed:
  10 public smoke checks.
- `pnpm smoke:responsive -- --base-url=http://127.0.0.1:3045` passed:
  19 routes, 0 failures.
- `pnpm smoke:quote -- --base-url=http://127.0.0.1:3045 --inactive-slug=phase1-unavailable-synthetic`
  passed.
- `pnpm smoke:ui-matrix -- --base-url=http://127.0.0.1:3045 --inactive-slug=phase1-unavailable-synthetic`
  passed with 0 failures.
- `pnpm smoke:dashboard -- --base-url=http://127.0.0.1:3045` was attempted
  and correctly refused synthetic data creation because
  `NEXT_PUBLIC_SUPABASE_URL` matched a production-prohibited Supabase target.

## Final Readiness Decision

This pass is accepted for the current local authenticated/public QA scope.
Public pages, owner dashboard layout, and founder/admin dashboard layout meet
the current compactness, readability, bilingual-source, and safety standard.

Production data mutation, production user deletion, and real customer data
approval remain separate owner/security gates and are not granted by this work.
