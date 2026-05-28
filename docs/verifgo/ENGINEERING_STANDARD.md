# VerifGo QC Engineering Standard

## Architecture

```txt
apps/mobile              Expo React Native app
apps/web                 Optional install/marketing site
packages/verifgo-shared  Types, validation, compliance constants, i18n
supabase/migrations      Database and RLS
tests/rls                SQL security tests
docs/verifgo             Canonical product and compliance docs
```

## Code Rules

- TypeScript strict.
- No `any` in shared compliance, validation, report, or RLS-related code.
- UI renders state and dispatches actions.
- Business rules live in services.
- Database access lives in repository or Supabase service modules.
- Compliance constants live in `packages/verifgo-shared/src/compliance`.
- Validation lives in `packages/verifgo-shared/src/validation`.
- User-facing copy lives in i18n files.
- No service role key in mobile app.

## Vehicle Modeling

- Do not use a single catch-all `vehicle_type` label.
- Store vehicle use separately from powertrain.
- Vehicle photos are optional driver uploads during vehicle registration or edit.
- Stock car images are not a source of truth and should not appear where the driver is expected to identify their own vehicle.

## Premium Reminder Modeling

- Premium smart notifications are one product switch.
- Individual Quebec seasonal reminder rules live as shared constants.
- Scheduling and delivery events must be auditable without storing raw push tokens in logs.
- Free users can see the upgrade value, but reminder delivery is reserved for paid plans.

## Logging Rules

Allowed events:

- `report_started`
- `report_submitted`
- `report_sync_failed`
- `report_synced`
- `report_exported_pdf`
- `inspector_mode_opened`
- `correction_created`
- `reminder_updated`
- `premium_smart_notifications_updated`
- `subscription_started`
- `subscription_cancelled`

Forbidden in logs:

- raw personal data
- raw tokens
- service role keys
- payment card data
- raw provider payloads

## Comment Rules

Comments explain why, not obvious what.

Good:

```ts
// Submitted reports are immutable by compliance policy.
// Corrections must create a new report linked to the original.
```
