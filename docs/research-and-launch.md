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
