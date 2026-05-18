/**
 * ============================================================
 * File: app/auth/sign-up/page.tsx
 * Project: BizPilot AI
 * Description: Renders the owner account creation page for the quote recovery workspace.
 * Role: Creates owner access and the initial business workspace without exposing internal setup details.
 * Related:
 * - server/actions/auth.actions.ts
 * - app/auth/sign-in/page.tsx
 * Author: MoOoH
 * Created: 2026-05-04
 * Last Updated: 2026-05-18
 * Change Log:
 * - 2026-05-04: Created Phase 2 sign-up page.
 * - 2026-05-12: Polished sign-up UI and replaced internal-facing copy.
 * - 2026-05-12: Constrained sign-up layout to auth standards and improved form guidance.
 * - 2026-05-12: Compacted sign-up form to avoid 100% zoom scrolling.
 * - 2026-05-12: Standardized final production auth card scale and helper treatment.
 * - 2026-05-18: Applied the shared BizPilot dark landing theme to sign-up.
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
    <AuthShell
      cardWidthClassName="max-w-full sm:max-w-[580px]"
      footer="Owner access for the BizPilot AI quote recovery workspace."
    >
      <AuthCard
        subtitle="Create owner access and your first business workspace."
        title="Create your workspace"
      >
        {params?.error ? (
          <p
            aria-live="assertive"
            className="mt-5 rounded-xl border border-[#FF5C5C]/22 bg-[#FF5C5C]/10 px-3 py-2 text-sm leading-5 text-[#FFB4B4]"
          >
            {params.error}
          </p>
        ) : null}

        <form action={signUpAction} className="mt-5 grid gap-3.5 sm:grid-cols-2">
          <label className={authLabelClassName}>
            Name
            <span className="relative block">
              <AuthFieldIcon type="name" />
              <input
                autoComplete="name"
                className={authInputClassName}
                name="displayName"
                placeholder="Your name"
                required
                type="text"
              />
            </span>
          </label>
          <label className={authLabelClassName}>
            Business name
            <span className="relative block">
              <AuthFieldIcon type="business" />
              <input
                autoComplete="organization"
                className={authInputClassName}
                name="businessName"
                placeholder="Your business"
                required
                type="text"
              />
            </span>
          </label>
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
                autoComplete="new-password"
                className={authInputClassName}
                minLength={8}
                name="password"
                placeholder="At least 8 characters"
                required
                type="password"
              />
            </span>
          </label>

          <p className="rounded-lg border border-[#17D492]/20 bg-[#17D492]/10 px-2.5 py-1.5 text-xs leading-5 text-[#17D492] sm:col-span-2">
            Use at least 8 characters for your password.
          </p>

          <div className="sm:col-span-2">
            <AuthSubmitButton pendingLabel="Creating workspace...">
              Create account
            </AuthSubmitButton>
          </div>
        </form>

        <p className="mt-3 text-center text-xs leading-5 text-[rgba(245,247,250,0.46)]">
          You can configure your public quote link after creating your account.
        </p>

        <p className="mt-3 text-center text-sm text-[rgba(245,247,250,0.62)]">
          Already have an account?{" "}
          <Link
            className="font-semibold text-[#17D492] underline-offset-4 hover:underline"
            href="/auth/sign-in"
          >
            Sign in
          </Link>
        </p>
      </AuthCard>
    </AuthShell>
  );
}
