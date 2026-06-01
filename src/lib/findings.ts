import type { FindingKind } from "./evaluate";

/**
 * Single source of truth for how each finding kind is presented — labels,
 * glyphs, Tailwind accent classes, and raw hex (for the SVG diagram and the
 * canvas badge, which can't read CSS variables).
 *
 * The hex values here MUST stay in sync with the matching tokens in
 * globals.css (`--color-mark`, `--color-indigo-ink`, `--color-amber-ink`,
 * `--color-forest`). Tailwind class names use those tokens; SVG/canvas use the
 * hex below. Change both together.
 */

export const findingLabels: Record<FindingKind, string> = {
  conflict: "Direct conflict",
  argument: "Live argument",
  implication: "Conditional implication",
  compatible: "Coherent combination",
};

export const findingMarks: Record<FindingKind, string> = {
  conflict: "⊥",
  implication: "⊢",
  argument: "‡",
  compatible: "≈",
};

export const findingAccents: Record<FindingKind, { rule: string; ink: string }> =
  {
    conflict: { rule: "border-mark", ink: "text-mark" },
    implication: { rule: "border-indigo-ink", ink: "text-indigo-ink" },
    argument: { rule: "border-amber-ink", ink: "text-amber-ink" },
    compatible: { rule: "border-forest", ink: "text-forest" },
  };

export const findingHex: Record<FindingKind, string> = {
  conflict: "#7a1f1d", // mark — oxblood
  implication: "#33419b", // indigo
  argument: "#9a6515", // amber
  compatible: "#2f6b43", // forest
};

/**
 * Node colors for the belief web. Single-user mode fills affirmed nodes in the
 * mark color; compare mode colors by who affirms (both / sharer / viewer).
 */
export const webColors = {
  affirmed: "#7a1f1d", // mark
  nodeIdle: "#ece9e0", // paper
  nodeStroke: "#11131a", // ink
  compareBoth: findingHex.compatible, // both affirm → calm forest
  compareSharer: findingHex.conflict, // only the sharer (A) → oxblood
  compareViewer: findingHex.implication, // only the viewer (B) → indigo
} as const;
