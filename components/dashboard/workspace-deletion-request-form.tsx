/**
 * ============================================================
 * File: components/dashboard/workspace-deletion-request-form.tsx
 * Project: BizPilot AI
 * Description: Client-side double confirmation form for workspace deletion requests.
 * Role: Keeps the final request button disabled until the owner confirms intent.
 * Related:
 * - app/(dashboard)/dashboard/settings/page.tsx
 * - server/actions/business-deletion.actions.ts
 * Author: MoOoH
 * Created: 2026-05-24
 * Last Updated: 2026-05-24
 * ============================================================
 */

"use client";

import { useMemo, useState } from "react";

import { inputClass, primaryButtonClass } from "@/components/dashboard/dashboard-ui";
import { requestBusinessDeletionAction } from "@/server/actions/business-deletion.actions";

type WorkspaceDeletionFormCopy = Readonly<{
  acknowledgement: string;
  body: string;
  dangerZone: string;
  dataNotice: string;
  submit: string;
  title: string;
  typeBusinessName: string;
}>;

function normalizeConfirmation(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

export function WorkspaceDeletionRequestForm({
  businessId,
  businessName,
  copy,
}: Readonly<{
  businessId: string;
  businessName: string;
  copy: WorkspaceDeletionFormCopy;
}>) {
  const [acknowledged, setAcknowledged] = useState(false);
  const [typedName, setTypedName] = useState("");
  const canSubmit = useMemo(
    () =>
      acknowledged &&
      normalizeConfirmation(typedName) === normalizeConfirmation(businessName),
    [acknowledged, businessName, typedName],
  );

  return (
    <details className="rounded-lg border border-red-400/30 bg-red-500/10 p-4">
      <summary className="cursor-pointer text-sm font-black text-red-700 dark:text-red-200">
        {copy.dangerZone}
      </summary>
      <form action={requestBusinessDeletionAction} className="mt-4 grid gap-3">
        <input name="businessId" type="hidden" value={businessId} />
        <div className="rounded-lg border border-red-400/25 bg-[var(--dash-surface-muted)] p-3 text-[13px] leading-6 text-[var(--dash-text-secondary)]">
          <p className="font-black text-[var(--dash-text)]">
            {copy.title}
          </p>
          <p className="mt-1">
            {copy.body}
          </p>
          <p className="mt-2">
            {copy.dataNotice}
          </p>
        </div>
        <label className="flex gap-2 text-[13px] leading-5 text-[var(--dash-text-secondary)]">
          <input
            checked={acknowledged}
            className="mt-1"
            name="deletionAcknowledgement"
            onChange={(event) => setAcknowledged(event.currentTarget.checked)}
            type="checkbox"
          />
          <span>{copy.acknowledgement}</span>
        </label>
        <label className="grid gap-1.5 text-sm font-semibold text-[var(--dash-text)]">
          {copy.typeBusinessName}
          <span className="text-[12px] font-bold text-[var(--dash-text-muted)]">
            {businessName}
          </span>
          <input
            className={inputClass}
            name="businessNameConfirmation"
            onChange={(event) => setTypedName(event.currentTarget.value)}
            value={typedName}
          />
        </label>
        <button
          className={`${primaryButtonClass} border-red-400/40 bg-red-600 text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-45`}
          disabled={!canSubmit}
          type="submit"
        >
          {copy.submit}
        </button>
      </form>
    </details>
  );
}
