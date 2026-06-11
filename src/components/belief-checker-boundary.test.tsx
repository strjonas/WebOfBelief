import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { BeliefCheckerBoundary } from "./belief-checker-boundary";

function BrokenChecker(): never {
  throw new Error("boom");
}

describe("BeliefCheckerBoundary", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });

  it("shows a fallback instead of white-screening the page", () => {
    render(
      <BeliefCheckerBoundary>
        <BrokenChecker />
      </BeliefCheckerBoundary>,
    );

    expect(
      screen.getByRole("heading", {
        name: "The checker hit an unexpected client-side error.",
      }),
    ).toBeDefined();
    expect(
      screen.getByRole("link", { name: "Read method & sources" }),
    ).toBeDefined();
    expect(
      screen.getByRole("link", { name: "Read method & sources" }).getAttribute(
        "href",
      ),
    ).toBe("/method");
  });

  it("can retry after an error", async () => {
    const user = userEvent.setup();
    let shouldThrow = true;

    function FlakyChecker() {
      if (shouldThrow) {
        throw new Error("boom");
      }
      return <p>Checker recovered</p>;
    }

    render(
      <BeliefCheckerBoundary>
        <FlakyChecker />
      </BeliefCheckerBoundary>,
    );

    shouldThrow = false;
    await user.click(screen.getByRole("button", { name: "Retry the check" }));

    expect(await screen.findByText("Checker recovered")).toBeDefined();
  });
});
