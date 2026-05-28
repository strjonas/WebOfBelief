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
  requires: BeliefId[];
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
    explanation:
      "If all physical facts fix every consciousness fact, a physically identical world cannot differ by entirely lacking consciousness.",
    nextQuestion:
      "Is the zombie world genuinely possible, or only imaginable despite being impossible?",
    sourceIds: ["physicalism", "dualism"],
  },
  {
    id: "avoidable-animal-harm",
    kind: "argument",
    title: "Causing harm is wrong, yet buying into it is permitted",
    requires: ["minorConvenienceHarmWrong", "factoryFarmPermissible"],
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
    explanation:
      "This is a central compatibilist position rather than a detected contradiction. It invites an account of why fixed actions can still be owned by an agent.",
    bridge:
      "Responsibility requires a kind of control that cannot exist when past conditions and laws fix the act.",
    nextQuestion:
      "Is responsibility grounded in alternatives, sourcehood, reasons-responsiveness, or social practices?",
    sourceIds: ["compatibilism", "freeWill"],
  },
  {
    id: "moral-grounding",
    kind: "compatible",
    title: "God and objective morality",
    requires: ["perfectGod", "moralFacts"],
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
    explanation:
      "This is objective naturalism about meaning, an established position: finite lives may connect with objectively worthwhile goods without transcendence.",
    nextQuestion:
      "Which goods make lives meaningful, and why are they objectively worthwhile?",
    sourceIds: ["meaning", "atheism"],
  },
  {
    id: "animals-and-practice",
    kind: "argument",
    title: "Animal consideration and everyday choices",
    requires: ["animalsMatter", "factoryFarmPermissible"],
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
    .filter((rule) =>
      rule.requires.every((beliefId) => answers[beliefId] === "affirm"),
    )
    .sort((a, b) => kindOrder[a.kind] - kindOrder[b.kind]);
}

export function affirmedBeliefs(answers: AnswerMap): BeliefId[] {
  return Object.entries(answers)
    .filter(([, answer]) => answer === "affirm")
    .map(([beliefId]) => beliefId as BeliefId);
}

export function countFindings(findings: Finding[], kind: FindingKind): number {
  return findings.filter((finding) => finding.kind === kind).length;
}
