/**
 * ============================================================
 * File: server/services/premium-operations-rules.service.ts
 * Project: BizPilot AI
 * Description: Pure deterministic rules for Premium Lead Operations.
 * Role: Ranks saved priority views, evaluates internal time-block conflicts, finds the next open internal slot, and renders owner-review-only draft text.
 * Related:
 * - server/services/premium-operations.service.ts
 * - server/repositories/premium-operations.repository.ts
 * - tests/unit/premium-operations-rules.test.mts
 * Author: MoOoH
 * Created: 2026-07-21
 * Last Updated: 2026-07-22
 * Change Log:
 * - 2026-07-22: Added deterministic IANA-zone parsing that rejects invalid and ambiguous daylight-saving local times, plus bounded opening searches.
 * - 2026-07-22: Allowed requested windows to resolve in the explicit operating timezone instead of assuming UTC.
 * - 2026-07-21: Created deterministic priority, availability, and owner-review draft rules for paid add-ons.
 * ============================================================
 */

export type PremiumAddonKey =
  | "availability_coordination"
  | "bulk_reply_review"
  | "priority_workbench";

export type PriorityLead = Readonly<{
  area: string | null;
  createdAt: string;
  id: string;
  qualityLevel: string;
  service: string | null;
  slaState: string;
  status: string;
}>;

export type PriorityRule = Readonly<{
  areaTerms: readonly string[];
  id: string;
  isActive: boolean;
  name: string;
  priorityRank: number;
  serviceTerms: readonly string[];
}>;

export type PriorityMatch = Readonly<{
  matchingRuleIds: readonly string[];
  priorityRank: number | null;
}>;

export type InternalTimeBlock = Readonly<{
  endsAt: string;
  id: string;
  startsAt: string;
  status: "cancelled" | "reserved" | "tentative";
}>;

export type RequestedTimeWindow = Readonly<{
  endsAt: string;
  startsAt: string;
}>;

export type CustomerFacingDraftLanguage = "en" | "fr-CA";

export type ZonedLocalDateTimeResult =
  | Readonly<{ instant: string; status: "valid" }>
  | Readonly<{ status: "ambiguous" | "invalid" }>;

function normalized(value: string | null | undefined): string {
  return (value ?? "").trim().toLocaleLowerCase("en-CA");
}

function termMatches(value: string | null, terms: readonly string[]): boolean {
  if (terms.length === 0) return true;
  const haystack = normalized(value);
  return terms.some((term) => {
    const needle = normalized(term);
    return needle.length > 0 && haystack.includes(needle);
  });
}

function urgencyScore(lead: PriorityLead): number {
  if (lead.slaState === "overdue") return 100;
  if (lead.qualityLevel === "needs_info") return 86;
  if (lead.status === "new") return 80;
  if (lead.status === "follow_up_needed") return 72;
  return 20;
}

export function priorityRuleMatches(
  lead: PriorityLead,
  rule: PriorityRule,
): boolean {
  return (
    rule.isActive &&
    termMatches(lead.service, rule.serviceTerms) &&
    termMatches(lead.area, rule.areaTerms)
  );
}

export function getPriorityMatch(
  lead: PriorityLead,
  rules: readonly PriorityRule[],
): PriorityMatch {
  const matches = rules
    .filter((rule) => priorityRuleMatches(lead, rule))
    .sort(
      (left, right) =>
        left.priorityRank - right.priorityRank || left.name.localeCompare(right.name),
    );

  return {
    matchingRuleIds: matches.map((rule) => rule.id),
    priorityRank: matches[0]?.priorityRank ?? null,
  };
}

export function rankLeadsByPriority<T extends PriorityLead>(input: {
  leads: readonly T[];
  rules: readonly PriorityRule[];
}): Array<T & { priority: PriorityMatch }> {
  return input.leads
    .map((lead) => ({
      ...lead,
      priority: getPriorityMatch(lead, input.rules),
    }))
    .sort((left, right) => {
      const leftRank = left.priority.priorityRank ?? Number.MAX_SAFE_INTEGER;
      const rightRank = right.priority.priorityRank ?? Number.MAX_SAFE_INTEGER;
      if (leftRank !== rightRank) return leftRank - rightRank;

      const urgencyDifference = urgencyScore(right) - urgencyScore(left);
      if (urgencyDifference !== 0) return urgencyDifference;

      return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
    });
}

function parseTime(value: string): { hours: number; minutes: number } | null {
  const match = /^(?:[01]\d|2[0-3]):[0-5]\d$/.exec(value.trim());
  if (!match) return null;
  const [hours, minutes] = value.split(":").map(Number) as [number, number];
  return Number.isInteger(hours) && Number.isInteger(minutes)
    ? { hours, minutes }
    : null;
}

type LocalDateTimeParts = Readonly<{
  day: number;
  hour: number;
  minute: number;
  month: number;
  year: number;
}>;

function readLocalDateTimeParts(value: string): LocalDateTimeParts | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(value.trim());
  if (!match) return null;
  const [, yearText, monthText, dayText, hourText, minuteText] = match;
  const parts = {
    day: Number(dayText),
    hour: Number(hourText),
    minute: Number(minuteText),
    month: Number(monthText),
    year: Number(yearText),
  };
  const utc = new Date(
    Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute),
  );
  if (
    utc.getUTCFullYear() !== parts.year ||
    utc.getUTCMonth() + 1 !== parts.month ||
    utc.getUTCDate() !== parts.day ||
    utc.getUTCHours() !== parts.hour ||
    utc.getUTCMinutes() !== parts.minute
  ) {
    return null;
  }
  return parts;
}

function zonedPartsAt(instant: Date, timeZone: string): LocalDateTimeParts | null {
  try {
    const values = new Map(
      new Intl.DateTimeFormat("en-CA", {
        calendar: "gregory",
        day: "2-digit",
        hour: "2-digit",
        hourCycle: "h23",
        minute: "2-digit",
        month: "2-digit",
        numberingSystem: "latn",
        timeZone,
        year: "numeric",
      })
        .formatToParts(instant)
        .filter((part) => part.type !== "literal")
        .map((part) => [part.type, part.value]),
    );
    return {
      day: Number(values.get("day")),
      hour: Number(values.get("hour")),
      minute: Number(values.get("minute")),
      month: Number(values.get("month")),
      year: Number(values.get("year")),
    };
  } catch {
    return null;
  }
}

function sameLocalDateTime(
  left: LocalDateTimeParts | null,
  right: LocalDateTimeParts,
): boolean {
  return Boolean(
    left &&
      left.year === right.year &&
      left.month === right.month &&
      left.day === right.day &&
      left.hour === right.hour &&
      left.minute === right.minute,
  );
}

/**
 * Converts a browser `datetime-local` value into an instant without relying on
 * the server process timezone. A DST gap has no matching instant; a fall-back
 * overlap has two, so both are rejected until the manager chooses an exact,
 * unambiguous local time.
 */
export function parseZonedLocalDateTime(input: {
  timeZone: string;
  value: string;
}): ZonedLocalDateTimeResult {
  const wanted = readLocalDateTimeParts(input.value);
  const timeZone = input.timeZone.trim();
  if (!wanted || !timeZone) return { status: "invalid" };

  const naiveUtc = Date.UTC(
    wanted.year,
    wanted.month - 1,
    wanted.day,
    wanted.hour,
    wanted.minute,
  );
  const offsets = new Set<number>();
  for (let hours = -36; hours <= 36; hours += 6) {
    const probe = new Date(naiveUtc + hours * 60 * 60_000);
    const local = zonedPartsAt(probe, timeZone);
    if (!local) return { status: "invalid" };
    offsets.add(
      Date.UTC(local.year, local.month - 1, local.day, local.hour, local.minute) -
        probe.getTime(),
    );
  }

  const matches = [...offsets]
    .map((offset) => new Date(naiveUtc - offset))
    .filter((candidate) => sameLocalDateTime(zonedPartsAt(candidate, timeZone), wanted))
    .map((candidate) => candidate.toISOString());
  const uniqueMatches = [...new Set(matches)];
  if (uniqueMatches.length === 0) return { status: "invalid" };
  if (uniqueMatches.length > 1) return { status: "ambiguous" };
  return { instant: uniqueMatches[0]!, status: "valid" };
}

const namedTimeWindows: Readonly<Record<string, Readonly<{
  endsAt: string;
  label: string;
  startsAt: string;
}>>> = {
  afternoon: {
    endsAt: "17:00",
    label: "Afternoon",
    startsAt: "12:00",
  },
  evening: {
    endsAt: "21:00",
    label: "Evening",
    startsAt: "17:00",
  },
  morning: {
    endsAt: "12:00",
    label: "Morning",
    startsAt: "08:00",
  },
};

function normalizedWindowKey(value: string): string {
  return value.trim().toLocaleLowerCase("en-CA");
}

function parseNamedTimeWindow(value: string): Readonly<{
  endsAt: string;
  startsAt: string;
}> | null {
  const named = namedTimeWindows[normalizedWindowKey(value)];
  return named ? { endsAt: named.endsAt, startsAt: named.startsAt } : null;
}

function toIsoAtUtc(date: string, time: string): string | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !parseTime(time)) return null;
  const candidate = new Date(`${date}T${time}:00.000Z`);
  return Number.isNaN(candidate.getTime()) ? null : candidate.toISOString();
}

/**
 * Interprets canonical 24-hour values and the public form's named default
 * windows. Named windows deliberately remain non-exact in downstream copy,
 * so an overlap prompts human review rather than a false availability claim.
 */
export function parseRequestedTimeWindow(input: {
  date: string | null | undefined;
  defaultDurationMinutes?: number;
  timeZone?: string;
  timeWindow: string | null | undefined;
}): RequestedTimeWindow | null {
  const date = input.date?.trim() ?? "";
  const rawTime = input.timeWindow?.trim() ?? "";
  const match = /^(\d{2}:\d{2})(?:\s*(?:-|–|to)\s*(\d{2}:\d{2}))?$/i.exec(
    rawTime,
  );
  const namedWindow = !match ? parseNamedTimeWindow(rawTime) : null;
  if (!match && !namedWindow) return null;

  const startLocalTime = match?.[1] ?? namedWindow?.startsAt ?? "";
  const parsedStart = input.timeZone
    ? parseZonedLocalDateTime({
        timeZone: input.timeZone,
        value: `${date}T${startLocalTime}`,
      })
    : null;
  const startsAt = input.timeZone
    ? parsedStart?.status === "valid"
      ? parsedStart.instant
      : null
    : toIsoAtUtc(date, startLocalTime);
  if (!startsAt) return null;

  const endLocalTime = match?.[2] ?? namedWindow?.endsAt;
  const parsedEnd = input.timeZone && endLocalTime
    ? parseZonedLocalDateTime({
        timeZone: input.timeZone,
        value: `${date}T${endLocalTime}`,
      })
    : null;
  const endsAt = endLocalTime
    ? input.timeZone
      ? parsedEnd?.status === "valid"
        ? parsedEnd.instant
        : null
      : toIsoAtUtc(date, endLocalTime)
    : new Date(
        new Date(startsAt).getTime() +
          Math.max(15, input.defaultDurationMinutes ?? 60) * 60_000,
      ).toISOString();

  if (!endsAt || new Date(endsAt).getTime() <= new Date(startsAt).getTime()) {
    return null;
  }

  return { endsAt, startsAt };
}

/**
 * Only a canonical numeric time is considered exact. Named default windows
 * are intentionally treated as a possible overlap, never as a confirmed
 * unavailability or a concrete next-slot promise.
 */
export function isExactRequestedTimeWindow(
  value: string | null | undefined,
): boolean {
  return /^(\d{2}:\d{2})(?:\s*(?:-|–|to)\s*(\d{2}:\d{2}))?$/i.test(
    value?.trim() ?? "",
  );
}

export function formatRequestedTimeWindowLabel(
  value: string | null | undefined,
  language: CustomerFacingDraftLanguage = "en",
): string {
  const raw = value?.trim() ?? "";
  const named = namedTimeWindows[normalizedWindowKey(raw)];
  const localizedLabel =
    language === "fr-CA"
      ? {
          Afternoon: "Après-midi",
          Evening: "Soir",
          Morning: "Matin",
        }[named?.label ?? ""]
      : named?.label;
  return named
    ? `${localizedLabel ?? named.label} (${named.startsAt}–${named.endsAt} ${
        language === "fr-CA" ? "heure locale" : "local time"
      })`
    : raw;
}

export function timeRangesOverlap(input: {
  leftEnd: string;
  leftStart: string;
  rightEnd: string;
  rightStart: string;
}): boolean {
  const leftStart = new Date(input.leftStart).getTime();
  const leftEnd = new Date(input.leftEnd).getTime();
  const rightStart = new Date(input.rightStart).getTime();
  const rightEnd = new Date(input.rightEnd).getTime();

  if (
    [leftStart, leftEnd, rightStart, rightEnd].some((value) =>
      Number.isNaN(value),
    )
  ) {
    return false;
  }

  return leftStart < rightEnd && rightStart < leftEnd;
}

export function findConflictingTimeBlocks(input: {
  blocks: readonly InternalTimeBlock[];
  requested: RequestedTimeWindow;
}): InternalTimeBlock[] {
  return input.blocks.filter(
    (block) =>
      block.status !== "cancelled" &&
      timeRangesOverlap({
        leftEnd: input.requested.endsAt,
        leftStart: input.requested.startsAt,
        rightEnd: block.endsAt,
        rightStart: block.startsAt,
      }),
  );
}

/**
 * Finds the first contiguous internal opening after a requested start. It only
 * considers saved internal blocks; it never implies public availability or a
 * confirmed booking.
 */
export function findFirstInternalOpening(input: {
  blocks: readonly InternalTimeBlock[];
  durationMinutes: number;
  from: string;
  until?: string;
}): RequestedTimeWindow | null {
  const from = new Date(input.from).getTime();
  const until = input.until ? new Date(input.until).getTime() : null;
  if (Number.isNaN(from) || (until !== null && Number.isNaN(until))) return null;
  const duration = Math.max(15, input.durationMinutes) * 60_000;
  const sorted = input.blocks
    .filter((block) => block.status !== "cancelled")
    .map((block) => ({
      ...block,
      end: new Date(block.endsAt).getTime(),
      start: new Date(block.startsAt).getTime(),
    }))
    .filter((block) => !Number.isNaN(block.start) && !Number.isNaN(block.end))
    .sort((left, right) => left.start - right.start);

  let candidateStart = from;
  for (let attempts = 0; attempts < 512; attempts += 1) {
    const candidateEnd = candidateStart + duration;
    if (until !== null && candidateEnd > until) return null;
    const conflict = sorted.find(
      (block) => candidateStart < block.end && block.start < candidateEnd,
    );
    if (!conflict) {
      return {
        endsAt: new Date(candidateEnd).toISOString(),
        startsAt: new Date(candidateStart).toISOString(),
      };
    }
    candidateStart = Math.max(candidateStart, conflict.end);
  }

  return null;
}

export function renderAvailabilityReviewDraft(input: {
  customerName: string | null;
  isExactTime: boolean;
  language?: CustomerFacingDraftLanguage;
  requestedTimeLabel: string;
  suggestedTimeLabel: string | null;
}): string {
  const name = input.customerName?.trim() || "there";

  if (input.language === "fr-CA") {
    if (!input.isExactTime) {
      return `Bonjour ${name}, merci pour votre demande. Nous vérifions les disponibilités pour votre plage souhaitée (${input.requestedTimeLabel}) et aucune heure n'est confirmée pour le moment. Dites-nous ce qui vous convient et nous confirmerons manuellement la prochaine étape.`;
    }

    const alternative = input.suggestedTimeLabel
      ? ` La première plage interne que nous pouvons vérifier est ${input.suggestedTimeLabel}.`
      : " Nous vérifions la prochaine plage appropriée.";

    return `Bonjour ${name}, merci pour votre demande. Nous sommes complets à l'heure demandée (${input.requestedTimeLabel}).${alternative} Dites-nous ce qui vous convient et nous confirmerons manuellement la prochaine étape.`;
  }

  if (!input.isExactTime) {
    return `Hi ${name}, thank you for your request. We are reviewing availability for your preferred window (${input.requestedTimeLabel}) and have not confirmed a time yet. Please let us know what works for you and we will confirm the next step manually.`;
  }

  const alternative = input.suggestedTimeLabel
    ? ` The first internal opening we can review is ${input.suggestedTimeLabel}.`
    : " We are reviewing the next suitable opening.";

  return `Hi ${name}, thank you for your request. We are fully occupied at the requested time (${input.requestedTimeLabel}).${alternative} Please let us know what works for you and we will confirm the next step manually.`;
}

export function renderBulkDraft(input: {
  customerName: string | null;
  service: string | null;
  template: string;
}): string {
  const firstName = input.customerName?.trim().split(/\s+/)[0] || "there";
  const service = input.service?.trim() || "your request";

  return input.template
    .replaceAll("{{firstName}}", firstName)
    .replaceAll("{{service}}", service)
    .replaceAll("{{customerName}}", input.customerName?.trim() || "there")
    .trim();
}

export function isTerminalLeadStatus(status: string): boolean {
  return status === "archived" || status === "booked" || status === "lost";
}
