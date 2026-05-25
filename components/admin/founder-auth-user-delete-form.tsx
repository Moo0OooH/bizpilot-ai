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

import { inputClass, primaryButtonClass } from "@/components/dashboard/dashboard-ui";
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
  const [typedConfirmation, setTypedConfirmation] = useState("");
  const confirmationLabel = targetEmail ?? targetUserId;
  const canDelete = useMemo(
    () =>
      !deletionBlockedReason &&
      acknowledged &&
      finalConfirmed &&
      isExactAuthUserDeleteConfirmation({
        targetEmail,
        targetUserId,
        typedConfirmation,
      }),
    [
      acknowledged,
      deletionBlockedReason,
      finalConfirmed,
      targetEmail,
      targetUserId,
      typedConfirmation,
    ],
  );

  return (
    <details
      className="rounded-[14px] border border-red-400/25 bg-red-500/10 p-3"
      open={!deletionBlockedReason}
    >
      <summary className="cursor-pointer text-[12px] font-black text-red-700 dark:text-red-200">
        {deletionBlockedReason
          ? "Fake/test login deletion blocked"
          : "Delete fake/test login"}
      </summary>
      <form action={founderTestAuthUserDeleteAction} className="mt-3 grid gap-3">
        <input name="targetUserId" type="hidden" value={targetUserId} />
        <input name="cleanupMode" type="hidden" value="test_auth_user_delete" />
        <div className="rounded-[10px] border border-amber-400/25 bg-amber-500/10 p-2 text-[12px] leading-5 text-[var(--dash-text-secondary)]">
          <p className="font-black text-[var(--dash-text)]">
            Auth login deletion is separate from workspace cleanup.
          </p>
          <p className="mt-1">
            The server writes the audit action before calling Supabase Auth
            deletion, so a missing production `0020` constraint blocks the action
            before the identity is deleted.
          </p>
        </div>
        {deletionBlockedReason ? (
          <div className="rounded-[10px] border border-red-400/25 bg-red-500/10 p-2 text-[12px] leading-5 text-red-200">
            <p className="font-black">{deletionBlockedReason}</p>
            <p className="mt-1 font-semibold">
              For fake accounts linked to fake data, first mark the workspace as
              Founder test, Demo, or Seed when safe, then run test/demo cleanup or
              transfer owned workspaces before deleting the login.
            </p>
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
          className={`${primaryButtonClass} border-red-400/40 bg-red-600 text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-45`}
          disabled={!canDelete}
          type="submit"
        >
          Delete auth login
        </button>
      </form>
    </details>
  );
}
