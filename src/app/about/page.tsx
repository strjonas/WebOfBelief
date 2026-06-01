import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage, Prose } from "@/components/content-page";
import { JsonLd } from "@/components/json-ld";
import {
  contactEmail,
  githubUrl,
  linkedInUrl,
  twitterUrl,
  operator,
  siteName,
  siteUrl,
} from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Who built Web of Belief, why it exists, and the sources and principles behind it.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <ContentPage
      eyebrow="about"
      title="A mirror you can argue with."
      lede={
        <p>
          Web of Belief is a small, open-source tool for examining whether the
          things you believe can all be true at once. It is built on the
          conviction that the examined life is worth the discomfort — and that a
          tool for examining beliefs should never pretend to judge the person
          holding them.
        </p>
      }
    >
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: siteName,
          url: siteUrl.toString(),
          founder: { "@type": "Person", name: operator.name },
          sameAs: [githubUrl, linkedInUrl, twitterUrl],
        }}
      />
      <Prose>
        <h2>Why it exists</h2>
        <p>
          Most tools that touch on belief either sort you into a bucket or hand
          you a verdict. This one does neither. It reports only the relationships
          it can actually support between statements you mark as true, names the
          premise behind each one, and points you at the source so you can argue
          back. The goal is reflection, not a score —{" "}
          <Link href="/guides/why-worldview-consistency-matters">
            consistency is a floor, not a finish line
          </Link>
          .
        </p>

        <h2>How it&apos;s built</h2>
        <p>
          It&apos;s a deterministic rule engine that runs entirely in your
          browser — no model, no database, no account, no server-side scoring.
          Topic selection draws on the PhilPapers 2020 Survey of philosophers
          and Pew Research&apos;s Religious Landscape Study; every finding cites
          a Stanford Encyclopedia of Philosophy entry. The full method, the
          classification standard, and the complete source library are{" "}
          <Link href="/method">published on the method page</Link>, and the
          entire source code is{" "}
          <a href={githubUrl} target="_blank" rel="noreferrer">
            on GitHub
          </a>{" "}
          under an MIT licence.
        </p>

        <h2>Who made it</h2>
        <p>
          Web of Belief is built and maintained by {operator.name}. It is an
          independent project, not affiliated with any institution, publisher,
          or religious or political organisation.
        </p>
        <ul>
          <li>
            <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
          </li>
          <li>
            <a href={linkedInUrl} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          </li>
          <li>
            <a href={twitterUrl} target="_blank" rel="noreferrer">
              X / Twitter
            </a>
          </li>
          <li>
            <a href={githubUrl} target="_blank" rel="noreferrer">
              GitHub
            </a>
          </li>
        </ul>

        <p className="!mt-10 border-l-2 border-mark pl-5 font-serif text-[1rem] italic leading-7 text-muted">
          Found a finding you think is wrong, or a source that&apos;s
          misrepresented? That&apos;s the most useful feedback there is —{" "}
          <Link href="/contact">tell me</Link>.
        </p>
      </Prose>
    </ContentPage>
  );
}
