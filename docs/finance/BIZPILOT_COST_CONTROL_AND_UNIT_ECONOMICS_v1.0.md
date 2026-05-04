# BizPilot AI — Cost Control and Unit Economics v1.0

**Project:** BizPilot AI  
**Document Type:** Cost Control / Unit Economics  
**Version:** v1.0  
**Status:** Final Founder-Grade Canonical Draft  
**Owner:** MoOoH  
**Last Updated:** 2026-05-03

---

## 1. Purpose

This document exists because BizPilot must not become an expensive SaaS before validation.

The rule is:

```text
If the product is not generating validation, infrastructure must not keep burning money.
```

The MVP should be able to run with near-zero fixed cost before paid customers.

---

## 2. Cost Philosophy

- Use managed cloud services to avoid ops complexity.
- Use free or low-cost tiers until validation.
- Do not add background workers unless revenue justifies it.
- Do not add vector databases.
- Do not generate AI automatically for every event.
- Do not build full billing before customer proof.
- Track cost per lead from the beginning.

---

## 3. Cost Components

### Fixed or semi-fixed

- Domain later
- Vercel paid plan only when needed
- Supabase Pro only when production usage requires it
- Resend paid plan only when email volume requires it

### Usage-based

- OpenAI token usage
- Email volume
- Database storage and bandwidth
- Function invocations if later used

---

## 4. Pre-Validation Cost Target

Before validation:

```text
Target fixed software infrastructure cost: $0-$25/month
Acceptable temporary ceiling: $50/month only if active customer validation is happening
```

Do not upgrade services just because they look more professional.

Upgrade only when a specific constraint appears.

---

## 5. AI Cost Policy

Rules:

- One AI bundle per lead by default.
- Cache AI outputs.
- Regenerate only when lead data or business context changes.
- Rule-based scoring runs before AI.
- Never call AI on every page refresh.
- Never run AI from the browser.
- Track input tokens, cached tokens, output tokens, model, and estimated cost.
- Alert internally if AI cost exceeds 10% of customer monthly revenue.

---

## 6. AI Bundle Definition

One AI bundle may include:

- Lead summary
- Reply draft
- Follow-up draft
- Missing info reasoning
- Suggested next action
- Lead quality explanation
- Tone variants

This should be generated in one orchestrated server-side call where practical, or in a small number of controlled calls if schema quality requires it.

---

## 7. Unit Economics Targets

For Founder Setup:

```text
Revenue: $199 setup + $49/month
Target AI cost: < $5/month/customer initially
Target email cost: near $0/customer initially
Target support effort: under 2 hours setup + light adjustment
```

For Founder Plus:

```text
Revenue: $299 setup + $79/month
Target AI cost: < $8/month/customer initially
Target support effort: under 3 hours setup + monthly review
```

---

## 8. Cost Per Lead

Track:

- ai_cost_per_lead
- email_cost_per_lead
- infrastructure_cost_estimate_per_customer
- total_cost_per_lead
- ai_cost_percent_of_revenue

MVP target:

```text
AI cost per lead should be low enough that 30-100 leads/month/customer remains profitable.
```

---

## 9. Upgrade Rules

Upgrade Supabase only if:

- Free tier limits block active validation
- Real customer usage needs production reliability
- Database/storage limits are hit
- Auth/usage constraints require it

Upgrade Vercel only if:

- Production deploy needs paid features
- Limits block customer usage
- Commercial reliability requires it

Upgrade Resend only if:

- Email volume exceeds free allowance
- Domain/email reliability requires paid plan

---

## 10. Stop-Build Cost Rule

Stop building new features if:

- Monthly cost rises before customer validation
- Support work exceeds revenue
- AI is used but not copied/edited by owners
- Infrastructure upgrades are needed for features that are not validated

---

## 11. Definition of Done

This cost policy is complete when:

- Fixed cost targets are explicit.
- AI usage rules are explicit.
- Unit economics targets are defined.
- Upgrade rules are defined.
- Stop-build cost rules are defined.
