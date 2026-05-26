# Phase 21T Feature Entitlement Settings Evidence

Date: 2026-05-26
Branch: `phase-21q-dashboard-redesign`

## Owner decision captured

The owner approved broad product expansion from this point forward, with one
important rule: new capabilities are not default-enabled. Availability, level,
and activation come from the main owner/founder path and must be visible to the
customer in Settings.

Canonical standard added:

- `docs/product/BIZPILOT_FEATURE_ENTITLEMENT_AND_GUIDE_STANDARD_v1.0.md`

## What changed

- Added a typed feature registry in `lib/features/feature-registry.ts`.
- Replaced vague Settings "future sections" cards with a feature-level registry
  that shows:
  - feature category,
  - enabled/setup/planned/external-blocker state,
  - owner-controlled level,
  - activation rule,
  - current setup/blocker text,
  - visual guide status,
  - customer text guide requirement,
  - owner/admin guide requirement.
- Added English and fr-CA Settings copy for every registered feature.
- Added unit coverage so every registry item has localized copy and guide text.

## Feature states now represented

- Enabled core features: quote recovery queue, public quote intake, branding,
  workspace language.
- Owner-controlled admin feature: founder admin controls.
- Setup-required features: custom SMTP, backup/restore posture, billing payment
  links.
- External-blocked feature: model-backed AI and SMS/WhatsApp provider paths.
- Planned features: team members, scheduling/booking, invoices/payments.
- Planned premium/admin features: lead source analytics from
  `leads.source_channel` / `lead_source_metadata`, and a customer contact list
  keyed by email/phone visibility for owner/main-admin use.

## Safety notes

- No production SQL was run.
- No secrets, env values, provider keys, tokens, dumps, or real customer data
  were read, printed, or committed.
- No RLS policy was weakened.
- No feature was default-enabled beyond current implemented core surfaces.
- No `leads.source` column was added; source attribution remains on
  `leads.source_channel` plus `lead_source_metadata`.
- OpenAI remains blocked by provider/account quota until the owner confirms the
  support ticket is resolved.

## Validation to run before merge/push

- `git diff --check`
- `pnpm test:unit`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm build`
- `pnpm smoke:public -- --base-url=https://bizpilo.com`
