# BizPilot AI - Founder Admin Console Spec v1.0

## Purpose

Define the small internal founder console required before serious paid pilots. This is not a customer dashboard feature and not a full CRM. It exists so the founder can manually control pilot access, plans, public quote links, usage visibility, and internal notes.

## Route

```text
/admin
```

The route must not appear in public marketing navigation or customer dashboard navigation.

## Access Standard

- Founder-only.
- Server-side authorization must check an explicit founder email allowlist.
- Cross-tenant reads and writes must use a service-role client only after founder authorization.
- Customers must never receive access to this route.
- Admin action history must stay service-role only.

## MVP Modules

### Businesses

Required fields:

```text
business name
owner email
plan
status
quote link active/inactive
lead count
AI usage count
last activity
internal note
```

### Users

Required visibility for the first version:

```text
owner email
linked business
member count
active/disabled status through membership model
```

Full user administration is deferred until pilot validation proves the need.

### Plans

Supported manual plan values:

```text
Founder Pilot
Starter
Pro
Paused
```

No Stripe Billing or automated subscription sync is required for pilot.

### Actions

Allowed founder actions:

```text
activate/change plan
set business status
suspend business
reactivate business
disable public quote link
enable public quote link
view usage counts
add internal note
```

Every action must create an internal audit record.

## Business Status Values

```text
onboarding
active
suspended
cancelled
```

## Safety Rules

- Suspending or cancelling a business disables public quote links.
- Pausing a plan disables public quote links.
- Data is retained unless the owner later approves a deletion/minimization workflow.
- The founder console must not send customer messages.
- The founder console must not create bookings, invoices, or calendar events.

## Current Implementation Evidence

- `app/admin/page.tsx`
- `server/actions/founder-admin.actions.ts`
- `server/services/founder-admin.service.ts`
- `server/repositories/founder-admin.repository.ts`
- `supabase/migrations/0015_business_access_plan_and_admin_log.sql`
- `tests/rls/business-access-plan-admin-log.test.sql`

