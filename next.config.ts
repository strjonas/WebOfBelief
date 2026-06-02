import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

// Content Security Policy.
// This is a statically-rendered site, so we avoid a nonce-based CSP (which
// would force every page into dynamic rendering and disable CDN caching).
// That means 'unsafe-inline' is required for the styles/scripts Next.js injects.
// 'unsafe-eval' is only needed in dev (React debugging). The share badge is a
// client-side canvas data: URL, so img-src allows data:.
const csp = [
  `default-src 'self'`,
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  `style-src 'self' 'unsafe-inline'`,
  `img-src 'self' blob: data:`,
  `font-src 'self'`,
  `media-src 'self'`,
  `connect-src 'self'`,
  `object-src 'none'`,
  `base-uri 'self'`,
  `form-action 'self'`,
  `frame-ancestors 'self'`,
  `upgrade-insecure-requests`,
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  async redirects() {
    return [
      // The "vs. other tools" page used to live at /compare, which collided
      // with the friends-compare feature. It's now /how-it-differs.
      {
        source: "/compare",
        destination: "/how-it-differs",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
