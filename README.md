# Belief Mirror

Belief Mirror is a source-backed worldview reflection website. Users affirm,
reject, or remain unsure about carefully worded statements. The app reports:

- `Direct conflict`: exact affirmed propositions cannot both hold as worded.
- `Live argument`: a significant tension that needs an exposed, disputed
  bridge premise.
- `Coherent combination`: a pairing frequently treated as conflicting even
  though it has a recognized philosophical account.

It intentionally does not score a person, infer an entire worldview from an
identity label, or interpret arbitrary free-text beliefs.

## Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The methodology and
source library are available at `/method`.

For production, set `NEXT_PUBLIC_SITE_URL` to the canonical HTTPS origin,
especially after attaching a custom domain. This ensures canonical, sitemap,
robots, and social-preview URLs use that domain. Without it, a Vercel build
falls back to its Vercel production URL.

## Verify

```bash
npm test
npm run lint
npm run build
npm audit --audit-level=moderate
```

## Architecture

- `src/lib/beliefs.ts` holds question wording, balanced position summaries,
  and source metadata.
- `src/lib/evaluate.ts` holds the small deterministic finding rule set.
- `src/lib/evaluate.test.ts` guards the distinction between contradiction,
  disputed argument, and compatible combination.
- `src/components/belief-checker.tsx` implements the browser-only questionnaire
  and privacy-safe summary.
- `src/app/method/page.tsx` publishes limits and citations.

The app uses Next.js 16 App Router and React 19. No database or account system
is needed for the initial product; responses exist only in local component
state.

## Research And Release

Research rationale and current community-posting constraints are recorded in
[docs/research-and-launch.md](docs/research-and-launch.md). Any public launch
should request corrections rather than claim philosophical proof.

Before making a public production deployment, confirm any applicable legal
pages and hosting/privacy disclosures for the publisher's jurisdiction. For a
publisher in Germany, review `§ 5 DDG` provider-information requirements and
GDPR transparency obligations rather than assuming a static site requires no
public notices.
