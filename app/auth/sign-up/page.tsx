/**
 * ============================================================
 * File: app/auth/sign-up/page.tsx
 * Project: BizPilot AI
 * Description: Renders the Phase 2 Supabase sign-up page.
 * Role: Creates an owner auth account and initial tenant business shell.
 * Related:
 * - server/actions/auth.actions.ts
 * - app/auth/sign-in/page.tsx
 * Author: MoOoH
 * Created: 2026-05-04
 * Last Updated: 2026-05-04
 * Change Log:
 * - 2026-05-04: Created Phase 2 sign-up page.
 * ============================================================
 */

import Link from "next/link";

import { signUpAction } from "@/server/actions/auth.actions";

type SignUpPageProps = Readonly<{
  searchParams?: Promise<{
    error?: string;
  }>;
}>;

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const params = await searchParams;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-6 py-16">
      <p className="text-sm font-medium uppercase tracking-normal text-zinc-500">
        BizPilot AI
      </p>
      <h1 className="mt-3 text-3xl font-semibold text-zinc-950">
        Create account
      </h1>
      <p className="mt-3 text-sm leading-6 text-zinc-600">
        Phase 2 creates only the auth user, profile, business, and membership.
      </p>

      {params?.error ? (
        <p className="mt-6 border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {params.error}
        </p>
      ) : null}

      <form action={signUpAction} className="mt-8 space-y-5">
        <label className="block text-sm font-medium text-zinc-800">
          Name
          <input
            className="mt-2 w-full border border-zinc-300 px-3 py-2 text-base text-zinc-950 outline-none focus:border-zinc-950"
            name="displayName"
            required
            type="text"
          />
        </label>
        <label className="block text-sm font-medium text-zinc-800">
          Business name
          <input
            className="mt-2 w-full border border-zinc-300 px-3 py-2 text-base text-zinc-950 outline-none focus:border-zinc-950"
            name="businessName"
            required
            type="text"
          />
        </label>
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
          Create account
        </button>
      </form>

      <p className="mt-6 text-sm text-zinc-600">
        Already have an account?{" "}
        <Link className="font-medium text-zinc-950" href="/auth/sign-in">
          Sign in
        </Link>
      </p>
    </main>
  );
}
