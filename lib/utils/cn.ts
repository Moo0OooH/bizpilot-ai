/**
 * File: lib/utils/cn.ts
 * Project: BizPilot AI
 * Description: Minimal class name helper for Phase 1 UI foundation.
 * Author: MoOoH
 * Created: 2026-05-04
 * Last Updated: 2026-05-04
 */

type ClassValue = string | false | null | undefined;

export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(" ");
}
