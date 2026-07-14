# V3 Final Information Architecture

Date: 2026-07-13

Status: approved Phase 2 implementation contract

Canonical content source: `lib/i18n/public-v3-spec.ts`

## Decision

The public website will tell one story: service teams receive vague questions in many places, share one Smart Intake Link in those same places, receive an organized request, and review the prepared reply before sending it themselves.

The site keeps ten public marketing/legal routes, one compact header, one short resource menu, and a maximum seven-section homepage. Duplicate educational pages are merged through permanent redirects instead of being deleted without traffic evidence.

## Audience and decision path

### Primary decision maker

An owner or operating manager at a local service business who still feels the cost of every incomplete request and repeated follow-up.

### Daily user

An owner, sales lead, office coordinator, dispatcher, or support teammate who must understand what the customer needs and prepare the next responsible response.

### Primary journey

1. Recognize the problem on `/`.
2. Understand Share → Ask → Organize → Review on `/#how-it-works`.
3. Inspect a safe cleaning example on `/demo`.
4. Confirm boundaries and fit on `/faq`, `/trust`, and `/pricing`.
5. Prepare a founder-pilot request on `/pilot`.

The primary action is learning the workflow until the visitor reaches a high-intent page. The primary action then becomes applying for the pilot. Sign in remains available for existing users but does not compete with the public conversion path.

## Retained route map

| Route | One job | Primary visitor question | Primary conversion | Supporting route |
| --- | --- | --- | --- | --- |
| `/` | Explain the complete pain-to-outcome story | Is this the problem my team has, and how does BizPilot help? | See how it works | Founder pilot |
| `/features` | Explain the six present-tense product capabilities | What exactly happens between the link and my reply? | Walk through the demo | Founder pilot |
| `/demo` | Prove the workflow with one safe cleaning scenario | What would this look like on a real request? | Start the walkthrough | Product features |
| `/pricing` | Set approved pilot price and billing expectations | What could the pilot cost and when would I pay? | Apply for the pilot | FAQ |
| `/pilot` | Qualify and prepare the founder-pilot request | Is my cleaning business a fit, and what happens next? | Prepare my pilot request | Pricing |
| `/faq` | Resolve practical objections without sales fog | Does it integrate, send, quote, book, store, or charge automatically? | See the workflow | Founder pilot |
| `/trust` | Explain human control, AI boundaries, and data minimization | What is automated and what remains under my control? | Review security | Privacy |
| `/privacy` | Provide the current readable privacy policy | What data is handled and what choices exist? | View trust overview | Security |
| `/security` | Provide factual current safeguards and disclosure path | What safeguards and operational limits exist now? | View trust overview | Privacy |
| `/terms` | State website and pilot responsibilities and gates | What rules apply before a pilot or production use? | Review pilot pricing | Privacy |

Auth, dashboard, founder/admin, quote, and customer-intake routes remain application routes. They are not rewritten as marketing pages and are not exposed as top-level public navigation beyond `Sign in` and the contextual Smart Intake demonstration.

## Complete route disposition

| Route or group | Decision | Indexing | V3 treatment |
| --- | --- | --- | --- |
| `/`, `/features`, `/demo`, `/pricing`, `/pilot`, `/faq`, `/trust` | KEEP | Index | Give each the distinct job and CTA pair above. |
| `/privacy`, `/security`, `/terms` | KEEP | Index | Preserve as readable factual legal/trust destinations. |
| `/comparison` | MERGE + REDIRECT | Destination indexes | Move the focused-scope boundary into `/features#focused-by-design`. |
| `/quote-link-guide` | MERGE + REDIRECT | Destination indexes | Move link placement into `/features#share-anywhere`. |
| `/faster-quote-replies` | MERGE + REDIRECT | Destination indexes | Move the workflow outcome into `/#how-it-works`. |
| `/content-studio` | MERGE + REDIRECT | Destination indexes | Move bounded draft assistance into `/features#reply-drafts`. |
| `/industries/cleaning` | MERGE + REDIRECT | Destination indexes | Consolidate the validated example into `/demo`. |
| `/quote`, `/quote/[slug]`, `/quote/[slug]/success` | KEEP + NOINDEX | Noindex | Preserve the existing public intake flow and its existing noindex metadata; do not redesign or open customer data. |
| `/auth/*` | KEEP + NOINDEX | Existing noindex | Preserve existing account entry/recovery behavior and localized metadata. |
| `/dashboard/*`, `/founder`, `/admin` | KEEP PROTECTED | Not public discovery | No Dashboard V3 redesign, access mutation, or public-nav exposure. |
| Any route not listed above | NO ACTION | Existing behavior | Do not infer removal or create a route without evidence. |

No route receives a hard REMOVE decision in V3. The evidence supports consolidation with reversible redirects, not destructive deletion.

## Homepage story

The homepage has exactly seven meaningful sections:

1. Hero: audience, pain, mechanism, outcome, and human-approval boundary.
2. Problem: short channel-labelled examples of vague questions.
3. Workflow: Share → Ask → Organize → Review.
4. Outcomes: complete request, visible gaps, review draft, clear next action.
5. Cleaning demo: one safe end-to-end example.
6. Trust: human control and honest limits.
7. Final CTA: demo first, founder pilot second.

Proof rails, logos, small callouts, and section headers do not become extra sections. Repeated roadmap disclaimers are removed; each limitation appears once where the visitor expects it.

## Global header

### Desktop order

1. BizPilot brand → `/`
2. Product → `/features`
3. How it works → `/#how-it-works`
4. Demo → `/demo`
5. Pricing → `/pricing`
6. Resources menu → `/faq`, `/trust`
7. Language control
8. Theme control
9. Sign in
10. Apply for pilot

The header has one responsive breakpoint based on available width, not a breakpoint that exposes a cluster wider than the viewport. Utility controls remain compact and accessible by name.

### Mobile order

The closed header shows brand, language, theme, and menu trigger. The opened menu shows all navigation and both account/pilot actions in one page-level panel without a nested first-viewport scrollbar. The menu closes on route selection and Escape, restores focus, locks background scroll only while open, and never creates horizontal overflow.

## Global footer

The footer uses four short groups:

- Product: Product, How it works, Demo, Pricing.
- Company: Pilot, FAQ, Trust.
- Legal: Privacy, Security, Terms.
- Existing users: Sign in.

It includes one concise product boundary: BizPilot prepares organized requests and reply drafts for human review; it does not send customer messages automatically. No full navigation duplicate, fake location, fake social profile, or unsupported certification badge is added.

## CTA hierarchy

| Context | Primary | Secondary |
| --- | --- | --- |
| Homepage hero | See how it works | Apply for the founder pilot |
| Product education | Walk through the demo | Apply for pilot |
| Demo | Start the walkthrough | Explore the product |
| Pricing | Apply for the pilot | Read common questions |
| Pilot | Prepare my pilot request | Review pilot pricing |
| FAQ | See the workflow | Apply for pilot |
| Trust/legal | Read the next relevant trust document | Return to the trust overview or pricing |

Primary buttons are solid. Secondary buttons are quiet outlined/text actions. A section may not introduce a third competing button unless it is a small contextual text link.

## Language and URL contract

- Supported website languages are `en` and `fr-CA`.
- English uses clean canonical public URLs.
- French preserves `?language=fr-CA` until a future locale-path migration is deliberately approved.
- Every internal marketing link uses the shared locale-aware helper.
- A language change replaces any existing `language` query instead of copying the stale value.
- Cookie, query, rendered copy, selected control state, metadata, and `<html lang>` must agree after navigation and reload.
- Hashes and unrelated query parameters are preserved when safe.
- Both languages expose the same routes, section order, capabilities, FAQs, trust topics, prices, and control boundaries.

## Content governance

- `lib/i18n/public-v3-spec.ts` is the executable Phase 2 source for route metadata, hero copy, homepage story, demo content, prices, pilot steps, FAQs, and trust principles.
- UI components consume content; they do not fork independent English and French trees.
- New claims require proof and bilingual copy in the same change.
- Future service categories must be labelled as future until a complete approved template and demo exist.
- No copy may imply direct social inbox ingestion, auto-send, automatic quotes, booking, invoicing, payments, a full CRM, or unsupported compliance.

## Definition of done

- Every retained route has a unique job, title, description, and CTA pair.
- Homepage contains seven sections and no repeated mechanism section.
- Header, footer, sitemap, canonicals, and redirects match this document.
- EN and fr-CA pass structural parity tests.
- Duplicate routes redirect permanently and preserve locale intent.
- Mobile and desktop have no horizontal overflow or nested first-viewport scrolling.
