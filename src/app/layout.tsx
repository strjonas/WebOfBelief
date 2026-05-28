import type { Metadata } from "next";
import Link from "next/link";
import { IBM_Plex_Mono, IBM_Plex_Sans, Spectral } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SiteHeader } from "@/components/site-header";
import { siteUrl } from "@/lib/site";
import "./globals.css";

const spectral = Spectral({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const plexSans = IBM_Plex_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: "Web of Belief | See whether your beliefs fit together",
    template: "%s | Web of Belief",
  },
  description:
    "A source-backed belief consistency checker that separates direct conflicts, logical implications, and live philosophical arguments.",
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
