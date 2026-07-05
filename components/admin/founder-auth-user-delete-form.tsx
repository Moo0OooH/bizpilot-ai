/**
 * ============================================================
 * File: components/admin/founder-auth-user-delete-form.tsx
 * Project: BizPilot AI
 * Description: Founder-only synthetic/test auth login cleanup control.
 * Role: Adds double-confirmed auth identity cleanup for safe test accounts while explaining production protection.
 * Related:
 * - app/admin/page.tsx
 * - lib/founder-cleanup/auth-user-deletion.ts
 * - server/actions/founder-admin.actions.ts
 * Author: MoOoH
 * Created: 2026-05-24
 * Last Updated: 2026-07-05
 * Change Log:
 * - 2026-07-05: Reframed blocked auth deletion as professional account-safety copy.
 * ============================================================
 */

"use client";

import { useMemo, useState } from "react";

import { inputClass, StatusBadge } from "@/components/dashboard/dashboard-ui";
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

  if (deletionBlockedReason) {
    return (
      <details className="rounded-lg border border-[var(--dash-warning-border)] bg-[var(--dash-surface)] p-3 text-[var(--dash-text)]">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-[12px] font-black text-[var(--dash-text)] [&::-webkit-details-marker]:hidden">
          <span>Login cleanup protection</span>
          <StatusBadge tone="amber">Protected</StatusBadge>
        </summary>
        <div className="mt-3 grid gap-3">
          <div className="rounded-lg border border-[var(--dash-warning-border)] bg-[var(--dash-warning-soft)] p-3 text-[12px] leading-5">
            <p className="font-black text-[var(--dash-warning-strong)]">
              Production-linked login cannot be removed here.
            </p>
            <p className="mt-1 font-semibold text-[var(--dash-text)]">
              {deletionBlockedReason}
            </p>
            <p className="mt-2 text-[var(--dash-text-secondary)]">
              Keep this account protected until the workspace is confirmed
              non-production. If it is synthetic test data, reclassify the
              workspace to Founder test, Demo, or Seed with a note, run
              workspace cleanup, then return to login cleanup.
            </p>
          </div>
          <dl className="grid gap-2 text-[12px] sm:grid-cols-2">
            <div className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface)] px-3 py-2">
              <dt className="font-bold text-[var(--dash-text-muted)]">
                Target
              </dt>
              <dd className="mt-0.5 break-all font-black text-[var(--dash-text)]">
                {confirmationLabel}
              </dd>
            </div>
            <div className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface)] px-3 py-2">
              <dt className="font-bold text-[var(--dash-text-muted)]">
                Available action
              </dt>
              <dd className="mt-0.5 font-black text-[var(--dash-text)]">
                Confirm workspace kind first
              </dd>
            </div>
          </dl>
        </div>
      </details>
    );
  }

  return (
    <details
      className="rounded-lg border border-[rgba(185,28,28,0.22)] bg-[var(--dash-surface)] p-3 text-[var(--dash-text)] shadow-sm"
      open
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-[12px] font-black text-[var(--dash-text)] [&::-webkit-details-marker]:hidden">
        <span>Synthetic/test login cleanup</span>
        <StatusBadge tone="red">Double confirm</StatusBadge>
      </summary>
      <form action={founderTestAuthUserDeleteAction} className="mt-3 grid gap-3">
        <input name="targetUserId" type="hidden" value={targetUserId} />
        <input name="cleanupMode" type="hidden" value="test_auth_user_delete" />
        <div className="rounded-lg border border-[var(--dash-border)] bg-[var(--dash-surface-muted)] p-2 text-[12px] leading-5 text-[var(--dash-text-secondary)]">
          <p className="font-black text-[var(--dash-text)]">
            Synthetic/test login cleanup also removes owned non-production workspaces.
          </p>
          <p className="mt-1">
            The server keeps founder and customer-protected accounts blocked,
            purges owned Founder test, Demo, or Seed workspaces first, then calls
            Supabase Auth deletion.
          </p>
        </div>
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
          <span>Final confirm: remove this synthetic/test login now.</span>
        </label>
        <button
          className="inline-flex min-h-9 items-center justify-center gap-2 rounded-lg border border-red-700 bg-red-700 px-3 py-2 text-[13px] font-bold leading-none text-white shadow-sm transition hover:bg-red-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-700 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--dash-bg)] disabled:cursor-not-allowed disabled:border-[var(--dash-border)] disabled:bg-[var(--dash-surface-muted)] disabled:text-[var(--dash-text-muted)] disabled:shadow-none disabled:hover:bg-[var(--dash-surface-muted)]"
          disabled={!canDelete}
          type="submit"
        >
          Remove auth login
        </button>
      </form>
    </details>
  );
}
