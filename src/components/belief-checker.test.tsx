import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { BeliefChecker } from "./belief-checker";

// Exact wording of the statements driven through the wizard below.
const perfectGod =
  "A personal God exists who is omniscient, omnipotent, perfectly good, and perfectly loving.";
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
  // The checker persists progress to localStorage; clear it so each test
  // starts from a fresh, empty state.
  window.localStorage.clear();
});

/** Advance the wizard one question, whether or not it was answered. */
async function next(user: ReturnType<typeof userEvent.setup>) {
  await user.click(
    screen.getByRole("button", { name: /Next|Skip for now|Review answers/ }),
  );
}

describe("BeliefChecker", () => {
  it("records a position and a claim, then reports the direct conflict", async () => {
    const user = userEvent.setup();
    render(<BeliefChecker />);

    // Question 1 (free will) and 2 (responsibility) are skipped.
    await next(user);
    await next(user);

    // Question 3: the God topic — select the classical-theism position.
    const godChoice = screen.getByRole("checkbox", {
      name: `A perfect, personal God exists: ${perfectGod}`,
    }) as HTMLInputElement;
    await user.click(godChoice);
    expect(godChoice.checked).toBe(true);
    await next(user);

    // Question 4: the gratuitous-suffering claim.
    await user.click(
      screen.getByRole("radio", {
        name: `Yes — I believe this: ${gratuitousSuffering}`,
      }),
    );

    await user.click(screen.getByRole("button", { name: "Review & finish →" }));
    await user.click(screen.getByRole("button", { name: "See my results" }));

    expect(
      screen.getByRole("heading", { name: "1 direct conflict to examine" }),
    ).toBeDefined();
    expect(
      screen.getByText("Perfect goodness and unjustifiable suffering"),
    ).toBeDefined();
  });

  it("keeps answers when moving to results and back to a question", async () => {
    const user = userEvent.setup();
    render(<BeliefChecker />);

    await next(user);
    await next(user);
    await user.click(
      screen.getByRole("checkbox", {
        name: `A perfect, personal God exists: ${perfectGod}`,
      }),
    );

    await user.click(screen.getByRole("button", { name: "Review & finish →" }));
    await user.click(screen.getByRole("button", { name: "See my results" }));
    await user.click(screen.getByRole("button", { name: "Edit answers" }));

    // The review list shows the selection and links back to the question.
    expect(
      screen.getByText("A perfect, personal God exists"),
    ).toBeDefined();
    await user.click(
      screen.getByRole("button", { name: /God and the divine/ }),
    );

    const restoredChoice = screen.getByRole("checkbox", {
      name: `A perfect, personal God exists: ${perfectGod}`,
    }) as HTMLInputElement;
    expect(restoredChoice.checked).toBe(true);
  });

  it("can finish immediately with everything skipped", async () => {
    const user = userEvent.setup();
    render(<BeliefChecker />);

    await user.click(screen.getByRole("button", { name: "Review & finish →" }));
    expect(
      screen.getByText(/You answered 0 of 18 questions/),
    ).toBeDefined();

    await user.click(screen.getByRole("button", { name: "See my results" }));

    expect(
      screen.getByRole("heading", { name: "No direct conflict detected" }),
    ).toBeDefined();
    expect(
      screen.getByText(
        "You didn't affirm any beliefs yet, so there was nothing to check — only affirmed beliefs become premises.",
      ),
    ).toBeDefined();
  });

  it("warns on deity-dependent questions after atheism and sets qualified answers aside", async () => {
    const user = userEvent.setup();
    render(<BeliefChecker />);

    await next(user);
    await next(user);
    await user.click(
      screen.getByRole("checkbox", {
        name: `No gods of any kind exist: ${noDeity}`,
      }),
    );
    await next(user); // suffering
    await next(user); // hiddenness
    await next(user); // now on foreknowledge

    expect(
      screen.getByText(/You've affirmed that no god or deity exists/),
    ).toBeDefined();

    await user.click(
      screen.getByRole("radio", {
        name: `It's complicated: ${infallibleForeknowledge}`,
      }),
    );

    await user.click(screen.getByRole("button", { name: "Review & finish →" }));
    await user.click(screen.getByRole("button", { name: "See my results" }));

    expect(
      screen.getByRole("heading", { name: "No direct conflict detected" }),
    ).toBeDefined();
    expect(
      screen.queryByText("An infallible divine belief, but no deity to hold it"),
    ).toBeNull();
  });
});
