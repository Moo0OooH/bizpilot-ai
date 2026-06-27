# Dashboard V3 Figma Handoff and Visual QA

Date: 2026-06-27

## Figma File

- File: BizPilot Dashboard V3 Final Interface Handoff 2026-06-27
- URL: https://www.figma.com/design/dkklUNcV1JxIpHXk2q27n9
- Account/team: Mohamad Beagi's team

## Scope

This handoff covers the Dashboard V3 owner and founder/admin surfaces from the
master standard:

- Owner Overview
- Lead Queue and Lead Detail
- Quote Setup
- Business Profile
- Settings
- Founder Admin Users and Business Detail
- Desktop 1440px and mobile 390px responsive frames
- EN/fr-CA bilingual readiness notes

## Figma Structure

The Figma Starter plan limits this file to three pages and one variable mode.
The handoff therefore uses three dense pages:

- `00 Cover + Foundations`
- `01 Dashboard Screens`
- `02 QA + Handoff`

Light and dark dashboard variables are namespaced as `light/...` and `dark/...`
instead of using Figma variable modes. The implementation still keeps runtime
theme modes in code.

## Foundations Created

- 2 variable collections:
  - `BizPilot Dashboard V3 Colors`
  - `BizPilot Dashboard V3 Metrics`
- 50 variables:
  - light dashboard surface/text/status tokens
  - dark dashboard surface/text/status tokens
  - shared preview, spacing, radius, and sidebar sizing tokens
- 5 text styles:
  - `Dashboard/H1`
  - `Dashboard/H2`
  - `Dashboard/Section Title`
  - `Dashboard/Body`
  - `Dashboard/Caption`
- 1 effect style:
  - `Dashboard/Card Shadow`

## Editable Screen Frames

The Figma file includes six editable dashboard frames with safe mock data:

- `Desktop / Owner Overview / 1440`
- `Desktop / Lead Detail / 1440`
- `Desktop / Quote Setup / 1440`
- `Desktop / Founder Admin / 1440`
- `Mobile / Owner Overview / 390`
- `Mobile / Lead Detail / 390`

Validation inside Figma confirmed:

- 6 screen frames created
- 183 text nodes
- all text nodes use Geist
- zero collapsed card frames after sizing repair

## Browser QA Evidence

Local browser QA was captured in:

`C:\Users\mbeag\Documents\Codex\2026-06-27\files-mentioned-by-the-user-bizpilot\outputs\dashboard-v3-final-handoff-qa\dashboard-v3-final-handoff-browser-qa.json`

Checked routes and viewports:

| Route | Desktop 1440x900 | Mobile 390x844 |
| --- | --- | --- |
| `/dashboard/configuration` | PASS | PASS |
| `/dashboard/business-profile` | PASS | PASS |
| `/dashboard/settings` | PASS | PASS |
| `/dashboard/leads/20830d88-a456-456f-96e1-5bb305bf6192` | PASS | PASS |
| `/admin` | PASS | PASS |

All checked routes reported:

- `horizontalOverflow: false`
- `hasNextError: false`
- no alert role messages

## Implementation Notes

- The Figma file intentionally avoids real customer data and uses safe mock
  labels.
- Settings screenshots were kept local and were not uploaded to Figma.
- The codebase remains the source of truth for runtime behavior, RLS, auth, and
  localized copy.
- The Figma file is a design handoff artifact: editable visual structure,
  sizing, token references, and route relationship documentation.

## Validation Commands

- `pnpm test:unit` -> 163/163 passing
- `pnpm verify` -> lint, typecheck, unit tests, production build passing
- `git diff --check` -> clean
