# Phase 25 - Site, Dashboard, SEO, and Growth Backlog

Date: 2026-07-04
Repo: `E:\bizpilot-ai`
Branch: `main`
Head inspected: `7c077cb fix(home): compact hero visual flow`
Scope: first-pass assessment, source-backed backlog, and execution order before
final site/dashboard implementation.

## One-Line Decision

BizPilot should move into a guarded finalization phase: tighten public
conversion, technical SEO, AI-search readiness, local cleaning-business
acquisition, dashboard data-rich QA, demo readiness, and pilot operations while
keeping real customer data, paid pilot, automation, booking, invoices, SMS,
WhatsApp, and autonomous AI blocked until their explicit gates close.

## Current Repo Snapshot

| Item | Status |
|---|---|
| Git branch | `main` tracking `origin/main` |
| Working tree | Tracked files clean at inspection time |
| Untracked local output | `.codex-screenshots/` only; not part of this backlog |
| Runtime standard | Node `>=24 <25`, pnpm `10.18.3`, Next.js `16.2.4`, React `19.2.4` |
| Public origin | `https://bizpilo.com` from `lib/seo.ts` |
| Core product truth | Cleaning-first lead recovery and quote recovery command center |
| Real data | Blocked until Phase 24G explicit owner approval |
| Paid pilot | Blocked until support, payment/refund, rollback, real-data, and readiness gates close |

## Sources Read

Internal source documents and code inspected for this pass:

- `docs/CURRENT_CANONICAL_DOCS_v1.7.md`
- `docs/AI_CODING_AGENT_START_HERE_v1.7.md`
- `docs/readiness/BIZPILOT_DASHBOARD_MARKETING_SEO_OPERATING_STANDARD_2026-06-27.md`
- `docs/readiness/DASHBOARD_V3_ADMIN_OWNER_ROUTE_REVIEW_2026-06-28.md`
- `docs/readiness/DASHBOARD_V3_FINAL_COMPLETION_REPORT_2026-06-27.md`
- `docs/readiness/DASHBOARD_V3_FINAL_ROUTE_SIZE_QA_2026-06-27.md`
- `docs/product/BIZPILOT_FEATURE_ENTITLEMENT_AND_GUIDE_STANDARD_v1.0.md`
- `docs/operations/BIZPILOT_FINAL_EXECUTION_AND_VALIDATION_PRIORITY_STANDARD_v1.0.md`
- `docs/gtm/BIZPILOT_GTM_PLAYBOOK_v1.1.md`
- `docs/sales/FOUNDER_CRM_AND_OUTREACH_PLAYBOOK.md`
- `docs/business/PILOT_OFFER_AND_PRICING_DECISIONS.md`
- `docs/readiness/BIZPILOT_PROJECT_GAP_AND_SUGGESTIONS_2026-06-01.md`
- `docs/readiness/BIZPILOT_SECOND_PASS_PROJECT_GAP_AND_SUGGESTIONS_2026-06-01.md`
- `README.md`
- `docs/README.md`
- `package.json`
- Public routes under `app/**`
- Dashboard routes under `app/(dashboard)/dashboard/**`
- SEO helpers in `lib/seo.ts`, `app/sitemap.ts`, and `app/robots.ts`
- Public copy in `lib/i18n/public-site-copy.ts`, `lib/i18n/home-copy.ts`, and `lib/i18n/pricing-copy.ts`
- Feature truth in `lib/features/feature-registry.ts`
- Public event hooks in `lib/public-events.ts`
- Intake source handling in `components/public/quote-form-wizard.tsx`, `server/actions/public-intake.actions.ts`, and `server/services/public-intake.service.ts`

External references used as the current market/SEO/accessibility baseline:

- Google Search Central, AI optimization guidance:
  https://developers.google.com/search/docs/fundamentals/ai-optimization-guide
- Google Search Central, SEO starter guide:
  https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- Google Search Central, Core Web Vitals:
  https://developers.google.com/search/docs/appearance/core-web-vitals
- Google Search Central, Local Business structured data:
  https://developers.google.com/search/docs/appearance/structured-data/local-business
- Google Business Profile guidelines:
  https://support.google.com/business/answer/3038177
- W3C WCAG 2.2 Quick Reference:
  https://www.w3.org/WAI/WCAG22/quickref/
- HubSpot 2026 State of Marketing:
  https://www.hubspot.com/state-of-marketing
- HubSpot 2026 Marketing Statistics:
  https://www.hubspot.com/marketing-statistics
- BrightLocal Local Consumer Review Survey 2026:
  https://www.brightlocal.com/research/local-consumer-review-survey/

## External Lessons Applied

1. Search and AI-search still reward crawlable, technically sound,
   people-first, unique content. Do not chase "GEO" tricks, fake citations,
   forced LLM formatting, or commodity AI content.
2. For local-service customer acquisition, BizPilot should help cleaning
   owners place the quote link on their website, Google Business Profile,
   Instagram profile, saved replies, and email signatures.
3. Reviews and star ratings strongly affect local-business trust. BizPilot
   should not fake testimonials, but it should make room for measured pilot
   proof, owner quotes, and review-driven workflows after validation.
4. AI is no longer a differentiator by itself. The differentiator should be
   product truth: faster owner review, cleaner intake, safer follow-up, and
   less quote chaos without CRM bloat.
5. Core Web Vitals remain a practical QA baseline: target LCP under 2.5s, INP
   under 200ms, and CLS under 0.1 for public pages.
6. Accessibility must stay WCAG 2.2 AA oriented: visible focus, usable forms,
   clear errors, no mobile overflow, and no hidden keyboard traps.

## Working Scores

These are working audit scores, not final acceptance grades.

| Area | Score | Reason |
|---|---:|---|
| Product truth and guardrails | 88/100 | Manual-first boundaries are strong; feature registry keeps future scope honest. |
| Dashboard owner/admin UX | 84/100 | V3 route/size QA passed; next jump needs data-rich seeded states. |
| Public conversion clarity | 76/100 | Homepage has improved recently; supporting pages need sharper conversion paths and proof architecture. |
| Technical SEO | 64/100 | Canonicals, hreflang, robots, and sitemap exist; freshness, schema, OG assets, and route priorities need work. |
| AI-search content readiness | 58/100 | FAQ exists, but comparison, use-case, and unique local-growth content are thin. |
| GTM/customer acquisition | 60/100 | Founder CRM/playbooks exist; public acquisition assets and outreach proof loops need final packaging. |
| Analytics and funnel evidence | 45/100 | `lib/public-events.ts` is intentionally no-op; no approved first-party event sink yet. |
| Pilot operations | 55/100 | Pricing decisions and manual pilot posture exist; paid pilot support/payment/refund gates remain open. |
| Security/readiness gates | 70/100 | Strong conservative gates; real-data and paid-pilot blockers are still correctly open. |
| Overall startup readiness | 71/100 | Solid foundation, not yet final market-ready growth/product package. |

## Route Audit

| Route | Current read | Required finalization |
|---|---|---|
| `/` | Recent hero/story commits improved clarity. | Re-run public smokes, align tests with final copy, add proof/CTA measurement plan. |
| `/features` | Clear feature page exists. | Make the workflow more outcome-led: capture, triage, draft, review, follow up, measure. |
| `/industries/cleaning` | Strongest SEO target route. | Add richer cleaning-specific local quote scenarios without keyword stuffing. |
| `/pricing` | Pilot-safe copy and boundaries are present. | Add support/payment/refund readiness once paid-pilot gate closes. |
| `/faq` | Good manual-first questions exist. | Add FAQ schema and AI-search style questions around auto-send, CRM, booking, data, and quote links. |
| `/trust` | Guardrail surface exists. | Tie claims to readiness evidence and avoid over-claiming production scale. |
| `/security` | Honest security posture exists. | Keep strict restored app/RLS proof listed as deferred before paid/risky work. |
| `/privacy` | Privacy policy surface exists. | Confirm it matches current intake, AI, retention, and no-auto-send behavior. |
| `/terms` | Legal page exists. | Keep pilot/manual-billing boundaries aligned with pricing. |
| `/pilot` | Founder pilot path exists. | Make apply/copy/request workflow faster and measurable without fake self-serve signup claims. |
| `/demo` | Demo route exists. | Add clearer product screenshots or product-real visuals, not just abstract marketing. |
| `/content-studio` | Roadmap-only but canonical/indexable. | Decide: either make it valuable enough for indexing or set noindex/remove from sitemap until ready. |
| `/quote` | Noindex incomplete quote shell. | Keep noindex and safe fallback behavior. |
| `/quote/[slug]` | Noindex customer quote form. | Preserve privacy, consent, rate limiting, source metadata, and no booking/price confirmation. |
| `/quote/[slug]/success` | Noindex success state. | Confirm next-step copy stays manual and does not imply booking or automated response. |

## Dashboard Audit

| Route | Current read | Required finalization |
|---|---|---|
| `/dashboard` | Owner command-center overview exists. | Test with data-rich states, empty states, long text, EN/fr-CA, light/dark, and mobile. |
| `/dashboard/leads` | Lead queue exists with source normalization. | Confirm source/status filters and next action are obvious in dense rows and mobile cards. |
| `/dashboard/leads/[leadId]` | Owner-reviewed AI draft flow exists. | Strengthen note/history/source visibility after seeded QA if gaps appear. |
| `/dashboard/business-profile` | Business profile route exists. | Check compact scan, long names, service areas, privacy contact, and mobile behavior. |
| `/dashboard/configuration` | Main Quote Setup implementation. | Continue watching long form sections, bottom save bar, disabled notification copy, and forward-only gate. |
| `/dashboard/quote-setup` | Redirect alias to `/dashboard/configuration`. | Keep alias documented; do not duplicate route logic. |
| `/dashboard/settings` | Feature registry and guardrails visible. | Add guide links or clearer owner-facing entitlement explanations after final copy pass. |
| `/admin` | Founder/admin console exists and was audited. | Re-test with production-like seeded rows; keep destructive operations gate-aware. |

## Key Gaps Found

1. `app/sitemap.ts` still uses `2026-06-21` as `lastModified`, even though
   homepage and dashboard/public status work continued after that date.
2. `lib/seo.ts` provides canonical metadata, hreflang, Open Graph, and Twitter
   fields, but there is no structured-data system yet.
3. Twitter cards use `summary`; no dedicated OG/social image assets are wired.
4. `/content-studio` is roadmap-only but indexable and listed in the sitemap.
5. The nav copy has a comparison concept, but there is no dedicated public
   comparison route for "BizPilot vs CRM/form builder/booking software/manual
   inbox chaos."
6. `lib/public-events.ts` is a typed no-op. This is safe, but funnel evidence
   remains unavailable until an approved analytics sink exists.
7. Public quote form hidden `sourceUrl` currently renders as an empty value;
   UTM values are captured, but current-page URL capture should be tested and
   likely improved.
8. Dashboard notification copy is correctly manual-only, and SMS/WhatsApp plus
   forward-only are disabled, but these remain high-risk regression areas.
9. Dashboard QA has strong route/size evidence, but the latest reports still
   call out the need for production-like seeded data-rich states.
10. Root `README.md` and docs indexes lag behind the latest July assessment and
    June 28 dashboard route review.

## 100-Point Execution Backlog

Priority meaning:

- P0: must protect truth, gates, or project coordination before implementation.
- P1: highest product/marketing/dashboard value for finalization.
- P2: important hardening, measurement, and pilot operations.
- P3: future expansion only after validation or explicit owner approval.

| # | Priority | Area | Item | Done when |
|---:|---|---|---|---|
| 1 | P0 | Gates | Keep Phase 24G real customer-data approval blocked. | No real customer data is used without an explicit recorded owner approval. |
| 2 | P0 | Gates | Keep paid pilot blocked. | Payment, support, refund, rollback, and readiness gates are recorded before charging. |
| 3 | P0 | Docs | Add this Phase 25 backlog to current docs indexes. | Future agents see this as the current execution backlog. |
| 4 | P0 | Docs | Record current git/head/route status. | Status is traceable to `7c077cb` and `main`. |
| 5 | P0 | Product | Preserve cleaning-first quote recovery positioning. | No page implies full CRM, booking, auto-send, billing automation, or guaranteed revenue. |
| 6 | P0 | Product | Preserve owner-reviewed AI behavior. | AI is framed as draft/summarize/recommend, never autonomous send/commit. |
| 7 | P0 | Product | Keep feature registry honest. | Future features remain planned, setup-required, owner-controlled, or blocked as appropriate. |
| 8 | P0 | Safety | Do not run dashboard smoke against managed/non-local Supabase. | Smoke commands are local/synthetic only. |
| 9 | P0 | Safety | Avoid production destructive operations. | No deletion/migration/bulk cleanup without separate approval and backup posture. |
| 10 | P0 | Safety | Keep owner notification email deferred for first pilot. | Dashboard copy and feature state do not imply active owner notifications. |
| 11 | P0 | Scope | Define "final" as conversion-ready plus gate-safe, not feature-bloated. | Final acceptance criteria are documented before UI expansion. |
| 12 | P0 | Docs | Maintain a decision log for SEO/content/dashboard choices. | Each major choice has a source and reason. |
| 13 | P1 | SEO | Update sitemap freshness after current public polish. | `lastModified` and route priorities reflect current public content. |
| 14 | P1 | SEO | Audit every public route title/description. | Metadata is unique, accurate, and cleaning-first where appropriate. |
| 15 | P1 | SEO | Add or plan OG/social images. | Shared links have intentional preview assets and no generic summary-only card. |
| 16 | P1 | SEO | Add structured data foundation. | WebSite, Organization, SoftwareApplication/Service, and route JSON-LD are implemented or specified. |
| 17 | P1 | SEO | Add FAQPage structured data where eligible. | FAQ content is schema-backed without duplicating false claims. |
| 18 | P1 | SEO | Add BreadcrumbList where helpful. | Deep public pages have consistent breadcrumbs and schema. |
| 19 | P1 | SEO | Decide `/content-studio` indexing. | Page is either upgraded into valuable content or noindexed/removed from sitemap. |
| 20 | P1 | SEO | Add a comparison route. | BizPilot is honestly compared with CRMs, form builders, booking tools, and manual inboxes. |
| 21 | P1 | Copy | Test homepage headline/slogan options. | Final headline is clearer than generic AI positioning and remains manual-first. |
| 22 | P1 | Copy | Add proof architecture without fake proof. | Site shows measured pilot targets, process proof, or honest "what we will measure." |
| 23 | P1 | Copy | Rework feature narrative around the workflow. | Feature page follows capture -> organize -> draft -> review -> follow up -> learn. |
| 24 | P1 | Copy | Deepen cleaning industry use cases. | Cleaning page speaks to residential, office, move-out, recurring, and urgent quote flows. |
| 25 | P1 | Copy | Tighten pricing page trust boundaries. | Pilot price, manual billing, no booking/invoice/SMS/CRM boundaries are unmistakable. |
| 26 | P1 | Copy | Tighten pilot application flow. | Founder pilot request is fast, clear, and trackable. |
| 27 | P1 | Copy | Improve demo page with product-real visuals. | Demo shows what owners actually inspect and do. |
| 28 | P1 | Copy | Expand FAQ for AI-search queries. | FAQ covers auto-send, CRM, booking, quote link placement, privacy, and owner review. |
| 29 | P1 | Trust | Align trust/security pages with current evidence. | Claims match recorded proof and deferred gates. |
| 30 | P1 | SEO | Verify hreflang/canonical behavior. | EN/fr-CA alternates and canonicals are correct on all public routes. |
| 31 | P1 | SEO | Confirm robots/noindex boundaries. | Auth, dashboard, founder/admin, and quote intake stay excluded from indexing. |
| 32 | P1 | SEO | Tune sitemap priorities/change frequencies. | Homepage and core conversion pages receive accurate priorities. |
| 33 | P1 | SEO | Add Search Console and indexing checklist. | Deployment has a clear owner checklist for sitemap submission and coverage checks. |
| 34 | P1 | Local GTM | Add Google Business Profile quote-link placement guide. | Owners know where and how to place the BizPilot quote link. |
| 35 | P1 | Performance | Establish Core Web Vitals baseline. | LCP, INP, CLS are captured for key public routes. |
| 36 | P1 | Market | Define buyer persona and purchase trigger. | Cleaning-owner pain, urgency, objections, and buying path are documented. |
| 37 | P1 | Market | Finalize slogan hierarchy. | Main slogan, subheadline, and CTA copy are consistent across pages. |
| 38 | P1 | Content | Create a practical lead magnet/guide. | A useful guide exists for faster quote replies or quote-link placement. |
| 39 | P1 | Content | Create local acquisition article plan. | Content targets real cleaning-owner problems, not generic AI blog filler. |
| 40 | P1 | Content | Create reply-speed education content. | Site explains why fast, complete quote replies matter. |
| 41 | P1 | Content | Create GBP/Instagram/website placement content. | Owners can improve intake without integrations. |
| 42 | P1 | Content | Create comparison content. | Prospects understand why this is not a bloated CRM or booking platform. |
| 43 | P1 | Content | Avoid fake testimonials. | Social proof is either real, measured, or clearly framed as pilot goals. |
| 44 | P1 | Content | Define pilot proof metrics. | Reply time, missing-info reduction, follow-up completion, and quote source are tracked. |
| 45 | P1 | Localization | Keep EN/fr-CA parity. | All public copy changes pass bilingual length and meaning checks. |
| 46 | P1 | Content | Build a lean content calendar. | Only high-intent, high-trust pieces are queued. |
| 47 | P1 | Content | Remove commodity AI language. | Copy focuses on owner outcomes and trust, not "AI magic." |
| 48 | P1 | Dashboard | Create local seeded data-rich QA states. | Owner/admin pages can be tested with realistic rows and long values. |
| 49 | P1 | Dashboard | Re-test admin with seeded data. | Admin user, business, activity, and detail panels hold up in dense states. |
| 50 | P1 | Dashboard | Re-test owner empty and first-run states. | A new owner understands the first action in under three minutes. |
| 51 | P1 | Dashboard | Validate lead queue source/status clarity. | Owners can scan source, urgency, and next action quickly. |
| 52 | P1 | Dashboard | Validate lead detail next-action hierarchy. | Safest manual action remains obvious on mobile and desktop. |
| 53 | P1 | Dashboard | Review owner notes/history needs. | Notes are either sufficient or scoped for a gated improvement. |
| 54 | P1 | Dashboard | Improve visible source attribution if needed. | Lead source and UTM context are visible where owners need it. |
| 55 | P1 | Dashboard | Strengthen draft copy/review affordances. | Owners clearly review/copy, not auto-send. |
| 56 | P1 | Dashboard | Regression-check notification copy. | Manual dashboard check only remains clear. |
| 57 | P1 | Dashboard | Regression-check forward-only privacy gate. | Forward-only remains disabled until storage/intake behavior exists. |
| 58 | P1 | Dashboard | Add guide links for feature registry states. | Settings explain enabled, planned, setup-required, and blocked items. |
| 59 | P1 | Dashboard | Recheck business-profile density. | Long names, URLs, service areas, and emails do not overflow. |
| 60 | P1 | Dashboard | Recheck Quote Setup long-form ergonomics. | Bottom save bar, tabs, fields, FAQ, privacy, and branding remain stable. |
| 61 | P1 | A11y | Keyboard/focus audit protected routes. | Dashboard and admin forms have visible focus and usable controls. |
| 62 | P1 | Admin | Recheck admin detail overflow. | Long emails/names/status rows wrap safely. |
| 63 | P1 | Admin | Recheck admin activity newsroom. | Empty, sparse, and dense activity states are legible. |
| 64 | P1 | Dashboard | Plan validation dashboard after real usage. | Metrics are defined but not faked before pilot data exists. |
| 65 | P1 | UX | Add owner help microcopy only where needed. | Help text reduces confusion without bloating the interface. |
| 66 | P1 | QA | Capture screenshot matrix after final dashboard polish. | Desktop/mobile, EN/fr-CA, light/dark evidence is stored. |
| 67 | P1 | QA | Run dashboard smoke only when local target is confirmed. | Synthetic auth/workspace/lead smoke passes against local Supabase. |
| 68 | P1 | Intake | Fix/test quote `sourceUrl` capture. | Source URL is either captured safely or intentionally omitted and documented. |
| 69 | P1 | Intake | Add UTM/source regression tests. | `source`, `utm_source`, `utm_medium`, and `utm_campaign` survive submission. |
| 70 | P1 | Intake | Recheck custom field validation. | Required/hidden/custom fields behave correctly and accessibly. |
| 71 | P1 | Intake | Recheck privacy-mode behavior. | Standard/minimal modes match storage and public copy. |
| 72 | P1 | Intake | Recheck abuse/rate-limit behavior. | Quote submissions stay safe without blocking normal users. |
| 73 | P1 | Intake | Polish quote success next steps. | Customers understand the business will review and reply manually. |
| 74 | P1 | Intake | Confirm no booking/price confirmation copy. | Quote form and success page never imply a confirmed job. |
| 75 | P1 | Intake | Recheck inactive quote flow. | Unavailable slugs fail safely and clearly. |
| 76 | P2 | Analytics | Define event taxonomy. | CTA, locale, theme, demo, pilot, and quote-link events have safe names/properties. |
| 77 | P2 | Analytics | Choose first-party analytics sink. | No third-party script or PII sink is added without approval. |
| 78 | P2 | Analytics | Track no-PII public conversion events. | Events measure funnel behavior without customer personal data. |
| 79 | P2 | Analytics | Define founder funnel dashboard. | Pilot request, demo, quote link, reply, and follow-up metrics are measurable. |
| 80 | P2 | Sales | Update founder CRM template/process. | Outreach status, objections, next step, and proof metrics are tracked. |
| 81 | P2 | Sales | Write outreach sequences. | Cleaning-owner messages are concise, manual, and honest. |
| 82 | P2 | Demo | Create demo script and video plan. | Demo shows quote chaos to owner-reviewed reply in a few minutes. |
| 83 | P2 | Pilot Ops | Finalize pilot agreement/payment/refund packet. | Paid pilot has manual billing and support expectations documented. |
| 84 | P2 | Local GTM | Add review/GBP campaign guidance. | Owners get local trust-building guidance without fake review incentives. |
| 85 | P2 | Security | Implement or document IP hash salt posture. | Abuse logs avoid raw IP exposure where possible. |
| 86 | P2 | Security | Add abuse retention cleanup plan. | Old abuse/rate-limit records have a retention path. |
| 87 | P2 | Privacy | Maintain privacy incident/request registers. | Operational privacy process is ready before scale. |
| 88 | P2 | Security | Plan CSP report-only hardening. | Headers can be tightened with evidence and low rollout risk. |
| 89 | P2 | Ops | Complete strict restored app/dashboard/RLS proof. | Required before paid pilot, migrations, destructive cleanup, or broad scale. |
| 90 | P2 | RLS | Run local DB/RLS verification when target is local. | RLS tests pass without touching production-like targets. |
| 91 | P2 | Runtime | Reconfirm Node/pnpm/dependency posture. | CI/deploy environment matches repo engines and package manager. |
| 92 | P2 | Security | Record credential rotation hygiene. | Any previously shared credentials are rotated or tracked as owner action. |
| 93 | P3 | Future | Owner notification email. | Implement only after validation and explicit communication gate. |
| 94 | P3 | Future | Customer email automation. | Implement only with consent, templates, logs, rollback, and owner approval. |
| 95 | P3 | Future | SMS/WhatsApp messaging. | Keep blocked until provider/compliance/product validation exists. |
| 96 | P3 | Future | Booking/calendar. | Keep planned only until scheduling scope and liability are approved. |
| 97 | P3 | Future | Invoices/payments automation. | Keep planned until paid-pilot ops and support are proven. |
| 98 | P3 | Future | Team members/access management. | Requires separate schema, RLS, route, and owner approval. |
| 99 | P3 | Future | Multi-vertical expansion. | Wait for at least three paying/payment-ready cleaning businesses and retention proof. |
| 100 | P3 | Future | Autonomous AI/operator behavior. | Keep blocked; current product remains owner-reviewed and manual-send. |

## First Implementation Slice

Recommended next slice after this backlog is committed:

1. SEO foundation: update sitemap freshness, decide `/content-studio`
   index/noindex, add structured-data helpers, and add/adjust tests.
2. Public conversion: add honest comparison content and expand FAQ around
   manual-first AI, quote-link placement, privacy, CRM/booking boundaries, and
   cleaning-owner outcomes.
3. Intake attribution: verify and fix `sourceUrl`/UTM behavior with tests.
4. Dashboard QA: create or reuse local seeded data-rich states, then run
   dashboard/admin route screenshots against confirmed local/synthetic data.
5. GTM packet: create founder outreach, demo script, and quote-link placement
   guide aligned with current marketing research.

## Verification Standard For Future Slices

Use the narrowest safe verification that covers the changed surface:

- Docs-only: `git diff --check`
- Public metadata/copy: `pnpm test:unit`, `pnpm smoke:public`,
  `pnpm smoke:responsive`, and `pnpm smoke:ui-matrix` after local server is up
- Dashboard UI: `pnpm verify`, browser screenshot QA, and dashboard smoke only
  with confirmed local/synthetic Supabase
- Intake/server changes: unit tests plus relevant quote smoke; no production
  customer data
- Database/RLS changes: local DB/RLS proof before any deploy or real-data
  consideration

## Do Not Start Without Separate Approval

- Real customer data onboarding
- Paid pilot collection
- Production migrations or destructive cleanup
- Owner/team access management implementation
- Owner notification email
- Customer-facing email automation
- SMS/WhatsApp automation
- Booking/calendar
- Invoices/payments automation
- Autonomous AI or auto-send
- Broad multi-vertical launch

## Current Recommendation

Proceed with Phase 25 in small verified slices. The immediate safest move is
documentation alignment plus SEO/public-conversion hardening. Dashboard
implementation should follow after seeded data-rich QA is prepared so the final
dashboard polish is based on realistic owner/admin states instead of only empty
or sparse screens.

## Progress Addendum - Phase 25A

Date: 2026-07-04

Implemented in `docs/readiness/PHASE_25A_SEO_COMPARISON_FOUNDATION_2026-07-04.md`:

- Added canonical `/comparison` route and EN/fr-CA comparison copy.
- Added comparison to public navigation, footer, proxy language handling,
  sitemap, metadata, smoke coverage, and final UI matrix.
- Marked roadmap-only `/content-studio` noindex and removed it from the
  canonical sitemap route list.
- Refreshed sitemap `lastModified` to `2026-07-04`.
- Added Open Graph/Twitter large image metadata plus generated
  `/opengraph-image`.
- Added JSON-LD foundation for homepage, FAQ, and comparison breadcrumbs.
- Expanded FAQ with quote-link placement and booking-boundary questions.

Backlog items advanced:

```text
13 done
15 done
16 done
17 done
18 started
19 done
20 done
28 started
30 done
32 started
42 done
```

Verification:

```text
pnpm verify                                                  PASS
pnpm test:unit                                               PASS
pnpm typecheck                                               PASS
pnpm build                                                   PASS
pnpm smoke:public -- --base-url=http://127.0.0.1:3030        PASS
pnpm smoke:responsive -- --base-url=http://127.0.0.1:3030    PASS
pnpm smoke:ui-matrix -- --base-url=http://127.0.0.1:3030 --timeout-ms=60000 PASS
```

Next recommended slice:

```text
Phase 25B - intake attribution, sourceUrl/UTM tests, quote-link placement guide, and seeded dashboard/admin QA prep.
```

## Progress Addendum - Phase 25B

Date: 2026-07-04

Implemented in `docs/readiness/PHASE_25B_INTAKE_ATTRIBUTION_2026-07-04.md`:

- Added safe quote attribution helpers for source URL, source/ref, UTM, and
  language switching.
- Filled the public quote form `sourceUrl` hidden field with an allowlisted URL
  instead of an empty value.
- Preserved approved attribution parameters across quote-page language changes.
- Added regression coverage to prevent customer field data or arbitrary query
  parameters from entering lead attribution metadata.

Backlog items advanced:

```text
68 done
69 done
74 preserved
```

Verification:

```text
pnpm verify PASS
pnpm test:unit PASS
pnpm typecheck PASS
pnpm build PASS
pnpm smoke:quote -- --base-url=http://127.0.0.1:3030 --inactive-slug=phase1-unavailable-synthetic PASS
```

## Progress Addendum - Phase 25C

Date: 2026-07-04

Implemented in `docs/readiness/PHASE_25C_QUOTE_LINK_PLACEMENT_GUIDE_2026-07-04.md`:

- Added canonical `/quote-link-guide` as a practical local-GTM guide.
- Added source-backed placement guidance for website, Google Business Profile,
  Instagram bio, saved replies/DMs, and email signatures.
- Added source/UTM examples aligned with the Phase 25B attribution capture.
- Added sitemap/canonical metadata, footer discovery, language handling, smoke
  coverage, UI matrix coverage, and SEO source guards.
- Kept quote links framed as request intake only, not booking confirmation.

Backlog items advanced:

```text
34 done
38 started
41 done
68 reinforced
69 reinforced
74 preserved
```

Verification:

```text
pnpm verify PASS
pnpm test:unit PASS
pnpm typecheck PASS
pnpm build PASS
pnpm smoke:public -- --base-url=http://127.0.0.1:3030 PASS
pnpm smoke:responsive -- --base-url=http://127.0.0.1:3030 PASS
pnpm smoke:ui-matrix -- --base-url=http://127.0.0.1:3030 --timeout-ms=60000 PASS
```

## Progress Addendum - Phase 25D

Date: 2026-07-04

Implemented in `docs/readiness/PHASE_25D_DASHBOARD_DATA_RICH_QA_FIXTURE_2026-07-04.md`:

- Added an opt-in `dense` fixture profile to `tests/smoke/dashboard-auth-smoke.mts`.
- Kept the default dashboard smoke behavior as the existing single synthetic
  lead profile.
- Added `--fixture-profile=dense` and
  `BIZPILOT_DASHBOARD_SMOKE_FIXTURE_PROFILE=dense` support.
- Added dense synthetic leads covering long text, multiple sources, missing
  contact info, outside service area, follow-up due, and booked/manual-outcome
  states.
- Preserved the production-prohibited dashboard smoke safety guard.
- Added source guard coverage for fixture profiles, dense source variety, and
  production safety markers.

Backlog items advanced:

```text
48 done
49 prepared
51 prepared
54 prepared
59 prepared
62 prepared
63 prepared
66 prepared
67 prepared
74 preserved
```

Verification:

```text
git diff --check PASS
pnpm test:unit PASS
pnpm lint PASS
pnpm typecheck PASS
pnpm build PASS
pnpm smoke:dashboard -- --base-url=http://127.0.0.1:3030 --fixture-profile=dense SKIPPED - NEXT_PUBLIC_SUPABASE_URL classified canonical production blocked
```

Next recommended slice:

```text
Phase 25E - point the environment at confirmed local/synthetic Supabase, run the dense dashboard smoke, and continue dashboard/admin visual QA findings.
```

## Progress Addendum - Phase 25E

Date: 2026-07-04

Implemented in `docs/readiness/PHASE_25E_LEAD_SOURCE_ATTRIBUTION_VISIBILITY_2026-07-04.md`:

- Added tenant-scoped `lead_source_metadata` read support to the Lead Conversion
  repository.
- Added `sourceMetadata` to the Lead Detail service result.
- Added owner-visible source attribution inside the existing Lead Details card:
  source URL, referrer, UTM source, UTM medium, and UTM campaign.
- Added EN/fr-CA copy that frames the section as captured source context, not a
  full attribution analytics report.
- Added source guards for repository scoping, service wiring, detail rendering,
  and copy boundary.

Backlog items advanced:

```text
51 advanced
54 done
58 preserved
64 preserved
74 preserved
79 prepared
```

Verification:

```text
git diff --check PASS
pnpm test:unit PASS
pnpm lint PASS
pnpm typecheck PASS
pnpm build PASS
pnpm smoke:dashboard -- --base-url=http://127.0.0.1:3030 --fixture-profile=dense SKIPPED - NEXT_PUBLIC_SUPABASE_URL classified canonical production blocked
```
