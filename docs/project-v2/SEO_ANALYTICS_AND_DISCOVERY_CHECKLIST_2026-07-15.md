<!--
 * ============================================================
 * File: docs/project-v2/SEO_ANALYTICS_AND_DISCOVERY_CHECKLIST_2026-07-15.md
 * Project: BizPilot AI
 * Description: Current SEO, structured-content, Core Web Vitals, and no-PII measurement operating checklist.
 * Role: Consolidates superseded Phase 25 discovery reports without claiming indexing, ranking, or analytics activation.
 * Related:
 * - lib/seo.ts
 * - lib/public-events.ts
 * - lib/public-structured-data.ts
 * Author: MoOoH
 * Created: 2026-07-15
 * Last Updated: 2026-07-15
 * Change Log:
 * - 2026-07-15: Consolidated indexing, FAQ/AI-search, CWV, and no-PII analytics guidance into one current checklist.
 * ============================================================
 -->

# BizPilot SEO, Analytics, and Discovery Checklist — 2026-07-15

## Current source posture

- `lib/seo.ts` owns the ten canonical routes, canonical URLs, `en-CA`/`fr-CA`/`x-default` alternates, Open Graph, and Twitter metadata.
- `app/sitemap.ts` publishes only real public marketing/legal routes.
- `app/robots.ts` protects Auth, Dashboard, Founder/Admin, and quote-intake paths.
- Auth and quote-intake pages use noindex metadata.
- Visible FAQ answers and FAQPage JSON-LD use the same bilingual source.
- `lib/public-events.ts` defines a safe event catalog but `trackPublicEvent` remains an intentional no-op.

## Official reference baseline

- Sitemap: `https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap`
- robots.txt: `https://developers.google.com/search/docs/crawling-indexing/robots/intro`
- Mobile-first indexing: `https://developers.google.com/search/docs/crawling-indexing/mobile/mobile-sites-mobile-first-indexing`
- Core Web Vitals: `https://developers.google.com/search/docs/appearance/core-web-vitals`
- PageSpeed field/lab interpretation: `https://developers.google.com/speed/docs/insights/v5/about`
- Google Search documentation updates: `https://developers.google.com/search/updates`
- Structured data introduction: `https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data`
- Structured data gallery: `https://developers.google.com/search/docs/appearance/structured-data/search-gallery`
- FAQ rich-result limits: `https://developers.google.com/search/blog/2023/08/howto-faq-changes`
- Helpful content: `https://developers.google.com/search/docs/fundamentals/creating-helpful-content`
- AI search guidance: `https://developers.google.com/search/docs/fundamentals/ai-optimization-guide`

FAQPage JSON-LD does not guarantee indexing, rankings, rich results, AI Overviews, or AI Mode visibility. Sitemap submission is a discovery hint, not an indexing guarantee. robots.txt is not a noindex mechanism.

## Owner Search Console / CWV checklist

1. Verify the canonical `https://bizpilo.com` property.
2. Submit `https://bizpilo.com/sitemap.xml` and confirm parsing.
3. Use URL Inspection on `/`, `/features`, `/demo`, `/pricing`, `/pilot`, `/faq`, and `/trust`.
4. Confirm selected canonicals and `fr-CA` alternates match rendered metadata.
5. Confirm Auth, Dashboard, Admin, Founder, and quote-intake URLs are not indexed.
6. Review field Core Web Vitals after sufficient traffic. Good thresholds remain LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1 at the 75th percentile.
7. Run a current lab baseline on the final deployed commit; do not reuse old Phase 25 numbers as current evidence.
8. Prioritize first-fold LCP, unnecessary client JavaScript, image dimensions, and long-task reduction before adding heavier visuals.

## No-PII measurement gate

No analytics sink is approved yet. A future first-party analytics sink must reject email, phone, name, address, message, quote details, prompts, AI output, customer IDs, and lead IDs. Safe dimensions may include route, CTA, language, plan label, reference label, or placement category.

### Future Founder Funnel Dashboard

| Stage | Allowed aggregate source |
| --- | --- |
| Discovery/education | Route, language, CTA, FAQ, and demo counts from a future approved first-party sink |
| Pilot intent | Pilot template copy/select events without contact information |
| Intake | Safe source categories from `lead_source_metadata` |
| Response | Aggregate reply-review/copy rate from `leads.first_reply_copied_at` |
| Follow-up | Aggregate status and completion counts |

No customer free text may enter the measurement system. The funnel must not become a reason to enable tracking without an owner-approved privacy, retention, disable, and rollback plan.

## Product content rules

- Answer real owner questions directly: integrations, AI role, auto-send, pricing/booking, data, verticals, setup, support, and pilot boundaries.
- Keep statements consistent with the live product: BizPilot does not auto-send messages, confirm bookings, invent prices, collect payment, or connect social/email inboxes for automatic replies.
- Use structured data only for visible content.
- Never claim ranking, indexing, compliance, revenue, or conversion results without current evidence.
