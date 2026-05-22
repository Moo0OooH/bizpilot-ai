# BizPilot AI - Bug Triage and Release QA Standard v1.0

## Purpose

Create a fixed QA and bug priority system before real pilot customers use BizPilot.

## Priority Levels

```text
P0 = security, data leak, auth broken, quote submit broken
P1 = dashboard broken, AI unusable, onboarding blocked
P2 = UX polish, spacing, copy, confusing empty state
P3 = nice-to-have
```

## Required Release Checks

```text
pnpm lint
pnpm typecheck
pnpm test:unit
pnpm test:rls
pnpm build
homepage visual QA
pricing QA
auth QA
dashboard QA
quote submit QA
AI QA
mobile QA
production smoke test
```

## Bug Record Fields

```text
id
date found
priority
route
tenant/business affected
steps to reproduce
expected result
actual result
owner/user impact
fix owner
status
verification evidence
```

## Release Rule

P0 bugs block all pilot activity. P1 bugs block new demos and onboarding. P2 bugs can ship only with explicit risk acceptance. P3 bugs may be batched.

## Evidence Rule

Every resolved P0/P1 must include:

```text
test command or browser route
result
date
remaining risk if any
```

