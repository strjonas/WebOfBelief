import { isCountedEvent, recordEvent } from "@/lib/stats-store";

export const runtime = "nodejs";

/**
 * Funnel-event ingest. The client (src/lib/analytics.ts) posts
 * `{ name, props? }` here on each step so we can build our own conversion
 * dashboard at /admin/analytics — Vercel Web Analytics shows the same events
 * but won't compute funnel rates.
 *
 * Unknown event names are ignored (the allowlist lives in stats-store), so this
 * public endpoint can only ever bump our own, fixed set of counters. Payloads
 * carry progress only, never answer content.
 */
export async function POST(request: Request): Promise<Response> {
  try {
    const body = (await request.json()) as {
      name?: unknown;
      props?: { step?: number; via?: string };
    };
    if (isCountedEvent(body.name)) {
      await recordEvent(body.name, body.props);
    }
  } catch {
    // Malformed body — ignore. Never surface ingest errors to visitors.
  }
  // Always 204: the response is irrelevant to the visitor's experience.
  return new Response(null, { status: 204 });
}
