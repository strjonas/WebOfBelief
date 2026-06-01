import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage } from "@/components/content-page";
import { JsonLd } from "@/components/json-ld";
import { guides } from "@/lib/content";
import { siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Guides",
  description:
    "Plain-language writing on belief, consistency, contradiction, and the examined life — useful whether or not you take the check.",
  alternates: { canonical: "/guides" },
};

export default function GuidesPage() {
  return (
    <ContentPage
      eyebrow="guides"
      title="Reading on belief and consistency."
      lede={
        <p>
          Practical, source-aware writing on what it means for beliefs to fit
          together. You can read these whether or not you take the check.
        </p>
      }
    >
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          itemListElement: guides.map((guide, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: new URL(guide.path, siteUrl).toString(),
            name: guide.title,
          })),
        }}
      />
      <ul className="border-t border-rule-soft">
        {guides.map((guide) => (
          <li key={guide.path}>
            <Link
              href={guide.path}
              className="group grid gap-2 border-b border-rule-soft py-7 transition"
            >
              <span className="font-sans text-[0.68rem] uppercase tracking-[0.2em] text-muted">
                {guide.readingTime}
              </span>
              <h2 className="font-serif text-[1.45rem] font-medium leading-snug tracking-tight text-ink underline decoration-mark/30 decoration-1 underline-offset-[6px] transition group-hover:decoration-mark">
                {guide.title}
              </h2>
              <p className="max-w-2xl font-serif text-[1rem] leading-7 text-ink-soft">
                {guide.description}
              </p>
              <span className="mt-1 font-sans text-[0.74rem] uppercase tracking-[0.18em] text-mark">
                Read guide{" "}
                <span className="transition group-hover:translate-x-1">→</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </ContentPage>
  );
}
