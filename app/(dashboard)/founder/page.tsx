/**
 * ============================================================
 * File: app/(dashboard)/founder/page.tsx
 * Project: BizPilot AI
 * Description: Legacy founder entry route.
 * Role: Preserves the existing guarded URL while sending authorized founders directly to the canonical Admin console.
 * Related:
 * - app/admin/page.tsx
 * - server/services/founder-admin.service.ts
 * Author: MoOoH
 * Created: 2026-05-18
 * Last Updated: 2026-07-14
 * Change Log:
 * - 2026-07-14: Removed the duplicate founder handoff screen and retained this route as a guarded redirect only.
 * ============================================================
 */

import { redirect } from "next/navigation";

import { getCurrentUser } from "@/server/services/auth.service";
import { isFounderUser } from "@/server/services/founder-admin.service";

export const dynamic = "force-dynamic";

export default async function FounderConsolePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/sign-in");
  }

  if (!isFounderUser(user)) {
    redirect("/dashboard");
  }

  redirect("/admin");
}
