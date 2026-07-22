/**
 * ============================================================
 * File: lib/time/business-operating-time-zone.ts
 * Project: BizPilot AI
 * Description: Canonical operating timezone for local date-and-time workflows.
 * Role: Keeps public intake, Premium Operations, and dashboard formatting on one explicit IANA timezone until per-business timezone configuration is introduced.
 * Related:
 * - server/services/public-intake.service.ts
 * - server/services/premium-operations.service.ts
 * - components/dashboard/premium-operations-workspace.tsx
 * Author: MoOoH
 * Created: 2026-07-22
 * Last Updated: 2026-07-22
 * Change Log:
 * - 2026-07-22: Added the explicit Toronto operating timezone shared by intake and internal scheduling.
 * ============================================================
 */

export const BUSINESS_OPERATING_TIME_ZONE = "America/Toronto";
