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
    mark: "⊥",
    example:
      "Affirming both that at least one moral fact is independent of approval and that every moral truth depends only on approval.",
    standard:
      "Reported only where the precise affirmed sentences negate one another or cannot both hold under their stated definitions.",
  },
  {
    name: "Logical implication",
    mark: "⊢",
    example:
      "Affirming both that no deity exists and that every moral obligation is true solely because God commands it — which together entail that nothing is obligatory.",
    standard:
      "Surfaced when affirmed statements (sometimes with one clearly stated bridge) validly entail a further conclusion you may not have meant to accept. It is not a contradiction, but a commitment to notice.",
  },
  {
    name: "Live argument",
    mark: "‡",
    example:
      "Affirming both a perfectly loving personal God and nonresistant nonbelief.",
    standard:
      "The result states the additional bridge premise needed to infer an incompatibility and treats its truth as open for examination.",
  },
  {
    name: "Coherent combination",
    mark: "≈",
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
          className="font-sans text-[0.78rem] uppercase tracking-[0.18em] text-muted underline decoration-rule underline-offset-[5px] transition hover:text-ink hover:decoration-ink"
        >
          ← back to the check
        </Link>

        <p className="mt-12 font-sans text-[0.72rem] uppercase tracking-[0.22em] text-mark">
          <span className="section-mark" />
          method &amp; sources
        </p>
        <h1 className="mt-5 font-serif text-[2.5rem] font-medium leading-[1.1] tracking-tight text-ink sm:text-[3.1rem]">
          Accuracy begins with restraint.
        </h1>
        <p className="mt-5 max-w-3xl font-serif text-[1.12rem] leading-[1.65] text-ink-soft">
          Web of Belief reports relationships among exact statements you mark as
          true. It does not infer a complete worldview or assign a consistency
          score. The aim is fewer claims, better defended.
        </p>

        <section className="mt-14 border-l-2 border-mark pl-6">
          <p className="font-sans text-[0.7rem] uppercase tracking-[0.22em] text-mark">
            <span className="section-mark" />
            how the engine reasons
          </p>
          <h2 className="mt-3 font-serif text-2xl font-medium leading-snug tracking-tight text-ink">
            A small, inspectable rule engine in your browser.
          </h2>
          <ol className="mt-6 space-y-4 font-serif text-[1rem] leading-7 text-ink-soft">
            <li className="flex gap-4">
              <span className="font-mono text-[0.78rem] tracking-[0.18em] text-mark">
                i.
              </span>
              <span>
                <span className="font-medium text-ink">Your selections </span>
                are held in browser memory for this page only.
              </span>
            </li>
            <li className="flex gap-4">
              <span className="font-mono text-[0.78rem] tracking-[0.18em] text-mark">
                ii.
              </span>
              <span>
                <span className="font-medium text-ink">Explicit rules </span>
                in custom TypeScript check the statements marked &ldquo;I believe
                this&rdquo; against reviewed relationships — every edge in the
                diagram on the home page.
              </span>
            </li>
            <li className="flex gap-4">
              <span className="font-mono text-[0.78rem] tracking-[0.18em] text-mark">
                iii.
              </span>
              <span>
                <span className="font-medium text-ink">Each finding </span>
                names the beliefs it used, the bridge premise if any, the
                question it leaves you, and one or more SEP sources.
              </span>
            </li>
          </ol>
          <p className="mt-7 border-t border-rule-soft pt-4 font-serif text-[0.95rem] italic leading-7 text-muted">
            No Z3 solver, no LLM call, no database, no account, no server-side
            scoring.
          </p>
        </section>

        <section className="mt-14">
          <p className="font-sans text-[0.72rem] uppercase tracking-[0.22em] text-muted">
            <span className="section-mark" />
            classification standard
          </p>
          <h2 className="mt-3 font-serif text-2xl font-medium leading-snug tracking-tight text-ink">
            The four kinds of finding.
          </h2>
          <div className="mt-6 grid gap-1">
            {methods.map((method) => (
              <article
                key={method.name}
                className="grid grid-cols-[3rem_1fr] items-start gap-4 border-t border-rule-soft py-5"
              >
                <span
                  className="font-mono text-3xl leading-none text-mark"
                  aria-hidden="true"
                >
                  {method.mark}
                </span>
                <div>
                  <h3 className="font-serif text-[1.2rem] font-medium tracking-tight text-ink">
                    {method.name}
                  </h3>
                  <p className="mt-2 font-serif text-[0.97rem] leading-7 text-ink-soft">
                    <span className="font-sans text-[0.7rem] uppercase tracking-[0.16em] text-muted">
                      example —
                    </span>{" "}
                    {method.example}
                  </p>
                  <p className="mt-2 font-serif text-[0.97rem] leading-7 text-ink-soft">
                    <span className="font-sans text-[0.7rem] uppercase tracking-[0.16em] text-muted">
                      rule —
                    </span>{" "}
                    {method.standard}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-14 border-l-2 border-ink pl-6">
          <p className="font-sans text-[0.72rem] uppercase tracking-[0.22em] text-muted">
            <span className="section-mark" />
            why no Z3 verdict
          </p>
          <h2 className="mt-3 font-serif text-2xl font-medium leading-snug tracking-tight text-ink">
            Because the hard problem isn&apos;t solving — it&apos;s translating.
          </h2>
          <p className="mt-4 font-serif text-[1rem] leading-7 text-ink-soft">
            A SAT or SMT tool such as Z3 can find inconsistency once propositions
            and implications have been formalized. The hard part here is whether
            a natural-language commitment entails a bridge premise: for example,
            whether perfect love entails unmistakable divine availability, or
            whether responsibility requires alternate possibilities. Those are
            disputed philosophical questions, not solver failures. This app
            therefore keeps a small inspectable rule set and exposes each premise
            instead of disguising interpretation as proof.
          </p>
        </section>

        <section className="mt-14">
          <p className="font-sans text-[0.72rem] uppercase tracking-[0.22em] text-muted">
            <span className="section-mark" />
            topic selection
          </p>
          <h2 className="mt-3 font-serif text-2xl font-medium leading-snug tracking-tight text-ink">
            Two surveys, no editorial guess.
          </h2>
          <p className="mt-4 font-serif text-[1rem] leading-7 text-ink-soft">
            The initial domains come from the official PhilPapers 2020 Survey,
            which asked philosophers 100 questions, including God, meta-ethics,
            meaning of life, mind, free will, and eating animals. Public
            importance of religious-worldview questions is checked against Pew
            Research Center&apos;s 2023–24 Religious Landscape Study. These
            sources justify salience; they do not determine which answer is
            correct.
          </p>
        </section>

        <section className="mt-14">
          <p className="font-sans text-[0.72rem] uppercase tracking-[0.22em] text-muted">
            <span className="section-mark" />
            source library
          </p>
          <h2 className="mt-3 font-serif text-2xl font-medium leading-snug tracking-tight text-ink">
            Every finding cites a Stanford entry.
          </h2>
          <p className="mt-3 font-serif text-[0.94rem] italic leading-6 text-muted">
            Source review completed 27 May 2026. Position summaries in the
            checker are paraphrases; follow the original entries for full
            arguments and bibliographies.
          </p>
          <ol className="mt-6 border-t border-rule-soft">
            {Object.values(sources).map((source, index) => (
              <li
                key={source.id}
                className="grid grid-cols-[3rem_1fr] gap-4 border-b border-rule-soft py-4"
              >
                <span className="font-mono text-[0.78rem] tracking-[0.12em] text-mark">
                  [{String(index + 1).padStart(2, "0")}]
                </span>
                <div>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-serif text-[1.05rem] text-ink underline decoration-mark/40 underline-offset-[4px] transition hover:decoration-mark"
                  >
                    {source.title}
                  </a>
                  <p className="mt-1 font-sans text-[0.68rem] uppercase tracking-[0.18em] text-muted">
                    {source.publisher}
                  </p>
                  <p className="mt-2 font-serif text-[0.96rem] leading-6 text-ink-soft">
                    {source.use}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-14 border-l-2 border-forest pl-6">
          <p className="font-sans text-[0.72rem] uppercase tracking-[0.22em] text-forest">
            <span className="section-mark" />
            privacy &amp; wellbeing
          </p>
          <p className="mt-3 font-serif text-[1rem] leading-7 text-ink-soft">
            Answers stay in browser memory for the current page and are not sent
            to a server by this application. The share action copies counts and
            the structural shape of your affirmations only — never your
            individual stances. Results are invitations to revisit reasons,
            never judgments of intelligence, character, or identity.
          </p>
        </section>
      </div>
    </main>
  );
}
