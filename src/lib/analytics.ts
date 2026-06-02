import { track } from "@vercel/analytics";

/**
 * Funnel events for Vercel Web Analytics. These let you answer, in the Vercel
 * dashboard: do people start the check or bounce off the hero? How far do they
 * get before leaving? Do they reach results? Do they share?
 *
 * Privacy contract: event payloads carry only *progress* — which step was
 * reached — never which statements a person affirmed. This matches the promise
 * made on /privacy and /method. Do not add answer-derived fields here.
 */
export type FunnelEvent =
  | { name: "home_viewed"; props?: never }
  | { name: "begin_cta_click"; props?: never }
  | { name: "check_started"; props?: never }
  | { name: "topic_advanced"; props: { topic: string; step: number } }
  | { name: "results_viewed"; props?: never }
  | { name: "check_reset"; props?: never }
  | { name: "summary_copied"; props?: never }
  | { name: "badge_shared"; props: { via: "share" | "download" | "copy" } }
  | { name: "compare_link_created"; props?: never }
  | { name: "compare_viewed"; props?: never }
  | { name: "compare_completed"; props?: never };

export function trackEvent(event: FunnelEvent): void {
  try {
    if ("props" in event && event.props) {
      track(event.name, event.props);
    } else {
      track(event.name);
    }
  } catch {
    // Analytics must never break the app.
  }
  sendToStore(event);
}

/**
 * Mirror the event to our own ingest endpoint (/api/stat) so the protected
 * dashboard at /admin/analytics can compute funnel conversion rates — Vercel's
 * dashboard records the same events but won't do the funnel math. Fire-and-
 * forget with keepalive so it survives the page unloading on the last step.
 */
function sendToStore(event: FunnelEvent): void {
  if (typeof window === "undefined") return;
  try {
    const payload =
      "props" in event && event.props
        ? { name: event.name, props: event.props }
        : { name: event.name };
    void fetch("/api/stat", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {});
  } catch {
    // Never let analytics break the app.
  }
}
