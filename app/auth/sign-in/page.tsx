/**
 * ============================================================
 * File: app/auth/sign-in/page.tsx
 * Project: BizPilot AI
 * Description: Renders the Phase 2 Supabase sign-in page.
 * Role: Provides the owner sign-in entry point without product dashboard logic.
 * Related:
 * - server/actions/auth.actions.ts
 * - app/auth/sign-up/page.tsx
 * Author: MoOoH
 * Created: 2026-05-04
 * Last Updated: 2026-05-04
 * Change Log:
 * - 2026-05-04: Created Phase 2 sign-in page.
 * ============================================================
 */

import Link from "next/link";

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
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-6 py-16">
      <p className="text-sm font-medium uppercase tracking-normal text-zinc-500">
        BizPilot AI
      </p>
      <h1 className="mt-3 text-3xl font-semibold text-zinc-950">
        Sign in
      </h1>
      <p className="mt-3 text-sm leading-6 text-zinc-600">
        Phase 2 owner access for the protected tenant foundation.
      </p>

      {params?.notice ? (
        <p className="mt-6 border border-zinc-200 bg-zinc-50 p-3 text-sm text-zinc-700">
          {params.notice}
        </p>
      ) : null}

      {params?.error ? (
        <p className="mt-6 border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {params.error}
        </p>
      ) : null}

      <form action={signInAction} className="mt-8 space-y-5">
        <label className="block text-sm font-medium text-zinc-800">
          Email
          <input
            className="mt-2 w-full border border-zinc-300 px-3 py-2 text-base text-zinc-950 outline-none focus:border-zinc-950"
            name="email"
            required
            type="email"
          />
        </label>
        <label className="block text-sm font-medium text-zinc-800">
          Password
          <input
            className="mt-2 w-full border border-zinc-300 px-3 py-2 text-base text-zinc-950 outline-none focus:border-zinc-950"
            minLength={6}
            name="password"
            required
            type="password"
          />
        </label>
        <button
          className="w-full bg-zinc-950 px-4 py-2.5 text-sm font-medium text-white"
          type="submit"
        >
          Sign in
        </button>
      </form>

      <p className="mt-6 text-sm text-zinc-600">
        Need an account?{" "}
        <Link className="font-medium text-zinc-950" href="/auth/sign-up">
          Create one
        </Link>
      </p>
    </main>
  );
}
