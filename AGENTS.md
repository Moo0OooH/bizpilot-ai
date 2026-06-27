<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## BizPilot AI File Header Standard

Every source code file created or materially edited in this project must include a header comment with:

- Full project-relative file path
- Project name
- File purpose and role
- Related files or integration points
- Author
- Created date
- Last updated date
- Change log entry for the current edit date

Use this TypeScript/TSX format:

```ts
/**
 * ============================================================
 * File: lib/example/example.ts
 * Project: BizPilot AI
 * Description: Short description of what this file does.
 * Role: Explains this file's responsibility in the system.
 * Related:
 * - path/to/related-file.ts
 * Author: MoOoH
 * Created: 2026-05-04
 * Last Updated: 2026-05-04
 * Change Log:
 * - 2026-05-04: Created the initial Phase 1 foundation file.
 * ============================================================
 */
```

## Dashboard V3 Guardrails

- Inspect the real repo before assuming routes, components, data services, migrations, tests, or docs exist.
- Owner dashboard work stays manual-first lead recovery: quote requests, review drafts, copy/send manually, follow-up, setup readiness.
- Founder/Admin work stays gated internal oversight: users, workspaces, quote-link state, access state, notes, audit, and guarded support actions.
- Do not add or imply auto-send, booking, invoices, payments, full CRM scope, fake revenue, fake analytics, or unsupported automation.
- Do not open real customer data, paid pilot, destructive cleanup, production deletion, access mutation, RLS, or migration gates without explicit owner approval.
- Dashboard UI should be calm, compact, low-scroll, action-first, and responsive with no first-viewport nested scroll or horizontal overflow.
- Commit only after relevant validation, and report any failure honestly with the exact command and whether it appears pre-existing.
