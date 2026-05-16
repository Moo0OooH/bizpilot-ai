# BizPilot AI — Vendor Independence and Portability Standard

Version: v1.0  
Status: Active Standard  
Owner: BizPilot AI  
Scope: Architecture, Backend, Database, Security, Providers, Portability  
Last Updated: 2026-05-13

---

## 1. Purpose

BizPilot AI uses Supabase as the current infrastructure provider for the MVP because it provides a fast, practical, and production-capable foundation for:

- PostgreSQL database
- Authentication
- Row Level Security
- Supabase client libraries
- Server-side data access
- Local development workflow
- Future storage capabilities

However, BizPilot AI must not become architecturally trapped inside Supabase.

The purpose of this standard is to make sure BizPilot remains:

- secure
- SQL-first
- migration-ready
- provider-abstracted
- maintainable
- portable
- resilient to vendor policy changes
- capable of moving to another infrastructure provider if needed

This standard exists because provider behavior, pricing, policies, APIs, and platform defaults can change over time.

Recent Supabase Data API changes around explicit `GRANT` requirements are an example of why BizPilot must use providers carefully and intentionally instead of depending on implicit platform defaults.

---

## 2. Executive Principle

BizPilot AI may use Supabase, but BizPilot AI must not be owned by Supabase.

Official principle:

```text
We use Supabase as an infrastructure provider.
We do not design BizPilot as a Supabase-dependent product.
```

Supabase is allowed and useful for the MVP, but the core business architecture must remain independent.

The product must be designed so that, with controlled engineering effort, BizPilot can migrate core data and business workflows to:

- direct PostgreSQL
- another managed PostgreSQL provider
- another auth provider
- another storage provider
- another AI provider
- another email provider
- another payment provider

The goal is not to avoid all vendor-specific tools.

The goal is to prevent vendor-specific tools from becoming the core product architecture.

---

## 3. Current Architecture Position

BizPilot AI is currently a Supabase-powered MVP.

Current provider assumptions:

| Area | Current Provider | Portability Requirement |
|---|---|---|
| Database | Supabase Postgres | SQL-first migrations and repository isolation |
| Auth | Supabase Auth | Auth dependency documented; migration risk tracked |
| RLS | PostgreSQL/Supabase RLS | Explicit GRANT + RLS + POLICY + tests |
| Data API | Supabase Data API / supabase-js | Access controlled by repository/service layer |
| AI | OpenAI | Provider abstraction required |
| Email | Resend | Provider abstraction required |
| Payment | Stripe planned | Provider abstraction required |
| Storage | Supabase Storage or future provider | Provider abstraction required |
| Hosting | Vercel or future host | App must not depend on host-specific business logic |

BizPilot’s target before pilot:

```text
Portability Level 2 minimum
```

BizPilot’s recommended target before paid launch:

```text
Portability Level 3
```

---

## 4. Portability Maturity Levels

### Level 0 — Vendor-Coupled Prototype

Characteristics:

- Business logic lives inside provider tools.
- Database changes are manual.
- No migration discipline.
- No clear repository/service layer.
- No export strategy.
- No provider abstraction.
- No RLS/security test discipline.

This level is not acceptable for BizPilot beyond quick experiments.

---

### Level 1 — Documented Provider Boundaries

Characteristics:

- Providers are listed and documented.
- Vendor-specific usage is known.
- Some architecture boundaries exist.
- Migration risk is recognized.
- Not all boundaries are enforced in code yet.

This is acceptable only during early MVP building.

---

### Level 2 — SQL-First and Layer-Isolated

Characteristics:

- Database changes are migration-controlled.
- Application code uses service/repository boundaries.
- UI does not talk directly to vendor-specific DB logic.
- Provider clients are isolated.
- RLS/security rules are explicit.
- Supabase service role is server-only and exceptional.
- Business logic mainly lives in services, not vendor tools.

This is the minimum required level before pilot.

---

### Level 3 — Backup, Export, and Replacement Plan

Characteristics:

- Backup/export process is documented.
- Critical tables can be exported.
- Storage export plan exists.
- Auth/user migration risk is documented.
- Provider replacement plan exists for AI/email/payment/storage.
- RLS tests are runnable.
- Security/access rules are testable.
- Migration rehearsal is planned.

This is recommended before paid launch.

---

### Level 4 — Migration Rehearsal Completed

Characteristics:

- A real migration rehearsal has been performed.
- Database export/import tested.
- Storage export tested if applicable.
- Auth migration strategy tested or formally accepted as a risk.
- App can run against a non-Supabase PostgreSQL-compatible environment with controlled changes.
- Provider replacement path has been validated.

This is not required for MVP pilot, but it is a long-term target.

---

## 5. Core Architecture Rules

### 5.1 UI and Components

UI components must not contain provider-specific database logic.

Allowed:

- rendering data
- form display
- local interaction state
- calling server actions
- using client-safe Supabase browser client only when explicitly approved

Not allowed:

- direct service-role access
- direct privileged Supabase queries
- business workflow logic
- tenant security decisions
- hidden authorization assumptions
- importing server-only modules at runtime

---

### 5.2 Server Actions

Server actions are entry points for mutations and server-side workflows.

They may:

- validate form input
- call services
- trigger redirects
- revalidate paths
- map internal errors to safe user-facing messages
- enforce action-level session requirements where needed

They must not:

- contain large business workflows
- contain raw database query complexity
- expose raw provider/database errors to users
- bypass RLS using service role for normal user workflows
- log sensitive payloads
- become vendor-specific business logic containers

---

### 5.3 Services

Services own business workflow orchestration.

They may:

- coordinate repositories
- enforce workflow rules
- call policy helpers
- prepare domain-level results
- decide business process outcomes
- call provider abstractions

They must not:

- render UI copy except safe domain messages when unavoidable
- directly depend on client components
- expose raw vendor errors to user-facing layers
- use service role unless explicitly approved
- hide authorization assumptions

---

### 5.4 Repositories

Repositories own database access.

They may:

- call Supabase/Postgres clients
- read/write database records
- map database records to domain DTOs
- throw internal errors to service/action layers
- use tenant-scoped filters

They must not:

- contain UI logic
- redirect users
- generate user-facing copy
- bypass RLS for convenience
- use service role for normal dashboard reads/writes
- be imported by client components
- own business workflows

Repository raw errors must remain internal and must be mapped to safe user-facing messages at action boundaries.

Long-term direction:

```text
raw provider error → typed internal error → service/action → safe user message
```

---

### 5.5 Policies

Policy modules own reusable authorization checks.

They may:

- verify business membership
- verify owner/admin rights
- verify active business access
- centralize permission logic

They must not:

- render UI
- access client-only modules
- become vendor-specific workflow engines
- hide data access decisions without tests

---

### 5.6 Provider Clients

Provider clients must be isolated behind clear boundaries.

Examples:

- Supabase browser client
- Supabase server session client
- Supabase service-role client
- AI provider client
- Email provider client
- Payment provider client
- Storage provider client

Provider clients must not be scattered across UI/pages/components.

---

## 6. Repository / Service Layer Standard

BizPilot must preserve this flow:

```text
UI / Page
→ Server Action or Server Page
→ Service
→ Policy
→ Repository
→ Provider / Database
```

### Required separation

| Layer | Responsibility |
|---|---|
| UI / Components | Render and collect user input |
| Server Pages | Load page-level data |
| Server Actions | Validate input, call services, handle redirect/revalidate |
| Services | Business workflow orchestration |
| Policies | Authorization and membership checks |
| Repositories | Database access |
| Providers | External vendor APIs |
| Database | Persistence and data integrity |

### Prohibited patterns

The following patterns are not allowed:

```text
Client Component → Service Role Client
Client Component → Server Repository runtime import
UI Component → Business workflow logic
Server Action → Large raw SQL workflow
Repository → UI message generation
Service → Provider-specific lock-in without interface/boundary
Dashboard page → Direct privileged Supabase access
Public route → Private data query without RLS and safe filtering
```

---

## 7. SQL-First Migration Standard

All database changes must be controlled through migrations.

Manual production schema changes from the Supabase dashboard are not allowed except for emergency intervention, and any emergency change must be backfilled into a migration immediately.

Every database change must be represented in version-controlled SQL migration files.

This includes:

- table creation
- column changes
- indexes
- constraints
- foreign keys
- enum changes
- functions
- triggers
- RLS enablement
- RLS policies
- explicit GRANT statements
- seed/reference data where required
- security helper functions

### Every new table migration must include

For every new application table:

```text
1. CREATE TABLE
2. Required constraints
3. Required indexes
4. Explicit GRANT strategy
5. RLS enablement
6. RLS policies
7. Related helper functions if needed
8. Test coverage or documented test gap
9. Public exposure classification
10. Tenant isolation strategy
```

No table should be created without deciding:

```text
Who can access it?
Through which role?
Through which operation?
Under which RLS policy?
With which tests?
```

---

## 8. Explicit Security Standard

BizPilot must not rely on implicit provider defaults.

For every exposed database table, security must be explicit.

Required model:

```text
GRANT + RLS + POLICY + TEST
```

### 8.1 GRANT

`GRANT` controls whether a database role can access the table through the Data API.

Required roles to consider:

- `anon`
- `authenticated`
- `service_role`

Rules:

- `anon` grants must be minimal.
- `authenticated` grants must be tenant-scoped by RLS.
- `service_role` grants must remain server-only and exceptional.
- No broad grants to anon.
- No default assumption that public schema tables are automatically API-exposed.
- Every future table must define its Data API exposure intentionally.

---

### 8.2 RLS

RLS controls which rows are visible or writable.

Rules:

- Every tenant/business-owned table must have RLS enabled.
- Every public-facing table must have RLS enabled unless explicitly documented otherwise.
- Public read policies must expose only public-safe active data.
- Public insert policies must prevent cross-business or ID-mixing attacks.
- Dashboard policies must prevent cross-tenant access.
- RLS must not depend only on application-side filtering.

---

### 8.3 POLICY

Policies must be clear, named, and scoped.

Policy names should describe:

```text
role + action + scope
```

Examples:

```text
authenticated members can read own business leads
anon can read active public intake fields
anon can insert public quote submissions
```

Policies should avoid:

- ambiguous tenant scoping
- recursive table lookups
- expensive repeated membership checks without indexes
- hidden dependency on application code
- broad public access

---

### 8.4 TEST

Every important table must have RLS tests.

Required test categories:

- public can read only public-safe active data
- public cannot read private lead/submission data
- public cannot insert hidden or unknown field values
- authenticated owner can read own business data
- authenticated owner cannot read another business’s data
- member role matrix behaves correctly
- inactive public link blocks public access
- service role is not used to hide missing policies
- AI and usage event tables are tenant-isolated

---

## 9. Supabase Explicit GRANT Standard

Because Supabase Data API access may require explicit grants, BizPilot must treat GRANTs as part of the table creation lifecycle.

### Required rule

Every public schema table must have an explicit Data API grant decision.

Possible decisions:

```text
anon: none
anon: select
anon: insert
authenticated: select
authenticated: insert/update/delete
service_role: select/insert/update/delete
no Data API access
```

### Least privilege principle

Never use broad grants for convenience.

Bad:

```sql
grant select, insert, update, delete on all tables in schema public to anon;
```

Preferred:

```sql
grant select on public.public_link_variants to anon;
grant insert on public.intake_submissions to anon;
```

### GRANT does not replace RLS

GRANT allows the role to reach the table.

RLS controls the rows.

Both are required.

```text
GRANT without RLS = dangerous
RLS without GRANT = may be inaccessible through Data API
GRANT + RLS + POLICY + TEST = required standard
```

---

## 10. Supabase-Specific Usage Rules

Supabase is allowed for the MVP.

Allowed:

- Supabase Postgres
- Supabase Auth
- Supabase RLS
- Supabase SSR client
- Supabase browser client
- Supabase service role for exceptional server-only workflows
- Supabase local dev tooling
- Supabase Storage if provider boundary is documented

Not allowed:

- business logic locked inside Supabase dashboard settings
- broad use of service role to bypass RLS
- provider-specific business workflows without abstraction
- manual production schema edits without migrations
- implicit grants/security assumptions
- client-side access to server-only Supabase clients
- public table exposure without documented GRANT/RLS policy

---

## 11. Service Role Rules

The Supabase service role is powerful and must be treated as privileged infrastructure access.

Allowed use cases:

- tenant bootstrap during sign-up when required
- internal administrative repair workflows
- controlled back-office tasks
- future migration/export tooling
- operations explicitly documented and server-only

Not allowed:

- normal dashboard reads
- normal owner-scoped writes
- public quote submission flow
- client-side use
- bypassing missing RLS policies
- convenience access because RLS is difficult

Every service-role usage must be documented with:

```text
1. file/function
2. reason
3. why normal authenticated client is not enough
4. security controls
5. migration impact
```

---

## 12. Provider Abstraction Standard

BizPilot must treat external providers as replaceable dependencies.

The MVP may use concrete providers, but each provider area must have a boundary.

### 12.1 AI Provider

Current provider:

```text
OpenAI
```

Required standard:

- AI calls must be server-only.
- Prompt templates must be versioned.
- Structured output should be preferred.
- Raw prompts must not be logged.
- Raw outputs must not be logged.
- Customer private content must be minimized.
- AI provider should be replaceable later.

Target abstraction:

```text
AIProvider
```

Possible future providers:

- OpenAI
- Anthropic
- Google
- local model provider
- custom hosted inference

---

### 12.2 Email Provider

Current provider:

```text
Resend
```

Required standard:

- Email provider must be server-only.
- API keys must be server-only.
- No auto-send in MVP unless explicitly approved.
- AI may draft, but owner reviews.
- Domain authentication must be documented.
- Provider should be replaceable.

Target abstraction:

```text
EmailProvider
```

Possible future providers:

- Resend
- SendGrid
- Postmark
- AWS SES
- Mailgun

---

### 12.3 Payment Provider

Current/future provider:

```text
Stripe
```

Required standard:

- Stripe secret keys must be server-only.
- Webhooks must verify signatures.
- Client payment status must not be trusted.
- Subscription state must be verified server-side.
- Payment Links may be used for MVP.
- Stripe Billing may be used later.
- Provider should be replaceable at architecture level.

Target abstraction:

```text
PaymentProvider
```

Possible future providers:

- Stripe
- Paddle
- Lemon Squeezy
- Adyen
- direct invoicing/manual billing

---

### 12.4 Storage Provider

Current/future provider:

```text
Supabase Storage or alternative
```

Required standard:

- Storage access must be server-authorized.
- Private files must not be public by default.
- Storage paths must be tenant-scoped.
- Export path must be documented.
- Provider should be replaceable.

Target abstraction:

```text
StorageProvider
```

Possible future providers:

- Supabase Storage
- AWS S3
- Cloudflare R2
- Google Cloud Storage
- Azure Blob Storage

---

### 12.5 Database Provider

Current provider:

```text
Supabase Postgres
```

Required standard:

- SQL-first schema.
- Migration-controlled changes.
- Avoid provider-only database features unless documented.
- PostgreSQL compatibility should be preserved where possible.
- RLS is allowed, but policy logic must be documented and testable.
- App should be capable of moving to managed PostgreSQL with controlled changes.

Target abstraction:

```text
DatabaseProvider / Repository Layer
```

Possible future providers:

- Supabase Postgres
- Neon
- AWS RDS Postgres
- Google Cloud SQL Postgres
- Crunchy Bridge
- self-hosted Postgres

---

### 12.6 Auth Provider

Current provider:

```text
Supabase Auth
```

Required standard:

- Auth dependency must be documented.
- User identity mapping must remain clear.
- Tables should reference stable user IDs.
- Auth migration risk must be documented before paid launch.
- Avoid scattering Supabase Auth-specific logic everywhere.
- Route protection should be centralized.

Target abstraction:

```text
AuthBoundary
```

Possible future providers:

- Supabase Auth
- Clerk
- Auth0
- WorkOS
- NextAuth/Auth.js
- custom auth

Auth is usually one of the hardest providers to migrate. BizPilot must treat it as a known migration risk.

---

## 13. No Vendor Logic in Core

Business logic must not be locked inside vendor-specific tools unless explicitly approved.

Not allowed by default:

- critical workflows inside Supabase Edge Functions
- business logic inside provider dashboard settings
- product behavior dependent on provider-specific UI config
- billing logic only inside Stripe dashboard without app-side verification
- email workflow logic only inside Resend templates
- AI behavior only inside hardcoded provider-specific prompt calls

Allowed with documentation:

- PostgreSQL functions for RLS helper checks
- database constraints
- audit consistency triggers
- security helper functions
- provider webhooks with verified signatures
- vendor-specific optimization if isolated and documented

Rule:

```text
Database functions are allowed for data integrity and security.
Core business workflows should live in the service layer.
```

---

## 14. Export and Backup Strategy

BizPilot must have a basic export/backup strategy before pilot and a stronger one before paid launch.

### 14.1 MVP Pilot Requirement

Before pilot:

- Document critical tables.
- Confirm database backup/export path.
- Confirm how to export business data.
- Confirm how to export leads and submissions.
- Confirm how to export consent/privacy settings.
- Confirm whether storage files exist.
- Document auth/user migration risk.
- Document restore procedure placeholder.

---

### 14.2 Paid Launch Requirement

Before paid launch:

- Regular backup process defined.
- Backup verification process defined.
- Restore process tested at least once.
- Table-level export process documented.
- Storage export process documented if storage is used.
- Auth migration strategy documented.
- Migration rehearsal planned or completed.
- Customer data portability policy drafted.

---

### 14.3 Critical Data Classes

Critical data includes:

- profiles
- businesses
- business_members
- business configuration
- intake forms
- intake fields
- public links
- submissions
- submission values
- leads
- lead events
- AI outputs
- usage events
- consent versions
- privacy settings
- subscription/payment metadata if present

---

### 14.4 Export Principles

Exports must:

- preserve tenant ownership
- preserve timestamps
- preserve IDs where possible
- preserve audit/event history where possible
- avoid mixing data between businesses
- avoid exposing one business’s data to another
- support future customer data portability

---

## 15. Backup and Restore Rules

Backups are not useful unless restore is possible.

BizPilot must eventually document:

```text
1. How backup is created
2. Where backup is stored
3. How backup is encrypted
4. Who can access backup
5. How restore is tested
6. How often restore is tested
7. How tenant-specific export works
8. How full database recovery works
```

For MVP pilot, this can begin as documentation.

For paid launch, it must become operational.

---

## 16. Public Quote Flow Portability

The public quote flow is one of the most important BizPilot workflows.

It must remain portable and secure.

Rules:

- Public quote routes must not require Supabase-specific business logic in UI.
- Public-safe data exposure must be defined by SQL/RLS and service layer.
- Public submission must validate server-side.
- Hidden fields must not be insertable by public users.
- Unknown field keys must be rejected.
- Public quote abuse protection must be added before serious launch.
- Success page must not expose private lead/submission/customer data.
- Public insert access must be explicit and tested.

Current known risk:

```text
intake_submission_values public insert policy needs stronger RLS test coverage and likely minimal hardening before pilot.
```

---

## 17. AI Portability and Privacy

AI workflows must not become provider-locked.

Rules:

- Prompts should be versioned.
- AI output schema should be validated.
- AI output should be review-only.
- No automatic customer communication in MVP.
- AI provider call should be isolated.
- AI prompt/output logs are forbidden.
- AI failure metadata must be reviewed for privacy risk.
- AI usage events must be tenant-isolated.
- AI tables must have RLS test coverage.

AI should assist the owner.

AI should not become an uncontrolled operator.

---

## 18. Email Portability

Email workflows must remain provider-independent.

Rules:

- Email provider must be server-only.
- Email drafts should be owner-reviewed.
- No auto-send by default.
- Domain authentication must be documented.
- Email templates should not be locked only inside provider dashboard.
- Email send events should be auditable later.
- Email provider replacement must be possible.

---

## 19. Payment Portability

Payments must remain provider-aware but not blindly provider-dependent.

Rules:

- Stripe is acceptable for MVP/future billing.
- Payment Links are acceptable for early validation.
- Billing automation can come later.
- Webhook signatures are required before trusting webhook data.
- Subscription access must be verified server-side.
- Payment state must not be trusted from client.
- Payment data must be exportable.
- Provider replacement risk must be documented.

---

## 20. Storage Portability

If BizPilot stores files, storage must be portable.

Rules:

- Storage paths must be tenant-scoped.
- Private files must not be public by default.
- Public files must be explicitly public-safe.
- Storage metadata must be stored in SQL.
- Storage export process must be documented.
- File ownership must be traceable to business/user.
- Provider-specific URLs should not be treated as permanent business data if avoidable.

---

## 21. Data API Exposure Rules

Every table must have an exposure classification.

Possible classifications:

```text
Private tenant table
Public-readable active metadata
Public-insert-only submission table
Internal audit/event table
Provider metadata table
Admin/service-only table
No Data API exposure
```

For each table, document:

```text
Role: anon/authenticated/service_role
Operation: select/insert/update/delete
RLS policy: yes/no
Test: yes/no
Public route dependency: yes/no
Dashboard dependency: yes/no
```

No future table should be merged without this classification.

---

## 22. Function and Trigger Rules

PostgreSQL functions/triggers are allowed only when they serve clear database-level purposes.

Allowed:

- RLS helper functions
- membership helper functions
- audit consistency
- timestamp updates
- database invariants
- security checks
- normalization helpers

Not preferred:

- complex product workflow logic
- AI workflow orchestration
- email workflow logic
- billing decisions
- UI-related logic
- provider-specific business automation

Every function used in RLS must document:

```text
security definer or invoker
search_path
policy dependencies
recursion risk
performance risk
required indexes
```

---

## 23. Migration Readiness Checklist for Every Future Feature

Before building a new feature, ask:

```text
1. Does this add vendor lock-in?
2. Is the data model SQL-first?
3. Is the provider isolated?
4. Is the migration path documented?
5. Are GRANT/RLS/policies/tests included?
6. Is service role avoided?
7. Is business logic kept outside vendor-specific tools?
8. Can this feature be tested without production provider state?
9. Can the data be exported later?
10. Can another provider replace this one with controlled effort?
```

If the answer is unclear, document the risk before implementation.

---

## 24. Impact on Current Roadmap

This standard updates the current hardening roadmap.

Previous path:

```text
Phase 10 — RLS Test Runner Setup
Phase 11 — RLS Test Coverage Hardening
Phase 12 — Minimal RLS Hardening
```

Updated path:

```text
Phase 10A — Vendor Independence and Portability Standard
Phase 10B — Supabase Explicit GRANT Audit
Phase 10C — Explicit GRANT Migration
Phase 10D — RLS Test Runner Setup
Phase 11 — RLS Test Coverage Hardening
Phase 12 — Minimal RLS Hardening
Phase 13 — Public Quote Abuse Protection
Phase 14 — Privacy/Data Minimization
Phase 15 — AI Privacy and Provider Boundary Hardening
Phase 16 — Backup/Export Strategy
Phase 17 — Manual QA and Pilot Readiness
```

---

## 25. Phase 10B Requirements — Explicit GRANT Audit

The next phase after this document must audit explicit GRANT readiness.

Phase 10B must produce:

```text
docs/security/BIZPILOT_SUPABASE_EXPLICIT_GRANTS_AUDIT_v1.0.md
```

It must include:

- table-by-table grant matrix
- anon grant decisions
- authenticated grant decisions
- service_role grant decisions
- sequence grant considerations
- function execution grant considerations
- least privilege risks
- migration plan
- test requirements
- no SQL changes yet

---

## 26. Phase 10C Requirements — Explicit GRANT Migration

After Phase 10B is approved, Phase 10C may add migration SQL.

Rules:

- Minimal explicit grants only.
- No broad anon grants.
- No policy rewrites in the same migration unless unavoidable.
- Service role remains server-only.
- Migration must be documented.
- RLS tests must be planned or added nearby.
- Existing behavior must remain unchanged except future-proof Data API access.

Migration should be named clearly, for example:

```text
supabase/migrations/YYYYMMDDHHMMSS_explicit_data_api_grants.sql
```

---

## 27. Phase 10D Requirements — RLS Test Runner

Before changing RLS hardening policies, RLS tests must be runnable.

Required:

- local runner
- deterministic test order
- safe local database target
- no production connection
- clear failure behavior
- documented prerequisites
- Windows-compatible workflow where practical

---

## 28. Phase 11 Requirements — RLS Test Coverage Hardening

Phase 11 must add tests for known gaps.

Required tests include:

- public user cannot insert hidden intake field values
- public user cannot insert unknown field keys
- public user cannot mix submission/business IDs
- public user cannot read private leads
- inactive public link blocks public access
- inactive consent direct table access is denied if required
- AI output tenant isolation
- usage event tenant isolation
- owner cannot access another business
- role matrix for owner/admin/member/concierge_limited

---

## 29. Phase 12 Requirements — Minimal RLS Hardening

Only after tests exist should RLS policies be hardened.

Known current priority:

```text
intake_submission_values public insert policy
```

Goal:

- prevent hidden field insert
- prevent unknown field insert
- prevent ID-mixing between business/submission/form/field
- keep public quote submission working
- avoid broad RLS rewrite

---

## 30. Current Accepted Vendor Dependencies

The following are accepted for MVP:

```text
Supabase Postgres
Supabase Auth
Supabase RLS
Supabase Data API
Supabase SSR client
OpenAI
Resend
Stripe planned
Vercel or equivalent hosting
```

But each is accepted under this rule:

```text
Allowed provider dependency does not mean allowed architecture lock-in.
```

---

## 31. Current Deferred Items

The following are intentionally deferred:

- full provider interface implementation for every provider
- full database provider abstraction
- full auth provider migration plan
- full storage export implementation
- full backup automation
- migration rehearsal
- repository typed-error conversion
- AI structured output hardening
- Stripe billing implementation
- durable audit-log persistence
- external observability provider
- multi-region deployment
- enterprise compliance automation

These are deferred, not ignored.

---

## 32. Required Before Pilot

Before pilot with real businesses, BizPilot should complete:

```text
1. Explicit GRANT audit
2. Explicit GRANT migration if needed
3. RLS test runner
4. RLS tests for public quote critical paths
5. Minimal RLS hardening for intake_submission_values
6. Public quote abuse/rate-limit plan
7. Basic backup/export documentation
8. Manual QA checklist
9. Production readiness checklist
```

---

## 33. Required Before Paid Launch

Before paid launch, BizPilot should complete:

```text
1. Tested backup/restore process
2. Table-level export process
3. Auth migration risk documentation
4. AI privacy hardening
5. Email domain authentication
6. Payment webhook security if Stripe Billing is used
7. RLS test coverage for all critical tenant tables
8. Role matrix completion
9. Incident response basics
10. Provider replacement notes for AI/email/payment/storage
```

---

## 34. Design Philosophy

BizPilot should use modern providers aggressively but carefully.

The goal is not to build everything from scratch.

The goal is:

```text
Fast MVP execution
without irresponsible vendor lock-in.
```

Strong provider usage is acceptable.

Blind dependency is not.

---

## 35. Definition of Done

This standard is complete when:

- The document exists in `docs/architecture`.
- `docs/README.md` references it as an active architecture standard.
- `MANIFEST.json` references it.
- Future phases use it as a decision filter.
- Supabase explicit GRANT audit is performed against this standard.
- RLS hardening follows the `GRANT + RLS + POLICY + TEST` rule.
- Provider-specific features are evaluated for lock-in risk.
- Backup/export planning becomes part of pilot readiness.

---

## 36. Final Principle

BizPilot AI must be built as a real SaaS product, not as a collection of provider shortcuts.

Final rule:

```text
Use strong providers.
Keep core architecture independent.
Make security explicit.
Keep data portable.
Protect future migration options.
```

Supabase is a good current choice.

BizPilot must still remain bigger than Supabase.
