import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage, Prose } from "@/components/content-page";
import { JsonLd } from "@/components/json-ld";
import { guides } from "@/lib/content";
import { operator, siteName, siteUrl } from "@/lib/site";

const entry = guides.find((g) => g.path === "/guides/contradiction-vs-tension")!;

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
      title="Contradiction, implication, or tension?"
      backHref="/guides"
      backLabel="← all guides"
      lede={
        <p>
          &ldquo;That&apos;s a contradiction!&rdquo; is one of the most overused
          moves in any argument about beliefs. Most clashes are not
          contradictions at all. Here is how to tell four very different things
          apart.
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
          When two beliefs seem to collide, the useful question is not{" "}
          <em>do they clash?</em> but <em>how?</em> The honest answer is usually
          one of four, and they call for completely different responses.
        </p>

        <h2>1. Direct contradiction</h2>
        <p>
          The exact statements you affirmed cannot both be true as worded. There
          is no possible world in which they hold together. &ldquo;At least one
          moral fact is independent of anyone&apos;s approval&rdquo; and
          &ldquo;every moral truth depends only on approval&rdquo; negate each
          other directly. A contradiction is the one case where something has to
          give: you cannot keep both sentences exactly as stated.
        </p>

        <h2>2. Conditional implication</h2>
        <p>
          Here the two beliefs are perfectly consistent on their own — but
          together, sometimes with one extra premise spelled out, they{" "}
          <strong>entail a third conclusion</strong> you may not have meant to
          accept. Affirm both &ldquo;nothing is obligatory unless God commands
          it&rdquo; and &ldquo;there is no God,&rdquo; and it follows that
          nothing is obligatory at all. That is not a contradiction. It is an
          implication, and you have three honest exits: accept the conclusion,
          reject one of the two beliefs, or reject the bridge premise that links
          them.
        </p>

        <h2>3. Live argument</h2>
        <p>
          Sometimes the link between two beliefs runs through a premise that is
          genuinely <strong>disputed by philosophers</strong> — not a logical
          slip, but an open question. Does a perfectly loving God entail that no
          one sincerely seeking God would fail to find evidence? Does moral
          responsibility require that you could have done otherwise? Reasonable
          people answer differently. A good check names the bridge premise and
          leaves its truth open, rather than disguising a contested
          interpretation as a proof.
        </p>

        <h2>4. Coherent combination</h2>
        <p>
          And often two beliefs that are <em>rhetorically</em> treated as
          incompatible turn out to have a respectable philosophical home
          together. &ldquo;There is no God&rdquo; and &ldquo;life can be
          objectively meaningful&rdquo; are routinely called incoherent in
          debate — yet there are well-developed views on which they sit together
          fine. The right response here is not to revise anything. It is to stop
          accepting a false alarm.
        </p>

        <h2>Why the distinction matters</h2>
        <p>
          Collapsing all four into &ldquo;contradiction&rdquo; is how arguments
          go bad. It pressures people to abandon beliefs that are merely in
          tension, and it lets real contradictions hide behind the noise. Naming
          the kind of clash tells you what is actually being asked of you —
          revise, expose a hidden premise, examine a disputed one, or relax.
        </p>

        <p>
          This four-way split is exactly the standard{" "}
          <Link href="/method">Web of Belief uses</Link>: ⊥ direct conflict, ⊢
          conditional implication, ‡ live argument, and ≈ coherent combination.{" "}
          <Link href="/#check">See which ones your beliefs trigger →</Link>
        </p>
      </Prose>
    </ContentPage>
  );
}
