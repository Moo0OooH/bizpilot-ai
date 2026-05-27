# Phase 22 - Production Access And Runtime Audit

**Project:** BizPilot AI  
**Date:** 2026-05-27  
**Status:** Production access restored; founder repair control implemented for unlinked confirmed users  
**Scope:** Supabase production access, Vercel production wiring, founder admin data loading, public quote smoke, and incomplete workspace bootstrap evidence.

## Summary

The production Supabase Management API token was accepted and can see the
canonical production project:

- Project ref: `qfqendrqimqvkoojpjao`
- Project name: `bizpilot-production`
- Production site: `https://bizpilo.com`

No raw tokens, service-role keys, anon keys, cookies, or passwords were recorded
in this document.

## Production Env Finding

The earlier founder admin empty state matched a production runtime wiring
problem, not a GitHub Actions or frontend counting problem.

Production Vercel env names existed, but sensitive values pulled as empty through
the CLI security path. The production env was reset from Supabase Management API
for:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `BIZPILOT_FOUNDER_EMAILS`
- `NEXT_PUBLIC_APP_URL`

Production was redeployed after the env sync.

## Verification Evidence

### App and CI

- `pnpm verify` - pass
- GitHub Actions CI for commit `358477b` - pass
- Production deployment - ready
- `pnpm smoke:public -- --base-url=https://bizpilo.com --timeout-ms=20000` - pass, 9/9

### Production Supabase Runtime

Direct service-role runtime checks against the canonical project now pass:

| Check | Result |
| --- | --- |
| Auth Admin list users | OK |
| `businesses` REST count | OK |
| `business_members` REST count | OK |
| `profiles` REST count | OK |
| `admin_action_log` REST count | OK |
| `business_deletion_requests` REST count | OK |
| `public_link_variants` REST count | OK |
| `leads` REST count | OK |
| `usage_events` REST count | OK |

Aggregate production counts observed after the env/deploy repair:

| Metric | Count |
| --- | ---: |
| Auth users | 15 |
| Confirmed auth users | 12 |
| Profiles | 15 |
| Businesses | 12 |
| Active businesses | 3 |
| Locked businesses | 1 |
| Memberships | 12 |
| Owner memberships | 12 |
| Active memberships | 12 |
| Auth users without membership | 3 |
| Businesses without owner | 0 |
| Active businesses without active owner | 0 |
| Public quote links | 4 |
| Active public quote links | 4 |
| Leads | 5 |

### Schema And RLS

Read-only schema audit:

- Public tables: 31
- Public tables with RLS enabled: 31
- Public RLS policies: 70
- Key public quote helper functions present: 4
- Standard Supabase migration history table: not present

Migration-history remains a documentation/runtime-evidence gap, not an observed
application failure. Continue using object-level verification unless a future
step intentionally normalizes migration history.

### Public Quote

Production quote route smoke:

```text
pnpm smoke:quote -- --base-url=https://bizpilo.com --active-slug=milen --inactive-slug=phase-21-synthetic-unavailable-check --timeout-ms=20000
```

Result:

- Active quote link `/quote/milen` - pass
- Inactive/unavailable quote link - pass

After the confirmed unlinked owner recovery below:

```text
pnpm smoke:quote -- --base-url=https://bizpilo.com --active-slug=your-cleaning-business --inactive-slug=phase-21-synthetic-unavailable-check --timeout-ms=20000
```

Result:

- Recovered quote link `/quote/your-cleaning-business` - pass
- Inactive/unavailable quote link - pass

## Remaining Operational Gaps

### 1. Incomplete Auth Users

Initial audit found three auth users with no `business_members` row. One was
confirmed.

Interpretation:

- This is consistent with earlier incomplete signup/bootstrap attempts while
  production service-role env wiring was broken.
- The current dashboard recovery flow should repair the confirmed unlinked user
  when the signed-in owner submits a business name.
- Do not treat this as founder admin data-load failure; admin data is now
  available through Auth Admin and service-role table reads.

Execution performed in this phase:

- The confirmed unlinked owner account was signed in through production using a
  temporary smoke password.
- The owner dashboard recovery form was submitted with a safe cleaning business
  name.
- The dashboard loaded after recovery.
- A standard password reset email was requested afterward so the test account is
  not left dependent on the temporary smoke password.
- Post-recovery counts: `businesses=13`, `business_members=13`,
  `auth_users_without_membership=2`.
- The recovered active quote link smoke passed.

Implemented support path:

1. The signed-in owner can still use the dashboard recovery form with a
   business name.
2. Founder admin now exposes a manual repair control for confirmed users with no
   linked workspace. The action requires a target user id, a business name, and
   founder acknowledgement, then uses the same safe workspace bootstrap service
   used by owner self-recovery.
3. One-off SQL repair should remain a fallback only, not the normal support path.

### 2. Authenticated Browser Smoke

The existing dashboard smoke script intentionally blocks production synthetic
data creation. That guard remains correct for normal runs.

If a future execution needs full production authenticated browser smoke, use a
separate founder-approved synthetic account/session workflow and record:

- synthetic email pattern,
- created business id,
- created lead id,
- whether the data was retained for evidence or cleaned up.

### 3. Migration History

`supabase_migrations.schema_migrations` is still absent/empty from the
Management API migration-history perspective. Existing docs already warn not to
blindly re-apply old migrations. Keep production drift checks object-based until
the project intentionally adopts a migration-history normalization plan.

## Current Decision

Production founder/admin data loading is no longer blocked by service-role/Auth
Admin authorization. The remaining incomplete-workspace cases are isolated data
repair/recovery cases, not a global dashboard/admin runtime failure.

Founder/admin data loading is healthy at the backend level, public quote smoke is
passing, the known confirmed unlinked owner has been recovered, and future
confirmed unlinked users now have both owner self-recovery and founder-assisted
repair paths without SQL.
