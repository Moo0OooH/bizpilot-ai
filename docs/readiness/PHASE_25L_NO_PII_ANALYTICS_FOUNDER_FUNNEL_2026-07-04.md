# Phase 25L - No-PII Analytics and Founder Funnel

Date: 2026-07-04
Repo: `E:\bizpilot-ai`
Branch: `main`

## Decision

Define the analytics taxonomy and founder funnel without enabling tracking,
adding third-party scripts, or storing personal data.

`lib/public-events.ts` remains an intentional no-op. The change only documents
approved event names, safe payload keys, forbidden payload keys, and the future
first-party funnel shape.

## What Changed

- Added `publicEventCatalog` to `lib/public-events.ts`.
- Added safe payload keys for each approved public event.
- Added forbidden payload keys for PII/customer content:
  - email
  - phone
  - name
  - address
  - message
  - quote details
  - prompts / AI output
  - customer or lead IDs
- Kept `trackPublicEvent` as an intentional no-op.

## Approved Public Event Catalog

| Event | Category | Safe Payload Keys |
| --- | --- | --- |
| `founder_pilot_cta_click` | conversion | `route`, `cta`, `language` |
| `pricing_cta_click` | conversion | `route`, `plan`, `language` |
| `demo_cta_click` | conversion | `route`, `cta`, `language` |
| `comparison_cta_click` | conversion | `route`, `cta`, `language` |
| `quote_link_guide_cta_click` | conversion | `route`, `placement`, `language` |
| `pilot_template_copy` | conversion | `route`, `method`, `language` |
| `faq_item_open` | content | `route`, `topic`, `language` |
| `service_use_case_click` | content | `route`, `service`, `language` |
| `external_reference_click` | reference | `route`, `reference`, `language` |
| `locale_change` | preference | `route`, `from`, `to` |
| `theme_preference_change` | preference | `route`, `from`, `to` |

## Future Founder Funnel Dashboard

The founder funnel should aggregate only non-PII counts and rates:

| Stage | Metric | Source |
| --- | --- | --- |
| Discovery | Public CTA clicks by route/language | Future first-party public events |
| Education | FAQ opens and demo CTA clicks | Future first-party public events |
| Intent | Pilot template copy/select events | Future first-party public events |
| Placement | Quote-link-guide CTA/placement intent | Future first-party public events |
| Intake | Quote requests by safe source category | `lead_source_metadata`, aggregated |
| Response | First reply copied/reviewed rate | `leads.first_reply_copied_at`, aggregated |
| Follow-up | Leads needing follow-up or completed follow-up | Lead status fields, aggregated |
| Pilot ops | Demo scheduled/completed and pilot status | Founder CRM tracker until in-app CRM is approved |

## Analytics Sink Gate

No analytics sink is approved yet. Any future first-party analytics sink must
pass this gate before it is wired to public pages.

Before enabling any sink:

1. Owner approves the sink and data retention period.
2. Event payload validation rejects forbidden keys.
3. No customer free text, quote details, prompts, AI outputs, emails, phone
   numbers, addresses, lead IDs, or customer IDs are sent.
4. Public privacy/terms copy is updated if tracking becomes real.
5. A disable/rollback path exists.
6. Real customer data remains blocked until the Phase 24G owner approval gate.

## Product Boundary

This does not enable Google Analytics, PostHog, Supabase analytics, cookies,
tracking pixels, dashboards, real customer data, or paid acquisition
measurement. It only defines the no-PII taxonomy and future owner dashboard
shape.

## Backlog Items Advanced

```text
76 done
77 prepared
78 prepared
79 done as a no-PII founder funnel spec
80 prepared
90 preserved
93 preserved
```

## Verification

```text
git diff --check PASS
pnpm test:unit PASS
pnpm lint PASS
pnpm typecheck PASS
pnpm build PASS
```
