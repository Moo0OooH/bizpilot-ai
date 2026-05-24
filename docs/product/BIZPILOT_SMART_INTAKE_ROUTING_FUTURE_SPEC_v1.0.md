# BizPilot Smart Intake Routing Future Spec v1.0

**Project:** BizPilot AI
**Document Type:** Future product module specification
**Status:** Proposed / Docs-only / Not approved for implementation
**Last Updated:** 2026-05-24
**Owner:** MoOoH
**Current Pilot Status:** Founder-controlled synthetic demos only. Not ready for first real pilot customer with real customer data.

---

## 1. Executive Summary

Smart Intake Routing is a future BizPilot module that helps multi-user service businesses decide which incoming request should go to which person, team, or queue.

The core idea is simple:

> The right request should reach the right person faster, with a clear reason and a human review step.

For the current cleaning-first BizPilot MVP, this should not become a full workflow automation system yet. The safe near-term version is:

- suggested lead priority,
- suggested queue,
- missing information summary,
- routing reason,
- owner/admin confirmation.

The advanced future version may include routing rules, team queues, field priority weights, member routing profiles, and audit trails. That future version should only be built after production readiness gates pass and real customer discovery confirms routing pain.

---

## 2. Strategic Decision

BizPilot should keep its current product discipline:

- cleaning-first,
- quote recovery first,
- AI assistant-only,
- owner-reviewed,
- manual copy/send,
- no auto-send,
- no booking,
- no invoicing,
- no calendar sync,
- no SMS/WhatsApp automation,
- no Instagram API,
- no multi-vertical expansion yet.

Smart Intake Routing is approved as a **future product concept**, not a current Phase 21 implementation task.

Current decision:

```text
Document now.
Validate through customer discovery.
Do not implement runtime code yet.
Do not add migrations yet.
Do not add dashboard behavior yet.
Do not expand vertical scope yet.
```

---

## 3. Problem

Many service businesses start simple, with one owner handling every request. As they grow, incoming requests become harder to manage:

- different service types require different people,
- urgent requests need faster review,
- some leads are missing critical information,
- requests may need a specialist, admin, owner, receptionist, estimator, or team lead,
- multi-person businesses lose time deciding who should handle each lead,
- leads can go cold when the wrong person sees them first or nobody owns the next action.

This is not only a CRM problem. It is an intake triage problem:

> What came in, how important is it, who should review it, what is missing, and what should happen next?

---

## 4. Product Promise

Customer-facing promise:

> BizPilot helps your team know which request matters most, who should handle it, and what to do next.

Alternative short promise:

> Route the right request to the right person faster.

MVP-safe promise:

> BizPilot suggests priority, missing information, and the best queue for each lead. The owner or admin stays in control.

---

## 5. Definitions

### Field Priority

A business-defined signal that says which form answers matter most when evaluating a request.

Examples:

- service type,
- urgency,
- preferred date,
- location,
- language,
- property type,
- project size,
- customer type,
- missing information.

### Queue

A non-person destination for a request.

Examples:

- Owner Review,
- Intake Review,
- Move-out Cleaning,
- Commercial Cleaning,
- Front Desk,
- Orthopedic Queue,
- ENT Queue,
- Estimator Review.

### Suggested Assignee

A recommended person who may be best suited to review or handle the request.

The current MVP-safe version should not auto-assign by default. It should suggest and let the owner/admin confirm.

### Routing Rule

A business-defined condition-action pair.

Example:

```text
If service_type = Move-out cleaning
and preferred_date is within 48 hours
then priority = High
and suggested_queue = Owner Review
```

### Routing Reason

A human-readable explanation for the suggestion.

Example:

```text
Suggested high priority because this is a move-out cleaning request and the preferred date is within 48 hours.
```

---

## 6. MVP-Safe Version

The first safe product version, if ever implemented, should be intentionally limited:

### Included

- priority suggestion,
- suggested queue,
- missing information summary,
- routing reason,
- owner/admin confirmation,
- fallback to owner inbox,
- no hidden leads,
- no auto-send,
- no clinical/regulated decision-making.

### Not Included

- automatic assignment by default,
- full rule builder,
- complex workflow automation,
- medical triage,
- emergency handling,
- booking,
- invoicing,
- calendar sync,
- SMS/WhatsApp automation,
- external channel integrations,
- multi-vertical production launch.

### MVP UI Concept

In lead detail:

```text
Priority: High
Suggested queue: Move-out Cleaning
Suggested reviewer: Owner
Reason:
- Move-out request
- Preferred date is within 48 hours
- Square footage is missing
Next action:
Ask for square footage, access/parking, and appliance cleaning details.
```

Buttons:

```text
Accept suggestion
Change queue
Mark review needed
Copy reply
```

For the first cleaning MVP, even these buttons may remain conceptual until real customer demand confirms value.

---

## 7. Advanced Future Version

Only after validation, the advanced version may include:

- business-defined queues,
- team/member routing profiles,
- field priority weights,
- rule builder,
- routing suggestions,
- optional confirmed assignment,
- audit trail,
- conflict handling,
- inactive-assignee fallback,
- role/permission checks,
- queue-level analytics.

The advanced version should still maintain human oversight.

---

## 8. Cleaning-First Example

A cleaning business uses BizPilot for quote recovery.

### Intake Fields

- cleaning type,
- property type,
- bedrooms,
- bathrooms,
- approximate square footage,
- location,
- preferred date,
- urgency,
- one-time or recurring,
- customer notes.

### Team / Queues

- Owner Review,
- Intake Review,
- Move-out Cleaning,
- Residential Cleaning,
- Commercial Cleaning,
- Airbnb Turnover,
- Estimator Review.

### Example Rules

```text
If cleaning_type = Move-out cleaning
then priority = High
and suggested_queue = Owner Review
```

```text
If preferred_date is within 48 hours
then priority = High
and next_action = Reply quickly to confirm details
```

```text
If property_type = Commercial
then suggested_queue = Commercial Cleaning
```

```text
If square_footage is missing
then missing_info includes Square footage
and suggested_queue = Intake Review
```

```text
If location is outside service area
then status = Review needed
and suggested_queue = Owner Review
```

### Example Lead Result

```text
Lead: Sarah J.
Request: Move-out cleaning for a 2-bedroom condo this Friday
Priority: High
Suggested queue: Move-out Cleaning
Suggested reviewer: Owner
Missing info:
- square footage
- access/parking
- inside appliance cleaning
Reason:
- Move-out request
- urgent preferred date
- quote details incomplete
Next action:
Send owner-reviewed reply asking for the missing details.
```

This fits BizPilot's current direction because it improves quote recovery without adding booking, auto-send, or workflow automation.

---

## 9. Clinic Example - Conceptual Only

A clinic example helps explain the routing idea, but it must remain conceptual. Healthcare or clinic support is not part of current product scope.

### Important Safety Boundary

BizPilot must not perform:

- diagnosis,
- medical triage,
- emergency assessment,
- clinical advice,
- automatic clinical routing,
- healthcare production support without compliance review.

### Conceptual Intake Fields

- service category,
- requested specialist,
- reason for visit,
- preferred language,
- preferred date,
- existing patient status,
- admin notes.

### Conceptual Queues

- Front Desk,
- General Intake,
- Orthopedic Queue,
- ENT Queue,
- Physiotherapy Queue,
- Billing/Admin.

### Conceptual Rules

```text
If service_category = Orthopedic
then suggested_queue = Orthopedic Queue
and reviewer = Front Desk first
```

```text
If service_category = ENT
then suggested_queue = ENT Queue
and reviewer = Front Desk first
```

```text
If preferred_language = French
then suggested_queue = French-speaking staff review
```

```text
If required admin details are missing
then suggested_queue = Intake Review
```

### Safe Clinic Output

```text
Suggested queue: Orthopedic Queue
Reviewer: Front Desk first
Reason:
- Patient selected Orthopedic service category
- Admin details need confirmation
Safety note:
This is administrative routing only. No diagnosis or medical triage is performed.
```

This example should not be used in marketing or production until legal, privacy, and compliance implications are reviewed.

---

## 10. Suggested Dashboard UX

Future dashboard location:

```text
Settings -> Intake Routing
```

### Section 1 - Important Fields

Question:

```text
Which answers should affect priority or routing?
```

Example checklist:

```text
[x] Service type
[x] Urgency
[x] Preferred date
[x] Location
[ ] Notes
[ ] Budget
```

Optional simple priority levels:

```text
Normal
Important
Very important
```

### Section 2 - Service Categories

Examples for cleaning:

```text
Move-out cleaning
Deep cleaning
Recurring cleaning
Commercial cleaning
Airbnb turnover
```

### Section 3 - Queues / People

Examples:

```text
Owner Review
Intake Review
Estimator
Commercial Manager
Team Lead
```

### Section 4 - Routing Rules

Simple rule builder concept:

```text
When [Service type] is [Move-out cleaning]
Set [Priority] to [High]
Suggest [Queue] = [Owner Review]
```

### Section 5 - Test With Sample Lead

Before enabling a rule, the owner/admin can test it against a sample request.

```text
Sample lead matched 2 rules:
- Move-out cleaning -> Owner Review
- Preferred date within 48 hours -> High priority
Final suggestion: High priority / Owner Review
```

---

## 11. Lead Detail UX Concept

A future lead detail card may show:

```text
BizPilot Routing Suggestion

Priority: High
Suggested queue: Move-out Cleaning
Suggested assignee: Owner
Confidence: Medium

Reason:
- Move-out cleaning selected
- Preferred date is within 48 hours
- Square footage missing

Next action:
Ask for square footage, access/parking, and appliance details.
```

Actions:

```text
Accept suggestion
Change queue
Assign to someone else
Mark as review needed
Copy reply
```

MVP-safe version may omit actual assignment and only display suggested priority/queue.

---

## 12. Conflict Resolution Rules

If multiple rules match, BizPilot should resolve them safely:

1. safety/urgent rule wins first,
2. missing information rule comes next,
3. service category rule comes next,
4. preferred assignee rule comes after,
5. if conflict remains, send to owner review.

Example conflict:

```text
Service type = Commercial -> Commercial Manager
Urgency = High -> Owner Review
Missing info = Yes -> Intake Review
```

Safe result:

```text
Priority: High
Queue: Intake Review
Suggested reviewer: Owner
Reason: urgent + missing information + commercial request
```

---

## 13. Fail-Safe Rules

Smart Intake Routing must never cause a lead to disappear.

Required fail-safes:

```text
If no rule matches -> Owner inbox
If rules conflict -> Owner review
If assignee inactive -> Owner inbox
If queue is disabled -> Owner inbox
If business is locked/deletion_requested/deleting/deleted -> no new intake
If required routing data is missing -> Intake Review
If AI/routing engine fails -> Owner inbox
```

Other hard rules:

- never auto-send messages,
- never hide leads from owner/admin,
- never make clinical decisions,
- never block owner visibility,
- always show why a route was suggested.

---

## 14. Security, Privacy, and RLS Considerations

Before implementation, the following must be designed and reviewed:

- tenant-scoped routing rules,
- tenant-scoped queues,
- role-based access to assignments,
- owner/admin-only routing configuration,
- member visibility rules,
- audit trail for routing changes,
- no service role in client code,
- no cross-tenant lead visibility,
- safe logging only,
- no customer payloads in routing logs,
- no sensitive prompt/provider data in metadata.

If routing suggestions are generated by AI, logs must not store raw customer payloads or prompts.

---

## 15. Future Data Model Sketch

This is a design sketch only. Do not create migrations from this section yet.

```text
business_routing_queues
- id
- business_id
- name
- description
- active
- created_at
- updated_at

business_member_routing_profiles
- id
- business_id
- member_id
- queue_id
- role_label
- active
- created_at
- updated_at

intake_field_priorities
- id
- business_id
- field_key
- priority_weight
- affects_routing
- affects_urgency
- active
- created_at
- updated_at

lead_routing_rules
- id
- business_id
- name
- conditions_json
- actions_json
- priority_order
- enabled
- created_at
- updated_at

lead_routing_suggestions
- id
- lead_id
- suggested_priority
- suggested_queue_id
- suggested_assignee_id
- reason_json
- accepted_by
- accepted_at
- created_at
```

Do not implement this schema until build gates are met.

---

## 16. Validation Questions for Customer Discovery

Use these questions during founder-led discovery:

1. Who handles incoming quote requests today?
2. Do different request types go to different people?
3. What makes a request high priority?
4. Which customer answers matter most when deciding who should handle a lead?
5. Do leads ever get delayed because the wrong person saw them first?
6. How many people handle leads in your business?
7. Do you need automatic assignment, or would a suggestion be enough?
8. Would it help if BizPilot showed who should handle this and why?
9. What information is usually missing before someone can respond?
10. What would make this routing suggestion trustworthy?

Build signal:

```text
Consider implementation only after at least 3-5 real businesses confirm routing pain and ask for this workflow.
```

---

## 17. Build Gate

Do not implement Smart Intake Routing until all of these are true:

- production pilot gates pass,
- production Supabase schema/RPC alignment is complete,
- backup/export posture is documented,
- first cleaning pilots provide feedback,
- at least 3-5 businesses confirm routing pain,
- role/permission model is reviewed,
- RLS design is reviewed,
- no active Phase 21 production blockers remain,
- owner approves routing as a product priority.

---

## 18. Recommended Roadmap

### Stage 0 - Now

Docs only.

```text
Document future concept.
Use in customer discovery.
Do not implement runtime behavior.
```

### Stage 1 - Simple Cleaning Signal

Potential later MVP-safe addition:

```text
Priority badge
Missing info summary
Suggested queue text
Routing reason text
No actual assignment
```

### Stage 2 - Manual Suggested Routing

```text
Business-defined queues
Suggested queue
Owner/admin confirmation
Audit trail
```

### Stage 3 - Rules and Team Routing

```text
Rule builder
Member routing profiles
Optional confirmed assignment
Conflict handling
Queue analytics
```

### Stage 4 - Vertical-Specific Routing Packs

Only after cleaning validation:

```text
Cleaning routing pack
Detailing routing pack
Home services routing pack
```

Do not build healthcare/clinic workflows without compliance review.

---

## 19. Explicit Non-Goals

This module is not:

- a CRM replacement,
- a clinical triage system,
- an AI decision-maker,
- an emergency routing tool,
- a workflow automation engine,
- an auto-send system,
- a booking scheduler,
- an invoicing system,
- a calendar dispatch system,
- a multi-vertical launch vehicle for the current phase.

---

## 20. Current Project Status Reminder

As of this document:

```text
BizPilot is ready only for founder-controlled synthetic demos.
BizPilot is not ready for first real pilot customer with real customer data.
```

Open gates include production readiness, backup/export posture, production quote smoke, fr-CA smoke, OpenAI real-key validation, signup confirmation smoke, and commercial terms approval.

Smart Intake Routing must not distract from closing these gates.

---

## 21. Final Recommendation

Approve this as a **future product direction** and add it to the product docs.

Do not build it yet.

Best next action:

```text
Add this spec to docs/product.
Reference it as a future module.
Use the validation questions during customer discovery.
Keep the current MVP scope unchanged.
```
