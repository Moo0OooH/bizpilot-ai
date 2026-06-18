# Custom Quote Field Builder Work Log

**Project:** BizPilot AI  
**Date:** 2026-06-18  
**Status:** Implemented and locally verified; latest follow-up pending commit/push and deployment verification
**Scope:** Product-readiness improvement inside the existing cleaning-first public quote workflow

## Purpose

The Quote Setup page had editable default quote questions, but owners/admins
could not add business-specific questions. This work adds a scoped form builder
so an owner/admin can collect the details that matter for a specific business
without creating a new product surface.

Examples:

- a cleaning business can ask for access notes, preferred entry method, or
  priority rooms,
- a future owner-configured use case can ask a business-specific qualifying
  question without changing the global template,
- the owner/admin can reorder high-priority questions such as address or
  contact details.

## Implemented Capabilities

- Add custom public quote fields from `Quote Setup > Form Questions`.
- Show a focused custom-field builder where `Field key` is optional and kept in
  advanced settings; if it is left blank, the server generates the key from the
  label.
- Choose field type:
  - text,
  - long text,
  - email,
  - phone,
  - number,
  - select,
  - radio,
  - checkbox,
  - date,
  - time window.
- Set field priority/sort order.
- Set required/optional.
- Set visible/hidden.
- Add customer-facing helper text.
- Add options only when the chosen field type needs them, such as
  select/radio/time-window fields.
- Remove saved owner-created custom fields from the same Quote Setup workflow.
- Keep existing default fields customizable for label, helper text,
  required/optional, visible/hidden, priority, and choice options.

## Persistence Model

Custom fields are stored per business in:

```text
business_template_settings.field_overrides.customFields
```

They are merged with the canonical Cleaning template at read time and synced
into that business's public `intake_form_fields` when configuration is saved.

This avoids mutating the global `industry_template_fields` seed for every
tenant.

## Runtime Behavior

- Public quote pages render owner-defined fields in priority order.
- Radio fields render as a real radio group.
- Checkbox fields continue to use the existing boolean field behavior.
- Server-side public intake validation checks select/radio/time-window values
  against the configured option list.
- Invalid select/radio/time-window choices return a safe field-specific message
  instead of the generic stale-form refresh message.
- Public intake submit failures write only sanitized operational metadata to the
  safe logger; no submitted values, tokens, cookies, auth links, URLs, or
  secrets are logged.
- Saving Quote Setup revalidates the affected public quote route so field type,
  option, and deletion changes are reflected after save.
- Submitted values continue to be saved through the existing public intake and
  lead workflow.

## Safety Boundaries

This work does not add:

- SMS,
- WhatsApp,
- booking,
- invoicing,
- payments,
- customer-facing email automation,
- owner notification automation,
- AI auto-send,
- mobile app,
- analytics,
- full CRM expansion,
- multi-industry support.

This work does not approve:

- real customer data,
- paid pilot,
- Phase 24G owner approval.

Phase 24F final no-secret production smoke remains required before Phase 24G.

## Files Changed

| File | Purpose |
| --- | --- |
| `app/(dashboard)/dashboard/configuration/page.tsx` | Adds the owner/admin field builder UI and editable type/options controls. |
| `server/actions/business-configuration.actions.ts` | Reads, validates, sanitizes, and persists default/custom quote field settings. |
| `server/repositories/business-configuration.repository.ts` | Merges per-business custom fields with the canonical Cleaning template. |
| `components/public/quote-form-wizard.tsx` | Renders radio fields on public quote forms. |
| `server/actions/public-intake.actions.ts` | Logs sanitized public submit failures and keeps user-facing errors safe. |
| `server/services/public-intake.service.ts` | Validates choice-field values server-side. |
| `lib/i18n/bizpilot-copy.ts` | Adds safe invalid-choice copy and a clearer fallback submit message. |
| `tests/unit/i18n-copy.test.mts` | Verifies invalid-choice public intake messages stay on the safe allowlist. |
| `types/database.ts` | Adds `radio` to the typed field-type unions. |
| `supabase/migrations/0022_custom_quote_field_builder.sql` | Extends database field-type constraints to allow `radio`. |
| `supabase/migrations/README.md` | Records the new migration. |
| `docs/product/BIZPILOT_CONFIGURABILITY_STANDARD_v1.0.md` | Records the implemented configurability standard update. |
| `docs/readiness/CURRENT_PROJECT_STATUS_2026-06-01.md` | Adds the short product-readiness status update. |

## Verification

Recorded during implementation:

| Command | Result |
| --- | --- |
| `pnpm typecheck` | PASS |
| `pnpm lint` | PASS |
| `git diff --check` | PASS with CRLF/LF normalization warning only |

Recorded during the follow-up polish pass:

| Command | Result |
| --- | --- |
| `pnpm lint -- 'server/actions/public-intake.actions.ts' 'server/services/public-intake.service.ts' 'server/actions/business-configuration.actions.ts' 'components/dashboard/custom-quote-field-builder.tsx' 'components/dashboard/quote-field-type-control.tsx' 'app/(dashboard)/dashboard/configuration/page.tsx' 'lib/i18n/bizpilot-copy.ts' 'tests/unit/i18n-copy.test.mts'` | PASS |
| `pnpm test:unit` | PASS, 80 tests / 19 suites |

Not run in this implementation turn:

- `pnpm test:unit`,
- `pnpm build`,
- local RLS verification,
- production smoke.

## Owner/Operator Notes Before Production Use

- Apply `supabase/migrations/0022_custom_quote_field_builder.sql` before using
  radio fields in production.
- After applying the migration, save Quote Setup once for the target workspace
  so public intake fields are synced.
- Run a synthetic quote submission with at least one custom field.
- Confirm the dashboard lead detail displays the submitted custom field values.
- Do not use real customer data until Phase 24F passes and Phase 24G owner
  approval is explicitly recorded.

## Current Gate Impact

| Gate | Status after this work |
| --- | --- |
| Build / normal verification | PARTIAL, lint/typecheck/diff-check passed |
| Local RLS | NOT RUN in this turn |
| Phase 24F no-secret production smoke | NOT RUN |
| Phase 24G owner approval | NOT APPROVED |
| Real customer data | NOT APPROVED |
| Paid pilot | NOT APPROVED |
| Feature expansion | NOT APPROVED for blocked categories; this change is scoped quote-form configurability only |
