/**
 * Pure shapes and validation for visitor feedback. No I/O and no dependency on
 * the belief data, so it can be unit-tested in isolation (see
 * feedback-shape.test.ts). The Redis side lives in feedback-store.ts.
 *
 * Privacy contract: feedback carries only what the visitor *typed*, plus —
 * for the per-statement kinds — which statement they were looking at. It never
 * carries their answers. The general box deliberately drops any beliefId.
 */

export const FEEDBACK_KINDS = [
  "rephrase",
  "missing-position",
  "general",
] as const;

export type FeedbackKind = (typeof FEEDBACK_KINDS)[number];

/** Below this (after trimming) the message is treated as empty noise. */
export const MIN_TEXT_LENGTH = 2;
/** Above this we clamp rather than reject, so a long message is never lost. */
export const MAX_TEXT_LENGTH = 2000;

/** A validated message, before the server stamps it with a time. */
export interface NormalizedFeedback {
  kind: FeedbackKind;
  /** The statement in view, for the per-statement kinds; null for general. */
  beliefId: string | null;
  text: string;
}

/** A stored message: the normalized content plus its arrival time (epoch ms). */
export interface FeedbackEntry extends NormalizedFeedback {
  at: number;
}

export function isFeedbackKind(value: unknown): value is FeedbackKind {
  return (
    typeof value === "string" &&
    (FEEDBACK_KINDS as readonly string[]).includes(value)
  );
}

/**
 * Validate and normalize an untrusted request body into a {@link
 * NormalizedFeedback}, or return null if it can't be salvaged.
 *
 * - `kind` must be one of {@link FEEDBACK_KINDS}.
 * - `text` is trimmed, rejected if shorter than {@link MIN_TEXT_LENGTH}, and
 *   clamped to {@link MAX_TEXT_LENGTH} rather than rejected when too long.
 * - `beliefId` is required and must be known for the per-statement kinds; for
 *   `general` it is always dropped to null (the general box is answer-free).
 *
 * `isKnownBelief` is injected so this module stays free of the belief data.
 */
export function normalizeFeedback(
  raw: unknown,
  isKnownBelief: (id: string) => boolean,
): NormalizedFeedback | null {
  if (typeof raw !== "object" || raw === null) return null;
  const body = raw as { kind?: unknown; beliefId?: unknown; text?: unknown };

  if (!isFeedbackKind(body.kind)) return null;

  if (typeof body.text !== "string") return null;
  const text = body.text.trim().slice(0, MAX_TEXT_LENGTH);
  if (text.length < MIN_TEXT_LENGTH) return null;

  if (body.kind === "general") {
    return { kind: "general", beliefId: null, text };
  }

  // rephrase / missing-position are anchored to a specific statement.
  if (typeof body.beliefId !== "string" || !isKnownBelief(body.beliefId)) {
    return null;
  }
  return { kind: body.kind, beliefId: body.beliefId, text };
}
