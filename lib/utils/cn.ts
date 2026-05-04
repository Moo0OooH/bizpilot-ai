/**
 * ============================================================
 * File: lib/utils/cn.ts
 * Project: BizPilot AI
 * Description: Minimal class name helper for Phase 1 UI foundation.
 * Role: Provides a shared class string helper for UI components and shadcn-compatible imports.
 * Related:
 * - lib/utils.ts
 * - components.json
 * Author: MoOoH
 * Created: 2026-05-04
 * Last Updated: 2026-05-04
 * Change Log:
 * - 2026-05-04: Created class name helper and added standard header.
 * ============================================================
 */

type ClassValue = string | false | null | undefined;

export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(" ");
}
