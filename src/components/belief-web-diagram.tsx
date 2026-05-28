import type { BeliefId } from "@/lib/beliefs";
import type { FindingKind } from "@/lib/evaluate";

interface NodePos {
  id: BeliefId;
  x: number;
  y: number;
  short: string;
}

interface ClusterLabel {
  text: string;
  x: number;
  y: number;
  anchor: "start" | "middle" | "end";
}

// Hand-placed positions so the diagram reads as a real web,
// not a force-directed blob. Designed for a 480 × 360 viewBox.
const nodes: NodePos[] = [
  // God & evidence (upper-left cluster)
  { id: "perfectGod", x: 86, y: 64, short: "God" },
  { id: "noDeity", x: 38, y: 124, short: "no deity" },
  { id: "gratuitousSuffering", x: 138, y: 30, short: "evil" },
  { id: "nonresistantNonbelief", x: 160, y: 88, short: "hiddenness" },
  { id: "infallibleForeknowledge", x: 110, y: 158, short: "foreknown" },
  { id: "beliefNeedsEvidence", x: 44, y: 188, short: "evidence" },
  // Morality & meaning (right cluster)
  { id: "moralFacts", x: 256, y: 60, short: "mind-indep." },
  { id: "attitudeOnlyMorality", x: 354, y: 38, short: "attitudes only" },
  { id: "divineCommandOnly", x: 244, y: 126, short: "command-only" },
  { id: "independentDuty", x: 348, y: 116, short: "indep. duty" },
  { id: "naturalMeaning", x: 274, y: 200, short: "finite meaning" },
  { id: "meaningNeedsTranscendent", x: 372, y: 198, short: "needs transc." },
  // Freedom (mid-low)
  { id: "determinism", x: 172, y: 232, short: "determined" },
  { id: "samePastAlternative", x: 96, y: 268, short: "alt. open" },
  { id: "responsibilityWithoutAlternatives", x: 168, y: 310, short: "responsibility" },
  // Mind (lower-right)
  { id: "physicalClosure", x: 280, y: 282, short: "physical" },
  { id: "zombieWorld", x: 360, y: 298, short: "zombie" },
  // Right action & animals (low-left)
  { id: "consequencesOnly", x: 30, y: 252, short: "consequences" },
  { id: "sideConstraints", x: 30, y: 310, short: "constraints" },
  { id: "animalsMatter", x: 422, y: 78, short: "animals" },
  { id: "minorConvenienceHarmWrong", x: 432, y: 138, short: "no harm" },
  { id: "factoryFarmPermissible", x: 422, y: 250, short: "permitted" },
];

const nodeById = new Map(nodes.map((n) => [n.id, n]));

interface Edge {
  a: BeliefId;
  b: BeliefId;
  kind: FindingKind;
}

// Mirrors src/lib/evaluate.ts rules: every edge here is an actual
// relationship the engine checks.
const edges: Edge[] = [
  { a: "perfectGod", b: "noDeity", kind: "conflict" },
  { a: "perfectGod", b: "gratuitousSuffering", kind: "conflict" },
  { a: "moralFacts", b: "attitudeOnlyMorality", kind: "conflict" },
  { a: "divineCommandOnly", b: "independentDuty", kind: "conflict" },
  { a: "naturalMeaning", b: "meaningNeedsTranscendent", kind: "conflict" },
  { a: "determinism", b: "samePastAlternative", kind: "conflict" },
  { a: "physicalClosure", b: "zombieWorld", kind: "conflict" },
  { a: "consequencesOnly", b: "sideConstraints", kind: "conflict" },
  { a: "infallibleForeknowledge", b: "noDeity", kind: "conflict" },
  // implication forks
  { a: "noDeity", b: "meaningNeedsTranscendent", kind: "implication" },
  { a: "noDeity", b: "divineCommandOnly", kind: "implication" },
  // live arguments
  { a: "perfectGod", b: "nonresistantNonbelief", kind: "argument" },
  { a: "infallibleForeknowledge", b: "samePastAlternative", kind: "argument" },
  { a: "determinism", b: "responsibilityWithoutAlternatives", kind: "argument" },
  { a: "beliefNeedsEvidence", b: "perfectGod", kind: "argument" },
  { a: "minorConvenienceHarmWrong", b: "factoryFarmPermissible", kind: "argument" },
  { a: "animalsMatter", b: "factoryFarmPermissible", kind: "argument" },
  // coherent combinations
  { a: "perfectGod", b: "moralFacts", kind: "compatible" },
  { a: "noDeity", b: "moralFacts", kind: "compatible" },
  { a: "noDeity", b: "naturalMeaning", kind: "compatible" },
];

const clusterLabels: ClusterLabel[] = [
  { text: "i. god & evidence", x: 16, y: 18, anchor: "start" },
  { text: "ii. morality & meaning", x: 464, y: 18, anchor: "end" },
  { text: "iii. freedom", x: 16, y: 350, anchor: "start" },
  { text: "iv. mind", x: 320, y: 350, anchor: "start" },
  { text: "v. right action", x: 464, y: 350, anchor: "end" },
];

// Pure colors (no Tailwind variables) so the SVG can be inlined
// without depending on cascade — used in the badge canvas later too.
const edgeColor: Record<FindingKind, string> = {
  conflict: "#7a1f1d",
  implication: "#2b3672",
  argument: "#8a5a14",
  compatible: "#2d4a36",
};

const edgeDash: Record<FindingKind, string> = {
  conflict: "0",
  implication: "0",
  argument: "4 3",
  compatible: "1.5 3",
};

export interface BeliefWebDiagramProps {
  /** Beliefs the viewer affirmed. Filled in mark color. */
  affirmed?: ReadonlySet<BeliefId>;
  /** Specific edges that actually fired — those are highlighted, others fade. */
  triggeredEdges?: ReadonlyArray<readonly [BeliefId, BeliefId]>;
  /** Hide written labels for the small share-badge use. */
  showLabels?: boolean;
  /** Hide cluster legend, for tighter panels. */
  showClusters?: boolean;
  /** Decorative variant: muted ink only, no rule-kind colors. */
  decorative?: boolean;
  className?: string;
  /** Optional aria label override. */
  title?: string;
}

function edgeKey(a: BeliefId, b: BeliefId) {
  return a < b ? `${a}|${b}` : `${b}|${a}`;
}

export function BeliefWebDiagram({
  affirmed,
  triggeredEdges,
  showLabels = true,
  showClusters = true,
  decorative = false,
  className,
  title = "A diagram of the belief web this tool checks. Twenty-two statements are connected by edges representing direct conflicts, logical implications, live arguments, and coherent combinations.",
}: BeliefWebDiagramProps) {
  const triggered = triggeredEdges
    ? new Set<string>(triggeredEdges.map(([a, b]) => edgeKey(a, b)))
    : null;

  return (
    <svg
      role="img"
      aria-label={title}
      viewBox="0 0 480 360"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>

      {/* Cluster labels (publication style) */}
      {showClusters
        ? clusterLabels.map((c) => (
            <text
              key={c.text}
              x={c.x}
              y={c.y}
              textAnchor={c.anchor}
              fontFamily="var(--font-mono), ui-monospace, monospace"
              fontSize="7.2"
              fill="#545860"
              style={{ letterSpacing: "0.14em" }}
            >
              {c.text.toUpperCase()}
            </text>
          ))
        : null}

      {/* Edges drawn first so nodes sit on top */}
      {edges.map((edge) => {
        const a = nodeById.get(edge.a);
        const b = nodeById.get(edge.b);
        if (!a || !b) return null;
        const isHighlighted = !triggered || triggered.has(edgeKey(edge.a, edge.b));
        const stroke = decorative ? "#545860" : edgeColor[edge.kind];
        const dash = decorative ? "0" : edgeDash[edge.kind];
        return (
          <line
            key={`${edge.a}-${edge.b}-${edge.kind}`}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            stroke={stroke}
            strokeWidth={isHighlighted ? 1 : 0.6}
            strokeDasharray={dash}
            opacity={isHighlighted ? 0.78 : 0.18}
            strokeLinecap="round"
          />
        );
      })}

      {/* Nodes */}
      {nodes.map((n) => {
        const isAffirmed = affirmed?.has(n.id) ?? false;
        const fill = isAffirmed ? "#7a1f1d" : "#ece9e0";
        const stroke = isAffirmed ? "#7a1f1d" : "#11131a";
        return (
          <g key={n.id}>
            <circle
              cx={n.x}
              cy={n.y}
              r={isAffirmed ? 4 : 3.2}
              fill={fill}
              stroke={stroke}
              strokeWidth={1.1}
            />
            {showLabels ? (
              <text
                x={n.x + 6}
                y={n.y + 2.6}
                fontFamily="var(--font-mono), ui-monospace, monospace"
                fontSize="6.5"
                fill="#11131a"
                opacity={isAffirmed ? 1 : 0.72}
                style={{ letterSpacing: "0.02em" }}
              >
                {n.short}
              </text>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}

export const beliefWebDiagramNodes = nodes;
export const beliefWebDiagramEdges = edges;
