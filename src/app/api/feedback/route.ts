import { statementById } from "@/lib/beliefs";
import { normalizeFeedback } from "@/lib/feedback-shape";
import { recordFeedback, withinRateLimit } from "@/lib/feedback-store";

export const runtime = "nodejs";

const isKnownBelief = (id: string) => id in statementById;

/** Best-effort client IP for rate limiting; "unknown" buckets everyone together. */
function clientIp(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

/**
 * Visitor feedback ingest. The client (src/components/belief-feedback.tsx)
 * posts `{ kind, beliefId?, text }`. We validate against feedback-shape, rate
 * limit per IP, and append to the capped log read by /admin/analytics.
 *
 * Unlike /api/stat this returns a small JSON body so the form can confirm or
 * report failure to the visitor.
 */
export async function POST(request: Request): Promise<Response> {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return Response.json({ ok: false, error: "bad-request" }, { status: 400 });
  }

  const feedback = normalizeFeedback(raw, isKnownBelief);
  if (!feedback) {
    return Response.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  if (!(await withinRateLimit(clientIp(request)))) {
    return Response.json({ ok: false, error: "rate-limited" }, { status: 429 });
  }

  const stored = await recordFeedback(feedback);
  if (!stored) {
    return Response.json(
      { ok: false, error: "unavailable" },
      { status: 503 },
    );
  }

  return Response.json({ ok: true });
}
