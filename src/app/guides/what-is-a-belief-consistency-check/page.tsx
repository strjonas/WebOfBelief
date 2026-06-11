import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage, Prose } from "@/components/content-page";
import { JsonLd } from "@/components/json-ld";
import { guides } from "@/lib/content";
import { operator, siteName, siteUrl } from "@/lib/site";

const entry = guides.find(
  (g) => g.path === "/guides/what-is-a-belief-consistency-check",
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
      title="What is a belief consistency check?"
      backHref="/guides"
      backLabel="← all guides"
      lede={
        <p>
          A belief consistency check looks at a set of things you say you
          believe and asks a narrow question: can they all be true at once? It
          is a mirror you can argue with — not a score, and not a judgment of
          you.
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
        <p>
          We carry hundreds of beliefs at once — about whether there is a God,
          where morality comes from, whether we are free, what makes a life
          meaningful. Most of the time we hold them one at a time, in separate
          rooms of the mind, and never check whether they can share a house. A
          consistency check brings a few of them into the same room and asks
          whether they can all be true together.
        </p>

        <h2>Consistency, precisely</h2>
        <p>
          A set of beliefs is <strong>consistent</strong> when there is at least
          one way the world could be in which all of them are true at the same
          time. It is <strong>inconsistent</strong>{" "}when no such way exists —
          when affirming one forces you to deny another. &ldquo;A personal God
          exists&rdquo; and &ldquo;no deity exists&rdquo; cannot both be true as
          worded; that is a flat contradiction. Consistency is not about whether
          your beliefs are <em>correct</em>. Two false beliefs can sit together
          perfectly well. It is only about whether they can hold{" "}
          <em>at the same time</em>.
        </p>

        <h2>Why it is a floor, not a finish line</h2>
        <p>
          Passing a consistency check does not make your worldview true. It only
          clears the lowest bar: you are not contradicting yourself. That is why
          we call consistency a <strong>floor</strong>. It is necessary — a view
          that contradicts itself can&apos;t all be true — but nowhere near
          sufficient. The value isn&apos;t the verdict. It&apos;s being made to
          notice a commitment you didn&apos;t realise you&apos;d taken on, and
          deciding what to do about it on purpose.
        </p>

        <h2>What a good check does <em>not</em> do</h2>
        <ul>
          <li>
            It does not infer beliefs you didn&apos;t state. Rejecting a
            statement, being unsure, or qualifying it is never treated as secret
            belief in its opposite.
          </li>
          <li>
            It does not produce a &ldquo;consistency score.&rdquo; A number
            hides the one thing worth seeing: the exact pair of statements in
            tension.
          </li>
          <li>
            It does not tell you which belief to drop. Revising one, qualifying
            another, or defending the bridge premise between them are all live
            options that only you can weigh.
          </li>
        </ul>

        <h2>Why bother?</h2>
        <p>
          Because the alternative is holding beliefs that quietly undercut each
          other and never noticing. The point isn&apos;t to win an argument with
          yourself; it&apos;s the older idea that{" "}
          <Link href="/guides/why-worldview-consistency-matters">
            an examined commitment is worth more than an unexamined one
          </Link>
          . A check is just a fast, honest way to find the places worth
          examining.
        </p>

        <p>
          The next step is learning to tell the <em>kinds</em> of clash apart —
          because most of them aren&apos;t contradictions at all.{" "}
          <Link href="/guides/contradiction-vs-tension">
            Contradiction, implication, or tension?
          </Link>
        </p>

        <p className="!mt-10 border-l-2 border-mark pl-5 font-serif text-[1rem] italic leading-7 text-muted">
          Web of Belief is one such check. It asks 18 questions covering 29
          distinct positions — you can hold one, several, or none on each topic
          — and reports only the relationships it can actually support, each
          one citing at least one Stanford Encyclopedia of Philosophy entry.{" "}
          <Link href="/check">Take the check →</Link>
        </p>
      </Prose>
    </ContentPage>
  );
}
