# BizPilot Website V3 — Final Production Acceptance

Local date: 2026-07-14

Production: <https://bizpilo.com>

Release pull request: [#3 — Website V3: rebuild the public conversion experience](https://github.com/Moo0OooH/bizpilot-ai/pull/3)

Release merge SHA: `7d262812efd0c06e6af01fb3bd640a193a5bc19e`

## Verdict

**WEBSITE V3: PRODUCTION ACCEPTED**

The bilingual Website V3 is live from the reviewed and squash-merged `main`
commit. Vercel reports the production deployment as Ready and Promoted, the
custom domain serves it over valid HTTPS, the deployed Git source matches the
full release merge SHA, and the required read-only production acceptance is
green.

This verdict accepts the public Website V3 only. It does not authorize real
customer data, a paid pilot, production database changes, RLS changes,
auto-send, booking, payments, or any unsupported product expansion.

## Release and deployment identity

| Evidence | Accepted value |
| --- | --- |
| Pull request | `#3`, reviewed, mergeable, green, squash-merged |
| PR CI | GitHub Actions run [`29310167481`](https://github.com/Moo0OooH/bizpilot-ai/actions/runs/29310167481), pass |
| Main CI | GitHub Actions run [`29310282305`](https://github.com/Moo0OooH/bizpilot-ai/actions/runs/29310282305), pass in 56 seconds |
| Release merge SHA | `7d262812efd0c06e6af01fb3bd640a193a5bc19e` |
| Vercel deployment ID | `dpl_EmhJwMSRsomrZGXxXhT5hLu136Bg` |
| Deployment URL | <https://bizpilot-jsmmmb7he-moo0ooohs-projects.vercel.app> |
| Production alias | <https://bizpilo.com> |
| Vercel state | `READY`, `PROMOTED`, production target |
| Vercel Git source | `main` at `7d262812efd0c06e6af01fb3bd640a193a5bc19e` |
| HTTPS | HTTP 200, certificate verification result `0`, HSTS enabled |

The Vercel deployment API returned the full Git source SHA above. Build logs
also record `Branch: main, Commit: 7d26281`, Next.js `16.2.4`, a successful
production compilation, completed TypeScript validation, 23 generated static
pages, and a completed deployment. Runtime error and warning queries for the
acceptance window returned no logs.

## Production interaction acceptance

The live site was exercised in the in-app browser through visible controls,
not by changing locale state directly.

| Check | Result |
| --- | --- |
| Home EN | English H1, `html lang="en"`, English selected, 0px overflow |
| EN → fr-CA | Language menu click changed visible copy, URL, selected control, title, and `html lang="fr-CA"` |
| French route persistence | Product, Demo, Pricing, Pilot, FAQ, and Trust retained `?language=fr-CA` and French H1 copy |
| Reload persistence | Trust reloaded in fr-CA with the same URL, H1, and document language |
| fr-CA → EN | Reverse menu click restored English URL, title, H1, and document language |
| Mobile navigation | 390×844 open/close behavior passed; controls remained available without horizontal overflow |
| Theme | Theme menu selected Dark; reload retained `data-theme="dark"`, dark color scheme, and 0px overflow |
| Demo | French Demo rendered the safe three-stage explanation without submission or invented outcomes |
| Pricing | French mobile pricing rendered the approved founder-pilot terms with 0px overflow |
| Auth and legal | Sign-in, sign-up, password, Privacy, Security, and Terms routes returned expected public responses; auth remained isolated/noindex in the UI matrix |
| Redirects | Five retired route families returned direct 308 redirects while preserving locale/campaign query state |
| Console/runtime | Zero application console or runtime errors in browser interaction smoke |

The browser smoke also passed 54 retained-page states, 20 homepage reflow
states at 320–1920px in both languages, keyboard skip/Demo/Pilot/menu behavior,
mobile menu containment from 64–661px, CTA behavior, reload, and reverse locale
switching.

## Production smoke matrix

| Command | Result |
| --- | --- |
| `pnpm smoke:public -- --base-url=https://bizpilo.com` | Pass: 34/34 route, language, and redirect checks |
| `pnpm smoke:responsive -- --base-url=https://bizpilo.com` | Pass: 20/20 canonical EN/fr-CA routes |
| `pnpm smoke:ui-matrix -- --base-url=https://bizpilo.com` | Pass: zero failures across locale, light/dark, metadata, canonical/hreflang, sitemap, robots, auth, and responsive contracts |
| `pnpm smoke:browser -- --base-url=https://bizpilo.com` | Pass: real locale clicks, navigation, reload, 54 route states, 20 reflow states, keyboard behavior, and zero runtime errors |
| `pnpm smoke:quote -- --base-url=https://bizpilo.com --inactive-slug=website-v3-production-acceptance-no-record-20260714` | Pass: 1/1 clearly nonexistent synthetic slug returned the unavailable state |

The inactive quote check issued a read-only GET against a deliberately
nonexistent slug. It did not discover, create, update, or submit a quote,
customer, workspace, or Supabase record.

## Production Lighthouse

Lighthouse 13.4.0 ran against the live custom domain with mobile emulation.

| Route state | Perf | A11y | BP | SEO | FCP | LCP | TBT | CLS | Transfer |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Home EN | 100 | 100 | 100 | 100 | 0.936s | 0.936s | 30ms | 0 | 206KiB |
| Home fr-CA | 99 | 100 | 100 | 100 | 1.048s | 1.828s | 45ms | 0 | 206KiB |
| Demo EN | 100 | 100 | 100 | 100 | 0.924s | 1.074s | 29ms | 0 | 203KiB |
| Pricing fr-CA | 100 | 100 | 100 | 100 | 0.918s | 1.368s | 88ms | 0 | 205KiB |

All four JSON reports are valid. Three Lighthouse CLI processes returned exit
1 only after writing their complete reports because Chrome Launcher could not
remove a Windows temporary directory (`EPERM`). The Home EN process exited 0.
This is the same documented Windows cleanup condition from Phase 7, not an
application, audit, or report failure.

Field LCP, CLS, and INP are not claimed because no approved project-owned RUM
dataset is available. The values above are lab evidence.

## Required visual evidence

Ignored local evidence is stored under
`artifacts/rebuild-v3/phase8/screenshots/`:

- `home-en-desktop.png`
- `home-fr-desktop.png`
- `home-en-mobile.png`
- `home-fr-mobile.png`
- `language-menu-open.png`
- `demo-desktop.png`
- `pricing-mobile.png`
- `dark-mode-hero.png`

The images were visually reviewed after capture. They show the accepted hero
hierarchy, concise first viewport, bilingual copy, contained mobile layout,
Demo, Pricing, language menu, and settled dark theme. Lighthouse JSON evidence
is stored under the ignored
`artifacts/rebuild-v3/phase8/lighthouse-production/` directory.

## Safety and repository hygiene

- Acceptance used only GET/navigation, language, theme, menu, keyboard, and
  synthetic unavailable-route checks.
- No form was submitted and no real quote, customer, workspace, or pilot
  record was opened.
- No Supabase mutation, migration, RLS action, access change, destructive
  cleanup, or production deletion was performed.
- The release branch passed the source-header audit, secret/path scan, and
  `git diff --check` before merge.
- `.env.example` remains the only tracked environment-named file and contains
  blank keys/local placeholders rather than credentials.
- Screenshots, Lighthouse reports, browser artifacts, dumps, archives, and
  production data are not tracked.

## Accepted scope and continuing gates

Website V3 accurately presents the current manual-first workflow:

1. A service business shares one Smart Intake Link where customers already
   contact it.
2. The link gathers the service details needed for a useful response.
3. BizPilot organizes the request and makes missing details visible.
4. AI assists with a draft; a person reviews, edits, copies, and sends it
   through the real channel.

Direct social inbox ingestion, automatic sending, invented pricing, confirmed
booking, payments, full CRM behavior, real customer data, and paid-pilot
authorization remain outside this acceptance.

**WEBSITE V3: PRODUCTION ACCEPTED**
