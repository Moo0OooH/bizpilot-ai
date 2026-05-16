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

## Engineering Addendum — Strategic Execution Constraints v1.6

Engineering decisions must support the active lead recovery MVP and avoid premature platform expansion.

### Current Engineering Priorities

1. Public quote security hardening.
2. Database/RLS enforcement before app-only validation.
3. Server-only and DTO boundaries.
4. AI structured outputs and privacy controls.
5. Magic Moment support through safe sample/demo data.
6. Operational Calm UI implementation.
7. Founder-led onboarding support before self-serve automation.

### Feature Constraint

Do not introduce architecture or abstractions solely for deferred features such as booking, invoices, direct message automation, multi-vertical packs, or marketplace workflows.

### AI Coding Agent Rule

When using Codex or another coding agent, tasks must be small, bounded, testable, and aligned with the active v1.6 priorities. The agent must not broaden scope beyond the prompt.
