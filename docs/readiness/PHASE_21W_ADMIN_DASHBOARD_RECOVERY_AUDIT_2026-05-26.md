# Phase 21W - Admin Dashboard And Workspace Recovery Root Audit

**Project:** BizPilot AI  
**Document Type:** Root-cause audit and corrective proposal  
**Status:** Investigation recorded; targeted corrective code implemented after audit  
**Owner:** MoOoH  
**Last Updated:** 2026-05-26

---

## 1. Purpose

This document records the root audit requested after the production founder admin
console still rendered empty and a newly created owner account still could not
recover into a usable dashboard.

The initial audit pass did not apply fixes, migrations, cleanup, user deletion,
or production SQL. After owner instruction to proceed with full access, the
targeted corrective code was implemented without production SQL/data mutation.

The previous GitHub Actions / Pages issue is not treated as a code failure here.
The latest visible workflow run for `docs: record step 10 horizontal access smoke`
is passing, and the earlier CI problem appears consistent with the GitHub incident
noted by the owner.

## 2. Guardrails Used In This Pass

- No production SQL mutation.
- No production user deletion or data cleanup.
- No code fix beyond this new documentation file.
- No secrets, service-role keys, anon keys, passwords, cookies, tokens, full
  emails, or full connection strings printed or recorded.
- Vercel logs were read for operational evidence.
- Vercel env metadata was inspected only through safe presence/length/ref checks,
  not by printing values.
- Supabase rate limits are treated as a real operational constraint; a failed
  auth/smoke attempt must be interpreted with wait/retry context instead of as
  automatic product failure.

## 3. Current Evidence

### 3.1 Production Logs

Command:

```powershell
npx vercel logs https://bizpilo.com --since 2h --expand --level error --no-branch
npx vercel logs https://bizpilo.com --since 2h --expand --level warning --no-branch
```

Observed:

```text
GET /dashboard error:
Cookies can only be modified in a Server Action or Route Handler.
```

Observed:

```text
POST /dashboard warning:
workspace_recovery.failed
errorCode=workspace_recovery_failed
userId=e7113123-bda1-41d3-9f4c-e96f437d0a5f
```

Observed:

```text
GET /admin warnings:
founder_admin.deletion_requests_unavailable
founder_admin.action_log_unavailable
founder_admin.auth_rest_unavailable status=401
founder_admin.read_unavailable read_name=auth_users status=401 error_code=no_authorization
```

Interpretation:

- `/admin` is no longer failing at founder email allowlist. It reaches founder
  admin reads.
- Supabase Auth Admin reads are rejected with `401 no_authorization`.
- The admin console showing zero users is not a GitHub Actions issue and not a
  frontend counting issue by itself. The server cannot authorize the Auth Admin
  API with the current production runtime credentials.
- `/dashboard` safe error is a separate runtime bug caused by mutating cookies
  in a Server Component.

### 3.2 Code Path Evidence

Relevant files inspected:

- `app/(dashboard)/layout.tsx`
- `server/actions/workspace-recovery.actions.ts`
- `server/services/business.service.ts`
- `server/services/founder-admin.service.ts`
- `lib/supabase/server.ts`
- `lib/env/server-env.ts`
- `tests/smoke/dashboard-auth-smoke.mts`

Current dashboard recovery path:

```text
app/(dashboard)/layout.tsx
  -> getCurrentUser()
  -> getBusinessWorkspace({ userId })
  -> if no active business, render recovery form
  -> recoverWorkspaceAccessAction
  -> recoverWorkspaceAccess()
```

Current founder admin path:

```text
app/admin/page.tsx
  -> getCurrentUser()
  -> getFounderAdminOverview()
  -> assertFounderUser()
  -> createSupabaseServiceRoleClient()
  -> list businesses, members, public links, lead signals, usage signals
  -> list Auth users through supabase.auth.admin.listUsers()
```

The critical auth/admin evidence is:

```text
status=401
error_code=no_authorization
read_name=auth_users
```

That points to the production Supabase service credential being missing, empty,
wrong for the target project, or not being used as a valid service-role/secret
key at runtime.

### 3.3 Documentation Evidence

Active production target records repeatedly identify the canonical production
Supabase project as:

```text
bizpilot-production / qfqendrqimqvkoojpjao
https://qfqendrqimqvkoojpjao.supabase.co
```

Relevant docs:

- `docs/readiness/PHASE_21A_PRODUCTION_TARGET_AND_BACKUP_GATE.md`
- `docs/readiness/PHASE_21_NEXT_TAB_HANDOFF.md`
- `docs/readiness/PHASE_21B_PRODUCTION_MIGRATION_DRIFT_MAP.md`
- `docs/ops/BACKUP_EXPORT_RESTORE_RUNBOOK.md`
- `docs/operations/BIZPILOT_CHANGE_EVIDENCE_AND_REMEMBERING_PROTOCOL_v1.0.md`

Important historical warning from the docs:

```text
Local .env.local was previously observed pointing at cwiuajpbpyybxxtodpaq and
must not be treated as production truth.
```

Current implication:

- The production app must be reconciled against `qfqendrqimqvkoojpjao`.
- Vercel env variable names existing is not enough evidence. Runtime values and
  project matching must be verified without exposing secrets.

## 4. Main Findings

### Finding 1 - Admin Empty State Is Most Likely Production Supabase Auth Credential/Target Drift

The admin screen shows:

```text
Auth users: 0
Active pilots: 0
Payment-ready: 0
Paused access: 0
```

Production logs show:

```text
Auth Admin API returns 401 no_authorization.
```

The most likely root cause is one of:

1. `SUPABASE_SERVICE_ROLE_KEY` in Vercel Production is not the service-role key
   for the Supabase project used by `NEXT_PUBLIC_SUPABASE_URL`.
2. `NEXT_PUBLIC_SUPABASE_URL` in Vercel Production is not the canonical project
   `qfqendrqimqvkoojpjao`.
3. The service-role key was copied from another Supabase project.
4. Vercel Production env was changed but production was not redeployed after the
   final value change.
5. The value is present as an env name but effectively blank/invalid at runtime.

The evidence does not support treating this as a GitHub Actions or CI failure.

### Finding 2 - Dashboard Safe Runtime Error Is A Real Code Bug

`app/(dashboard)/layout.tsx` reads:

```text
const recoveryError = cookieStore.get(WORKSPACE_RECOVERY_ERROR_COOKIE)?.value;
if (recoveryError) {
  cookieStore.delete(WORKSPACE_RECOVERY_ERROR_COOKIE);
}
```

This is inside a Server Component layout. Next.js only allows modifying cookies
inside Server Actions or Route Handlers. Production therefore renders:

```text
The workspace needs a refresh.
```

when the recovery error cookie exists.

Corrective proposal:

- Stop deleting this cookie inside the layout.
- Either let the short `maxAge` expire naturally, or clear it inside a Route
  Handler / Server Action.

### Finding 3 - Workspace Recovery Failure Is Still Opaque

The latest recovery attempt logs:

```text
workspace_recovery.failed errorCode=workspace_recovery_failed
```

The safe log does not yet distinguish:

- business insert failed,
- owner membership insert failed,
- default quote configuration failed,
- missing template,
- invalid service-role credential,
- wrong Supabase project,
- RLS/Data API grant problem,
- schema drift.

Current recovery implementation catches the top-level error and maps unknowns
to `workspace_recovery_failed`, which is safe for users but not precise enough
for operations.

Corrective proposal:

- Add internal step-level safe operation codes inside `recoverWorkspaceAccess`
  and `createFoundingBusiness`:
  - `workspace_recovery.membership_read_failed`
  - `workspace_recovery.business_read_failed`
  - `workspace_recovery.business_create_failed`
  - `workspace_recovery.owner_membership_create_failed`
  - `workspace_recovery.template_lookup_failed`
  - `workspace_recovery.default_config_failed`
- Do not log business names, emails, customer payloads, or raw provider messages.
- Return user-safe copy only.

### Finding 4 - Admin Fallback Was The Wrong Direction Until Runtime Credentials Are Reconciled

The recent fallback work made `/admin` more tolerant of optional reads, but the
current evidence says the core problem is authorization/target drift. Adding UI
fallbacks cannot make a wrong Supabase service credential read Auth users.

Corrective principle:

```text
First prove the production app points to the canonical Supabase project with
matching anon/service-role keys. Then improve admin UX and fallback behavior.
```

### Finding 5 - Production Smoke Must Respect Supabase Limits And Data Policy

`tests/smoke/dashboard-auth-smoke.mts` explicitly blocks synthetic mutating smoke
against:

- `bizpilo.com`
- `qfqendrqimqvkoojpjao`
- `VERCEL_ENV=production`

This matches the change evidence protocol. Supabase Auth rate limits can also
make signup/recovery smoke misleading if retried too aggressively.

Corrective proposal:

- Use read-only runtime health endpoints/log checks first.
- For mutating production auth/signup/recovery tests, use one approved synthetic
  account, wait windows for Supabase rate limits, and document keep/delete
  decisions before running.

## 5. Recommended Repair Plan

### Step A - Stop Further UI Fallback Patching

Do not continue adding client/admin empty-state fallbacks until the production
Supabase target and service credential are proven correct.

### Step B - Add A Server-Only Founder Health Check

Add a founder-only diagnostic route or admin panel block that reports only safe
booleans/counts, never secrets:

```text
supabase_url_host_ref_matches_expected: true/false
service_role_auth_admin_authorized: true/false
businesses_read_ok: true/false
businesses_count: number
business_members_read_ok: true/false
business_members_count: number
profiles_read_ok: true/false
profiles_count: number
public_links_count: number
admin_action_log_read_ok: true/false
deletion_requests_read_ok: true/false
```

This should be gated by `assertFounderUser()` and should avoid raw errors. It
should log safe codes such as `prod_health.auth_admin_401`.

### Step C - Reconcile Vercel Production Env Against Canonical Supabase

Without exposing values:

1. Confirm Vercel Production `NEXT_PUBLIC_SUPABASE_URL` host is
   `qfqendrqimqvkoojpjao.supabase.co`.
2. Confirm Vercel Production `NEXT_PUBLIC_SUPABASE_ANON_KEY` belongs to that
   same project.
3. Confirm Vercel Production `SUPABASE_SERVICE_ROLE_KEY` belongs to that same
   project and authorizes `auth.admin.listUsers`.
4. Confirm `BIZPILOT_FOUNDER_EMAILS` includes the founder email exactly after
   trim/lowercase.
5. Redeploy production after any env correction.

### Step D - Fix The Dashboard Cookie Runtime Bug

Move recovery error cookie clearing out of `app/(dashboard)/layout.tsx`.

Minimal safe fix:

```text
Read the cookie in the layout.
Do not delete it there.
Rely on maxAge=60 until a route-handler clear path is added.
```

### Step E - Add Step-Level Recovery Logging

Instrument the recovery pipeline with safe internal operation codes. This should
make the next failed recovery attempt identify the failing subsystem without
exposing secrets or user data.

### Step F - Then Decide On Synthetic Production Data Reset

The owner has stated that current production data is test-only and may be reset.
Even so, the reset should be done as a documented operation:

1. Read-only inventory counts first.
2. Exact SQL/action proposed in a document.
3. Owner approval for the exact SQL/action.
4. Backup/export decision explicitly accepted or skipped.
5. Run reset.
6. Recreate one founder account and one synthetic owner workspace.
7. Smoke `/admin`, `/dashboard`, `/quote/[slug]`, and horizontal access.

## 6. Proposed Files To Change In The Next Repair Pass

Do not treat this as approval; this is the proposed next code set.

```text
app/(dashboard)/layout.tsx
  Remove cookieStore.delete from the Server Component.

server/services/business.service.ts
  Add step-level safe logging around workspace recovery and default bootstrap.

server/services/founder-admin.service.ts
  Stop hiding core auth admin 401 as an empty user list; surface a founder-only
  safe diagnostic state.

app/admin/page.tsx
  Show founder-only diagnostic copy when required reads fail, rather than making
  an all-zero console look like real empty data.

server/services/production-health.service.ts (new)
  Server-only, founder-gated safe runtime health checks.

app/admin/health or an admin section component
  Founder-only safe readout.

tests/unit/*
  Guard no secret logging, no service-role client exposure, and no cookie
  mutation in Server Components.
```

## 7. Immediate Diagnosis Summary

The current observed production behavior is best explained by two root problems:

```text
1. Production Supabase service auth is invalid/mismatched for Auth Admin reads.
2. Dashboard recovery error display currently crashes because a Server Component
   tries to delete a cookie.
```

The all-zero admin page should not be accepted as valid empty data. It should be
treated as an unhealthy runtime state until the canonical Supabase target and
service-role authorization are proven.

## 8. Next Approval Needed

Owner approved proceeding without waiting for a separate confirmation. The
focused repair pass was executed with these boundaries:

```text
Fix dashboard cookie mutation.
Add founder-only safe production health diagnostics.
Add step-level workspace recovery logging.
Do not run production SQL or delete data yet.
Deploy, then use the health diagnostics and logs to confirm whether Vercel
Production env matches qfqendrqimqvkoojpjao and has a valid service role key.
```

After that evidence exists, approve or reject an exact production data reset SQL
or Supabase action plan.

## 9. Implemented Immediately After This Audit

Files changed:

```text
app/(dashboard)/layout.tsx
app/admin/page.tsx
server/services/business.service.ts
server/services/production-health.service.ts
tests/unit/founder-admin-source.test.mts
tests/unit/signup-quote-bootstrap-source.test.mts
```

Implemented:

- Removed `cookieStore.delete(...)` from the dashboard Server Component.
- Added founder-only production health diagnostics.
- Added step-level safe workspace recovery logging.
- Added source-level tests guarding the new behavior.

Verification:

```text
pnpm verify
PASS
67 unit tests passed
Next production build passed
```
