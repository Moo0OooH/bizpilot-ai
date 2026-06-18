# BizPilot Configurability Standard v1.0

**Project:** BizPilot AI  
**Date:** 2026-05-25  
**Status:** Active product standard for configurable feature growth

---

## 1. Purpose

BizPilot should feel like a professional, sectioned, configurable operating workspace for service businesses. The early production shape is still quote recovery for cleaning businesses, but the owner has approved broader product expansion when each capability is explicitly feature-gated, documented, and surfaced in Settings.

This standard now works with `docs/product/BIZPILOT_FEATURE_ENTITLEMENT_AND_GUIDE_STANDARD_v1.0.md`.

The product can grow into more categories, but it must not silently become a generic CRM or integration platform. New capabilities are owner-controlled, not default-on.

## 2. Current Configurable Sections

| Section | Owner/founder configurable now | Notes |
| --- | --- | --- |
| Business profile | Business name, public slug, preferred language | Slug changes must keep public quote routing safe. |
| Branding | Primary color, accent color, logo URL | Must stay readable on public quote and dashboard previews. |
| Services | Service names and descriptions | Used for quote context and owner review. |
| Service areas | Covered cities/areas | Used for readiness and lead guidance. |
| Quote questions | Label, help text, type for owner-defined fields, required flag, visibility, priority/sort order, select/radio options | Must not bypass server validation or RLS. Owner-defined fields stay scoped to the business settings and sync into that business's public intake form only. |
| FAQ / AI context | Question/answer pairs | Used as owner-facing business context, not as auto-send permission. |
| Privacy and consent | Privacy mode, retention days, consent notice, AI disclosure | Must remain explicit on public quote submissions. |
| Public link | Active quote slug generated from the business slug | Inactive or missing links must render a safe unavailable state. |
| Workspace language | English / Canadian French | Dashboard and public copy must flow through central dictionaries. |
| Founder admin controls | Plan/status, workspace kind, quote-link active state, internal notes, cleanup dry-run | Production-customer destructive actions remain blocked. |

## 3. Signup Defaults

New workspaces should not start with a broken public quote preview.

On signup, BizPilot should provision conservative defaults:

- branding colors,
- at least one service,
- at least one service area placeholder,
- at least one FAQ,
- standard privacy settings,
- consent settings,
- Cleaning quote template settings,
- active public link,
- active consent version,
- active intake form,
- readiness tasks.

Owners can then edit these sections without needing founder SQL or manual database setup.

## 4. Feature Growth And Settings Visibility

Future feature growth is allowed when the feature has:

- a feature key and entitlement/level state,
- a clear owner authority for activation,
- Settings visibility that explains whether the feature is enabled, planned, setup-required, or externally blocked,
- a customer-facing text guide,
- a visual workflow guide,
- an owner/admin guide,
- server validation and RLS coverage when data access is involved,
- smoke or provider checks when external APIs, payments, messaging, or auth are involved.

Settings must be the source of truth for customer-visible feature availability. A feature that is not enabled must not look clickable or ready.

## 5. Guardrails

Configurability must not:

- weaken RLS,
- add `leads.source`; use `leads.source_channel`,
- replay `0018` blindly,
- expose secrets, env values, confirmation links, tokens, dumps, or customer data,
- default-enable auto-send, external messaging, booking, invoices, payments, calendar automation, or integrations before entitlement, guide, provider, and smoke evidence exists,
- imply a booking, invoice, message, payment, or automated action happened unless BizPilot actually performed it,
- allow production-customer hard purge through cleanup tooling.

## 6. Future Configurability Backlog

Add through the feature entitlement model, with owner-controlled activation:

- founder/customer visibility controls for demo/sample/guideline panels,
- reusable quote-form presets by cleaning service type,
- owner-safe copy tone presets for AI drafts,
- per-workspace public quote theme preview,
- more language dictionaries through central i18n tests,
- controlled import/export tools after backup/restore posture is decided,
- booking/scheduling, billing, messaging, team, vertical packs, marketplace, and deeper CRM-like workflows when their guide, data, provider, and owner-level gates are ready.

## 7. Implemented Quote Field Builder - 2026-06-18

The Quote Setup form questions section now supports owner/admin field building
inside the current cleaning-first quote workflow.

Implemented:

- owner/admin can add custom public quote fields from Quote Setup,
- supported field types are text, long text, email, phone, number, select,
  radio, checkbox, date, and time window,
- owner/admin can set required status, public visibility, helper text, and
  priority/sort order,
- select/radio/time-window options are captured as structured option lists,
- existing template fields can still be relabeled, reordered, hidden, or made
  required/optional,
- custom fields are stored in `business_template_settings.field_overrides`
  under the owning business and then synced into that business's
  `intake_form_fields`,
- public quote rendering supports radio controls,
- server-side public intake validation rejects out-of-list values for
  select/radio/time-window fields.

Guardrails:

- this does not enable new industries,
- this does not enable SMS, WhatsApp, booking, invoicing, payments,
  auto-send AI, customer email automation, or CRM expansion,
- default template field types remain protected from UI tampering because
  lead extraction depends on canonical keys such as `customer_name`,
  `customer_contact`, `city_or_service_area`, and `cleaning_type`,
- Phase 24F final no-secret production smoke and Phase 24G owner approval are
  still required before real customer data,
- migration `0022_custom_quote_field_builder.sql` must be applied before
  production use of radio fields.

Verification recorded in the implementation turn:

- `pnpm typecheck` passed,
- `pnpm lint` passed,
- `git diff --check` passed with only a CRLF/LF normalization warning.

Evidence log:

- `docs/readiness/CUSTOM_QUOTE_FIELD_BUILDER_WORK_LOG_2026-06-18.md`

## 8. Acceptance Criteria For New Configurable Features

Every new configurable feature needs:

- a clear owner-facing section,
- Settings state/level visibility,
- server-side validation,
- tenant-safe persistence,
- no hidden automation,
- documented defaults,
- visual guide,
- customer-facing text guide,
- owner/admin enablement guide,
- unit or RLS coverage when data access is involved,
- browser QA for desktop and mobile if UI changes,
- updated readiness/product docs.
