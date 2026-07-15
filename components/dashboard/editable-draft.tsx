"use client";

/**
 * ============================================================
 * File: components/dashboard/editable-draft.tsx
 * Project: BizPilot AI
 * Description: Interactive owner-reviewed AI draft editor.
 * Role: Lets an owner safely edit a generated draft locally before copying it, without implying an in-product send action.
 * Related:
 * - app/(dashboard)/dashboard/leads/[leadId]/page.tsx
 * - components/dashboard/copy-button.tsx
 * Author: MoOoH
 * Created: 2026-07-14
 * Last Updated: 2026-07-14
 * Change Log:
 * - 2026-07-14: Replaced the lead-detail no-op edit control with a functional local draft editor.
 * ============================================================
 */

import { useState } from "react";

import { CopyButton } from "./copy-button";
import { buttonClass, textareaClass } from "./dashboard-ui";

type EditableDraftProps = Readonly<{
  copyFailedLabel: string;
  copyLabel: string;
  copySuccessLabel: string;
  doneLabel: string;
  editLabel: string;
  editTitle: string;
  initialValue: string;
}>;

export function EditableDraft({
  copyFailedLabel,
  copyLabel,
  copySuccessLabel,
  doneLabel,
  editLabel,
  editTitle,
  initialValue,
}: EditableDraftProps) {
  const [draft, setDraft] = useState(initialValue);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="mt-3">
      {isEditing ? (
        <textarea
          aria-label={editTitle}
          autoFocus
          className={`${textareaClass} min-h-44 resize-y`}
          onChange={(event) => setDraft(event.target.value)}
          value={draft}
        />
      ) : (
        <div className="biz-draft-box max-h-[18rem] overflow-y-auto whitespace-pre-wrap font-sans">
          {draft}
        </div>
      )}

      <div className="mt-3 flex flex-wrap gap-2">
        <CopyButton
          failedLabel={copyFailedLabel}
          label={copyLabel}
          successLabel={copySuccessLabel}
          value={draft}
        />
        <button
          aria-pressed={isEditing}
          className={buttonClass}
          onClick={() => setIsEditing((current) => !current)}
          title={editTitle}
          type="button"
        >
          {isEditing ? doneLabel : editLabel}
        </button>
      </div>
    </div>
  );
}
