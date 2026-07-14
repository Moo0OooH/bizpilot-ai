# BizPilot Universal Intake V2 — Source of Truth

**Date:** 2026-07-13
**Status:** Implementation complete on review branch; production release remains owner-gated
**Repository:** `Moo0OooH/bizpilot-ai`
**Branch:** `agent/universal-customer-intake-v2`
**Pull request:** Draft PR #2

---

## 1. Final product definition

BizPilot is a **Smart Customer Intake & Reply Workspace for local service businesses**.

The product helps a business:

1. share one smart customer-intake link;
2. collect service-aware request details;
3. organize the request into one clear lead record;
4. surface missing information;
5. prepare an AI-assisted summary and reply draft;
6. keep final review, editing, pricing, promises, and sending under the owner’s control.

### Launch focus

The product core is designed to expand across local service businesses. **Cleaning is the first complete template, demo, and founder-pilot market.**

Cleaning is therefore a validation gate, not the permanent category definition and not a decorative example.

---

## 2. Current product versus roadmap

### Current and permitted public claims

- one branded smart intake link;
- placement on the website, Google Business Profile, social profile or saved reply, and email signature;
- mobile-friendly, service-aware intake forms;
- source and service context;
- organized customer request or lead record;
- missing-information detection;
- AI-assisted request summary;
- AI-assisted reply or follow-up draft;
- owner review and editing;
- manual copy and send through the real customer channel;
- visible manual follow-up state;
- cleaning-specific pilot templates;
- founder-led pilot setup;
- staged, manually approved pilot pricing.

### Roadmap only — never present as active

- direct Gmail synchronization;
- direct WhatsApp integration;
- direct Instagram or Messenger integration;
- direct SMS integration;
- unified multichannel inbox;
- automatic customer-message sending;
- automatic follow-up sending;
- autonomous pricing;
- automatic availability promises;
- automatic booking confirmation;
- payment collection or in-app billing automation;
- invoicing;
- full CRM replacement;
- production-ready templates for HVAC, plumbing, painting, landscaping, or other verticals.

Every roadmap item must remain visibly labeled **Roadmap**, **Future template**, or equivalent Canadian French wording.

---

## 3. Non-negotiable AI and operating boundaries

### AI may

- summarize information actually present in the request;
- use approved business context;
- identify missing fields;
- prepare a draft response or clarification question;
- make the owner’s next manual action easier to see.

### AI may not

- invent a price, discount, crew size, duration, or availability;
- promise that work is accepted;
- confirm a reservation;
- collect payment;
- send a message automatically in the current pilot;
- make an exclusively automated customer-impacting decision;
- hide uncertainty or missing information.

### Human-control rule

> AI reads and prepares. The owner reviews, decides, and sends.

The manual workflow must remain usable when AI assistance is unavailable.

---

## 4. Final homepage narrative

The homepage follows one conversion story:

1. **Problem:** customer requests are valuable but often vague, incomplete, and scattered across unclear entry points;
2. **Current solution:** share one smart intake link rather than pretending every inbox is already integrated;
3. **Workflow:** Share → Collect → Organize → Prepare → Approve;
4. **Human control:** nothing is sent without the owner;
5. **Daily operating value:** clearer requests, visible missing information, reviewable drafts, visible manual follow-up;
6. **Expansion logic:** universal service-business core, cleaning-first validation, other verticals labeled roadmap;
7. **Capabilities:** current product functions only;
8. **Conversion:** cleaning demo and founder-pilot application.

### Final English hero

**Turn scattered customer requests into clear, ready-to-review replies.**

BizPilot gives service businesses one smart intake link, organizes every request, shows what is missing, and prepares an AI-assisted reply for the owner to review and send — starting with cleaning businesses.

### Final Canadian French hero

**Transformez les demandes dispersées en réponses claires, prêtes à vérifier.**

BizPilot donne aux entreprises de services un lien intelligent, organise chaque demande, montre ce qui manque et prépare un brouillon assisté par l’IA que le propriétaire vérifie et envoie — en commençant par les entreprises d’entretien.

---

## 5. Public route architecture

### Core V2 routes

| Route | Purpose |
|---|---|
| `/` | Universal product story and primary conversion page |
| `/features` | Current product capabilities and explicit roadmap boundary |
| `/demo` | Concrete cleaning request → organized lead → owner-reviewed reply demonstration |
| `/industries/cleaning` | First complete vertical and six pilot-ready cleaning request types |
| `/comparison` | Position between generic forms and later-stage CRM, booking, or invoicing tools |
| `/pricing` | Approved staged founder-pilot pricing and manual billing gates |
| `/pilot` | Founder-pilot fit, process, approval gate, and manual email-draft application path |
| `/trust` | Human oversight, data discipline, truthful scope, and production gates |
| `/faq` | Current product, AI, roadmap, cleaning-first launch, and category objections |

### Supporting routes retained

| Route | Status |
|---|---|
| `/quote-link-guide` | Cleaning-focused practical guide, using the unified V2 navigation |
| `/faster-quote-replies` | Cleaning-focused educational guide, using the unified V2 navigation |
| `/content-studio` | Roadmap page; no claim that Content Studio is active |
| `/privacy` | Policy page with unified V2 navigation |
| `/security` | Policy and release-gate page with unified V2 navigation |
| `/terms` | Founder-pilot terms with unified V2 navigation |

---

## 6. Localization decision

Supported public languages:

- English (`en` / Canadian English positioning);
- Canadian French (`fr-CA`).

The Canadian French V2 is a complete independent copy set. It must not inherit English sections through object spreads or fallback text.

Localization includes:

- hero and homepage sections;
- product, demo, pricing, pilot, trust, comparison, cleaning, and FAQ pages;
- metadata;
- CTA labels;
- navigation and footer;
- roadmap labels;
- AI and human-control boundaries;
- approved pilot pricing presentation;
- punctuation and French accents.

A dedicated unit test blocks English section leakage and verifies core Canadian French terminology.

---

## 7. Pricing source of truth

### Businesses 1–5 — Founder Feedback Pilot

- **$0 setup**;
- founder-led validation;
- structured feedback required at agreed checkpoints.

### Starter Pilot

- **$149 setup + $49/month**;
- manual billing only after approval.

### Pro Pilot

- **$199 setup + $79/month**;
- manual billing only after approval.

### Billing boundary

- no self-serve checkout;
- no automatic subscription activation;
- no in-app billing automation claim;
- payment, if approved, uses a manual invoice or Stripe Payment Link;
- scope, support, cancellation, refund handling, and payment method are confirmed before a paid pilot begins.

---

## 8. Visual and interaction system

### Hero visual

The hero visual shows the real current workflow rather than decorative channel integration claims:

- possible link placements;
- smart intake request;
- organized workspace;
- missing fields;
- AI-assisted draft;
- Review / Edit / Copy / Send manually actions.

### Motion rules

- motion explains product flow;
- no decorative infinite motion that obscures content;
- animation runs only under `prefers-reduced-motion: no-preference`;
- content and conversion remain understandable with motion disabled.

### Responsive rules

- mobile-first layout;
- no `100vw`, `100vh`, `w-screen`, `h-screen`, or page-level horizontal clipping fixes;
- no nested-scroll content panels on public pages;
- semantic design tokens support light and dark appearance;
- compact navigation remains the intentional viewport-safe scrolling exception.

---

## 9. SEO and structured data

Implemented:

- localized canonical metadata;
- Open Graph image aligned with V2 positioning;
- Organization, WebSite, SoftwareApplication, and Service JSON-LD;
- FAQPage JSON-LD for the dedicated FAQ route;
- BreadcrumbList JSON-LD on supporting routes;
- current-product wording in structured data;
- cleaning identified as the first complete founder-pilot vertical;
- no structured-data claim for active inbox integrations, booking, invoicing, or CRM replacement.

Structured data is descriptive. It does not guarantee indexing, ranking, rich results, or AI-search inclusion.

---

## 10. Research and standards anchors

These sources inform product and UX direction; they are not used to claim legal certification or compliance.

### Responsible AI and human oversight

- NIST AI Risk Management Framework: <https://www.nist.gov/itl/ai-risk-management-framework>

Applied product choices:

- explicit human review;
- visible uncertainty and missing information;
- narrow current-product claims;
- recoverable manual fallback;
- documented production gates.

### Accessibility

- W3C Web Content Accessibility Guidelines (WCAG) 2.2: <https://www.w3.org/TR/WCAG22/>

Applied product choices:

- keyboard-safe navigation;
- semantic structure;
- visible focus and accessible control labels through existing shared primitives;
- reduced-motion support;
- responsive text and control layouts;
- no essential meaning communicated only by animation.

### Canadian privacy principles

- Office of the Privacy Commissioner of Canada — PIPEDA fair information principles: <https://www.priv.gc.ca/en/privacy-topics/privacy-laws-in-canada/the-personal-information-protection-and-electronic-documents-act-pipeda/p_principle/>
- Québec private-sector privacy law: <https://www.legisquebec.gouv.qc.ca/en/document/cs/P-39.1>

Applied product choices:

- purpose-limited intake fields;
- no unnecessary personal data in source tags;
- privacy and production review before real customer data;
- no claim that local test data authorizes production processing;
- no exclusively automated customer decision in the current workflow.

Legal applicability and final production compliance require qualified review before onboarding real customers.

---

## 11. Validation gates

The branch must not be declared releasable unless all of the following pass on the final clean commit:

1. `pnpm lint`
2. `pnpm typecheck`
3. complete Node unit-test suite
4. `pnpm build`
5. V2 positioning and roadmap guard tests
6. Canadian French completeness tests
7. public visual/source stability tests
8. SEO and structured-data source tests
9. CI workflow remains read-only after temporary migration tooling is removed
10. no temporary patch scripts or temporary write-enabled workflow remains in the final diff.

### Browser and preview acceptance still required before production merge

- Vercel preview is Ready;
- desktop and mobile first fold reviewed in EN and fr-CA;
- compact navigation reviewed at narrow widths;
- light and dark appearance reviewed;
- all primary CTAs resolve to the intended route;
- pilot copy and email-draft actions work;
- metadata and JSON-LD render without runtime errors;
- no horizontal overflow;
- no production Supabase mutation;
- no real customer data used for smoke testing.

---

## 12. Release authority

This work may be committed and presented through a Draft Pull Request.

It does **not** authorize:

- merging to `main` without owner review;
- production deployment approval;
- managed Supabase schema or data mutation;
- real customer data processing;
- paid pilot activation;
- automatic billing;
- production channel integrations.

The owner must explicitly approve visual acceptance, scope, privacy posture, production readiness, and merge/deployment.

---

## 13. Final acceptance statement

The V2 public product story is accepted only when the entire site communicates one consistent truth:

> BizPilot gives service businesses one smart way to collect a customer request, organize what is missing, and prepare a better reply — while the owner remains responsible for every business decision and every message sent.
