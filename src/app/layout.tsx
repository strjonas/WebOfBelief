import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { siteUrl } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: "Belief Mirror | Examine what fits together",
    template: "%s | Belief Mirror",
  },
  description:
    "A source-backed belief consistency checker that separates direct conflicts from live philosophical arguments.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Belief Mirror | Examine what fits together",
    description:
      "Reflect on worldview commitments with explicit logic and balanced philosophical sources.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Belief Mirror | Examine what fits together",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-[#f7f8fa] text-slate-900">
        <SiteHeader />
        {children}
        <footer className="mt-auto border-t border-slate-200 bg-white">
          <div className="mx-auto flex w-full max-w-6xl flex-col justify-between gap-3 px-6 py-7 text-sm text-slate-500 sm:flex-row lg:px-8">
            <p>Belief Mirror. Reflection prompts, not a verdict on a person.</p>
            <div className="flex flex-wrap gap-5">
              <Link className="transition hover:text-slate-900" href="/method">
                Method, sources, and limitations
              </Link>
              <a
                className="transition hover:text-slate-900"
                href="https://github.com/strjonas/consistent"
                target="_blank"
                rel="noreferrer"
              >
                Source on GitHub
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
