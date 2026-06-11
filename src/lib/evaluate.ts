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
    id: "limited-and-perfect-god",
    kind: "conflict",
    title: "A perfect God and a limited God",
    requires: ["perfectGod", "limitedGod"],
    gist:
      "One statement says God is omnipotent and omniscient; the other says God's power or knowledge is genuinely limited. Describing the same God, both can't be true.",
    explanation:
      "Both statements describe the one God: the classical statement attributes unlimited power and knowledge, while the limited statement denies exactly that package. A single being cannot both have and lack those attributes.",
    nextQuestion:
      "Which is your actual working picture — a perfect being, or a God with real limits doing the best a God can?",
    sourceIds: ["processTheism", "cosmological"],
  },
  {
    id: "limited-god-and-no-deity",
    kind: "conflict",
    title: "A limited God exists and no deity exists",
    requires: ["limitedGod", "noDeity"],
    gist:
      "A limited personal God is still a god — so “a limited God exists” and “no gods of any kind exist” can't both stand.",
    explanation:
      "The limited-God statement affirms a personal divine being; the no-deity statement denies every god of any kind, limited ones included.",
    nextQuestion:
      "Is your denial aimed at every divine being, or only at the all-powerful classical conception?",
    sourceIds: ["atheism", "processTheism"],
  },
  {
    id: "limited-god-and-suffering",
    kind: "compatible",
    title: "A limited God and unjustifiable suffering",
    requires: ["limitedGod", "gratuitousSuffering"],
    gist:
      "A God who cannot prevent every evil is not impugned by pointless-looking suffering — limiting the divine attributes is precisely how some theists answer the problem of evil.",
    explanation:
      "The argument from gratuitous suffering targets the combination of perfect goodness, omnipotence, and omniscience. A God with genuinely limited power or knowledge may be unable to prevent some suffering, so this pairing is a recognized, coherent package — process and open theists defend versions of it.",
    nextQuestion:
      "Does the limited conception still support what you want from theism — providence, prayer, hope — or does it concede too much?",
    sourceIds: ["processTheism", "evil"],
  },
  {
    id: "agnosticism-and-theism",
    kind: "argument",
    title: "Suspended judgment and belief in God",
    requires: ["agnosticismAboutGod", "perfectGod"],
    gist:
      "You believe God exists, while also holding that the evidence warrants suspending judgment. That is believing beyond what you yourself say the evidence supports.",
    explanation:
      "This is not a flat contradiction — one claim is about what exists, the other about what the evidence warrants. The tension is epistemic: by your own assessment, suspension is the most reasonable response, yet you hold the belief. Reformed epistemologists answer that belief in God can be properly basic — grounded in experience rather than argument; pragmatists allow commitments that evidence alone does not settle.",
    bridge:
      "One should not hold a settled belief that one regards as unsupported by the balance of evidence.",
    nextQuestion:
      "Does your belief rest on something the public arguments leave out — experience, trust, tradition — and do you count that as evidence?",
    sourceIds: ["atheism", "religionEpistemology"],
  },
  {
    id: "agnosticism-and-atheism",
    kind: "argument",
    title: "Suspended judgment and the denial of God",
    requires: ["agnosticismAboutGod", "noDeity"],
    gist:
      "“No gods exist” is a settled verdict; “the evidence doesn't settle it” says no verdict is warranted. Holding both asserts more than your own standard allows.",
    explanation:
      "The no-deity statement is the positive claim that no god exists, not a mere lack of belief. If the evidence genuinely does not settle the question, that positive denial outruns the evidence by your own lights. Atheists who feel this pressure usually either soften the denial to “no good reason to believe,” or argue the evidence does settle it — for instance, that hiddenness and suffering are strong evidence of absence.",
    bridge:
      "One should not hold a settled belief that one regards as unsupported by the balance of evidence.",
    nextQuestion:
      "Do you mean to assert that no god exists, or only that belief in God is unwarranted? The first claim needs evidence of its own.",
    sourceIds: ["atheism"],
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
    id: "constructivism-and-attitude-only",
    kind: "conflict",
    title: "Constructed morality and approval-only morality",
    requires: ["constructedMorality", "attitudeOnlyMorality"],
    gist:
      "Constructivism says bare approval is not enough: the right procedure, standpoint, or rational conditions matter. Approval-only morality says approval is all there is. Those cannot both be the whole story.",
    explanation:
      "The constructivist statement says moral truth is not made true merely by actual attitudes or approvals; it depends on rational, fair, or reasonable conditions. The attitude-only statement says every moral truth depends only on attitudes or approvals. Those claims directly pull apart as worded.",
    nextQuestion:
      "Do actual attitudes make morality true, or do they need to pass some independent rational or fair procedure first?",
    sourceIds: ["moralConstructivism", "moralAntiRealism"],
  },
  {
    id: "error-theory-and-moral-facts",
    kind: "conflict",
    title: "Objective wrongs and no moral truths",
    requires: ["noMoralTruths", "moralFacts"],
    gist:
      "One says some things are really wrong no matter what anyone thinks; the other says nothing is ever really right or wrong. Straight negations of each other.",
    explanation:
      "The error-theoretic statement denies every moral truth, of any kind. The moral-facts statement affirms at least one approval-independent moral truth. They cannot both hold.",
    nextQuestion:
      "When you say cruelty is wrong, do you take that to be literally true, or a stance you express without claiming truth?",
    sourceIds: ["moralAntiRealism"],
  },
  {
    id: "error-theory-and-constructed-morality",
    kind: "conflict",
    title: "Constructed moral truths and no moral truths",
    requires: ["noMoralTruths", "constructedMorality"],
    gist:
      "Constructivism says some moral truths exist once the right rational procedure fixes them; error theory says no moral claim is true by any route — construction included.",
    explanation:
      "The constructivist statement affirms moral truths grounded in what rational agents would endorse under fair conditions. The error-theoretic statement says moral claims are systematically untrue. As worded, they cannot both hold.",
    nextQuestion:
      "Could a fair procedure make a moral claim genuinely true, or would its output still be just what was agreed, not what is right?",
    sourceIds: ["moralConstructivism", "moralAntiRealism"],
  },
  {
    id: "error-theory-and-constraints",
    kind: "conflict",
    title: "Off-limits acts and no moral truths",
    requires: ["noMoralTruths", "sideConstraints"],
    gist:
      "You say nothing is ever really wrong — and also that some acts are wrong even when they would produce the best outcome. The second is exactly the kind of truth the first rules out.",
    explanation:
      "The constraints statement asserts a first-order moral truth: some actions are wrong regardless of consequences. The error-theoretic statement denies that any action is ever wrong. Affirming both is inconsistent as worded.",
    nextQuestion:
      "Which gives: the conviction that some acts are off-limits, or the theory that no moral claim is ever true?",
    sourceIds: ["moralAntiRealism", "deontology"],
  },
  {
    id: "error-theory-and-animal-harm",
    kind: "conflict",
    title: "Wrongful animal suffering and no moral truths",
    requires: ["noMoralTruths", "minorConvenienceHarmWrong"],
    gist:
      "Calling severe avoidable animal suffering for taste “morally wrong” asserts a moral truth — the very thing your error-theoretic answer says doesn't exist.",
    explanation:
      "One answer says it is morally wrong to cause severe avoidable suffering for minor convenience. The other says no moral claim is ever true. The first is a moral claim; by the second, it cannot be true.",
    nextQuestion:
      "Is your objection to animal suffering a truth about the world, or a strong commitment you would act on without calling it true?",
    sourceIds: ["moralAntiRealism", "animals"],
  },
  {
    id: "error-theory-and-independent-duty",
    kind: "conflict",
    title: "A command-independent duty and no moral truths",
    requires: ["noMoralTruths", "independentDuty"],
    gist:
      "You affirm that at least one moral duty would hold even with no God — and also that nothing is ever obligatory. Both can't stand.",
    explanation:
      "The independent-duty statement affirms at least one genuine moral obligation. The error-theoretic statement says nothing is ever genuinely obligatory. They directly contradict each other.",
    nextQuestion:
      "Did you mean that duties would still feel binding without God, or that they would really bind — which error theory denies?",
    sourceIds: ["moralAntiRealism", "voluntarism"],
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
    id: "objective-and-subjective-meaning",
    kind: "conflict",
    title: "Objective meaning and meaning as conferred only",
    requires: ["naturalMeaning", "subjectiveMeaningOnly"],
    gist:
      "One says a finite life can be objectively meaningful; the other says no life is objectively meaningful — meaning is only conferred. As worded, they negate each other.",
    explanation:
      "The naturalist statement affirms that lives can be objectively meaningful through worthwhile activity. The subjectivist statement denies objective meaning across the board, allowing only meaning conferred by the people involved. Both cannot hold.",
    nextQuestion:
      "Is a life devoted to something genuinely worthwhile more meaningful than an equally satisfying trivial one? Yes is the objective claim; no is the subjective one.",
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
    id: "ordinary-knowledge-and-radical-skepticism",
    kind: "argument",
    title: "Ordinary knowledge and radical skeptical scenarios",
    requires: ["ordinaryKnowledge", "radicalSkepticalScenario"],
    gist:
      "You say we know ordinary external-world facts, while also saying radical deception remains open for all you know. That is the classic skeptical pressure: can knowledge survive without ruling out the scenario?",
    explanation:
      "This is not a direct contradiction. Fallibilist, contextualist, externalist, and Moorean views allow ordinary knowledge even when radical skeptical possibilities are not eliminated in the strongest sense. The pressure comes from a closure-style thought: if you know ordinary facts, and those facts exclude being radically deceived, then perhaps you must be able to know you are not radically deceived.",
    bridge:
      "If you know an ordinary external-world fact, you must be able to rule out radical skeptical scenarios incompatible with that fact.",
    nextQuestion:
      "Does knowledge require ruling out radical deception, or is ordinary knowledge compatible with remote skeptical possibilities?",
    sourceIds: ["skepticism"],
  },
  {
    id: "psychological-and-bodily-soul-identity",
    kind: "conflict",
    title: "Psychological continuity and body-or-soul continuity",
    requires: ["psychologicalContinuity", "bodilySoulContinuity"],
    gist:
      "One statement says psychological continuity is the main identity-maker; the other says the same living body or soul is the main identity-maker even through radical psychological change. They assign the main work to different things.",
    explanation:
      "As worded, the two claims cannot both be the main account of personal identity. One makes memory, character, intentions, and connected mental life primary; the other makes a persisting body or soul primary even if psychology changes radically.",
    nextQuestion:
      "Which relation does the identity-making work in hard cases: the continuing mind, the continuing organism, or a soul or subject beneath both?",
    sourceIds: ["personalIdentity"],
  },
  {
    id: "no-self-and-psychological-identity",
    kind: "argument",
    title: "No persisting self, yet the mind keeps you the same",
    requires: ["noPersistentSelf", "psychologicalContinuity"],
    gist:
      "You say the mind's continuity keeps a person the same over time — and also that strictly no self persists. Reductionists hold both, but it takes work: all persistence-talk becomes convenient shorthand.",
    explanation:
      "This is not necessarily a contradiction; it is the reductionist position Derek Parfit defended. On that view, personal identity just consists in psychological continuity — there is no further self — so “same person” talk is true only in a deflated, bookkeeping sense. The pressure: if no self strictly persists, can promises, blame, and concern for your own future carry the weight we give them?",
    bridge:
      "Saying a person “remains the same person” is strictly true — not just convenient shorthand for a stream of connected events.",
    nextQuestion:
      "When you care about your future self, are you caring about you — or about a successor who merely inherits your memories and projects? And does the difference matter?",
    sourceIds: ["personalIdentity", "buddhistMind"],
  },
  {
    id: "no-self-and-body-soul-identity",
    kind: "argument",
    title: "No persisting self, yet a body or soul persists",
    requires: ["noPersistentSelf", "bodilySoulContinuity"],
    gist:
      "An enduring soul — or a persisting organism doing the identity work — is exactly the kind of continuing subject the no-self view denies. Holding both needs the body reading, plus deflated person-talk.",
    explanation:
      "On the soul reading these flatly contradict: an enduring soul is a persisting self. On the body reading there is room — an organism can persist while “the person” is a construction laid over it — but then the body does not keep a person the same in any deep sense; it merely continues. The combination survives only with that deflationary reading.",
    bridge:
      "The persisting body or soul is a genuine continuing subject — not merely a physical process the sense of self rides on.",
    nextQuestion:
      "Was it the soul or the body you had in mind — and if the body, does a continuing organism amount to a continuing you?",
    sourceIds: ["personalIdentity", "buddhistMind"],
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
    id: "animal-harm-without-status",
    kind: "argument",
    title: "Harming animals is wrong, yet they get no direct standing",
    requires: ["minorConvenienceHarmWrong"],
    rejects: ["animalsMatter"],
    gist:
      "You hold it is wrong to cause an animal severe suffering for taste, yet — by rejecting the previous statement — deny that its suffering counts for its own sake. That can hold together, but only if the wrong is grounded in something other than the animal.",
    explanation:
      "This is not a contradiction. You affirm that causing severe avoidable animal suffering for a minor interest is wrong, and — by rejecting that animals deserve direct moral consideration — you locate the wrong somewhere other than the animal's own interests. Kantian indirect-duty views do exactly this: cruelty to animals is wrong because of what it does to us, or to our character, not because the animal's suffering matters in its own right. The pressure is to say what carries the wrongness once the animal's own interests are set aside.",
    bridge:
      "The wrongness of causing an animal severe suffering is best explained by the animal's own interests (direct consideration), not only by indirect effects on humans or on the agent's character.",
    nextQuestion:
      "What grounds the wrong if not the animal's suffering itself — your character, effects on other people, or something else? And does that grounding still condemn the harm when no one is watching and no human is affected?",
    sourceIds: ["animals"],
  },
  {
    id: "physicalism-without-ai",
    kind: "argument",
    title: "Physical facts fix consciousness, yet only biology could be conscious",
    requires: ["physicalClosure"],
    rejects: ["futureAiConscious"],
    gist:
      "If the physical facts fully fix consciousness, yet no non-biological system could ever be conscious, you are committed to consciousness depending on specifically biological physics. That is a real position, but it needs defending.",
    explanation:
      "This is not a contradiction. You hold that fixing all the physical facts fixes the facts about experience, and — by rejecting the AI statement — that no future non-biological system could be conscious. Together these commit you to the view that what makes consciousness present is something special about biological matter rather than the organization or information processing it implements. That is biological naturalism (Searle), a serious position; the opposing pressure is multiple realizability — that if experience is fixed by physical facts, the same consciousness-making organization could in principle be built from other materials.",
    bridge:
      "If consciousness is fixed by physical facts, what fixes it is functional or organizational structure that could be realized in non-biological materials, not the biological substrate itself.",
    nextQuestion:
      "Do you think consciousness requires specifically biological matter, or that the right functional organization would suffice — and if the latter, why couldn't a non-biological system ever have it?",
    sourceIds: ["physicalism", "computationalMind", "consciousness"],
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
    id: "spiritual-but-not-theist",
    kind: "compatible",
    title: "Spiritual reality without a personal deity",
    requires: ["noDeity", "spiritualReality"],
    gist:
      "Denying gods while affirming a non-personal sacred or transcendent dimension is a coherent spiritual-but-not-theist position, not a contradiction.",
    explanation:
      "The no-deity statement denies gods or deities. The spiritual-reality statement, as written, allows a non-personal sacred order or transcendent dimension without a divine person. That combination is coherent if the spiritual reality is not itself a deity.",
    nextQuestion:
      "What makes the spiritual reality real rather than metaphorical, and why is it not a deity?",
    sourceIds: ["religiousExperience", "atheism"],
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
    id: "virtue-and-consequences-only",
    kind: "conflict",
    title: "Only outcomes matter, yet character comes first",
    requires: ["consequencesOnly", "virtueEthicsPrimary"],
    gist:
      "One says outcomes are the only thing that makes an act right; the other gives the primary role to good character. They can't both be the fundamental standard.",
    explanation:
      "The consequences-only statement makes outcomes the sole determinant of rightness, leaving no independent work for character. The virtue statement says rightness depends primarily on what an honest, just, compassionate person would do. As worded, the two assign the fundamental standard to different things.",
    nextQuestion:
      "When the virtuous person's judgment and the outcome calculation come apart, which one settles what is right for you?",
    sourceIds: ["virtueEthics", "consequentialism"],
  },
  {
    id: "virtue-and-constraints",
    kind: "compatible",
    title: "Character-first ethics and moral limits",
    requires: ["virtueEthicsPrimary", "sideConstraints"],
    gist:
      "Character-first ethics and moral limits travel well together: a just person treats some acts as simply not to be done, whatever the payoff.",
    explanation:
      "These answers are natural companions, not a tension: virtue ethicists typically hold that an honest and just person recognizes limits — things such a person would not do even for the best outcome. The open question is which is more basic: do the limits fall out of good character, or does good character consist partly in respecting independent limits?",
    nextQuestion:
      "Does the wrongness of those acts come from what they would make of you, or would they be wrong whatever they did to your character?",
    sourceIds: ["virtueEthics", "deontology"],
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
