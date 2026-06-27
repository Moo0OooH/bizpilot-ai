# BizPilot AI Dashboard, Marketing, and SEO Operating Standard

Date: 2026-06-27
Repo: `E:\bizpilot-ai`
Current main merge: `2bcbde1 merge: founder admin console professionalization gates`
Audience: founder, product, design, frontend, growth/SEO, QA

## Purpose

This is the canonical operating standard for the next BizPilot dashboard,
public-site, marketing, SEO, accessibility, analytics, and QA work.

It replaces the two temporary resource drafts:

```text
docs/readiness/BIZPILOT_DASHBOARD_MARKETING_SEO_RESOURCE_2026-06-27.md
docs/readiness/BIZPILOT_DASHBOARD_MARKETING_SEO_RESOURCE_FA_2026-06-27.md
```

The English draft contained useful research and product standards. The Persian
draft had encoding damage and should not be committed as a canonical project
document. This document consolidates the useful content into one clean English
source of truth.

## Product Truth

BizPilot AI is a cleaning-first, manual-first, owner-controlled lead recovery
system.

Core boundaries:

- Cleaning businesses only for the current product focus.
- Manual-first workflow.
- AI drafts assist the owner.
- Owner reviews, edits, copies, and sends manually.
- No auto-send.
- No invented pricing.
- No booking confirmation.
- No invoicing.
- No SMS or WhatsApp automation.
- No full CRM claim.
- No real customer data before explicit owner approval.
- No paid pilot before readiness, support, payment, refund, RLS, and rollback
  gates are closed.

The product should be understood as:

```text
Lead Recovery Command Center for cleaning business owners
+
Founder Admin Operations Console for internal oversight
```

The owner dashboard must answer this before anything else:

```text
What quote request needs attention, and what is the safest next manual action?
```

## Current Project State

The following work is now merged to `main`:

- P8 public homepage clarity.
- P11 premium public/home and admin foundation polish.
- D1 dashboard shell and lead workflow stabilization.
- P12 dashboard owner workflow/readability polish.
- P13 founder admin console gate professionalization.

Current readiness interpretation:

| Area | Status | Decision |
|---|---|---|
| Public site | Ready for current scope | Must still be checked after deploy/cache refresh. |
| Owner dashboard | Code/test/visual ready for local synthetic scope | No real customer data approval implied. |
| Founder admin console | Code/test/browser-gate ready | Production user deletion and access mutation remain blocked. |
| Real customer data | BLOCKED | Requires explicit owner approval and local DB/RLS proof. |
| Paid pilot | BLOCKED | Requires business, ops, support, payment/refund, app/RLS, and rollback gates. |
| New product features | CONTROLLED | Do not add automation or broad CRM scope before validation. |

## 2026-06-27 Admin and Dashboard Execution Addendum

This addendum records the first implementation pass after the founder review of
the owner dashboard, founder admin console, and legacy `/founder` surface.

Implemented standardization:

- Owner dashboard pages now keep the route bar secondary and give the page
  content exactly one primary H1.
- Mobile lead cards wrap long customer identities and avoid horizontal layout
  spill at small viewport widths.
- Founder admin `inbox`, `health`, `leads`, and `activity` panels each expose a
  scannable page-level heading instead of relying on tab chrome.
- Founder admin workspace controls now stack into readable cards before they
  split into dense columns.
- Founder cleanup warnings use semantic danger/warning tokens instead of
  hard-coded pale red text, preserving light/dark contrast.
- `/founder` is no longer a stale phase shell. It now acts as a focused founder
  admin handoff that points to the owner dashboard and the operational admin
  console.
- Theme bootstrap and local dev origin handling remain part of the readiness
  path so local visual QA does not create noisy hydration or origin warnings.

External standards used for this pass:

- Google Search Central SEO Starter Guide: pages should have clear, helpful
  content and crawlable, descriptive links.
- web.dev Core Web Vitals: layout stability and responsive rendering remain
  product quality requirements even for authenticated surfaces.
- W3C WCAG 2.2 Quick Reference: status, warning, and destructive controls must
  keep readable contrast and clear labels.
- Nielsen Norman Group dashboard guidance: admin dashboards should optimize for
  fast scanning, obvious priority, and minimal visual noise.

Verification completed for this pass:

- Authenticated browser review of `/dashboard`, `/dashboard/leads`,
  `/dashboard/settings`, `/admin`, `/admin?adminPanel=health`,
  `/admin?adminPanel=leads`, `/admin?adminPanel=activity`, and `/founder` on
  desktop and mobile.
- Each checked route had exactly one H1 and no horizontal overflow.
- `pnpm typecheck`, `pnpm lint`, `pnpm test:unit`, and `pnpm build`.
- Public smoke, responsive smoke, quote smoke, and UI matrix smoke against the
  local dev server.

P14 follow-up:

- See `docs/readiness/P14_FULL_SYSTEM_DASHBOARD_QA_AND_POLISH_2026-06-27.md`
  for the full-system fake signup QA, final authenticated route audit, owner
  dashboard consolidation, admin/founder polish, verification log, and
  production-safety notes.

P15 follow-up:

- See `docs/readiness/P15_BILINGUAL_LAYOUT_SCROLL_QA_AND_FINAL_POLISH_2026-06-27.md`
  for the bilingual public route audit, owner settings scroll reduction,
  founder/admin rail cleanup, final compactness scores, and 86-route/viewport
  Browser verification pass.

P16 follow-up:

- See `docs/readiness/P16_QUOTE_SETUP_FIELD_TYPE_AND_ADMIN_ROUTE_FIX_2026-06-27.md`
  for the Quote Setup custom-field type crash fix, field-type browser retest,
  and founder/admin business-route cleanup.

P18 follow-up:

- See `docs/readiness/P18_OWNER_ADMIN_DASHBOARD_CLARITY_UPGRADE_2026-06-27.md`
  for the Owner first-run Start Here path, Founder/Admin Users-first route
  priority, 10-user directory default, and source standards applied.

P19 follow-up:

- See `docs/readiness/P19_PUBLIC_MESSAGES_AND_DASHBOARD_WORKFLOW_STANDARD_2026-06-27.md`
  for the public/auth route-message safety layer, owner/admin flash-message
  standardization, browser QA evidence, and final workflow checks.

Safety notes:

- No production cleanup or deletion action was executed.
- Synthetic dashboard smoke that creates auth/workspace/lead data remains
  skipped unless the target is explicitly approved as safe for synthetic writes.
- Local founder admin service-role reads may show zero data or a service warning
  when the local environment cannot perform admin reads; this does not grant
  approval to loosen service-role or RLS boundaries.

## Role Separation

Do not blend these surfaces.

| Role | Surface | Job |
|---|---|---|
| Cleaning business owner | `/dashboard` | Recover quote requests, review drafts, update manual outcomes, manage setup. |
| Founder/admin | `/admin` | Monitor workspace health, users, gates, support state, and risk. |
| Customer/lead | `/quote/[slug]` | Submit a quote request with minimal friction. |

Owner-facing copy should avoid internal language such as `tenant`, `RLS`,
`service role`, `synthetic`, `migration`, `provider`, or `phase`.

Founder/admin can use operational language, but all dangerous actions need
clear gate status, confirmation, auditability, and server-side protection.

## Dashboard North Star

Recommended North Star:

```text
Owner-reviewed quote requests that receive a useful first response before the
lead recovery threshold.
```

Supporting metrics:

- Quote requests captured.
- Urgent leads reviewed.
- Draft replies copied.
- Manual replies marked sent.
- Follow-ups completed.
- Missing-information requests handled.
- Quote-link readiness completed.
- Time from request to owner action.
- Leads with safe AI draft available.
- Leads with manual outcome recorded.

Charts are not a priority unless they change what the owner does today.

## Owner Dashboard Standard

Owner dashboard pages must be action-first, compact, and calm.

Information hierarchy:

1. Urgent lead action.
2. Lead recovery queue.
3. Quote-link readiness.
4. Draft/review support.
5. Metrics.
6. Settings and secondary system detail.

Navigation should stay stable:

- Overview
- Leads
- Quote Setup
- Business Profile
- Settings

### Overview

Job: show what needs attention today.

Must show:

- The most important lead needing owner action.
- Whether the quote link is usable.
- Whether AI draft support is available or unavailable.
- Manual next action.
- Compact readiness state.

Avoid:

- Chart-heavy dashboard behavior.
- Internal status detail above owner action.
- AI language that implies autonomous sending.

### Leads

Job: triage quote requests quickly.

Must support:

- Search.
- Status filter.
- Priority/urgency scanning.
- Mobile card layout.
- Desktop row layout.
- Clear link to lead detail.
- Empty state that explains how to get or test quote requests.

Rows/cards must make these clear:

- Who asked.
- What they need.
- What state the lead is in.
- Whether action is overdue, urgent, or ready.
- What the next manual action is.

### Lead Detail

Job: help the owner handle one lead safely.

Must show:

- Customer request summary.
- Missing information.
- Owner-review AI draft area.
- Copy draft action.
- Manual status update.
- Follow-up action.
- Clear "no auto-send" guardrail.

AI draft areas must always show that owner review is required.

### Quote Setup

Job: make the quote link ready and trustworthy.

Must include:

- Readiness checklist.
- Business/service details.
- Service areas.
- Quote form fields.
- Custom fields with label, type, required flag, help text, validation, and
  preview.
- Copy quote link.
- Inactive/unavailable states.
- Safe error copy.

Do not expose raw database/provider errors.

### Business Profile

Job: store business identity and local operating context.

Recommended fields:

- Business name.
- Public display name.
- Service categories.
- Service areas.
- Address visibility/service-area business flag.
- Phone and email.
- Website.
- Hours.
- Preferred response time.
- Review link.
- Google Business Profile link.
- Brand tone.
- Pricing guardrails such as "do not invent pricing".

### Settings

Job: control workspace preferences without distracting from recovery work.

Must include:

- Language.
- Theme.
- Account.
- Manual plan state.
- Quote link state.
- Lifecycle/deletion.
- Danger zone.

Danger zone rules:

- Visually separated.
- Explicit confirmation.
- Audit trail.
- No destructive production action without owner-approved gate.
- Last-owner protection before team management.

## Founder Admin Standard

Founder Admin is a separate internal operating console, not a customer CRM.

Must support:

- Business/workspace list.
- Workspace status.
- Active pilot state.
- Payment/manual plan state.
- Quote link active/inactive state.
- Paused/suspended state.
- Auth/user review.
- Production health.
- Audit trail.
- Founder notes.
- Clear gate status for mutations.

P13 established the correct safety direction:

- Capability matrix.
- Account support.
- Fake/test auth deletion surfaced with confirmation.
- Production user deletion blocked from the UI.
- Temporary password setting gated.
- Invite, role change, suspend, remove, and production deletion blocked until a
  separate security/RLS gate closes.

Admin mutation rules:

- Deny by default.
- Enforce authorization server-side.
- Require exact target confirmation for destructive actions.
- Keep production customer data out of test cleanup flows.
- Record who, what, when, and why.
- Never use shared owner credentials in automation.

## Public Site and Marketing Standard

Core message:

```text
BizPilot helps cleaning businesses recover quote requests before they go cold.
```

Support points:

- Public quote link.
- Organized lead queue.
- AI-supported summaries and draft replies.
- Owner-reviewed manual response.
- Follow-up visibility.
- Cleaning-first workflow.

Avoid:

- "AI runs your business."
- "Full CRM."
- "Automatic booking."
- "Automatic SMS/WhatsApp follow-up."
- "Invoicing."
- "Guaranteed revenue."
- "Start free trial", "no credit card", or "cancel anytime" unless the business
  and billing gates support it.

### Page Jobs

| Page | Job |
|---|---|
| `/` | Explain the pain and workflow in 30 seconds. |
| `/features` | Show the actual workflow and product UI. |
| `/industries/cleaning` | Prove cleaning-specific fit. |
| `/demo` | Walk through one realistic quote request. |
| `/pricing` | State current staged pricing truthfully. |
| `/pilot` | Explain pilot scope and manual limits. |
| `/trust` | Explain privacy, manual review, and safety. |
| `/security` | Explain security without leaking internal jargon. |
| `/privacy`, `/terms` | Legal clarity. |
| `/quote/[slug]` | Convert a visitor into a quote request. |

Conversion rules:

- Show actual product UI or faithful product mockups.
- Use one primary CTA per state.
- Keep the CTA visible at `1280x720` and `1366x768`.
- Keep the hero pain visual clear, not crowded.
- Use outcome language: fewer missed quote requests, faster manual replies,
  clearer follow-up.
- French Canadian copy must fit and read naturally, not as literal translation.

## SEO and AI Search Standard

Foundational SEO remains the standard for AI search visibility.

For public/indexable pages:

- Unique title.
- Unique meta description.
- Canonical URL.
- Open Graph title/description/image.
- Crawlable internal links.
- Correct locale alternates.
- One visible H1.
- Helpful first-hand product evidence.
- Meaningful image alt text.
- Fast LCP.
- Stable layout.
- No hidden stale CTA or old copy.
- Structured data where appropriate.

For private/protected routes:

- Dashboard/admin/auth must not be publicly indexed.
- Unauthenticated protected routes must redirect.
- Private dashboard/admin content must not appear in public HTML.

For quote pages:

- Decide index policy explicitly.
- Customer-specific quote forms should default toward `noindex` unless a
  deliberate local SEO strategy is approved and private-data risk is reviewed.
- Inactive/unavailable quote pages should not be treated as valuable indexed
  landing pages.

AI search content strategy:

- Keep the product explanation consistent across homepage, features, trust,
  pricing, demo, and support content.
- Use screenshots, workflow examples, and realistic quote-recovery scenarios.
- Build FAQs around real buyer questions:
  - Does BizPilot send messages automatically?
  - Can I review AI drafts first?
  - How does a cleaning quote link work?
  - What happens if quote information is missing?
  - Is BizPilot a CRM?
  - How can a cleaning company reply to quote requests faster?

## Local Growth Standard

BizPilot can later become more valuable by helping cleaning owners improve quote
capture channels.

Future modules:

- Quote-link placement checklist:
  - Website CTA.
  - Google Business Profile.
  - Email signature.
  - Social profile.
  - Invoice/footer.
  - QR/flyer.
- Review freshness reminder.
- Lead source dashboard:
  - Website.
  - Google Business Profile.
  - Facebook/Instagram.
  - Referral.
  - Email.
  - Direct.
  - Unknown.
- UTM/referrer capture:
  - `utm_source`
  - `utm_medium`
  - `utm_campaign`
  - Referrer domain.
  - Quote link placement.

Privacy rule:

Do not store unnecessary PII in analytics or event payloads. Use IDs and safe
source metadata, not raw customer messages, emails, phones, tokens, prompts, or
secrets.

## Analytics Standard

Recommended event names:

- `dashboard_viewed`
- `quote_link_copied`
- `quote_page_preview_opened`
- `lead_queue_opened`
- `lead_queue_filtered`
- `lead_queue_sorted`
- `lead_detail_opened`
- `ai_draft_requested`
- `ai_draft_generated`
- `ai_draft_fallback_shown`
- `ai_draft_copied`
- `lead_status_updated`
- `manual_reply_marked_sent`
- `follow_up_marked_done`
- `missing_info_marked`
- `readiness_task_completed`
- `workspace_language_changed`
- `theme_changed`

Safe properties:

- `business_id`
- `workspace_id`
- `lead_id`
- `role`
- `language`
- `theme`
- `source_channel`
- `status_before`
- `status_after`
- `sla_state`
- `quality_level`
- `ai_provider_status`
- `fallback_used`

Do not include:

- Raw customer contact.
- Raw customer message.
- Auth token.
- Reset link.
- Provider prompt.
- API key.
- Service-role marker.
- Full email or phone unless explicitly approved.

## Accessibility Standard

Minimum target: WCAG 2.2 AA for public and dashboard surfaces.

Checklist:

- Text contrast passes in light and dark.
- Focus indicators are visible and not clipped.
- All controls are keyboard reachable.
- Icon-only actions have accessible names.
- Button/link names are unique and meaningful.
- `details/summary` controls are keyboard tested.
- Language and theme controls are labeled.
- Theme selector uses pressed/selected state semantics.
- Queue search/filter/sort controls have accessible labels.
- Data rows have clear focus/link behavior.
- Form labels are programmatically associated with inputs.
- Errors appear near fields.
- Long forms use an error summary.
- Color is never the only status signal.
- Mobile labels do not truncate into ambiguity.
- French labels fit without hiding meaning.

Specific BizPilot checks:

- `Suspended`, `Inactive`, `At Risk`, `Ready`, `AI Draft Ready`, `No Quote Link`,
  and `Always On` must be understandable without color.
- AI draft areas must say owner review is required.
- Inactive quote-link states must tell the owner what to do next.
- Empty lead queue states must explain how to place or test the quote link.

## Visual System Standard

The product should feel:

- Quiet.
- Operational.
- Trustworthy.
- Compact but not cramped.
- Action-first.
- Human-reviewed.
- Cleaning-business specific.

It should not feel:

- Like a marketing landing page inside the dashboard.
- Like a generic CRM.
- Like an AI autopilot.
- Like a charting demo.
- Like decorative design without workflow value.

Layout rules:

- Use existing dashboard primitives before inventing new UI.
- Keep cards at `8px` or the existing `rounded-lg` standard.
- Do not nest cards inside cards unless the inner card is a repeated item.
- Avoid internal scrollbars except true operational lists/tables.
- Keep `1280x720`, `1366x768`, and `1440x900` first-class.
- Test mobile at `360x800`, `390x844`, and `430x932`.
- Do not use hero-scale type inside dashboard panels.
- Do not use viewport-scaled font sizes.
- Keep badge text short and stable.
- Prefer standard icon libraries over one-off SVGs when expanding iconography.

## QA Standard

Safe commands when available:

```text
pnpm lint
pnpm typecheck
pnpm verify
pnpm smoke:public -- --base-url=<local>
pnpm smoke:responsive -- --base-url=<local>
pnpm smoke:ui-matrix -- --base-url=<local>
pnpm smoke:quote -- --base-url=<local> --inactive-slug=phase1-unavailable-synthetic
git diff --check
```

Run dashboard/auth smoke only against confirmed local/synthetic Supabase because
it creates synthetic auth/workspace/lead data.

Run local DB/RLS tests only against a confirmed local database.

Never run:

- Dashboard smoke against managed non-local Supabase.
- Production data mutation without explicit owner approval.
- Auth/user cleanup with shared owner credentials.
- Real customer workflows before Phase 24G explicit owner approval.

## Readiness Gates

Before real customer data:

- Owner approval recorded.
- Local synthetic dashboard QA passed.
- Quote slug smoke passed.
- Local DB/RLS proof passed.
- Restored app/dashboard/RLS proof decision recorded.
- Support/rollback packet ready.
- No secrets in logs/docs/screenshots.
- Password rotation handled if credentials were shared in chat.

Before paid pilot:

- Real-data gate closed.
- Payment/refund policy ready.
- Support workflow ready.
- Rollback/offboarding workflow ready.
- Production monitoring ready.
- Pilot success/failure criteria written.
- Owner approval recorded separately from real-data approval.

## Immediate Work Queue

Use this order. Do not jump to new feature work before the foundation is clean.

1. Confirm production deploy/cache for the merged `main`.
2. Run public smoke and quote smoke against the deployed domain.
3. Keep dashboard QA local/synthetic until Supabase target is confirmed local.
4. Add this operating standard to the docs index/canonical map if needed.
5. Decide quote-page SEO index policy.
6. Audit public metadata, canonicals, sitemap, robots, and structured data.
7. Add a dashboard design-system note near `components/dashboard/dashboard-ui.tsx`
   or in docs before broad UI expansion.
8. Standardize dashboard icon usage before adding more nav/actions.
9. Create analytics event schema before instrumentation.
10. Keep real data and paid pilot blocked until the documented gates close.

## Definition of Done for New Dashboard Screens

A new dashboard screen is not done until it has:

- One clear primary job.
- One primary action.
- Empty/loading/error states.
- EN/fr-CA copy path.
- Light/dark visual check.
- Mobile and desktop layout check.
- Keyboard path.
- Accessible labels for controls.
- Safe text and color status signals.
- No private data leakage.
- Analytics event decision.
- No unsupported product claim.
- Source/unit guard if behavior is product-critical.
- Screenshot evidence at common viewport.
- Readiness gate note if it touches auth, RLS, data, billing, AI provider, or
  admin mutation.

## Reference Links

Dashboard and data visualization:

- https://www.nngroup.com/articles/dashboards-preattentive/
- https://www.nngroup.com/videos/data-visualizations-dashboards/
- https://www.nngroup.com/articles/choosing-chart-types/
- https://www.nngroup.com/videos/chartjunk/
- https://carbondesignsystem.com/data-visualization/chart-anatomy/
- https://carbondesignsystem.com/data-visualization/chart-types/
- https://carbondesignsystem.com/components/data-table/usage/

SaaS/product marketing:

- https://baymard.com/blog/highlight-saas-ui
- https://baymard.com/blog/saas-website-ux-best-practices
- https://www.hubspot.com/state-of-marketing
- https://www.hubspot.com/marketing-statistics
- https://www.mckinsey.com/capabilities/growth-marketing-and-sales/our-insights/unlocking-the-next-frontier-of-personalized-marketing

SEO and AI search:

- https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- https://developers.google.com/search/docs/appearance/ai-features
- https://developers.google.com/search/docs/fundamentals/ai-optimization-guide
- https://developers.google.com/search/docs/appearance/core-web-vitals
- https://web.dev/articles/vitals
- https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics
- https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
- https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview
- https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag
- https://search.google.com/search-console/about

Local SEO:

- https://business.google.com/us/business-profile/
- https://support.google.com/business/answer/9157481
- https://developers.google.com/search/docs/appearance/structured-data/local-business
- https://schema.org/LocalBusiness
- https://www.brightlocal.com/research/local-consumer-review-survey/
- https://www.brightlocal.com/resources/local-seo-statistics/
- https://whitespark.ca/local-search-ranking-factors/

Accessibility and forms:

- https://www.w3.org/WAI/WCAG22/quickref/
- https://www.w3.org/WAI/tutorials/forms/
- https://www.w3.org/WAI/WCAG21/Understanding/labels-or-instructions.html
- https://webaim.org/projects/million/
- https://design-system.service.gov.uk/components/error-message/
- https://design-system.service.gov.uk/components/error-summary/
- https://www.nngroup.com/articles/errors-forms-design-guidelines/
- https://www.nngroup.com/articles/error-message-guidelines/

Human-AI UX:

- https://pair.withgoogle.com/guidebook/
- https://www.microsoft.com/en-us/haxtoolkit/ai-guidelines/
- https://fluent2.microsoft.design/responsible-AI
- https://www.ibm.com/design/ai/
- https://www.ibm.com/design/ai/ethics/explainability/
- https://carbondesignsystem.com/components/ai-label/usage/

Design systems and admin patterns:

- https://fluent2.microsoft.design/
- https://fluent2.microsoft.design/layout
- https://fluent2.microsoft.design/accessibility
- https://polaris-react.shopify.com/components/layout-and-structure/empty-state
- https://shopify.dev/docs/api/app-home/patterns/compositions/index-table
- https://polaris-react.shopify.com/components/selection-and-input/index-filters
- https://atlassian.design/components/empty-state
- https://carbondesignsystem.com/patterns/empty-states-pattern/

Product analytics:

- https://amplitude.com/blog/product-north-star-metric
- https://amplitude.com/north-star-hub
- https://mixpanel.com/blog/what-is-product-management-analytics/
- https://docs.mixpanel.com/guides/strategic-playbooks/guide-to-product-analytics/retain-your-users

## Final Recommendation

Move forward with standardization before expansion.

The next best product move is one coherent, tested, accessible, bilingual,
light/dark-stable command center that makes the owner next action obvious.

Do not cross into real data, paid pilot, auth/RLS mutation, billing, AI provider
changes, or production admin deletion without the documented gates.
