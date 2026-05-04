/**
 * ============================================================
 * File: lib/env.ts
 * Project: BizPilot AI
 * Description: Re-exports environment helpers for compatibility.
 * Role: Keeps simple imports stable while canonical env helpers live in lib/env/.
 * Related:
 * - lib/env/public-env.ts
 * - lib/env/server-env.ts
 * Author: MoOoH
 * Created: 2026-05-02
 * Last Updated: 2026-05-04
 * Change Log:
 * - 2026-05-04: Converted to env helper re-export and added standard header.
 * ============================================================
 */

export { getPublicEnv } from "@/lib/env/public-env";
export { getServerEnv } from "@/lib/env/server-env";
