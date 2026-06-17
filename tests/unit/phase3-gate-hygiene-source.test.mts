/**
 * File: tests/unit/phase3-gate-hygiene-source.test.mts
 * Project: BizPilot AI
 * Description: Source-level guardrails for Phase 3 real-data gate hygiene.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

describe("Phase 3 gate hygiene source safety", () => {
  it("keeps IP hash salt fallback out of production runtime", () => {
    const source = readFileSync(
      "server/services/abuse-protection.service.ts",
      "utf8",
    );

    assert.equal(source.includes("BIZPILOT_IP_HASH_SALT"), true);
    assert.equal(source.includes("DEFAULT_SALT_FALLBACK"), true);
    assert.equal(source.includes("process.env.NODE_ENV"), true);
    assert.equal(source.includes("process.env.VERCEL_ENV"), true);
    assert.equal(
      source.includes("BIZPILOT_IP_HASH_SALT is required in production."),
      true,
    );
  });

  it("blocks secret, temp, and archive paths from clean source exports", () => {
    const source = readFileSync(
      "scripts/create-clean-source-archive.mts",
      "utf8",
    );

    assert.equal(source.includes(".codex-secrets/"), true);
    assert.equal(source.includes("supabase/.temp/"), true);
    assert.equal(source.includes("supabase/.branches/"), true);
    assert.equal(source.includes("path.startsWith(\".env\")"), true);
    assert.equal(source.includes('runGit(["archive"'), true);
    assert.equal(source.includes("--check-only"), true);
  });
});
