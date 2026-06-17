/**
 * File: scripts/create-clean-source-archive.mts
 * Project: BizPilot AI
 * Description: Builds a clean source archive from tracked git files only.
 * Role: Prevents secrets, local state, temp files, and generated archives from entering shared exports.
 */

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import { dirname, isAbsolute, relative, resolve } from "node:path";

type ForbiddenRule = Readonly<{
  label: string;
  matches: (path: string) => boolean;
}>;

const forbiddenTrackedRules: readonly ForbiddenRule[] = [
  {
    label: "environment file",
    matches: (path) => path.startsWith(".env") && path !== ".env.example",
  },
  {
    label: "Codex secret directory",
    matches: (path) => path.startsWith(".codex-secrets/"),
  },
  {
    label: "Supabase local temp state",
    matches: (path) =>
      path.startsWith("supabase/.temp/") || path.startsWith("supabase/.branches/"),
  },
  {
    label: "generated archive",
    matches: (path) =>
      /\.(?:zip|rar|7z|tar|tgz|tar\.gz)$/i.test(path),
  },
  {
    label: "generated build/type artifact",
    matches: (path) =>
      path === "next-env.d.ts" ||
      path.endsWith(".tsbuildinfo") ||
      path.startsWith(".next/") ||
      path.startsWith("out/") ||
      path.startsWith("build/"),
  },
  {
    label: "local artifact directory",
    matches: (path) =>
      path.startsWith("artifacts/") ||
      path.startsWith("backups/") ||
      path.startsWith("browser-profile/") ||
      path.startsWith("playwright-profile/") ||
      path.startsWith("restore-drills/") ||
      path.startsWith("screenshots/") ||
      path.startsWith("tmp-backups/"),
  },
];

function runGit(args: readonly string[]): string {
  return execFileSync("git", [...args], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
}

function readArgValue(name: string): string | undefined {
  const inlinePrefix = `--${name}=`;
  const inline = process.argv.find((arg) => arg.startsWith(inlinePrefix));
  if (inline) {
    return inline.slice(inlinePrefix.length);
  }

  const index = process.argv.indexOf(`--${name}`);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function normalizeTrackedPath(path: string): string {
  return path.replaceAll("\\", "/");
}

function readTrackedPaths(input: { includeDeleted: boolean }): string[] {
  const trackedPaths = runGit(["ls-files", "-z"])
    .split("\0")
    .filter(Boolean)
    .map(normalizeTrackedPath);

  if (input.includeDeleted) {
    return trackedPaths;
  }

  return trackedPaths.filter((path) => existsSync(resolve(process.cwd(), path)));
}

function findForbiddenTrackedPaths(paths: readonly string[]): string[] {
  return paths.filter((path) =>
    forbiddenTrackedRules.some((rule) => rule.matches(path)),
  );
}

function assertOutputOutsideRepo(outputPath: string): void {
  const repoRoot = process.cwd();
  const relativePath = relative(repoRoot, outputPath);
  const outputIsInsideRepo =
    relativePath === "" ||
    (!relativePath.startsWith("..") && !isAbsolute(relativePath));

  if (outputIsInsideRepo) {
    throw new Error(
      "Write the clean export outside the repository to avoid packaging generated archives.",
    );
  }
}

function assertCleanWorktreeUnlessAllowed(): void {
  if (process.argv.includes("--allow-dirty")) {
    return;
  }

  const status = runGit(["status", "--porcelain"]);
  if (status.trim().length > 0) {
    throw new Error(
      "Working tree has uncommitted changes. Commit first, or pass --allow-dirty to archive current HEAD intentionally.",
    );
  }
}

function main(): void {
  const checkOnly = process.argv.includes("--check-only");
  const trackedPaths = readTrackedPaths({ includeDeleted: !checkOnly });
  const forbiddenTrackedPaths = findForbiddenTrackedPaths(trackedPaths);

  if (forbiddenTrackedPaths.length > 0) {
    console.error("Clean export blocked. Forbidden tracked paths:");
    for (const path of forbiddenTrackedPaths) {
      console.error(`- ${path}`);
    }
    process.exit(1);
  }

  if (checkOnly) {
    console.log(`Clean export check passed for ${trackedPaths.length} tracked files.`);
    return;
  }

  assertCleanWorktreeUnlessAllowed();

  const output = resolve(
    process.cwd(),
    readArgValue("output") ?? "../bizpilot-ai-clean-source.zip",
  );
  assertOutputOutsideRepo(output);

  const outputDirectory = dirname(output);
  if (!existsSync(outputDirectory)) {
    mkdirSync(outputDirectory, { recursive: true });
  }

  runGit(["archive", "--format=zip", "--output", output, "HEAD"]);
  console.log(`Clean source archive created: ${output}`);
}

try {
  main();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Clean export failed: ${message}`);
  process.exit(1);
}
