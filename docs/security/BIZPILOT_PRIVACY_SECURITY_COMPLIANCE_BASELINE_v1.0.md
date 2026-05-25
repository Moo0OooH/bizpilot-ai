# BizPilot AI — Privacy, Security, and Compliance Baseline v1.0

**Project:** BizPilot AI  
**Document Type:** Privacy / Security / Compliance Baseline  
**Version:** v1.0  
**Status:** Final Founder-Grade Canonical Draft  
**Owner:** MoOoH  
**Last Updated:** 2026-05-03

---

## 1. Purpose

This document defines the privacy and security baseline for BizPilot MVP.

BizPilot handles customer quote requests, contact details, service details, and AI-generated internal drafts. The product must be built with privacy and tenant isolation from the beginning.

This is not legal advice. It is an engineering and product baseline that reduces avoidable risk.

---

## 2. Core Security Principles

- Tenant isolation is mandatory.
- RLS is mandatory from Phase 2.
- Service role key is server-only.
- No private data is exposed on public quote pages.
- Public intake can only insert scoped submissions.
- AI calls happen server-side only.
- Logs must not contain unnecessary customer details.
- Data minimization is required.

---

## 3. Privacy Modes

### Standard Mode

Stores:

- Submission values
- Lead detail
- AI outputs
- Status and events
- Usage events

### Minimal Data Mode

Stores only useful minimum data:

- Business relationship
- Customer contact
- Service type
- City/service area
- Status
- Minimal notes when necessary
- Created timestamp

### Forward-Only Mode

Future only. Not MVP.

---

## 4. Required Privacy Fields

- consent_version
- consent_accepted_at
- ai_processing_disclosure
- privacy_contact_email
- data_retention_days
- delete_request_status

---

## 5. Canonical Consent Notice

```text
By submitting this request, you agree that your information will be shared with [Business Name] to respond to your quote request. BizPilot may help prepare internal AI drafts, but the business reviews messages before sending.
```

---

## 6. Public Page Security Rules

Public quote page may:

- Read public-safe business name and branding
- Read active public intake form configuration
- Insert scoped submission for resolved business
- Insert lead for resolved business

Public quote page may not:

- Read dashboard data
- Read AI outputs
- Read usage events
- Read private owner details
- Read subscriptions
- Read other businesses

---

## 7. Logging Rules

Logs may include:

- request_id
- business_id
- user_id when authenticated
- operation name
- error code
- timestamp
- cost metadata

Logs should avoid:

- Full customer messages
- Secrets
- API keys
- Tokens
- Payment details
- Private contact details unless strictly needed

---

## 8. AI Privacy Rules

- AI receives only data required for the specific output.
- Privacy filter runs before AI calls.
- AI outputs are stored according to privacy mode.
- AI must not invent unsupported business details.
- AI must not include hidden system or internal metadata in owner-facing drafts.

---

## 9. Secret Management

- `.env.local` is never committed.
- `.env.example` contains placeholders only.
- Supabase service role key is server-only.
- OpenAI key is server-only.
- Stripe secret key is server-only.
- Resend key is server-only.

---

## 10. Data Deletion Baseline

MVP should support at least operational handling of deletion requests:

- Capture delete request status.
- Allow internal review.
- Remove or minimize records where appropriate.
- Keep audit-safe metadata only when needed.

Full automated deletion workflow can come later.

---

## 11. Definition of Done

This baseline is complete when:

- Privacy modes are defined.
- Consent notice is defined.
- Public page security is defined.
- Logging rules are defined.
- AI privacy rules are defined.
- Secret handling is defined.

## Privacy Addendum — Owner-Controlled Response Strategy v1.6

The MVP must keep the owner in control of all outbound communication.

AI may draft, summarize, classify, or suggest follow-ups, but it must not send messages, confirm bookings, quote final prices, promise availability, or make commitments without owner review.

For privacy-sensitive AI calls, store only safe metadata and validated structured outputs needed for product functionality. Do not persist raw provider failure details or unnecessary customer-sensitive content.

## Public Trust Pages Addendum - 2026-05-25

BizPilot now exposes public trust pages that make the pilot-stage boundaries clear
before any real customer data is approved:

- `/privacy` - explains intended quote-recovery data collection, consent,
  minimization, tenant isolation, and request handling.
- `/security` - summarizes public quote hardening, RLS/tenant isolation,
  secret handling, AI owner-review boundaries, and the backup/export gate.
- `/terms` - records founder-pilot scope, staged pricing, manual billing,
  refund/cancellation boundaries, and no-guarantee language.

These pages are not a substitute for legal review, a verified privacy mailbox,
custom SMTP posture, or a restore drill. They close a public-page/documentation
gap for founder-controlled synthetic demos and prepare the project for a cleaner
pilot-readiness review.
