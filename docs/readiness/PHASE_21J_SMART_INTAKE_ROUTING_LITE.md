# Phase 21J Smart Intake Routing Lite

**Project:** BizPilot AI
**Document Type:** Implementation evidence
**Status:** Local implementation complete; not deployed to production
**Owner:** MoOoH
**Last Updated:** 2026-05-24

---

## 1. Decision

Smart Intake Routing moved from docs-only concept to a narrow Stage 1 Lite implementation.

This implementation is intentionally limited:

- cleaning-first only,
- deterministic rule-based suggestion,
- owner-reviewed,
- no auto-assignment,
- no auto-send,
- no new migrations or tables,
- no external API calls,
- no production push/deploy in this step.

Advanced routing remains gated. Team queues, rule builders, member routing profiles, audit persistence, vertical packs, and healthcare/clinic workflows are still future scope.

---

## 2. What Changed

### Rule Engine

Added a pure `calculateSmartIntakeRouting(...)` rule helper in:

```text
server/services/lead-conversion-rules.service.ts
```

It derives:

- `priority`,
- `suggestedQueue`,
- `suggestedReviewer`,
- `reasonCodes`,
- `missingInfoKeys`,
- `nextAction`.

Signals currently considered:

- overdue / follow-up-due SLA,
- outside service area,
- missing required quote information,
- move-out cleaning,
- preferred date soon,
- commercial / office request,
- recurring cleaning opportunity.

### Lead Domain

`getLeadConversionDesk(...)` and `getLeadDetail(...)` now include `routingSuggestion` in their returned lead objects.

No database state is written for routing. The suggestion is computed from existing lead, score, service-area, and intake-submission values.

### Lead Detail UI

The owner lead detail page now displays a **Smart Intake Routing** panel with:

- human-review and no-auto-assignment badges,
- priority,
- suggested queue,
- suggested reviewer,
- reasons,
- missing-info summary,
- next action.

The page also moved remaining visible Lead Detail strings into the central dashboard i18n dictionary so the workspace language remains the source of truth.

### Tests

Unit coverage was added for:

- urgent move-out lead with missing info -> high priority / intake review,
- commercial office lead -> commercial cleaning queue,
- outside-service-area lead -> owner review / service-area review.

The i18n source scan now includes:

```text
app/(dashboard)/dashboard/leads/[leadId]/page.tsx
```

---

## 3. Files Changed

```text
app/(dashboard)/dashboard/leads/[leadId]/page.tsx
lib/i18n/bizpilot-copy.ts
server/services/lead-conversion-rules.service.ts
server/services/lead-conversion.service.ts
tests/unit/i18n-copy.test.mts
tests/unit/lead-conversion-rules.test.mts
docs/product/BIZPILOT_SMART_INTAKE_ROUTING_FUTURE_SPEC_v1.0.md
docs/readiness/PHASE_21J_SMART_INTAKE_ROUTING_LITE.md
```

---

## 4. Validation

Completed:

```text
pnpm test:unit
pnpm typecheck
pnpm lint
pnpm build
git diff --check
changed-file secret scan
browser QA on local Lead Detail route
```

Observed result:

```text
unit tests: pass, 48/48
typecheck: pass
lint: pass
build: pass
git diff --check: pass, CRLF warnings only
changed-file secret scan: no matches for key/token/private-key patterns
browser QA: Smart Intake Routing panel visible on /dashboard/leads/[leadId]
browser QA: viewport around 500px had no horizontal overflow
```

---

## 5. Scope Guard

This does not approve:

- real customer pilot,
- production deploy,
- production SQL,
- new routing tables,
- auto-assignment,
- auto-send,
- SMS/WhatsApp/Instagram integrations,
- booking/calendar/invoicing,
- healthcare or clinical routing.

The current safe product truth remains:

```text
Synthetic founder demo: allowed
Cleaning quote recovery: current MVP
Smart Intake Routing Lite: local deterministic suggestion only
Real customer pilot: not approved
Main push/deploy: not approved
```
