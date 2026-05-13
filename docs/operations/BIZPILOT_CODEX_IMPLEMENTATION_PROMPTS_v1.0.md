# BizPilot AI — Codex Implementation Prompts v1.0

**Project:** BizPilot AI  
**Document Type:** Implementation Prompts  
**Version:** v1.0  
**Status:** Ready for Codex / Coding Agent  
**Owner:** MoOoH  
**Last Updated:** 2026-05-12  

---

## 1. How To Use

Use these prompts one by one. Do not run them all at once. After each prompt, run:

```bash
pnpm typecheck
pnpm lint
pnpm build
```

If a prompt touches database/RLS, also run the RLS tests.

---

## Prompt 1 — Documentation Sync to v1.5

```text
You are working in the BizPilot AI repository.

Goal:
Update the canonical docs to include the v1.5 hardening standards without changing product scope.

Inputs:
- Current docs are v1.4/v1.4.1.
- Add or update these documents:
  - docs/engineering/BIZPILOT_ENGINEERING_STANDARD_v1.5.md
  - docs/engineering/BIZPILOT_BACKEND_DATABASE_RLS_STANDARD_v1.5.md
  - docs/security/BIZPILOT_SECURITY_PRIVACY_COMPLIANCE_STANDARD_v1.5.md
  - docs/product/BIZPILOT_UI_UX_SYSTEM_STANDARD_v1.1.md
  - docs/operations/BIZPILOT_MVP_HARDENING_CHECKLIST_v1.0.md

Rules:
- Do not delete the existing v1.4 docs.
- Do not change code.
- Do not add new feature scope.
- Update README/MANIFEST references so v1.5 hardening docs are easy to find.
- Keep English documentation style consistent.

Acceptance:
- Docs compile as clean Markdown.
- No broken code fences.
- Superseded docs are clearly referenced.
- MVP scope remains frozen.
```

---

## Prompt 2 — Server-Only and DTO Boundary Audit

```text
Audit the BizPilot AI Next.js codebase for server/client boundary risks.

Goal:
Ensure tenant-sensitive data access and secrets cannot be imported into Client Components.

Tasks:
1. Find modules that access Supabase server client, service-role/secret keys, OpenAI, Resend, Stripe, private env vars, or tenant-sensitive repositories/services.
2. Add `import "server-only";` to server-only modules where appropriate.
3. Ensure Client Components receive DTOs only, not raw sensitive database rows.
4. Create or update DTO helpers for dashboard/leads/configuration data where needed.
5. Do not change product behavior except to reduce data exposure.

Acceptance:
- `pnpm typecheck` passes.
- `pnpm lint` passes.
- `pnpm build` passes.
- No Client Component imports server-only modules.
- Dashboard still works manually.
```

---

## Prompt 3 — Next.js 16 Proxy/Middleware Review

```text
Review the project’s Next.js version and request boundary setup.

Goal:
Make the auth/session request boundary compatible with the installed Next.js version.

Tasks:
1. Check package.json for the exact Next.js version.
2. If Next.js 16+ is installed and the project uses middleware.ts only because of old convention, propose/perform a careful migration to proxy.ts following official Next.js behavior.
3. If middleware.ts must remain for compatibility, document why.
4. Ensure Supabase SSR session refresh still works.
5. Do not break auth redirects.

Acceptance:
- Sign in/out manual flow still works.
- Protected dashboard redirect still works.
- `pnpm typecheck`, `pnpm lint`, and `pnpm build` pass.
- README/docs mention the chosen boundary file.
```

---

## Prompt 4 — Public Quote Abuse Protection

```text
Harden the public quote submission flow.

Goal:
Reduce spam/abuse risk without adding expensive infrastructure.

Tasks:
1. Add server-side validation limits for public quote submissions.
2. Confirm honeypot field exists or add it.
3. Add a minimal rate-limit strategy for public quote submissions using low-cost storage.
4. Avoid storing raw full IP unless necessary. Prefer hashed actor identifier with server-side secret.
5. Add user-facing safe error messages for rate-limited or invalid submissions.
6. Add tests or manual QA notes.

Acceptance:
- Valid quote submission still works.
- Honeypot submission is rejected.
- Excessive repeated submission is rejected.
- No private data is exposed.
- RLS tests pass.
- `pnpm typecheck`, `pnpm lint`, and `pnpm build` pass.
```

---

## Prompt 5 — RLS Index and Advisor Hardening

```text
Audit Supabase migrations and RLS policies for performance and safety.

Goal:
Make RLS policies production-safe for early MVP usage.

Tasks:
1. List all tenant-owned tables and their RLS predicates.
2. Add practical indexes for business_id, user_id, status, slug, created_at, and other common filters used by policies/queries.
3. Check for multiple permissive policies that accidentally broaden access.
4. Check for recursive/self-referencing policy risks.
5. Add or update RLS tests for public read, public insert, member read/update, and cross-tenant denial.
6. Add a note in docs to run Supabase Security Advisor and Performance Advisor before launch.

Acceptance:
- RLS tests pass.
- No table in public schema lacks RLS unless explicitly documented and safe.
- No obvious unindexed RLS predicate remains.
- `pnpm typecheck`, `pnpm lint`, and `pnpm build` pass if app code changed.
```

---

## Prompt 6 — Security Headers and CSP

```text
Add MVP-safe security headers to the Next.js app.

Goal:
Improve browser security before public demos.

Tasks:
1. Add security headers in the approved Next.js configuration location.
2. Include X-Content-Type-Options, Referrer-Policy, Permissions-Policy, and an initial CSP strategy.
3. Start CSP in report-only mode if strict enforcement may break the app.
4. Avoid broad wildcards.
5. Document any allowed external sources.

Acceptance:
- App still loads.
- Auth pages work.
- Dashboard works.
- Public quote page works.
- No important asset/script is blocked unexpectedly.
- `pnpm typecheck`, `pnpm lint`, and `pnpm build` pass.
```

---

## Prompt 7 — AI Structured Output and Privacy Controls

```text
Harden the AI Lead Assistant.

Goal:
Make AI output reliable, privacy-aware, and cost-trackable.

Tasks:
1. Ensure AI calls are server-side only.
2. Add/confirm a privacy filter before model calls.
3. Define structured output schema for lead summary, reply draft, follow-up draft, missing info, next best action, and lead quality explanation.
4. Validate AI output before storing or displaying it.
5. Store prompt name, prompt version, schema version, model, and cost metadata.
6. Use `store: false` for privacy-sensitive lead processing unless explicitly justified.
7. Add safe fallback when AI fails or schema validation fails.

Acceptance:
- AI is still manual/on-demand.
- AI does not auto-send.
- AI does not invent price/availability.
- Invalid model output does not crash UI.
- `pnpm typecheck`, `pnpm lint`, and `pnpm build` pass.
```

---

## Prompt 8 — UI Density and Accessibility QA

```text
Audit and fix BizPilot UI screens for 100% zoom and accessibility acceptance.

Goal:
Make screens feel professional at normal desktop zoom without relying on 75% or 50% zoom.

Screens:
- /auth/sign-in
- /auth/sign-up
- /dashboard
- /dashboard/configuration
- /dashboard/leads
- /dashboard/leads/[leadId]
- /quote/[slug]
- /quote/[slug]/success

Tasks:
1. Check layout at 1440px and 1280px at 100% zoom.
2. Normalize page titles, card sizes, button sizes, spacing, and form widths.
3. Ensure visible labels, focus states, keyboard navigation, accessible names for icon buttons, and color-not-alone status meaning.
4. Ensure empty/loading/error/success states are polished.
5. Remove internal developer language from user-facing UI.

Acceptance:
- No page feels oversized at 100% zoom.
- No button wraps awkwardly.
- No horizontal overflow.
- Keyboard navigation works for core controls.
- `pnpm typecheck`, `pnpm lint`, and `pnpm build` pass.
```

---

## Prompt 9 — Final Sales-Ready MVP Gate

```text
Run the final MVP gate for BizPilot AI.

Goal:
Determine whether the product is ready for real cleaning business demos/pilots.

Tasks:
1. Run typecheck, lint, build.
2. Run RLS tests.
3. Manually test auth, dashboard, configuration, public quote submission, lead creation, lead detail, AI draft generation, copy action, and outcome marking.
4. Verify no fake metrics or fake sent/booked states appear.
5. Verify public page cannot access private data.
6. Verify UI at 1440px and 1280px / 100% zoom.
7. Produce a final report:
   - Pass
   - Blockers
   - Non-blocking improvements
   - Accepted risks
   - Next recommended commit

Acceptance:
- Clear go/no-go decision.
- No silent failures.
- No new scope added.
```
