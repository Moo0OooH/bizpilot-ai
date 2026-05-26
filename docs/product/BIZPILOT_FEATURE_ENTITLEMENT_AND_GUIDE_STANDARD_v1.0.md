# BizPilot Feature Entitlement and Guide Standard v1.0

**Project:** BizPilot AI
**Date:** 2026-05-26
**Status:** Active canonical product expansion standard
**Owner:** MoOoH

---

## 1. Purpose

BizPilot can expand beyond the early cleaning-first quote recovery MVP, but
growth must stay controlled, understandable, and safe.

This standard supersedes older blanket scope-freeze language for future feature
planning. It does not supersede security, RLS, privacy, secret-handling,
backup/restore, production SQL, or real-data readiness gates.

## 2. Owner Decision

The current owner decision is:

```text
Do not artificially limit the long-term product scope.
Expand the project when the feature is useful.
Do not enable every capability by default.
Feature availability, level, and activation come from the main owner.
The customer's Settings surface must show what is available, enabled, planned,
blocked by setup, or blocked by provider/payment/API readiness.
```

## 3. Feature Entitlement Model

Every capability must have an explicit feature record before it becomes
customer-visible.

Required fields:

| Field | Meaning |
| --- | --- |
| Feature key | Stable internal identifier, not user-facing marketing copy. |
| Display name | Customer-facing feature name. |
| Category | Capture, recovery, AI, communication, scheduling, billing, admin, data, or integration. |
| State | `enabled`, `owner_controlled`, `beta`, `planned`, `setup_required`, or `blocked_external`. |
| Level | `core`, `plus`, `pilot`, `founder`, `admin`, or `custom`. |
| Owner authority | Who can enable/disable/change level. |
| Customer visibility | Whether the customer can see it in Settings. |
| Guide status | Visual guide and text guide status. |
| Data posture | Whether it touches customer data, external APIs, billing, auth, or destructive paths. |
| Validation evidence | Tests, smoke, QA, and docs required before activation. |

Feature states:

| State | Customer meaning |
| --- | --- |
| `enabled` | Available and usable for this workspace. |
| `owner_controlled` | Exists, but owner/admin decides activation or level. |
| `beta` | Available only to approved pilot/founder accounts. |
| `planned` | Roadmap-visible, not clickable as a working feature. |
| `setup_required` | Requires owner-side setup such as DNS, SMTP, payment, API key, or provider approval. |
| `blocked_external` | Blocked by provider quota, payment, account review, or unavailable external dependency. |

## 4. Settings Must Be The Feature Control Surface

Settings must become the trustworthy place where a customer can understand:

- which features are active,
- which features are included in their level,
- which features require owner approval,
- which features require external setup,
- what each feature does,
- what the feature will not do yet,
- where to find the visual and text guide,
- whether the feature is manual, assisted, or automated.

Unavailable features may be visible only when they reduce confusion. They must
not look like active controls. If a feature is not enabled, its CTA must explain
the state instead of pretending work will happen.

## 5. Required Guides For Every New Feature

Every new feature must ship with guides before it is considered complete.

Required visual guide:

- shows the feature in the real product layout,
- explains the main workflow in 3-7 steps,
- includes empty, success, error, and setup-required states when relevant,
- uses product screenshots, diagrams, or in-app guide panels that match the live UI,
- is checked on desktop and mobile if the feature is customer-facing.

Required text guide:

- explains what the feature does in customer language,
- explains what the feature does not do,
- lists any owner/customer setup required,
- names data, privacy, payment, provider, and automation implications,
- includes the expected first action,
- includes support/fallback language for blocked provider or payment states,
- is available in English and fr-CA when the customer-facing surface is localized.

Required owner/admin guide:

- explains how the main owner enables, disables, or changes the feature level,
- records whether the feature can be default-enabled,
- records rollback or disable steps,
- names tests and smoke checks required before activation,
- records cleanup or data-retention implications.

## 6. Safety Gates Still Apply

Expansion is allowed, but safety gates stay mandatory.

Do not:

- weaken RLS,
- expose secrets, env values, confirmation links, tokens, dumps, or customer data,
- add `leads.source`; use `leads.source_channel`,
- blindly replay `0018`,
- default-enable external messaging, payments, booking, calendar sync, or AI sending,
- imply a message was sent, a booking was confirmed, or payment succeeded unless the product really did it,
- run destructive cleanup without an explicit owner-approved path.

External-provider features are blocked until the provider/account/payment state
is ready. Examples: OpenAI quota, custom SMTP/DNS, Stripe/payment, SMS/WhatsApp,
calendar, maps, or marketplace APIs.

## 7. Acceptance Criteria

A new feature is complete only when:

- feature registry/entitlement state exists,
- Settings displays the correct state and level,
- customer-facing copy is clear and does not overpromise,
- visual guide exists,
- text guide exists,
- owner/admin guide exists,
- server-side validation exists where data changes,
- tenant isolation/RLS coverage exists where workspace data is touched,
- desktop/mobile QA is recorded for UI changes,
- smoke coverage exists for public, auth, provider, or payment paths when relevant,
- readiness/product docs link to the guide evidence.

## 8. Conflict Rule

Older docs that say "do not expand scope" should now be read as:

```text
Do not default-enable, fake, or prematurely launch broad features.
Expansion is allowed through explicit entitlement, Settings visibility, guides,
tests, and owner-controlled activation.
```

Older docs still control their original safety domains unless this standard is
more specific about feature entitlement or guide requirements.
