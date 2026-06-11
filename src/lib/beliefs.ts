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
  | "computationalMind"
  | "consciousness"
  | "chineseRoom"
  | "aiConsciousness"
  | "llmConsciousness"
  | "animals"
  | "consequentialism"
  | "deontology"
  | "virtueEthics"
  | "processTheism"
  | "buddhistMind"
  | "religionEpistemology"
  | "religiousExperience"
  | "moralConstructivism"
  | "skepticism"
  | "personalIdentity";

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
  | "beliefNeedsEvidence"
  | "spiritualReality"
  | "limitedGod"
  | "agnosticismAboutGod"
  | "moralFacts"
  | "noMoralTruths"
  | "attitudeOnlyMorality"
  | "constructedMorality"
  | "divineCommandOnly"
  | "independentDuty"
  | "naturalMeaning"
  | "meaningNeedsTranscendent"
  | "subjectiveMeaningOnly"
  | "ordinaryKnowledge"
  | "radicalSkepticalScenario"
  | "consequencesOnly"
  | "sideConstraints"
  | "virtueEthicsPrimary"
  | "psychologicalContinuity"
  | "bodilySoulContinuity"
  | "noPersistentSelf"
  | "determinism"
  | "samePastAlternative"
  | "responsibilityWithoutAlternatives"
  | "physicalClosure"
  | "zombieWorld"
  | "futureAiConscious"
  | "animalsMatter"
  | "minorConvenienceHarmWrong"
  | "factoryFarmPermissible";

export type Answer = "affirm" | "reject" | "unsure" | "qualify";

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
  plain: string;
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
    use: "Topic selection: its 100 questions include God, meta-ethics, meaning, mind, other minds, free will, trolley cases, and eating animals.",
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
  computationalMind: {
    id: "computationalMind",
    title: "The Computational Theory of Mind",
    publisher: "Stanford Encyclopedia of Philosophy",
    url: "https://plato.stanford.edu/entries/computational-mind/",
    use: "Surveys views on which mental processes are computational and could be implemented in different physical systems.",
  },
  consciousness: {
    id: "consciousness",
    title: "Consciousness",
    publisher: "Stanford Encyclopedia of Philosophy",
    url: "https://plato.stanford.edu/entries/consciousness/",
    use: "Frames phenomenal consciousness, its explanation, functional role, and zombie-style debates.",
  },
  chineseRoom: {
    id: "chineseRoom",
    title: "The Chinese Room Argument",
    publisher: "Stanford Encyclopedia of Philosophy",
    url: "https://plato.stanford.edu/entries/chinese-room/",
    use: "Presents Searle's argument, replies, and later discussion of artificial understanding and consciousness.",
  },
  aiConsciousness: {
    id: "aiConsciousness",
    title:
      "Consciousness in Artificial Intelligence: Insights from the Science of Consciousness",
    publisher: "arXiv",
    url: "https://arxiv.org/abs/2308.08708",
    use: "Applies scientific theories of consciousness to AI systems and discusses how future systems might implement relevant indicators.",
  },
  llmConsciousness: {
    id: "llmConsciousness",
    title: "Could a Large Language Model be Conscious?",
    publisher: "David J. Chalmers / arXiv",
    url: "https://arxiv.org/abs/2303.07103",
    use: "Argues that current LLMs face serious obstacles while successors may become serious candidates for consciousness.",
  },
  animals: {
    id: "animals",
    title: "The Moral Status of Animals",
    publisher: "Stanford Encyclopedia of Philosophy",
    url: "https://plato.stanford.edu/entries/moral-animal/",
    use: "Reviews sentience, personhood, interests, and food-choice implications.",
  },
  consequentialism: {
    id: "consequentialism",
    title: "Consequentialism",
    publisher: "Stanford Encyclopedia of Philosophy",
    url: "https://plato.stanford.edu/entries/consequentialism/",
    use: "Defines the view that rightness depends only on outcomes, and its main objections.",
  },
  deontology: {
    id: "deontology",
    title: "Deontological Ethics",
    publisher: "Stanford Encyclopedia of Philosophy",
    url: "https://plato.stanford.edu/entries/ethics-deontological/",
    use: "Presents agent-relative constraints on which some acts are wrong even when they maximize the good.",
  },
  virtueEthics: {
    id: "virtueEthics",
    title: "Virtue Ethics",
    publisher: "Stanford Encyclopedia of Philosophy",
    url: "https://plato.stanford.edu/entries/ethics-virtue/",
    use: "Presents character-based accounts of right action in contrast to duty-based and outcome-based approaches, with the main objections.",
  },
  processTheism: {
    id: "processTheism",
    title: "Process Theism",
    publisher: "Stanford Encyclopedia of Philosophy",
    url: "https://plato.stanford.edu/entries/process-theism/",
    use: "Covers conceptions of God as persuasive rather than all-controlling, with genuinely limited power, and how they answer the problem of evil.",
  },
  buddhistMind: {
    id: "buddhistMind",
    title: "Mind in Indian Buddhist Philosophy",
    publisher: "Stanford Encyclopedia of Philosophy",
    url: "https://plato.stanford.edu/entries/mind-indian-buddhism/",
    use: "Presents the not-self doctrine: persons as streams of connected physical and mental events without an enduring substantial self.",
  },
  religionEpistemology: {
    id: "religionEpistemology",
    title: "Epistemology of Religion",
    publisher: "Stanford Encyclopedia of Philosophy",
    url: "https://plato.stanford.edu/entries/religion-epistemology/",
    use: "Covers evidentialism (Locke, Clifford) and reformed-epistemology replies about belief in God.",
  },
  religiousExperience: {
    id: "religiousExperience",
    title: "Religious Experience",
    publisher: "Stanford Encyclopedia of Philosophy",
    url: "https://plato.stanford.edu/entries/religious-experience/",
    use: "Surveys experience-based arguments for spiritual or religious reality and naturalistic explanations of those experiences.",
  },
  moralConstructivism: {
    id: "moralConstructivism",
    title: "Constructivism in Metaethics",
    publisher: "Stanford Encyclopedia of Philosophy",
    url: "https://plato.stanford.edu/entries/constructivism-metaethics/",
    use: "Explains constructivist views on which moral truths are fixed by rational or practical procedures rather than by bare approval or stance-independent facts.",
  },
  skepticism: {
    id: "skepticism",
    title: "Skepticism",
    publisher: "Stanford Encyclopedia of Philosophy",
    url: "https://plato.stanford.edu/entries/skepticism/",
    use: "Frames radical skeptical hypotheses, closure principles, and ordinary-knowledge replies.",
  },
  personalIdentity: {
    id: "personalIdentity",
    title: "Personal Identity",
    publisher: "Stanford Encyclopedia of Philosophy",
    url: "https://plato.stanford.edu/entries/identity-personal/",
    use: "Surveys psychological-continuity, bodily-continuity, animalist, and soul-based accounts of persistence over time.",
  },
};

export const categories: BeliefCategory[] = [
  {
    id: "freedom",
    name: "Freedom and responsibility",
    description: "Determinism, alternatives, and accountability.",
  },
  {
    id: "religion",
    name: "God and evidence",
    description:
      "Theism, atheism, suffering, hiddenness, foreknowledge, and evidence.",
  },
  {
    id: "practice",
    name: "Right action and animals",
    description:
      "Consequences, moral limits, and what we owe sentient animals.",
  },
  {
    id: "value",
    name: "Morality, meaning, and knowledge",
    description:
      "Objective value, moral grounding, meaningful lives, and skeptical pressure.",
  },
  {
    id: "mind",
    name: "Mind and consciousness",
    description:
      "Physical completeness, artificial minds, and subjective experience.",
  },
];

export const beliefStatements: BeliefStatement[] = [
  {
    id: "perfectGod",
    category: "religion",
    prompt:
      "A personal God exists who is omniscient, omnipotent, perfectly good, and perfectly loving.",
    plain:
      "There is one God who knows everything, can do anything, and is perfectly good and loving.",
    clarify:
      "This is classical personal theism, not merely a first cause, spirit, or impersonal ground of reality. If you regard talk of God as literally meaningless rather than true or false (theological non-cognitivism), neither this statement nor its denial captures your view — answer “it's complicated” instead.",
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
    plain: "No gods of any kind exist.",
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
    plain:
      "Some suffering is so pointless that no all-good, all-powerful God could have a good reason to allow it.",
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
    plain:
      "Some sincere people want a relationship with God, are not resisting it, and still cannot believe.",
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
    plain:
      "God already knows exactly what each person will choose, before they choose it, and cannot be wrong.",
    clarify:
      "The statement deliberately concerns prior, error-proof knowledge of a concrete future act.",
    caseFor:
      "Many conceptions of divine omniscience include complete knowledge of future human actions.",
    caseAgainst:
      "Open theism restricts the content of foreknowledge; Boethian and Aquinas-style eternity replies hold that timeless knowledge does not make the future fixed for an agent acting in time; Molinism appeals to counterfactuals of freedom; Ockhamists distinguish hard and soft facts about the past. The 'live argument' below names the bridge premise these replies reject.",
    sourceIds: ["foreknowledge", "freeWill"],
  },
  {
    id: "beliefNeedsEvidence",
    category: "religion",
    prompt:
      "It is wrong to accept a claim as true unless it is adequately supported by evidence.",
    plain:
      "You should not accept a claim as true unless there is good evidence for it.",
    clarify:
      "This is evidentialism about belief, applied to any claim, including religious and anti-religious ones.",
    caseFor:
      "Evidentialists such as Locke and W. K. Clifford argue that believing beyond the evidence is intellectually and morally irresponsible.",
    caseAgainst:
      "Reformed epistemologists hold some beliefs can be properly basic, and pragmatists allow non-evidential grounds; the principle may also struggle to support itself.",
    sourceIds: ["religionEpistemology"],
  },
  {
    id: "spiritualReality",
    category: "religion",
    prompt:
      "Some non-personal spiritual reality, sacred order, or transcendent dimension exists, even if no personal God exists.",
    plain:
      "There is something spiritually real or sacred beyond ordinary physical life, even if it is not a personal God.",
    clarify:
      "This is meant for spiritual-but-not-classical-theist views. It does not affirm Jesus, a personal creator, or any deity with a will; if your view is purely metaphorical, leave it unselected.",
    caseFor:
      "Support may come from religious experience, contemplative practice, perceived sacredness, or arguments that reality has a non-personal transcendent aspect.",
    caseAgainst:
      "Naturalists explain such experiences without a spiritual reality, and the term may be too indeterminate unless a view says what exists and how we could know it.",
    sourceIds: ["religiousExperience", "pew"],
  },
  {
    id: "limitedGod",
    category: "religion",
    prompt:
      "A personal God exists, but one whose power or knowledge is genuinely limited — not a being that is both omnipotent and omniscient.",
    plain:
      "There is a personal God, but not an all-controlling one — God's power or knowledge has real limits.",
    clarify:
      "This is non-classical theism: open theism limits God's foreknowledge of free choices, process theism holds God persuades rather than controls, and finite-God views limit power outright. It concerns the same one God as the classical statement, described differently — not a second, additional deity.",
    caseFor:
      "Limiting the classical attributes is a principled response to suffering and hiddenness: a God who cannot unilaterally prevent every evil does not need a justifying reason for permitting it.",
    caseAgainst:
      "Classical theists object that a limited being falls short of what 'God' means — a being worthy of unconditional worship — and that perfect-being theology has deep scriptural and philosophical roots.",
    sourceIds: ["processTheism", "evil"],
  },
  {
    id: "agnosticismAboutGod",
    category: "religion",
    prompt:
      "The available evidence and arguments do not settle whether any god exists, and the most reasonable response is to suspend judgment.",
    plain:
      "Whether God exists can't be settled either way on the evidence we have — the honest response is to suspend judgment.",
    clarify:
      "This is agnosticism as a positive claim about the evidence, not mere personal indecision: it says suspension is what the evidence actually warrants — for anyone, not just for you.",
    caseFor:
      "Agnostics argue that the classic arguments for and against God are inconclusive, and that suspending judgment is the rational attitude toward an evidentially open question.",
    caseAgainst:
      "Theists and atheists each hold that the total evidence does favor their side; others argue that experience, trust, or practical stakes can justify belief where public arguments alone cannot.",
    sourceIds: ["atheism", "religionEpistemology"],
  },
  {
    id: "moralFacts",
    category: "value",
    prompt:
      "At least some moral facts are true regardless of what any person or society approves.",
    plain:
      "Some things are really right or wrong, whatever anyone thinks or approves.",
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
    plain:
      "Right and wrong are only a matter of what people or societies happen to approve of.",
    clarify:
      "Affirm this only if no moral truth is independent of all human or social approval. This covers individual subjectivism and cultural or intersubjective relativism alike. Sophisticated constructivist and quasi-realist views sit nearby but may decline both poles, since they earn ordinary moral talk without grounding it in bare approval.",
    caseFor:
      "Subjectivist and relativist approaches can explain moral practice through attitudes, cultures, or commitments.",
    caseAgainst:
      "Realists object that approval cannot make atrocities right and that moral criticism often claims objective force.",
    sourceIds: ["moralAntiRealism"],
  },
  {
    id: "constructedMorality",
    category: "value",
    prompt:
      "Some moral truths are constructed by rational agents under fair or reasonable conditions, rather than discovered as mind-independent facts or made true by current approval.",
    plain:
      "Some moral truths come from what rational people would have reason to endorse under fair conditions, not from bare opinion or from facts wholly independent of us.",
    clarify:
      "This is a constructivist-style claim. It is not simple relativism: actual approval is not enough. It also need not be robust moral realism: the procedure, standpoint, or practical reasoning does important grounding work.",
    caseFor:
      "Constructivists argue that moral authority can arise from practical reason, reciprocity, or idealized agreement without appealing to stance-independent moral facts.",
    caseAgainst:
      "Realists argue that valid procedures answer to independent moral facts, while subjectivists and error theorists deny that construction secures genuine moral truth.",
    sourceIds: ["moralConstructivism", "moralAntiRealism"],
  },
  {
    id: "noMoralTruths",
    category: "value",
    prompt:
      "No action is ever genuinely morally right, wrong, obligatory, or forbidden; moral claims are systematically untrue.",
    plain:
      "Nothing is really right or wrong — moral claims are never literally true.",
    clarify:
      "This is moral error theory, often called moral nihilism: moral talk aims at truth but always misses, because there are no moral facts of any kind — objective, constructed, or attitude-based. It is stronger than 'morality is subjective'; the subjectivist still thinks some moral claims are true.",
    caseFor:
      "Error theorists such as J. L. Mackie argue that objective values would be metaphysically queer — unlike anything else we know — and that deep moral disagreement is better explained by there being nothing to be right about.",
    caseAgainst:
      "Critics reply that the same skeptical moves would erase mathematical and epistemic truths too, and that 'torturing for fun is wrong' is more credible than any premise in the argument against it.",
    sourceIds: ["moralAntiRealism"],
  },
  {
    id: "divineCommandOnly",
    category: "value",
    prompt: "Every moral obligation obtains solely because God commands it.",
    plain: "Moral duties exist only because God commands them.",
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
      "At least one moral obligation would obtain even if no deity commanded it.",
    plain:
      "At least one moral duty would still hold even if no God commanded it.",
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
    plain:
      "A human life can be objectively meaningful through worthwhile activity in this world, even without God or an afterlife.",
    clarify:
      "Objective naturalism says meaning can depend on real value in this world rather than transcendence. This is about objective meaning, not whether things can matter to you: a subjectivist can hold that family and projects genuinely matter to them while denying any objective meaning.",
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
    plain:
      "Without God or an immortal soul, life cannot have any real, objective meaning.",
    clarify:
      "This says transcendence is necessary for objective meaning, not merely helpful or personally important.",
    caseFor:
      "Supernaturalist accounts ground ultimate significance in God, immortality, or both.",
    caseAgainst:
      "Objective naturalist and hybrid accounts identify meaningful activity within finite human life.",
    sourceIds: ["meaning"],
  },
  {
    id: "subjectiveMeaningOnly",
    category: "value",
    prompt:
      "No human life is objectively meaningful; a life has meaning only in the sense that it matters to the person living it or to people affected by it.",
    plain:
      "Meaning isn't found, it's conferred: a life means what it means to people — there is no objective measure of a meaningful life.",
    clarify:
      "This is subjectivism about meaning, not nihilism: lives can genuinely matter to people. What it denies is any standard by which one life is really more meaningful than another, independent of anyone's caring.",
    caseFor:
      "Subjectivists argue that meaning tracks engagement and caring — being gripped by what you love — and that talk of 'objective meaning' has never been given an agreed standard.",
    caseAgainst:
      "Objectivists reply that a life spent counting blades of grass, however satisfying, seems less meaningful than one spent on love, knowledge, or others' lives — a comparison that needs a standard beyond caring.",
    sourceIds: ["meaning"],
  },
  {
    id: "ordinaryKnowledge",
    category: "value",
    prompt:
      "People can know many ordinary facts about the external world, such as that they have hands, live among other people, or ate breakfast today.",
    plain:
      "We can really know many everyday facts about the world around us.",
    clarify:
      "This concerns ordinary empirical knowledge, not certainty about every detail or immunity from all possible error.",
    caseFor:
      "Common-sense and fallibilist epistemologies hold that knowledge does not require eliminating every remote skeptical possibility.",
    caseAgainst:
      "Skeptical arguments press that if we cannot rule out radical deception, we may not know ordinary external-world claims.",
    sourceIds: ["skepticism"],
  },
  {
    id: "radicalSkepticalScenario",
    category: "value",
    prompt:
      "For all I know, my experiences could be produced by a radically deceptive dream, simulation, or brain-in-a-vat scenario.",
    plain:
      "I cannot rule out that my whole experience is a radical deception, like a dream, simulation, or brain in a vat.",
    clarify:
      "Affirm this only if you mean an epistemic possibility you cannot rule out, not just a science-fiction scenario you can imagine.",
    caseFor:
      "Radical skeptical hypotheses seem compatible with the same experiences, making ordinary knowledge hard to secure if knowledge requires ruling them out.",
    caseAgainst:
      "Moorean, contextualist, externalist, and pragmatic replies deny that such possibilities defeat ordinary knowledge.",
    sourceIds: ["skepticism"],
  },
  {
    id: "psychologicalContinuity",
    category: "mind",
    prompt:
      "A person remains the same person over time mainly because of psychological continuity: memory, character, intentions, and connected mental life.",
    plain:
      "What makes someone the same person over time is mainly continuity of mind: memories, character, intentions, and mental life.",
    clarify:
      "This is a psychological-continuity view of personal identity. It does not say bodies are irrelevant in practice; it says bodily sameness is not the main identity-maker.",
    caseFor:
      "Memory, character, and agency seem central to survival in transplant, amnesia, and duplication thought experiments.",
    caseAgainst:
      "Animalists, bodily-continuity theorists, and soul theorists argue that psychology can change too much, duplicate, or depend on something deeper.",
    sourceIds: ["personalIdentity"],
  },
  {
    id: "bodilySoulContinuity",
    category: "mind",
    prompt:
      "A person remains the same person over time mainly because the same living body or soul persists, even if memory and character change radically.",
    plain:
      "What makes someone the same person over time is mainly the same body or soul continuing, even if their mind changes a lot.",
    clarify:
      "This groups bodily and soul-continuity views because both deny that psychological continuity is the main identity-maker. Select it if either version is your view of what keeps a person the same.",
    caseFor:
      "Bodily and soul-based accounts avoid duplication worries and explain identity through an enduring subject rather than a chain of mental connections.",
    caseAgainst:
      "Psychological-continuity theorists argue that a persisting body or soul without the right mental connections may not preserve the person who mattered.",
    sourceIds: ["personalIdentity"],
  },
  {
    id: "noPersistentSelf",
    category: "mind",
    prompt:
      "Strictly speaking, no self persists over time: a person is a stream of connected physical and mental events, and the continuing 'I' is a construction.",
    plain:
      "There is no persisting self — the continuous 'me' is a useful construction laid over a stream of connected experiences.",
    clarify:
      "This is the not-self view found in Buddhist philosophy and in reductionist accounts like Derek Parfit's. The events in the stream are real and really connected; what is denied is an extra enduring subject that owns them.",
    caseFor:
      "Introspection finds experiences but no experiencer behind them, and puzzle cases — fission, gradual replacement — suggest questions of identity have no deep further answer.",
    caseAgainst:
      "Critics argue that something must own experiences and persist through change: memory, anticipation, promising, and responsibility all seem to presuppose a continuing subject.",
    sourceIds: ["personalIdentity", "buddhistMind"],
  },
  {
    id: "determinism",
    category: "freedom",
    prompt:
      "Given exactly the same complete past and laws of nature, only one future human action is possible.",
    plain:
      "If the whole past and the laws of nature were exactly the same, only one future action could happen.",
    clarify:
      "This is causal or nomological determinism as applied to choices: a metaphysical claim about whether the past and laws fix a unique future. It is not a claim about quantum mechanics, relativity, or whether anyone could in practice predict the outcome.",
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
    plain:
      "Sometimes you really could choose differently, even with the exact same past and laws of nature.",
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
    plain:
      "A person can be genuinely responsible even if they could not have done otherwise.",
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
    plain:
      "If all the physical facts are fixed, the facts about conscious experience are fixed too.",
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
    plain:
      "A world could be physically just like ours and still have no conscious experience at all.",
    clarify:
      "This is the philosophical-zombie possibility claim, not a prediction about actual neuroscience.",
    caseFor:
      "Conceivability arguments (Chalmers) use such a world to challenge physicalist entailment of consciousness.",
    caseAgainst:
      "Conceivability is not possibility: a priori imaginability can outrun what is metaphysically possible (Type-B physicalists), and illusionists (Frankish, Dennett) deny we even conceive a coherent zombie. Affirm this only if you mean genuine metaphysical possibility, not merely that the scenario seems imaginable.",
    sourceIds: ["physicalism", "dualism"],
  },
  {
    id: "futureAiConscious",
    category: "mind",
    prompt:
      "Some future non-biological artificial intelligence systems could have conscious experience.",
    plain:
      "Some future AI systems, even if not made of living tissue, could really be conscious.",
    clarify:
      "This concerns possible future systems and genuine subjective experience, not whether current chatbots are conscious or merely persuasive.",
    caseFor:
      "Functionalist and computationalist approaches leave room for mentality realized in different physical materials, and recent AI-consciousness work treats future systems as serious candidates under some theories.",
    caseAgainst:
      "Biological or non-computational views may hold that consciousness depends on living neural systems, or that behavior and functional organization do not settle whether experience is present.",
    sourceIds: [
      "philpapers",
      "computationalMind",
      "consciousness",
      "aiConsciousness",
      "llmConsciousness",
    ],
  },
  {
    id: "consequencesOnly",
    category: "practice",
    prompt:
      "Whether an action is morally right depends only on how good or bad its consequences are.",
    plain:
      "An act is right or wrong only because of how good or bad its results are.",
    clarify:
      "This is consequentialism: outcomes are the sole determinant of rightness, with no act ruled out in advance.",
    caseFor:
      "Consequentialists argue that what ultimately matters morally is making outcomes better rather than worse.",
    caseAgainst:
      "Deontologists object that this can require betraying, harming, or using people whenever the totals come out ahead.",
    sourceIds: ["consequentialism", "deontology"],
  },
  {
    id: "sideConstraints",
    category: "practice",
    prompt:
      "Some actions are morally wrong even when performing them would produce the best overall consequences.",
    plain:
      "Some acts are wrong even if they would bring about the best overall outcome.",
    clarify:
      "This asserts agent-relative constraints, such as a duty not to kill an innocent person even to prevent more deaths.",
    caseFor:
      "Deontologists hold that persons have rights or dignity that cannot be overridden by aggregate benefit.",
    caseAgainst:
      "Consequentialists argue it is irrational to forbid an act that genuinely makes the world go best.",
    sourceIds: ["deontology", "consequentialism"],
  },
  {
    id: "virtueEthicsPrimary",
    category: "practice",
    prompt:
      "Whether an action is morally right depends primarily on whether it is what a virtuous person — honest, just, compassionate — would characteristically do in the circumstances.",
    plain:
      "An act is right when it's what a genuinely good person would do — character comes first, not rules or outcome totals.",
    clarify:
      "This is virtue ethics as a claim about what makes actions right. It does not deny that outcomes and duties matter; it says they matter through the judgment of good character rather than as the fundamental standard.",
    caseFor:
      "Virtue ethicists argue that practical wisdom, not a universal formula, is what actually guides good people, and the view fits how we praise, blame, and teach character.",
    caseAgainst:
      "Critics object that the account risks circularity — the virtuous person is the one who acts rightly — and gives too little concrete guidance when virtues conflict in hard cases.",
    sourceIds: ["virtueEthics", "consequentialism", "deontology"],
  },
  {
    id: "animalsMatter",
    category: "practice",
    prompt:
      "Sentient non-human animals deserve direct moral consideration because their suffering matters.",
    plain:
      "Animals' suffering matters for their own sake, not just because humans care.",
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
    plain:
      "It is wrong to cause severe, avoidable animal suffering just for taste or convenience.",
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
    plain:
      "Even when I have practical alternatives, it is morally fine for me to buy food from systems that severely harm animals just for taste or convenience.",
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
