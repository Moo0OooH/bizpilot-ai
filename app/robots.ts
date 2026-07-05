/**
 * ============================================================
 * File: app/robots.ts
 * Project: BizPilot AI
 * Description: Generates robots.txt for public search indexing boundaries.
 * Role: Allows canonical marketing/legal pages while excluding auth, app, and quote-intake endpoints.
 * Related:
 * - app/sitemap.ts
 * - lib/seo.ts
 * Author: MoOoH
 * Created: 2026-06-20
 * Last Updated: 2026-07-05
 * Change Log:
 * - 2026-07-05: Narrowed quote-intake robots rules so quote-link guide remains crawlable.
 * - 2026-06-20: Created the public robots boundary file.
 * ============================================================
 */

import type { MetadataRoute } from "next";

import { getPublicSiteOrigin } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  const origin = getPublicSiteOrigin();

  return {
    host: origin,
    rules: {
      allow: "/",
      disallow: [
        "/admin",
        "/admin/",
        "/auth",
        "/auth/",
        "/dashboard",
        "/dashboard/",
        "/founder",
        "/founder/",
        "/quote$",
        "/quote/",
      ],
      userAgent: "*",
    },
    sitemap: `${origin}/sitemap.xml`,
  };
}
