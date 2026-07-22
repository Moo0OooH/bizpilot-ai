/**
 * ============================================================
 * File: tests/unit/lead-conversion-batch-read-source.test.mts
 * Project: BizPilot AI
 * Description: Source regression guards for bounded Operations leads and complete submission-value reads.
 * Role: Prevents tenant Operations data from scanning full history or silently truncating bounded enrichment reads.
 * Related:
 * - lib/supabase/range-pagination.ts
 * - server/repositories/lead-conversion.repository.ts
 * Author: MoOoH
 * Created: 2026-07-22
 * Last Updated: 2026-07-22
 * Change Log:
 * - 2026-07-22: Guarded paged lead, value, and canonical exact-time reads.
 * - 2026-07-22: Guarded one-extra-row Operations reads and direct selected-lead validation.
 * ============================================================
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

const repository = readFileSync(
  "server/repositories/lead-conversion.repository.ts",
  "utf8",
);
const leadReader = repository.slice(
  repository.indexOf("export async function listLeadsForBusiness"),
  repository.indexOf("export async function listActionableOperationsLeads"),
);
const actionableOperationsLeadReader = repository.slice(
  repository.indexOf("export async function listActionableOperationsLeads"),
  repository.indexOf("export async function listLeadsByIds"),
);
const directLeadReader = repository.slice(
  repository.indexOf("export async function listLeadsByIds"),
  repository.indexOf("export async function getLeadById"),
);
const batchReader = repository.slice(
  repository.indexOf("export async function listSubmissionValuesForSubmissions"),
  repository.indexOf("export async function listCanonicalExactTimeSubmissionIds"),
);
const canonicalExactTimeReader = repository.slice(
  repository.indexOf("export async function listCanonicalExactTimeSubmissionIds"),
  repository.indexOf("export async function getSourceMetadataForLead"),
);

describe("Lead conversion complete reads", () => {
  it("reads every tenant lead through stable range pages", () => {
    assert.match(leadReader, /collectSupabaseRangePages\(/);
    assert.match(leadReader, /\.eq\("business_id", input\.businessId\)/);
    assert.match(leadReader, /\.order\("created_at", \{ ascending: true \}\)/);
    assert.match(leadReader, /\.order\("id", \{ ascending: true \}\)/);
    assert.match(leadReader, /\.range\(from, to\)/);
    assert.match(leadReader, /return leads\.reverse\(\)/);
  });

  it("bounds Operations to the newest actionable 250 leads with an honest extra-row signal", () => {
    assert.match(repository, /OPERATIONS_LEAD_READ_LIMIT = 250/);
    assert.match(
      actionableOperationsLeadReader,
      /\.in\("status", \[\.\.\.actionableLeadStatuses\]\)/,
    );
    assert.match(
      actionableOperationsLeadReader,
      /\.order\("created_at", \{ ascending: false \}\)/,
    );
    assert.match(
      actionableOperationsLeadReader,
      /\.order\("id", \{ ascending: false \}\)/,
    );
    assert.match(
      actionableOperationsLeadReader,
      /\.limit\(OPERATIONS_LEAD_READ_LIMIT \+ 1\)/,
    );
    assert.match(
      actionableOperationsLeadReader,
      /hasMore: rows\.length > OPERATIONS_LEAD_READ_LIMIT/,
    );
    assert.match(
      actionableOperationsLeadReader,
      /rows\.slice\(0, OPERATIONS_LEAD_READ_LIMIT\)/,
    );
    assert.doesNotMatch(actionableOperationsLeadReader, /collectSupabaseRangePages/);
  });

  it("validates at most 50 selected leads through one tenant-scoped ID read", () => {
    assert.match(repository, /DIRECT_LEAD_ID_READ_LIMIT = 50/);
    assert.match(directLeadReader, /\.eq\("business_id", input\.businessId\)/);
    assert.match(directLeadReader, /\.in\("id", leadIds\)/);
    assert.match(
      directLeadReader,
      /leadIds\.length > DIRECT_LEAD_ID_READ_LIMIT/,
    );
    assert.doesNotMatch(directLeadReader, /listLeadsForBusiness/);
    assert.doesNotMatch(directLeadReader, /collectSupabaseRangePages/);
  });

  it("keeps availability batches bounded, chunked, and fully paged", () => {
    assert.match(repository, /SUBMISSION_VALUE_BATCH_LIMIT = 250/);
    assert.match(repository, /SUBMISSION_VALUE_FILTER_CHUNK_SIZE = 40/);
    assert.match(batchReader, /submissionIds\.length > SUBMISSION_VALUE_BATCH_LIMIT/);
    assert.match(batchReader, /chunkSupabaseFilterValues\(/);
    assert.match(batchReader, /collectSupabaseRangePages\(/);
    assert.match(batchReader, /\.in\("submission_id", submissionIdChunk\)/);
    assert.match(batchReader, /\.range\(from, to\)/);
  });

  it("recognizes exact time only on visible template-linked time fields", () => {
    assert.match(canonicalExactTimeReader, /\.from\("intake_form_fields"\)/);
    assert.match(canonicalExactTimeReader, /\.eq\("field_key", "preferred_time"\)/);
    assert.match(canonicalExactTimeReader, /\.eq\("is_hidden", false\)/);
    assert.match(
      canonicalExactTimeReader,
      /\.not\("template_field_id", "is", null\)/,
    );
    assert.match(canonicalExactTimeReader, /field\.field_type as string\) === "time"/);
    assert.match(canonicalExactTimeReader, /\.in\("id", submissionIdChunk\)/);
    assert.match(
      canonicalExactTimeReader,
      /canonicalFormIds\.has\(submission\.intake_form_id\)/,
    );
  });
});
