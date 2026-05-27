import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { BeliefChecker } from "./belief-checker";

const perfectGod =
  "A personal God exists who is omniscient, omnipotent, perfectly good, and perfectly loving.";
const gratuitousSuffering =
  "Some suffering exists that no omniscient, omnipotent, perfectly good being could have morally sufficient reason to permit.";

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
});

describe("BeliefChecker", () => {
  it("records visible radio selections and displays a direct conflict", async () => {
    const user = userEvent.setup();
    render(<BeliefChecker />);

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
    expect(screen.getByText("2 of 22 answered")).toBeDefined();
    expect(screen.getAllByText("Recorded: I believe this.")).toHaveLength(2);

    await user.click(
      screen.getByRole("button", { name: "Check selected beliefs" }),
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
        name: `I believe this: ${perfectGod}`,
      }),
    );
    await user.click(
      screen.getByRole("button", {
        name: "Next topic: Morality and meaning (optional)",
      }),
    );

    expect(
      screen.getByRole("heading", { name: "Morality and meaning" }),
    ).toBeDefined();

    await user.click(
      screen.getByRole("button", {
        name: "God and evidence. 1 of 6 answered.",
      }),
    );

    const restoredChoice = screen.getByRole("radio", {
      name: `I believe this: ${perfectGod}`,
    }) as HTMLInputElement;
    expect(restoredChoice.checked).toBe(true);
  });

  it("can evaluate immediately with skipped statements treated as not sure", async () => {
    const user = userEvent.setup();
    render(<BeliefChecker />);

    const reviewButton = screen.getByRole("button", {
      name: "Check selected beliefs",
    }) as HTMLButtonElement;

    expect(reviewButton.disabled).toBe(false);
    await user.click(reviewButton);

    expect(
      screen.getByRole("heading", { name: "No direct conflict detected" }),
    ).toBeDefined();
    expect(
      screen.getByText(
        "Checked 0 beliefs you selected as true. This check treats 22 unselected statements as Not sure. Results report relationships in the rule set; they do not prove your complete worldview coherent or incoherent.",
      ),
    ).toBeDefined();
  });
});
