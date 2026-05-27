export type SourceId =
  | "philpapers"
  | "pew"
  | "atheism"
  | "cosmological"
  | "moralArguments"
  | "evil"
  | "hiddenness"
  | "voluntarism"
  | "moralAntiRealism"
  | "meaning"
  | "freeWill"
  | "compatibilism"
  | "foreknowledge"
  | "physicalism"
  | "dualism"
  | "animals";

export type BeliefCategoryId =
  | "religion"
  | "value"
  | "freedom"
  | "mind"
  | "practice";

export type BeliefId =
  | "perfectGod"
  | "noDeity"
  | "gratuitousSuffering"
  | "nonresistantNonbelief"
  | "infallibleForeknowledge"
  | "moralFacts"
  | "attitudeOnlyMorality"
  | "divineCommandOnly"
  | "independentDuty"
  | "naturalMeaning"
  | "meaningNeedsTranscendent"
  | "determinism"
  | "samePastAlternative"
  | "responsibilityWithoutAlternatives"
  | "physicalClosure"
  | "zombieWorld"
  | "animalsMatter"
  | "minorConvenienceHarmWrong"
  | "factoryFarmPermissible";

export type Answer = "affirm" | "reject" | "unsure";

export interface Source {
  id: SourceId;
  title: string;
  publisher: string;
  url: string;
  use: string;
}

export interface BeliefCategory {
  id: BeliefCategoryId;
  name: string;
  description: string;
}

export interface BeliefStatement {
  id: BeliefId;
  category: BeliefCategoryId;
  prompt: string;
  clarify: string;
  caseFor: string;
  caseAgainst: string;
  sourceIds: SourceId[];
}

export const sources: Record<SourceId, Source> = {
  philpapers: {
    id: "philpapers",
    title: "The 2020 PhilPapers Survey",
    publisher: "PhilPeople / PhilPapers",
    url: "https://survey2020.philpeople.org/",
    use: "Topic selection: its 100 questions include God, meta-ethics, meaning, mind, free will, trolley cases, and eating animals.",
  },
  pew: {
    id: "pew",
    title: "2023-24 Religious Landscape Study",
    publisher: "Pew Research Center",
    url: "https://www.pewresearch.org/rls/",
    use: "Public relevance: a large United States survey about religious affiliation, belief in God, and social views.",
  },
  atheism: {
    id: "atheism",
    title: "Atheism and Agnosticism",
    publisher: "Stanford Encyclopedia of Philosophy",
    url: "https://plato.stanford.edu/entries/atheism-agnosticism/",
    use: "Distinguishes lacking belief, asserting that no gods exist, and suspension of judgment.",
  },
  cosmological: {
    id: "cosmological",
    title: "Cosmological Argument",
    publisher: "Stanford Encyclopedia of Philosophy",
    url: "https://plato.stanford.edu/entries/cosmological-argument/",
    use: "Surveys arguments from contingency, explanation, and beginnings to a necessary or divine cause, with objections.",
  },
  moralArguments: {
    id: "moralArguments",
    title: "Moral Arguments for the Existence of God",
    publisher: "Stanford Encyclopedia of Philosophy",
    url: "https://plato.stanford.edu/entries/moral-arguments-god/",
    use: "Explains arguments relating moral normativity or dignity to God and their contested premises.",
  },
  evil: {
    id: "evil",
    title: "The Problem of Evil",
    publisher: "Stanford Encyclopedia of Philosophy",
    url: "https://plato.stanford.edu/entries/evil/",
    use: "Maps logical and evidential arguments from suffering and theistic defenses or theodicies.",
  },
  hiddenness: {
    id: "hiddenness",
    title: "Hiddenness of God",
    publisher: "Stanford Encyclopedia of Philosophy",
    url: "https://plato.stanford.edu/entries/divine-hiddenness/",
    use: "Presents the argument from nonresistant nonbelief and theistic responses.",
  },
  voluntarism: {
    id: "voluntarism",
    title: "Theological Voluntarism",
    publisher: "Stanford Encyclopedia of Philosophy",
    url: "https://plato.stanford.edu/entries/voluntarism-theological/",
    use: "Examines divine-command accounts of obligation and Euthyphro-style concerns.",
  },
  moralAntiRealism: {
    id: "moralAntiRealism",
    title: "Moral Anti-Realism",
    publisher: "Stanford Encyclopedia of Philosophy",
    url: "https://plato.stanford.edu/entries/moral-anti-realism/",
    use: "Defines mind-independent moral realism and several ways of denying it.",
  },
  meaning: {
    id: "meaning",
    title: "The Meaning of Life",
    publisher: "Stanford Encyclopedia of Philosophy",
    url: "https://plato.stanford.edu/entries/life-meaning/",
    use: "Surveys supernaturalist, objective naturalist, subjective, hybrid, and nihilist views of meaning.",
  },
  freeWill: {
    id: "freeWill",
    title: "Free Will",
    publisher: "Stanford Encyclopedia of Philosophy",
    url: "https://plato.stanford.edu/entries/freewill/",
    use: "Introduces alternative-possibilities, sourcehood, responsibility, and theological issues.",
  },
  compatibilism: {
    id: "compatibilism",
    title: "Compatibilism",
    publisher: "Stanford Encyclopedia of Philosophy",
    url: "https://plato.stanford.edu/entries/compatibilism/",
    use: "Defends and challenges accounts on which determinism and responsible agency can coexist.",
  },
  foreknowledge: {
    id: "foreknowledge",
    title: "Foreknowledge and Free Will",
    publisher: "Stanford Encyclopedia of Philosophy",
    url: "https://plato.stanford.edu/entries/free-will-foreknowledge/",
    use: "Surveys theological fatalism and compatibilist responses.",
  },
  physicalism: {
    id: "physicalism",
    title: "Physicalism",
    publisher: "Stanford Encyclopedia of Philosophy",
    url: "https://plato.stanford.edu/entries/physicalism/",
    use: "Defines physicalist completeness and addresses consciousness objections.",
  },
  dualism: {
    id: "dualism",
    title: "Dualism",
    publisher: "Stanford Encyclopedia of Philosophy",
    url: "https://plato.stanford.edu/entries/dualism/",
    use: "Covers mental/physical distinction and arguments from consciousness.",
  },
  animals: {
    id: "animals",
    title: "The Moral Status of Animals",
    publisher: "Stanford Encyclopedia of Philosophy",
    url: "https://plato.stanford.edu/entries/moral-animal/",
    use: "Reviews sentience, personhood, interests, and food-choice implications.",
  },
};

export const categories: BeliefCategory[] = [
  {
    id: "religion",
    name: "God and evidence",
    description: "Theism, atheism, suffering, hiddenness, and foreknowledge.",
  },
  {
    id: "value",
    name: "Morality and meaning",
    description: "Objective value, moral grounding, and meaningful lives.",
  },
  {
    id: "freedom",
    name: "Freedom and responsibility",
    description: "Determinism, alternatives, and accountability.",
  },
  {
    id: "mind",
    name: "Mind and consciousness",
    description: "Physical completeness and subjective experience.",
  },
  {
    id: "practice",
    name: "Animals and action",
    description: "What moral concern commits us to in ordinary choices.",
  },
];

export const beliefStatements: BeliefStatement[] = [
  {
    id: "perfectGod",
    category: "religion",
    prompt:
      "A personal God exists who is omniscient, omnipotent, perfectly good, and perfectly loving.",
    clarify:
      "This is classical personal theism, not merely a first cause, spirit, or impersonal ground of reality.",
    caseFor:
      "Arguments from contingency, moral reality, religious experience, and other evidence are taken by theists to support such a being.",
    caseAgainst:
      "Atheists and agnostics challenge the inferences and point to suffering, hiddenness, and competing explanations.",
    sourceIds: ["cosmological", "moralArguments", "evil", "hiddenness"],
  },
  {
    id: "noDeity",
    category: "religion",
    prompt: "No god or deity exists.",
    clarify:
      "This is the positive philosophical claim of atheism, stronger than merely lacking belief.",
    caseFor:
      "Arguments may appeal to the absence of adequate evidence, evil, hiddenness, or low prior plausibility for particular gods.",
    caseAgainst:
      "Agnosticism withholds the claim, while theism invokes cosmological, moral, experiential, or revealed grounds.",
    sourceIds: ["atheism", "cosmological", "evil", "hiddenness"],
  },
  {
    id: "gratuitousSuffering",
    category: "religion",
    prompt:
      "Some suffering exists that no omniscient, omnipotent, perfectly good being could have morally sufficient reason to permit.",
    clarify:
      "The key term is gratuitous: not merely terrible suffering, but suffering unjustifiable for a perfectly good all-powerful being.",
    caseFor:
      "Evidential arguments from evil maintain that the scale or distribution of suffering supports this judgment.",
    caseAgainst:
      "Defenses and theodicies propose reasons involving freedom, soul-making, natural laws, or limits on human judgment.",
    sourceIds: ["evil"],
  },
  {
    id: "nonresistantNonbelief",
    category: "religion",
    prompt:
      "Some people capable of relating to God honestly seek that relationship, do not resist it, and still cannot believe God exists.",
    clarify:
      "This concerns nonresistant nonbelief, not indifference or deliberate rejection.",
    caseFor:
      "The hiddenness argument treats apparently sincere nonbelief as evidence against a perfectly loving personal God.",
    caseAgainst:
      "Responses dispute whether such nonbelief exists or whether perfect love would always supply unmistakable belief.",
    sourceIds: ["hiddenness"],
  },
  {
    id: "infallibleForeknowledge",
    category: "religion",
    prompt:
      "Before a human choice occurs, an infallible divine belief already correctly specifies that exact choice.",
    clarify:
      "The statement deliberately concerns prior, error-proof knowledge of a concrete future act.",
    caseFor:
      "Many conceptions of divine omniscience include complete knowledge of future human actions.",
    caseAgainst:
      "Open-theist and other accounts restrict or differently interpret knowledge of future free choices.",
    sourceIds: ["foreknowledge", "freeWill"],
  },
  {
    id: "moralFacts",
    category: "value",
    prompt:
      "At least some moral facts are true regardless of what any person or society approves.",
    clarify:
      "For example, whether cruelty is wrong is not made true merely by our preferences or conventions.",
    caseFor:
      "Moral realists argue that moral disagreement, reasoning, and apparent moral error make sense in terms of objective facts.",
    caseAgainst:
      "Anti-realists offer expressivist, error-theoretic, or subjectivist explanations without mind-independent moral facts.",
    sourceIds: ["moralAntiRealism", "moralArguments"],
  },
  {
    id: "attitudeOnlyMorality",
    category: "value",
    prompt:
      "Every moral truth depends only on the attitudes or approvals of persons or societies.",
    clarify:
      "Affirm this only if no moral truth is independent of all human or social approval.",
    caseFor:
      "Subjectivist and relativist approaches can explain moral practice through attitudes, cultures, or commitments.",
    caseAgainst:
      "Realists object that approval cannot make atrocities right and that moral criticism often claims objective force.",
    sourceIds: ["moralAntiRealism"],
  },
  {
    id: "divineCommandOnly",
    category: "value",
    prompt: "Every moral obligation is true solely because God commands it.",
    clarify:
      "This is a strong divine-command claim about obligation, not merely that God reliably commands what is good.",
    caseFor:
      "Theological voluntarists may understand divine commands as supplying authoritative obligations.",
    caseAgainst:
      "Critics ask whether commands make cruelty right or whether goodness is independent of commands.",
    sourceIds: ["voluntarism", "moralArguments"],
  },
  {
    id: "independentDuty",
    category: "value",
    prompt:
      "At least one moral obligation would remain true even if no deity commanded it.",
    clarify:
      "This accepts at least one command-independent duty, whether or not a God exists.",
    caseFor:
      "Moral realists and some theists hold that goodness or reasons can be prior to, or independent of, commands.",
    caseAgainst:
      "Strong divine-command theories deny obligation that is independent of divine willing or commanding.",
    sourceIds: ["voluntarism", "moralAntiRealism"],
  },
  {
    id: "naturalMeaning",
    category: "value",
    prompt:
      "A finite human life can be objectively meaningful through worthwhile activity even if no God or immortal soul exists.",
    clarify:
      "Objective naturalism says meaning can depend on real value in this world rather than transcendence.",
    caseFor:
      "Objective naturalists point to knowledge, creativity, love, and improving lives as genuinely worthwhile.",
    caseAgainst:
      "Supernaturalists argue that ultimate meaning requires relationship with God or an immortal soul; nihilists deny objective meaning.",
    sourceIds: ["meaning"],
  },
  {
    id: "meaningNeedsTranscendent",
    category: "value",
    prompt:
      "No finite human life can be objectively meaningful unless God or an immortal soul exists.",
    clarify:
      "This says transcendence is necessary for objective meaning, not merely helpful or personally important.",
    caseFor:
      "Supernaturalist accounts ground ultimate significance in God, immortality, or both.",
    caseAgainst:
      "Objective naturalist and hybrid accounts identify meaningful activity within finite human life.",
    sourceIds: ["meaning"],
  },
  {
    id: "determinism",
    category: "freedom",
    prompt:
      "Given exactly the same complete past and laws of nature, only one future human action is possible.",
    clarify:
      "This is causal or nomological determinism as applied to choices.",
    caseFor:
      "Determinists treat actions as part of a world fully fixed by past conditions and natural laws.",
    caseAgainst:
      "Indeterminists and libertarians hold that at least some action is not fixed in that way.",
    sourceIds: ["freeWill", "compatibilism"],
  },
  {
    id: "samePastAlternative",
    category: "freedom",
    prompt:
      "At least sometimes, a person could choose differently while the entire past and laws of nature remained exactly the same.",
    clarify:
      "This asserts alternative possibilities under the same past and laws, rather than freedom understood only as acting on one's reasons.",
    caseFor:
      "Libertarian accounts regard genuine alternative possibilities or agent causation as essential to freedom.",
    caseAgainst:
      "Compatibilists reject this requirement; skeptics argue indeterminism alone does not produce control.",
    sourceIds: ["freeWill", "compatibilism"],
  },
  {
    id: "responsibilityWithoutAlternatives",
    category: "freedom",
    prompt:
      "A person can sometimes be morally responsible even when no alternative action was possible.",
    clarify:
      "This focuses on moral responsibility, which some accounts distinguish from the power to do otherwise.",
    caseFor:
      "Compatibilist and sourcehood accounts focus on reasons-responsiveness, ownership, or absence of coercion.",
    caseAgainst:
      "Incompatibilists hold that fixed action undermines the control needed for blame or praise.",
    sourceIds: ["freeWill", "compatibilism"],
  },
  {
    id: "physicalClosure",
    category: "mind",
    prompt:
      "Once every physical fact is fixed, every fact about conscious experience is fixed too.",
    clarify:
      "This is a supervenience-style physicalist claim: no mental difference without a physical difference.",
    caseFor:
      "Physicalists argue that a complete physical account is enough for all actual facts, including mental facts.",
    caseAgainst:
      "Dualists and consciousness-based objections maintain that subjective experience may not be physically entailed.",
    sourceIds: ["physicalism", "dualism"],
  },
  {
    id: "zombieWorld",
    category: "mind",
    prompt:
      "A world physically identical to ours but entirely lacking conscious experience is genuinely possible.",
    clarify:
      "This is the philosophical-zombie possibility claim, not a prediction about actual neuroscience.",
    caseFor:
      "Conceivability arguments use such a world to challenge physicalist entailment of consciousness.",
    caseAgainst:
      "Physicalists deny that apparent conceivability establishes metaphysical possibility.",
    sourceIds: ["physicalism", "dualism"],
  },
  {
    id: "animalsMatter",
    category: "practice",
    prompt:
      "Sentient non-human animals deserve direct moral consideration because their suffering matters.",
    clarify:
      "Direct consideration means animal suffering counts for their own sake, not only because humans care.",
    caseFor:
      "Sentience-based approaches hold that the capacity for suffering establishes serious interests.",
    caseAgainst:
      "Some views ground full moral status in rational personhood or assign animals only indirect or lesser duties.",
    sourceIds: ["animals"],
  },
  {
    id: "minorConvenienceHarmWrong",
    category: "practice",
    prompt:
      "Causing severe avoidable suffering to a sentient animal merely for minor convenience or taste is morally wrong.",
    clarify:
      "The claim is restricted to severe, avoidable harm traded for a minor interest.",
    caseFor:
      "Interest-based arguments hold that avoiding severe suffering outweighs replaceable dietary preferences.",
    caseAgainst:
      "Objections challenge the moral status, the comparison of interests, or what harms are genuinely avoidable.",
    sourceIds: ["animals"],
  },
  {
    id: "factoryFarmPermissible",
    category: "practice",
    prompt:
      "Even when practical alternatives are available to me, it is morally permissible to buy food from systems that severely harm sentient animals merely for taste or convenience.",
    clarify:
      "This is deliberately conditional: it does not address survival, health necessity, subsistence, or uncertainty about production.",
    caseFor:
      "Defenses may deny that consumer purchase is wrongful participation or give human preference greater weight.",
    caseAgainst:
      "Animal-ethics arguments maintain that participating for a replaceable interest fails to respect serious animal interests.",
    sourceIds: ["animals"],
  },
];

export const statementById = Object.fromEntries(
  beliefStatements.map((statement) => [statement.id, statement]),
) as Record<BeliefId, BeliefStatement>;
