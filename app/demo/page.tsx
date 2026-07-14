/**
 * ============================================================
 * File: app/demo/page.tsx
 * Project: BizPilot AI
 * Description: Retained Website V3 cleaning Smart Intake Link walkthrough.
 * Role: Demonstrates one vague request becoming structured details and a human-reviewed draft without submitting data or triggering automation.
 * Related:
 * - components/public/public-v3-page.tsx
 * - components/public/public-v3-demo.tsx
 * - lib/i18n/public-v3-spec.ts
 * Author: MoOoH
 * Created: 2026-06-18
 * Last Updated: 2026-07-13
 * Change Log:
 * - 2026-07-13: Replaced the long V2 demo route with the focused, safe V3 walkthrough.
 * ============================================================
 */

import type { Metadata } from "next";
import { cookies } from "next/headers";

import { PublicV3Page } from "@/components/public/public-v3-page";
import { INTERFACE_LANGUAGE_COOKIE } from "@/lib/i18n/language";
import { getPublicV3Spec } from "@/lib/i18n/public-v3-spec";
import {
  buildPublicMetadata,
  resolvePublicRouteLanguage,
  type PublicRouteSearchParams,
} from "@/lib/seo";

type DemoPageProps = Readonly<{ searchParams?: PublicRouteSearchParams }>;

async function readPublicLanguage(searchParams?: PublicRouteSearchParams) {
  return resolvePublicRouteLanguage(
    searchParams,
    (await cookies()).get(INTERFACE_LANGUAGE_COOKIE)?.value,
  );
}

export async function generateMetadata({
  searchParams,
}: DemoPageProps = {}): Promise<Metadata> {
  const language = await readPublicLanguage(searchParams);
  return buildPublicMetadata(
    "/demo",
    getPublicV3Spec(language).routes["/demo"].meta,
    language,
  );
}

export default async function DemoPage({ searchParams }: DemoPageProps = {}) {
  const language = await readPublicLanguage(searchParams);
  return <PublicV3Page language={language} path="/demo" />;
}
