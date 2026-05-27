/**
 * ============================================================
 * File: components/admin/founder-auth-user-delete-form.tsx
 * Project: BizPilot AI
 * Description: Founder-only fake/test auth user deletion control.
 * Role: Adds double-confirmed auth identity cleanup for safe test accounts.
 * Author: MoOoH
 * Created: 2026-05-24
 * Last Updated: 2026-05-24
 * ============================================================
 */

"use client";

import { useMemo, useState } from "react";

import { inputClass } from "@/components/dashboard/dashboard-ui";
import {
  FOUNDER_TEST_AUTH_USER_DELETE_ACKNOWLEDGEMENT,
  isExactAuthUserDeleteConfirmation,
} from "@/lib/founder-cleanup/auth-user-deletion";
import { founderTestAuthUserDeleteAction } from "@/server/actions/founder-admin.actions";

export function FounderAuthUserDeleteForm({
  deletionBlockedReason,
  targetEmail,
  targetUserId,
}: Readonly<{
  deletionBlockedReason: string | null;
  targetEmail: string | null;
  targetUserId: string;
}>) {
  const [acknowledged, setAcknowledged] = useState(false);
  const [finalConfirmed, setFinalConfirmed] = useState(false);
  const [productionReclassification, setProductionReclassification] =
    useState(false);
  const [typedConfirmation, setTypedConfirmation] = useState("");
  const confirmationLabel = targetEmail ?? targetUserId;
  const canOverrideProductionBlock =
    deletionBlockedReason ===
      "Auth user deletion is blocked for production workspaces." ||
    deletionBlockedReason ===
      "Auth user deletion is blocked until linked workspaces are marked as test, demo, or seed.";
  const canDelete = useMemo(
    () =>
      (!deletionBlockedReason ||
        (canOverrideProductionBlock && productionReclassification)) &&
      acknowledged &&
      finalConfirmed &&
      isExactAuthUserDeleteConfirmation({
        targetEmail,
        targetUserId,
        typedConfirmation,
      }),
    [
      acknowledged,
      canOverrideProductionBlock,
      deletionBlockedReason,
      finalConfirmed,
      productionReclassification,
      targetEmail,
      targetUserId,
      typedConfirmation,
    ],
  );

  return (
    <details
      className="rounded-lg border border-[rgba(185,28,28,0.22)] bg-[var(--dash-surface)] p-3 text-[var(--dash-text)] shadow-sm"
      open={!deletionBlockedReason}
    >
      <summary className="cursor-pointer text-[12px] font-black text-[var(--dash-text)]">
        {deletionBlockedReason
          ? "Fake/test login deletion blocked"
          : "Delete fake/test login"}
      </summary>
      <form action={founderTestAuthUserDeleteAction} className="mt-3 grid gap-3">
        <input name="targetUserId" type="hidden" value={targetUserId} />
        <input name="cleanupMode" type="hidden" value="test_auth_user_delete" />
        <div className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-2 text-[12px] leading-5 text-[var(--dash-text-secondary)]">
          <p className="font-black text-[var(--dash-text)]">
            Fake/test login deletion also removes owned non-production workspaces.
          </p>
          <p className="mt-1">
            The server keeps founder and production-customer accounts blocked,
            purges owned Founder test, Demo, or Seed workspaces first, then calls
            Supabase Auth deletion.
          </p>
        </div>
        {deletionBlockedReason ? (
          <div className="rounded-lg border border-[rgba(185,28,28,0.28)] bg-[rgba(254,242,242,0.86)] p-2 text-[12px] leading-5 text-[#991b1b] dark:bg-[rgba(127,29,29,0.2)] dark:text-red-200">
            <p className="font-black">Deletion is blocked by the safety rail.</p>
            <p className="mt-1 font-semibold">{deletionBlockedReason}</p>
            {canOverrideProductionBlock ? (
              <label className="mt-2 flex gap-2 font-semibold text-[var(--dash-text-secondary)]">
                <input
                  checked={productionReclassification}
                  className="mt-1"
                  name="productionWorkspaceReclassificationAcknowledgement"
                  onChange={(event) =>
                    setProductionReclassification(event.currentTarget.checked)
                  }
                  type="checkbox"
                />
                <span>
                  This is fake/test data. Reclassify owned production-marked
                  workspaces to Founder test, then delete this login.
                </span>
              </label>
            ) : (
              <p className="mt-1 font-semibold">
                Mark the workspace as Founder test, Demo, or Seed when safe,
                then run cleanup before deleting the login.
              </p>
            )}
          </div>
        ) : null}
        <label className="flex gap-2 text-[12px] leading-5 text-[var(--dash-text-secondary)]">
          <input
            checked={acknowledged}
            className="mt-1"
            name="authUserDeleteAcknowledgement"
            onChange={(event) => setAcknowledged(event.currentTarget.checked)}
            type="checkbox"
          />
          <span>{FOUNDER_TEST_AUTH_USER_DELETE_ACKNOWLEDGEMENT}</span>
        </label>
        <label className="grid gap-1.5 text-sm font-semibold text-[var(--dash-text)]">
          Type exact email or user ID
          <span className="break-all text-[12px] font-bold text-[var(--dash-text-muted)]">
            {confirmationLabel}
          </span>
          <input
            className={inputClass}
            name="authUserDeleteConfirmation"
            onChange={(event) => setTypedConfirmation(event.currentTarget.value)}
            value={typedConfirmation}
          />
        </label>
        <label className="flex gap-2 text-[12px] leading-5 text-[var(--dash-text-secondary)]">
          <input
            checked={finalConfirmed}
            className="mt-1"
            name="authUserDeleteFinalConfirmation"
            onChange={(event) => setFinalConfirmed(event.currentTarget.checked)}
            type="checkbox"
          />
          <span>Final confirm: delete this fake/test login now.</span>
        </label>
        <button
          className="inline-flex min-h-9 items-center justify-center gap-2 rounded-lg border border-red-700 bg-red-700 px-3 py-2 text-[13px] font-bold leading-none text-white shadow-sm transition hover:bg-red-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-700 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--dash-bg)] disabled:cursor-not-allowed disabled:border-[var(--dash-border)] disabled:bg-[var(--dash-surface-muted)] disabled:text-[var(--dash-text-muted)] disabled:shadow-none disabled:hover:bg-[var(--dash-surface-muted)]"
          disabled={!canDelete}
          type="submit"
        >
          Delete auth login
        </button>
      </form>
    </details>
  );
}
