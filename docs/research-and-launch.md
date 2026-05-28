# Research and launch notes

Reviewed: 2026-05-27. (App renamed to **Web of Belief**, after Quine & Ullian's
*The Web of Belief*; intended domain `webofbelief.app`.)

## Product standard

No general worldview checker can responsibly promise "99% correct" about
natural-language beliefs. The model is deliberately narrower:

1. It reasons only from propositions a user explicitly affirms.
2. It labels a `Direct conflict` only when those exact formulations conflict.
3. It labels a `Logical implication` when affirmed statements (sometimes with one
   explicitly stated bridge) validly entail a further conclusion the user may not
   have meant to endorse — e.g. `noDeity` + `divineCommandOnly` entail that
   nothing is obligatory.
4. It labels contested moves as `Live argument` and states the needed premise.
5. It highlights some `Coherent combination` results to avoid common false
   accusations of inconsistency.
6. It does not accept arbitrary free-text beliefs in this initial version.

### Soundness review (2026-05-27)

- The eight strict `Direct conflict` rules are pairs whose precise wordings are
  contradictories, so a contradiction is reported only on double-affirmation.
- `minorConvenienceHarmWrong` + `factoryFarmPermissible` was **downgraded from a
  conflict to a `Live argument`**: one statement concerns *causing* harm and the
  other *buying from* a harmful system, and the causal-inefficacy / inefficacy
  objection (McMullen & Halteman 2018; SEP *Moral Status of Animals*) is a live
  position on which the two can be held together. The collision now turns on an
  explicit complicity bridge premise.
- `perfectGod` + `moralFacts` was **reframed from an argument to a `Coherent
  combination`**: theistic moral realism is the standard, consistent view, so an
  amber "tension" flag there was a false accusation.

A solver such as Z3 could validate a fixed formal encoding, but cannot establish
whether contested philosophical bridge premises are true or whether a user's
informal sentence means that premise. A transparent rule set is preferable for
this first release.

## Why these topics

The [official PhilPapers 2020 Survey](https://survey2020.philpeople.org/)
reports on 100 questions asked of philosophers, including God, meta-ethics,
meaning of life, mind, free will, trolley problems, and eating animals. It is a
defensible basis for selecting core philosophical domains rather than choosing
questions by intuition alone.

The [Pew Research Center 2023-24 Religious Landscape
Study](https://www.pewresearch.org/rls/) surveyed more than 35,000 United
States adults about religious affiliation, belief in God, practices, and social
views. It establishes public relevance for religion/worldview prompts, not
truth or philosophical consensus.

The question explanations and finding rules rely primarily on the Stanford
Encyclopedia of Philosophy entries linked in the in-product `/method` source
library, including:

- [Atheism and Agnosticism](https://plato.stanford.edu/entries/atheism-agnosticism/)
- [Cosmological Argument](https://plato.stanford.edu/entries/cosmological-argument/)
- [The Problem of Evil](https://plato.stanford.edu/entries/evil/)
- [Hiddenness of God](https://plato.stanford.edu/entries/divine-hiddenness/)
- [Moral Anti-Realism](https://plato.stanford.edu/entries/moral-anti-realism/)
- [Theological Voluntarism](https://plato.stanford.edu/entries/voluntarism-theological/)
- [The Meaning of Life](https://plato.stanford.edu/entries/life-meaning/)
- [Free Will](https://plato.stanford.edu/entries/freewill/)
- [Compatibilism](https://plato.stanford.edu/entries/compatibilism/)
- [Foreknowledge and Free Will](https://plato.stanford.edu/entries/free-will-foreknowledge/)
- [Physicalism](https://plato.stanford.edu/entries/physicalism/)
- [Dualism](https://plato.stanford.edu/entries/dualism/)
- [The Moral Status of Animals](https://plato.stanford.edu/entries/moral-animal/)
- [Consequentialism](https://plato.stanford.edu/entries/consequentialism/)
- [Deontological Ethics](https://plato.stanford.edu/entries/ethics-deontological/)
- [Epistemology of Religion](https://plato.stanford.edu/entries/religion-epistemology/)

## Community fit research

The following rules were checked through each subreddit's public
`/about/rules.json` endpoint on 2026-05-27. Rules can change and must be checked
again immediately before any post.

| Community | Fit | Current blocking or relevant rule |
| --- | --- | --- |
| `r/philosophy` | Moderator approval required for a product | Products, services, and surveys are disallowed without pre-approval; its current rules also restrict generated material. |
| `r/DebateAnAtheist` | Check with moderators first | Its current rules restrict machine-generated or machine-edited content. |
| `r/atheism` | Check with moderators first | Its current rules restrict generated content and links that appear generated. |
| `r/CosmicSkeptic` | Plausible candidate | Public rules require relation to CosmicSkeptic, respect, and no spam or low-effort posts. |

`r/CosmicSkeptic` is the plausible initial discussion community because Alex
O'Connor's public work engages the exact religion, morality, animal ethics, and
free-will topics in the tool. A launch should still check current rules or ask
moderators first, and frame the post as a request for critical correction of
the argument map rather than advertising or promising transformation.

No one can engineer a viral response, and designing for critique and trust is
more appropriate than promising conversion or a psychological outcome.

## Launch post drafts — refined 28 May 2026

The previous drafts read as generic launch posts. These rewrites lead with a
*specific* philosophical observation, demonstrate familiarity with the actual
debates the target audience cares about, and explicitly invite teardown rather
than approval. Pick one Reddit and one X variant, don't run multiple at once.

Re-check each community's rules immediately before posting; r/CosmicSkeptic
public rules currently require relation to CosmicSkeptic, respect, and no
spam or low-effort posts, and the broader atheism subs restrict
machine-generated content.

### Reddit — primary post for r/CosmicSkeptic

The strongest framing here. It earns its place on Alex's sub by landing
directly on the debates he runs (problem of evil, animal ethics, evidentialism,
free will), and it asks for correction rather than approval.

> **Title:** Most "your worldview is inconsistent!" arguments smuggle in a bridge premise nobody states. I formalized the six most common ones — tell me where the rules are wrong.
>
> **Body:**
>
> Watch enough analytical philosophy and a pattern emerges. The accusation
> *"your view is inconsistent!"* almost always smuggles in an unstated
> philosophical premise the other side wouldn't grant. Without the premise,
> the contradiction dissolves; with it, it bites — but it's the premise that
> should be argued, not waved at.
>
> So I wrote a small rule engine that splits *"contradicts itself"* into four
> kinds, every call citing SEP:
>
> - **Direct conflict** — the two sentences negate under their stated meanings. Eight of them. E.g. *"at least one moral truth is mind-independent"* vs. *"every moral truth depends only on approval."*
> - **Logical implication** — your affirmations validly entail a further claim, with the bridge stated. E.g. *"no deity"* + *"obligation holds only because God commands it"* ⊢ nothing is obligatory.
> - **Live argument** — there's a clash *only if* a contested bridge holds, and the bridge is named. Divine hiddenness; causal inefficacy in animal ethics; the consequence argument; evidentialism vs. theism.
> - **Coherent combination** — theism + moral realism, atheism + moral realism, atheism + objective meaning. Surfaced because people get told these are inconsistent when they aren't.
>
> 22 statements, ~5 minutes, every finding cites a Stanford entry, source is open.
>
> **Two judgment calls I expect to lose on:**
>
> 1. *"Factory-farm meat is permissible"* + *"causing minor harm for convenience is wrong"* — I have it as a **live argument**, not a direct conflict, leaning on the inefficacy objection (McMullen & Halteman 2018). Animal ethicists will say I went too soft.
> 2. *"Belief requires adequate evidence"* + *"I believe in God"* — also a **live argument**, not a conflict, because reformed epistemology and properly-basic belief are live replies. Atheists will say I went too soft the other way.
>
> Where is a rule too strong, too weak, or just wrong? Link in comments per sub rules.

**Why this works:** the title is a thesis, not a pitch; the body demonstrates
the actual move the engine makes; the two self-disclosed weak spots invite
the most engaged commenters on both sides to argue, which is how a thread
sustains itself past hour two.

### Reddit — alternative for r/askphilosophy or r/philosophy (mod-permission required)

Drier, more academic, drops the rhetorical title.

> **Title:** A small rule engine that distinguishes direct conflicts, logical implications, and live philosophical arguments across 22 belief statements — looking for corrections to the rules.
>
> **Body:**
>
> Twenty-two statements drawn from PhilPapers 2020 topics (God, meta-ethics,
> meaning of life, mind, free will, animal ethics). The engine reports four
> kinds of finding and is transparent: every rule names the premises it uses
> and a SEP entry.
>
> I'd like specific corrections rather than general impressions. Particular
> calls I'm uncertain about:
>
> - Foreknowledge + alternative possibilities — classified as a live argument with the standard fatalist bridge, not a conflict, on the grounds that Ockham/Boethian/Molinist replies are live.
> - The animal-ethics conflict was downgraded to a live argument on the inefficacy objection. Reasonable to push back.
> - The "atheism + meaning-needs-transcendence" pairing is reported as a *logical implication* (nihilism) rather than a *direct conflict*, with an explicit bridge denying immortal soul.
>
> Source is open. Where would you tighten or loosen a rule?

### X / Bluesky — three variants, pick one

All three are tested to fit the X 280-char limit. Pair with the result-badge
image as the attachment; the dark oxblood diagram reads at thumbnail size.

**Variant A — the surprise-finding hook (recommended).** Story-shape; gives
the reader a specific claim to argue with.

> I built a worldview-consistency checker thinking the *contradictions* would be the interesting findings.
>
> They aren't. The *implications* are.
>
> "No deity" + "obligation comes only from God's command" ⊢ nothing is obligatory.
>
> People affirm both without noticing. ↓

**Variant B — the bridge-premise hook.** Strongest for a philosophy-Twitter
audience that already knows the moves.

> Most "your worldview is inconsistent!" arguments smuggle in an unstated bridge premise.
>
> Mine names the premise every time.
>
> 22 statements. 4 kinds of finding. Every call cites Stanford. Tell me where the rules are wrong. ↓

**Variant C — the Quine epigraph.** For the more literary feed.

> "Our beliefs face the tribunal of experience not individually but as a corporate body." — W. V. Quine
>
> Took him literally. A 22-node belief web that lights up the edges where your answers contradict, imply, or live in tension. ↓

### What *not* to post

- "Hey everyone, I built…" / "Check out my new…" — the strongest correlation in subs that block AI-generated posts is the launch-pitch opening.
- A title that asks a yes/no question ("Is your worldview consistent?"). It reads as a quiz; the audience this targets is allergic to quizzes.
- The result badge alone on Reddit. Reddit's discussion subs reward a *text post that invites correction*, not an image drop. The image works for X/Bluesky/IG; on Reddit, link in the comments per rules.

### Order of operations

1. r/CosmicSkeptic primary post during US/UK Sunday evening (highest discussion-sub engagement window).
2. Wait 24 h. If the thread is sustaining itself, post Variant A on X with the badge image attached and link back to the Reddit thread.
3. If r/philosophy or r/askphilosophy moderators respond positively to a pre-post message, the alternative academic draft goes there next, with a comment linking to the CosmicSkeptic thread for substantive critique already in flight.
