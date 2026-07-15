/**
 * ============================================================
 * File: tests/unit/feature-registry.test.mts
 * Project: BizPilot AI
 * Description: Source guards for the internal feature registry and Settings scope.
 * Role: Verifies feature states and localized guide copy while keeping long roadmap documentation out of owner Settings.
 * Related:
 * - lib/features/feature-registry.ts
 * - app/(dashboard)/dashboard/settings/page.tsx
 * - lib/i18n/bizpilot-copy.ts
 * Author: MoOoH
 * Created: 2026-05-26
 * Last Updated: 2026-07-14
 * Change Log:
 * - 2026-07-14: Kept the registry as an internal source contract while removing its repeated long-form rendering from Settings.
 * - 2026-07-04: Added Settings guide-detail source guards without enabling blocked features.
 * ============================================================
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

import {
  featureRegistry,
  type FeatureGuideStatus,
  type FeatureState,
} from "../../lib/features/feature-registry.ts";
import { getBizPilotCopy } from "../../lib/i18n/bizpilot-copy.ts";
import { supportedLanguages } from "../../lib/i18n/language.ts";

const allowedStates = new Set<FeatureState>([
  "blocked_external",
  "enabled",
  "owner_controlled",
  "planned",
  "setup_required",
]);

const allowedGuideStatuses = new Set<FeatureGuideStatus>([
  "draft",
  "ready",
  "required",
]);

describe("feature registry", () => {
  it("keeps feature keys unique and explicitly stated", () => {
    const keys = featureRegistry.map((feature) => feature.key);

    assert.equal(new Set(keys).size, keys.length);
    assert.ok(featureRegistry.some((feature) => feature.state === "enabled"));
    assert.ok(
      featureRegistry.some((feature) => feature.state === "blocked_external"),
    );
    assert.ok(
      featureRegistry.some((feature) => feature.state === "setup_required"),
    );
  });

  it("uses only Settings-safe states and guide statuses", () => {
    for (const feature of featureRegistry) {
      assert.equal(
        allowedStates.has(feature.state),
        true,
        `${feature.key} has an unknown feature state`,
      );
      assert.equal(
        allowedGuideStatuses.has(feature.guideStatus),
        true,
        `${feature.key} has an unknown guide status`,
      );
    }
  });

  it("requires localized Settings copy and guide text for every feature", () => {
    for (const language of supportedLanguages) {
      const registryCopy =
        getBizPilotCopy(language).dashboard.settings.featureRegistry;

      for (const feature of featureRegistry) {
        const featureCopy = registryCopy.featureCopy[feature.key];

        assert.ok(featureCopy, `${language} is missing ${feature.key} copy`);
        assert.ok(featureCopy.name.length > 0);
        assert.ok(featureCopy.summary.length > 0);
        assert.ok(featureCopy.activation.length > 0);
        assert.ok(featureCopy.setup.length > 0);
        assert.ok(featureCopy.visualGuide.length > 0);
        assert.ok(featureCopy.textGuide.length > 0);
        assert.ok(featureCopy.ownerGuide.length > 0);
        assert.ok(registryCopy.stateLabels[feature.state]);
        assert.ok(registryCopy.levelLabels[feature.level]);
        assert.ok(registryCopy.categoryLabels[feature.category]);
        assert.ok(registryCopy.guideLabels[feature.guideStatus]);
        assert.ok(registryCopy.guideDetailsLabel.length > 0);
        assert.ok(registryCopy.setupLabel.length > 0);
        assert.ok(registryCopy.visualGuideLabel.length > 0);
        assert.ok(registryCopy.textGuideLabel.length > 0);
        assert.ok(registryCopy.ownerGuideLabel.length > 0);
      }
    }
  });

  it("keeps roadmap documentation out of the compact Settings surface", () => {
    const settingsSource = readFileSync(
      "app/(dashboard)/dashboard/settings/page.tsx",
      "utf8",
    );

    for (const removed of [
      "settingsCopy.featureRegistry.guideDetailsLabel",
      "featureText.activation",
      "featureText.setup",
      "featureText.visualGuide",
      "featureText.textGuide",
      "featureText.ownerGuide",
      "getFeatureStateTone(feature.state)",
    ]) {
      assert.equal(
        settingsSource.includes(removed),
        false,
        `Settings should not repeat ${removed}.`,
      );
    }

    assert.equal(settingsSource.includes("countFeaturesByState"), false);
    assert.equal(settingsSource.includes("WorkspaceDeletionRequestForm"), true);
    assert.equal(
      settingsSource.includes("feature.state ="),
      false,
      "Settings guide details should not mutate feature states.",
    );
  });
});
