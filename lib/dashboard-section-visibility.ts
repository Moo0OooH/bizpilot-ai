/**
 * ============================================================
 * File: lib/dashboard-section-visibility.ts
 * Project: BizPilot AI
 * Description: Validates the optional dashboard destinations shown in navigation.
 * Role: Keeps display preferences limited to Reports and Guide without changing route authorization.
 * Related:
 * - app/(dashboard)/layout.tsx
 * - server/actions/dashboard-display.actions.ts
 * - components/dashboard/dashboard-sidebar.tsx
 * Author: MoOoH
 * Created: 2026-07-17
 * Last Updated: 2026-07-17
 * Change Log:
 * - 2026-07-17: Added the server-cookie allowlist, parser, normalizer, and serializer.
 * ============================================================
 */

export const DASHBOARD_SECTION_VISIBILITY_COOKIE =
  "bizpilot-dashboard-visible-sections";
export const DASHBOARD_SECTION_VISIBILITY_MAX_AGE = 60 * 60 * 24 * 365;

export const OPTIONAL_DASHBOARD_SECTIONS = ["reports", "guide"] as const;

export type OptionalDashboardSection =
  (typeof OPTIONAL_DASHBOARD_SECTIONS)[number];

export const DEFAULT_VISIBLE_DASHBOARD_SECTIONS: readonly OptionalDashboardSection[] =
  OPTIONAL_DASHBOARD_SECTIONS;

const optionalDashboardSectionSet = new Set<string>(
  OPTIONAL_DASHBOARD_SECTIONS,
);

export function isOptionalDashboardSection(
  value: unknown,
): value is OptionalDashboardSection {
  return (
    typeof value === "string" && optionalDashboardSectionSet.has(value)
  );
}

export function normalizeVisibleDashboardSections(
  values: readonly unknown[],
): readonly OptionalDashboardSection[] {
  const requested = new Set(
    values.filter(isOptionalDashboardSection),
  );

  return OPTIONAL_DASHBOARD_SECTIONS.filter((section) =>
    requested.has(section),
  );
}

export function parseVisibleDashboardSections(
  value: unknown,
): readonly OptionalDashboardSection[] {
  if (typeof value !== "string") {
    return DEFAULT_VISIBLE_DASHBOARD_SECTIONS;
  }

  if (value.length > 128) {
    return DEFAULT_VISIBLE_DASHBOARD_SECTIONS;
  }

  return normalizeVisibleDashboardSections(
    value.split(",").map((section) => section.trim()),
  );
}

export function serializeVisibleDashboardSections(
  sections: readonly unknown[],
): string {
  return normalizeVisibleDashboardSections(sections).join(",");
}

export function isDashboardSectionVisible(
  visibleSections: readonly OptionalDashboardSection[],
  section: OptionalDashboardSection,
): boolean {
  return visibleSections.includes(section);
}
