# BizPilot AI — Backend, Database, and RLS Standard v1.5

**Project:** BizPilot AI  
**Document Type:** Backend / Database / RLS Standard  
**Version:** v1.5  
**Status:** Active Canonical Standard  
**Owner:** MoOoH  
**Last Updated:** 2026-05-12  

---

## 1. Purpose

This document upgrades the previous database/RLS baseline into a practical backend security and data integrity standard for the BizPilot MVP.

The goal is:

```text
No cross-tenant leaks.
No public data exposure.
No fragile RLS.
No unvalidated public writes.
No avoidable performance problems.
```

---

## 2. Backend Architecture Contract

Every backend workflow must follow:

```text
Action / Route Handler
  -> validate input
  -> resolve actor/session
  -> call service
  -> enforce policy
  -> call repository
  -> rely on RLS as final database guard
  -> return safe DTO or action result
```

Rules:

- Repositories do not bypass tenant rules casually.
- Services do not trust client-provided `business_id` without membership/public-link verification.
- Policies are reusable and testable.
- RLS remains the final protection layer even when service policies are correct.

---

## 3. Tenant Model

Primary tenant entity:

```text
businesses.id
```

Membership entity:

```text
business_members(user_id, business_id, role, status)
```

Every tenant-owned operational table must include:

```text
business_id uuid not null references businesses(id)
```

Exceptions must be documented in the migration file and this document.

---

## 4. Public Surface Model

Public quote pages have limited capabilities.

Allowed:

- Resolve active public link/slug.
- Read active public-safe business branding.
- Read active public form and visible fields.
- Insert scoped submission.
- Insert scoped lead.
- Capture consent version and source metadata.

Forbidden:

- Reading private owner data.
- Reading other businesses.
- Reading dashboard configuration not marked public-safe.
- Reading AI outputs.
- Reading usage/subscription/admin data.
- Updating existing private records.
- Listing all businesses or forms.

---

## 5. RLS Policy Rules

For each table, define policy groups by actor:

```text
anon/public
authenticated member
business owner/admin
service role / internal only
```

Policy requirements:

- Enable RLS on every exposed table.
- Use `business_id` scoping for tenant tables.
- Use helper functions for repeated membership checks.
- Helper functions must have safe `search_path`.
- Avoid self-referential or recursive policy patterns.
- Public policies must be narrow and explicitly documented.
- Avoid multiple permissive policies that accidentally combine into broader access than intended.

Policy naming:

```text
<table>_<operation>_<actor>_<scope>
```

Examples:

```text
leads_select_business_member
leads_update_business_member
intake_forms_select_public_active
intake_submissions_insert_public_scoped
```

---

## 6. RLS Helper Function Standard

Recommended helper function pattern:

```sql
create or replace function public.is_business_member(target_business_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.business_members bm
    where bm.business_id = target_business_id
      and bm.user_id = auth.uid()
      and bm.status = 'active'
  );
$$;
```

Rules:

- Use `stable` where possible.
- Set `search_path` explicitly.
- Keep helpers small.
- Do not expose helpers to anonymous roles unless needed.
- Test helper behavior indirectly through table policies.

---

## 7. Index Standard

Every RLS predicate and common filter must have indexes.

Required indexes by pattern:

```text
business_members(user_id, business_id, status)
tenant tables: (business_id)
tenant ordered lists: (business_id, created_at desc)
lead queue: (business_id, status, created_at desc)
lead SLA: (business_id, response_sla_state, last_owner_action_at)
public link lookup: (slug) where is_active = true
public form lookup: (business_id, is_active)
submission values: (submission_id), (business_id) if present
usage events: (business_id, created_at desc)
ai outputs: (business_id, lead_id, created_at desc)
```

Rules:

- Add indexes in the same migration or the next hardening migration.
- Do not over-index early, but do not ignore RLS predicate indexes.
- Run Supabase Performance Advisor before sales-ready launch.

---

## 8. Migration Standard

Migration naming:

```text
0001_auth_tenant_foundation.sql
0002_business_configuration.sql
0003_public_intake.sql
0004_lead_conversion_desk.sql
0005_ai_assistant_foundation.sql
0006_security_hardening.sql
0007_rls_index_hardening.sql
```

Every migration must:

- Be idempotent where practical.
- Enable RLS for new exposed tables.
- Add policies before app code depends on tables.
- Add indexes for RLS and common queries.
- Avoid destructive changes without explicit backup/rollback note.
- Include comments for public policies and sensitive columns.

---

## 9. Data Validation Standard

Server-side validation is required for:

- Auth form input.
- Business configuration updates.
- Public quote submissions.
- Lead status/outcome updates.
- AI generation input.
- AI output.
- Payment/webhook data when added.

Public quote submission validation must include:

- Required field checks.
- Max length per text field.
- Email/phone normalization rules.
- Service area validation when configured.
- Honeypot field.
- Minimum submit-time heuristic.
- Rate limit check.
- Consent accepted/version captured.

---

## 10. Abuse and Rate Limit Standard

MVP public endpoints must include low-cost abuse controls.

Required for `/quote/[slug]` submissions:

- Honeypot input.
- Server-side validation.
- Request body limit.
- IP/user-agent metadata hashed or minimized.
- Per-slug/per-IP rate limit.
- Clear non-technical error for blocked submissions.

Recommended low-cost implementation:

```text
rate_limit_events
- id
- business_id nullable
- route_key
- actor_hash
- window_start
- count
- created_at
```

Rules:

- Do not store full IP unless there is a clear reason.
- Hash IP with a server-side secret if tracking is needed.
- Keep retention short for rate-limit metadata.
- Add CAPTCHA only if spam appears or a demo launch requires it.

---

## 11. Audit / Security Event Standard

Add lightweight security/audit events before real public usage.

Recommended table:

```text
security_events
- id
- business_id nullable
- user_id nullable
- event_type
- severity
- route
- actor_type
- actor_hash nullable
- metadata jsonb
- created_at
```

Events to capture:

- Auth failures above threshold.
- Public submission blocked by rate limit/spam filter.
- Cross-tenant access denial in service/policy layer.
- AI generation failure or schema validation failure.
- Sensitive settings updated.
- Privacy deletion/minimization request created.

Rules:

- Security events must not contain raw secrets or full customer message content.
- Metadata must be intentionally shaped.
- Events must be tenant-scoped where applicable.

---

## 12. AI Output Tables

AI output storage must include:

```text
id
business_id
lead_id nullable
output_type
prompt_name
prompt_version
schema_version
model
input_hash nullable
output_json
cost_metadata jsonb
status
created_by_user_id nullable
created_at
```

Rules:

- Store structured output, not just raw text.
- Store validation status.
- Store cost metadata.
- Avoid storing full raw prompts unless explicitly needed.
- Respect privacy mode.
- Minimal Data Mode may store less AI detail or only generated owner-visible draft fields.

---

## 13. Required RLS Tests

For each tenant-owned table:

- Member can select own business data.
- Member cannot select another business data.
- Member can update only allowed fields.
- Anonymous cannot read private data.
- Anonymous cannot update/delete.

For public intake:

- Anonymous can read active public link only.
- Anonymous cannot read inactive/draft links.
- Anonymous can read visible active form fields only.
- Anonymous cannot read hidden fields.
- Anonymous can insert scoped submission only for active public link.
- Anonymous cannot list private submissions/leads after insert.

For service-role/internal:

- Service-role-only flows are not callable from client code.
- Service-role operations are wrapped in server-only modules.

---

## 14. Pre-MVP Backend Acceptance Checklist

Before sales-ready MVP:

- `pnpm typecheck` passes.
- `pnpm lint` passes.
- `pnpm build` passes.
- RLS tests pass.
- Public quote happy path works.
- Public quote spam/honeypot path works.
- Cross-tenant manual test passes.
- Supabase Security Advisor reviewed.
- Supabase Performance Advisor reviewed.
- Sensitive columns review completed.
- No service role key in client bundle.
- No raw provider/database errors shown in UI.

---

## 15. Definition of Done

This backend/database/RLS standard is satisfied when:

- Every tenant table has `business_id`, RLS, policies, and tests.
- Public policies are narrow and tested.
- RLS predicates have practical indexes.
- Rate limiting exists for public quote submissions.
- Security events exist for sensitive operations.
- Service role access is server-only.
- Supabase advisors have been reviewed before launch.

## RLS Addendum — Public Quote Submission Hardening v1.6

The public quote submission path is the highest-risk MVP surface and must be treated as security-critical.

### Required Public Insert Controls

For public intake submissions and values:

- public inserts must be limited to active public links/forms,
- submitted fields must correspond to allowed fields for the active form,
- hidden/internal fields must not be publicly writable,
- tenant/business association must be verified at the database policy/helper level,
- app validation must not be the only enforcement layer,
- rate limiting or abuse controls must be applied before broad public sharing,
- honeypot/spam signals should be recorded safely without exposing sensitive internals.

### Security Hierarchy

Database policies and explicit GRANTs are the primary security boundary. Application validation and UI constraints are secondary defenses.

### Test Requirement

Every public quote RLS change must include or update RLS tests for:

- valid public insert,
- invalid business/form mismatch,
- hidden field rejection,
- invalid field key rejection,
- inactive public link rejection,
- cross-tenant read/write denial.
