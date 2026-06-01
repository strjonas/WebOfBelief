import Link from "next/link";
import { BeliefCheckerBoundary } from "@/components/belief-checker-boundary";
import { BeliefChecker } from "@/components/belief-checker";
import { BeliefWebDiagram } from "@/components/belief-web-diagram";
import { BeginCheckLink } from "@/components/begin-check-link";

export default function Home() {
  return (
    <main className="flex-1">
      {/* Masthead — a single horizontal page-wide bar like a journal header */}
      <section className="border-b border-rule">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-12 px-6 pt-12 pb-14 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:pt-16 lg:pb-20">
          <div className="flex flex-col justify-between gap-10">
            <div>
              <figure className="border-l border-mark pl-4">
                <blockquote className="font-serif text-[1.05rem] italic leading-7 text-ink-soft">
                  &ldquo;The unexamined life is not worth living for a human
                  being.&rdquo;
                </blockquote>
                <figcaption className="mt-1 font-sans text-[0.7rem] uppercase tracking-[0.18em] text-muted">
                  — Socrates, in Plato&apos;s <em>Apology</em>, 38a
                </figcaption>
              </figure>
              <h1 className="mt-8 font-serif text-[2.65rem] font-medium leading-[1.05] tracking-tight text-ink sm:text-[3.4rem]">
                Twenty-two beliefs.
                <br />
                <span className="text-ink-soft">
                  One web. Find out where it tears.
                </span>
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-[1.6] text-ink-soft">
                Answer plain statements about God, morality, freedom, and mind.
                The check shows where your beliefs flatly clash, where one
                quietly commits you to another (a conditional implication), and
                where they hold together. Every result cites the Stanford
                Encyclopedia of Philosophy entry behind the call.
              </p>
            </div>

            <div className="flex flex-col gap-5">
              <BeginCheckLink className="group inline-flex w-fit items-center gap-3 border border-ink bg-ink px-7 py-4 font-sans text-[0.82rem] uppercase tracking-[0.18em] text-paper transition hover:border-mark hover:bg-mark">
                Begin the check
                <span className="transition group-hover:translate-x-1">→</span>
              </BeginCheckLink>
              <div className="flex flex-wrap items-baseline gap-x-6 gap-y-3">
                <span className="font-sans text-[0.7rem] uppercase tracking-[0.18em] text-muted">
                  22 statements &middot; ~5 min &middot; no login
                </span>
                <Link
                  href="/method"
                  className="font-sans text-[0.72rem] uppercase tracking-[0.18em] text-muted underline decoration-rule underline-offset-[5px] transition hover:text-ink hover:decoration-ink"
                >
                  How the engine reasons
                </Link>
              </div>
            </div>
          </div>

          <aside className="flex flex-col">
            <figure className="border border-rule bg-paper-soft p-5 sm:p-7">
              <figcaption className="mb-3 flex items-baseline justify-between font-sans text-[0.65rem] uppercase tracking-[0.22em] text-muted">
                <span>
                  <span className="font-mono text-mark">fig. 1</span>{" "}
                  &middot; the rule-graph — the map of checks it runs
                </span>
                <span>22 nodes / 20 edges</span>
              </figcaption>
              <BeliefWebDiagram
                className="block h-auto w-full"
                title="Diagram showing 22 belief statements as nodes, connected by edges that represent the engine's actual checks. Oxblood edges mark direct conflicts, ink edges mark conditional implications, dashed edges mark live arguments, and dotted edges mark coherent combinations."
              />
              <div className="mt-5 border-t border-rule-soft pt-3 font-sans text-[0.7rem] leading-5 text-muted">
                <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                  <li className="flex items-center gap-2">
                    <span
                      aria-hidden="true"
                      className="inline-block h-[2px] w-5 bg-mark"
                    />
                    direct conflict
                  </li>
                  <li className="flex items-center gap-2">
                    <span
                      aria-hidden="true"
                      className="inline-block h-[2px] w-5 bg-indigo-ink"
                    />
                    conditional implication
                  </li>
                  <li className="flex items-center gap-2">
                    <span
                      aria-hidden="true"
                      className="inline-block h-[2px] w-5"
                      style={{
                        backgroundImage:
                          "linear-gradient(to right, #8a5a14 50%, transparent 50%)",
                        backgroundSize: "5px 100%",
                      }}
                    />
                    live argument
                  </li>
                  <li className="flex items-center gap-2">
                    <span
                      aria-hidden="true"
                      className="inline-block h-[2px] w-5"
                      style={{
                        backgroundImage:
                          "linear-gradient(to right, #2d4a36 25%, transparent 25%)",
                        backgroundSize: "3px 100%",
                      }}
                    />
                    coherent combination
                  </li>
                </ul>
              </div>
            </figure>
            <p className="mt-3 font-sans text-[0.7rem] uppercase tracking-[0.18em] text-muted">
              <span className="font-mono normal-case tracking-normal text-mark">
                ¶
              </span>{" "}
              the diagram is the engine. tapping &ldquo;check&rdquo; lights up
              the edges your answers actually trigger.
            </p>
          </aside>
        </div>
      </section>

      {/* "What it is / what it is not" — a marginalia-style block. */}
      <section className="border-b border-rule">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-x-12 gap-y-6 px-6 py-10 sm:grid-cols-[10rem_1fr] lg:px-8">
          <p className="font-sans text-[0.7rem] uppercase tracking-[0.22em] text-mark">
            <span className="section-mark" />
            what this is
          </p>
          <div className="max-w-3xl">
            <p className="font-serif text-[1.05rem] leading-7 text-ink-soft">
              A small, inspectable rule engine. Every
              &ldquo;contradiction&rdquo; it reports cites a specific pair of
              statements you affirmed and a specific source — there&apos;s no AI
              sizing you up here, just a mirror you can argue with.
            </p>

            <details className="group mt-5 border-t border-rule-soft pt-4">
              <summary className="cursor-pointer list-none font-sans text-[0.78rem] uppercase tracking-[0.18em] text-mark marker:hidden">
                <span className="group-open:hidden">
                  ↳ what this is, and what it isn&apos;t
                </span>
                <span className="hidden group-open:inline">↑ hide</span>
              </summary>
              <p className="mt-4 font-serif text-[1.05rem] leading-7 text-ink-soft">
                Only statements you affirm become premises (the starting points
                the check reasons from). Rejections, uncertainty, and
                qualifications are not treated as hidden opposite beliefs.
                Consistency is a <em>floor</em>, not proof: the point is to see
                your commitments clearly and hold them on purpose.
              </p>
            </details>

            <details className="group mt-4 border-t border-rule-soft pt-4">
              <summary className="cursor-pointer list-none font-sans text-[0.78rem] uppercase tracking-[0.18em] text-mark marker:hidden">
                <span className="group-open:hidden">
                  ↳ the name &amp; the Quine reference
                </span>
                <span className="hidden group-open:inline">↑ hide</span>
              </summary>
              <p className="mt-4 font-serif text-[0.92rem] italic leading-6 text-muted">
                The name borrows W.&nbsp;V.&nbsp;Quine and
                J.&nbsp;S.&nbsp;Ullian&apos;s metaphor (<em>The Web of Belief</em>,
                1970): no belief stands alone. The engine itself is not Quinean
                holism — just a small set of explicit rules, each one a
                recognised move in the contemporary literature.
              </p>
            </details>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-6xl px-6 lg:px-8">
        <noscript>
          <p className="mt-12 border-l-2 border-mark bg-paper-soft px-5 py-4 font-serif text-[1rem] leading-7 text-ink-soft">This checker needs JavaScript enabled; you can still read the method and sources <a href="/method" className="underline decoration-mark decoration-2 underline-offset-[5px]">here</a>.</p>
        </noscript>
        <BeliefCheckerBoundary>
          <BeliefChecker />
        </BeliefCheckerBoundary>
      </div>

      {/* Why these questions — restrained, type-led */}
      <section className="border-t border-rule">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-x-12 gap-y-8 px-6 py-14 sm:grid-cols-[10rem_1fr] lg:px-8">
          <p className="font-sans text-[0.7rem] uppercase tracking-[0.22em] text-mark">
            <span className="section-mark" />
            why these
          </p>
          <div className="max-w-3xl">
            <h2 className="font-serif text-3xl font-medium leading-tight tracking-tight text-ink">
              Twenty-two statements drawn from the questions philosophers and
              the public most disagree about.
            </h2>
            <p className="mt-4 font-serif text-[1.05rem] leading-7 text-ink-soft">
              Topic selection uses the PhilPapers 2020 survey of philosophers
              and Pew Research&apos;s 2023–24 Religious Landscape Study. Each
              statement&apos;s explanation links to the relevant Stanford
              Encyclopedia of Philosophy entry; nothing here treats one school
              as obvious.
            </p>
            <Link
              href="/method"
              className="mt-6 inline-flex items-baseline gap-2 font-sans text-[0.78rem] uppercase tracking-[0.18em] text-ink underline decoration-mark decoration-2 underline-offset-[5px] transition hover:decoration-ink"
            >
              <span aria-hidden="true">↳</span> View method, classification
              standard, and the full source library
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
