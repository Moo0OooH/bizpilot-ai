# BizPilot AI - Access Control and Suspension Standard v1.0

## Purpose

Define how BizPilot blocks or allows dashboard access, public quote access, and internal founder operations during pilot validation.

## Required Data Controls

```text
businesses.status
businesses.plan_slug
businesses.plan_started_at
businesses.plan_expires_at
business_members.status
public_link_variants.is_active
admin_action_log
```

## Status Rules

```text
active business -> dashboard works and quote page works
onboarding business -> dashboard works and quote page can work
suspended business -> dashboard blocked and quote page disabled
cancelled business -> dashboard blocked and quote page disabled
paused plan -> quote page disabled and access treated as paused
disabled membership -> user is not treated as an active business member
```

## RLS Helper Requirements

`public.is_business_member(target_business_id)` must require:

```text
auth.uid() matches active business_members.user_id
business_members.status = active
businesses.status in onboarding/active
```

`public.can_manage_business(target_business_id)` must additionally require:

```text
business_members.role in owner/admin
```

`public.has_active_public_link(target_business_id)` must require:

```text
public_link_variants.is_active = true
businesses.status in onboarding/active
businesses.plan_slug <> paused
```

## Founder Admin Requirements

- Cross-tenant reads use service role only after founder email allowlist authorization.
- Admin action logs are not readable by regular authenticated users.
- Every plan/status/link/note change is logged.
- Suspended/cancelled businesses keep data retained.

## Customer-Facing Error Standard

Paused or suspended users should see a safe message:

```text
This workspace is paused or unavailable.
```

The UI must not expose database policy names, service-role details, or raw Supabase errors.

## Verification

Required checks:

```text
pnpm test:rls
dashboard blocked for suspended business
public quote page blocked for inactive link
public quote page blocked for suspended business
admin_action_log blocked from authenticated client access
```

