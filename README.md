# Web of Belief

**See whether your beliefs actually fit together.**
[webofbelief.app](https://webofbelief.app) · [Method &amp; sources](https://webofbelief.app/method)

<img width="1200" height="630" alt="image" src="https://github.com/user-attachments/assets/5e5121a3-0cd9-4e8d-82b5-7508cefb16f6" />

You answer eighteen plain questions — covering thirty-five distinct positions —
about morality, freedom, mind, AI consciousness, knowledge, identity, God, and
right action. On each topic you can hold one position, several, or none. A
small, inspectable rule engine then
shows where your stated beliefs **flatly clash**, where one quietly **commits
you to another** under a stated premise, and which "obviously incompatible"
pairs are in fact **coherent**. Every result names the exact pair of statements
you affirmed and links to the relevant
[Stanford Encyclopedia of Philosophy](https://plato.stanford.edu/) entry, with
focused research sources added where a question needs them.

It's a mirror you can argue with — not a score, a label, or a verdict on you.
Nothing is uploaded: your answers live only in your browser.

Named after Quine and Ullian's *The Web of Belief* (1970): no belief stands
alone; they hang together, and a strain in one place is felt across the web.

## Try it in two minutes

1. Open [webofbelief.app](https://webofbelief.app) (or run it locally, below).
2. Answer only the questions you want to examine & skip the rest. Topic
   questions let you select any combination of positions, or mark the topic
   "It's complicated (none of the above)"; yes/no claims take "Yes," "No,"
   "Not sure," or "It's complicated." Only affirmations are ever reasoned
   from.
3. Finish via the review screen. You get an interactive map of your web — affirmed beliefs lit
   up, the rules your answers triggered drawn between them — and a written
   finding for each tension, sourced.
4. **Share** a card with your counts and graph shape (never your answers), or
   **send a friend a compare link** to see exactly where your two webs pull
   apart.

## What it tells you

Each result is one of four kinds. The engine is deliberately conservative — it
only ever reasons from statements you explicitly mark "I believe this."

| Kind | Meaning |
| --- | --- |
| ⊥ &nbsp;**Direct conflict** | The exact statements you affirmed cannot both be true as worded. *Example:* "a personal God exists" + "no deity exists". |
| ⊢ &nbsp;**Conditional implication** | Your answers, sometimes under one explicitly stated added premise, entail a further conclusion you may not have meant to accept. The added premise is open to rejection. *Example:* atheism + "morality is only God's commands" ⟹ nothing is obligatory. |
| ‡ &nbsp;**Live argument** | A serious tension that turns on a disputed bridge premise, which the result names and leaves open. *Example:* divine hiddenness; the evidentialist challenge to theism. |
| ≈ &nbsp;**Coherent combination** | A pairing often dismissed as incoherent that has a recognized philosophical home. *Example:* atheism + objective meaning. |

The thirty-five positions span five topics — **morality and meaning**,
**freedom and responsibility**, **mind and consciousness**, **God and
evidence**, and **right action** — with added coverage for knowledge, personal
identity, spiritual-but-not-theist views, agnosticism, non-classical theism,
virtue ethics, moral error theory, subjectivism about meaning, and the
Buddhist/Parfitian no-self view. Topic
selection is grounded in the
[PhilPapers 2020 Survey](https://survey2020.philpeople.org/) of philosophers and
[Pew's Religious Landscape Study](https://www.pewresearch.org/rls/).

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
- **Sourced.** Every finding cites at least one SEP entry, with additional
  focused sources where the question needs them.
- **Private by default.** Answers live only in browser memory. The shareable
  card and the compare link carry counts and graph shape — or, for compare, the
  answers themselves encoded in the URL *fragment*, which browsers never send to
  a server. Nothing is uploaded.

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
- `src/lib/share-code.ts` — encodes/decodes the answer map for compare links,
  entirely in the URL fragment so the server never sees it.
- `src/components/belief-web-diagram.tsx` — the SVG rule-graph used on the home
  page and drawn into the share card.
- `src/components/interactive-belief-web.tsx` — the results map: trace any
  belief's relationships, or tap a line to read why a pair pulls apart.
- `src/components/belief-checker.tsx` — the browser-only questionnaire,
  results, edifying framing, and the client-side share badge (drawn with
  Canvas, no deps).
- `src/components/belief-compare.tsx` — the two-web comparison view.
- `src/app/method/page.tsx` — published method, limits, and full source
  library.

Next.js 16 (App Router) + React 19. No database, no accounts. Anonymous,
cookieless pageview counts via Vercel Web Analytics; individual answers are
never sent anywhere.

## License

MIT — see [`LICENSE`](LICENSE).
</content>
</invoke>
