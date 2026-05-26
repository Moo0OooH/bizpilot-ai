import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

describe("dashboard shell copy boundary", () => {
  it("does not pass function-valued Settings copy into client shell components", () => {
    const layoutSource = readFileSync("app/(dashboard)/layout.tsx", "utf8");
    const shellSource = readFileSync(
      "components/dashboard/dashboard-shell.tsx",
      "utf8",
    );

    assert.equal(
      layoutSource.includes("settings: copy.settings"),
      false,
      "DashboardLayout must not pass the full settings dictionary because it contains formatter functions.",
    );
    assert.match(
      layoutSource,
      /settings:\s*{\s*plan:\s*copy\.settings\.plan,\s*}/s,
    );
    assert.match(
      shellSource,
      /settings:\s*Pick<BizPilotCopy\["dashboard"\]\["settings"\], "plan">/s,
    );
  });
});
