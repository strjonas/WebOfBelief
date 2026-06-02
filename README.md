# Web of Belief

**See whether your beliefs actually fit together.**
[webofbelief.app](https://webofbelief.app) · [Method &amp; sources](https://webofbelief.app/method)

You answer plain statements about morality, meaning, free will, mind, God, and
right action. A small, inspectable rule engine then shows you where your stated
beliefs **contradict**, what they **may commit you to under stated premises**,
and which "obviously incompatible" pairs are in fact **coherent**. Every result
links to the relevant [Stanford Encyclopedia of Philosophy](https://plato.stanford.edu/)
entry, with focused research sources added where needed. It's a mirror you can
argue with — not a score, a label, or a verdict on you.

Named after Quine and Ullian's *The Web of Belief* (1970): no belief stands
alone; they hang together, and a strain in one place is felt across the web.

## What it tells you

Each result is one of four kinds. The engine is deliberately conservative — it
only ever reasons from statements you explicitly mark "I believe this."

| Kind | Meaning |
| --- | --- |
| ⊥ &nbsp;**Direct conflict** | The exact statements you affirmed cannot both be true as worded. *Example:* "a personal God exists" + "no deity exists". |
| ⊢ &nbsp;**Conditional implication** | Your answers, sometimes under one explicitly stated added premise, entail a further conclusion you may not have meant to accept. The added premise is open to rejection. *Example:* atheism + "morality is only God's commands" ⟹ nothing is obligatory. |
| ‡ &nbsp;**Live argument** | A serious tension that turns on a disputed bridge premise, which the result names and leaves open. *Example:* divine hiddenness; the evidentialist challenge to theism. |
| ≈ &nbsp;**Coherent combination** | A pairing often dismissed as incoherent that has a recognized philosophical home. *Example:* atheism + objective meaning. |

## Design principles

- **A mirror, not a judge.** Every result is framed as a fork you decide,
  never a verdict. It does not tell you which belief to drop; revision,
  qualification, and defended bridge premises all remain live options. The goal
  is the examined life, and the experience is meant to be edifying, not
  crushing.
- **Restraint over false precision.** No "consistency score," no AI inference,
  no Z3 verdict. The hard part is whether a natural-language commitment
  entails a contested bridge premise — a philosophical question, not a solver
  bug — so the app exposes each premise instead of disguising interpretation
  as proof.
- **Sourced.** Topic selection is grounded in the
  [PhilPapers 2020 Survey](https://survey2020.philpeople.org/) and
  [Pew's Religious Landscape Study](https://www.pewresearch.org/rls/); every
  finding cites at least one SEP entry, with additional focused sources where
  the question needs them.
- **Private by default.** Answers live only in browser memory. The shareable
  badge and summary contain counts and graph shape only — never your
  individual answers — and nothing is uploaded.

## Run locally

```bash
npm install
npm run dev    # http://localhost:3000
npm test       # rule-engine + component tests (Vitest)
npm run build  # production build
```

## How it's built

- `src/lib/beliefs.ts` — statement wording, plain-language glosses, balanced
  for/against summaries, and source metadata.
- `src/lib/evaluate.ts` — the deterministic finding rules (the whole "engine").
- `src/lib/evaluate.test.ts` — guards the line between contradiction,
  implication, disputed argument, and coherent combination.
- `src/components/belief-web-diagram.tsx` — the SVG rule-graph used on the
  home page, results page, and as the share badge.
- `src/components/belief-checker.tsx` — the browser-only questionnaire,
  results, edifying framing, and the client-side share badge (drawn with
  Canvas, no deps).
- `src/app/method/page.tsx` — published method, limits, and full source
  library.

Next.js 16 (App Router) + React 19. No database, no accounts. Anonymous,
cookieless pageview counts via Vercel Web Analytics; individual answers are
never sent anywhere.

## License

MIT — see [`LICENSE`](LICENSE).
