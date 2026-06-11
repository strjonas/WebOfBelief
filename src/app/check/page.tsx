import type { Metadata } from "next";
import { BeliefCheckerBoundary } from "@/components/belief-checker-boundary";
import { BeliefChecker } from "@/components/belief-checker";
import { checkEntry } from "@/lib/content";
import { checkStepCount } from "@/lib/check-flow";

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
      <div className="mx-auto w-full max-w-4xl px-6 lg:px-8">
        <header className="border-b border-rule pb-7 pt-10 sm:pt-12">
          <h1 className="font-serif text-3xl font-medium leading-tight tracking-tight text-ink sm:text-4xl">
            The check
          </h1>
          <p className="mt-3 max-w-2xl font-serif text-[1.02rem] leading-7 text-ink-soft">
            {`${checkStepCount} questions`}, about five minutes. Most let you
            hold several positions at once, or none — and you can skip
            anything. No login; your answers stay in this browser.
          </p>
        </header>
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
