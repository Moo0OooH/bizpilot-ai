# BizPilot Configurability Standard v1.0

**Project:** BizPilot AI  
**Date:** 2026-05-25  
**Status:** Active product standard for no-cost MVP hardening  

---

## 1. Purpose

BizPilot should feel like a professional, sectioned, configurable quote recovery system for cleaning businesses, while staying inside the current MVP scope:

- founder-controlled setup,
- owner-reviewed AI drafts,
- manual send/copy,
- no hidden automation,
- no real customer data until readiness gates close.

This standard keeps customization useful without turning the product into a generic CRM or integration platform.

## 2. Current Configurable Sections

| Section | Owner/founder configurable now | Notes |
| --- | --- | --- |
| Business profile | Business name, public slug, preferred language | Slug changes must keep public quote routing safe. |
| Branding | Primary color, accent color, logo URL | Must stay readable on public quote and dashboard previews. |
| Services | Service names and descriptions | Used for quote context and owner review. |
| Service areas | Covered cities/areas | Used for readiness and lead guidance. |
| Quote questions | Label, help text, required flag, visibility, sort order | Must not bypass server validation or RLS. |
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

## 4. Guardrails

Configurability must not:

- weaken RLS,
- add `leads.source`; use `leads.source_channel`,
- replay `0018` blindly,
- expose secrets, env values, confirmation links, tokens, dumps, or customer data,
- enable auto-send,
- add booking, invoices, SMS, WhatsApp, Instagram API, calendar automation, or full CRM scope without a product decision,
- allow production-customer hard purge through cleanup tooling.

## 5. Future Configurability Backlog

Add only after current readiness gates stay green:

- founder/customer visibility controls for demo/sample/guideline panels,
- reusable quote-form presets by cleaning service type,
- owner-safe copy tone presets for AI drafts,
- per-workspace public quote theme preview,
- more language dictionaries through central i18n tests,
- controlled import/export tools after backup/restore posture is decided.

## 6. Acceptance Criteria For New Configurable Features

Every new configurable feature needs:

- a clear owner-facing section,
- server-side validation,
- tenant-safe persistence,
- no hidden automation,
- documented defaults,
- unit or RLS coverage when data access is involved,
- browser QA for desktop and mobile if UI changes,
- updated readiness/product docs.
