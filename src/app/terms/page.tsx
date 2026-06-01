import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage, Prose } from "@/components/content-page";
import { contactEmail, githubUrl, operator } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of use",
  description:
    "The terms for using Web of Belief: a free, open-source reflection tool offered as-is, not professional, legal, medical, or spiritual advice.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <ContentPage
      eyebrow="legal · terms"
      title="Terms of use"
      lede={
        <p>
          Web of Belief is a free, open-source reflection tool offered as-is.
          These terms keep things clear and fair for everyone; nothing here
          takes away rights you have under mandatory consumer law.
        </p>
      }
    >
      <Prose>
        <p className="font-sans text-[0.72rem] uppercase tracking-[0.16em] text-muted">
          Last updated 1 June 2026
        </p>

        <h2>Who we are</h2>
        <p>
          Web of Belief is operated by {operator.name}, {operator.city},{" "}
          {operator.country}. Full operator details are in the{" "}
          <Link href="/impressum">Impressum</Link>.
        </p>

        <h2>What Web of Belief is</h2>
        <p>
          It is a tool for reflecting on whether stated beliefs are logically
          consistent. It is <strong>not</strong> professional, legal, medical,
          psychological, financial, or spiritual advice, and it is not a
          diagnosis, a verdict on you, or a measure of your intelligence,
          character, or worth. Its findings are prompts for thought, drawn from
          a small, fixed rule set; they are not claims about which beliefs are
          true. If you are in distress, please reach out to a qualified
          professional or a local support service.
        </p>

        <h2>Using the site</h2>
        <p>
          You may use Web of Belief freely for any lawful purpose. Please
          don&apos;t attempt to disrupt, overload, attack, or reverse the
          service&apos;s availability, or use it in a way that infringes
          others&apos; rights. The site is provided for personal, reflective
          use.
        </p>

        <h2>Open-source code</h2>
        <p>
          The source code is released under the MIT licence and is available{" "}
          <a href={githubUrl} target="_blank" rel="noreferrer">
            on GitHub
          </a>
          . That licence governs your rights to the code itself. The site&apos;s
          written content, name, and design are not part of the code licence and
          remain protected (see the Impressum&apos;s copyright note).
        </p>

        <h2>No warranty</h2>
        <p>
          The site and its findings are provided &ldquo;as is&rdquo; and
          &ldquo;as available,&rdquo; without warranties of any kind, express or
          implied, including accuracy, fitness for a particular purpose, or
          uninterrupted availability. Philosophical summaries are
          paraphrases; follow the cited sources for the full arguments.
        </p>

        <h2>Limitation of liability</h2>
        <p>
          To the fullest extent permitted by law, the operator is not liable for
          any damages arising from your use of, or inability to use, the site or
          its findings. Nothing in these terms excludes or limits liability that
          cannot lawfully be excluded — including for intent, gross negligence,
          or injury to life, body, or health, and liability under mandatory
          consumer-protection and product-liability law remains unaffected.
        </p>

        <h2>Changes and availability</h2>
        <p>
          We may update, change, or discontinue the site or these terms at any
          time. The &ldquo;last updated&rdquo; date above reflects the current
          version.
        </p>

        <h2>Governing law</h2>
        <p>
          German law applies, excluding its conflict-of-law rules. If you are a
          consumer, this choice does not deprive you of the protection of
          mandatory provisions of the law of your country of habitual residence.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about these terms? Email{" "}
          <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
        </p>
      </Prose>
    </ContentPage>
  );
}
