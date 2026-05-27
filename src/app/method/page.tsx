import type { Metadata } from "next";
import Link from "next/link";
import { sources } from "@/lib/beliefs";

export const metadata: Metadata = {
  title: "Method and sources",
  description:
    "How Web of Belief distinguishes direct conflicts, logical implications, and live philosophical arguments, and which sources support its prompts.",
  alternates: {
    canonical: "/method",
  },
};

const methods = [
  {
    name: "Direct conflict",
    example:
      "Affirming both that at least one moral fact is independent of approval and that every moral truth depends only on approval.",
    standard:
      "Reported only where the precise affirmed sentences negate one another or cannot both hold under their stated definitions.",
  },
  {
    name: "Logical implication",
    example:
      "Affirming both that no deity exists and that every moral obligation is true solely because God commands it — which together entail that nothing is obligatory.",
    standard:
      "Surfaced when affirmed statements (sometimes with one clearly stated bridge) validly entail a further conclusion you may not have meant to accept. It is not a contradiction, but a commitment to notice.",
  },
  {
    name: "Live argument",
    example:
      "Affirming both a perfectly loving personal God and nonresistant nonbelief.",
    standard:
      "The result states the additional bridge premise needed to infer an incompatibility and treats its truth as open for examination.",
  },
  {
    name: "Coherent combination",
    example:
      "Affirming both atheism and objective meaning through finite worthwhile activity.",
    standard:
      "Surfaced when the pairing is often rhetorically challenged but is represented by a recognized philosophical position.",
  },
];

export default function MethodPage() {
  return (
    <main className="flex-1">
      <div className="mx-auto w-full max-w-4xl px-6 py-14 sm:py-20 lg:px-8">
        <Link
          href="/"
          className="text-sm font-medium text-teal-800 transition hover:text-teal-950"
        >
          Back to checker
        </Link>
        <p className="mt-10 text-xs font-semibold uppercase tracking-[0.2em] text-teal-800">
          Method and sources
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.045em] text-stone-950 sm:text-5xl">
          Accuracy begins with restraint.
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-stone-600">
          Web of Belief reports relationships among exact statements you mark
          as true. It does not infer a complete worldview or assign a
          consistency score.
        </p>

        <section className="mt-14 rounded-3xl bg-slate-950 p-7 text-white sm:p-9">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-300">
            How it works technically
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight">
            A small, inspectable rule engine in your browser.
          </h2>
          <div className="mt-6 grid gap-4 text-sm leading-7 text-slate-300 sm:grid-cols-3">
            <p>
              <span className="block font-semibold text-white">
                1. Your selections
              </span>
              Responses are held in browser memory for this page only.
            </p>
            <p>
              <span className="block font-semibold text-white">
                2. Explicit rules
              </span>
              Custom TypeScript code checks only statements marked &quot;I
              believe this&quot; against reviewed relationships.
            </p>
            <p>
              <span className="block font-semibold text-white">
                3. Explanations
              </span>
              Each result names the beliefs used, its reasoning, and supporting
              sources.
            </p>
          </div>
          <p className="mt-7 border-t border-white/10 pt-5 text-sm leading-7 text-slate-300">
            There is no Z3 solver, AI inference call, database, account, or
            server-side scoring in this version.
          </p>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-semibold tracking-tight text-stone-950">
            Classification standard
          </h2>
          <div className="mt-6 grid gap-4">
            {methods.map((method) => (
              <article
                key={method.name}
                className="rounded-2xl border border-stone-200 bg-white p-6"
              >
                <h3 className="text-lg font-semibold text-stone-900">
                  {method.name}
                </h3>
                <p className="mt-3 text-sm leading-6 text-stone-600">
                  <span className="font-semibold text-stone-800">Example: </span>
                  {method.example}
                </p>
                <p className="mt-3 text-sm leading-6 text-stone-600">
                  <span className="font-semibold text-stone-800">Rule: </span>
                  {method.standard}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-14 rounded-3xl border border-slate-200 bg-white p-7 sm:p-9">
          <h2 className="text-2xl font-semibold tracking-tight">
            Why no Z3 verdict?
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            A SAT or SMT tool such as Z3 can correctly find inconsistency after
            propositions and implications have been formalized. The hard part
            here is whether a natural-language commitment entails a bridge
            premise: for example, whether perfect love entails unmistakable
            divine availability, or whether responsibility needs alternate
            possibilities. Those are disputed philosophical questions, not
            solver failures. This app therefore keeps a small inspectable rule
            set and exposes each premise instead of disguising interpretation
            as proof.
          </p>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-semibold tracking-tight text-stone-950">
            Topic selection
          </h2>
          <p className="mt-4 text-base leading-7 text-stone-600">
            The initial domains were selected from the official PhilPapers
            2020 Survey, which surveyed philosophers on 100 questions,
            including God, meta-ethics, meaning of life, mind, free will, and
            eating animals. Public importance of religious-worldview questions
            is checked against Pew Research Center&apos;s 2023-24 Religious
            Landscape Study. These sources justify salience; they do not
            determine which answer is correct.
          </p>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-semibold tracking-tight text-stone-950">
            Source library
          </h2>
          <p className="mt-3 text-sm leading-6 text-stone-500">
            Source review completed May 27, 2026. Position summaries in the
            checker are paraphrases; follow the original entries for full
            arguments and bibliographies.
          </p>
          <div className="mt-6 grid gap-3">
            {Object.values(sources).map((source) => (
              <article
                key={source.id}
                className="rounded-2xl border border-stone-200 bg-white p-5"
              >
                <a
                  href={source.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-base font-semibold text-teal-900 underline decoration-teal-700/25 underline-offset-4 transition hover:text-teal-700"
                >
                  {source.title}
                </a>
                <p className="mt-1 text-xs font-medium uppercase tracking-[0.12em] text-stone-400">
                  {source.publisher}
                </p>
                <p className="mt-3 text-sm leading-6 text-stone-600">
                  {source.use}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-14 rounded-2xl border border-stone-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-stone-950">
            Privacy and wellbeing
          </h2>
          <p className="mt-3 text-sm leading-7 text-stone-600">
            Answers stay in browser memory for the current page and are not
            sent to a server by this application. The share action
            copies counts only. Results are invitations to revisit reasons,
            never judgments of intelligence, character, or identity.
          </p>
        </section>
      </div>
    </main>
  );
}
