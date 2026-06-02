import { describe, expect, it } from "vitest";
import {
  COUNTED_EVENTS,
  isCountedEvent,
  parseStatsResult,
  recentDays,
} from "./stats-shape";

/**
 * Builds a pipeline result array in the exact order stats-store.readStats
 * issues commands: for each event → [GET total, HGETALL daily], then
 * HGETALL steps, then HGETALL badge_via.
 */
function buildPipelineResult(
  perEvent: Record<string, { total: unknown; daily?: Record<string, unknown> }>,
  steps: Record<string, unknown> | null,
  badgeVia: Record<string, unknown> | null,
): unknown[] {
  const res: unknown[] = [];
  for (const event of COUNTED_EVENTS) {
    const entry = perEvent[event] ?? { total: 0 };
    res.push(entry.total);
    res.push(entry.daily ?? {});
  }
  res.push(steps);
  res.push(badgeVia);
  return res;
}

describe("isCountedEvent", () => {
  it("accepts known events and rejects everything else", () => {
    expect(isCountedEvent("check_started")).toBe(true);
    expect(isCountedEvent("results_viewed")).toBe(true);
    expect(isCountedEvent("evil_inject_key")).toBe(false);
    expect(isCountedEvent(42)).toBe(false);
    expect(isCountedEvent(undefined)).toBe(false);
  });
});

describe("recentDays", () => {
  it("returns the requested number of day buckets, oldest first", () => {
    const days = recentDays(14);
    expect(days).toHaveLength(14);
    expect(days[0] < days[13]).toBe(true);
    for (const d of days) expect(d).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe("parseStatsResult", () => {
  const dayBuckets = ["2026-05-31", "2026-06-01", "2026-06-02"];

  it("maps totals, daily series, steps and badge breakdown by position", () => {
    const res = buildPipelineResult(
      {
        home_viewed: {
          total: 100,
          daily: { "2026-05-31": 30, "2026-06-02": 20 },
        },
        check_started: { total: 40, daily: { "2026-06-01": 5 } },
        results_viewed: { total: 12 },
      },
      { "1": 40, "2": 25, "3": 9 },
      { share: 3, download: 2, copy: 1 },
    );

    const snap = parseStatsResult(res, dayBuckets);

    // Totals land on the right event despite GET/HGETALL interleaving.
    expect(snap.totals.home_viewed).toBe(100);
    expect(snap.totals.check_started).toBe(40);
    expect(snap.totals.results_viewed).toBe(12);
    expect(snap.totals.compare_completed).toBe(0);

    // Daily series is aligned to the requested buckets, missing days → 0.
    expect(snap.series.days).toEqual(dayBuckets);
    expect(snap.series.byEvent.home_viewed).toEqual([30, 0, 20]);
    expect(snap.series.byEvent.check_started).toEqual([0, 5, 0]);

    // Steps come back sorted ascending with numeric keys.
    expect(snap.steps).toEqual([
      { step: 1, count: 40 },
      { step: 2, count: 25 },
      { step: 3, count: 9 },
    ]);

    expect(snap.badgeVia).toEqual({ share: 3, download: 2, copy: 1 });
  });

  it("coerces string counts (Upstash may return strings) to numbers", () => {
    const res = buildPipelineResult(
      { home_viewed: { total: "77", daily: { "2026-06-02": "9" } } },
      { "2": "14" },
      { copy: "4" },
    );
    const snap = parseStatsResult(res, dayBuckets);
    expect(snap.totals.home_viewed).toBe(77);
    expect(snap.series.byEvent.home_viewed).toEqual([0, 0, 9]);
    expect(snap.steps).toEqual([{ step: 2, count: 14 }]);
    expect(snap.badgeVia).toEqual({ copy: 4 });
  });

  it("handles empty/null hashes and missing counters as zeros", () => {
    const res = buildPipelineResult({}, null, null);
    const snap = parseStatsResult(res, dayBuckets);
    for (const event of COUNTED_EVENTS) {
      expect(snap.totals[event]).toBe(0);
      expect(snap.series.byEvent[event]).toEqual([0, 0, 0]);
    }
    expect(snap.steps).toEqual([]);
    expect(snap.badgeVia).toEqual({});
  });
});
