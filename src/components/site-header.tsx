import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-rule">
      <div className="mx-auto flex w-full max-w-6xl items-baseline justify-between gap-4 px-6 py-5 sm:gap-6 lg:px-8">
        <Link
          href="/"
          className="group flex shrink-0 items-baseline gap-3 text-ink"
          aria-label="Web of Belief, home"
        >
          <span className="hidden font-mono text-[0.68rem] uppercase tracking-[0.28em] text-mark xs:inline">
            vol. i
          </span>
          <span className="whitespace-nowrap font-serif text-xl font-medium leading-none tracking-tight">
            Web of Belief
          </span>
          <span className="hidden font-sans text-[0.65rem] uppercase tracking-[0.22em] text-muted sm:inline">
            a consistency check
          </span>
        </Link>
        <nav
          aria-label="Main"
          className="flex shrink-0 items-center gap-4 font-sans text-[0.78rem] uppercase tracking-[0.16em] sm:gap-6"
        >
          <Link
            href="/compare-beliefs"
            className="hidden text-ink-soft transition hover:text-mark sm:inline"
          >
            Compare
          </Link>
          <Link
            href="/guides"
            className="text-ink-soft transition hover:text-mark"
          >
            Guides
          </Link>
          <Link
            href="/method"
            className="text-ink-soft transition hover:text-mark"
          >
            Method
          </Link>
          <a
            href="https://github.com/strjonas/consistent"
            target="_blank"
            rel="noreferrer"
            className="hidden text-muted transition hover:text-mark md:inline"
          >
            GitHub
          </a>
          <Link
            href="/check"
            className="border border-mark px-3.5 py-1.5 text-mark transition hover:bg-mark hover:text-paper"
          >
            Start
          </Link>
        </nav>
      </div>
    </header>
  );
}
