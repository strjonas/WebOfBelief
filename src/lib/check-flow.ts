import type { BeliefCategoryId, BeliefId } from "./beliefs";

/**
 * The presentation layer of the check: the 35 statements in beliefs.ts are
 * asked as 18 questions. Statements that compete over the same topic are
 * grouped into one "positions" question where the visitor can hold one,
 * several, or none of them — nuanced and mixed views are the point, and any
 * genuine clash between selected positions is for the engine to surface, not
 * for the form to forbid. Standalone statements stay single "claim" questions.
 *
 * Selecting a position maps to answering its statement "affirm"; deselecting
 * removes the answer. A topic-level "it's complicated (none of the above)"
 * records "qualify" on every position in the step, mirroring the escape hatch
 * on yes/no claims. The rule engine, share codes, and compare links all keep
 * operating on the same per-statement AnswerMap as before.
 */

export interface PositionOption {
  id: BeliefId;
  /** Short scannable name shown above the full position wording. */
  label: string;
}

interface StepBase {
  id: string;
  category: BeliefCategoryId;
  /** Short topic title, used in the progress line and the review list. */
  title: string;
}

export interface PositionsStep extends StepBase {
  kind: "positions";
  question: string;
  /** Optional one-line clarifier shown under the standing multi-select hint. */
  help?: string;
  positions: PositionOption[];
}

export interface ClaimStep extends StepBase {
  kind: "claim";
  statementId: BeliefId;
}

export type CheckStep = PositionsStep | ClaimStep;

export const checkSteps: CheckStep[] = [
  {
    kind: "positions",
    id: "free-will",
    category: "freedom",
    title: "Free will",
    question: "Could you ever have chosen differently?",
    help: "Every option here keeps the entire past and the laws of nature exactly the same — the question is what could happen next.",
    positions: [
      { id: "determinism", label: "Only one action was really possible" },
      {
        id: "samePastAlternative",
        label: "I genuinely could have done otherwise",
      },
    ],
  },
  {
    kind: "claim",
    id: "responsibility",
    category: "freedom",
    title: "Responsibility",
    statementId: "responsibilityWithoutAlternatives",
  },
  {
    kind: "positions",
    id: "god",
    category: "religion",
    title: "God and the divine",
    question: "What do you believe about God or the divine?",
    positions: [
      { id: "perfectGod", label: "A perfect, personal God exists" },
      {
        id: "limitedGod",
        label: "A personal God exists — but with real limits",
      },
      {
        id: "spiritualReality",
        label: "Something sacred or spiritual exists — but not a personal God",
      },
      { id: "noDeity", label: "No gods of any kind exist" },
      {
        id: "agnosticismAboutGod",
        label: "The evidence can't settle it — I suspend judgment",
      },
    ],
  },
  {
    kind: "claim",
    id: "suffering",
    category: "religion",
    title: "Suffering",
    statementId: "gratuitousSuffering",
  },
  {
    kind: "claim",
    id: "hiddenness",
    category: "religion",
    title: "Divine hiddenness",
    statementId: "nonresistantNonbelief",
  },
  {
    kind: "claim",
    id: "foreknowledge",
    category: "religion",
    title: "Divine foreknowledge",
    statementId: "infallibleForeknowledge",
  },
  {
    kind: "claim",
    id: "evidence",
    category: "religion",
    title: "Evidence",
    statementId: "beliefNeedsEvidence",
  },
  {
    kind: "positions",
    id: "right-and-wrong",
    category: "practice",
    title: "Right and wrong",
    question: "What makes an action right or wrong?",
    positions: [
      { id: "consequencesOnly", label: "Only the outcome matters" },
      {
        id: "sideConstraints",
        label: "Some acts are wrong no matter how good the outcome",
      },
      {
        id: "virtueEthicsPrimary",
        label: "What a genuinely good person would do — character comes first",
      },
    ],
  },
  {
    kind: "claim",
    id: "animals",
    category: "practice",
    title: "Animals",
    statementId: "animalsMatter",
  },
  {
    kind: "claim",
    id: "animal-suffering",
    category: "practice",
    title: "Animal suffering",
    statementId: "minorConvenienceHarmWrong",
  },
  {
    kind: "claim",
    id: "buying-into-harm",
    category: "practice",
    title: "Buying into harm",
    statementId: "factoryFarmPermissible",
  },
  {
    kind: "positions",
    id: "moral-truth",
    category: "value",
    title: "Where morality comes from",
    question: "What makes moral claims true?",
    positions: [
      { id: "moralFacts", label: "Some things are objectively wrong" },
      {
        id: "constructedMorality",
        label: "Morality is what reasonable people would agree to",
      },
      {
        id: "attitudeOnlyMorality",
        label: "Morality is only what people happen to approve of",
      },
      {
        id: "noMoralTruths",
        label: "Nothing is really right or wrong at all",
      },
    ],
  },
  {
    kind: "positions",
    id: "morality-and-god",
    category: "value",
    title: "Morality and God",
    question: "Does morality depend on God?",
    positions: [
      {
        id: "divineCommandOnly",
        label: "Duties exist only because God commands them",
      },
      {
        id: "independentDuty",
        label: "At least some duties would hold even with no God",
      },
    ],
  },
  {
    kind: "positions",
    id: "meaning",
    category: "value",
    title: "Meaning",
    question: "What could make a life genuinely meaningful?",
    positions: [
      {
        id: "naturalMeaning",
        label:
          "Worthwhile activity in this world — even without God or an afterlife",
      },
      {
        id: "meaningNeedsTranscendent",
        label: "Only God or an immortal soul — nothing finite is enough",
      },
      {
        id: "subjectiveMeaningOnly",
        label:
          "Nothing objective — lives mean what they mean to those living them",
      },
    ],
  },
  {
    kind: "positions",
    id: "knowledge",
    category: "value",
    title: "Knowledge",
    question: "How much can we really know?",
    positions: [
      { id: "ordinaryKnowledge", label: "We can know everyday facts" },
      {
        id: "radicalSkepticalScenario",
        label: "I can't rule out a radical deception",
      },
    ],
  },
  {
    kind: "positions",
    id: "personal-identity",
    category: "mind",
    title: "Personal identity",
    question: "What keeps you the same person over time?",
    positions: [
      {
        id: "psychologicalContinuity",
        label: "My mind — memory, character, mental life",
      },
      {
        id: "bodilySoulContinuity",
        label: "My body or soul — even if my mind changes",
      },
      {
        id: "noPersistentSelf",
        label: "Nothing, strictly — the continuing self is a construction",
      },
    ],
  },
  {
    kind: "positions",
    id: "consciousness",
    category: "mind",
    title: "Consciousness",
    question: "How does consciousness relate to the physical world?",
    positions: [
      {
        id: "physicalClosure",
        label: "Fix all the physical facts, and consciousness is fixed too",
      },
      {
        id: "zombieWorld",
        label: "A perfect physical copy of you could lack consciousness",
      },
    ],
  },
  {
    kind: "claim",
    id: "ai-consciousness",
    category: "mind",
    title: "AI consciousness",
    statementId: "futureAiConscious",
  },
];

export const checkStepCount = checkSteps.length;

/** Every statement a step asks about, in display order. */
export function stepStatementIds(step: CheckStep): BeliefId[] {
  return step.kind === "claim"
    ? [step.statementId]
    : step.positions.map((position) => position.id);
}
