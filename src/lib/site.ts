const configuredSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const siteUrl = new URL(configuredSiteUrl);

/** Brand name used in copy and structured data. */
export const siteName = "Web of Belief";

/** Public-facing contact address. Forward this inbox to wherever you read mail. */
export const contactEmail = "contact@webofbelief.app";

/**
 * A mailto: link that pre-fills a subject so feedback lands tagged in your
 * inbox. Used by the "Send feedback" buttons.
 */
export const feedbackMailto = `mailto:${contactEmail}?subject=${encodeURIComponent(
  "Web of Belief — feedback",
)}&body=${encodeURIComponent(
  "What worked, what was confusing, what you'd change:\n\n",
)}`;

/** Public GitHub repository. */
export const githubUrl = "https://github.com/strjonas/consistent";

export const linkedInUrl = "https://www.linkedin.com/in/jonas-strabel/";

export const twitterUrl = "https://x.com/StrabelJonas";

/**
 * Operator details for the German Impressum (§ 5 DDG / § 18 MStV) and the
 * legal pages. Reused from accountycat.com — same operator.
 */
export const operator = {
  name: "Jonas Strabel",
  street: "Auf dem Gewölb 12",
  city: "55291 Saulheim",
  country: "Deutschland",
  email: contactEmail,
} as const;
