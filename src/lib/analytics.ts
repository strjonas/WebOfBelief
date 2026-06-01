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
  | { name: "begin_cta_click"; props?: never }
  | { name: "check_started"; props?: never }
  | { name: "topic_advanced"; props: { topic: string; step: number } }
  | { name: "results_viewed"; props?: never }
  | { name: "check_reset"; props?: never }
  | { name: "summary_copied"; props?: never }
  | { name: "badge_shared"; props: { via: "share" | "download" | "copy" } };

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
}
