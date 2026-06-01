"use client";

import type { ReactNode } from "react";
import { trackEvent } from "@/lib/analytics";

/**
 * The hero "Begin the check" call to action. It's a plain anchor to #check
 * (so it still works without JS), with a click event that lets you see, in
 * Vercel Analytics, how many visitors click to begin vs. bounce off the hero —
 * and, combined with `check_started`, how many click but never answer.
 */
export function BeginCheckLink({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <a
      href="#check"
      className={className}
      onClick={() => trackEvent({ name: "begin_cta_click" })}
    >
      {children}
    </a>
  );
}
