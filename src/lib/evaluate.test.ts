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
});
