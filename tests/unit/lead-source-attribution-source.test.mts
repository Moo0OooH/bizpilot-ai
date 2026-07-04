/**
 * ============================================================
 * File: tests/unit/lead-source-attribution-source.test.mts
 * Project: BizPilot AI
 * Description: Source guards for owner-visible lead attribution.
 * Role: Verifies captured source metadata is shown on lead detail without
 * enabling broad analytics claims.
 * Related:
 * - server/repositories/lead-conversion.repository.ts
 * - server/services/lead-conversion.service.ts
 * - app/(dashboard)/dashboard/leads/[leadId]/page.tsx
 * Author: MoOoH
 * Created: 2026-07-04
 * ============================================================
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

function source(path: string): string {
  return readFileSync(path, "utf8");
}

test("lead detail reads tenant-scoped source metadata", () => {
  const repository = source("server/repositories/lead-conversion.repository.ts");
  const service = source("server/services/lead-conversion.service.ts");

  assert.equal(repository.includes("LeadSourceMetadataRecord"), true);
  assert.equal(repository.includes("getSourceMetadataForLead"), true);
  assert.equal(repository.includes('.from("lead_source_metadata")'), true);
  assert.equal(repository.includes('.eq("business_id", input.businessId)'), true);
  assert.equal(repository.includes('.eq("lead_id", input.leadId)'), true);
  assert.equal(service.includes("sourceMetadata: LeadSourceMetadataRecord | null"), true);
  assert.equal(service.includes("getSourceMetadataForLead({"), true);
});

test("lead detail renders source URL, referrer, and UTM context", () => {
  const page = source("app/(dashboard)/dashboard/leads/[leadId]/page.tsx");
  const copy = source("lib/i18n/bizpilot-copy.ts");

  for (const required of [
    "detail.sourceMetadata",
    "detailCopy.sourceAttribution.title",
    "detailCopy.sourceAttribution.description",
    "sourceMetadata.source_url",
    "sourceMetadata.referrer",
    "sourceMetadata.utm_source",
    "sourceMetadata.utm_medium",
    "sourceMetadata.utm_campaign",
  ]) {
    assert.equal(page.includes(required), true, `lead detail should include ${required}`);
  }

  assert.equal(copy.includes("Source attribution"), true);
  assert.equal(copy.includes("do not treat it as a full analytics report"), true);
  assert.equal(copy.includes("UTM campaign"), true);
  assert.equal(copy.includes("Attribution source"), true);
});
