import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage } from "@/components/content-page";
import { JsonLd } from "@/components/json-ld";

export const metadata: Metadata = {
  title: "Web of Belief vs. other belief & worldview tests",
  description:
    "An honest comparison of Web of Belief with personality-style worldview quizzes, the PhilPapers survey, and asking an AI chatbot about your beliefs.",
  alternates: { canonical: "/how-it-differs" },
};

const comparisons = [
  {
    name: "“What religion / philosophy are you?” quizzes",
    them: "Quizzes like Belief-O-Matic or political-compass-style tests sort you into a labelled bucket — a religion, an -ism, a quadrant — by scoring your answers against a key.",
    us: "Web of Belief never labels you. It doesn't place you on a spectrum or tell you what you “are.” It only reports relationships between specific statements you affirmed, and leaves the conclusions to you.",
    when: "If you want a quick, fun identity label, those quizzes are the better choice. If you want to examine whether your stated beliefs hold together, that's this.",
  },
  {
    name: "Personality & values assessments",
    them: "Tools like the Moral Foundations Questionnaire or values surveys measure the strength of traits and dispositions, usually to produce a profile or a chart.",
    us: "This isn't psychometrics. There's no trait being measured and no profile produced. The unit of analysis is a logical relationship between propositions, not a personality dimension.",
    when: "For self-knowledge about your dispositions, use a validated values assessment. For the logical structure of your commitments, use this.",
  },
  {
    name: "The PhilPapers Survey",
    them: "The PhilPapers Survey records what professional philosophers believe across 100 questions. It's a magnificent map of where the field stands — descriptive, not interactive.",
    us: "Web of Belief borrows its topic selection from PhilPapers but does the opposite job: instead of telling you what philosophers think, it reflects your own answers back and shows where they pull against each other.",
    when: "Read the survey to learn the lay of the land. Take the check to examine your own position within it.",
  },
  {
    name: "Asking an AI chatbot",
    them: "A chatbot will happily analyse your beliefs — but its reasoning is opaque, non-reproducible, and prone to confident invention. Ask twice and you may get two different verdicts.",
    us: "This is a small, fixed, inspectable rule engine. The same answers always produce the same findings, every rule is visible in the source, and each one cites at least one Stanford Encyclopedia of Philosophy entry. No model, no guessing.",
    when: "For open-ended discussion, a chatbot is more flexible. For a transparent, repeatable, sourced check, this is built for exactly that.",
  },
  {
    name: "A formal logic solver (SAT / SMT, e.g. Z3)",
    them: "A solver can prove inconsistency once everything is formalised into propositions and implications. It is rigorous — about the formalisation it's handed.",
    us: "The hard part here isn't solving; it's translation. Whether “perfect love” entails “unmistakable evidence” is a disputed philosophical question, not a solver bug. So Web of Belief keeps a small rule set and exposes each contested bridge premise rather than disguising interpretation as proof.",
    when: "Use a solver when your premises are already formal. Use this when the interesting work is in the natural-language commitments themselves.",
  },
];

export default function HowItDiffersPage() {
  return (
    <ContentPage
      eyebrow="how it differs"
      title="How Web of Belief differs."
      lede={
        <p>
          There are many ways to poke at what you believe. Most aren&apos;t
          really trying to do the same job as this one. Here&apos;s an honest
          account of where each is the better choice — and where Web of Belief
          is.
        </p>
      }
    >
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: comparisons.map((c) => ({
            "@type": "Question",
            name: `How does Web of Belief compare to ${c.name.replace(/[“”]/g, '"')}?`,
            acceptedAnswer: { "@type": "Answer", text: `${c.us} ${c.when}` },
          })),
        }}
      />

      <div className="grid gap-px">
        {comparisons.map((c) => (
          <article
            key={c.name}
            className="border-t border-rule-soft py-8 first:border-t-0"
          >
            <h2 className="font-serif text-[1.4rem] font-medium leading-snug tracking-tight text-ink">
              <span className="text-muted">Web of Belief vs.</span> {c.name}
            </h2>
            <div className="mt-4 grid gap-5 sm:grid-cols-2">
              <p className="font-serif text-[1rem] leading-7 text-ink-soft">
                <span className="font-sans text-[0.66rem] uppercase tracking-[0.18em] text-muted">
                  them —
                </span>{" "}
                {c.them}
              </p>
              <p className="font-serif text-[1rem] leading-7 text-ink-soft">
                <span className="font-sans text-[0.66rem] uppercase tracking-[0.18em] text-mark">
                  web of belief —
                </span>{" "}
                {c.us}
              </p>
            </div>
            <p className="mt-4 border-l-2 border-rule pl-4 font-serif text-[0.97rem] italic leading-7 text-muted">
              {c.when}
            </p>
          </article>
        ))}
      </div>

      <div className="mt-14 border-t border-rule pt-8">
        <h2 className="font-serif text-2xl font-medium tracking-tight text-ink">
          The fastest way to see the difference is to try it.
        </h2>
        <p className="mt-3 max-w-2xl font-serif text-[1.05rem] leading-7 text-ink-soft">
          It takes about five minutes, asks for no login, and keeps your answers
          in your browser. You can read{" "}
          <Link
            href="/method"
            className="text-mark underline decoration-mark/40 underline-offset-[3px] transition hover:decoration-mark"
          >
            exactly how the engine reasons
          </Link>{" "}
          first if you&apos;d rather.
        </p>
        <Link
          href="/#check"
          className="mt-5 inline-flex items-baseline gap-3 font-serif text-lg text-ink underline decoration-mark decoration-2 underline-offset-[6px] transition hover:decoration-ink"
        >
          <span className="font-mono text-[0.78rem] tracking-[0.18em] text-mark">
            §1
          </span>
          Begin the check
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </ContentPage>
  );
}
