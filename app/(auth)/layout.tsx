/**
 * ============================================================
 * File: app/(auth)/layout.tsx
 * Project: BizPilot AI
 * Description: Defines the auth route-group layout boundary.
 * Role: Keeps auth pages grouped while delegating all visual shell and behavior to child routes.
 * Related:
 * - app/layout.tsx
 * - docs/readiness/BIZPILOT_SOURCE_OF_TRUTH_2026-07-14.md
 * Author: MoOoH
 * Created: 2026-05-02
 * Last Updated: 2026-07-14
 * Change Log:
 * - 2026-07-14: Pointed the route boundary at the current V2 source of truth after legacy plan retirement.
 * - 2026-07-05: Removed stale placeholder wording from the auth route-group layout header.
 * - 2026-05-04: Added standard project file header.
 * ============================================================
 */

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
