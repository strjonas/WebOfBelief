import type { Metadata } from "next";
import Link from "next/link";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import { SiteHeader } from "@/components/site-header";
import { JsonLd } from "@/components/json-ld";
import {
  contactEmail,
  githubUrl,
  linkedInUrl,
  twitterUrl,
  siteName,
  siteUrl,
} from "@/lib/site";
import "./globals.css";

const spectral = localFont({
  src: [
    { path: "./fonts/spectral-latin-300-normal.woff2", weight: "300" },
    {
      path: "./fonts/spectral-latin-300-italic.woff2",
      weight: "300",
      style: "italic",
    },
    { path: "./fonts/spectral-latin-400-normal.woff2", weight: "400" },
    {
      path: "./fonts/spectral-latin-400-italic.woff2",
      weight: "400",
      style: "italic",
    },
    { path: "./fonts/spectral-latin-500-normal.woff2", weight: "500" },
    {
      path: "./fonts/spectral-latin-500-italic.woff2",
      weight: "500",
      style: "italic",
    },
    { path: "./fonts/spectral-latin-600-normal.woff2", weight: "600" },
    {
      path: "./fonts/spectral-latin-600-italic.woff2",
      weight: "600",
      style: "italic",
    },
    { path: "./fonts/spectral-latin-700-normal.woff2", weight: "700" },
    {
      path: "./fonts/spectral-latin-700-italic.woff2",
      weight: "700",
      style: "italic",
    },
  ],
  display: "swap",
  fallback: ["Georgia", "Times New Roman", "serif"],
  adjustFontFallback: "Times New Roman",
  variable: "--font-serif",
});

const plexSans = localFont({
  src: [
    { path: "./fonts/ibm-plex-sans-latin-400-normal.woff2", weight: "400" },
    { path: "./fonts/ibm-plex-sans-latin-500-normal.woff2", weight: "500" },
    { path: "./fonts/ibm-plex-sans-latin-600-normal.woff2", weight: "600" },
    { path: "./fonts/ibm-plex-sans-latin-700-normal.woff2", weight: "700" },
  ],
  display: "swap",
  fallback: ["system-ui", "Arial", "sans-serif"],
  variable: "--font-sans",
});

const plexMono = localFont({
  src: [
    { path: "./fonts/ibm-plex-mono-latin-400-normal.woff2", weight: "400" },
    { path: "./fonts/ibm-plex-mono-latin-500-normal.woff2", weight: "500" },
    { path: "./fonts/ibm-plex-mono-latin-600-normal.woff2", weight: "600" },
  ],
  display: "swap",
  fallback: ["SFMono-Regular", "Menlo", "monospace"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: "Web of Belief | See whether your beliefs fit together",
    template: "%s | Web of Belief",
  },
  description:
    "A source-backed belief consistency checker that separates direct conflicts, conditional implications, and live philosophical arguments.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Web of Belief | See whether your beliefs fit together",
    description:
      "Reflect on worldview commitments with explicit logic and balanced philosophical sources.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Web of Belief | See whether your beliefs fit together",
    description:
      "Reflect on worldview commitments with explicit logic and balanced philosophical sources.",
  },
  // Set NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION to the token Google Search Console
  // gives you (HTML-tag method) to verify ownership. Optional once the DNS or
  // sitemap-based verification is in place.
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${spectral.variable} ${plexSans.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-paper text-ink">
        <SiteHeader />
        {children}
        <footer className="mt-auto border-t border-rule">
          <div className="mx-auto w-full max-w-6xl px-6 py-12 lg:px-8">
            <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4">
              <div className="col-span-2 sm:col-span-1">
                <p className="font-serif text-lg font-medium tracking-tight text-ink">
                  Web of Belief
                </p>
                <p className="mt-2 max-w-xs font-serif text-[0.95rem] leading-6 text-muted">
                  Reflection prompts, not a verdict on a person.
                </p>
              </div>

              <nav aria-label="Explore">
                <p className="font-sans text-[0.65rem] uppercase tracking-[0.22em] text-mark">
                  Explore
                </p>
                <ul className="mt-4 space-y-2.5 font-sans text-[0.82rem] text-ink-soft">
                  <li>
                    <Link className="transition hover:text-mark" href="/method">
                      Method &amp; sources
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="transition hover:text-mark"
                      href="/compare-beliefs"
                    >
                      Compare with a friend
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="transition hover:text-mark"
                      href="/compare"
                    >
                      Compare to other tools
                    </Link>
                  </li>
                  <li>
                    <Link className="transition hover:text-mark" href="/guides">
                      Guides
                    </Link>
                  </li>
                  <li>
                    <Link className="transition hover:text-mark" href="/about">
                      About
                    </Link>
                  </li>
                </ul>
              </nav>

              <nav aria-label="Legal">
                <p className="font-sans text-[0.65rem] uppercase tracking-[0.22em] text-mark">
                  Trust
                </p>
                <ul className="mt-4 space-y-2.5 font-sans text-[0.82rem] text-ink-soft">
                  <li>
                    <Link
                      className="transition hover:text-mark"
                      href="/privacy"
                    >
                      Privacy
                    </Link>
                  </li>
                  <li>
                    <Link className="transition hover:text-mark" href="/terms">
                      Terms
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="transition hover:text-mark"
                      href="/impressum"
                    >
                      Impressum
                    </Link>
                  </li>
                  <li>
                    <a
                      className="transition hover:text-mark"
                      href={githubUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Source on GitHub
                    </a>
                  </li>
                </ul>
              </nav>

              <nav aria-label="Connect">
                <p className="font-sans text-[0.65rem] uppercase tracking-[0.22em] text-mark">
                  Connect
                </p>
                <ul className="mt-4 space-y-2.5 font-sans text-[0.82rem] text-ink-soft">
                  <li>
                    <Link
                      className="transition hover:text-mark"
                      href="/contact"
                    >
                      Contact
                    </Link>
                  </li>
                  <li>
                    <a
                      className="transition hover:text-mark"
                      href={linkedInUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      LinkedIn
                    </a>
                  </li>
                  <li>
                    <a
                      className="transition hover:text-mark"
                      href={twitterUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      X / Twitter
                    </a>
                  </li>
                  <li>
                    <a
                      className="transition hover:text-mark"
                      href={`mailto:${contactEmail}`}
                    >
                      {contactEmail}
                    </a>
                  </li>
                </ul>
              </nav>
            </div>

            <p className="mt-10 border-t border-rule-soft pt-6 font-sans text-[0.68rem] uppercase tracking-[0.16em] text-muted">
              <span className="font-mono normal-case tracking-normal text-ink">
                §
              </span>{" "}
              © {new Date().getFullYear()} Web of Belief · A source-backed
              belief consistency check.
            </p>
          </div>
        </footer>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: siteName,
            url: siteUrl.toString(),
          }}
        />
        <Analytics />
      </body>
    </html>
  );
}
