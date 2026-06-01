import type { Metadata } from "next";
import { ContentPage } from "@/components/content-page";
import { BeliefCompare } from "@/components/belief-compare";

const compareTitle = "Compare belief webs — see where two worldviews differ";
const compareDescription =
  "Open a friend's belief web and see exactly where yours pulls apart from theirs — and the premise on each fault line. Answers travel inside the link, never to a server.";

export const metadata: Metadata = {
  title: compareTitle,
  description: compareDescription,
  alternates: { canonical: "/compare-beliefs" },
  openGraph: {
    title: compareTitle,
    description: compareDescription,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: compareTitle,
    description: compareDescription,
  },
};

export default function CompareBeliefsPage() {
  return (
    <ContentPage
      eyebrow="compare webs"
      title="Where your webs differ."
      lede={
        <p>
          A shared belief web, laid over your own. This isn&apos;t about who is
          right — it&apos;s about seeing where two worldviews actually pull
          apart, and on which premise. Both webs are read in your browser; the
          answers ride inside the link and never reach a server.
        </p>
      }
    >
      <BeliefCompare />
    </ContentPage>
  );
}
