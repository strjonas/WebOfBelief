import { describe, expect, it } from "vitest";
import { beliefStatements, statementById } from "./beliefs";
import { checkSteps, stepStatementIds } from "./check-flow";

describe("check flow", () => {
  it("asks about every statement exactly once", () => {
    const asked = checkSteps.flatMap(stepStatementIds);
    expect(asked.length).toBe(new Set(asked).size);
    expect(new Set(asked)).toEqual(
      new Set(beliefStatements.map((statement) => statement.id)),
    );
  });

  it("keeps each step within a single category, matching its statements", () => {
    for (const step of checkSteps) {
      for (const id of stepStatementIds(step)) {
        expect(statementById[id].category).toBe(step.category);
      }
    }
  });

  it("groups every positions step around at least two positions", () => {
    for (const step of checkSteps) {
      if (step.kind === "positions") {
        expect(step.positions.length).toBeGreaterThanOrEqual(2);
      }
    }
  });
});
