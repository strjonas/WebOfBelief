import { describe, expect, it } from "vitest";
import { beliefStatements, type Answer, type BeliefId } from "./beliefs";
import type { AnswerMap } from "./evaluate";
import {
  decodeAnswers,
  encodeAnswers,
  SHARE_CODE_ORDER_V1,
  SHARE_CODE_VERSION,
} from "./share-code";

describe("share-code frozen order", () => {
  it("stays in lockstep with the belief set (add/remove a statement and this fails loudly)", () => {
    const fromBeliefs = [...beliefStatements.map((s) => s.id)].sort();
    const fromOrder = [...SHARE_CODE_ORDER_V1].sort();
    expect(fromOrder).toEqual(fromBeliefs);
  });

  it("has no duplicates", () => {
    expect(new Set(SHARE_CODE_ORDER_V1).size).toBe(SHARE_CODE_ORDER_V1.length);
  });
});

describe("encode / decode round-trip", () => {
  it("round-trips a mixed answer map (reject and qualify preserved)", () => {
    const answers: AnswerMap = {
      perfectGod: "affirm",
      noDeity: "reject",
      determinism: "affirm",
      responsibilityWithoutAlternatives: "reject",
      infallibleForeknowledge: "qualify",
    };
    const decoded = decodeAnswers(encodeAnswers(answers));
    expect(decoded).toEqual({ ok: true, answers });
  });

  it("collapses unsure and unanswered to the same 'open' (documented lossy step)", () => {
    const withUnsure: AnswerMap = { perfectGod: "affirm", noDeity: "unsure" };
    const decoded = decodeAnswers(encodeAnswers(withUnsure));
    // noDeity drops out: unsure is indistinguishable from never-answered.
    expect(decoded).toEqual({ ok: true, answers: { perfectGod: "affirm" } });
  });

  it("round-trips the empty map", () => {
    expect(decodeAnswers(encodeAnswers({}))).toEqual({ ok: true, answers: {} });
  });

  it("round-trips an all-affirmed map", () => {
    const all: AnswerMap = {};
    for (const s of beliefStatements) all[s.id] = "affirm";
    expect(decodeAnswers(encodeAnswers(all))).toEqual({ ok: true, answers: all });
  });

  it("produces a short code (8 chars of payload for 22 statements)", () => {
    const all: AnswerMap = {};
    for (const s of beliefStatements) all[s.id] = "qualify";
    const code = encodeAnswers(all);
    expect(code.startsWith(`v${SHARE_CODE_VERSION}.`)).toBe(true);
    expect(code.split(".")[1].length).toBeLessThanOrEqual(8);
  });

  it("fuzz: 500 random maps survive a round-trip", () => {
    const answerKinds: Array<Answer | undefined> = [
      "affirm",
      "reject",
      "qualify",
      undefined, // treated as open
    ];
    for (let n = 0; n < 500; n += 1) {
      const answers: AnswerMap = {};
      for (const s of beliefStatements) {
        const pick = answerKinds[Math.floor(Math.random() * answerKinds.length)];
        if (pick) answers[s.id as BeliefId] = pick;
      }
      const decoded = decodeAnswers(encodeAnswers(answers));
      expect(decoded).toEqual({ ok: true, answers });
    }
  });
});

describe("decode validation", () => {
  it("rejects malformed strings", () => {
    for (const bad of ["", "nope", "v1", "v1.", "1.AAAA", "v1.!!!", "v1.A B"]) {
      expect(decodeAnswers(bad).ok).toBe(false);
      if (!decodeAnswers(bad).ok) {
        expect((decodeAnswers(bad) as { reason: string }).reason).toBe("format");
      }
    }
  });

  it("reports a version mismatch distinctly so the UI can explain it", () => {
    const code = encodeAnswers({ perfectGod: "affirm" });
    const futureCode = code.replace(/^v\d+\./, "v99.");
    expect(decodeAnswers(futureCode)).toEqual({ ok: false, reason: "version" });
  });

  it("tolerates surrounding whitespace", () => {
    const code = encodeAnswers({ moralFacts: "affirm" });
    expect(decodeAnswers(`  ${code}  `)).toEqual({
      ok: true,
      answers: { moralFacts: "affirm" },
    });
  });
});
