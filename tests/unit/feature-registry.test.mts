import assert from "node:assert/strict";
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
      }
    }
  });
});
