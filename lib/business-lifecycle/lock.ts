/**
 * ============================================================
 * File: lib/business-lifecycle/lock.ts
 * Project: BizPilot AI
 * Description: Shared lifecycle lock helpers for workspace write paths.
 * Role: Keeps new customer-data workflows blocked after deletion is requested.
 * Author: MoOoH
 * Created: 2026-05-24
 * Last Updated: 2026-05-24
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
