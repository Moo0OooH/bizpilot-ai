# Phase 25Q - Whole Project Re-Audit And Final Checklist

Date: 2026-07-04

## Current Snapshot

| Item | Current read |
|---|---|
| Branch | `main` tracking `origin/main` |
| Head checked | `51e9b29 feat(intake): finalize public quote readiness` |
| Untracked local output | `.codex-screenshots/` only; not staged |
| App stack | Next.js 16.2.4, React 19.2.4, pnpm 10.18.3, Node engine `>=24 <25` |
| Source footprint checked | 494 files under `app`, `components`, `lib`, `server`, `docs`, and `tests` |
| Latest verification baseline | Phase 25P: `git diff --check`, `pnpm test:unit`, `pnpm lint`, `pnpm typecheck`, `pnpm build`, and inactive quote smoke all passed |

## Executive Re-Audit

The project is now a strong gate-safe pre-pilot product package, not yet a
paid-pilot or real-customer-data package. The most important remaining work is
not adding more product surface; it is final conversion quality, product-real
visual evidence, local dashboard QA evidence, and explicit owner approvals for
blocked gates.

| Area | Previous Phase 25 score | Current score | Current read |
|---|---:|---:|---|
| Product truth and guardrails | 88/100 | 94/100 | Public, intake, pricing, FAQ, trust, and dashboard copy preserve owner-reviewed, manual-first boundaries. |
| Public conversion clarity | 76/100 | 84/100 | Comparison, quote-link guide, FAQ, pricing trust, pilot proof, and workflow copy are stronger; homepage hero still deserves final premium polish. |
| Homepage hero and first impression | Not scored separately | 78/100 | Functional and bilingual-safe, but the visual board is still dense and could communicate value faster. |
| Technical SEO | 64/100 | 84/100 | Sitemap freshness, canonical/hreflang, noindex boundaries, JSON-LD, FAQ caveats, OG image path, Search Console/CWV checklist are now covered. Breadcrumbs remain optional future polish. |
| AI-search content readiness | 58/100 | 82/100 | FAQ and comparison content now answer owner-intent questions without ranking or rich-result guarantees. |
| Bilingual public experience | Not scored separately | 90/100 | EN/fr-CA structure, copy budgets, accents, and smoke/source contracts are strong; every future hero/copy change must keep parity. |
| Public intake readiness | Not scored separately | 91/100 | Source attribution, validation, consent, abuse logging, noindex, inactive quote, and success expectations are source-guarded. Live/local DB RLS proof remains a separate gate. |
| Dashboard owner/admin UX | 84/100 | 86/100 | Dense synthetic fixture exists and lead source attribution is visible. Browser QA still depends on confirmed local Supabase. |
| GTM and pilot ops | 60/100 | 82/100 | Founder CRM, outreach, demo run-of-show, quote-link placement, reviews guidance, and manual support/payment/refund packet are documented. Paid pilot remains blocked. |
| Security/readiness gates | 70/100 | 84/100 | Abuse retention helper, security operations registers, CSP plan, credential rotation register, and local-only smoke guard exist. Local RLS/restored-app proof is still blocked without local target. |
| Analytics and funnel evidence | 45/100 | 63/100 | No-PII event taxonomy and founder funnel spec exist. No analytics sink is enabled without approval. |
| Overall startup readiness | 71/100 | 82/100 | The product is much closer to founder-led validation. It is still not approved for paid pilot, real data, or automation expansion. |

## What Is Done Compared With The Previous Checklist

- Public SEO foundation is materially complete: route metadata, sitemap
  freshness, canonical/hreflang behavior, robots/noindex boundaries, OG image,
  JSON-LD, FAQ guidance, Search Console checklist, and Core Web Vitals baseline.
- Public conversion foundations are much stronger: comparison route,
  quote-link guide, workflow-led features, pricing boundaries, trust/security
  evidence alignment, FAQ AI-search expansion, and honest pilot proof metrics.
- Quote/intake readiness is now source-guarded end to end for safe attribution,
  validation, privacy-mode storage, abuse/rate-limit behavior, inactive quote
  fallback, and no booking/price/availability confirmation.
- GTM and pilot operations are documented: founder CRM fields, outreach scripts,
  demo script, video plan, support/payment/refund packet, quote-link placement,
  and review-policy-safe guidance.
- Security/ops readiness improved: abuse-log retention helper, RLS coverage for
  cleanup permissions, privacy/incident registers, credential rotation hygiene,
  CSP report-only plan, and runtime posture.
- Future product expansions remain correctly blocked instead of half-enabled.

## What Still Remains

- Final homepage hero polish: stronger first impression, less dense visual
  hierarchy, clearer proof rail, better hero scannability on EN/fr-CA mobile and
  desktop.
- Product-real demo visuals: `/demo` should show more of what an owner actually
  inspects and does, not only abstract workflow copy.
- Dashboard/admin browser QA: needs confirmed local Supabase before mutating
  synthetic dashboard smoke and screenshot matrix.
- Protected-route a11y/focus QA: should be browser-tested after dashboard local
  QA is safe.
- First-party analytics sink: blocked until owner approval; current event
  taxonomy is intentionally no-op.
- Local DB/RLS and restored app proof: blocked until a confirmed local database
  target is available.
- Real customer data and paid pilot remain blocked until owner approval and
  gate evidence exist.

## Updated 0-100 Checklist

| # | Status | Area | Current decision |
|---:|---|---|---|
| 0 | DONE | Snapshot | Current head, branch, stack, verification baseline, and untracked output recorded. |
| 1 | BLOCKED | Real data | Keep Phase 24G real customer-data approval blocked. |
| 2 | BLOCKED | Paid pilot | Keep paid pilot blocked until support/payment/refund/rollback/restored-app gates close. |
| 3 | DONE | Docs | Phase 25 backlog is current and indexed. |
| 4 | DONE | Docs | Git/head/route status refreshed to `51e9b29`. |
| 5 | DONE | Product | Cleaning-first quote recovery positioning preserved. |
| 6 | DONE | Product | Owner-reviewed AI behavior preserved. |
| 7 | DONE | Product | Feature registry remains honest. |
| 8 | DONE | Safety | Dashboard smoke is local-only guarded. |
| 9 | DONE | Safety | Production destructive operations remain blocked. |
| 10 | DONE | Scope | Owner notification email remains deferred for first pilot. |
| 11 | DONE | Scope | "Final" means conversion-ready and gate-safe, not feature-bloated. |
| 12 | DONE | Docs | Decisions are recorded through Phase 25 evidence docs. |
| 13 | DONE | SEO | Sitemap freshness updated. |
| 14 | DONE | SEO | Public route metadata is source-guarded. |
| 15 | DONE | SEO | OG/social image foundation exists. |
| 16 | DONE | SEO | Structured-data foundation exists. |
| 17 | DONE | SEO | FAQ structured-data path and current Google caveats recorded. |
| 18 | PENDING | SEO | BreadcrumbList remains optional future polish for deeper pages. |
| 19 | DONE | SEO | `/content-studio` noindex decision is recorded. |
| 20 | DONE | SEO | Comparison route exists. |
| 21 | NEXT | Hero | Final homepage headline/hero proof polish is the next public-site phase. |
| 22 | DONE | Copy | Pilot proof architecture added without fake testimonials. |
| 23 | DONE | Copy | Feature narrative follows the quote recovery workflow. |
| 24 | PARTIAL | Copy | Cleaning use cases improved; more local scenario content can still help. |
| 25 | DONE | Copy | Pricing trust boundaries tightened. |
| 26 | PARTIAL | Copy | Pilot request flow is documented; conversion microcopy can still improve. |
| 27 | PENDING | Demo | Demo needs more product-real visual evidence. |
| 28 | DONE | FAQ | FAQ expanded for AI-search owner intent. |
| 29 | DONE | Trust | Trust/security claims align with current evidence. |
| 30 | DONE | SEO | Hreflang/canonical behavior is guarded. |
| 31 | DONE | SEO | Robots/noindex boundaries are guarded. |
| 32 | DONE | SEO | Sitemap route priorities/freshness are covered. |
| 33 | DONE | SEO | Search Console/indexing checklist exists. |
| 34 | DONE | Local GTM | Google Business Profile quote-link placement guide exists. |
| 35 | DONE | Performance | Core Web Vitals lab baseline exists. |
| 36 | DONE | Market | Buyer/persona and purchase triggers are documented in GTM materials. |
| 37 | PARTIAL | Copy | Slogan hierarchy improved; final hero polish should lock it. |
| 38 | PARTIAL | Content | Quote-link guide exists; a reply-speed lead magnet can still be added. |
| 39 | PENDING | Content | Lean local acquisition article plan still needs a final calendar. |
| 40 | PENDING | Content | Reply-speed education content remains a useful next content asset. |
| 41 | DONE | Content | GBP/Instagram/website placement content exists. |
| 42 | DONE | Content | Comparison content exists. |
| 43 | DONE | Trust | Fake testimonials are avoided and source-guarded. |
| 44 | DONE | Metrics | Pilot proof metrics are defined. |
| 45 | DONE | Localization | EN/fr-CA parity is tested and source-guarded. |
| 46 | PENDING | Content | Lean content calendar still needs final packaging. |
| 47 | DONE | Copy | Commodity AI language is reduced and guarded. |
| 48 | DONE | Dashboard | Dense synthetic QA fixture exists. |
| 49 | PENDING | Dashboard | Admin seeded-data browser retest needs confirmed local Supabase. |
| 50 | PENDING | Dashboard | Owner empty/first-run browser retest remains. |
| 51 | PARTIAL | Dashboard | Source/status clarity improved; browser QA remains. |
| 52 | PENDING | Dashboard | Lead detail next-action hierarchy needs final browser QA. |
| 53 | PENDING | Dashboard | Owner notes/history needs review after seeded QA. |
| 54 | DONE | Dashboard | Lead source attribution is visible on lead detail. |
| 55 | PENDING | Dashboard | Draft review/copy affordances need browser QA. |
| 56 | REINFORCED | Dashboard | Notification copy remains manual-only. |
| 57 | REINFORCED | Dashboard | Forward-only privacy gate remains disabled until behavior exists. |
| 58 | PENDING | Dashboard | Feature registry guide links can still improve settings clarity. |
| 59 | PENDING | Dashboard | Business-profile density needs browser QA. |
| 60 | PENDING | Dashboard | Quote Setup long-form ergonomics need browser QA. |
| 61 | PENDING | A11y | Protected-route keyboard/focus audit remains. |
| 62 | PENDING | Admin | Admin detail overflow needs browser QA. |
| 63 | PENDING | Admin | Admin activity dense/empty state QA remains. |
| 64 | PARTIAL | Dashboard | Validation dashboard is specified, but real usage metrics must not be faked. |
| 65 | PENDING | UX | Owner help microcopy should follow observed QA gaps. |
| 66 | PENDING | QA | Dashboard screenshot matrix remains after local QA. |
| 67 | BLOCKED | QA | Dashboard smoke waits for confirmed local Supabase. |
| 68 | DONE | Intake | Quote `sourceUrl` capture is safe and guarded. |
| 69 | DONE | Intake | UTM/source regression tests exist. |
| 70 | DONE | Intake | Custom field validation is source-guarded. |
| 71 | DONE | Intake | Privacy-mode behavior is source-guarded. |
| 72 | DONE | Intake | Abuse/rate-limit behavior is source-guarded and retention is planned. |
| 73 | DONE | Intake | Quote success next steps are manual-review explicit. |
| 74 | DONE | Intake | No booking/price/availability confirmation is guarded. |
| 75 | DONE | Intake | Inactive quote flow is source-guarded and smoke-tested. |
| 76 | DONE | Analytics | No-PII public event taxonomy exists. |
| 77 | BLOCKED | Analytics | First-party analytics sink requires owner approval. |
| 78 | BLOCKED | Analytics | Live public event tracking waits for approved sink. |
| 79 | DONE | Analytics | Founder funnel dashboard spec exists. |
| 80 | DONE | Sales | Founder CRM template/process updated. |
| 81 | DONE | Sales | Outreach sequences written. |
| 82 | DONE | Demo | Demo run-of-show and video plan exist. |
| 83 | DONE | Pilot ops | Manual pilot agreement/payment/refund packet exists; paid pilot still blocked. |
| 84 | DONE | Local GTM | Review/GBP guidance is policy-safe. |
| 85 | DONE | Security | IP hash salt posture documented/tested. |
| 86 | DONE | Security | Abuse retention cleanup path exists. |
| 87 | DONE | Privacy | Privacy incident/request registers exist. |
| 88 | DONE | Security | CSP report-only hardening plan exists. |
| 89 | BLOCKED | Ops | Strict restored app/dashboard/RLS proof still required before paid pilot. |
| 90 | BLOCKED | RLS | Local DB/RLS verification waits for confirmed local target. |
| 91 | DONE | Runtime | Node/pnpm/dependency posture is recorded. |
| 92 | DONE | Security | Credential rotation hygiene register exists. |
| 93 | FUTURE-BLOCKED | Email | Owner notification email remains deferred. |
| 94 | FUTURE-BLOCKED | Email | Customer email automation remains blocked. |
| 95 | FUTURE-BLOCKED | Messaging | SMS/WhatsApp remains blocked. |
| 96 | FUTURE-BLOCKED | Booking | Booking/calendar remains blocked. |
| 97 | FUTURE-BLOCKED | Payments | Invoice/payment automation remains blocked. |
| 98 | FUTURE-BLOCKED | Access | Team members/access management needs separate approval. |
| 99 | FUTURE-BLOCKED | Expansion | Multi-vertical expansion waits for cleaning validation. |
| 100 | FUTURE-BLOCKED | AI | Autonomous AI/operator behavior remains blocked. |

## Next Execution Order

1. Phase 25R: final homepage hero, bilingual first impression, and public
   visual proof polish.
2. Phase 25S: product-real `/demo` polish with owner-inspection visuals.
3. Phase 25T: final public smoke/screenshot matrix across EN/fr-CA,
   light/dark, mobile/desktop.
4. Phase 25U: dashboard/admin browser QA only after local Supabase is confirmed.
5. Phase 25V: protected-route a11y/focus QA after dashboard local QA.
6. Phase 25W: optional content calendar/lead magnet/reply-speed education.
7. Blocked gates: real customer data, paid pilot, local RLS/restored-app proof,
   analytics sink, messaging, booking, payments, team access, multi-vertical,
   and autonomous AI.

## Decision

Proceed with Phase 25R now. The highest-value safe improvement is the public
homepage hero and bilingual visual polish because it improves first impression
without crossing any blocked product, data, billing, or automation gate.
