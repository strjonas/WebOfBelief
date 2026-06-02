import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { BeliefChecker } from "./belief-checker";

const perfectGod =
  "A personal God exists who is omniscient, omnipotent, perfectly good, and perfectly loving.";
const moralFacts =
  "At least some moral facts are true regardless of what any person or society approves.";
const gratuitousSuffering =
  "Some suffering exists that no omniscient, omnipotent, perfectly good being could have morally sufficient reason to permit.";
const noDeity = "No god or deity exists.";
const infallibleForeknowledge =
  "Before a human choice occurs, an infallible divine belief already correctly specifies that exact choice.";

beforeAll(() => {
  Object.defineProperty(window, "requestAnimationFrame", {
    configurable: true,
    value: (callback: FrameRequestCallback) => {
      callback(0);
      return 1;
    },
  });
  Element.prototype.scrollIntoView = vi.fn();
});

afterEach(() => {
  cleanup();
  // The checker now persists progress to localStorage; clear it so each test
  // starts from a fresh, empty state.
  window.localStorage.clear();
});

describe("BeliefChecker", () => {
  it("records visible radio selections and displays a direct conflict", async () => {
    const user = userEvent.setup();
    render(<BeliefChecker />);

    // God topics no longer lead; open that topic before answering them.
    await user.click(
      screen.getByRole("button", { name: "God and evidence. 0 of 6 answered." }),
    );

    const godChoice = screen.getByRole("radio", {
      name: `I believe this: ${perfectGod}`,
    }) as HTMLInputElement;
    const sufferingChoice = screen.getByRole("radio", {
      name: `I believe this: ${gratuitousSuffering}`,
    }) as HTMLInputElement;

    await user.click(godChoice);
    await user.click(sufferingChoice);

    expect(godChoice.checked).toBe(true);
    expect(sufferingChoice.checked).toBe(true);
    expect(screen.getByText("2 of 23 answered")).toBeDefined();

    await user.click(
      screen.getByRole("button", { name: "Check affirmed beliefs" }),
    );

    expect(
      screen.getByRole("heading", { name: "1 direct conflict to examine" }),
    ).toBeDefined();
    expect(
      screen.getByText("Perfect goodness and unjustifiable suffering"),
    ).toBeDefined();
  });

  it("keeps answers while navigating between topics", async () => {
    const user = userEvent.setup();
    render(<BeliefChecker />);

    await user.click(
      screen.getByRole("radio", {
        name: `I believe this: ${moralFacts}`,
      }),
    );
    await user.click(
      screen.getByRole("button", {
        name: "Next topic: Freedom and responsibility (optional)",
      }),
    );

    expect(
      screen.getByRole("heading", { name: "Freedom and responsibility" }),
    ).toBeDefined();

    await user.click(
      screen.getByRole("button", {
        name: "Morality and meaning. 1 of 6 answered.",
      }),
    );

    const restoredChoice = screen.getByRole("radio", {
      name: `I believe this: ${moralFacts}`,
    }) as HTMLInputElement;
    expect(restoredChoice.checked).toBe(true);
  });

  it("can evaluate immediately with skipped statements treated as not sure", async () => {
    const user = userEvent.setup();
    render(<BeliefChecker />);

    const reviewButton = screen.getByRole("button", {
      name: "Check affirmed beliefs",
    }) as HTMLButtonElement;

    expect(reviewButton.disabled).toBe(false);
    await user.click(reviewButton);

    expect(
      screen.getByRole("heading", { name: "No direct conflict detected" }),
    ).toBeDefined();
    expect(
      screen.getByText(
        "Checked 0 beliefs you affirmed as true. This check treats 23 unselected statements as Not sure. Results report relationships in the rule set; they do not prove your complete worldview coherent or incoherent.",
      ),
    ).toBeDefined();
  });

  it("explains deity-dependent statements after atheism and ignores qualified hypotheticals", async () => {
    const user = userEvent.setup();
    render(<BeliefChecker />);

    await user.click(
      screen.getByRole("button", { name: "God and evidence. 0 of 6 answered." }),
    );

    await user.click(
      screen.getByRole("radio", {
        name: `I believe this: ${noDeity}`,
      }),
    );

    expect(
      screen.getAllByText(
        /You have already affirmed that no god or deity exists/,
      ),
    ).not.toHaveLength(0);

    await user.click(
      screen.getByRole("radio", {
        name: `Conditional / qualify: ${infallibleForeknowledge}`,
      }),
    );

    await user.click(
      screen.getByRole("button", { name: "Check affirmed beliefs" }),
    );

    expect(
      screen.getByRole("heading", { name: "No direct conflict detected" }),
    ).toBeDefined();
    expect(
      screen.queryByText("An infallible divine belief, but no deity to hold it"),
    ).toBeNull();
  });
});
