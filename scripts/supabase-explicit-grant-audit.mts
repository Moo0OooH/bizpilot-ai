/**
 * ============================================================
 * File: scripts/supabase-explicit-grant-audit.mts
 * Project: BizPilot AI
 * Description: Lightweight static audit for public-schema SQL migrations.
 * Role: Detects missing RLS, missing explicit role grants, and risky anon exposure before release.
 * Related:
 * - supabase/migrations/README.md
 * - docs/security/BIZPILOT_SUPABASE_EXPLICIT_GRANTS_AUDIT_v1.0.md
 * - tests/rls/data-api-access-audit.test.sql
 * Author: MoOoH
 * Created: 2026-05-27
 * Last Updated: 2026-05-27
 * Change Log:
 * - 2026-05-27: Added migration audit script for explicit GRANT + RLS posture checks.
 * ============================================================
 */

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

type Role = "anon" | "authenticated" | "service_role";
type Privilege = "s" | "i" | "u" | "d";

const MIGRATION_DIR = join(process.cwd(), "supabase", "migrations");
const ALLOWED_EXPLICIT_BROAD_ANON = new Set<string>([
  // Reserve an explicit exception list only when architecture has approved a full public surface.
]);

const TABLE_GRANT_PATTERN =
  /^\s*grant\s+([^;\n]+)\s+on\s+public\.([a-zA-Z0-9_]+)\s+to\s+([^;]+);/gim;
const CREATE_TABLE_PATTERN =
  /^\s*create\s+table(?:\s+if\s+not\s+exists)?\s+public\.([a-zA-Z0-9_]+)/gim;
const RLS_PATTERN =
  /^\s*alter\s+table\s+public\.([a-zA-Z0-9_]+)\s+enable\s+row\s+level\s+security;/gim;
const POLICY_PATTERN =
  /create\s+policy\s+"[^"]+"\s+on\s+public\.([a-zA-Z0-9_]+)\s+for\s+(all|select|insert|update|delete)\s+to\s+([a-zA-Z0-9_,\s]+?)\s+(?:using|with)\s+/gim;

const tableBySource = new Map<string, string>();
const tableHasRls = new Set<string>();
const tablePolicyRoleOps = new Map<
  string,
  Map<Role, Set<Privilege>>
>();
const tableRoleGrants = {
  anon: new Map<string, Set<Privilege>>(),
  authenticated: new Map<string, Set<Privilege>>(),
  service_role: new Map<string, Set<Privilege>>(),
};

function parsePrivileges(rawPrivileges: string): Set<Privilege> {
  const privileges = new Set<Privilege>();
  const normalized = rawPrivileges.toLowerCase();

  if (normalized.includes("all")) {
    privileges.add("s");
    privileges.add("i");
    privileges.add("u");
    privileges.add("d");
    return privileges;
  }

  if (normalized.includes("select")) privileges.add("s");
  if (normalized.includes("insert")) privileges.add("i");
  if (normalized.includes("update")) privileges.add("u");
  if (normalized.includes("delete")) privileges.add("d");

  return privileges;
}

function addGrant(role: string, table: string, privileges: Set<Privilege>): void {
  if (!["anon", "authenticated", "service_role"].includes(role)) return;

  const key = role as Role;
  const roleGrants = tableRoleGrants[key];
  const normalized = table.toLowerCase();
  const current = roleGrants.get(normalized) ?? new Set<Privilege>();

  for (const privilege of privileges) {
    current.add(privilege);
  }

  roleGrants.set(normalized, current);
}

function addPolicy(table: string, command: string, role: string): void {
  const normalizedRole = role.trim().toLowerCase();
  if (!["anon", "authenticated", "service_role"].includes(normalizedRole)) return;

  const roleMap = tablePolicyRoleOps.get(table.toLowerCase()) ?? new Map<Role, Set<Privilege>>();
  const commandOps = command.toLowerCase() === "all"
    ? new Set<Privilege>(["s", "i", "u", "d"])
    : command.toLowerCase() === "select"
      ? new Set<Privilege>(["s"])
      : command.toLowerCase() === "insert"
        ? new Set<Privilege>(["i"])
        : command.toLowerCase() === "update"
          ? new Set<Privilege>(["u"])
          : command.toLowerCase() === "delete"
            ? new Set<Privilege>(["d"])
            : new Set<Privilege>();

  const current = roleMap.get(normalizedRole as Role) ?? new Set<Privilege>();
  for (const privilege of commandOps) {
    current.add(privilege);
  }
  roleMap.set(normalizedRole as Role, current);
  tablePolicyRoleOps.set(table.toLowerCase(), roleMap);
}

function formatPrivileges(privileges?: Set<Privilege>): string {
  if (!privileges || privileges.size === 0) return "-";
  const ordered: Privilege[] = ["s", "i", "u", "d"];
  return ordered.filter((p) => privileges.has(p)).join(",");
}

function main(): number {
  const migrationFiles = readdirSync(MIGRATION_DIR)
    .filter((name) => name.endsWith(".sql"))
    .sort();

  for (const file of migrationFiles) {
    const sql = readFileSync(join(MIGRATION_DIR, file), "utf8");

    for (const match of sql.matchAll(CREATE_TABLE_PATTERN)) {
      const table = (match[1] ?? "").toLowerCase();
      if (!table) continue;
      if (!tableBySource.has(table)) {
        tableBySource.set(table, file);
      }
    }

    for (const match of sql.matchAll(RLS_PATTERN)) {
      const table = (match[1] ?? "").toLowerCase();
      if (!table) continue;
      tableHasRls.add(table);
    }

    const flattened = sql.replace(/\r?\n/g, " ");
    for (const match of flattened.matchAll(POLICY_PATTERN)) {
      const table = match[1] ?? "";
      const command = match[2] ?? "";
      const role = match[3] ?? "";
      if (!table || !command || !role) continue;
      addPolicy(table, command, role);
    }

    for (const match of sql.matchAll(TABLE_GRANT_PATTERN)) {
      const privilegeText = match[1] ?? "";
      const table = (match[2] ?? "").toLowerCase();
      const roles = match[3] ?? "";
      if (!privilegeText || !table || !roles) continue;
      const privileges = parsePrivileges(privilegeText);

      for (const role of roles.split(",").map((value) => value.trim())) {
        addGrant(role, table, privileges);
      }
    }
  }

  const allTables = [...tableBySource.keys()].sort();
  const allFailures: string[] = [];
  let publicRlsFailures = 0;
  let policyGrantFailures = 0;
  let broadAnonFailures = 0;
  let noGrantRows = 0;

  console.log("Table exposure snapshot (public schema):");
  console.log(
    [
      "table",
      "source",
      "rls",
      "policy?",
      "anon",
      "authenticated",
      "service_role",
      "least_privilege_note",
    ].join("\t"),
  );

  for (const table of allTables) {
    const source = tableBySource.get(table) ?? "unknown";
    const policyRoles = tablePolicyRoleOps.get(table) ?? new Map<Role, Set<Privilege>>();
    const hasPolicy =
      policyRoles.size > 0 || ["admin_action_log", "business_deletion_tombstones"].includes(table);
    const rls = tableHasRls.has(table);
    const anonGrant = formatPrivileges(tableRoleGrants.anon.get(table));
    const authGrant = formatPrivileges(tableRoleGrants.authenticated.get(table));
    const serviceGrant = formatPrivileges(tableRoleGrants.service_role.get(table));

    const policyHint = hasPolicy ? "yes" : "service-only or staged";
    const leastPrivilege =
      anonGrant !== "s,i,u,d" &&
      authGrant !== "s,i,u,d" &&
      serviceGrant !== "-"
        ? "yes"
        : `review (${[anonGrant, authGrant, serviceGrant].join(" / ")})`;

    console.log(
      [
        table,
        source,
        rls ? "yes" : "no",
        policyHint,
        anonGrant,
        authGrant,
        serviceGrant,
        leastPrivilege,
      ].join("\t"),
    );

    if (!rls) {
      publicRlsFailures++;
      allFailures.push(`${table}: RLS not enabled`);
    }

    if (!hasPolicy && (anonGrant !== "-" || authGrant !== "-")) {
      policyGrantFailures++;
      allFailures.push(`${table}: policy missing but anon/auth grant exists`);
    }

    if (anonGrant === "s,i,u,d" && !ALLOWED_EXPLICIT_BROAD_ANON.has(table)) {
      broadAnonFailures++;
      allFailures.push(`${table}: broad anon grant (SELECT, INSERT, UPDATE, DELETE)`);
    }

    const policiesForTable = policyRoles;
    for (const role of ["anon", "authenticated"] as const) {
      const required = policiesForTable.get(role);
      const granted = tableRoleGrants[role].get(table) ?? new Set<Privilege>();
      if (!required) {
        continue;
      }

      for (const priv of required) {
        if (!granted.has(priv)) {
          noGrantRows++;
          allFailures.push(
            `${table}: ${role} policy requires ${priv.toUpperCase()} but ${role} table grant is missing`,
          );
        }
      }
    }
  }

  console.log("");
  console.log("Summary:");
  console.log(`  RLS missing: ${publicRlsFailures}`);
  console.log(`  Policy-driven grants missing: ${policyGrantFailures}`);
  console.log(`  Policy-required grants missing: ${noGrantRows}`);
  console.log(`  Overbroad anon grants: ${broadAnonFailures}`);

  if (allFailures.length > 0) {
    console.log("");
    console.log("Blocking issues:");
    for (const failure of allFailures) {
      console.log(`  - ${failure}`);
    }
    return 1;
  }

  console.log("");
  console.log("Result: PASS (explicit grant + RLS posture check)");
  return 0;
}

process.exit(main());
