import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage, Prose } from "@/components/content-page";
import { contactEmail, operator } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy policy",
  description:
    "What Web of Belief processes (almost nothing), what stays in your browser, and the anonymous, cookieless usage analytics it uses.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <ContentPage
      eyebrow="legal · privacy"
      title="Privacy policy"
      lede={
        <p>
          Short version: your answers never leave your browser, there are no
          cookies and no accounts, and the only data collected is anonymous,
          aggregate usage analytics that can never identify you or reveal what
          you believe.
        </p>
      }
    >
      <Prose>
        <p className="font-sans text-[0.72rem] uppercase tracking-[0.16em] text-muted">
          Last updated 1 June 2026
        </p>

        <h2>Who is responsible</h2>
        <p>
          The data controller for this site is {operator.name},{" "}
          {operator.street}, {operator.city}, {operator.country}. Contact:{" "}
          <a href={`mailto:${contactEmail}`}>{contactEmail}</a>. See the{" "}
          <Link href="/impressum">Impressum</Link> for full operator details.
        </p>

        <h2>Your answers stay in your browser</h2>
        <p>
          The belief check runs entirely on your device. The statements you mark
          as believed, rejected, unsure, or qualified are saved in your
          browser&apos;s local storage, on your own device, so an accidental
          reload doesn&apos;t lose your progress. They are{" "}
          <strong>never sent to any server</strong>, never stored remotely, and
          never associated with you. They stay only until you press{" "}
          <strong>&ldquo;Start over&rdquo;</strong> (which deletes them), or
          until you clear your browser&apos;s site data.
        </p>

        <h2>No cookies, no accounts, no fingerprinting</h2>
        <p>
          Web of Belief sets no cookies, requires no login, and does not
          fingerprint your device or browser. The only thing kept on your device
          is the local storage entry described above — your own in-progress
          answers, held purely for your convenience. It is never read by a
          server, never shared, and is not a tracking identifier. Because
          nothing identifying is stored, there is no consent banner to dismiss.
        </p>

        <h2>What analytics we collect</h2>
        <p>
          We use{" "}
          <a
            href="https://vercel.com/docs/analytics"
            target="_blank"
            rel="noreferrer"
          >
            Vercel Web Analytics
          </a>
          , a privacy-friendly, cookieless analytics service. It records:
        </p>
        <ul>
          <li>
            <strong>Anonymous page views</strong> — the URL path visited,
            approximate country, referrer, and device class (desktop / mobile).
            No IP address is stored and no cross-site identifier is created.
          </li>
          <li>
            <strong>Anonymous usage events</strong> — coarse milestones that
            tell us whether visitors start the check, roughly how far through it
            they get (which step), whether they reach the results, whether they
            share, and whether they create or open a comparison link. These
            events carry <strong>only progress</strong> — never which statements
            you affirmed, and never your individual answers.
          </li>
        </ul>
        <p>
          This data is aggregate and cannot be traced back to an individual. We
          use it to understand, for example, whether the introduction is clear
          enough that people begin the check, or where they tend to drop off, so
          we can improve the experience. The legal basis is our legitimate
          interest (Art. 6(1)(f) GDPR) in operating and improving the site; the
          processing is low-impact and uses no personal identifiers.
        </p>

        <h2>What the share features send</h2>
        <p>
          The shareable badge and copyable summary are generated in your
          browser. They contain only counts and the structural shape of your
          affirmations — never your individual stances — and the image is drawn
          locally and never uploaded. If you choose to share, your device&apos;s
          own share or social features handle it from there.
        </p>
        <p>
          The <strong>&ldquo;friends compare&rdquo; link</strong> is
          different in one honest respect, so it&apos;s worth being precise. To
          let a friend compare their web against yours, your individual answers
          are encoded into the part of the link <em>after the # sign</em> (the
          URL fragment). Browsers never transmit that fragment to a web server,
          so your answers still never reach us or anyone else&apos;s server —
          the comparison is computed entirely inside each browser. But the link
          itself now carries your answers: anyone you send it to can read your
          web from it, and like any link it may persist in chat history or a
          screenshot. Only share it with people you&apos;re happy to share your
          answers with. Nothing is uploaded, and there is still no account,
          cookie, or server-side record.
        </p>

        <h2>Hosting</h2>
        <p>
          The site is hosted by Vercel Inc. As with any web host, Vercel
          processes standard server request data (such as IP addresses) in
          transit to deliver the site and protect against abuse. See{" "}
          <a
            href="https://vercel.com/legal/privacy-policy"
            target="_blank"
            rel="noreferrer"
          >
            Vercel&apos;s privacy policy
          </a>
          .
        </p>

        <h2>Your rights</h2>
        <p>
          Under the GDPR you have the right to access, rectification, erasure,
          restriction, and objection regarding personal data about you, and to
          lodge a complaint with a supervisory authority. Because we store no
          identifying data, we usually hold nothing to act on — but you are
          welcome to contact us at{" "}
          <a href={`mailto:${contactEmail}`}>{contactEmail}</a> with any
          question.
        </p>

        <h2>Children</h2>
        <p>
          Web of Belief is intended for a general adult audience and is not
          directed at children under 16. We knowingly collect no personal data
          from anyone.
        </p>

        <h2>Changes</h2>
        <p>
          If this policy changes, the &ldquo;last updated&rdquo; date above will
          change with it. Material changes will be noted on this page.
        </p>
      </Prose>
    </ContentPage>
  );
}
