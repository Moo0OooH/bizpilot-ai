/**
 * ============================================================
 * File: app/(dashboard)/layout.tsx
 * Project: BizPilot AI
 * Description: Wraps protected dashboard routes in the shared application shell.
 * Role: Owns authenticated dashboard frame, business context, and shared navigation.
 * Related:
 * - components/dashboard/dashboard-shell.tsx
 * - server/services/auth.service.ts
 * - server/services/business.service.ts
 * Author: MoOoH
 * Created: 2026-05-02
 * Last Updated: 2026-05-10
 * Change Log:
 * - 2026-05-04: Added standard project file header.
 * - 2026-05-10: Promoted route-group layout into reusable protected app shell.
 * ============================================================
 */

import { redirect } from "next/navigation";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { getCurrentUser } from "@/server/services/auth.service";
import { getBusinessWorkspace } from "@/server/services/business.service";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/sign-in");
  }

  const workspace = await getBusinessWorkspace({
    userId: user.id,
  });
  const activeBusiness = workspace.businesses[0];

  if (!activeBusiness) {
    return children;
  }

  return (
    <DashboardShell
      activeBusinessName={activeBusiness.name}
      businessSlug={activeBusiness.slug}
      userLabel={user.email ?? user.id}
    >
      {children}
    </DashboardShell>
  );
}
