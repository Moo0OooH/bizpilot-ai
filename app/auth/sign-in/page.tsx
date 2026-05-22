/**
 * ============================================================
 * File: app/auth/sign-in/page.tsx
 * Project: BizPilot AI
 * Description: Owner sign-in screen — single centered card.
 * Role: Production owner access aligned with Design System v1.0 §10.2.
 * Related:
 * - server/actions/auth.actions.ts
 * - components/auth/auth-ui.tsx
 * Author: MoOoH
 * Last Updated: 2026-05-19
 * Change Log:
 * - 2026-05-19: Migrated to the single-centered-card AuthShell. Fixes scale/scroll issues from the previous split layout.
 * ============================================================
 */

import Link from "next/link";

import { AuthSubmitButton } from "@/components/auth/auth-submit-button";
import {
  AuthCard,
  AuthFieldIcon,
  AuthShell,
  authInputClassName,
  authLabelClassName,
} from "@/components/auth/auth-ui";
import { signInAction } from "@/server/actions/auth.actions";

type SignInPageProps = Readonly<{
  searchParams?: Promise<{
    error?: string;
    notice?: string;
  }>;
}>;

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const params = await searchParams;

  return (
    <AuthShell footer="Secure owner access for your Quote Recovery workspace.">
      <AuthCard
        subtitle="Manage quote requests, replies, and follow-ups from one place."
        title="Sign in"
      >
        {params?.notice ? (
          <p
            aria-live="polite"
            className="mt-5 rounded-[12px] border px-3 py-2 text-[13px] leading-5"
            style={{
              backgroundColor: "rgba(23,212,146,0.10)",
              borderColor: "rgba(23,212,146,0.22)",
              color: "#17D492",
            }}
          >
            {params.notice}
          </p>
        ) : null}

        {params?.error ? (
          <p
            aria-live="assertive"
            className="mt-5 rounded-[12px] border px-3 py-2 text-[13px] leading-5"
            style={{
              backgroundColor: "rgba(255,92,92,0.10)",
              borderColor: "rgba(255,92,92,0.22)",
              color: "#FFB4B4",
            }}
          >
            {params.error}
          </p>
        ) : null}

        <form action={signInAction} className="mt-5 space-y-3.5">
          <label className={authLabelClassName}>
            <span style={{ color: "var(--biz-page-text-soft)" }}>Email</span>
            <span className="relative block">
              <AuthFieldIcon type="email" />
              <input
                autoComplete="email"
                className={authInputClassName}
                name="email"
                placeholder="you@example.com"
                required
                style={{
                  backgroundColor: "rgba(255,255,255,0.04)",
                  borderColor: "var(--biz-border-medium)",
                  color: "var(--biz-page-text)",
                }}
                type="email"
              />
            </span>
          </label>

          <label className={authLabelClassName}>
            <span style={{ color: "var(--biz-page-text-soft)" }}>Password</span>
            <span className="relative block">
              <AuthFieldIcon type="password" />
              <input
                autoComplete="current-password"
                className={authInputClassName}
                minLength={6}
                name="password"
                placeholder="Enter your password"
                required
                style={{
                  backgroundColor: "rgba(255,255,255,0.04)",
                  borderColor: "var(--biz-border-medium)",
                  color: "var(--biz-page-text)",
                }}
                type="password"
              />
            </span>
          </label>

          <AuthSubmitButton pendingLabel="Opening workspace…">
            Sign in
          </AuthSubmitButton>
        </form>

        <p
          className="mt-4 text-center text-[13px]"
          style={{ color: "var(--biz-page-text-soft)" }}
        >
          Need an account?{" "}
          <Link
            className="font-bold underline-offset-4 hover:underline"
            href="/auth/sign-up"
            style={{ color: "#17D492" }}
          >
            Create one
          </Link>
        </p>
      </AuthCard>
    </AuthShell>
  );
}
