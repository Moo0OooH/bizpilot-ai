# V3 Route Consolidation and Redirect Plan

Date: 2026-07-13

Status: approved for implementation in Phase 6

## Safety decision

Public search currently exposes stale homepage content but did not provide evidence that the secondary routes below have independent demand. No private analytics, Search Console, or backlink platform was opened. Therefore V3 will merge duplicate pages through permanent redirects, not hard-delete URLs or assume they have no value.

## Redirect matrix

| Current route | Decision | Permanent destination | Why this destination is stronger |
| --- | --- | --- | --- |
| `/comparison` | Merge | `/features#focused-by-design` | The comparison story is a product-scope boundary, not a separate buying journey. |
| `/quote-link-guide` | Merge | `/features#share-anywhere` | Link-placement education belongs beside the core “one link, shared anywhere” capability. |
| `/faster-quote-replies` | Merge | `/#how-it-works` | Faster preparation is the outcome of the main workflow, not a separate product. |
| `/content-studio` | Merge | `/features#reply-drafts` | The current value is bounded reply-draft preparation, not an independent content suite. |
| `/industries/cleaning` | Merge | `/demo` | Cleaning is the validated pilot example; the demo proves it more clearly than another landing page. |

## Retained destinations

Destinations must contain the named anchors before redirects ship:

- `/#how-it-works`
- `/features#focused-by-design`
- `/features#share-anywhere`
- `/features#reply-drafts`
- `/demo`

If an anchor is unavailable at implementation time, redirect to the destination route without a fragment rather than creating a broken jump.

## Redirect behavior

- Use a framework-supported permanent redirect at the route/config layer after reading the installed Next.js redirect guide.
- Preserve `language=fr-CA` and unrelated safe query parameters.
- Remove or replace an existing stale `language=en` value when the active language is French.
- Preserve the destination fragment defined above; do not copy an obsolete source fragment over it.
- Do not create redirect chains. Every old route points directly to its final retained route.
- Redirects apply to direct navigation, refresh, and crawlers—not only client-side clicks.
- Keep one canonical URL per retained page. French metadata uses the localized URL convention already approved for V3.

## Navigation and discovery changes

After redirects pass tests:

- Remove merged routes from header, footer, related-link cards, and sitemap.
- Replace any in-copy links with the final destination and anchor.
- Keep redirect rules so old bookmarks and external links continue to work.
- Do not list redirect-only routes in the V3 content spec.
- Ensure no retained route canonically points to a redirecting route.

## Content migration

Only distinct, truthful material moves:

- Comparison: keep a compact “Focused by design” boundary explaining that BizPilot complements existing channels and is not a full inbox/CRM.
- Quote link guide: keep placement examples—website, social bio, saved reply, Google profile, email signature, QR code, and direct message.
- Faster replies: keep the result of complete requests and human-reviewed drafts; remove speed guarantees and duplicate mechanism copy.
- Content studio: keep reply-draft and FAQ-context capability; remove any impression of a general content-generation product.
- Cleaning industry: keep the single move-out cleaning scenario, questions, organized result, missing detail, and manual review boundary in `/demo`.

## Validation matrix

For every source route, test:

1. HTTP status/redirect semantics are permanent.
2. Destination is direct and correct.
3. EN and `?language=fr-CA` preserve the intended language.
4. Destination anchor exists and receives focus/scroll without hiding beneath the sticky header.
5. Query strings do not reintroduce the language-switch defect.
6. Header, footer, sitemap, and internal-link scans contain no obsolete route.
7. No redirect loop or chain exists.
8. Metadata and canonical tags belong to the destination page.

## Rollback

Redirect rules are reversible code changes. No database record, customer data, Supabase policy, migration, or production access state is modified. If verified traffic evidence later proves that a source route needs a unique job, it can be restored with new bilingual content and a deliberate canonical update.
