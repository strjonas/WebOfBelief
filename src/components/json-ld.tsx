/**
 * Renders a <script type="application/ld+json"> block for structured data.
 * Inline JSON-LD is allowed by the site CSP (script-src 'unsafe-inline') and is
 * read by Google for rich results and better understanding of the page.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // The payload is static, author-controlled data — no user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
