# VerifGo QC Compliance Mapping

This document maps product behavior to compliance-oriented system requirements. It is not legal advice and must be validated against current Quebec requirements before launch.

## Core Legal-Product Mapping

| Area | Product Implementation |
| --- | --- |
| Daily verification before first use | Today flow plus reminder |
| Checklist items | Versioned `inspection_templates` and `inspection_items` |
| Report content | `daily_reports`, snapshots, items, defects |
| Defects | `defects` table with severity and optional photo |
| Driver attestation | Immutable submit and audit event |
| Inspection proof | Inspector mode and PDF export |

## Immutable Report Policy

Submitted reports cannot be edited in place.

Allowed:

- Create draft
- Submit draft
- Export PDF
- Open inspector mode
- Create correction linked to original report

Forbidden:

- Update submitted report fields directly
- Backdate submitted report date or timestamps
- Generate many reports for prior dates
- Hide offline state

## Offline Truth Rule

If `offline_created=true`, every proof surface must distinguish:

- client time
- server received time, when synced
- sync state

The app must never imply that a client-side offline timestamp was verified by the server.

## Required Disclaimer

```txt
This report was generated from information submitted by the driver.
VerifGo QC helps drivers record and store their daily verification report.
It does not replace official inspection requirements, legal advice,
or the driver's own responsibility for accuracy.
```
