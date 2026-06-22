/**
 * ============================================================
 * File: app/sitemap.ts
 * Project: BizPilot AI
 * Description: Generates the public marketing/legal sitemap.
 * Role: Lists only real canonical public routes with EN/fr-CA alternates.
 * Related:
 * - lib/seo.ts
 * - app/robots.ts
 * Author: MoOoH
 * Created: 2026-06-20
 * Last Updated: 2026-06-21
 * Change Log:
 * - 2026-06-21: Included the dedicated public FAQ route in the sitemap.
 * ============================================================
 */

import type { MetadataRoute } from "next";

import {
  publicCanonicalRoutes,
  publicLanguageAlternates,
  publicUrl,
} from "@/lib/seo";

const lastPublicPolishDate = new Date("2026-06-21T00:00:00.000Z");

export default function sitemap(): MetadataRoute.Sitemap {
  return publicCanonicalRoutes.map((path) => ({
    alternates: {
      languages: publicLanguageAlternates(path),
    },
    changeFrequency: path === "/" ? "weekly" : "monthly",
    lastModified: lastPublicPolishDate,
    priority: path === "/" ? 1 : 0.7,
    url: publicUrl(path),
  }));
}
