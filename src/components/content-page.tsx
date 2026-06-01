import type { ReactNode } from "react";
import Link from "next/link";

interface ContentPageProps {
  /** Small uppercase eyebrow above the title, e.g. "guide" or "legal". */
  eyebrow: string;
  title: string;
  /** Optional standfirst paragraph under the title. */
  lede?: ReactNode;
  /** Back-link target; defaults to the home page / the check. */
  backHref?: string;
  backLabel?: string;
  children: ReactNode;
}

/**
 * Shared masthead + measure for prose pages (guides, compare, legal, about).
 * Mirrors the layout of /method so every secondary page reads as part of the
 * same journal.
 */
export function ContentPage({
  eyebrow,
  title,
  lede,
  backHref = "/",
  backLabel = "← back to the check",
  children,
}: ContentPageProps) {
  return (
    <main className="flex-1">
      <div className="mx-auto w-full max-w-4xl px-6 py-14 sm:py-20 lg:px-8">
        <Link
          href={backHref}
          className="font-sans text-[0.78rem] uppercase tracking-[0.18em] text-muted underline decoration-rule underline-offset-[5px] transition hover:text-ink hover:decoration-ink"
        >
          {backLabel}
        </Link>

        <p className="mt-12 font-sans text-[0.72rem] uppercase tracking-[0.22em] text-mark">
          <span className="section-mark" />
          {eyebrow}
        </p>
        <h1 className="mt-5 font-serif text-[2.4rem] font-medium leading-[1.1] tracking-tight text-ink sm:text-[3rem]">
          {title}
        </h1>
        {lede ? (
          <div className="mt-5 max-w-3xl font-serif text-[1.12rem] leading-[1.65] text-ink-soft">
            {lede}
          </div>
        ) : null}

        <div className="mt-12">{children}</div>
      </div>
    </main>
  );
}

/**
 * A body section with a left rule and an optional eyebrow + heading, matching
 * the /method section style.
 */
export function Prose({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-5 font-serif text-[1.05rem] leading-[1.7] text-ink-soft [&_a]:text-mark [&_a]:underline [&_a]:decoration-mark/40 [&_a]:underline-offset-[3px] [&_a]:transition hover:[&_a]:decoration-mark [&_strong]:font-medium [&_strong]:text-ink [&_h2]:mt-12 [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:font-medium [&_h2]:leading-snug [&_h2]:tracking-tight [&_h2]:text-ink [&_h3]:mt-8 [&_h3]:font-serif [&_h3]:text-[1.2rem] [&_h3]:font-medium [&_h3]:text-ink [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-5">
      {children}
    </div>
  );
}
