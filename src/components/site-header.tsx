import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-rule">
      <div className="mx-auto flex w-full max-w-6xl items-baseline justify-between gap-6 px-6 py-5 lg:px-8">
        <Link
          href="/"
          className="group flex items-baseline gap-3 text-ink"
          aria-label="Web of Belief, home"
        >
          <span className="font-mono text-[0.68rem] uppercase tracking-[0.28em] text-mark">
            vol. i
          </span>
          <span className="font-serif text-xl font-medium leading-none tracking-tight">
            Web of Belief
          </span>
          <span className="hidden font-sans text-[0.65rem] uppercase tracking-[0.22em] text-muted sm:inline">
            a consistency check
          </span>
        </Link>
        <nav
          aria-label="Main"
          className="flex items-baseline gap-6 font-sans text-[0.78rem] uppercase tracking-[0.16em]"
        >
          <Link
            href="/#check"
            className="text-ink-soft transition hover:text-mark"
          >
            Start
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
            className="hidden text-muted transition hover:text-mark sm:inline"
          >
            GitHub
          </a>
        </nav>
      </div>
    </header>
  );
}
