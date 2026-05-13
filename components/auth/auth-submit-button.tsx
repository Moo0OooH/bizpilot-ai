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
      className="h-11 w-full rounded-[10px] bg-slate-950 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-950/20 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-white/80"
      disabled={pending}
      type="submit"
    >
      {pending ? pendingLabel : children}
    </button>
  );
}
