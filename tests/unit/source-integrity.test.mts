import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";

const sourceRoots = ["app", "components", "lib", "server", "tests"] as const;
const sourceExtensions = new Set([".js", ".jsx", ".mjs", ".mts", ".ts", ".tsx"]);
const excludedDirectories = new Set([".next", ".turbo", "node_modules"]);

function extensionOf(path: string): string {
  const index = path.lastIndexOf(".");
  return index >= 0 ? path.slice(index) : "";
}

function listSourceFiles(directory: string): string[] {
  const files: string[] = [];

  for (const entry of readdirSync(directory)) {
    if (excludedDirectories.has(entry)) {
      continue;
    }

    const path = join(directory, entry);
    const stat = statSync(path);

    if (stat.isDirectory()) {
      files.push(...listSourceFiles(path));
      continue;
    }

    if (stat.isFile() && sourceExtensions.has(extensionOf(path))) {
      files.push(path);
    }
  }

  return files;
}

describe("Source integrity", () => {
  it("keeps executable source free of NUL bytes and unsafe control characters", () => {
    const files = sourceRoots.flatMap((root) => listSourceFiles(root));

    assert.ok(files.length > 0, "expected source files to scan");

    for (const file of files) {
      const content = readFileSync(file, "utf8");

      assert.equal(content.includes("\0"), false, `${file} contains NUL bytes`);
      assert.equal(
        /[\u0001-\u0008\u000B\u000C\u000E-\u001F]/u.test(content),
        false,
        `${file} contains unsafe control characters`,
      );
    }
  });
});
