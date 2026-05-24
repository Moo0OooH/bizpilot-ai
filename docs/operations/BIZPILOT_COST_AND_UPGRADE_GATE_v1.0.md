# BizPilot AI - Cost And Upgrade Gate v1.0

**Project:** BizPilot AI
**Document Type:** Cost, upgrade, and paid-action decision gate
**Status:** Active gate before paid infrastructure or real customer data
**Owner:** MoOoH
**Last Updated:** 2026-05-24

---

## 1. Purpose

This gate defines where Codex may continue autonomously and where owner review is required because the next step may create cost, paid commitments, real customer exposure, or irreversible production impact.

Default rule:

```text
Codex may continue no-cost, repo-backed, non-destructive engineering work.
Codex must stop and ask before paid upgrades, paid API usage, real customer data, main push/deploy, secret reveal, or destructive production actions.
```

## 2. No-Cost Work Codex May Continue

Allowed without another approval when it stays repo-backed and non-destructive:

- local code edits,
- local documentation updates,
- local validation commands,
- local commits on the current branch,
- read-only GitHub/Vercel/Supabase inspection,
- no-secret configuration checks,
- synthetic-only planning and test scripts,
- CI workflow preparation that does not require paid services,
- production read-only verification that returns metadata, counts, or non-sensitive evidence.

## 3. Paid Or Sensitive Work That Requires Owner Review

| Area | Stop before | Why |
| --- | --- | --- |
| Supabase | Upgrading plan, enabling PITR/scheduled backups, creating paid compute/storage, or running destructive data work | Could create recurring cost or affect production data. |
| Vercel | Upgrading plan, changing billing, changing production deployment settings, or triggering production deploy from `main` | Could create cost or live-site impact. |
| OpenAI | Running repeated real-key tests, batch generation, or production AI workloads | Could consume paid credits and expose real customer content if not synthetic. |
| Email/SMS | Enabling Resend, SMS, WhatsApp, or outbound automation | Could send messages, create cost, or contact real people. |
| Stripe/billing | Creating live Payment Links, invoices, subscriptions, or checkout | Could collect money or create customer obligations. |
| Domain/DNS | Changing DNS, SSL, redirects, or canonical production domain behavior | Could affect the live site. |
| GitHub | Pushing to `main`, opening/merging release PRs, enabling branch rules with required paid integrations | Could trigger Vercel deploys or change release flow. |
| Data export | Exporting production data containing real customer content | Requires storage/access approval and encryption outside git. |

## 4. Current Free-Plan Reality

As of 2026-05-24:

| Service | Current status | Cost gate |
| --- | --- | --- |
| Supabase | Free project / Nano compute; no scheduled backups; PITR unavailable/not enabled | Upgrade before real customer data or explicitly accept synthetic-only/no-real-data risk. |
| Vercel | Hobby/free project verified; production deployment Ready | No main push/deploy without owner approval because GitHub main can trigger production deploy. |
| GitHub | Public repo; no Actions runs yet; CI workflow prepared locally | Pushing workflow is owner-controlled because it may trigger CI and Vercel preview behavior. |
| OpenAI | Key exists in Vercel env names, but prior real-key dry run returned HTTP `429` | Owner must resolve quota/billing/model access before model-backed production demos. |
| Billing | Manual billing only; no Stripe implementation required for pilot | Owner must approve commercial terms before payment collection. |

## 5. Recommended Upgrade Decision Order

Before first real customer data:

1. Decide Supabase upgrade for scheduled backups/PITR.
2. Run and verify a schema-only export outside git.
3. Decide encrypted export storage and access list.
4. Run a restore drill to a non-production target.
5. Decide whether Vercel Hobby is acceptable for pilot traffic.
6. Resolve OpenAI quota/billing only if model-backed AI will be shown live.
7. Lock commercial pilot terms before payment collection.

## 6. Current Decision

```text
Continue no-cost repo-backed development and synthetic verification.
Stop before paid upgrades, real customer data, main push/deploy, secret reveal, or destructive production operations.
```
