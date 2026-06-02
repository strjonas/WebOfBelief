/**
 * Pure shapes and parsing for the funnel dashboard — no Redis, no server-only,
 * so it's unit-testable. The Redis I/O lives in stats-store.ts, which reuses
 * this. The pipeline read order in stats-store MUST match what
 * parseStatsResult expects (documented below).
 *
 * Privacy contract: progress only — which step was reached, how far people get.
 * Never anything answer-derived. (Mirrors /privacy, /method, analytics.ts.)
 */

/**
 * The events we tally. Anything not in this list is ignored on ingest, so the
 * public ingest endpoint can't be used to create arbitrary keys.
 */
export const COUNTED_EVENTS = [
  "home_viewed",
  "begin_cta_click",
  "check_started",
  "topic_advanced",
  "results_viewed",
  "check_reset",
  "summary_copied",
  "badge_shared",
  "compare_link_created",
  "compare_viewed",
  "compare_completed",
] as const;

export type CountedEvent = (typeof COUNTED_EVENTS)[number];

export function isCountedEvent(name: unknown): name is CountedEvent {
  return (
    typeof name === "string" &&
    (COUNTED_EVENTS as readonly string[]).includes(name)
  );
}

export type StatsSnapshot = {
  /** All-time total per event. */
  totals: Record<CountedEvent, number>;
  /** Per-event daily counts for the requested days, oldest→newest. */
  series: { days: string[]; byEvent: Record<CountedEvent, number[]> };
  /** How far people advance: step number → count reaching that step. */
  steps: Array<{ step: number; count: number }>;
  /** Badge share method → count. */
  badgeVia: Record<string, number>;
};

/** UTC day bucket, e.g. "2026-06-02". Keeps the daily series timezone-stable. */
export function utcDay(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

/** The last `days` UTC day buckets, oldest first. */
export function recentDays(days: number): string[] {
  const out: string[] = [];
  const now = Date.now();
  for (let i = days - 1; i >= 0; i--) {
    out.push(utcDay(new Date(now - i * 86_400_000)));
  }
  return out;
}

export function toNumber(value: unknown): number {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : 0;
}

/**
 * Build a snapshot from a Redis pipeline result. The pipeline must have run, in
 * order: for each event in COUNTED_EVENTS → [GET total, HGETALL daily], then
 * HGETALL steps, then HGETALL badge_via.
 */
export function parseStatsResult(
  res: readonly unknown[],
  dayBuckets: string[],
): StatsSnapshot {
  const totals = {} as Record<CountedEvent, number>;
  const byEvent = {} as Record<CountedEvent, number[]>;

  let i = 0;
  for (const event of COUNTED_EVENTS) {
    totals[event] = toNumber(res[i++]);
    const daily = (res[i++] ?? {}) as Record<string, unknown> | null;
    byEvent[event] = dayBuckets.map((d) => toNumber(daily?.[d]));
  }

  const stepsHash = (res[i++] ?? {}) as Record<string, unknown> | null;
  const steps = Object.entries(stepsHash ?? {})
    .map(([step, count]) => ({ step: Number(step), count: toNumber(count) }))
    .filter((s) => Number.isFinite(s.step))
    .sort((a, b) => a.step - b.step);

  const badgeViaHash = (res[i++] ?? {}) as Record<string, unknown> | null;
  const badgeVia: Record<string, number> = {};
  for (const [via, count] of Object.entries(badgeViaHash ?? {})) {
    badgeVia[via] = toNumber(count);
  }

  return { totals, series: { days: dayBuckets, byEvent }, steps, badgeVia };
}
