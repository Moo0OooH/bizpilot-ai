# Phase 21F fr-CA Production Quote Smoke

**Project:** BizPilot AI
**Document Type:** fr-CA production quote flow smoke
**Status:** Blocked - no approved active fr-CA synthetic quote link/session yet
**Owner:** MoOoH
**Last Updated:** 2026-05-25

---

## 1. Purpose

This document records whether the Canadian French production quote flow was verified end to end using synthetic cleaning data.

No production quote submission was created. No production lead was created. No production customer data was read. No real customer data was used. No production SQL was run. No confirmation links, tokens, full emails, service role keys, anon keys, OpenAI keys, database passwords, or full connection strings were printed or recorded.

## 2. Preconditions

| Required precondition | Status | Evidence / blocker |
| --- | --- | --- |
| Production public quote security passed | No | Phase 21E is blocked/not run. |
| Production migration/history alignment closed | Object-verified; history unavailable | Phase 21C/21D verified required columns/functions, expected `0018` objects, RLS status, policies, grants, and targeted constraints/seeds. `supabase_migrations.schema_migrations` is missing, so history remains unavailable/manual drift. |
| Valid synthetic fr-CA cleaning business exists | Not confirmed | Phase 21N records the proposed disposable synthetic workspace shape, but Codex does not have an active fr-CA slug/session to test yet. |
| Valid active public quote link exists | Not confirmed | `pnpm smoke:quote` supports `--fr-slug`, but no approved production fr-CA slug is recorded yet. |
| Owner approval for production data-bearing smoke | Broad readiness approval granted; execution inputs still required | Owner approved practical non-destructive readiness work. Phase 21N records the disposable fr-CA link/session/cleanup plan, but execution still requires synthetic accounts/sessions, fr-CA slug, payload, and cleanup/retain-evidence decision. |

## 3. Test Matrix

| Test | Result | Notes |
| --- | --- | --- |
| Open quote page on mobile width around 390px | Not run | Requires approved production fr-CA quote link. |
| Confirm no horizontal overflow | Not run | Browser/mobile production smoke blocked. |
| Confirm French copy is acceptable | Not run | Requires production page smoke and owner/founder review. |
| Submit safe synthetic cleaning quote | Not run | Production quote security gate is blocked. |
| Confirm lead appears in dashboard | Not run | No production lead created. |
| Confirm lead detail opens | Not run | No production lead created. |
| Confirm `source_channel`, status, and intake values are correct | Not run | Requires created synthetic lead and owner dashboard access. |
| Confirm AI/fallback section does not crash | Not run | Requires created synthetic lead/detail smoke. |
| Confirm manual copy/send workflow is clear | Not run | Requires lead detail smoke. |
| Confirm another owner cannot access the lead | Not run | Requires second synthetic owner and created lead. |

## 4. Issues

No fr-CA production issue was observed because the smoke was not run.

Current blockers are operational gates:

- production public quote security is not verified,
- `pnpm smoke:quote` is ready for an approved `--fr-slug`, but no active
  synthetic fr-CA slug is available in the current context,
- migration history is unavailable even though object/RLS/policy verification passed,
- backup/PITR/export/restore safety is not complete for real customer data,
- no approved synthetic fr-CA business/link exists yet,
- the exact production data-bearing smoke setup and cleanup policy are recorded in Phase 21N but not approved for execution.

## 5. Required Owner Actions

Before running this smoke:

1. Use Phase 21A/21B/21C/21D target and SQL verification evidence as preflight, while keeping migration history unavailable/manual drift recorded.
2. Review and approve `docs/readiness/PHASE_21N_SYNTHETIC_PRODUCTION_SMOKE_PLAN.md`.
3. Complete Phase 21E production public quote security verification.
4. Create or identify a disposable synthetic fr-CA cleaning business.
5. Create or identify a valid active public quote link.
6. Provide or approve a second synthetic owner account for horizontal-access verification.
7. Define whether synthetic test rows are retained as evidence or cleaned up through an approved path.

## 6. Final Status

fr-CA production quote smoke:

```text
Not run.
```

Final Phase 21F decision:

```text
Blocked until Phase 21E passes and the Phase 21N synthetic fr-CA setup is explicitly approved for execution.
```

BizPilot remains:

```text
Ready only for founder-controlled synthetic demos.
```

BizPilot is not yet:

```text
Ready for the first real pilot customer with real customer data.
```
