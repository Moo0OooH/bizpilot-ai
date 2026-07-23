/**
 * ============================================================
 * File: app/(dashboard)/dashboard/operations/page.tsx
 * Project: BizPilot AI
 * Description: Protected Premium Operations route.
 * Role: Presents separately entitled priority search, owner-reviewed group drafts, and internal availability coordination without creating a booking or auto-send surface.
 * Related:
 * - components/dashboard/premium-operations-workspace.tsx
 * - server/services/premium-operations.service.ts
 * - server/actions/premium-operations.actions.ts
 * Author: MoOoH
 * Created: 2026-07-21
 * Last Updated: 2026-07-23
 * Change Log:
 * - 2026-07-23: Linked authorized founders from locked modules to the selected workspace Premium entitlement controls.
 * - 2026-07-21: Created the protected Premium Operations dashboard route.
 * - 2026-07-21: Localized Premium Operations route feedback from the dashboard interface locale.
 * ============================================================
 */

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { PremiumOperationsWorkspace } from "@/components/dashboard/premium-operations-workspace";
import { FlashMessage } from "@/components/dashboard/flash-message";
import { PageHeader } from "@/components/dashboard/dashboard-ui";
import {
  DASHBOARD_INTERFACE_LANGUAGE_COOKIE,
  getDashboardInterfaceCopy,
  readPremiumOperationsRouteFlashMessage,
  resolveDashboardInterfaceLanguage,
} from "@/lib/i18n/dashboard-interface";
import { getCurrentUser } from "@/server/services/auth.service";
import { getBusinessWorkspace } from "@/server/services/business.service";
import { isFounderUser } from "@/server/services/founder-admin.service";
import { getPremiumOperationsWorkspace } from "@/server/services/premium-operations.service";

type PremiumOperationsPageProps = Readonly<{
  searchParams: Promise<{ error?: string; notice?: string }>;
}>;

export default async function PremiumOperationsPage({
  searchParams,
}: PremiumOperationsPageProps) {
  const [query, user, cookieStore] = await Promise.all([
    searchParams,
    getCurrentUser(),
    cookies(),
  ]);
  if (!user) redirect("/auth/sign-in");
  const workspace = await getBusinessWorkspace({ userId: user.id });
  const business = workspace.businesses[0];
  if (!business) redirect("/dashboard");
  const canManage = workspace.memberships.some(
    (membership) =>
      membership.business_id === business.id &&
      membership.user_id === user.id &&
      membership.status === "active" &&
      (membership.role === "owner" || membership.role === "admin"),
  );

  const language = resolveDashboardInterfaceLanguage({
    cookieValue: cookieStore.get(DASHBOARD_INTERFACE_LANGUAGE_COOKIE)?.value,
  });
  const copy = getDashboardInterfaceCopy(language);
  const data = await getPremiumOperationsWorkspace({
    actorUserId: user.id,
    business,
  });
  const error = readPremiumOperationsRouteFlashMessage({
    kind: "error",
    language,
    value: query.error,
  });
  const notice = readPremiumOperationsRouteFlashMessage({
    kind: "notice",
    language,
    value: query.notice,
  });

  return (
    <main className="space-y-4">
      <PageHeader
        description={copy.premiumOperations.description}
        eyebrow={copy.common.premiumAddOn}
        title={copy.premiumOperations.title}
      />
      {notice ? <FlashMessage tone="notice">{notice}</FlashMessage> : null}
      {error ? <FlashMessage tone="error">{error}</FlashMessage> : null}
      <PremiumOperationsWorkspace
        {...(isFounderUser(user)
          ? {
              adminControlHref: `/admin?adminPanel=businesses&businessId=${encodeURIComponent(
                business.id,
              )}#premium-addons-${encodeURIComponent(business.id)}`,
            }
          : {})}
        businessLanguage={business.preferred_language}
        canManage={canManage}
        language={language}
        workspace={data}
      />
    </main>
  );
}
