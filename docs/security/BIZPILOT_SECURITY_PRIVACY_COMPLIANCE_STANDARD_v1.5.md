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

## Security Addendum — MVP Hardening Priority v1.6

### Highest-Risk Surface

The public quote submission path is the highest-risk MVP surface because it combines anonymous access, public inserts, form/field mapping, lead creation, and AI-adjacent workflows.

### Required Baseline Before Public Pilot

- explicit GRANT review,
- RLS helper validation for active public link and allowed fields,
- abuse prevention for public submit actions,
- honeypot or spam-friction mechanism,
- safe error messages,
- safe logging and AI metadata cleanup,
- CSP report-only baseline,
- security headers review,
- secure cookie/session review,
- CSRF review for mutation paths.

### AI Privacy Rule

AI output must be structured and validated. AI persistence must avoid raw provider errors, internal stack details, secrets, or customer-sensitive fragments. Store only safe operational metadata unless a deliberate product requirement says otherwise.
