/**
 * ============================================================
 * File: tests/unit/business-deletion-owner-eligibility.test.mts
 * Project: BizPilot AI
 * Description: Tests owner-only UI eligibility for workspace deletion requests.
 * Role: Ensures admins, members, disabled owners, and locked workspaces cannot request.
 * Related:
 * - lib/business-deletion/owner-eligibility.ts
 * - app/(dashboard)/dashboard/settings/page.tsx
 * Author: MoOoH
 * Created: 2026-05-24
 * ============================================================
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { canUserRequestWorkspaceDeletion } from "../../lib/business-deletion/owner-eligibility.ts";

const activeBusiness = {
  lifecycleStatus: "active",
  status: "active",
};

describe("Business deletion owner eligibility", () => {
  it("allows only an active owner on an active workspace", () => {
    assert.equal(
      canUserRequestWorkspaceDeletion({
        business: activeBusiness,
        businessId: "business-a",
        memberships: [
          {
            businessId: "business-a",
            role: "owner",
            status: "active",
            userId: "owner-a",
          },
        ],
        userId: "owner-a",
      }),
      true,
    );
  });

  it("blocks admin/member non-owners and disabled owners", () => {
    for (const membership of [
      { role: "admin", status: "active" },
      { role: "member", status: "active" },
      { role: "owner", status: "disabled" },
    ]) {
      assert.equal(
        canUserRequestWorkspaceDeletion({
          business: activeBusiness,
          businessId: "business-a",
          memberships: [
            {
              businessId: "business-a",
              role: membership.role,
              status: membership.status,
              userId: "user-a",
            },
          ],
          userId: "user-a",
        }),
        false,
      );
    }
  });

  it("blocks locked lifecycle states", () => {
    assert.equal(
      canUserRequestWorkspaceDeletion({
        business: {
          lifecycleStatus: "deletion_requested",
          status: "active",
        },
        businessId: "business-a",
        memberships: [
          {
            businessId: "business-a",
            role: "owner",
            status: "active",
            userId: "owner-a",
          },
        ],
        userId: "owner-a",
      }),
      false,
    );
  });
});
