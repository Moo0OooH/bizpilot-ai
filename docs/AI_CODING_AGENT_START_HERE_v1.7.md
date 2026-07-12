<!--
 * ============================================================
 * File: docs/AI_CODING_AGENT_START_HERE_v1.7.md
 * Project: BizPilot AI
 * Description: Mandatory starting instructions for coding agents.
 * Role: Keeps implementation aligned with current truth, safety boundaries, and repository evidence.
 * Related:
 * - docs/readiness/BIZPILOT_FINAL_SOURCE_OF_TRUTH_2026-07-12.md
 * - docs/readiness/current-status.json
 * - docs/CURRENT_CANONICAL_DOCS_v1.7.md
 * Author: MoOoH
 * Created: 2026-05-28
 * Last Updated: 2026-07-12
 * Change Log:
 * - 2026-07-12: Replaced obsolete phase overrides with the current truth workflow.
 * ============================================================
 -->

# BizPilot AI — AI Coding Agent Start Here v1.7

## Read this first

Before changing code or documents, read:

1. `docs/readiness/BIZPILOT_FINAL_SOURCE_OF_TRUTH_2026-07-12.md`
2. `docs/readiness/current-status.json`
3. `docs/CURRENT_CANONICAL_DOCS_v1.7.md`
4. The applicable STANDARD documents named by that map.

Phase reports are historical evidence. Do not treat a report title such as
“final”, “accepted”, or “production” as current authorization.

## Product and safety rules

- BizPilot is cleaning-first, manual-first quote recovery and lead conversion.
- Optimize for response speed, lead organization, follow-up recovery, owner
  clarity, and conversion probability.
- AI prepares internal drafts only. No auto-send, autonomous action, invented
  price/availability, booking confirmation, customer messaging automation, or
  full CRM behavior.
- Owner dashboard work is manual lead recovery; founder/admin work is gated
  internal oversight.
- Do not enable or claim live payments, invoices, booking, phone auth,
  SMS/WhatsApp, or broad feature expansion without explicit approved gates.

## Current release boundaries

- Real customer data and paid pilot are blocked.
- Google OAuth is code-only until provider setup and owner QA prove it live.
- Phone auth is not implemented.
- Local/synthetic RLS and dashboard evidence is not production-final proof.
- Strict restored app/dashboard/RLS proof, safe production verification,
  Vercel/domain/Auth redirect verification, and paid-pilot operating readiness
  remain open.

## Required repository inspection

Inspect the actual route, service, migration, test, package script, workflow,
and documentation state before making an assumption. For Next.js work, read the
relevant guide in `node_modules/next/dist/docs/` before writing code.

Do not modify production, Vercel, Supabase settings/data, Auth providers, RLS,
migrations, or paid-pilot operations without explicit owner approval.

## Completion standard

Keep changes small and evidence-backed. Preserve file headers on materially
edited source files. Run relevant validation and report exactly what passed,
what was not run, and what remains blocked. Update the final source of truth
only when new evidence genuinely changes current authorization.
