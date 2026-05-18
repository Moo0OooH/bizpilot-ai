/**
 * ============================================================
 * File: components/auth/auth-submit-button.tsx
 * Project: BizPilot AI
 * Description: Provides a pending-aware submit button for auth forms.
 * Role: Keeps auth loading copy user-facing without changing auth logic.
 * Related:
 * - app/auth/sign-in/page.tsx
 * - app/auth/sign-up/page.tsx
 * Author: MoOoH
 * Created: 2026-05-12
 * Last Updated: 2026-05-18
 * Change Log:
 * - 2026-05-12: Created shared auth submit button with form pending state.
 * - 2026-05-12: Tightened button radius and loading behavior for auth QA.
 * - 2026-05-12: Reduced auth button height for compact 100% zoom layouts.
 * - 2026-05-12: Standardized production auth CTA scale and focus treatment.
 * - 2026-05-12: Added quiet premium depth to the slate auth CTA.
 * - 2026-05-18: Connected the submit button to shared BizPilot design tokens.
 * ============================================================
 */

"use client";

import { useFormStatus } from "react-dom";

import { bizTheme } from "@/lib/design-tokens";

type AuthSubmitButtonProps = Readonly<{
  children: string;
  pendingLabel: string;
}>;

export function AuthSubmitButton({
  children,
  pendingLabel,
}: AuthSubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      className={`${bizTheme.buttonPrimary} h-11 w-full disabled:cursor-not-allowed disabled:opacity-65`}
      disabled={pending}
      type="submit"
    >
      {pending ? pendingLabel : children}
    </button>
  );
}
