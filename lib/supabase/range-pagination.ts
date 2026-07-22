/**
 * ============================================================
 * File: lib/supabase/range-pagination.ts
 * Project: BizPilot AI
 * Description: Collects deterministic Supabase range pages without silently truncating rows.
 * Role: Gives correctness-sensitive tenant queries a reusable fail-closed pagination primitive.
 * Related:
 * - server/repositories/lead-conversion.repository.ts
 * - tests/unit/supabase-range-pagination.test.mts
 * Author: MoOoH
 * Created: 2026-07-22
 * Last Updated: 2026-07-22
 * Change Log:
 * - 2026-07-22: Added validated filter chunking and fail-closed range-page collection.
 * ============================================================
 */

export const DEFAULT_SUPABASE_RANGE_PAGE_SIZE = 200;
export const DEFAULT_SUPABASE_RANGE_MAX_PAGES = 500;

export type SupabaseRange = Readonly<{
  from: number;
  to: number;
}>;

export function chunkSupabaseFilterValues<Value>(input: {
  chunkSize: number;
  values: readonly Value[];
}): Value[][] {
  if (!Number.isSafeInteger(input.chunkSize) || input.chunkSize < 1) {
    throw new Error("Supabase filter chunk size must be a positive safe integer.");
  }

  const chunks: Value[][] = [];
  for (let start = 0; start < input.values.length; start += input.chunkSize) {
    chunks.push(input.values.slice(start, start + input.chunkSize));
  }
  return chunks;
}

/**
 * The maximum is a failure boundary, not a truncation boundary. Callers must
 * provide stable ordering; exceeding the boundary throws instead of returning
 * a partial operational result.
 */
export async function collectSupabaseRangePages<Row>(input: {
  fetchPage: (range: SupabaseRange) => Promise<readonly Row[]>;
  maxPages?: number;
  pageSize?: number;
}): Promise<Row[]> {
  const pageSize = input.pageSize ?? DEFAULT_SUPABASE_RANGE_PAGE_SIZE;
  const maxPages = input.maxPages ?? DEFAULT_SUPABASE_RANGE_MAX_PAGES;
  if (!Number.isSafeInteger(pageSize) || pageSize < 1) {
    throw new Error("Supabase range page size must be a positive safe integer.");
  }
  if (!Number.isSafeInteger(maxPages) || maxPages < 1) {
    throw new Error("Supabase range page limit must be a positive safe integer.");
  }

  const rows: Row[] = [];
  for (let pageIndex = 0; pageIndex < maxPages; pageIndex += 1) {
    const from = pageIndex * pageSize;
    const page = await input.fetchPage({
      from,
      to: from + pageSize - 1,
    });
    if (page.length > pageSize) {
      throw new Error("Supabase range query returned more rows than requested.");
    }
    rows.push(...page);
    if (page.length < pageSize) return rows;
  }

  throw new Error(
    "Supabase range query exceeded its safe page limit; refusing partial results.",
  );
}
