import Link from "next/link";
import { BeliefChecker } from "@/components/belief-checker";

export default function Home() {
  return (
    <main className="flex-1">
      <section className="overflow-hidden border-b border-slate-200 bg-white">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 pb-12 pt-12 lg:grid-cols-[1fr_22rem] lg:px-8 lg:pb-16 lg:pt-16">
          <div>
            <p className="inline-flex rounded-full bg-teal-100 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-teal-950">
              19 statements | about 4 minutes
            </p>
            <h1 className="mt-6 max-w-4xl text-5xl font-semibold leading-[1.06] tracking-[-0.055em] text-slate-950 sm:text-6xl">
              Check whether your beliefs fit together.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Choose statements about God, morality, meaning, freedom,
              consciousness, and animals. See direct conflicts, serious
              tensions, and combinations that are coherent after all.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#check"
                className="rounded-lg bg-teal-800 px-7 py-4 text-base font-semibold text-white transition hover:bg-teal-900"
              >
                Start answering
              </a>
              <Link
                href="/method"
                className="text-sm font-semibold text-slate-600 underline decoration-slate-300 underline-offset-4 transition hover:text-slate-950"
              >
                How does it check?
              </Link>
            </div>
          </div>
          <aside className="rounded-3xl bg-slate-950 p-6 text-white shadow-xl shadow-slate-900/[0.08]">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-300">
              What happens
            </p>
            <ol className="mt-5 space-y-5 text-sm leading-6 text-slate-200">
              <li className="flex gap-3">
                <span className="font-bold text-teal-300">1</span>
                Select what you believe, reject, or are unsure about.
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-teal-300">2</span>
                Run the check on the statements you marked true.
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-teal-300">3</span>
                Inspect the reasons and source links behind each result.
              </li>
            </ol>
            <p className="mt-6 border-t border-white/10 pt-5 text-xs leading-5 text-slate-400">
              No login. Responses remain in your browser.
            </p>
          </aside>
        </div>
      </section>

      <div className="mx-auto w-full max-w-6xl px-6 lg:px-8">
        <BeliefChecker />
      </div>

      <section className="border-t border-slate-200 bg-slate-950 text-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col justify-between gap-8 px-6 py-12 lg:flex-row lg:items-center lg:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-300">
              Why these questions?
            </p>
            <h2 className="mt-3 max-w-xl text-2xl font-semibold tracking-tight">
              Chosen from major philosophical debates, checked against public
              relevance.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-stone-300">
              Topic selection uses the PhilPapers 2020 survey of philosophers
              and Pew Research Center&apos;s 2023-24 Religious Landscape Study.
              Explanations link directly to scholarly reference entries.
            </p>
          </div>
          <Link
            href="/method"
            className="w-fit rounded-lg bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-teal-50"
          >
            View method and sources
          </Link>
        </div>
      </section>
    </main>
  );
}
