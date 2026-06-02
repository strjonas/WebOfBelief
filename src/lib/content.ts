import type { MetadataRoute } from "next";

/**
 * Single source of truth for every indexable route. The sitemap, the guides
 * index, and the footer all read from here so they can never drift apart.
 *
 * `lastModified` is an ISO date string; bump it when you meaningfully revise a
 * page so crawlers re-fetch it.
 */
export interface ContentEntry {
  path: string;
  title: string;
  /** Short description used for cards, list pages, and <meta name="description">. */
  description: string;
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
  priority: number;
  lastModified: string;
  /** Reading time shown on guide cards, e.g. "6 min read". */
  readingTime?: string;
}

const REVISED = "2026-06-01";

export const guides: ContentEntry[] = [
  {
    path: "/guides/what-is-a-belief-consistency-check",
    title: "What is a belief consistency check?",
    description:
      "A plain-language explanation of what it means to test whether your beliefs fit together — and why a consistency check is a mirror, not a verdict.",
    changeFrequency: "monthly",
    priority: 0.7,
    lastModified: REVISED,
    readingTime: "6 min read",
  },
  {
    path: "/guides/contradiction-vs-tension",
    title: "Contradiction, implication, or tension? How to tell the difference",
    description:
      "Not every clash between beliefs is a contradiction. How to distinguish a flat contradiction from a conditional implication and a live philosophical argument.",
    changeFrequency: "monthly",
    priority: 0.7,
    lastModified: REVISED,
    readingTime: "7 min read",
  },
  {
    path: "/guides/why-worldview-consistency-matters",
    title: "Why worldview consistency matters (and when it doesn't)",
    description:
      "Consistency is a floor, not a finish line. Why holding your commitments on purpose is worth the discomfort — and the limits of consistency as a goal.",
    changeFrequency: "monthly",
    priority: 0.7,
    lastModified: REVISED,
    readingTime: "6 min read",
  },
];

/**
 * Top-level pages beyond the home page and the guides. Order here is the order
 * used in the footer "Explore" column.
 */
export const corePages: ContentEntry[] = [
  {
    path: "/method",
    title: "Method & sources",
    description:
      "How Web of Belief distinguishes direct conflicts, conditional implications, and live philosophical arguments, and which sources support its prompts.",
    changeFrequency: "monthly",
    priority: 0.8,
    lastModified: REVISED,
  },
  {
    path: "/how-it-differs",
    title: "How Web of Belief differs from other belief & worldview tests",
    description:
      "An honest comparison of Web of Belief with personality-style worldview quizzes, the PhilPapers survey, and asking an AI chatbot about your beliefs.",
    changeFrequency: "monthly",
    priority: 0.8,
    lastModified: REVISED,
  },
  {
    path: "/compare-beliefs",
    title: "Friends compare — see where two belief webs differ",
    description:
      "Open a friend's belief web and see exactly where yours pulls apart from theirs — and the premise on each fault line. Privacy-clean: answers ride in the link, never a server.",
    changeFrequency: "monthly",
    priority: 0.7,
    lastModified: REVISED,
  },
  {
    path: "/guides",
    title: "Guides",
    description:
      "Plain-language writing on belief, consistency, contradiction, and the examined life — useful whether or not you take the check.",
    changeFrequency: "weekly",
    priority: 0.7,
    lastModified: REVISED,
  },
  {
    path: "/about",
    title: "About",
    description:
      "Who built Web of Belief, why it exists, and the sources and principles behind it.",
    changeFrequency: "yearly",
    priority: 0.5,
    lastModified: REVISED,
  },
  {
    path: "/contact",
    title: "Contact & feedback",
    description:
      "Send feedback, report a problem with a finding, or get in touch about Web of Belief.",
    changeFrequency: "yearly",
    priority: 0.4,
    lastModified: REVISED,
  },
];

export const legalPages: ContentEntry[] = [
  {
    path: "/privacy",
    title: "Privacy policy",
    description:
      "What Web of Belief processes (almost nothing), what stays in your browser, and the anonymous, cookieless usage analytics it uses.",
    changeFrequency: "yearly",
    priority: 0.3,
    lastModified: REVISED,
  },
  {
    path: "/terms",
    title: "Terms of use",
    description:
      "The terms for using Web of Belief: a free, open-source reflection tool offered as-is, not professional, legal, medical, or spiritual advice.",
    changeFrequency: "yearly",
    priority: 0.3,
    lastModified: REVISED,
  },
  {
    path: "/impressum",
    title: "Impressum",
    description: "Operator information and legal disclosures (§ 5 DDG).",
    changeFrequency: "yearly",
    priority: 0.2,
    lastModified: REVISED,
  },
];

/** The home page, listed explicitly so the sitemap has a complete picture. */
export const homeEntry: ContentEntry = {
  path: "/",
  title: "Web of Belief — see whether your beliefs fit together",
  description:
    "A source-backed belief consistency checker that separates direct conflicts, conditional implications, and live philosophical arguments.",
  changeFrequency: "weekly",
  priority: 1,
  lastModified: REVISED,
};

/** Every indexable route, deduplicated, for the sitemap. */
export const allContent: ContentEntry[] = [
  homeEntry,
  ...corePages,
  ...guides,
  ...legalPages,
];
