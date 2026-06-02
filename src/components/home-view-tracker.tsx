"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

/**
 * Fires `home_viewed` once per browser session (guarded by sessionStorage),
 * so the dashboard has a stable "visitors" denominator for the funnel:
 * sessions → began → started answering → reached results. Renders nothing.
 */
export function HomeViewTracker() {
  useEffect(() => {
    try {
      if (sessionStorage.getItem("wob_home_seen")) return;
      sessionStorage.setItem("wob_home_seen", "1");
    } catch {
      // Private mode / storage disabled — still count the view.
    }
    trackEvent({ name: "home_viewed" });
  }, []);

  return null;
}
