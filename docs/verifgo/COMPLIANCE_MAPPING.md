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
| Vehicle identity | Plate, accessory number, use, powertrain, and optional vehicle photo |
| Seasonal readiness | Premium smart notifications for Quebec weather and tire timing |

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

## Vehicle Setup Rule

Vehicle setup must not collapse several concepts into one vague label. The canonical model separates:

- vehicle use: rideshare, taxi, delivery, personal
- powertrain: gas, diesel, hybrid, plug-in hybrid, electric
- optional photo: driver-owned context only, not a compliance proof by itself

The app must never require a stock car image. A driver may upload a real vehicle photo during vehicle registration or edit.

## Premium Smart Reminder Rule

Premium smart notifications are a convenience layer. They do not replace the driver's legal duty to follow current Quebec requirements or maintain the vehicle.

The initial Quebec seasonal set is one paid bundle with six reminder rules:

- winter tire install planning
- winter tire deadline window
- winter washer fluid
- emergency kit check
- cold-weather battery check
- summer tire reinstall timing

Reference inputs for the first reminder set:

- Gouvernement du Quebec, winter tire requirements: https://www.quebec.ca/en/transports/traffic-road-safety/winter-road-safety/requirements-for-winter-tires
- Gouvernement du Quebec, preparing your vehicle for winter driving: https://www.quebec.ca/en/transports/traffic-road-safety/winter-road-safety/preparing-vehicle-winter-driving
- CAA-Quebec, preparing your car for winter: https://www.caaquebec.com/en/advices/maintaining-a-vehicle/preparing-your-car-for-winter/

## Required Disclaimer

```txt
This report was generated from information submitted by the driver.
VerifGo QC helps drivers record and store their daily verification report.
It does not replace official inspection requirements, legal advice,
or the driver's own responsibility for accuracy.
```
