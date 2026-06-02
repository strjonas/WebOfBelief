import type { Metadata } from "next";
import { BeliefCheckerBoundary } from "@/components/belief-checker-boundary";
import { BeliefChecker } from "@/components/belief-checker";
import { checkEntry } from "@/lib/content";

export const metadata: Metadata = {
  title: "Take the check",
  description: checkEntry.description,
  alternates: {
    canonical: "/check",
  },
  openGraph: {
    title: "Take the check | Web of Belief",
    description: checkEntry.description,
    type: "website",
  },
};

export default function CheckPage() {
  return (
    <main className="flex-1">
      <div className="mx-auto w-full max-w-6xl px-6 lg:px-8">
        <noscript>
          <p className="mt-12 border-l-2 border-mark bg-paper-soft px-5 py-4 font-serif text-[1rem] leading-7 text-ink-soft">
            This checker needs JavaScript enabled; you can still read the method
            and sources{" "}
            <a
              href="/method"
              className="underline decoration-mark decoration-2 underline-offset-[5px]"
            >
              here
            </a>
            .
          </p>
        </noscript>
        <BeliefCheckerBoundary>
          <BeliefChecker />
        </BeliefCheckerBoundary>
      </div>
    </main>
  );
}
