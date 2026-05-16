# BizPilot AI — Database and RLS Policy Baseline v1.0

**Project:** BizPilot AI  
**Document Type:** Database / RLS Baseline  
**Version:** v1.0  
**Status:** Final Founder-Grade Canonical Draft  
**Owner:** MoOoH  
**Last Updated:** 2026-05-03

---

## 1. Purpose

This document defines the database and Row Level Security baseline for BizPilot MVP.

RLS is not optional.

---

## 2. Tenant Model

Core tenant entity:

```text
business
```

Membership table:

```text
business_members
```

Rules:

- A user can belong to one or more businesses.
- A business has one or more members.
- Operational records belong to a business.
- Users access only businesses where they are members.

---

## 3. Core Phase 2 Tables

### profiles

Purpose:

- Stores user profile data linked to Supabase Auth user.

Required columns:

- id
- user_id
- display_name
- created_at
- updated_at

### businesses

Purpose:

- Stores tenant business account.

Required columns:

- id
- name
- slug
- owner_user_id
- created_at
- updated_at

### business_members

Purpose:

- Stores user membership in businesses.

Required columns:

- id
- business_id
- user_id
- role
- created_at

Roles:

- owner
- admin
- member
- concierge_limited later

---

## 4. RLS Policy Groups

Required policy groups:

- Own profile read/update
- Business member read
- Business owner/admin update
- Member-only settings access
- Member-only lead access
- Scoped public insert for intake submissions
- No public read of private data
- Service-role only maintenance behavior

---

## 5. Public Insert Baseline

Public quote pages must insert only for a resolved valid business slug.

Rules:

- Public cannot list businesses.
- Public cannot read private settings.
- Public can read only public-safe form/branding fields.
- Public can insert intake submission and lead under resolved business_id.
- Public insert must pass server-side validation.

---

## 6. RLS Test Requirements

Every phase with new tables must include tests for:

- Member can access own business data
- Non-member cannot access business data
- Public cannot read private data
- Public can submit scoped intake where allowed
- Cross-tenant denial works

---

## 7. Migration Naming

Migration files should use clear phase names:

```text
0001_auth_tenant_foundation.sql
0002_business_template_configuration.sql
0003_public_intake_and_leads.sql
0004_lead_conversion_desk.sql
0005_ai_assistant_outputs.sql
0006_sales_ready_subscriptions.sql
```

---

## 8. Definition of Done

This baseline is complete when:

- Tenant model is clear.
- RLS policy groups are defined.
- Public insert rules are defined.
- RLS tests are required by phase.
- Migration naming is standardized.

## Baseline Addendum — Database as Primary Boundary v1.6

All current and future RLS baselines must follow this rule:

> The database is the primary authorization boundary; app code is not sufficient by itself.

For public intake flows, RLS/helper functions must validate active link state, business/form relationship, and allowed public field writability. Public insert policies must not rely only on frontend field filtering.
