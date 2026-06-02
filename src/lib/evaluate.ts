import type { Answer, BeliefId, SourceId } from "./beliefs";

export type FindingKind =
  | "conflict"
  | "argument"
  | "implication"
  | "compatible";

export type AnswerMap = Partial<Record<BeliefId, Answer>>;

export interface Finding {
  id: string;
  kind: FindingKind;
  title: string;
  /** Beliefs that must all be affirmed for the finding to fire. */
  requires: BeliefId[];
  /**
   * Beliefs that must all be *explicitly rejected* (answer === "reject", not
   * merely unaffirmed) for the finding to fire. Used only for hand-vetted
   * rules where every reading of the denial still yields the tension — never
   * as a blanket "treat rejection as the opposite" rule. "Unsure" and
   * "qualify" never satisfy this: suspension and conditional readings are not
   * commitments to the negation.
   */
  rejects?: BeliefId[];
  /**
   * One or two plain sentences on *why* the pair pulls against each other —
   * short enough to read inside the hover/tap overlay on the web's edges,
   * before the visitor decides to open the full {@link explanation} below.
   */
  gist: string;
  explanation: string;
  bridge?: string;
  nextQuestion: string;
  sourceIds: SourceId[];
}

const rules: Finding[] = [
  {
    id: "god-and-no-god",
    kind: "conflict",
    title: "A deity exists and no deity exists",
    requires: ["perfectGod", "noDeity"],
    gist:
      "A personal God is itself a deity — so “God exists” and “no deity exists” can’t both be true. One of the two has to give.",
    explanation:
      "The personal God affirmed in the first statement is a deity. It cannot both exist and fall under the claim that no deity exists.",
    nextQuestion:
      "Is your negative claim about every deity, or only about a particular traditional conception of God?",
    sourceIds: ["atheism"],
  },
  {
    id: "god-and-gratuitous-evil",
    kind: "conflict",
    title: "Perfect goodness and unjustifiable suffering",
    requires: ["perfectGod", "gratuitousSuffering"],
    gist:
      "A perfectly good, all-knowing, all-powerful God would always have a morally sufficient reason for any suffering it allows. Calling some suffering genuinely pointless says there is suffering with no such reason — so both can’t stand as worded.",
    explanation:
      "As phrased, a perfectly good, omniscient, omnipotent God would not permit suffering for which that being could have no morally sufficient reason. You affirmed both that God and such suffering.",
    nextQuestion:
      "Would you revise the divine attributes, or withhold the stronger claim that the suffering is genuinely gratuitous?",
    sourceIds: ["evil"],
  },
  {
    id: "realism-and-attitude-only",
    kind: "conflict",
    title: "Mind-independent and attitude-only morality",
    requires: ["moralFacts", "attitudeOnlyMorality"],
    gist:
      "One says at least one moral truth holds no matter what anyone approves; the other says every moral truth is only a matter of approval. Those are straight negations of each other.",
    explanation:
      "One answer affirms at least one moral truth independent of approval; the other says every moral truth depends only on approval. They directly negate one another.",
    nextQuestion:
      "Do you mean that approval influences moral judgment, or that it makes all moral truths true?",
    sourceIds: ["moralAntiRealism"],
  },
  {
    id: "command-and-independent-duty",
    kind: "conflict",
    title: "Sole divine source and command-independent duty",
    requires: ["divineCommandOnly", "independentDuty"],
    gist:
      "If duties exist only because God commands them, then no duty can hold independently of any divine command — which is exactly what the other statement asserts.",
    explanation:
      "If every obligation is true solely because of God's commands, no obligation remains true independently of any divine command.",
    nextQuestion:
      "Do commands constitute moral obligation, or do they express moral reasons that already hold?",
    sourceIds: ["voluntarism", "moralArguments"],
  },
  {
    id: "natural-and-transcendent-meaning",
    kind: "conflict",
    title: "Finite meaning with and without a transcendent requirement",
    requires: ["naturalMeaning", "meaningNeedsTranscendent"],
    gist:
      "One allows a finite life to carry objective meaning without God or an afterlife; the other says meaning is impossible without them. They can’t both be right.",
    explanation:
      "The first statement affirms possible objective meaning without God or immortality; the second denies that possibility.",
    nextQuestion:
      "Are you claiming all meaning needs transcendence, or only ultimate/cosmic meaning under a narrower definition?",
    sourceIds: ["meaning"],
  },
  {
    id: "determined-and-open-alternative",
    kind: "conflict",
    title: "One possible future and a different possible choice",
    requires: ["determinism", "samePastAlternative"],
    gist:
      "Holding the whole past and the laws of nature fixed, one statement says only a single action can follow; the other says a different action was still possible in those very conditions. Same setup, opposite verdicts.",
    explanation:
      "Both statements hold the complete past and laws fixed. One allows only one resulting action; the other says another action is possible in those same conditions.",
    nextQuestion:
      "Do you instead mean compatibilist freedom: acting from your reasons without coercion, even if the same past fixes the act?",
    sourceIds: ["freeWill", "compatibilism"],
  },
  {
    id: "physical-and-zombie",
    kind: "conflict",
    title: "Physical facts fix consciousness, yet a physical duplicate lacks it",
    requires: ["physicalClosure", "zombieWorld"],
    gist:
      "If the physical facts fully fix consciousness, then a perfect physical copy of you couldn’t be missing consciousness. The zombie case claims exactly such a copy is possible.",
    explanation:
      "If all physical facts fix every consciousness fact, a physically identical world cannot differ by entirely lacking consciousness.",
    nextQuestion:
      "Is the zombie world genuinely possible, or only imaginable despite being impossible?",
    sourceIds: ["physicalism", "dualism"],
  },
  {
    id: "future-ai-and-zombie-evidence",
    kind: "argument",
    title: "Future AI consciousness and the evidence problem",
    requires: ["zombieWorld", "futureAiConscious"],
    gist:
      "You allow future AI consciousness, but also allow a perfect physical duplicate with no experience. That is not a contradiction; it means behavior and physical structure may not settle the issue by themselves.",
    explanation:
      "This is not a contradiction. Views that take philosophical zombies seriously can still allow artificial consciousness. The pressure is epistemic: if a physically and functionally matching duplicate of a conscious being could lack experience, then attributing experience to a future AI needs an account of the extra facts or evidence that would make the attribution responsible.",
    bridge:
      "Behavioral, functional, and physical similarity to conscious beings is sufficient evidence for attributing consciousness to a future AI system.",
    nextQuestion:
      "Do you accept that evidence standard, or do you think AI consciousness would require something more, such as biology, phenomenal grounding, or a further non-physical fact?",
    sourceIds: ["dualism", "consciousness", "chineseRoom", "aiConsciousness"],
  },
  {
    id: "avoidable-animal-harm",
    kind: "argument",
    title: "Causing harm is wrong, yet buying into it is permitted",
    requires: ["minorConvenienceHarmWrong", "factoryFarmPermissible"],
    gist:
      "Causing severe avoidable harm is wrong, yet buying from a system that inflicts it is called fine. These collide only if your purchase counts as taking part in the harm — which is genuinely disputed, so it’s a real tension, not a flat contradiction.",
    explanation:
      "One statement is about causing severe avoidable suffering; the other about buying from a system that inflicts it. These collide only if purchasing counts as morally relevant participation in the harm. The causal-inefficacy objection denies that a single purchase changes how many animals suffer, so this is a serious tension rather than a flat contradiction.",
    bridge:
      "Buying from a system that severely harms animals is morally relevant participation in that harm; an individual purchase is not causally inert.",
    nextQuestion:
      "Do you accept that bridge, or hold that individual purchases are causally insignificant (and is that consistent with how you judge other complicity cases)?",
    sourceIds: ["animals"],
  },
  {
    id: "divine-hiddenness",
    kind: "argument",
    title: "Perfect love and nonresistant nonbelief",
    requires: ["perfectGod", "nonresistantNonbelief"],
    gist:
      "A perfectly loving God open to relationship would seem to make itself findable to sincere, non-resisting seekers. That some such seekers still cannot believe is the hiddenness problem — pressure on the pair, not a flat contradiction.",
    explanation:
      "This is the divine hiddenness problem: sincere seekers who lack belief appear difficult to reconcile with a perfectly loving personal God.",
    bridge:
      "A perfectly loving God who is open to personal relationship would ensure that capable, nonresistant seekers can believe God exists.",
    nextQuestion:
      "Do you accept that bridge premise, or is hiddenness compatible with divine love for another reason?",
    sourceIds: ["hiddenness"],
  },
  {
    id: "divine-foreknowledge",
    kind: "argument",
    title: "Infallible foreknowledge and alternative possibilities",
    requires: ["infallibleForeknowledge", "samePastAlternative"],
    gist:
      "If an infallible mind already knew your choice before you made it, it’s hard to see how you could still have chosen otherwise. That’s the foreknowledge puzzle — a hard question, not an automatic clash.",
    explanation:
      "Theological fatalism asks how a different choice remains possible when an earlier divine belief cannot be wrong.",
    bridge:
      "A prior, infallible belief about an act is a fixed fact that the agent cannot act otherwise than.",
    nextQuestion:
      "Would you use an eternity, dependence, soft-fact, or sourcehood response, or give up one premise?",
    sourceIds: ["foreknowledge", "freeWill"],
  },
  {
    id: "responsibility-and-determinism",
    kind: "argument",
    title: "Determinism and responsibility",
    requires: ["determinism", "responsibilityWithoutAlternatives"],
    gist:
      "If the past and the laws fix every act, what makes an act yours to be praised or blamed for? Holding both isn’t a contradiction — it’s the central question compatibilism sets out to answer.",
    explanation:
      "This is a central compatibilist position rather than a detected contradiction. It invites an account of why fixed actions can still be owned by an agent.",
    bridge:
      "Responsibility requires a kind of control that cannot exist when past conditions and laws fix the act.",
    nextQuestion:
      "Is responsibility grounded in alternatives, sourcehood, reasons-responsiveness, or social practices?",
    sourceIds: ["compatibilism", "freeWill"],
  },
  {
    id: "determinism-and-responsibility-skepticism",
    kind: "implication",
    title: "A fork in the road about responsibility",
    requires: ["determinism"],
    rejects: ["responsibilityWithoutAlternatives"],
    gist:
      "You hold the future is fixed and that responsibility needs a genuine alternative — together those imply no one is ever responsible for anything. It’s a fork, not a verdict: most people keep responsibility by loosening one of the two premises.",
    explanation:
      "Two of your answers point the same way. You affirm that the past and the laws of nature fix a single possible future, and — by rejecting the previous statement — you hold that a person cannot be morally responsible without an alternative open to them. Put together, those say no one is ever morally responsible for anything. This is a fork, not a verdict on you, and almost everyone who reaches it keeps responsibility by revising a premise rather than abandoning it. Compatibilists drop the demand for alternative possibilities and locate responsibility in acting from one's own reasons, character, and capacity to respond to them; libertarians instead deny that the future is fixed in this way. Hard incompatibilism — accepting that no one is ever responsible — is a coherent position some philosophers defend, but it is the least-taken exit and the hardest to square with how we actually live, blame, and forgive.",
    bridge:
      "Moral responsibility requires the ability to do otherwise — the very alternative that a fixed future rules out. Compatibilists reject exactly this bridge.",
    nextQuestion:
      "Which do you actually hold more firmly: that the future is genuinely fixed, or that responsibility truly requires alternatives? Loosening either premise keeps responsibility intact — which one is the load-bearing belief for you?",
    sourceIds: ["compatibilism", "freeWill"],
  },
  {
    id: "moral-grounding",
    kind: "compatible",
    title: "God and objective morality",
    requires: ["perfectGod", "moralFacts"],
    gist:
      "Believing in God and in objective morality fit together fine — this is the standard theistic moral-realist view, not a tension. The only open question is what grounds the moral facts.",
    explanation:
      "This pairing is coherent and is the standard theistic moral-realist view; it is not a tension in your beliefs. The open question is only what grounds the moral facts: God's nature, God's commands, or reasons that hold independently.",
    nextQuestion:
      "Do moral facts depend on God in your view, or could they hold independently of any divine command?",
    sourceIds: ["moralArguments", "voluntarism", "moralAntiRealism"],
  },
  {
    id: "atheist-moral-realism",
    kind: "compatible",
    title: "No deity and objective moral facts",
    requires: ["noDeity", "moralFacts"],
    gist:
      "Denying any deity while holding that some things are really right or wrong is a live, consistent position. The remaining task is just explaining what those moral facts rest on.",
    explanation:
      "This pair is not internally inconsistent. Non-theistic moral realism is a live position; the further task is explaining the nature and knowledge of moral facts.",
    nextQuestion:
      "Which secular grounding or explanation of moral normativity do you accept?",
    sourceIds: ["moralAntiRealism", "moralArguments", "atheism"],
  },
  {
    id: "atheist-objective-meaning",
    kind: "compatible",
    title: "No deity and objective meaning in finite life",
    requires: ["noDeity", "naturalMeaning"],
    gist:
      "No God and real meaning in a finite life is a recognized position — objective naturalism — not a contradiction. The open question is which goods make a life meaningful.",
    explanation:
      "This is objective naturalism about meaning, an established position: finite lives may connect with objectively worthwhile goods without transcendence.",
    nextQuestion:
      "Which goods make lives meaningful, and why are they objectively worthwhile?",
    sourceIds: ["meaning", "atheism"],
  },
  {
    id: "future-ai-and-physicalism",
    kind: "compatible",
    title: "Physicalism and future artificial consciousness",
    requires: ["physicalClosure", "futureAiConscious"],
    gist:
      "If experience is fixed by physical facts, artificial consciousness is not ruled out merely by the word “artificial.” The real question is which physical or functional organization would be enough.",
    explanation:
      "This pair is coherent. The physical-closure claim says consciousness facts are fixed by physical facts; the AI claim says some future non-biological system could have the relevant consciousness-making facts. That still leaves the hard question: which organization, dynamics, embodiment, or information processing would make experience present?",
    nextQuestion:
      "What physical or functional features would be enough for consciousness, and would a future AI system have them?",
    sourceIds: [
      "physicalism",
      "computationalMind",
      "consciousness",
      "aiConsciousness",
    ],
  },
  {
    id: "animals-and-practice",
    kind: "argument",
    title: "Animal consideration and everyday choices",
    requires: ["animalsMatter", "factoryFarmPermissible"],
    gist:
      "Granting that animals matter morally doesn’t by itself settle every meal — but severe, avoidable harm for easily replaced interests makes buying into it a demanding thing to justify.",
    explanation:
      "Direct animal consideration does not by itself settle every food choice, but severe avoidable harm for replaceable interests creates a demanding practical question.",
    bridge:
      "Buying such products when alternatives are practical is a morally relevant participation in preventable animal suffering.",
    nextQuestion:
      "What exception, uncertainty, or theory of participation makes the purchase permissible in your view?",
    sourceIds: ["animals"],
  },
  {
    id: "consequences-and-constraints",
    kind: "conflict",
    title: "Only consequences matter, yet some acts are off-limits",
    requires: ["consequencesOnly", "sideConstraints"],
    gist:
      "If only consequences matter, the act with the best outcome is always the right one. Saying some best-outcome act is still wrong means something other than consequences counts — both can’t hold.",
    explanation:
      "If rightness depends only on consequences, then the act with the best consequences is right and cannot be wrong. The other statement says some such act is nonetheless wrong. Both cannot hold.",
    nextQuestion:
      "Do you mean outcomes always settle rightness, or that there are genuine limits (rights, duties) that outcomes cannot override?",
    sourceIds: ["consequentialism", "deontology"],
  },
  {
    id: "foreknowledge-without-deity",
    kind: "conflict",
    title: "An infallible divine belief, but no deity to hold it",
    requires: ["infallibleForeknowledge", "noDeity"],
    gist:
      "An infallible divine belief needs a divine believer to hold it. Affirming such foreknowledge while denying any deity removes the very mind the claim depends on.",
    explanation:
      "The foreknowledge statement asserts that an infallible divine belief already exists about your choices. A belief requires a believer, so this presupposes a deity. Affirming it together with the claim that no deity exists is inconsistent.",
    nextQuestion:
      "Did you mean the future is simply fixed or predictable, rather than known by a divine mind?",
    sourceIds: ["foreknowledge", "atheism"],
  },
  {
    id: "atheism-meaning-nihilism",
    kind: "implication",
    title: "A fork in the road about meaning",
    requires: ["noDeity", "meaningNeedsTranscendent"],
    gist:
      "You hold that meaning needs God or a soul, and that no God exists — together (with no soul) those point to a finite life having no objective meaning. It’s a fork: drop the requirement, or accept that meaning is something we confer rather than find.",
    explanation:
      "Two of your answers point in the same direction: you hold that objective meaning requires God or an immortal soul, and that no deity exists. If there is also no immortal soul, those premises lead to the conclusion that finite lives lack objective meaning. That is not a verdict on you — it is a fork. Most who reach it keep one of two well-developed paths: drop the requirement (objective naturalists argue that love, knowledge, and creativity make a finite life genuinely meaningful), or accept that meaning is something we confer rather than discover.",
    bridge:
      "No immortal soul exists either, so the transcendent routes to meaning are closed.",
    nextQuestion:
      "Which premise do you actually hold most firmly — that meaning needs transcendence, or that this life can be objectively worthwhile on its own terms?",
    sourceIds: ["meaning", "atheism"],
  },
  {
    id: "atheism-moral-nihilism",
    kind: "implication",
    title: "A fork in the road about moral obligation",
    requires: ["noDeity", "divineCommandOnly"],
    gist:
      "If obligations exist only because God commands them, and there’s no God to issue commands, then nothing is obligatory. It’s a fork: most people keep their morality by letting some duties hold without any divine command.",
    explanation:
      "Two of your answers point the same way: if every moral obligation holds solely because God commands it, and no God exists to issue commands, then nothing is obligatory. This is a fork, not a sentence. Many who notice it keep their morality by loosening the first premise — holding that some duties (against cruelty, say) hold on grounds that do not depend on a divine command at all.",
    bridge:
      "'Solely because God commands it' is read constitutively — commands make obligations exist, rather than merely reveal them. On a weaker, purely epistemic reading (commands tell us what is already obligatory), the inference does not run.",
    nextQuestion:
      "Which do you hold more firmly — that obligation comes only from God's command, or that at least some things are genuinely owed regardless?",
    sourceIds: ["voluntarism", "moralAntiRealism", "atheism"],
  },
  {
    id: "evidentialism-and-theism",
    kind: "argument",
    title: "Evidence-only belief and belief in God",
    requires: ["beliefNeedsEvidence", "perfectGod"],
    gist:
      "You hold that belief requires adequate evidence, and you believe God exists — so by your own standard, that belief needs adequate evidence. That’s the classic evidentialist challenge, and theists answer it in several ways.",
    explanation:
      "You hold that belief requires adequate evidence, and you believe God exists. By your own standard, theistic belief is justified only if there is adequate evidence for it. This is the classic evidentialist challenge to religious belief, and theists answer it in different ways.",
    bridge:
      "There is not adequate evidence that a personal God exists.",
    nextQuestion:
      "Do you hold that there is adequate evidence for God, or that belief in God can be properly basic or otherwise justified without it?",
    sourceIds: ["religionEpistemology", "atheism"],
  },
];

const kindOrder: Record<FindingKind, number> = {
  conflict: 0,
  implication: 1,
  argument: 2,
  compatible: 3,
};

export function evaluateBeliefs(answers: AnswerMap): Finding[] {
  return rules
    .filter(
      (rule) =>
        rule.requires.every((beliefId) => answers[beliefId] === "affirm") &&
        (rule.rejects ?? []).every(
          (beliefId) => answers[beliefId] === "reject",
        ),
    )
    .sort((a, b) => kindOrder[a.kind] - kindOrder[b.kind]);
}

/**
 * Every belief a finding touches, affirmed and rejected alike — used to draw
 * the triggered edge on the web and to list the statements at issue.
 */
export function findingBeliefs(finding: Finding): BeliefId[] {
  return [...finding.requires, ...(finding.rejects ?? [])];
}

export function affirmedBeliefs(answers: AnswerMap): BeliefId[] {
  return Object.entries(answers)
    .filter(([, answer]) => answer === "affirm")
    .map(([beliefId]) => beliefId as BeliefId);
}

export function countFindings(findings: Finding[], kind: FindingKind): number {
  return findings.filter((finding) => finding.kind === kind).length;
}
