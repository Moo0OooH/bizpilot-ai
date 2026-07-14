/**
 * ============================================================
 * File: app/pilot/page.tsx
 * Project: BizPilot AI
 * Description: Retained Website V3 cleaning founder-pilot application page.
 * Role: Explains pilot fit, controlled next steps, and a copy-only request path with no public submission or empty-recipient email action.
 * Related:
 * - components/public/public-v3-page.tsx
 * - components/public/public-v3-pilot-request.tsx
 * - lib/i18n/public-v3-spec.ts
 * Author: MoOoH
 * Created: 2026-06-18
 * Last Updated: 2026-07-13
 * Change Log:
 * - 2026-07-13: Rebuilt the pilot route around V3 fit, process, and a safe copy-only request mechanism.
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

type PilotPageProps = Readonly<{ searchParams?: PublicRouteSearchParams }>;

async function readPublicLanguage(searchParams?: PublicRouteSearchParams) {
  return resolvePublicRouteLanguage(
    searchParams,
    (await cookies()).get(INTERFACE_LANGUAGE_COOKIE)?.value,
  );
}

export async function generateMetadata({
  searchParams,
}: PilotPageProps = {}): Promise<Metadata> {
  const language = await readPublicLanguage(searchParams);
  return buildPublicMetadata(
    "/pilot",
    getPublicV3Spec(language).routes["/pilot"].meta,
    language,
  );
}

export default async function PilotPage({ searchParams }: PilotPageProps = {}) {
  const language = await readPublicLanguage(searchParams);
  return <PublicV3Page language={language} path="/pilot" />;
}
