import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage, Prose } from "@/components/content-page";
import { JsonLd } from "@/components/json-ld";
import { guides } from "@/lib/content";
import { operator, siteName, siteUrl } from "@/lib/site";

const entry = guides.find(
  (g) => g.path === "/guides/why-worldview-consistency-matters",
)!;

export const metadata: Metadata = {
  title: entry.title,
  description: entry.description,
  alternates: { canonical: entry.path },
  openGraph: { type: "article", title: entry.title, description: entry.description },
};

export default function Guide() {
  return (
    <ContentPage
      eyebrow="guide"
      title="Why worldview consistency matters (and when it doesn't)."
      backHref="/guides"
      backLabel="← all guides"
      lede={
        <p>
          Consistency is worth wanting — but it is easy to want it for the wrong
          reasons, or to chase it past the point where it helps. Here is the
          case for it, and the case against overrating it.
        </p>
      }
    >
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: entry.title,
          description: entry.description,
          datePublished: entry.lastModified,
          dateModified: entry.lastModified,
          author: { "@type": "Person", name: operator.name },
          publisher: { "@type": "Organization", name: siteName },
          mainEntityOfPage: new URL(entry.path, siteUrl).toString(),
        }}
      />
      <Prose>
        <h2>The case for caring</h2>
        <p>
          An inconsistent set of beliefs has a quiet defect: not all of them can
          be true, so at least one is wrong — you just don&apos;t know which. If
          you care whether your beliefs are true, you have a reason to care
          whether they can all hold together. Inconsistency is a signal that
          something in the web needs attention.
        </p>
        <p>
          There is also a more human reason. Beliefs that secretly undercut each
          other tend to surface at the worst moments — in a hard conversation, a
          real decision, a loss. Noticing the strain in calm conditions, on
          purpose, is far easier than discovering it under pressure. This is the
          old Socratic thought that{" "}
          <em>the unexamined life is not worth living</em>: not that examined
          people are better, but that holding your commitments knowingly is part
          of living them well.
        </p>

        <h2>Consistency is necessary, not sufficient</h2>
        <p>
          A perfectly consistent worldview can still be entirely false — it just
          fails to contradict itself. &ldquo;The earth is flat and 6,000 years
          old&rdquo; can be made internally tidy. So consistency is a{" "}
          <strong>floor</strong>: clearing it tells you that you haven&apos;t
          tripped over your own feet, not that you have arrived anywhere true.
          Anyone who sells a consistency check as proof of a correct worldview
          is overselling.
        </p>

        <h2>When the pursuit goes wrong</h2>
        <ul>
          <li>
            <strong>False precision.</strong> Forcing rich, hedged beliefs into
            crisp logical sentences can manufacture &ldquo;contradictions&rdquo;
            that are really just translation errors.{" "}
            <Link href="/guides/contradiction-vs-tension">
              Not every clash is a contradiction.
            </Link>
          </li>
          <li>
            <strong>Premature closure.</strong> The fastest way to be consistent
            is to believe almost nothing, or to wall your beliefs off from each
            other. Both buy tidiness by giving up on getting things right.
          </li>
          <li>
            <strong>Consistency as a weapon.</strong> &ldquo;Gotcha&rdquo;
            consistency — used to corner someone rather than to understand —
            produces defensiveness, not examination.
          </li>
        </ul>

        <h2>A healthier aim</h2>
        <p>
          The goal is not a flawless, frozen system. It is a web you tend: you
          notice strain, you trace it to a specific pair of commitments, and you
          decide — revise, qualify, or defend — with your eyes open. Revision is
          not failure; it is the whole point. A finding is a fork in the road you
          get to take deliberately, not a verdict on your intelligence or
          character.
        </p>

        <p className="!mt-10 border-l-2 border-mark pl-5 font-serif text-[1rem] italic leading-7 text-muted">
          That is the spirit of Web of Belief: a mirror, not a judge. Every
          finding is framed as a question you decide.{" "}
          <Link href="/check">Take the check →</Link>
        </p>
      </Prose>
    </ContentPage>
  );
}
