import { describe, expect, it } from "vitest";
import {
  MAX_TEXT_LENGTH,
  MIN_TEXT_LENGTH,
  normalizeFeedback,
} from "./feedback-shape";

const known = (id: string) => id === "perfectGod" || id === "determinism";

describe("normalizeFeedback", () => {
  it("accepts a general message and drops any beliefId", () => {
    const result = normalizeFeedback(
      { kind: "general", beliefId: "perfectGod", text: "Add a question on X" },
      known,
    );

    expect(result).toEqual({
      kind: "general",
      beliefId: null,
      text: "Add a question on X",
    });
  });

  it("keeps the beliefId for a per-statement kind when it is known", () => {
    const result = normalizeFeedback(
      { kind: "rephrase", beliefId: "determinism", text: "Wording is unclear" },
      known,
    );

    expect(result).toEqual({
      kind: "rephrase",
      beliefId: "determinism",
      text: "Wording is unclear",
    });
  });

  it("rejects a per-statement kind with an unknown or missing beliefId", () => {
    expect(
      normalizeFeedback(
        { kind: "missing-position", beliefId: "nope", text: "hi there" },
        known,
      ),
    ).toBeNull();
    expect(
      normalizeFeedback({ kind: "rephrase", text: "hi there" }, known),
    ).toBeNull();
  });

  it("trims text and rejects messages that are empty or too short", () => {
    expect(
      normalizeFeedback({ kind: "general", text: "   " }, known),
    ).toBeNull();
    expect(
      normalizeFeedback(
        { kind: "general", text: "x".repeat(MIN_TEXT_LENGTH - 1) },
        known,
      ),
    ).toBeNull();
    expect(
      normalizeFeedback({ kind: "general", text: "  ok  " }, known),
    ).toEqual({ kind: "general", beliefId: null, text: "ok" });
  });

  it("clamps an over-long message instead of rejecting it", () => {
    const result = normalizeFeedback(
      { kind: "general", text: "y".repeat(MAX_TEXT_LENGTH + 500) },
      known,
    );

    expect(result?.text).toHaveLength(MAX_TEXT_LENGTH);
  });

  it("rejects unknown kinds and non-object bodies", () => {
    expect(
      normalizeFeedback({ kind: "spam", text: "hello" }, known),
    ).toBeNull();
    expect(normalizeFeedback(null, known)).toBeNull();
    expect(normalizeFeedback("nope", known)).toBeNull();
    expect(
      normalizeFeedback({ kind: "general", text: 42 }, known),
    ).toBeNull();
  });
});
