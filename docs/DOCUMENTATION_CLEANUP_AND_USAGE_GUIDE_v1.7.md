# BizPilot AI — Documentation Cleanup and Usage Guide v1.7

## Purpose

This guide explains how to use the current documentation package without deleting useful historical context or confusing AI coding agents.

## What Was Done

The v1.6 package already preserved all original documents and added strategic alignment. This v1.7 cleanup adds:

- a current canonical docs map,
- AI coding agent start instructions,
- a documentation cleanup/usage guide,
- a quality audit and remaining risks report,
- README updates pointing to the active docs.

No original document content was intentionally removed.

## Recommended Folder Usage

Keep this package as the active `/docs` folder in the repo.

Do not immediately delete older versioned files such as v1.4 or v1.5. They preserve decision history and detailed context. Use `CURRENT_CANONICAL_DOCS_v1.7.md` to determine which files are active.

## How Humans Should Read the Docs

For strategy:

1. `CURRENT_CANONICAL_DOCS_v1.7.md`
2. `BIZPILOT_STRATEGIC_ALIGNMENT_UPDATE_v1.6.md`
3. `product/BIZPILOT_MASTER_BLUEPRINT_v1.4.md`
4. `gtm/BIZPILOT_GTM_PLAYBOOK_v1.1.md`

For engineering:

1. `AI_CODING_AGENT_START_HERE_v1.7.md`
2. `engineering/BIZPILOT_ENGINEERING_STANDARD_v1.5.md`
3. `engineering/BIZPILOT_BACKEND_DATABASE_RLS_STANDARD_v1.5.md`
4. `architecture/BIZPILOT_VENDOR_INDEPENDENCE_AND_PORTABILITY_STANDARD_v1.0.md`

For security:

1. `security/BIZPILOT_SECURITY_PRIVACY_COMPLIANCE_STANDARD_v1.5.md`
2. `security/BIZPILOT_RLS_AUDIT_REPORT_v1.0.md`
3. `security/BIZPILOT_SUPABASE_EXPLICIT_GRANTS_AUDIT_v1.0.md`
4. `operations/BIZPILOT_MVP_HARDENING_CHECKLIST_v1.0.md`

## How AI Coding Agents Should Use the Docs

AI coding agents should always start from:

1. `CURRENT_CANONICAL_DOCS_v1.7.md`
2. `AI_CODING_AGENT_START_HERE_v1.7.md`

Then they should inspect the repository before implementation.

## Conflict Management

The most common conflict is broad long-term platform language versus current MVP focus.

Resolution:

- Long-term vision can stay in docs.
- Current implementation must follow v1.6/v1.7 focus.
- Cleaning-first validation comes before multi-vertical expansion.
- Manual/owner-reviewed AI comes before automation.
- Security and RLS come before public launch.

## Do Not Over-Clean Yet

Do not aggressively delete old docs until the repo implementation catches up. Removing context too early can make future reasoning weaker.

Better approach:

- keep old docs,
- mark current authority clearly,
- use v1.7 current map,
- clean duplicates later after implementation stabilizes.

## Next Recommended Action

After placing this package in the repo:

1. Ask Cloud Code/Codex to inspect the repo only.
2. Ask it to produce a docs-vs-code gap report.
3. Then implement hardening priorities in small PR-sized changes.

Do not ask it to implement everything at once.
