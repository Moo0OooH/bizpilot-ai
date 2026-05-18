/**
 * ============================================================
 * File: app/auth/sign-in/page.tsx
 * Project: BizPilot AI
 * Description: Renders the owner sign-in page for the quote recovery workspace.
 * Role: Provides a polished owner login entry point without product dashboard logic.
 * Related:
 * - server/actions/auth.actions.ts
 * - app/auth/sign-up/page.tsx
 * Author: MoOoH
 * Created: 2026-05-04
 * Last Updated: 2026-05-18
 * Change Log:
 * - 2026-05-04: Created Phase 2 sign-in page.
 * - 2026-05-11: Polished owner login UI and replaced internal-facing copy.
 * - 2026-05-12: Expanded the sign-in page into a production-ready owner access screen.
 * - 2026-05-12: Tightened auth form copy, states, and layout to match UI/UX standards.
 * - 2026-05-12: Standardized final production auth card scale and brand accents.
 * - 2026-05-18: Applied the shared BizPilot dark landing theme to sign-in.
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
    <AuthShell
      cardWidthClassName="max-w-full sm:max-w-[540px]"
      footer="Secure owner access for your quote recovery workspace."
    >
      <AuthCard
        subtitle="Manage quote requests, replies, and follow-ups from one place."
        title="Sign in to your workspace"
      >
        {params?.notice ? (
          <p
            aria-live="polite"
            className="mt-5 rounded-xl border border-[#17D492]/20 bg-[#17D492]/10 px-3 py-2 text-sm leading-5 text-[#17D492]"
          >
            {params.notice}
          </p>
        ) : null}

        {params?.error ? (
          <p
            aria-live="assertive"
            className="mt-5 rounded-xl border border-[#FF5C5C]/22 bg-[#FF5C5C]/10 px-3 py-2 text-sm leading-5 text-[#FFB4B4]"
          >
            {params.error}
          </p>
        ) : null}

        <form action={signInAction} className="mt-5 space-y-4">
          <label className={authLabelClassName}>
            Email
            <span className="relative block">
              <AuthFieldIcon type="email" />
              <input
                autoComplete="email"
                className={authInputClassName}
                name="email"
                placeholder="you@example.com"
                required
                type="email"
              />
            </span>
          </label>

          <label className={authLabelClassName}>
            Password
            <span className="relative block">
              <AuthFieldIcon type="password" />
              <input
                autoComplete="current-password"
                className={authInputClassName}
                minLength={6}
                name="password"
                placeholder="Enter your password"
                required
                type="password"
              />
            </span>
          </label>

          <AuthSubmitButton pendingLabel="Opening workspace...">
            Sign in
          </AuthSubmitButton>
        </form>

        <p className="mt-4 text-center text-sm text-[rgba(245,247,250,0.62)]">
          Need an account?{" "}
          <Link
            className="font-semibold text-[#17D492] underline-offset-4 hover:underline"
            href="/auth/sign-up"
          >
            Create one
          </Link>
        </p>
      </AuthCard>
    </AuthShell>
  );
}
