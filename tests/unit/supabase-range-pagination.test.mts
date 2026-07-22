/**
 * ============================================================
 * File: tests/unit/supabase-range-pagination.test.mts
 * Project: BizPilot AI
 * Description: Tests fail-closed range pagination and URL-safe filter chunking.
 * Role: Prevents correctness-sensitive Supabase reads from silently truncating rows.
 * Related:
 * - lib/supabase/range-pagination.ts
 * - server/repositories/lead-conversion.repository.ts
 * Author: MoOoH
 * Created: 2026-07-22
 * Last Updated: 2026-07-22
 * Change Log:
 * - 2026-07-22: Added range, validation, completion, and failure-boundary coverage.
 * ============================================================
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  chunkSupabaseFilterValues,
  collectSupabaseRangePages,
} from "../../lib/supabase/range-pagination.ts";

describe("Supabase range pagination", () => {
  it("chunks filter values without dropping their order", () => {
    assert.deepEqual(
      chunkSupabaseFilterValues({ chunkSize: 2, values: ["a", "b", "c", "d", "e"] }),
      [["a", "b"], ["c", "d"], ["e"]],
    );
    assert.deepEqual(chunkSupabaseFilterValues({ chunkSize: 2, values: [] }), []);
  });

  it("collects inclusive range pages until the first short page", async () => {
    const requestedRanges: Array<Readonly<{ from: number; to: number }>> = [];
    const rows = await collectSupabaseRangePages({
      fetchPage: ({ from, to }) => {
        requestedRanges.push({ from, to });
        return Promise.resolve(from === 0 ? ["a", "b"] : ["c"]);
      },
      maxPages: 3,
      pageSize: 2,
    });

    assert.deepEqual(rows, ["a", "b", "c"]);
    assert.deepEqual(requestedRanges, [
      { from: 0, to: 1 },
      { from: 2, to: 3 },
    ]);
  });

  it("fails closed when every safe page remains full", async () => {
    await assert.rejects(
      collectSupabaseRangePages({
        fetchPage: () => Promise.resolve(["a"]),
        maxPages: 2,
        pageSize: 1,
      }),
      /exceeded its safe page limit/,
    );
  });

  it("rejects invalid bounds and oversized provider pages", async () => {
    assert.throws(
      () => chunkSupabaseFilterValues({ chunkSize: 0, values: ["a"] }),
      /positive safe integer/,
    );
    await assert.rejects(
      collectSupabaseRangePages({
        fetchPage: () => Promise.resolve(["a", "b"]),
        pageSize: 1,
      }),
      /more rows than requested/,
    );
  });
});
