/**
 * ============================================================
 * File: app/(dashboard)/dashboard/page.tsx
 * Project: BizPilot AI
 * Description: Renders the protected Phase 2 dashboard shell.
 * Role: Verifies auth and tenant membership without adding product dashboard logic.
 * Related:
 * - server/services/auth.service.ts
 * - server/services/business.service.ts
 * - server/actions/auth.actions.ts
 * Author: MoOoH
 * Created: 2026-05-04
 * Last Updated: 2026-05-04
 * Change Log:
 * - 2026-05-04: Created protected Phase 2 dashboard shell.
 * ============================================================
 */

import { redirect } from "next/navigation";

import { signOutAction } from "@/server/actions/auth.actions";
import {
  getCurrentAccessToken,
  getCurrentUser,
} from "@/server/services/auth.service";
import { getBusinessWorkspace } from "@/server/services/business.service";

export default async function DashboardPage() {
  const [user, accessToken] = await Promise.all([
    getCurrentUser(),
    getCurrentAccessToken(),
  ]);

  if (!user || !accessToken) {
    redirect("/auth/sign-in");
  }

  const workspace = await getBusinessWorkspace({
    accessToken,
    userId: user.id,
  });

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-6 py-12">
      <div className="flex flex-col gap-6 border-b border-zinc-200 pb-8 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-normal text-zinc-500">
            BizPilot AI
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-zinc-950">
            Tenant foundation
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600">
            This protected shell confirms Phase 2 auth, profile, business, and
            membership access only. Product dashboard workflows start later.
          </p>
        </div>
        <form action={signOutAction}>
          <button
            className="border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800"
            type="submit"
          >
            Sign out
          </button>
        </form>
      </div>

      <section className="grid gap-4 py-8 sm:grid-cols-3">
        <div className="border border-zinc-200 p-4">
          <p className="text-sm text-zinc-500">Signed in as</p>
          <p className="mt-2 break-words text-sm font-medium text-zinc-950">
            {user.email ?? user.id}
          </p>
        </div>
        <div className="border border-zinc-200 p-4">
          <p className="text-sm text-zinc-500">Businesses</p>
          <p className="mt-2 text-2xl font-semibold text-zinc-950">
            {workspace.businesses.length}
          </p>
        </div>
        <div className="border border-zinc-200 p-4">
          <p className="text-sm text-zinc-500">Memberships</p>
          <p className="mt-2 text-2xl font-semibold text-zinc-950">
            {workspace.memberships.length}
          </p>
        </div>
      </section>

      <section className="border-t border-zinc-200 pt-8">
        <h2 className="text-base font-semibold text-zinc-950">Businesses</h2>
        <div className="mt-4 divide-y divide-zinc-200 border border-zinc-200">
          {workspace.businesses.length > 0 ? (
            workspace.businesses.map((business) => (
              <div
                className="flex flex-col gap-1 p-4 sm:flex-row sm:items-center sm:justify-between"
                key={business.id}
              >
                <p className="font-medium text-zinc-950">{business.name}</p>
                <p className="text-sm text-zinc-500">/{business.slug}</p>
              </div>
            ))
          ) : (
            <p className="p-4 text-sm text-zinc-600">
              No tenant business is available for this user yet.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
