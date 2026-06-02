import { categories, statementById, type Answer, type BeliefId } from "./beliefs";
import type { AnswerMap } from "./evaluate";

// Persist in-progress answers on the visitor's own device so an accidental
// reload doesn't wipe their work, and so the compare page can reuse a web the
// visitor already built without making them paste a link. Versioned so a future
// schema change can be ignored safely. Cleared only on "Start over". Nothing
// here is ever sent to a server — this is purely local convenience.
export const ANSWER_STORAGE_KEY = "wob:state:v1";

const validAnswers = new Set<Answer>([
  "affirm",
  "reject",
  "unsure",
  "qualify",
]);

export interface PersistedState {
  answers: AnswerMap;
  topicIndex: number;
  // Whether the visitor has clicked "Check" and seen their results, vs. only
  // started answering. Lets callers tell a finished web from an exploratory one.
  showResults: boolean;
}

/** Read and validate the saved check state from localStorage, or null. */
export function loadPersistedState(): PersistedState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(ANSWER_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<PersistedState>;
    const answers: AnswerMap = {};
    if (parsed.answers && typeof parsed.answers === "object") {
      for (const [id, value] of Object.entries(parsed.answers)) {
        // Only restore known statement ids with valid answer values.
        if (id in statementById && validAnswers.has(value as Answer)) {
          answers[id as BeliefId] = value as Answer;
        }
      }
    }
    const maxTopic = categories.length - 1;
    const topicIndex =
      typeof parsed.topicIndex === "number"
        ? Math.min(Math.max(0, Math.trunc(parsed.topicIndex)), maxTopic)
        : 0;
    return {
      answers,
      topicIndex,
      showResults: parsed.showResults === true,
    };
  } catch {
    return null;
  }
}

/** Persist the current check state. Never throws (private mode / quota). */
export function savePersistedState(state: PersistedState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(ANSWER_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Private mode / quota exceeded — never break the app.
  }
}

/** Forget any saved state ("Start over"). */
export function clearPersistedState(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(ANSWER_STORAGE_KEY);
  } catch {
    // Ignore — nothing to clean up if storage is unavailable.
  }
}
