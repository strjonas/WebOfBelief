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
