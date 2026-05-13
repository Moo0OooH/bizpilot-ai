# BizPilot AI — Full Canonical Package v1.5

**Generated:** 2026-05-12

This consolidated file contains the v1.5 professional standards update. Use the individual files for normal repo documentation.

# BizPilot AI — v1.5 Professional Standards Update

**Generated:** 2026-05-12  
**Purpose:** Upgrade the existing BizPilot AI v1.4/v1.4.1 documentation into a stronger pre-MVP, global-startup-grade standards package.

---

## Final Decision

The current documents are **good enough to continue**, but they should not be treated as fully production-grade until the v1.5 hardening items are added.

The existing v1.4/v1.4.1 docs are strong in:

- Product positioning
- MVP discipline
- Cleaning-first GTM focus
- Revenue recovery concept
- Phase-gated build plan
- RLS awareness
- UI sizing discipline
- AI assistant-only boundaries

The current docs need strengthening in:

- Security verification standardization
- RLS performance/indexing rules
- Next.js 16 network-boundary updates
- Server-only DTO/data access rules
- Public endpoint abuse/rate-limiting policy
- Security headers and CSP
- Privacy incident response and Law 25 readiness
- Accessibility acceptance criteria
- OpenAI `store: false` and retention controls
- Pre-MVP hardening checklist before selling to real businesses

---

## What This Package Contains

```text
README.md
BIZPILOT_FULL_CANONICAL_PACKAGE_v1.5.md
docs/reference/BIZPILOT_EXTERNAL_REFERENCE_BASELINE_v1.5.md
docs/operations/BIZPILOT_EXECUTIVE_AUDIT_AND_DECISION_v1.5.md
docs/engineering/BIZPILOT_ENGINEERING_STANDARD_v1.5.md
docs/engineering/BIZPILOT_BACKEND_DATABASE_RLS_STANDARD_v1.5.md
docs/security/BIZPILOT_SECURITY_PRIVACY_COMPLIANCE_STANDARD_v1.5.md
docs/product/BIZPILOT_UI_UX_SYSTEM_STANDARD_v1.1.md
docs/operations/BIZPILOT_MVP_HARDENING_CHECKLIST_v1.0.md
docs/operations/BIZPILOT_CODEX_IMPLEMENTATION_PROMPTS_v1.0.md
```

---

## Supersedes / Updates

These files update and strengthen the current docs:

```text
docs/engineering/BIZPILOT_ENGINEERING_STANDARD_v1.4.md
  -> docs/engineering/BIZPILOT_ENGINEERING_STANDARD_v1.5.md

docs/engineering/BIZPILOT_DATABASE_RLS_POLICY_BASELINE_v1.0.md
  -> docs/engineering/BIZPILOT_BACKEND_DATABASE_RLS_STANDARD_v1.5.md

docs/security/BIZPILOT_PRIVACY_SECURITY_COMPLIANCE_BASELINE_v1.0.md
  -> docs/security/BIZPILOT_SECURITY_PRIVACY_COMPLIANCE_STANDARD_v1.5.md

docs/product/BIZPILOT_UI_UX_SYSTEM_STANDARD_v1.0.md
  -> docs/product/BIZPILOT_UI_UX_SYSTEM_STANDARD_v1.1.md
```

The v1.4 product strategy should remain active. Do not restart the project. Apply this package as a **hardening and standards upgrade**.

---

## Implementation Priority

1. Freeze scope. Do not add booking, CRM, SMS, WhatsApp, Instagram, full billing, or background agents.
2. Apply security/backend hardening before public MVP demos with real customer data.
3. Fix UI density and accessibility at 100% zoom before accepting pages as done.
4. Add AI privacy and structured output controls before expanding AI features.
5. Use the Codex prompts in this package as the implementation bridge.

---

## Final Go / No-Go

**Go:** Continue toward MVP.  
**Condition:** Complete the MVP hardening checklist before treating the product as sales-ready with real businesses.


# BizPilot AI — External Reference Baseline v1.5

**Project:** BizPilot AI  
**Document Type:** External Standards Reference Baseline  
**Version:** v1.5  
**Status:** Active Reference Baseline  
**Owner:** MoOoH  
**Last Updated:** 2026-05-12  

---

## 1. Purpose

This document records the external standards used to upgrade the BizPilot AI canonical documents from v1.4/v1.4.1 to v1.5. It is not a copy of those standards. It is a practical reference baseline for a Next.js + Supabase + OpenAI + Resend + Stripe MVP that must be secure, low-cost, privacy-aware, and ready for early paying customers.

---

## 2. Product and Engineering Baseline

### Runtime and framework

- Node.js: use an active LTS version. As of this update, Node.js v24 `Krypton` is LTS while v26 is Current, not LTS.
- Next.js: App Router remains the correct default for this project. Next.js 16 introduced important changes including `proxy.ts` replacing `middleware.ts` for a clearer network boundary, stable Turbopack defaults, updated caching behavior, and React 19.2 alignment.
- Package manager: pin pnpm through the `packageManager` field in `package.json` for reproducible installs. If the repo already runs on pnpm 10.x, keep it until a controlled upgrade. New docs should prefer the current pnpm line once tested.

### Source references

- Node.js releases: https://nodejs.org/en/about/previous-releases
- Next.js 16 release notes: https://nextjs.org/blog/next-16
- Next.js App Router docs: https://nextjs.org/docs/app
- pnpm installation and packageManager pinning: https://pnpm.io/installation

---

## 3. Next.js Security Baseline

BizPilot must use server-first data access:

- Server Components for tenant-sensitive reads where possible.
- Server Actions / Route Handlers for mutations.
- `server-only` in server-only modules that must never be imported into Client Components.
- DTOs that expose only what a component needs.
- Explicit validation for all form inputs.
- Conservative Server Action body size limits.
- Strict same-origin behavior for Server Actions; use `allowedOrigins` only when a trusted proxy/domain requires it.
- Security headers and CSP must be added before public sales traffic.

### Source references

- Next.js Data Security: https://nextjs.org/docs/app/guides/data-security
- Next.js Authentication guide: https://nextjs.org/docs/app/guides/authentication
- Next.js Server Actions config: https://nextjs.org/docs/app/api-reference/config/next-config-js/serverActions
- Vercel Environment and Security: https://vercel.com/academy/nextjs-foundations/env-and-security

---

## 4. Supabase / PostgreSQL / RLS Baseline

BizPilot is a multi-tenant SaaS. RLS is not optional.

Required rules:

- Enable RLS on every table in any exposed schema, especially `public`.
- Public quote pages may read only public-safe records and insert only scoped records.
- Service role / secret keys are server-only.
- Use Supabase SSR cookie-based clients for App Router SSR.
- Prefer new Supabase publishable and secret key terminology in new docs, while supporting legacy anon/service-role keys during migration.
- Index columns used in RLS predicates and common query filters.
- Run Supabase Security Advisor and Performance Advisor before production/demo traffic.
- Confirm no sensitive columns are exposed through public policies, views, materialized views, functions, or storage buckets.

### Source references

- Supabase Row Level Security: https://supabase.com/docs/guides/database/postgres/row-level-security
- Supabase Secure Data: https://supabase.com/docs/guides/database/secure-data
- Supabase SSR Auth: https://supabase.com/docs/guides/auth/server-side
- Supabase SSR client setup: https://supabase.com/docs/guides/auth/server-side/creating-a-client
- Supabase RLS Performance Best Practices: https://supabase.com/docs/guides/troubleshooting/rls-performance-and-best-practices-Z5Jjwv
- Supabase Production Checklist: https://supabase.com/docs/guides/deployment/going-into-prod
- Supabase Database Advisors: https://supabase.com/docs/guides/database/database-advisors

---

## 5. Web Application Security Baseline

BizPilot must align to OWASP for practical, auditable application security.

Required references:

- OWASP ASVS 5.0 as the verification standard mindset.
- OWASP Top 10:2025 as the risk awareness baseline.
- OWASP Cheat Sheet Series for implementation details when writing code.

MVP-level focus:

- Authentication and session handling.
- Access control and tenant isolation.
- Input validation and output encoding.
- Secure configuration and secret management.
- Logging without leaking sensitive data.
- Rate limiting and abuse control on public endpoints.
- CSRF / same-origin protections for mutations.
- Secure error handling.

### Source references

- OWASP ASVS: https://owasp.org/www-project-application-security-verification-standard/
- OWASP ASVS 5.0 release note: https://owasp.org/www-project-application-security-verification-standard/migrated_content
- OWASP Top 10:2025: https://owasp.org/Top10/2025/
- OWASP Cheat Sheet Series: https://cheatsheetseries.owasp.org/

---

## 6. Accessibility / UI / UX Baseline

BizPilot must target WCAG 2.2 AA for MVP screens that users actually use:

- Auth pages.
- Dashboard overview.
- Leads list.
- Lead detail.
- Business configuration.
- Public quote form.
- Success/error states.

Required UX rules:

- Desktop baseline: 1440px at 100% browser zoom.
- Must remain usable at 1280px, 1536px, 1920px.
- Never judge readiness by 75% or 50% zoom.
- Every interactive element must have keyboard access, visible focus, accessible name, and clear state.
- Color may support meaning but must never be the only signal.
- Forms must use visible labels; placeholders do not replace labels.
- Error messages must be field-specific and user-facing.

### Source references

- WCAG 2.2: https://www.w3.org/TR/WCAG22/
- WCAG Quick Reference: https://www.w3.org/WAI/WCAG22/quickref/
- WCAG 2 Overview: https://www.w3.org/WAI/standards-guidelines/wcag/

---

## 7. OpenAI / AI Processing Baseline

BizPilot AI is assistant-only. No auto-send, no invented pricing, no invented availability, no hidden automation.

Required AI controls:

- Server-side API calls only.
- Use structured outputs for machine-consumed AI results.
- Use prompt registry with versioned prompts.
- Validate every AI output against schema before display or storage.
- Minimize personal data sent to the model.
- Set `store: false` for privacy-sensitive lead processing unless there is an explicit product/legal reason to retain application state.
- Log cost metadata, prompt version, model, and schema version, but do not log full personal customer content by default.

### Source references

- OpenAI Structured Outputs: https://developers.openai.com/api/docs/guides/structured-outputs
- OpenAI Data Controls: https://developers.openai.com/api/docs/guides/your-data
- OpenAI API key safety: https://help.openai.com/en/articles/5112595-best-practices-for-api-key-safety
- OpenAI business/API data training policy: https://help.openai.com/en/articles/5722486-how-your-data-is-used-to-improve-model-performance

---

## 8. Email and Payments Baseline

### Resend

- Use a verified domain, not a random/shared/public sender domain.
- Configure SPF and DKIM.
- Add DMARC before sales-ready public usage.
- Do not send customer-facing automated emails in MVP unless explicitly implemented and reviewed.

Source: https://resend.com/docs/dashboard/domains/introduction

### Stripe

For MVP, Stripe Payment Links are enough. Full Billing can wait.

When webhooks are added later:

- Verify webhook signatures using official libraries.
- Process events idempotently.
- Never put secret keys in source code or client-side code.
- Use restricted keys where possible.
- Rotate exposed keys immediately.

Sources:

- Stripe Webhooks: https://docs.stripe.com/webhooks
- Stripe webhook signature verification: https://docs.stripe.com/webhooks/signature
- Stripe idempotent requests: https://docs.stripe.com/api/idempotent_requests
- Stripe key best practices: https://docs.stripe.com/keys-best-practices

---

## 9. Quebec / Canada Privacy Baseline

BizPilot is built in Quebec and may process personal information from customers of local businesses.

Engineering implications:

- Data minimization must be part of the product, not only a policy page.
- Consent and AI processing disclosure must be captured with version/timestamp.
- A confidentiality incident procedure and incident register must exist before real customer data is collected at scale.
- If a confidentiality incident presents a risk of serious injury, Quebec law requires notification to the Commission d’accès à l’information and affected individuals.
- A deletion/minimization workflow must be operationally possible even if not fully automated in MVP.

Source:

- Québec private-sector personal information law: https://www.legisquebec.gouv.qc.ca/fr/document/lc/p-39.1?langCont=en

---

## 10. How To Use This Baseline

This document is the source baseline. The project-specific decisions are encoded in the v1.5 documents:

- Engineering Standard v1.5
- Backend / Database / RLS Standard v1.5
- Security, Privacy, and Compliance Standard v1.5
- UI/UX System Standard v1.1
- MVP Hardening Checklist v1.0
- Codex Implementation Prompts v1.0


# BizPilot AI — Executive Audit and Final Decision v1.5

**Project:** BizPilot AI  
**Document Type:** CTO-Level Documentation Audit  
**Version:** v1.5  
**Status:** Final Review / Actionable Update  
**Owner:** MoOoH  
**Last Updated:** 2026-05-12  

---

## 1. Final Decision

BizPilot AI is on a strong path. The project should **not** be restarted and should **not** be expanded into a bigger platform before validation.

The current strategic direction is correct:

```text
Universal Smart Intake Core
+ AI Lead Conversion Core
+ Cleaning Smart Quote MVP
```

The core product promise is still strong:

```text
Stop losing customers from missed messages.
Turn quote requests into booked jobs.
```

The immediate recommendation is:

```text
Continue MVP build, but apply v1.5 security/backend/UI hardening before sales-ready launch.
```

---

## 2. Overall Score

| Area | Current Score | Target Before Sales-Ready MVP | Decision |
|---|---:|---:|---|
| Product strategy | 90/100 | 92/100 | Strong; keep direction |
| GTM focus | 88/100 | 90/100 | Strong; keep cleaning-first |
| Architecture | 84/100 | 92/100 | Good; needs hardening details |
| Backend standards | 78/100 | 92/100 | Needs stronger execution rules |
| Database/RLS | 80/100 | 94/100 | Good direction; needs indexing, advisor, test rules |
| Security/privacy | 70/100 | 92/100 | Biggest gap; must upgrade |
| UI/UX | 88/100 | 94/100 | Strong; needs accessibility and acceptance rules |
| AI governance | 78/100 | 92/100 | Good boundaries; needs retention/schema controls |
| MVP scope discipline | 92/100 | 95/100 | Strong; keep strict |

---

## 3. What Is Already Correct

The current documentation is strong because it already defines:

- A clear wedge market: cleaning services first.
- A reusable product core: not locked to cleaning forever.
- A narrow MVP: quote intake, lead workspace, AI drafts, follow-up discipline.
- AI as assistant-only, not operator.
- No auto-send.
- No fake revenue metrics.
- No full CRM/booking expansion before validation.
- Supabase-first multi-tenant architecture.
- RLS awareness from early phases.
- A serious UI/UX standard for 100% zoom problems.
- Validation gates before vertical expansion.

This is a good founder-grade foundation.

---

## 4. Critical Gaps Found

### Gap 1 — Security baseline is too light

The current security doc is directionally correct but not deep enough for a real SaaS. It must explicitly include:

- OWASP ASVS / OWASP Top 10 alignment.
- Security headers and CSP.
- Public endpoint abuse control.
- Rate limiting.
- CSRF/same-origin protections.
- Secure error response rules.
- Security event logging.
- Secret scanning and key rotation.
- Incident response.

### Gap 2 — RLS rules need performance and advisor requirements

Current docs correctly require RLS, but they must add:

- Indexes for RLS predicates and common filters.
- Supabase Security Advisor review.
- Supabase Performance Advisor review.
- Tests for anonymous/public policies.
- Tests for authenticated cross-tenant denial.
- Tests for service-role-only operations.
- No recursive/self-referencing RLS policy patterns.

### Gap 3 — Next.js 16 network boundary should be reflected

Docs still reference older middleware naming patterns. If the repo is on Next.js 16+, the standard should include:

- `proxy.ts` as the preferred request/network boundary file where appropriate.
- `server-only` for server-only modules.
- DTOs between server and client.
- Explicit Server Action limits and allowed origins.

### Gap 4 — AI privacy needs current retention controls

The AI docs should add:

- Structured outputs for all machine-consumed AI responses.
- Schema validation before storage/display.
- `store: false` for privacy-sensitive lead processing unless explicitly justified.
- No full customer raw message logging.
- Prompt version and model version stored with AI output.

### Gap 5 — UI/UX is strong but accessibility acceptance is not strict enough

The UI/UX standard is one of the strongest documents in the package. It needs only a targeted upgrade:

- WCAG 2.2 AA as acceptance target.
- Keyboard-only QA.
- Focus-visible QA.
- Form labels and error relationships.
- Touch target minimums.
- Color-not-alone rule for every badge/status.
- Auth/public pages must pass 100% zoom before accepted.

---

## 5. Required Changes Before Sales-Ready MVP

These changes are recommended before presenting BizPilot as a real customer-ready MVP:

1. Add server-only data access guardrails.
2. Add DTO boundaries for tenant-sensitive dashboard data.
3. Add security headers and CSP in report-only mode first.
4. Add public quote endpoint rate limiting / abuse protection.
5. Add RLS performance indexes and policy tests.
6. Run Supabase Security Advisor and Performance Advisor.
7. Add security event logging for auth, public intake, AI, and sensitive mutations.
8. Add privacy incident register procedure.
9. Add OpenAI `store: false` and structured output validation.
10. Add WCAG 2.2 AA QA checklist for the six MVP surfaces.

---

## 6. What Should Not Change

Do not change these strategic decisions:

- Do not switch away from Supabase before validation.
- Do not add Prisma unless there is a clear pain later.
- Do not add Docker-first complexity now.
- Do not build a full CRM.
- Do not build booking/calendar.
- Do not add WhatsApp/SMS/Instagram APIs yet.
- Do not add full Stripe Billing yet.
- Do not add background AI agents.
- Do not add a second vertical before validation.
- Do not make AI auto-send messages.

---

## 7. Final Founder-Level Recommendation

The project is close to a serious MVP path. The best next move is not more features. The best next move is:

```text
Phase 5/6 stabilization
+ v1.5 hardening
+ sales demo readiness
+ 3 real cleaning business pilots
```

If this discipline is followed, BizPilot has a credible path to becoming a paid local-service SaaS rather than another unfinished AI dashboard.


# BizPilot AI — Engineering Standard v1.5

**Project:** BizPilot AI  
**Document Type:** Engineering Standard  
**Version:** v1.5  
**Status:** Active Canonical Standard  
**Owner:** MoOoH  
**Phase:** MVP Hardening / Phase 5-6 Stabilization  
**Last Updated:** 2026-05-12  

---

## 1. Engineering Mission

Build a secure, validation-first, low-cost SaaS that can sell quickly and scale cleanly.

BizPilot must be:

- Multi-tenant by default.
- Privacy-aware by default.
- Secure by design, not patched later.
- AI-assisted, not AI-operated.
- Simple enough to ship.
- Modular enough to expand after validation.
- Strict enough to avoid MVP scope creep.
- Polished enough to charge early customers.

---

## 2. Locked MVP Stack

Canonical MVP stack:

```text
Runtime:        Node.js 24 LTS
Package mgr:    pnpm pinned in package.json
Framework:      Next.js App Router
Language:       TypeScript strict
Styling:        Tailwind CSS + shadcn/ui
Database/Auth:  Supabase Auth + Supabase PostgreSQL + RLS
AI:             OpenAI API through server-side provider abstraction
Email:          Resend for owner notifications
Payments:       Stripe Payment Links first
Hosting:        Vercel + Supabase Cloud
Source:         GitHub
```

Rules:

- Node.js must be an active LTS line, not an experimental/current-only line.
- pnpm must be pinned with `packageManager`.
- Do not upgrade major framework/runtime versions during a feature phase unless the upgrade has its own branch, test plan, and rollback decision.
- Do not introduce Docker, Kubernetes, microservices, workers, queues, vector DB, or full billing before validation unless a blocker proves they are required.

---

## 3. Architecture Rule

All business workflows must follow:

```text
UI / Page
  -> Server Action or Route Handler
    -> Service
      -> Policy
        -> Repository
          -> Supabase / Postgres
```

Rules:

- UI components never own business rules.
- Server Actions and Route Handlers validate inputs and call services.
- Services orchestrate workflows.
- Policies own authorization decisions.
- Repositories own database access.
- RLS is still mandatory even when server-side policies exist.
- AI calls are server-side only.
- External provider calls are isolated behind provider adapters.

---

## 4. Folder Standard

```text
app/                         routes, layouts, route groups
app/(auth)/                  public auth routes
app/(dashboard)/             protected dashboard routes
app/(public)/                public quote/success routes when useful
components/                  reusable UI components
components/dashboard/         dashboard shell, sidebar, topbar
features/                    domain UI/workflows
server/actions/              Server Actions
server/routes/               route-handler helpers if needed
server/services/             business workflows
server/repositories/         database access
server/policies/             authorization and tenant rules
server/ai/                   AI provider abstraction
server/security/             rate limits, audit/security events, safe logging
server/privacy/              privacy mode, deletion, retention helpers
lib/env/                     env validation
lib/supabase/                browser/server clients
lib/utils/                   general helpers
prompts/                     prompt registry and versions
types/                       shared types
supabase/migrations/         SQL migrations
supabase/seed/               local/dev seed data only
tests/rls/                   database policy tests
tests/unit/                  service/rule tests
tests/integration/           flow tests
scripts/                     dev/QA scripts
docs/                        canonical documentation
```

---

## 5. Server/Client Boundary Standard

Tenant-sensitive code must stay server-side.

Required rules:

- Any module that reads secrets, service role keys, private customer data, or tenant-sensitive records must include `import "server-only";`.
- Client Components receive DTOs, never full raw database rows unless the row is explicitly public-safe.
- Client Components do not import repositories, service role clients, private env helpers, or provider clients.
- Client Components may call Server Actions through forms/actions, but mutation authorization remains server-side and database-enforced.
- Public quote forms must not expose private table structures, tenant IDs unnecessarily, hidden fields, owner emails, or AI/internal metadata.

DTO rule:

```text
Database Row -> Repository -> Service -> DTO -> UI
```

DTOs must:

- Include only fields required for rendering.
- Rename internal fields to user-facing meaning where appropriate.
- Exclude secrets, private notes, provider IDs, raw AI prompt content, and internal debug data.

---

## 6. TypeScript Standard

Required:

- `strict: true`.
- No implicit `any`.
- No unsafe casting unless contained and documented.
- Exported services/repositories should use explicit return types.
- Inputs from forms, route params, search params, provider webhooks, and AI outputs must be validated.
- Prefer schema validation for runtime inputs.
- Use discriminated unions for states/statuses where useful.
- Avoid stringly-typed status values in business logic.
- Keep shared enums/statuses centralized.

Forbidden:

- Business logic embedded inside React rendering branches.
- Raw provider errors shown to users.
- Direct database calls from UI components.
- Passing unvalidated `FormData` directly into repositories.
- Storing money/cost as floating point values where exactness matters.

---

## 7. Environment and Secret Standard

Required files:

```text
.env.example
.env.local              # local only, never committed
lib/env/server-env.ts
lib/env/public-env.ts
```

Rules:

- Public variables must be explicitly prefixed and documented.
- Server-only variables must never use `NEXT_PUBLIC_`.
- Supabase publishable/anon key may be used in browser clients.
- Supabase secret/service-role key is server-only and only used in tightly controlled operations.
- OpenAI, Stripe secret, Resend, and webhook secrets are server-only.
- Never log secrets.
- Never paste real keys into docs, tickets, chat, screenshots, or commits.
- Add secret scanning/pre-commit protection before public repo growth.

Recommended env naming:

```text
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SECRET_KEY=
OPENAI_API_KEY=
RESEND_API_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

Legacy compatibility:

- Existing `NEXT_PUBLIC_SUPABASE_ANON_KEY` and `SUPABASE_SERVICE_ROLE_KEY` may remain during migration.
- New docs/code should gradually move toward publishable/secret naming while keeping compatibility wrappers until all tests pass.

---

## 8. Next.js App Router Standard

Rules:

- Use route groups to separate auth, dashboard, and public surfaces.
- Keep shared dashboard shell in layout/shell components.
- Prefer Server Components for data loading.
- Use Client Components only for interaction: forms, accordions, copy buttons, optimistic UI, sticky save bars.
- Avoid converting entire pages/shells to Client Components unless needed.
- Loading/error/empty states are part of the page contract.
- Mutations must use Server Actions or Route Handlers with validation.
- Do not rely on UI hiding for authorization.

Next.js 16 network boundary:

- Prefer `proxy.ts` for the request/network boundary on Next.js 16+ where applicable.
- Keep `middleware.ts` only if the framework/version/setup requires it.
- Auth/session refresh behavior must be covered by manual QA after any proxy/middleware change.

Server Actions:

- Keep same-origin defaults.
- Configure `allowedOrigins` only for trusted domains/proxies.
- Keep body size small; public forms should not accept large payloads.
- Use validation and rate limiting for public mutations.

---

## 9. Supabase Standard

Required:

- Supabase SSR clients for server-side auth/session usage.
- Browser client only for public-safe or user-scoped client interactions.
- RLS on all exposed schema tables.
- SQL migrations reviewed before application code depends on them.
- RLS tests for every tenant-owned table and public policy.
- Security Advisor and Performance Advisor reviewed before production/demo traffic.
- Type generation from database should be added once schema stabilizes.

Forbidden:

- Disabling RLS to “make it work.”
- Using service role key from browser code.
- Public policies that expose private owner/customer data.
- Recursive RLS policies that query the same protected table in unsafe ways.
- Shipping new tables without RLS and tests.

---

## 10. AI Engineering Standard

AI is assistant-only.

Required components:

```text
server/ai/provider.ts
server/ai/openai-provider.ts
server/ai/schemas/
server/ai/privacy-filter.ts
server/ai/cost-tracker.ts
prompts/lead-assistant/*.md or *.ts
```

AI rules:

- AI calls are server-side only.
- AI receives only the minimum required context.
- Every prompt is versioned.
- Every machine-consumed output uses a schema.
- Every AI output is validated before storage/display.
- Every AI output stores prompt version, model, schema version, and cost metadata.
- Default privacy-sensitive requests should use `store: false` unless explicitly justified.
- AI failure must degrade gracefully to rule-based guidance.

AI must not:

- Auto-send.
- Confirm booking.
- Invent pricing.
- Invent availability.
- Replace the owner’s judgment.
- Hide uncertainty.
- Expose system prompts or internal metadata.

---

## 11. Logging and Error Standard

Every server workflow should produce structured logs with:

- request_id
- operation
- user_id when authenticated
- business_id when available
- status/result
- error_code where applicable
- timing/cost metadata where useful

Logs must not include by default:

- full customer messages
- secrets
- tokens
- API keys
- raw payment data
- raw AI prompts containing personal data
- unnecessary contact details

User-facing errors must:

- Be clear and non-technical.
- Avoid exposing provider/database internals.
- Preserve useful action guidance.
- Map to stable internal error codes.

---

## 12. Testing Standard

Required before sales-ready MVP:

```text
pnpm typecheck
pnpm lint
pnpm build
RLS tests
Unit tests for scoring/missing-info/follow-up rules
Integration/smoke tests for auth/dashboard/public quote/lead workflow
Manual QA checklist
```

Required test categories:

- Auth sign-up/sign-in/sign-out.
- Protected dashboard access.
- Tenant membership enforcement.
- Cross-tenant denial.
- Public quote page read scope.
- Public quote submission insert scope.
- Lead creation and status transitions.
- AI structured output validation.
- Error and empty states.
- Accessibility keyboard/focus pass.

---

## 13. Git and Change Control Standard

Rules:

- One phase/hardening area per branch when possible.
- Commit messages use conventional format.
- Do not mix UI redesign, RLS changes, and AI behavior in one uncontrolled commit.
- Every schema change must include migration and test updates.
- Every public behavior change must include manual QA notes.

Commit examples:

```text
docs: add bizpilot v1.5 hardening standards
fix(auth): enforce server-only DTO boundary
feat(security): add public intake rate limit
feat(db): add rls indexes and advisor checklist
fix(ui): normalize auth page density at 100 percent zoom
feat(ai): validate lead assistant structured outputs
```

---

## 14. Strict Non-Goals / Not Now

Do not build before validation:

- Full CRM.
- Booking engine.
- Calendar sync.
- SMS/WhatsApp/Instagram APIs.
- Auto-send.
- AI operator/agent.
- Mobile app.
- Marketplace.
- Full Stripe Billing.
- Advanced analytics warehouse.
- Vector database.
- Microservices.
- Kubernetes.
- Always-on workers.
- Background AI agents.
- Second vertical.

---

## 15. Definition of Done

This engineering standard is satisfied when:

- Server/client boundaries are explicit.
- RLS is enforced and tested.
- Secrets stay server-only.
- Public endpoints have abuse controls.
- AI outputs are schema-validated.
- User-facing errors are clean.
- UI passes 100% zoom acceptance.
- MVP hardening checklist is complete before sales-ready launch.


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


# BizPilot AI — Security, Privacy, and Compliance Standard v1.5

**Project:** BizPilot AI  
**Document Type:** Security / Privacy / Compliance Standard  
**Version:** v1.5  
**Status:** Active Canonical Standard  
**Owner:** MoOoH  
**Last Updated:** 2026-05-12  

---

## 1. Purpose

BizPilot processes personal information from quote requests and helps businesses prepare replies. Security and privacy must be part of the product foundation before real customer data is collected at scale.

This document is an engineering/product standard, not legal advice.

---

## 2. Security Principles

- Least privilege everywhere.
- Tenant isolation by design and by database enforcement.
- Public pages expose only public-safe data.
- Secrets stay server-side.
- AI receives minimal necessary context.
- Logs minimize personal data.
- Errors are safe and user-facing.
- Abuse controls exist before public traffic.
- Security is verified through tests and checklists, not assumptions.

---

## 3. OWASP Alignment

BizPilot MVP should use OWASP ASVS as the verification mindset and OWASP Top 10 as the awareness baseline.

MVP security focus:

- Authentication and session management.
- Authorization and tenant access control.
- Input validation.
- Output encoding and XSS prevention.
- CSRF/same-origin protections for mutations.
- Security logging and monitoring.
- Error handling.
- Secret management.
- Secure configuration.
- Public endpoint abuse control.

---

## 4. Authentication and Session Rules

Required:

- Supabase Auth remains the MVP auth provider.
- Email confirmation should be enabled for real users.
- Auth errors must be user-facing and not leak internal provider details.
- Dashboard routes must require an authenticated session.
- Business membership must be checked before loading tenant data.
- Session refresh must be handled through the approved Supabase SSR pattern.

Recommended:

- Owner/admin MFA is recommended before handling many real businesses.
- Supabase account and GitHub account must use MFA.
- Avoid social login in MVP unless it clearly improves conversion and is implemented safely.

---

## 5. Authorization Rules

Authorization layers:

```text
Layer 1: Route protection
Layer 2: Server-side policy/service check
Layer 3: Repository scoping
Layer 4: PostgreSQL RLS
Layer 5: UI DTO minimization
```

Rules:

- UI state is not authorization.
- Tenant access must be checked server-side.
- RLS must block mistakes even if service code fails.
- Admin/concierge access must be separated from normal business owner access.

---

## 6. Public Page Security Rules

Public quote pages may:

- Read public-safe business name/branding.
- Read active public form configuration.
- Submit scoped quote requests.

Public quote pages may not:

- Read private dashboard data.
- Read owner private profile data.
- Read AI outputs.
- Read usage/subscription records.
- Read all businesses.
- Update existing private records.

Required controls:

- Server-side validation.
- Honeypot.
- Minimum submit-time heuristic.
- Rate limit.
- Request body size limit.
- Safe success/error pages.
- Consent capture.
- Public RLS tests.

---

## 7. Security Headers and CSP

Before real public traffic, add security headers.

Recommended MVP headers:

```text
Content-Security-Policy: start in Report-Only if needed, then enforce
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Frame-Options or CSP frame-ancestors: deny/self as appropriate
```

CSP rules:

- Start with report-only if it might break app assets.
- Allow only required sources.
- Do not allow broad `*` sources.
- Revisit after adding analytics, Resend, Stripe, or external scripts.

---

## 8. Input Validation and Output Safety

Validate:

- Form data.
- Route params.
- Search params.
- Public slug.
- AI input payloads.
- AI outputs.
- Provider webhooks when added.

Output safety:

- Never render raw HTML from customer input.
- Escape/sanitize user-provided text.
- Do not display raw database/provider errors.
- Do not display hidden internal fields.
- Do not expose system prompts.

---

## 9. Logging Standard

Logs may include:

- request_id
- operation
- business_id
- user_id where relevant
- actor_type
- route
- result/status
- error_code
- timing
- cost metadata

Logs must avoid:

- API keys
- tokens
- passwords
- raw payment data
- full customer messages
- full AI prompts containing personal data
- unnecessary phone/email details

---

## 10. Secret Management

Rules:

- No real secrets in repository.
- No secrets in screenshots or docs.
- No secrets pasted into chat messages.
- Use environment variables or managed secret storage.
- Rotate immediately if exposed.
- Use restricted keys where supported.
- Audit for `sk_`, `rk_`, `OPENAI_API_KEY`, `SUPABASE`, `STRIPE`, `RESEND` patterns before public repo growth.

---

## 11. AI Privacy and Safety Rules

AI must be assistant-only.

Required:

- Server-side AI calls only.
- Privacy filter before model call.
- Minimal necessary context.
- Structured outputs for machine-consumed results.
- Schema validation before display/storage.
- `store: false` for privacy-sensitive lead processing unless explicitly justified.
- Prompt version, model, schema version, and cost metadata stored.
- No auto-send.
- No booking confirmation.
- No invented prices or availability.

AI disclosure in consent:

```text
BizPilot may help prepare internal AI drafts for the business. The business reviews messages before sending.
```

---

## 12. Privacy Modes

### Standard Mode

Stores:

- Submission values.
- Lead detail.
- AI outputs.
- Status and events.
- Usage events.

Use when the business wants the full lead desk experience.

### Minimal Data Mode

Stores only operational essentials:

- Business relationship.
- Customer contact.
- Service type.
- City/service area.
- Status.
- Minimal notes when necessary.
- Created timestamp.

AI outputs should be minimized or stored only as owner-visible fields.

### Forward-Only Mode

Future mode, not MVP default.

Concept:

- Forward lead to business email/CRM.
- Retain minimal metadata only.
- Optionally delete full lead payload after 24/48 hours.

Do not implement until Standard and Minimal modes are stable.

---

## 13. Consent and Notice Standard

Required fields:

```text
consent_version
consent_accepted_at
ai_processing_disclosure
privacy_contact_email
data_retention_days
delete_request_status
```

Canonical consent notice:

```text
By submitting this request, you agree that your information will be shared with [Business Name] to respond to your quote request. BizPilot may help prepare internal AI drafts, but the business reviews messages before sending.
```

Rules:

- Store the consent version accepted at submission time.
- Do not overwrite historical consent meaning silently.
- Update consent version when the notice materially changes.

---

## 14. Quebec / Canada Privacy Operations

Before real customer data at scale, create an operational privacy file/process covering:

- Who is responsible for privacy requests.
- How deletion/minimization requests are handled.
- How confidentiality incidents are recorded.
- How risk of injury is assessed.
- How affected people and the Commission d’accès à l’information are notified if required.
- How vendors/processors are listed.

Recommended internal records:

```text
privacy_requests
privacy_incident_register
vendor_processor_register
retention_policy
```

MVP can start with operational docs/manual handling, but the product must not make deletion/minimization impossible.

---

## 15. Data Retention and Deletion

MVP requirements:

- Define default lead retention period per business/privacy mode.
- Allow internal deletion/minimization request tracking.
- Remove or minimize personal data where appropriate.
- Preserve minimal audit-safe metadata only when necessary.
- Do not keep raw data forever by accident.

Recommended defaults:

```text
Standard Mode lead data: configurable; default 365 days for MVP unless business/legal reason differs
Minimal Mode lead data: shorter by default
Rate-limit/security metadata: short retention, e.g. 30-90 days
AI cost metadata: can be retained without raw customer content
```

---

## 16. Email Security

Resend requirements:

- Verified domain.
- SPF.
- DKIM.
- DMARC before serious outreach/production sending.
- Owner notification emails only in MVP unless customer confirmation is explicitly implemented.

Email content rules:

- Avoid full sensitive customer details in notification subject lines.
- Include enough context for owner action.
- Link owner back to secure dashboard where possible.

---

## 17. Payment Security

MVP:

- Stripe Payment Links.
- Manual subscription/customer tracking.
- No full Billing engine yet.

When Stripe webhooks are added:

- Verify Stripe signatures.
- Use raw request body for signature verification.
- Process events idempotently.
- Store processed event IDs.
- Use restricted keys where possible.
- Never expose secret keys client-side.

---

## 18. Pre-MVP Security Checklist

Before sales-ready MVP:

- RLS enabled on all exposed tables.
- Supabase Security Advisor reviewed.
- Public quote rate limit added.
- Security headers added.
- CSP report-only/enforced decision made.
- Server-only modules protected.
- DTO boundaries added.
- Secrets checked.
- Auth messages user-facing.
- AI `store: false` decision implemented.
- Consent version captured.
- Privacy request process defined.
- Incident register process defined.

---

## 19. Definition of Done

This standard is complete when BizPilot has:

- Clear security principles.
- OWASP-aligned MVP controls.
- RLS-backed authorization.
- Public endpoint abuse controls.
- Privacy modes and consent capture.
- AI privacy controls.
- Secret management rules.
- Incident/deletion operational readiness.
- A concrete security checklist before launch.


# BizPilot AI — UI/UX System Standard v1.1

**Project:** BizPilot AI  
**Document Type:** UI / UX System Standard  
**Version:** v1.1  
**Status:** Active Canonical Standard  
**Owner:** MoOoH  
**Product:** AI Quote Recovery & Lead Conversion Desk  
**Last Updated:** 2026-05-12  

---

## 1. Purpose

This document upgrades the existing UI/UX System Standard v1.0. The original standard is strong and should remain the foundation. v1.1 adds stricter acceptance rules for accessibility, density, responsiveness, and production readiness.

BizPilot must feel like:

```text
Quote Recovery Command Center
```

Not like:

- A generic admin panel.
- A raw developer scaffold.
- A bloated CRM.
- A marketing landing page inside the product.
- A set of disconnected screens.

---

## 2. Core UX Test

Before accepting any screen, answer:

```text
Does this help the business owner capture quote requests, reply faster, follow up better, or complete setup faster?
```

If not, remove or simplify it.

---

## 3. Baseline Viewport and Zoom Standard

Primary design baseline:

```text
1440px desktop width
Chrome zoom 100%
```

Must remain usable at:

```text
1280px
1536px
1920px
```

Zoom QA:

```text
100% = required acceptance baseline
75%  = optional comfort check
50%  = not an acceptance standard
```

A page is not production-ready if it only looks correct at 75% or 50% zoom.

---

## 4. Layout Density Standard

Operational UI should be compact, calm, and readable.

Dashboard shell:

```text
Sidebar: 240px-260px
Topbar: 64px-72px
Desktop content padding: 24px-32px
Section gap: 24px
Card gap: 16px
Main max width: 1440px-1480px inside shell
```

Cards:

```text
Default padding: 20px-24px
Compact padding: 16px
Radius: 10px-14px
Shadow: subtle only
```

Typography:

```text
Page title: 28px-32px
Section title: 18px-20px
Card title: 15px-16px
Body: 14px-15px
Small/meta: 12px-13px
Button: 14px semibold
```

Forbidden:

- Landing-page hero text inside dashboard cards.
- Oversized KPI numbers that dominate the page.
- Buttons wrapping at 100% zoom.
- Cards so large that the user must zoom out to understand the workflow.
- Empty decorative whitespace that pushes real work below the fold.

---

## 5. Accessibility Target

MVP target:

```text
WCAG 2.2 AA for core user flows
```

Core flows:

- Sign in.
- Sign up.
- Dashboard overview.
- Business configuration.
- Public quote form.
- Quote success/error page.
- Leads list.
- Lead detail.
- AI draft review/copy.

Required:

- Keyboard navigation works.
- Focus is visible.
- Color is not the only meaning signal.
- Text contrast is sufficient.
- Interactive controls have accessible names.
- Inputs have visible labels.
- Errors are connected to fields or form regions.
- Loading states are understandable.
- Empty states explain the next step.

---

## 6. Form UX Standard

Forms must be task-shaped, not database-shaped.

Required:

- Visible label for every input.
- Placeholder only as an example, never as the only label.
- Clear required/optional indication.
- Field-level error where possible.
- Form-level error summary for major failures.
- Submit button communicates action.
- Disabled/pending state prevents double submit confusion.
- Success state confirms what happened and what to do next.

Auth form width:

```text
400px-460px
```

Public quote form width:

```text
600px-760px max for readable single-column form
```

Business configuration forms:

```text
Main form width: 720px-900px depending section
Right rail: 300px-360px when useful
```

---

## 7. Button and CTA Standard

One primary CTA per workflow region.

Button heights:

```text
Dashboard standard: 40px-44px
Auth/public primary: 44px-48px
Compact controls: 36px-40px only when dense UI requires it
```

Rules:

- Primary buttons are for the next meaningful action.
- Secondary buttons are for supporting actions.
- Ghost buttons are for low-risk utilities.
- Danger buttons are visually distinct and never default.
- Icon-only buttons require accessible labels.
- Future unavailable features must not look clickable.

---

## 8. Status and Badge Standard

Every status must use:

```text
text + visual style
```

Never use color alone.

Canonical statuses:

```text
Lead quality: Strong / Good / Needs info / Low fit
SLA: New / Viewed / Follow-up due / Overdue / Reply copied
Outcome: Booked / Lost / No response / Not a fit / Asked info
AI: Draft ready / Rule fallback / Needs review / Failed
Public link: Active / Inactive / Draft
```

Rules:

- Do not show “Sent” unless the product actually sent a message.
- Do not show fake analytics.
- Do not use confusing synonyms for the same state.
- Keep badge text short.

---

## 9. Dashboard Overview Standard

The dashboard overview must answer within 5 seconds:

1. Is my quote link active?
2. Do I have new leads?
3. Which leads need action today?
4. Is setup complete enough?
5. What value has BizPilot helped recover?

Required sections:

- Business readiness.
- Public quote link status.
- Today’s actions.
- Recent leads.
- Simple recovery proof.
- Quick actions.

Forbidden:

- Generic analytics wall.
- Empty charts with fake data.
- Internal phase names.
- Developer/debug content.

---

## 10. Leads Workspace Standard

The leads page is a recovery queue, not a generic CRM table.

Required:

- Prioritize new, overdue, follow-up due, and strong leads.
- Show lead quality, status, service type, city/service area, received time, and next action.
- Empty state explains how to get first leads.
- Filters must be useful but not overbuilt.
- Mobile/tablet layout can become cards instead of dense table.

---

## 11. Lead Detail Standard

Lead detail is an owner decision workspace.

Required regions:

- Lead summary.
- Customer/contact/service details.
- Missing info.
- AI draft / follow-up draft if generated.
- Owner actions: copy reply, mark outcome, follow-up state.
- Timeline/events.
- Privacy/consent context where useful.

Rules:

- AI drafts must be clearly labeled as drafts.
- Owner stays in control.
- No auto-send UI unless real sending exists in a later phase.
- Do not imply booking confirmation.

---

## 12. Business Configuration Standard

Configuration should feel guided, not like a settings database.

Recommended structure:

- Business profile.
- Branding.
- Services.
- Service areas.
- FAQ / business context.
- Public quote link.
- Privacy and consent.
- Cleaning quote template.

Required:

- Save state is obvious.
- Sticky bottom save bar only when helpful.
- Preview public quote page.
- Setup completeness visible.
- Sections are grouped by owner task.

---

## 13. Public Quote Page Standard

Public page must feel simple and trustworthy.

Required:

- Business name/branding.
- Clear page title.
- Short explanation.
- Form with visible labels.
- Consent notice near submit.
- Mobile-first readable layout.
- Success page after submit.
- No dashboard/internal language.
- No “AI magic” exaggeration.

Forbidden:

- Long marketing copy.
- Fake guarantees.
- Internal schema/tenant/debug messages.
- Overly complex multi-step flow in MVP.

---

## 14. Empty, Loading, Error, Success States

Every core surface must define:

- Empty state.
- Loading state.
- Error state.
- Success state.

Error messages must be:

- Human.
- Specific enough to act on.
- Safe.
- Non-technical.

Examples:

```text
Bad: relation public.leads does not exist
Good: We couldn't load your leads. Please refresh or try again.

Bad: RLS violation
Good: You don't have access to this business workspace.
```

---

## 15. UI QA Checklist

Before accepting a page:

- Works at 1440px / 100% zoom.
- Works at 1280px / 100% zoom.
- No horizontal overflow.
- Buttons do not wrap awkwardly.
- Form labels are visible.
- Focus states are visible.
- Keyboard-only navigation reaches all controls.
- Empty/loading/error/success states exist.
- No fake data unless clearly demo-mode.
- No internal developer language.
- No page duplicates dashboard shell/nav.
- Mobile layout is usable for public quote/auth pages.

---

## 16. Definition of Done

A BizPilot UI page is done when:

- It supports the product job.
- It passes 100% zoom QA.
- It is accessible enough for WCAG 2.2 AA target on core flows.
- It uses shared shell/components.
- It avoids fake claims and fake analytics.
- It has complete states.
- It feels like a polished quote recovery workspace.


# BizPilot AI — MVP Hardening Checklist v1.0

**Project:** BizPilot AI  
**Document Type:** MVP Hardening Checklist  
**Version:** v1.0  
**Status:** Required Before Sales-Ready MVP  
**Owner:** MoOoH  
**Last Updated:** 2026-05-12  

---

## 1. Purpose

This checklist defines what must be true before BizPilot is treated as sales-ready for real cleaning businesses.

The goal is not perfection. The goal is:

```text
Safe enough, polished enough, and focused enough to charge early customers.
```

---

## 2. Scope Freeze

Before hardening starts:

- [ ] No new feature scope is added.
- [ ] No booking engine.
- [ ] No CRM expansion.
- [ ] No SMS/WhatsApp/Instagram APIs.
- [ ] No full Stripe Billing.
- [ ] No second vertical.
- [ ] No background AI agents.
- [ ] No auto-send.

---

## 3. Build Health

- [ ] `pnpm typecheck` passes.
- [ ] `pnpm lint` passes.
- [ ] `pnpm build` passes.
- [ ] No known console errors in core flows.
- [ ] No broken route in route map.
- [ ] `.env.example` matches required env variables.
- [ ] Package manager is pinned.
- [ ] README setup instructions match real project commands.

---

## 4. Auth and Tenant Safety

- [ ] Sign up works.
- [ ] Sign in works.
- [ ] Sign out works.
- [ ] Dashboard redirects unauthenticated users.
- [ ] Authenticated user sees only own business.
- [ ] Cross-tenant manual test passes.
- [ ] Business membership policy is server-side.
- [ ] RLS tests pass for profiles/businesses/business_members.
- [ ] Auth errors are user-facing.

---

## 5. Database and RLS

- [ ] RLS enabled on every exposed table.
- [ ] Every tenant table has `business_id` unless documented.
- [ ] Public policies are narrow.
- [ ] Anonymous cannot read private data.
- [ ] Public quote policies are tested.
- [ ] RLS predicates have practical indexes.
- [ ] Supabase Security Advisor reviewed.
- [ ] Supabase Performance Advisor reviewed.
- [ ] No sensitive columns exposed through public views/functions.
- [ ] No service role key in browser/client bundle.

---

## 6. Public Quote Flow

- [ ] Active slug resolves correctly.
- [ ] Inactive/draft slug does not expose private data.
- [ ] Public page loads only public-safe branding/form fields.
- [ ] Hidden fields are not shown.
- [ ] Submission validates server-side.
- [ ] Honeypot works.
- [ ] Rate limit or abuse control exists.
- [ ] Consent version/timestamp captured.
- [ ] Lead created under correct business.
- [ ] Success page is clear.
- [ ] Failure page/error is clear and safe.

---

## 7. Lead Workspace

- [ ] Lead list loads tenant-scoped data.
- [ ] Lead detail loads tenant-scoped data.
- [ ] New lead status is clear.
- [ ] Follow-up/overdue states work.
- [ ] Manual outcome update works.
- [ ] Revenue recovery proof uses honest real data.
- [ ] Empty state helps owner understand next step.
- [ ] No fake “sent” or “booked” status appears unless owner marked it.

---

## 8. AI Assistant

- [ ] AI is manual/on-demand only.
- [ ] AI calls are server-side only.
- [ ] Input is privacy-filtered.
- [ ] Structured output schema exists.
- [ ] Output validation exists.
- [ ] AI failure fallback exists.
- [ ] Cost metadata is tracked.
- [ ] Prompt version is stored.
- [ ] Model name/version is stored.
- [ ] `store: false` decision implemented for privacy-sensitive processing.
- [ ] AI never invents price/availability/booking confirmation.

---

## 9. Security and Privacy

- [ ] Security headers added.
- [ ] CSP report-only or enforced decision made.
- [ ] No real secrets in repo.
- [ ] Secret scan performed.
- [ ] Security event logging exists for sensitive failures/actions.
- [ ] Privacy modes are represented in behavior.
- [ ] Consent notice is visible on public quote form.
- [ ] Delete/minimize request handling process exists.
- [ ] Privacy incident register process exists.
- [ ] Owner/admin accounts use MFA on Supabase/GitHub.

---

## 10. UI/UX Acceptance

- [ ] Auth pages look correct at 1440px / 100% zoom.
- [ ] Dashboard looks correct at 1440px / 100% zoom.
- [ ] Configuration page looks correct at 1440px / 100% zoom.
- [ ] Leads page looks correct at 1440px / 100% zoom.
- [ ] Lead detail looks correct at 1440px / 100% zoom.
- [ ] Public quote page is mobile-friendly.
- [ ] No page requires 75% or 50% zoom to feel correct.
- [ ] Buttons do not wrap awkwardly.
- [ ] Empty/loading/error/success states exist.
- [ ] No internal developer language appears.

---

## 11. Accessibility QA

- [ ] Keyboard can reach all controls.
- [ ] Focus states are visible.
- [ ] Inputs have visible labels.
- [ ] Errors are associated with fields or form region.
- [ ] Color is not the only status signal.
- [ ] Icon-only buttons have accessible names.
- [ ] Public quote form works on mobile viewport.
- [ ] Auth form works on mobile viewport.

---

## 12. Demo and Sales Readiness

- [ ] Demo business exists.
- [ ] Demo quote link works.
- [ ] Demo lead can be created.
- [ ] Demo lead can be reviewed.
- [ ] AI draft can be generated/copied.
- [ ] Outcome can be marked.
- [ ] Dashboard shows honest proof metrics.
- [ ] GTM offer is clear.
- [ ] Founder setup price and monthly price are ready.
- [ ] Sales demo script matches current product.

---

## 13. Final Launch Decision

Sales-ready MVP can start only when:

```text
Build health passes
+ RLS tests pass
+ public quote flow passes
+ UI 100% zoom passes
+ privacy/security checklist is acceptable
+ demo flow works end-to-end
```

---

## 14. Definition of Done

This checklist is complete when every item is checked or explicitly marked as:

```text
Accepted Risk — with reason and owner/date
```

No silent exceptions.


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
