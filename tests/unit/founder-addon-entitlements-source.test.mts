/**
 * ============================================================
 * File: tests/unit/founder-addon-entitlements-source.test.mts
 * Project: BizPilot AI
 * Description: Source guardrails for founder-managed Premium Operations entitlements.
 * Role: Verifies explicit founder authorization, strict entitlement inputs, audit logging, and plan-independent admin controls.
 * Related:
 * - server/repositories/founder-admin.repository.ts
 * - server/services/founder-admin.service.ts
 * - server/actions/founder-admin.actions.ts
 * - app/admin/page.tsx
 * - supabase/migrations/0026_premium_operations_schedule_integrity.sql
 * Author: MoOoH
 * Created: 2026-07-22
 * Last Updated: 2026-07-23
 * Change Log:
 * - 2026-07-23: Guarded direct founder paths from Admin Overview and locked Operations modules to the selected workspace controls.
 * - 2026-07-22: Added founder entitlement activation-path source guardrails.
 * ============================================================
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

const repositorySource = readFileSync(
  "server/repositories/founder-admin.repository.ts",
  "utf8",
);
const serviceSource = readFileSync(
  "server/services/founder-admin.service.ts",
  "utf8",
);
const actionSource = readFileSync(
  "server/actions/founder-admin.actions.ts",
  "utf8",
);
const pageSource = readFileSync("app/admin/page.tsx", "utf8");
const operationsPageSource = readFileSync(
  "app/(dashboard)/dashboard/operations/page.tsx",
  "utf8",
);
const operationsWorkspaceSource = readFileSync(
  "components/dashboard/premium-operations-workspace.tsx",
  "utf8",
);
const migrationSource = readFileSync(
  "supabase/migrations/0026_premium_operations_schedule_integrity.sql",
  "utf8",
);

function functionBody(source: string, start: string, end: string): string {
  const startIndex = source.indexOf(start);
  const endIndex = source.indexOf(end, startIndex + start.length);

  assert.notEqual(startIndex, -1, `Missing source boundary: ${start}`);
  assert.notEqual(endIndex, -1, `Missing source boundary: ${end}`);

  return source.slice(startIndex, endIndex);
}

describe("Founder Premium add-on entitlements", () => {
  it("uses service-role reads and the transactional entitlement RPC", () => {
    assert.equal(repositorySource.includes("listFounderAddonEntitlements"), true);
    assert.equal(repositorySource.includes("upsertFounderAddonEntitlement"), true);
    assert.equal(
      repositorySource.includes('.from("business_addon_entitlements")'),
      true,
    );
    assert.equal(
      repositorySource.includes(
        '.rpc("founder_upsert_premium_addon_entitlement", {',
      ),
      true,
    );
    assert.equal(repositorySource.includes("target_actor_user_id"), true);
    assert.equal(repositorySource.includes("target_note"), true);
    const upsertBody = functionBody(
      repositorySource,
      "export async function upsertFounderAddonEntitlement",
      "export async function listFounderPublicLinks",
    );
    assert.equal(upsertBody.includes(".upsert("), false);
  });

  it("validates the exact three keys and only explicit enabled or disabled writes", () => {
    for (const addonKey of [
      "priority_workbench",
      "bulk_reply_review",
      "availability_coordination",
    ]) {
      assert.equal(serviceSource.includes(`\"${addonKey}\"`), true);
    }

    assert.equal(serviceSource.includes("readFounderAddonKey"), true);
    assert.equal(serviceSource.includes("readFounderAddonStatus"), true);
    assert.equal(serviceSource.includes('"Invalid Premium add-on."'), true);
    assert.equal(
      serviceSource.includes('"Invalid Premium add-on status."'),
      true,
    );
    assert.equal(
      serviceSource.includes(
        'const founderManagedAddonStatuses = new Set<FounderManagedAddonStatus>([',
      ),
      true,
    );
    assert.equal(pageSource.includes('value="enabled"'), true);
    assert.equal(pageSource.includes('value="disabled"'), true);
    assert.equal(pageSource.includes('value="trial"'), false);
    assert.equal(pageSource.includes('value="expired"'), false);
    assert.equal(pageSource.includes('trial: "Trial"'), true);
    assert.equal(pageSource.includes("Trial (read only)"), false);
    assert.equal(pageSource.includes("owner-defined service and area rules"), true);
    assert.equal(pageSource.includes("founder-approved service and area rules"), false);
  });

  it("authorizes the founder before service-role mutation and records an audit event", () => {
    const updateBody = functionBody(
      serviceSource,
      "export async function updateFounderAddonEntitlement",
      "export async function updateFounderPlan",
    );

    assert.ok(
      updateBody.indexOf("assertFounderUser(input.user)") <
        updateBody.indexOf("createSupabaseServiceRoleClient()"),
    );
    assert.equal(updateBody.includes("readFounderAddonKey(input.addonKey)"), true);
    assert.equal(updateBody.includes("readFounderAddonStatus(input.status)"), true);
    assert.equal(updateBody.includes("note.length > 240"), true);
    assert.equal(updateBody.includes("getFounderBusiness"), true);
    assert.equal(updateBody.includes("upsertFounderAddonEntitlement"), true);
    assert.equal(updateBody.includes("actorUserId: actor.id"), true);
    assert.equal(updateBody.includes("stripe"), false);
    assert.equal(updateBody.includes("billing"), false);

    const rpcBody = functionBody(
      migrationSource,
      "create or replace function public.founder_upsert_premium_addon_entitlement",
      "revoke all on function public.founder_upsert_premium_addon_entitlement",
    );
    assert.equal(rpcBody.includes("security definer"), true);
    assert.equal(rpcBody.includes("set row_security = off"), true);
    assert.equal(rpcBody.includes("for update;"), true);
    assert.equal(rpcBody.includes("insert into public.admin_action_log"), true);
    assert.equal(
      rpcBody.includes("'operation', 'premium_addon_entitlement_updated'"),
      true,
    );
    assert.match(
      migrationSource,
      /revoke all on function public\.founder_upsert_premium_addon_entitlement\([\s\S]*?\) from public, anon, authenticated;/,
    );
    assert.match(
      migrationSource,
      /grant execute on function public\.founder_upsert_premium_addon_entitlement\([\s\S]*?\) to service_role;/,
    );
  });

  it("keeps entitlement changes independent from plan changes and exposes all controls", () => {
    const planBody = functionBody(
      serviceSource,
      "export async function updateFounderPlan",
      "export async function updateFounderStatus",
    );

    assert.equal(planBody.includes("AddonEntitlement"), false);
    assert.equal(serviceSource.includes("listFounderAddonEntitlements"), true);
    assert.equal(serviceSource.includes("addonEntitlementsAvailable"), true);
    assert.equal(serviceSource.includes("founderAddonKeys.map"), true);
    assert.equal(serviceSource.includes("Date.parse(expiresAt) > Date.now()"), true);
    assert.equal(serviceSource.includes("available: false as const"), true);
    assert.equal(
      serviceSource.includes('readName: "business_addon_entitlements"'),
      true,
    );
    assert.equal(actionSource.includes("updateFounderAddonEntitlementAction"), true);
    assert.equal(actionSource.includes("revalidatePath(\"/dashboard/operations\")"), true);
    assert.equal(pageSource.includes("data-founder-addon-entitlements"), true);
    assert.equal(pageSource.includes("data-addon-key={entitlement.addonKey}"), true);
    assert.equal(
      pageSource.includes(
        '(entitlement.status === "enabled" && entitlement.isActive)',
      ),
      true,
    );
    assert.equal(
      pageSource.includes(
        'disabled={!controlsAvailable || entitlement.status === "disabled"}',
      ),
      true,
    );
    assert.equal(
      pageSource.includes("Plan changes never auto-enable them"),
      true,
    );
    assert.equal(pageSource.includes("does not run billing"), true);
  });

  it("makes Premium activation discoverable to an authorized founder", () => {
    assert.equal(
      pageSource.includes(
        "#premium-addons-${encodeURIComponent(\n                    premiumBusiness.businessId",
      ),
      true,
    );
    assert.equal(operationsPageSource.includes("isFounderUser(user)"), true);
    assert.equal(operationsPageSource.includes("adminControlHref:"), true);
    assert.equal(
      operationsWorkspaceSource.includes(
        "addonLocked(copy, adminControlHref)",
      ),
      true,
    );
    assert.equal(
      operationsWorkspaceSource.includes(
        "{copy.premiumOperations.manageAccess}",
      ),
      true,
    );
  });
});
