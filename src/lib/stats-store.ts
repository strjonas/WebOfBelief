import "server-only";
import { Redis } from "@upstash/redis";
import {
  COUNTED_EVENTS,
  parseStatsResult,
  recentDays,
  utcDay,
  type CountedEvent,
  type StatsSnapshot,
} from "@/lib/stats-shape";

/**
 * Server-side funnel counters, stored in the Upstash Redis instance connected
 * to this project under the WOB_STORAGE_ env prefix.
 *
 * IMPORTANT: this Redis instance is SHARED with another project. Every key we
 * touch is namespaced with `wob:stat:` so we can never read or clobber the
 * other project's keys. Do not write keys outside `key()`.
 *
 * Pure shapes/parsing live in stats-shape.ts (unit-tested); this file is just
 * the Redis I/O. The pipeline read order in readStats must match what
 * parseStatsResult expects.
 */

export {
  COUNTED_EVENTS,
  isCountedEvent,
  type CountedEvent,
  type StatsSnapshot,
} from "@/lib/stats-shape";

const KEY_PREFIX = "wob:stat:";
const key = (suffix: string) => `${KEY_PREFIX}${suffix}`;

let client: Redis | null = null;

/**
 * Lazily build the Redis client from the WOB_STORAGE_-prefixed REST env vars
 * (the standard Vercel/Upstash KV REST pair). Returns null when the vars are
 * absent (e.g. local dev without the integration's secrets) so callers degrade
 * quietly.
 */
function redis(): Redis | null {
  const url = process.env.WOB_STORAGE_KV_REST_API_URL;
  const token = process.env.WOB_STORAGE_KV_REST_API_TOKEN;
  if (!url || !token) return null;
  if (!client) client = new Redis({ url, token });
  return client;
}

type EventProps = { step?: number; via?: string };

/**
 * Record one funnel event. Increments an all-time total and a per-UTC-day
 * counter, plus two small breakdowns (how far people get; how they shared).
 * Fire-and-forget friendly — never throws.
 */
export async function recordEvent(
  name: CountedEvent,
  props?: EventProps,
): Promise<void> {
  const r = redis();
  if (!r) return;
  try {
    const today = utcDay();
    const pipe = r.pipeline();
    pipe.incr(key(`total:${name}`));
    pipe.hincrby(key(`daily:${name}`), today, 1);
    if (name === "topic_advanced" && typeof props?.step === "number") {
      // step histogram → drop-off curve ("how many answered N topics?")
      pipe.hincrby(key("steps"), String(props.step), 1);
    }
    if (name === "badge_shared" && typeof props?.via === "string") {
      pipe.hincrby(key("badge_via"), props.via, 1);
    }
    await pipe.exec();
  } catch {
    // Analytics must never break a request.
  }
}

/**
 * Read the whole dashboard snapshot in a single pipelined round trip. Returns
 * null when Redis isn't configured so the page can show a setup hint.
 */
export async function readStats(days = 14): Promise<StatsSnapshot | null> {
  const r = redis();
  if (!r) return null;

  const pipe = r.pipeline();
  for (const event of COUNTED_EVENTS) {
    pipe.get(key(`total:${event}`));
    pipe.hgetall(key(`daily:${event}`));
  }
  pipe.hgetall(key("steps"));
  pipe.hgetall(key("badge_via"));

  const res = (await pipe.exec()) as unknown[];
  return parseStatsResult(res, recentDays(days));
}
