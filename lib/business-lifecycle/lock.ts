/**
 * ============================================================
 * File: lib/business-lifecycle/lock.ts
 * Project: BizPilot AI
 * Description: Shared lifecycle lock helpers for workspace write paths.
 * Role: Keeps new customer-data workflows blocked after deletion is requested.
 * Related:
 * - server/services/business-deletion.service.ts
 * - server/services/public-intake.service.ts
 * - server/actions/business-deletion.actions.ts
 * Author: MoOoH
 * Created: 2026-05-24
 * Last Updated: 2026-07-05
 * Change Log:
 * - 2026-07-05: Added complete source header metadata for lifecycle lock helpers.
 * - 2026-05-24: Created workspace lifecycle lock helper.
 * ============================================================
 */

export type BusinessLifecycleStatus =
  | "active"
  | "archived"
  | "deletion_requested"
  | "deleting"
  | "deleted";

export const WORKSPACE_LOCKED_FOR_NEW_WORK_MESSAGE =
  "Workspace is locked and cannot create new customer work.";

export function isWorkspaceLockedForNewCustomerWork(
  lifecycleStatus: BusinessLifecycleStatus,
): boolean {
  return (
    lifecycleStatus === "deletion_requested" ||
    lifecycleStatus === "deleting" ||
    lifecycleStatus === "deleted"
  );
}
