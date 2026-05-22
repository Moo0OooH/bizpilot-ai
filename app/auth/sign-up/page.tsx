/**
 * ============================================================
 * File: app/auth/sign-up/page.tsx
 * Project: BizPilot AI
 * Description: Owner account creation — single centered card with two-column form on sm+.
 * Role: Production owner access aligned with Design System v1.0 §10.2.
 * Related:
 * - server/actions/auth.actions.ts
 * - components/auth/auth-ui.tsx
 * Author: MoOoH
 * Last Updated: 2026-05-19
 * Change Log:
 * - 2026-05-19: Migrated to the single-centered-card AuthShell. Fixed scale/scroll.
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
import { signUpAction } from "@/server/actions/auth.actions";

type SignUpPageProps = Readonly<{
  searchParams?: Promise<{
    error?: string;
  }>;
}>;

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const params = await searchParams;

  return (
    <AuthShell footer="Owner access for the BizPilot AI Quote Recovery workspace.">
      <AuthCard
        subtitle="Create owner access and your first business workspace."
        title="Create your workspace"
      >
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

        <form action={signUpAction} className="mt-5 grid gap-3 sm:grid-cols-2">
          <label className={authLabelClassName}>
            <span style={{ color: "var(--biz-page-text-soft)" }}>Name</span>
            <span className="relative block">
              <AuthFieldIcon type="name" />
              <input
                autoComplete="name"
                className={authInputClassName}
                name="displayName"
                placeholder="Your name"
                required
                style={{
                  backgroundColor: "rgba(255,255,255,0.04)",
                  borderColor: "var(--biz-border-medium)",
                  color: "var(--biz-page-text)",
                }}
                type="text"
              />
            </span>
          </label>
          <label className={authLabelClassName}>
            <span style={{ color: "var(--biz-page-text-soft)" }}>Business name</span>
            <span className="relative block">
              <AuthFieldIcon type="business" />
              <input
                autoComplete="organization"
                className={authInputClassName}
                name="businessName"
                placeholder="Your business"
                required
                style={{
                  backgroundColor: "rgba(255,255,255,0.04)",
                  borderColor: "var(--biz-border-medium)",
                  color: "var(--biz-page-text)",
                }}
                type="text"
              />
            </span>
          </label>
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
                autoComplete="new-password"
                className={authInputClassName}
                minLength={8}
                name="password"
                placeholder="At least 8 characters"
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

          <p
            className="rounded-[10px] border px-2.5 py-1.5 text-[11px] leading-5 sm:col-span-2"
            style={{
              backgroundColor: "rgba(23,212,146,0.10)",
              borderColor: "rgba(23,212,146,0.22)",
              color: "#17D492",
            }}
          >
            Use at least 8 characters for your password.
          </p>

          <div className="sm:col-span-2">
            <AuthSubmitButton pendingLabel="Creating workspace…">
              Create account
            </AuthSubmitButton>
          </div>
        </form>

        <p
          className="mt-4 text-center text-[13px]"
          style={{ color: "var(--biz-page-text-soft)" }}
        >
          Already have an account?{" "}
          <Link
            className="font-bold underline-offset-4 hover:underline"
            href="/auth/sign-in"
            style={{ color: "#17D492" }}
          >
            Sign in
          </Link>
        </p>
      </AuthCard>
    </AuthShell>
  );
}
