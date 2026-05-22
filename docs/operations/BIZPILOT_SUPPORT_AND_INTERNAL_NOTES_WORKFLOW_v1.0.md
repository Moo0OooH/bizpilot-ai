# BizPilot AI - Support and Internal Notes Workflow v1.0

## Purpose

Define how the founder records support context, pilot risk, objections, and account decisions without adding a ticketing product.

## Internal Note Locations

Use:

```text
/admin internal note
Founder CRM notes
Phase 18 work log for project-level evidence
```

Do not put sensitive secrets, passwords, API keys, or payment card details in notes.

## Note Categories

```text
setup note
owner objection
support issue
pricing conversation
refund/cancellation request
testimonial language
churn risk
follow-up reminder
```

## Support Flow

1. Record the issue in Founder CRM.
2. Add short account context in `/admin` if it affects plan/access/setup.
3. Classify bug impact using the QA standard.
4. Fix P0/P1 before more demos.
5. Record verification evidence.

## Account Access Decisions

When changing account access:

```text
change status or plan in /admin
include a short internal note
confirm public quote link state
verify admin_action_log records the change
record customer-facing follow-up in Founder CRM
```

## Privacy Rules

- Keep notes minimal.
- Avoid unnecessary customer PII.
- Never include secrets.
- Retain data unless a deletion/minimization decision is approved.
- Treat support notes as internal-only founder operations data.

