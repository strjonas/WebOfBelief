"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics";

/**
 * The "Begin the check" call to action. It links to the dedicated /check page
 * (the propositions live there, apart from the home page's engine explanation),
 * with a click event that lets you see, in Vercel Analytics, how many visitors
 * click to begin vs. bounce — and, combined with `check_started`, how many
 * click but never answer.
 */
export function BeginCheckLink({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link
      href="/check"
      className={className}
      onClick={() => trackEvent({ name: "begin_cta_click" })}
    >
      {children}
    </Link>
  );
}
