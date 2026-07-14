# V3 Research and Benchmark Audit

Date: 2026-07-13

Scope: current official SaaS patterns, live BizPilot production, current `origin/main`, and installed Next.js 16.2.4

UI implementation in this phase: none

## Executive decision

BizPilot does not need a visually louder website. It needs a shorter, more legible explanation of one honest mechanism:

> Customers ask incomplete questions in many places. The business shares one Smart Intake Link in those same places. BizPilot collects the right details, organizes the request, and prepares a reply that a person reviews and sends.

The existing site already contains the product truth, but it makes visitors assemble that truth from an oversized hero, a documentation-like product panel, 12 sections, multiple roadmap disclaimers, and duplicate explanations. The V3 rebuild should reduce decision load and let a readable three-stage product scene carry the explanation.

## Method

### Official references inspected

- [Respond.io](https://respond.io/)
- [Intercom](https://www.intercom.com/)
- [Typeform](https://www.typeform.com/)
- [Crisp](https://crisp.chat/en/)
- [Front](https://front.com/)
- [Jobber](https://www.getjobber.com/)
- [Google Web Vitals](https://web.dev/articles/vitals)
- [Google INP optimization guide](https://web.dev/articles/optimize-inp)

The first six were inspected as current official marketing sites. Desktop and mobile DOM geometry was sampled in Chrome where the site allowed it. Jobber's browser presentation blocked the automated visual pass, so its current official page content was inspected through the public web response instead.

### BizPilot evidence methods

- Real menu clicks on production, not direct-URL checks alone.
- Direct EN and fr-CA pages for parity and layout inspection.
- Chrome viewport overrides at 320, 360, 390, 430, 768, 1024, 1280, 1440, and 1920.
- Light, dark, and emulated reduced-motion checks.
- DOM width and H1 geometry measurements.
- Browser console and network inspection.
- Lighthouse 13.4.0 lab runs against production.
- Source inspection of routing, proxy cookie behavior, Server Action, header/menu, copy modules, metadata, tests, and CSS ownership.

## Transferable benchmark findings

| Reference | First-screen structure | CTA hierarchy | Product proof | Transferable principle | Do not copy |
| --- | --- | --- | --- | --- | --- |
| Respond.io | Opens with the communication problem: chat, calls, and email; asks whether the team can keep up | Two peer CTAs: sales and trial | Interactive tour and large product evidence follow | Lead with recognizable disorder before the mechanism; keep one sentence for the category outcome | Omnichannel inbox claims, logos, proprietary framework, visual identity |
| Intercom | One category statement, short paragraph, two CTAs | Trial primary, demo secondary | Large product visuals immediately below | A specific category sentence plus product imagery can replace a long feature preamble | AI-agent category claims and image treatment |
| Typeform | Very short proposition and a single main action | One dominant free-start CTA | The adaptive form itself is the proof | Make the intake experience visible and understandable, not a miniature dashboard | Automation, payments, or follow-up claims BizPilot does not support |
| Crisp | Short promise, three compact pillars, one product screenshot, trust after hero | One dominant acquisition action | Screenshot/video directly beneath the promise | Compact pillars can clarify scope without creating another full section | Auto-resolution percentages, omnichannel and CRM claims |
| Front | A strong pain contrast followed by three problem statements | Demo and trial | Large UI plus pain-led section | Name the operational cost plainly, then show the controlled system response | Complex-operations positioning and enterprise density |
| Jobber | Plain small-business outcome with two direct next steps | Trial primary, plan/pricing secondary | Service-business people and product evidence | Speak at the owner's altitude; use concrete work outcomes rather than internal software jargon | All-in-one business-management scope and unsupported proof metrics |

## Measured first-screen patterns

The measurement is directional, not a cross-site performance ranking. Each site has different scripts, experiments, consent layers, and business maturity.

| Site | Desktop H1 | Desktop H1 lines | Mobile H1 lines | Page height observed | Desktop overflow |
| --- | ---: | ---: | ---: | ---: | ---: |
| Respond.io | 60px | 2 | 5 | 7,353px | 0 |
| Intercom | 80px | 3 | 3 | 14,985px | 0 |
| Typeform | Visual H2-led hero | n/a | n/a | 8,712px | 0 |
| Crisp | 48px | 3 | 4 | 11,022px | 0 |
| Front | 62px | 2 | 7 | 11,853px | 0 |
| BizPilot current | 73.44px at 1440 | 8 | 5 at 390 | 6,782px main content | 56px at requested 1280 |

The useful conclusion is not that every reference is short. It is that their first screens normally state one idea in two to four desktop lines and make the next action obvious. BizPilot's page is shorter in pixels than several mature competitors, yet feels longer because the first idea occupies too much vertical space and later sections restate it.

## Recommended information and visual direction

### First five seconds

The visitor should be able to answer four questions without scrolling:

1. Is this for a service business team receiving many customer questions? Yes.
2. What is going wrong? Messages are inconsistent and missing the details needed to reply.
3. What does BizPilot do? One link asks the right questions and organizes the request.
4. Who sends the answer? A human reviews, edits, copies, and sends it.

### Hero composition

- Copy column: 44–48%, max readable line length, H1 normally 3–4 desktop lines.
- Visual column: 52–56%, code-native, large labels, no tiny dashboard recreation.
- Stage 1: short channel-labelled questions, explicitly framed as places the link can be shared.
- Stage 2: one Smart Intake Link and 2–3 readable questions.
- Stage 3: organized request, visible missing/completed state, concise draft, Review/Edit/Copy.
- One primary CTA: see how it works or demo.
- One secondary CTA: founder pilot.
- Three compact proof statements, not another feature section.

### Seven-section narrative ceiling

1. Pain + outcome + mechanism hero.
2. The real problem.
3. Share → Ask → Organize → Review.
4. What the team gets.
5. Cleaning pilot example.
6. Human control and trust.
7. Final conversion.

### Visual system direction

- Calm light-first surfaces with a verified dark mode, not a permanently dark sales page.
- One blue action family, restrained teal for completeness/control, warm amber for missing detail.
- One variable sans with French glyph coverage; keep existing self-hosted Geist unless visual testing proves a need to change it.
- 1180–1240px content shell and 8px spacing rhythm.
- Fewer, larger cards; avoid nested border stacks.
- Purposeful motion only. The static final state must tell the full story.

## Performance research decision

[Google's current thresholds](https://web.dev/articles/vitals) remain LCP at or below 2.5 seconds, INP at or below 200ms, and CLS at or below 0.1 at the 75th percentile, segmented by mobile and desktop. Lighthouse cannot measure field INP; TBT is only a lab proxy. The [INP guide](https://web.dev/articles/optimize-inp) recommends diagnosing the actual interaction and separating input delay, processing, and presentation delay.

For BizPilot this means:

- Preserve Server Components for marketing content.
- Keep locale/theme/menu as small client islands.
- Avoid a large animated hero or first-viewport video.
- Measure the language click itself; a high static Lighthouse score cannot compensate for a broken click.
- Treat browser interaction tests and numeric overflow checks as release gates.

## Current production baseline

### Lighthouse

| Mode | URL | Perf | A11y | Best practices | SEO | LCP | TBT | CLS | Transfer | Requests |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Mobile | `/?language=en` | 98 | 100 | 100 | 100 | 2.4s | 70ms | 0 | 272KiB | 22 |
| Desktop | `/?language=fr-CA` | 100 | 100 | 100 | 100 | 0.6s | 10ms | 0 | 282KiB | 36 |

Lab artifacts:

- `artifacts/rebuild-v3/baseline/lighthouse-home-en-mobile.json`
- `artifacts/rebuild-v3/baseline/lighthouse-home-fr-desktop.json`

The first Lighthouse launch attempt failed on Windows with `EPERM` while Lighthouse tried to remove its temporary profile. The successful runs used the same Lighthouse version connected to a controlled local headless Chrome profile. The failure is recorded as tool behavior, not a site failure.

### Network and runtime sample

- 34 HTTP 200 responses observed in the sampled cold reload.
- About 311,676 encoded bytes observed through CDP.
- 9 script responses, 3 stylesheets, 2 fonts, 1 image, and 14 fetch responses.
- No failed response.
- No application console warning or error in the sampled flow.

This rejects a simplistic "the page is slow because it is huge" diagnosis. The more actionable problems are broken locale submission, too much first-screen content, header overflow, deep mobile navigation, and too many repeated route/link surfaces.

## Source audit

### Current public surface

Canonical marketing/legal routes in `lib/seo.ts` include:

`/`, `/faq`, `/comparison`, `/quote-link-guide`, `/faster-quote-replies`, `/features`, `/industries/cleaning`, `/trust`, `/demo`, `/pricing`, `/pilot`, `/privacy`, `/security`, and `/terms`.

`/content-studio` exists but is intentionally excluded from canonical indexing. Auth and dynamic quote routes remain utility/product routes.

### Locale architecture

- Locale is selected from a `language` query or the `bizpilot-interface-language` cookie.
- `proxy.ts` writes a supported query locale into the request and response cookie.
- Public pages render dictionaries on the server.
- `publicHref` adds `language=fr-CA` to internal links but leaves English links clean.
- Root `<html lang>` is derived from the cookie in `app/layout.tsx`, while page copy may be derived from the query. A broken transition can therefore create disagreement.

### Confirmed language root cause

`components/public/marketing-language-menu.tsx`:

1. Renders each locale as a submit button whose `name="language"` and `value` live on the submitter.
2. Runs `syncRedirectTarget()` in `onSubmit`, copying the current path, query, and hash.
3. Immediately closes the menu in that same `onSubmit` path.
4. Calls `setInterfaceLanguageAction`, which writes the cookie and redirects to the copied target.

If the old target contains `language=en`, `proxy.ts` treats it as authoritative and writes EN back over the FR cookie. Independently, synchronously closing the menu removes the submitter from the rendered tree while submission is being processed, leaving a fragile dependency on event/FormData timing.

### Why earlier acceptance missed it

- `marketing-header-source.test.mts` checks for `aria-haspopup`, `menuitemradio`, a hash reference, and label dictionaries.
- `public-language-links.test.mts` checks pure href generation.
- Public smokes fetch direct fr-CA URLs and inspect returned HTML.
- No checked-in browser test opens the visible menu, clicks FR, asserts French text and selected state, follows a link, reloads, and switches back.

The test suite proved that French content existed and that source contained expected patterns. It did not prove that the user interaction worked.

### Layout root causes

- Desktop header content is enabled at `min-[1240px]` even though the full content set overflows at 1280.
- The brand can reserve a 16rem minimum width; the right utility cluster is about 414px wide at 1280.
- The H1 font continues growing while the copy column stays near 432px at large screens.
- Homepage CSS is split between an 86KiB global file and a 23KiB homepage module, with many V2-specific selectors and visual layers.
- The public header exposes Product, How it works, Use cases, Resources, Pricing, Trust, Sign in, language, theme, and pilot CTA, exceeding the navigation needs of the current product.

## Search and route evidence

Public search for `site:bizpilo.com` surfaced the homepage in stale V1/V2 forms but did not surface independent evidence for the secondary routes. This is not proof that no backlinks exist. No private analytics or backlink service was accessed. V3.2 should therefore keep useful content, merge duplicates, and issue permanent redirects rather than deleting routes without evidence.

## Final V3.1 recommendations

1. Use the package's pain-led hero and seven-section architecture.
2. Treat language switching as P0 and make the selected locale deterministic in the destination URL.
3. Replace source-only locale tests with real browser interaction coverage.
4. Collapse header navigation to Product, How it works, Demo, Pricing, Resources, Sign in, and one pilot CTA; Trust belongs in contextual/footer navigation.
5. Merge comparison, quote-link, faster-replies, Content Studio, and cleaning landing content only after a route/SEO decision table is approved.
6. Keep light and dark modes because both currently work, but simplify the shared palette and test both.
7. Do not add stock photography, autoplay video, third-party scripts, direct-inbox claims, testimonials, or fabricated results.
