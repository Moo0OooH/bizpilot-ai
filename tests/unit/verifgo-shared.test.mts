import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  VERIFGO_DEFAULT_INSPECTION_ITEM_CODES,
  VERIFGO_FORBIDDEN_PRODUCT_CLAIMS,
  VERIFGO_MVP_FEATURES,
  validateDailyReportDraft,
  verifgoCopy,
} from "../../packages/verifgo-shared/src/index.ts";

describe("VerifGo shared foundation", () => {
  it("keeps MVP scope locked to the 15 approved features", () => {
    assert.equal(VERIFGO_MVP_FEATURES.length, 15);
    assert.equal(new Set(VERIFGO_MVP_FEATURES).size, 15);
  });

  it("keeps forbidden product claims explicit", () => {
    assert.ok(VERIFGO_FORBIDDEN_PRODUCT_CLAIMS.includes("backdating"));
    assert.ok(
      VERIFGO_FORBIDDEN_PRODUCT_CLAIMS.includes("official_saaq_approval"),
    );
    assert.ok(
      VERIFGO_FORBIDDEN_PRODUCT_CLAIMS.includes("guaranteed_fine_avoidance"),
    );
  });

  it("keeps inspection item seeds stable", () => {
    assert.ok(VERIFGO_DEFAULT_INSPECTION_ITEM_CODES.includes("brakes"));
    assert.ok(
      VERIFGO_DEFAULT_INSPECTION_ITEM_CODES.includes(
        "dashboard_warning_lights",
      ),
    );
  });

  it("keeps English and French copy structurally aligned", () => {
    assert.deepEqual(Object.keys(verifgoCopy.en), Object.keys(verifgoCopy.fr));
  });

  it("validates daily report drafts before immutable submit", () => {
    assert.deepEqual(
      validateDailyReportDraft({
        allRequiredItemsConfirmed: true,
        clientSubmittedAt: "2026-05-28T12:00:00.000Z",
        defects: [],
        gpsConsentGiven: false,
        inspectionItems: [{ itemCode: "brakes", status: "ok" }],
        odometerReading: 1200,
        offlineCreated: false,
        reportDate: "2026-05-28",
        vehicleId: "vehicle-1",
      }),
      { errors: [], ok: true },
    );

    assert.equal(
      validateDailyReportDraft({
        allRequiredItemsConfirmed: false,
        clientSubmittedAt: null,
        defects: [],
        gpsConsentGiven: false,
        inspectionItems: [],
        odometerReading: -1,
        offlineCreated: true,
        reportDate: "bad-date",
        vehicleId: "",
      }).ok,
      false,
    );
  });
});
