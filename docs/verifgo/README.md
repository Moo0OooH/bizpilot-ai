# VerifGo QC Canonical Index

VerifGo QC is a separate app-first product for Quebec rideshare and taxi drivers. It is not a BizPilot feature and should not inherit BizPilot dashboard complexity.

## Binding Order

1. `MASTER_BLUEPRINT.md`
2. `COMPLIANCE_MAPPING.md`
3. `ENGINEERING_STANDARD.md`
4. `VALIDATION_PLAYBOOK.md`
5. `GTM_PLAYBOOK.md`

English directives are binding. French copy is user-facing. Persian notes are human context only.

## Current Build Status

- Product: defined, not launched.
- Code foundation: started in this repo under `apps/mobile`, `packages/verifgo-shared`, and `supabase/migrations/0022_verifgo_foundation.sql`.
- Heavy build gate: blocked until driver validation passes.

## Non-Negotiables

- App-first mobile product.
- Daily report flow under 30 seconds.
- Submitted reports are immutable.
- Corrections create separate records.
- Offline status is explicit.
- No backdating, fake reports, or bulk report generation.
- No official approval or guaranteed fine-avoidance claims.
