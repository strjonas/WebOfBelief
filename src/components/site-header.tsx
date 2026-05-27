import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-3 text-sm font-semibold tracking-tight text-slate-950"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-950 font-mono text-xs text-white">
            BM
          </span>
          Belief Mirror
        </Link>
        <nav aria-label="Main" className="flex items-center gap-5 text-sm">
          <a
            href="https://github.com/strjonas/consistent"
            target="_blank"
            rel="noreferrer"
            className="hidden text-slate-600 transition hover:text-slate-950 sm:inline"
          >
            GitHub
          </a>
          <Link
            href="/#check"
            className="text-slate-600 transition hover:text-slate-950"
          >
            Start check
          </Link>
          <Link
            href="/method"
            className="rounded-lg border border-slate-300 px-4 py-2 text-slate-700 transition hover:border-slate-500 hover:text-slate-950"
          >
            Method and sources
          </Link>
        </nav>
      </div>
    </header>
  );
}
