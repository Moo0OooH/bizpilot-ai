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
