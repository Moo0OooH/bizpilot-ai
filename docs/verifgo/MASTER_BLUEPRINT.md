# VerifGo QC Master Blueprint

## Product Decision

Build VerifGo QC as an app-first daily compliance assistant for Quebec Uber, rideshare, and taxi drivers.

The product job is:

```txt
Reminder -> Today verification -> Immutable report -> Inspector mode ready
```

VerifGo does not sell a PDF. It sells daily readiness, habit formation, and fast access to today's verification record.

## MVP Scope

The MVP is locked to these features:

1. Auth with persistent session
2. Language selection, English and French
3. Driver profile
4. Vehicle setup
5. Reminder setup
6. Daily verification flow
7. Odometer input
8. Article 65 checklist
9. One-tap no-defect path
10. Defect mode with optional photo
11. Immutable submit
12. Today report card
13. History
14. Inspector mode
15. PDF export and offline draft/sync state

## Out Of Scope For MVP

- AI or automatic defect detection
- Mileage, tax, or income tracking
- Uber, Lyft, or taxi-platform API integration
- Fleet dashboard
- Analytics dashboard
- Marketplace
- Backdating
- Fake reports
- Bulk report generation
- Claims of SAAQ approval
- Claims of guaranteed fine avoidance

## Primary Screens

- Today: daily verification CTA, report status, inspector shortcut.
- History: previous reports, PDFs, corrections.
- Vehicle: plate, accessory number, make, model, year, default vehicle.
- Settings: language, reminder, subscription, legal disclaimer.

## UX Direction

The app must feel fast, calm, and operational. The first screen should make the next action obvious without asking the driver to understand compliance structure.
