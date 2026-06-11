import { describe, expect, it } from "vitest";
import { evaluateBeliefs } from "./evaluate";

describe("evaluateBeliefs", () => {
  it("reports a direct contradiction only when both exact claims are affirmed", () => {
    const results = evaluateBeliefs({
      moralFacts: "affirm",
      attitudeOnlyMorality: "affirm",
    });

    expect(results).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "realism-and-attitude-only",
          kind: "conflict",
        }),
      ]),
    );
  });

  it("does not treat a rejection or uncertainty as its opposite", () => {
    const results = evaluateBeliefs({
      moralFacts: "affirm",
      attitudeOnlyMorality: "reject",
      noDeity: "unsure",
    });

    expect(results).toHaveLength(0);
  });

  it("keeps a disputed bridge premise out of the direct-conflict category", () => {
    const results = evaluateBeliefs({
      perfectGod: "affirm",
      nonresistantNonbelief: "affirm",
    });

    expect(results).toEqual([
      expect.objectContaining({
        id: "divine-hiddenness",
        kind: "argument",
        bridge: expect.any(String),
      }),
    ]);
  });

  it("recognizes objective naturalist combinations as compatible", () => {
    const results = evaluateBeliefs({
      noDeity: "affirm",
      moralFacts: "affirm",
      naturalMeaning: "affirm",
    });

    expect(results.map((result) => result.id)).toEqual([
      "atheist-moral-realism",
      "atheist-objective-meaning",
    ]);
    expect(results.every((result) => result.kind === "compatible")).toBe(true);
  });

  it("can expose multiple independent direct conflicts without scoring a person", () => {
    const results = evaluateBeliefs({
      perfectGod: "affirm",
      gratuitousSuffering: "affirm",
      physicalClosure: "affirm",
      zombieWorld: "affirm",
    });

    expect(results.filter((result) => result.kind === "conflict")).toHaveLength(
      2,
    );
  });

  it("treats physicalism and future AI consciousness as a coherent combination", () => {
    const results = evaluateBeliefs({
      physicalClosure: "affirm",
      futureAiConscious: "affirm",
    });

    expect(results).toEqual([
      expect.objectContaining({
        id: "future-ai-and-physicalism",
        kind: "compatible",
      }),
    ]);
  });

  it("treats spiritual but non-theist answers as compatible when the spiritual reality is not a deity", () => {
    const results = evaluateBeliefs({
      noDeity: "affirm",
      spiritualReality: "affirm",
    });

    expect(results).toEqual([
      expect.objectContaining({
        id: "spiritual-but-not-theist",
        kind: "compatible",
      }),
    ]);
  });

  it("flags constructivism against approval-only morality without treating it as simple realism", () => {
    const results = evaluateBeliefs({
      constructedMorality: "affirm",
      attitudeOnlyMorality: "affirm",
    });

    expect(results).toEqual([
      expect.objectContaining({
        id: "constructivism-and-attitude-only",
        kind: "conflict",
      }),
    ]);
  });

  it("treats ordinary knowledge plus radical skepticism as an argument, not a flat conflict", () => {
    const results = evaluateBeliefs({
      ordinaryKnowledge: "affirm",
      radicalSkepticalScenario: "affirm",
    });

    expect(results).toEqual([
      expect.objectContaining({
        id: "ordinary-knowledge-and-radical-skepticism",
        kind: "argument",
        bridge: expect.any(String),
      }),
    ]);
  });

  it("flags competing main accounts of personal identity as a direct conflict", () => {
    const results = evaluateBeliefs({
      psychologicalContinuity: "affirm",
      bodilySoulContinuity: "affirm",
    });

    expect(results).toEqual([
      expect.objectContaining({
        id: "psychological-and-bodily-soul-identity",
        kind: "conflict",
      }),
    ]);
  });

  it("treats zombies plus future AI consciousness as an evidence problem, not a flat conflict", () => {
    const results = evaluateBeliefs({
      zombieWorld: "affirm",
      futureAiConscious: "affirm",
    });

    expect(results).toEqual([
      expect.objectContaining({
        id: "future-ai-and-zombie-evidence",
        kind: "argument",
        bridge: expect.any(String),
      }),
    ]);
  });

  it("treats causing-versus-buying animal harm as an argument, not a flat conflict", () => {
    const results = evaluateBeliefs({
      minorConvenienceHarmWrong: "affirm",
      factoryFarmPermissible: "affirm",
    });

    expect(results).toEqual([
      expect.objectContaining({
        id: "avoidable-animal-harm",
        kind: "argument",
        bridge: expect.any(String),
      }),
    ]);
  });

  it("surfaces the nihilism implication of atheism plus transcendence-required meaning", () => {
    const results = evaluateBeliefs({
      noDeity: "affirm",
      meaningNeedsTranscendent: "affirm",
    });

    expect(results).toEqual([
      expect.objectContaining({
        id: "atheism-meaning-nihilism",
        kind: "implication",
      }),
    ]);
  });

  it("surfaces the no-obligation implication of atheism plus divine-command-only morality", () => {
    const results = evaluateBeliefs({
      noDeity: "affirm",
      divineCommandOnly: "affirm",
    });

    expect(results.map((result) => result.id)).toContain(
      "atheism-moral-nihilism",
    );
  });

  it("flags consequentialism and side-constraints as a direct conflict", () => {
    const results = evaluateBeliefs({
      consequencesOnly: "affirm",
      sideConstraints: "affirm",
    });

    expect(results).toEqual([
      expect.objectContaining({
        id: "consequences-and-constraints",
        kind: "conflict",
      }),
    ]);
  });

  it("flags an infallible divine belief alongside atheism as inconsistent", () => {
    const results = evaluateBeliefs({
      infallibleForeknowledge: "affirm",
      noDeity: "affirm",
    });

    expect(results).toEqual([
      expect.objectContaining({
        id: "foreknowledge-without-deity",
        kind: "conflict",
      }),
    ]);
  });

  it("surfaces the responsibility-skepticism fork from determinism plus a denied responsibility-without-alternatives", () => {
    const results = evaluateBeliefs({
      determinism: "affirm",
      responsibilityWithoutAlternatives: "reject",
    });

    expect(results).toEqual([
      expect.objectContaining({
        id: "determinism-and-responsibility-skepticism",
        kind: "implication",
        bridge: expect.any(String),
      }),
    ]);
  });

  it("does not fire the responsibility fork when the denial is merely suspension or silence", () => {
    const unsure = evaluateBeliefs({
      determinism: "affirm",
      responsibilityWithoutAlternatives: "unsure",
    });
    const blank = evaluateBeliefs({ determinism: "affirm" });
    const qualified = evaluateBeliefs({
      determinism: "affirm",
      responsibilityWithoutAlternatives: "qualify",
    });

    for (const results of [unsure, blank, qualified]) {
      expect(
        results.some(
          (r) => r.id === "determinism-and-responsibility-skepticism",
        ),
      ).toBe(false);
    }
  });

  it("treats determinism plus affirmed responsibility as the compatibilist argument, not the skeptical fork", () => {
    const results = evaluateBeliefs({
      determinism: "affirm",
      responsibilityWithoutAlternatives: "affirm",
    });

    expect(results.map((r) => r.id)).toContain("responsibility-and-determinism");
    expect(results.map((r) => r.id)).not.toContain(
      "determinism-and-responsibility-skepticism",
    );
  });

  it("raises the indirect-duty argument when harming animals is wrong but they get no direct standing", () => {
    const results = evaluateBeliefs({
      minorConvenienceHarmWrong: "affirm",
      animalsMatter: "reject",
    });

    expect(results).toEqual([
      expect.objectContaining({
        id: "animal-harm-without-status",
        kind: "argument",
        bridge: expect.any(String),
      }),
    ]);
  });

  it("does not fire the indirect-duty argument when direct standing is merely unsure or unanswered", () => {
    const unsure = evaluateBeliefs({
      minorConvenienceHarmWrong: "affirm",
      animalsMatter: "unsure",
    });
    const blank = evaluateBeliefs({ minorConvenienceHarmWrong: "affirm" });
    const qualified = evaluateBeliefs({
      minorConvenienceHarmWrong: "affirm",
      animalsMatter: "qualify",
    });

    for (const results of [unsure, blank, qualified]) {
      expect(
        results.some((r) => r.id === "animal-harm-without-status"),
      ).toBe(false);
    }
  });

  it("raises the biological-naturalism argument when physical closure holds but no AI could be conscious", () => {
    const results = evaluateBeliefs({
      physicalClosure: "affirm",
      futureAiConscious: "reject",
    });

    expect(results).toEqual([
      expect.objectContaining({
        id: "physicalism-without-ai",
        kind: "argument",
        bridge: expect.any(String),
      }),
    ]);
  });

  it("does not fire the biological-naturalism argument when AI consciousness is merely unsure or unanswered", () => {
    const unsure = evaluateBeliefs({
      physicalClosure: "affirm",
      futureAiConscious: "unsure",
    });
    const blank = evaluateBeliefs({ physicalClosure: "affirm" });

    for (const results of [unsure, blank]) {
      expect(
        results.some((r) => r.id === "physicalism-without-ai"),
      ).toBe(false);
    }
  });

  it("flags a perfect God alongside a limited God as a direct conflict", () => {
    const results = evaluateBeliefs({
      perfectGod: "affirm",
      limitedGod: "affirm",
    });

    expect(results).toEqual([
      expect.objectContaining({
        id: "limited-and-perfect-god",
        kind: "conflict",
      }),
    ]);
  });

  it("flags a limited God alongside the denial of every deity", () => {
    const results = evaluateBeliefs({
      limitedGod: "affirm",
      noDeity: "affirm",
    });

    expect(results).toEqual([
      expect.objectContaining({
        id: "limited-god-and-no-deity",
        kind: "conflict",
      }),
    ]);
  });

  it("treats a limited God plus gratuitous suffering as coherent — the problem of evil targets the perfect-God package", () => {
    const results = evaluateBeliefs({
      limitedGod: "affirm",
      gratuitousSuffering: "affirm",
    });

    expect(results).toEqual([
      expect.objectContaining({
        id: "limited-god-and-suffering",
        kind: "compatible",
      }),
    ]);
  });

  it("treats agnosticism plus settled belief (either way) as an argument, not a conflict", () => {
    const withTheism = evaluateBeliefs({
      agnosticismAboutGod: "affirm",
      perfectGod: "affirm",
    });
    const withAtheism = evaluateBeliefs({
      agnosticismAboutGod: "affirm",
      noDeity: "affirm",
    });

    expect(withTheism).toEqual([
      expect.objectContaining({
        id: "agnosticism-and-theism",
        kind: "argument",
        bridge: expect.any(String),
      }),
    ]);
    expect(withAtheism).toEqual([
      expect.objectContaining({
        id: "agnosticism-and-atheism",
        kind: "argument",
        bridge: expect.any(String),
      }),
    ]);
  });

  it("flags consequences-only against character-first virtue ethics", () => {
    const results = evaluateBeliefs({
      consequencesOnly: "affirm",
      virtueEthicsPrimary: "affirm",
    });

    expect(results).toEqual([
      expect.objectContaining({
        id: "virtue-and-consequences-only",
        kind: "conflict",
      }),
    ]);
  });

  it("treats virtue ethics plus side constraints as natural companions", () => {
    const results = evaluateBeliefs({
      virtueEthicsPrimary: "affirm",
      sideConstraints: "affirm",
    });

    expect(results).toEqual([
      expect.objectContaining({
        id: "virtue-and-constraints",
        kind: "compatible",
      }),
    ]);
  });

  it("collides error theory with every affirmed first-order and second-order moral truth", () => {
    const results = evaluateBeliefs({
      noMoralTruths: "affirm",
      moralFacts: "affirm",
      constructedMorality: "affirm",
      sideConstraints: "affirm",
      minorConvenienceHarmWrong: "affirm",
      independentDuty: "affirm",
    });

    expect(results.map((r) => r.id).sort()).toEqual([
      "error-theory-and-animal-harm",
      "error-theory-and-constraints",
      "error-theory-and-constructed-morality",
      "error-theory-and-independent-duty",
      "error-theory-and-moral-facts",
    ]);
    expect(results.every((r) => r.kind === "conflict")).toBe(true);
  });

  it("flags objective natural meaning against meaning-as-conferred-only", () => {
    const results = evaluateBeliefs({
      naturalMeaning: "affirm",
      subjectiveMeaningOnly: "affirm",
    });

    expect(results).toEqual([
      expect.objectContaining({
        id: "objective-and-subjective-meaning",
        kind: "conflict",
      }),
    ]);
  });

  it("treats the no-self view plus either identity account as an argument, not a flat conflict", () => {
    const withPsych = evaluateBeliefs({
      noPersistentSelf: "affirm",
      psychologicalContinuity: "affirm",
    });
    const withBodySoul = evaluateBeliefs({
      noPersistentSelf: "affirm",
      bodilySoulContinuity: "affirm",
    });

    expect(withPsych).toEqual([
      expect.objectContaining({
        id: "no-self-and-psychological-identity",
        kind: "argument",
        bridge: expect.any(String),
      }),
    ]);
    expect(withBodySoul).toEqual([
      expect.objectContaining({
        id: "no-self-and-body-soul-identity",
        kind: "argument",
        bridge: expect.any(String),
      }),
    ]);
  });

  it("orders findings with conflicts before softer relationships", () => {
    const results = evaluateBeliefs({
      consequencesOnly: "affirm",
      sideConstraints: "affirm",
      noDeity: "affirm",
      moralFacts: "affirm",
    });

    expect(results[0].kind).toBe("conflict");
    expect(results.map((result) => result.kind)).toEqual([
      "conflict",
      "compatible",
    ]);
  });
});
