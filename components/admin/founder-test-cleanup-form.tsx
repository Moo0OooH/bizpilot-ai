/**
 * ============================================================
 * File: components/admin/founder-test-cleanup-form.tsx
 * Project: BizPilot AI
 * Description: Founder-only test workspace cleanup controls.
 * Role: Provides dry-run and double-confirmed hard purge forms for non-production workspaces.
 * Author: MoOoH
 * Created: 2026-05-24
 * Last Updated: 2026-06-27
 * Change Log:
 * - 2026-06-27: Reworked cleanup warning styles to use founder admin semantic tokens.
 * ============================================================
 */

"use client";

import { useMemo, useState } from "react";

import {
  disabledButtonClass,
  inputClass,
  primaryButtonClass,
} from "@/components/dashboard/dashboard-ui";
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
    <details className="rounded-lg border border-[var(--dash-danger-border)] bg-[var(--dash-danger-soft)] p-3">
      <summary className="cursor-pointer text-sm font-black text-[var(--dash-danger-strong)]">
        Test/demo cleanup
      </summary>
      <div className="mt-3 grid gap-3">
        <div
          className={
            eligible
              ? "rounded-lg border border-[var(--dash-warning-border)] bg-[var(--dash-warning-soft)] p-3 text-[12px] leading-5 text-[var(--dash-text-secondary)]"
              : "rounded-lg border border-[var(--dash-danger-border)] bg-[var(--dash-surface)] p-3 text-[12px] leading-5 text-[var(--dash-text-secondary)]"
          }
        >
          <p
            className={
              eligible
                ? "font-black text-[var(--dash-warning-strong)]"
                : "font-black text-[var(--dash-danger-strong)]"
            }
          >
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
            className={
              eligible
                ? `${primaryButtonClass} w-full`
                : `${disabledButtonClass} w-full`
            }
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
            className={
              canPurge
                ? "inline-flex min-h-9 w-full items-center justify-center gap-2 rounded-lg border border-[var(--dash-danger-strong)] bg-[var(--dash-danger-strong)] px-3 py-2 text-[13px] font-bold leading-none text-[var(--dash-bg)] shadow-sm transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dash-danger-strong)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--dash-bg)]"
                : `${disabledButtonClass} w-full`
            }
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
