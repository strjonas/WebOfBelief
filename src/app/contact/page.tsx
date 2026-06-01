import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage } from "@/components/content-page";
import {
  contactEmail,
  feedbackMailto,
  githubUrl,
  linkedInUrl,
  twitterUrl,
} from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact & feedback",
  description:
    "Send feedback, report a problem with a finding, or get in touch about Web of Belief.",
  alternates: { canonical: "/contact" },
};

const channels = [
  {
    label: "Email",
    value: contactEmail,
    href: `mailto:${contactEmail}`,
    note: "The fastest way to reach me. I read every message.",
  },
  {
    label: "LinkedIn",
    value: "Connect on LinkedIn",
    href: linkedInUrl,
    note: "Happy to connect — say where you found Web of Belief.",
    external: true,
  },
  {
    label: "X / Twitter",
    value: "@StrabelJonas",
    href: twitterUrl,
    note: "Occasional thoughts on belief, philosophy, and the project.",
    external: true,
  },
  {
    label: "GitHub",
    value: "Open an issue",
    href: `${githubUrl}/issues`,
    note: "Best for bugs, or to dispute a specific finding or source.",
    external: true,
  },
];

export default function ContactPage() {
  return (
    <ContentPage
      eyebrow="contact"
      title="Tell me what you think."
      lede={
        <p>
          Web of Belief gets better when people push back on it. If a finding
          reads wrong, a source looks misrepresented, or something simply
          confused you — that&apos;s exactly what I want to hear.
        </p>
      }
    >
      <a
        href={feedbackMailto}
        className="inline-flex items-baseline gap-3 border border-ink bg-ink px-6 py-4 font-sans text-[0.82rem] uppercase tracking-[0.18em] text-paper transition hover:border-mark hover:bg-mark"
      >
        <span aria-hidden="true">✉</span> Send feedback
      </a>
      <p className="mt-3 font-sans text-[0.72rem] uppercase tracking-[0.16em] text-muted">
        Opens your email app, pre-addressed to {contactEmail}.
      </p>

      <dl className="mt-12 border-t border-rule-soft">
        {channels.map((c) => (
          <div
            key={c.label}
            className="grid gap-1 border-b border-rule-soft py-6 sm:grid-cols-[8rem_1fr] sm:gap-6"
          >
            <dt className="font-sans text-[0.7rem] uppercase tracking-[0.2em] text-muted">
              {c.label}
            </dt>
            <dd>
              <a
                href={c.href}
                {...(c.external ? { target: "_blank", rel: "noreferrer" } : {})}
                className="font-serif text-[1.1rem] text-ink underline decoration-mark/40 underline-offset-[4px] transition hover:decoration-mark"
              >
                {c.value}
              </a>
              <p className="mt-1 font-serif text-[0.97rem] leading-7 text-muted">
                {c.note}
              </p>
            </dd>
          </div>
        ))}
      </dl>

      <p className="mt-10 font-serif text-[1rem] leading-7 text-muted">
        Curious how the engine reaches its findings before you write?{" "}
        <Link
          href="/method"
          className="text-mark underline decoration-mark/40 underline-offset-[3px] transition hover:decoration-mark"
        >
          Read the method &amp; sources
        </Link>
        .
      </p>
    </ContentPage>
  );
}
