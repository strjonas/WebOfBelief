import "server-only";
import { Redis } from "@upstash/redis";
import type { FeedbackEntry, NormalizedFeedback } from "@/lib/feedback-shape";

export type { FeedbackEntry, NormalizedFeedback } from "@/lib/feedback-shape";

/**
 * Visitor feedback storage, in the same Upstash Redis instance the analytics
 * use (connected under the WOB_STORAGE_ env prefix).
 *
 * IMPORTANT: that instance is SHARED with another project, so — exactly like
 * stats-store.ts — every key we touch is namespaced, here with `wob:feedback:`.
 * Never write keys outside key().
 *
 * Pure validation lives in feedback-shape.ts (unit-tested); this file is just
 * the Redis I/O plus a small rate limit.
 */

const KEY_PREFIX = "wob:feedback:";
const key = (suffix: string) => `${KEY_PREFIX}${suffix}`;

/** Capped log of recent messages, newest first. */
const LIST_KEY = key("entries");
/** Keep at most this many; older ones fall off the end on each write. */
const LIST_CAP = 1000;

/** Rate limit: at most this many submissions per IP per window. */
const RL_LIMIT = 5;
const RL_WINDOW_SECONDS = 60;

let client: Redis | null = null;

/** Lazily build the client from the WOB_STORAGE_ REST pair; null if absent. */
function redis(): Redis | null {
  const url = process.env.WOB_STORAGE_KV_REST_API_URL;
  const token = process.env.WOB_STORAGE_KV_REST_API_TOKEN;
  if (!url || !token) return null;
  if (!client) client = new Redis({ url, token });
  return client;
}

/**
 * Per-IP fixed-window rate limit. Returns true when the caller is allowed.
 * Fails open (returns true) when Redis is unavailable or errors — we would
 * rather accept feedback than drop it over an infra hiccup.
 */
export async function withinRateLimit(ip: string): Promise<boolean> {
  const r = redis();
  if (!r) return true;
  try {
    const rlKey = key(`rl:${ip}`);
    const count = await r.incr(rlKey);
    if (count === 1) await r.expire(rlKey, RL_WINDOW_SECONDS);
    return count <= RL_LIMIT;
  } catch {
    return true;
  }
}

/**
 * Append one message to the capped log and bump a total counter. Never throws —
 * storage must not break the request. Returns false only when Redis is absent
 * so the route can tell the visitor their note couldn't be saved.
 */
export async function recordFeedback(
  feedback: NormalizedFeedback,
): Promise<boolean> {
  const r = redis();
  if (!r) return false;
  const entry: FeedbackEntry = { ...feedback, at: Date.now() };
  try {
    const pipe = r.pipeline();
    pipe.lpush(LIST_KEY, entry);
    pipe.ltrim(LIST_KEY, 0, LIST_CAP - 1);
    pipe.incr(key("total"));
    await pipe.exec();
    return true;
  } catch {
    return false;
  }
}

/**
 * Read the most recent messages (newest first) for the admin view. Returns null
 * when Redis isn't configured so the page can show a setup hint.
 */
export async function readFeedback(limit = 200): Promise<FeedbackEntry[] | null> {
  const r = redis();
  if (!r) return null;
  try {
    const rows = await r.lrange<FeedbackEntry>(LIST_KEY, 0, limit - 1);
    return rows.filter(
      (row): row is FeedbackEntry =>
        Boolean(row) && typeof row.text === "string",
    );
  } catch {
    return null;
  }
}
