/**
 * ============================================================
 * File: components/admin/founder-test-cleanup-form.tsx
 * Project: BizPilot AI
 * Description: Founder-only test workspace cleanup controls.
 * Role: Provides dry-run and double-confirmed hard purge forms for non-production workspaces.
 * Author: MoOoH
 * Created: 2026-05-24
 * Last Updated: 2026-05-24
 * ============================================================
 */

"use client";

import { useMemo, useState } from "react";

import { inputClass, primaryButtonClass } from "@/components/dashboard/dashboard-ui";
import {
  FOUNDER_TEST_CLEANUP_ACKNOWLEDGEMENT,
  isCleanupEligibleWorkspaceKind,
  normalizeFounderCleanupConfirmation,
  type CleanupWorkspaceKind,
} from "@/lib/founder-cleanup/confirmation";
import {
  founderCleanupDryRunAction,
  founderTestWorkspaceCleanupAction,
} from "@/server/actions/founder-admin.actions";

export function FounderTestCleanupForm({
  businessId,
  businessName,
  businessSlug,
  dryRunAvailable,
  workspaceKind,
}: Readonly<{
  businessId: string;
  businessName: string;
  businessSlug: string;
  dryRunAvailable: boolean;
  workspaceKind: CleanupWorkspaceKind;
}>) {
  const [acknowledged, setAcknowledged] = useState(false);
  const [finalConfirmed, setFinalConfirmed] = useState(false);
  const [typedConfirmation, setTypedConfirmation] = useState("");
  const eligible = isCleanupEligibleWorkspaceKind(workspaceKind);
  const workspaceKindLabel = workspaceKind.replaceAll("_", " ");
  const canPurge = useMemo(() => {
    const typed = normalizeFounderCleanupConfirmation(typedConfirmation);

    return (
      eligible &&
      dryRunAvailable &&
      acknowledged &&
      finalConfirmed &&
      (typed === normalizeFounderCleanupConfirmation(businessName) ||
        typed === normalizeFounderCleanupConfirmation(businessSlug))
    );
  }, [
    acknowledged,
    businessName,
    businessSlug,
    dryRunAvailable,
    eligible,
    finalConfirmed,
    typedConfirmation,
  ]);

  return (
    <details className="rounded-[14px] border border-red-400/25 bg-red-500/10 p-3">
      <summary className="cursor-pointer text-sm font-black text-red-700 dark:text-red-200">
        Test/demo cleanup
      </summary>
      <div className="mt-3 grid gap-3">
        <div
          className={
            eligible
              ? "rounded-[10px] border border-amber-400/25 bg-amber-500/10 p-2 text-[12px] leading-5 text-[var(--dash-text-secondary)]"
              : "rounded-[10px] border border-red-400/25 bg-red-500/10 p-2 text-[12px] leading-5 text-red-200"
          }
        >
          <p className="font-black">
            Workspace kind: {workspaceKindLabel}
          </p>
          <p className="mt-1 font-semibold">
            {eligible
              ? "Cleanup is still blocked until a dry-run is complete and the exact business name or slug is typed."
              : "Hard purge is blocked for production_customer workspaces. Mark a workspace as Founder test, Demo, or Seed only after confirming it contains fake data."}
          </p>
          <p className="mt-1">
            Workspace cleanup never deletes Supabase Auth users; fake/test login
            deletion is a separate control and requires its own confirmation.
          </p>
        </div>
        <form action={founderCleanupDryRunAction}>
          <input name="businessId" type="hidden" value={businessId} />
          <button
            className={`${primaryButtonClass} w-full`}
            disabled={!eligible}
            type="submit"
          >
            {eligible ? "Dry run cleanup" : "Dry run blocked for production"}
          </button>
        </form>
        <form action={founderTestWorkspaceCleanupAction} className="grid gap-3">
          <input name="businessId" type="hidden" value={businessId} />
          <input name="cleanupMode" type="hidden" value="test_hard_purge" />
          {dryRunAvailable ? (
            <input
              name="dryRunConfirmedBusinessId"
              type="hidden"
              value={businessId}
            />
          ) : null}
          {!dryRunAvailable ? (
            <p className="rounded-[10px] border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-2 text-[12px] font-bold text-[var(--dash-text-secondary)]">
              Run dry-run before final cleanup is enabled.
            </p>
          ) : null}
          <label className="flex gap-2 text-[12px] leading-5 text-[var(--dash-text-secondary)]">
            <input
              checked={acknowledged}
              className="mt-1"
              name="cleanupAcknowledgement"
              onChange={(event) => setAcknowledged(event.currentTarget.checked)}
              type="checkbox"
            />
            <span>{FOUNDER_TEST_CLEANUP_ACKNOWLEDGEMENT}</span>
          </label>
          <label className="grid gap-1.5 text-sm font-semibold text-[var(--dash-text)]">
            Type exact business name or slug
            <span className="text-[12px] font-bold text-[var(--dash-text-muted)]">
              {businessName} or {businessSlug}
            </span>
            <input
              className={inputClass}
              name="cleanupConfirmation"
              onChange={(event) => setTypedConfirmation(event.currentTarget.value)}
              value={typedConfirmation}
            />
          </label>
          <label className="flex gap-2 text-[12px] leading-5 text-[var(--dash-text-secondary)]">
            <input
              checked={finalConfirmed}
              className="mt-1"
              name="cleanupFinalConfirmation"
              onChange={(event) => setFinalConfirmed(event.currentTarget.checked)}
              type="checkbox"
            />
            <span>Final confirm: purge this test/demo/seed workspace now.</span>
          </label>
          <button
            className={`${primaryButtonClass} border-red-400/40 bg-red-600 text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-45`}
            disabled={!canPurge}
            type="submit"
          >
            Hard purge test workspace
          </button>
        </form>
      </div>
    </details>
  );
}
