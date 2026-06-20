"use client";

/**
 * ============================================================
 * File: components/auth/auth-password-field.tsx
 * Project: BizPilot AI
 * Description: Password input with accessible visibility control.
 * Role: Keeps auth password fields password-manager friendly while replacing decorative key/lock icons.
 * Related:
 * - components/auth/auth-ui.tsx
 * - app/auth/sign-in/page.tsx
 * - app/auth/sign-up/page.tsx
 * - app/auth/reset-password/reset-password-form.tsx
 * Author: MoOoH
 * Created: 2026-06-19
 * Last Updated: 2026-06-19
 * Change Log:
 * - 2026-06-19: Added conventional password visibility toggle for auth forms.
 * ============================================================
 */

import { useState } from "react";
import type { ReactNode } from "react";

import type { BizPilotCopy } from "@/lib/i18n/bizpilot-copy";

import { authLabelClassName } from "./auth-ui";

type AuthPasswordFieldProps = Readonly<{
  action?: ReactNode;
  autoComplete: "current-password" | "new-password";
  copy: BizPilotCopy["auth"];
  label: string;
  minLength: number;
  name: string;
}>;

export function AuthPasswordField({
  action,
  autoComplete,
  copy,
  label,
  minLength,
  name,
}: AuthPasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <label className={authLabelClassName}>
      <span className="flex items-center justify-between gap-3">
        <span style={{ color: "var(--biz-page-text-soft)" }}>{label}</span>
        {action}
      </span>
      <span className="relative block">
        <input
          autoComplete={autoComplete}
          className="h-11 w-full rounded-[12px] border px-3 pr-20 text-[14px] outline-none transition placeholder:opacity-50 focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--focus-ring)]"
          minLength={minLength}
          name={name}
          placeholder={label}
          required
          style={{
            backgroundColor: "var(--surface)",
            borderColor: "var(--biz-border-medium)",
            color: "var(--biz-page-text)",
          }}
          type={visible ? "text" : "password"}
        />
        <button
          aria-label={visible ? copy.hidePassword : copy.showPassword}
          className="absolute right-1.5 top-1/2 inline-flex h-8 min-w-14 -translate-y-1/2 items-center justify-center rounded-[10px] px-2 text-[11px] font-black transition hover:bg-[var(--surface-interactive)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--focus-ring)]"
          onClick={() => setVisible((current) => !current)}
          style={{ color: "var(--primary)" }}
          type="button"
        >
          {visible ? copy.hidePasswordShort : copy.showPasswordShort}
        </button>
      </span>
    </label>
  );
}
