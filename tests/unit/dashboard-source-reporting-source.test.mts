/**
 * ============================================================
 * File: tests/unit/dashboard-source-reporting-source.test.mts
 * Project: BizPilot AI
 * Description: Source contracts for tracked quote links and owner/founder source reporting.
 * Role: Guards tenant scoping, bounded reporting, navigation, privacy disclosures, and manual-first metric claims.
 * Related:
 * - app/(dashboard)/dashboard/reports/page.tsx
 * - components/dashboard/tracked-quote-link-builder.tsx
 * - server/services/lead-reporting.service.ts
 * - server/services/founder-admin.service.ts
 * Author: MoOoH
 * Created: 2026-07-16
 * Last Updated: 2026-07-16
 * Change Log:
 * - 2026-07-16: Guarded bounded owner source-metadata batches for high-volume reports.
 * - 2026-07-16: Added owner/admin attribution, setup-link, privacy, and bounded-query source contracts.
 * ============================================================
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

function source(path: string): string {
  return readFileSync(path, "utf8");
}

describe("dashboard source reporting", () => {
  it("protects the owner report and scopes every read to the active business", () => {
    const page = source("app/(dashboard)/dashboard/reports/page.tsx");
    const repository = source("server/repositories/lead-reporting.repository.ts");
    const service = source("server/services/lead-reporting.service.ts");

    assert.equal(page.includes("getCurrentUser()"), true);
    assert.equal(page.includes('redirect("/auth/sign-in")'), true);
    assert.equal(page.includes("activeBusiness.id"), true);
    assert.equal(
      repository.match(/\.eq\("business_id", input\.businessId\)/g)?.length,
      2,
    );
    assert.equal(service.includes("REPORT_ROW_LIMIT = 1000"), true);
    assert.equal(service.includes("rows.slice(0, REPORT_ROW_LIMIT)"), true);
    assert.equal(service.includes("REPORT_SOURCE_BATCH_SIZE = 200"), true);
    assert.equal(
      service.includes("listLeadReportingSourcesInBatches"),
      true,
    );
  });

  it("builds allowlisted channel links without claiming clicks or revenue", () => {
    const builder = source("components/dashboard/tracked-quote-link-builder.tsx");
    const copy = source("lib/i18n/bizpilot-copy.ts");

    for (const parameter of [
      '"source"',
      '"utm_source"',
      '"utm_medium"',
      '"utm_campaign"',
      '"ref"',
    ]) {
      assert.equal(builder.includes(`searchParams.set(${parameter}`), true);
    }
    assert.equal(builder.includes("slice(0, 80)"), true);
    assert.equal(copy.includes("not profile views, clicks, revenue"), true);
    assert.equal(copy.includes("ne doivent jamais contenir le nom"), true);
  });

  it("keeps Reports reachable and separates setup from workflow guidance", () => {
    const sidebar = source("components/dashboard/dashboard-sidebar.tsx");
    const topbar = source("components/dashboard/dashboard-topbar.tsx");
    const guide = source("app/(dashboard)/dashboard/guide/page.tsx");
    const configuration = source("app/(dashboard)/dashboard/configuration/page.tsx");

    assert.equal(sidebar.includes('href: "/dashboard/reports"'), true);
    assert.equal(topbar.includes('href: "/dashboard/reports"'), true);
    assert.equal(guide.includes('id="setup-optimization"'), true);
    assert.equal(guide.includes('id="workflow-reporting"'), true);
    assert.equal(guide.includes("guideCopy.parts.setup.title"), true);
    assert.equal(guide.includes("guideCopy.parts.workflow.title"), true);
    assert.equal(configuration.includes("data-dashboard-setup-journey"), true);
    assert.equal(configuration.includes("TrackedQuoteLinkBuilder"), true);
  });

  it("keeps founder aggregates bounded while retaining the detailed inbox", () => {
    const adminPage = source("app/admin/page.tsx");
    const adminRepository = source("server/repositories/founder-admin.repository.ts");
    const adminService = source("server/services/founder-admin.service.ts");

    assert.equal(adminService.includes("founderLeadReportingLimit = 1_000"), true);
    assert.equal(adminService.includes("founderLeadDetailLimit = 120"), true);
    assert.equal(adminService.includes("buildLeadSourceAnalytics"), true);
    assert.equal(adminService.includes("listFounderLeadReportingSample"), true);
    assert.equal(
      adminRepository.includes(
        '.select("business_id,created_at,id,manual_outcome,source_channel,status")',
      ),
      true,
    );
    assert.equal(adminPage.includes("sourceReport={overview.sourceReport}"), true);
    assert.equal(adminPage.includes("items={overview.leadInbox}"), true);
    assert.equal(adminPage.includes("reportsCopy.notices.trackedDefinition"), true);
  });
});
