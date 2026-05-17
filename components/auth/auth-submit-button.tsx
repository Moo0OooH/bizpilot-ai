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
 * Last Updated: 2026-05-12
 * Change Log:
 * - 2026-05-12: Created shared auth submit button with form pending state.
 * - 2026-05-12: Tightened button radius and loading behavior for auth QA.
 * - 2026-05-12: Reduced auth button height for compact 100% zoom layouts.
 * - 2026-05-12: Standardized production auth CTA scale and focus treatment.
 * - 2026-05-12: Added quiet premium depth to the slate auth CTA.
 * ============================================================
 */

"use client";

import { useFormStatus } from "react-dom";

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
      className="h-12 w-full rounded-xl bg-[var(--biz-primary)] px-4 text-sm font-semibold text-white shadow-[0_10px_22px_rgba(4,120,87,0.18)] transition hover:bg-[var(--biz-primary-hover)] focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-white/80"
      disabled={pending}
      type="submit"
    >
      {pending ? pendingLabel : children}
    </button>
  );
}
