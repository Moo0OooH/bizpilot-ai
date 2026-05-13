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
 * Last Updated: 2026-05-12
 * Change Log:
 * - 2026-05-04: Created Phase 2 sign-up page.
 * - 2026-05-12: Polished sign-up UI and replaced internal-facing copy.
 * ============================================================
 */

import Link from "next/link";

import { AuthSubmitButton } from "@/components/auth/auth-submit-button";
import {
  AuthCard,
  AuthFieldIcon,
  AuthShell,
  authInputClassName,
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
      cardWidthClassName="max-w-[600px]"
      footer="Owner access for the BizPilot AI quote recovery workspace."
    >
      <AuthCard
        subtitle="Set up owner access for your quote recovery workspace."
        title="Create your workspace"
      >
        {params?.error ? (
          <p
            aria-live="assertive"
            className="mt-5 rounded-[10px] border border-red-200 bg-red-50 px-3 py-2 text-sm leading-5 text-red-700"
          >
            {params.error}
          </p>
        ) : null}

        <form action={signUpAction} className="mt-5 grid gap-3.5 sm:grid-cols-2">
          <label className="grid gap-1.5 text-sm font-semibold text-slate-800">
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
          <label className="grid gap-1.5 text-sm font-semibold text-slate-800">
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
          <label className="grid gap-1.5 text-sm font-semibold text-slate-800">
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
          <label className="grid gap-1.5 text-sm font-semibold text-slate-800">
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

          <div className="sm:col-span-2">
            <AuthSubmitButton pendingLabel="Account created. Setting up your workspace...">
              Create account
            </AuthSubmitButton>
          </div>
        </form>

        <p className="mt-3 text-center text-xs leading-5 text-slate-500">
          You can configure your public quote link after creating your account.
        </p>

        <p className="mt-4 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link
            className="font-semibold text-violet-700 underline-offset-4 hover:underline"
            href="/auth/sign-in"
          >
            Sign in
          </Link>
        </p>
      </AuthCard>
    </AuthShell>
  );
}
