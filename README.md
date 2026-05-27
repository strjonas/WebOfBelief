# Web of Belief

**See whether your beliefs actually fit together.**
[webofbelief.app](https://webofbelief.app) · [Live demo](https://consistent-three.vercel.app) · [Method & sources](https://consistent-three.vercel.app/method)

You answer plain statements about God, morality, meaning, free will, mind, and
right action. A small, inspectable rule engine then shows you where your stated
beliefs **contradict**, what they **commit you to**, and which "obviously
incompatible" pairs are in fact **coherent**. Every result links to the relevant
[Stanford Encyclopedia of Philosophy](https://plato.stanford.edu/) entry.

Named after Quine and Ullian's *The Web of Belief* (1970): no belief stands
alone; they hang together, and a strain in one place is felt across the web.

## What it tells you

Each result is one of four kinds, and the engine is deliberately conservative —
it only ever reasons from statements you explicitly mark "I believe this."

| Kind | Meaning |
| --- | --- |
| **Direct conflict** | The exact statements you affirmed cannot both be true as worded (e.g. "a personal God exists" + "no deity exists"). |
| **Logical implication** | Your answers (sometimes plus one stated bridge) validly entail a further conclusion you may not have meant to accept (e.g. atheism + "morality is only God's commands" ⟹ nothing is obligatory). |
| **Live argument** | A serious tension that turns on a disputed bridge premise, which the result names and leaves open (e.g. divine hiddenness; the evidentialist challenge to theism). |
| **Coherent combination** | A pairing often dismissed as incoherent that has a recognized philosophical home (e.g. atheism + objective meaning). |

## Design principles

- **A mirror, not a judge.** Every result is framed as a fork you decide, never
  a verdict. It does not tell you which belief to drop. The goal is the examined
  life, and the experience is meant to be edifying, not crushing.
- **Restraint over false precision.** No "consistency score," no AI inference, no
  Z3 verdict. The hard part is whether a natural-language commitment entails a
  contested bridge premise — a philosophical question, not a solver bug — so the
  app exposes each premise instead of disguising interpretation as proof.
- **Sourced.** Topic selection is grounded in the
  [PhilPapers 2020 Survey](https://survey2020.philpeople.org/) and
  [Pew's Religious Landscape Study](https://www.pewresearch.org/rls/); every
  position summary and rule cites SEP.
- **Private by default.** Answers live only in browser memory. The shareable
  badge and summary contain counts only — never your individual answers — and
  nothing is uploaded.

## Run locally

```bash
npm install
npm run dev    # http://localhost:3000
```

In production, set `NEXT_PUBLIC_SITE_URL` to the canonical HTTPS origin (e.g.
`https://webofbelief.app`) so canonical tags, the sitemap, robots, the social
preview, and the share badge all use that domain. Without it, a Vercel build
falls back to its production URL.

## Verify

```bash
npm test     # rule-engine + component tests (Vitest)
npm run lint
npm run build
```

## How it's built

- `src/lib/beliefs.ts` — statement wording, plain-language glosses, balanced
  for/against summaries, and source metadata.
- `src/lib/evaluate.ts` — the deterministic finding rules (the whole "engine").
- `src/lib/evaluate.test.ts` — guards the line between contradiction, implication,
  disputed argument, and coherent combination.
- `src/components/belief-checker.tsx` — the browser-only questionnaire, results,
  edifying framing, and the client-side share badge (drawn with Canvas, no deps).
- `src/app/method/page.tsx` — published method, limits, and full source library.

Next.js 16 (App Router) + React 19. No database or accounts; responses exist only
in local component state.

## Launch & legal

Research rationale and community-posting constraints are in
[docs/research-and-launch.md](docs/research-and-launch.md). Any public launch
should invite correction of the argument map rather than claim philosophical
proof. Before a public production deployment, confirm applicable provider/privacy
disclosures for your jurisdiction (for Germany, `§ 5 DDG` and GDPR transparency).
