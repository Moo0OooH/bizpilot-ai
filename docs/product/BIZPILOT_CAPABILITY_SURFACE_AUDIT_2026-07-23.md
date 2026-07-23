<!--
 * ============================================================
 * File: docs/product/BIZPILOT_CAPABILITY_SURFACE_AUDIT_2026-07-23.md
 * Project: BizPilot AI
 * Description: Audits implemented product capabilities against their public, owner, and founder interface surfaces.
 * Role: Prevents supported workflows from becoming undiscoverable while preserving manual-first and access-control boundaries.
 * Related:
 * - app/(dashboard)/dashboard/configuration/page.tsx
 * - app/(dashboard)/dashboard/operations/page.tsx
 * - app/admin/page.tsx
 * - lib/i18n/public-v3-spec.ts
 * - docs/dashboard-v4/CURRENT.md
 * - docs/website-v4/CURRENT.md
 * Author: MoOoH
 * Created: 2026-07-23
 * Last Updated: 2026-07-23
 * Change Log:
 * - 2026-07-23: Established the capability-to-surface audit and Dashboard V5 information hierarchy.
 * ============================================================
 -->

# BizPilot capability surface audit — 2026-07-23

## Decision

BizPilot keeps one public quote form per business and can create multiple privacy-safe,
tracked variants of that form URL for individual placements. The variants do not create
different forms. A submitted request preserves its approved source and optional campaign
tag so Reports can group actual submissions. BizPilot does not claim profile views,
link clicks, revenue attribution, inbox integration, or automatic conversion.

The protected product remains a manual-first operations workspace. Owners configure the
intake, review requests and drafts, and copy responses into the real customer channel.
Founder Admin remains a separately authorized oversight and access-control surface.

## Capability-to-surface matrix

| Capability | Customer/public surface | Owner surface | Founder surface | Status |
| --- | --- | --- | --- | --- |
| One business quote form | Product workflow and public quote route | Quote Setup → Public Link | Quote-link state in Business Operations | Visible |
| Per-placement tracked variants | Product workflow explains the model | Public Link provides approved channel variants and custom source | Submitted-source reporting | Visible and bounded |
| Submitted-source reporting | No click or view claim | Reports groups submissions by source and optional campaign | Bounded cross-workspace aggregate | Visible |
| Services, coverage, and form structure | Public intake renders saved choices | Quote Setup task panels | Workspace inspection | Visible |
| Branding, consent, and approved FAQ facts | Public quote and success pages | Branding, Privacy, and AI Instructions | Workspace inspection | Visible |
| Lead review and manual reply workflow | No autonomous-response claim | Leads and Lead Detail | Founder lead oversight | Visible |
| Priority Workbench | Optional Premium catalog | Premium Operations when entitled | Founder entitlement control | Gated and visible |
| Bulk Reply Review | Optional Premium catalog; no send claim | Premium Operations when entitled | Founder entitlement control | Gated and visible |
| Availability Coordination | Optional Premium catalog; no booking claim | Premium Operations when entitled | Founder entitlement control | Gated and visible |
| Premium entitlement management | Separate founder-managed activation is stated | Locked state explains access and gives founders a direct control path | Admin Overview and Business Operations link to the exact controls | Founder-only |
| Authentication and recovery | Sign-in, callback, reset, and recovery states | Existing-workspace recovery only | User/workspace inspection | Visible and guarded |
| Lifecycle and deletion | Privacy and terms describe boundaries | Settings exposes owner lifecycle controls | Sensitive founder controls stay disclosed on demand | Visible and guarded |

## Dashboard V5 information hierarchy

1. Route heading and current task navigation come first.
2. The active task contains the next setup action and the smallest useful status summary.
3. Detailed readiness evidence remains available in Overview.
4. The six-stage setup journey is supporting guidance, not primary navigation, and stays
   collapsed until requested.
5. Premium locked states explain why access is closed. An authorized founder receives a
   direct link to the exact entitlement controls; a normal owner never receives that link.
6. Founder Admin Overview exposes the shortest path to Premium access controls without
   moving guarded mutations into the overview itself.
7. Sidebar destinations must fit the rail at supported widths; descriptions may move to
   accessible labels or title text when persistent display creates overflow.

This structure follows progressive disclosure: immediate tasks remain visible while
supporting explanation and sensitive controls appear only at the point of need.

## Public visual and editorial hierarchy

- Responsive display titles use a bounded scale and must not suppress the product proof
  or create avoidable extra scrolling on common laptop and mobile viewports.
- Pricing keeps the approved amounts but gives each tier enough outcome-oriented copy to
  explain what the customer receives and why the tier differs.
- Multi-part prices may stay on one line only where the full card width safely supports
  it; narrower viewports may wrap naturally without clipping or horizontal overflow.
- English and Canadian French must communicate equivalent capability and safety claims.

## Implementation coverage

The July 23 source audit reviewed exported authentication, intake, configuration,
workspace, lead, reporting, Premium Operations, founder, and lifecycle actions against
their route/component references. Supported owner and founder actions are either mounted
in a visible interface, reached through a guarded disclosure, or intentionally reserved
for authentication/system boundaries. No new autonomous action, direct social integration,
booking, payment, or customer-data access was added to fill an interface.

The two discoverability gaps found by the audit were corrected:

- Quote Setup task navigation now precedes readiness guidance and the large setup journey.
- Premium entitlement controls now have direct founder-only paths from Admin Overview and
  the locked Premium Operations route.

## Reference principles

- Carbon Design System tabs: tabs organize related content; linear progress belongs in a
  progress pattern rather than replacing task navigation.
- WCAG 2.2: controls preserve usable target sizes, visible focus, contrast, and reflow.
- Nielsen Norman Group: progressive disclosure reduces initial complexity; dashboards
  prioritize at-a-glance state and actionable information.

These references guide hierarchy and interaction. BizPilot retains its own visual system,
manual-first workflow, and founder-only access contract.
