/**
 * ============================================================
 * File: components/public/json-ld.tsx
 * Project: BizPilot AI
 * Description: Safe JSON-LD script renderer for public SEO surfaces.
 * Role: Emits structured data without adding client-side analytics or runtime behavior.
 * Related:
 * - lib/public-structured-data.ts
 * - app/page.tsx
 * - app/faq/page.tsx
 * Author: MoOoH
 * Created: 2026-07-04
 * ============================================================
 */

import type { JsonLdValue } from "@/lib/public-structured-data";

export function JsonLdScript({
  data,
  id,
}: Readonly<{ data: JsonLdValue; id: string }>) {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replaceAll("<", "\\u003c"),
      }}
      id={id}
      type="application/ld+json"
    />
  );
}
