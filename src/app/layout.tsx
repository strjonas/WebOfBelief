import type { Metadata } from "next";
import Link from "next/link";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import { SiteHeader } from "@/components/site-header";
import { siteUrl } from "@/lib/site";
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
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-6 py-8 font-sans text-xs uppercase tracking-[0.16em] text-muted sm:flex-row sm:items-center sm:justify-between lg:px-8">
            <p>
              <span className="font-mono normal-case tracking-normal text-ink">
                §
              </span>{" "}
              Web of Belief — reflection prompts, not a verdict on a person.
            </p>
            <div className="flex flex-wrap gap-5">
              <Link className="transition hover:text-ink" href="/method">
                Method &amp; sources
              </Link>
              <a
                className="transition hover:text-ink"
                href="https://github.com/strjonas/consistent"
                target="_blank"
                rel="noreferrer"
              >
                Source on GitHub
              </a>
            </div>
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
