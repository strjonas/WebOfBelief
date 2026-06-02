"use client";

import { useMemo, useRef, useState } from "react";
import type { BeliefId, BeliefCategoryId } from "@/lib/beliefs";
import { statementById } from "@/lib/beliefs";
import type { Finding, FindingKind } from "@/lib/evaluate";
import { findingBeliefs } from "@/lib/evaluate";
import { findingHex, findingLabels, webColors } from "@/lib/findings";
import {
  beliefWebDiagramEdges,
  beliefWebDiagramNodes,
} from "./belief-web-diagram";

const edgeDash: Record<FindingKind, string> = {
  conflict: "0",
  implication: "0",
  argument: "5 3",
  compatible: "2 3",
};

const clusterLabel: Record<BeliefCategoryId, string> = {
  religion: "God & evidence",
  value: "Morality & meaning",
  freedom: "Freedom",
  mind: "Mind",
  practice: "Right action",
};

const nodeById = new Map(beliefWebDiagramNodes.map((n) => [n.id, n]));

function edgeKey(a: BeliefId, b: BeliefId) {
  return a < b ? `${a}|${b}` : `${b}|${a}`;
}

interface Relation {
  other: BeliefId;
  kind: FindingKind;
  triggered: boolean;
}

export interface InteractiveBeliefWebProps {
  affirmed: ReadonlySet<BeliefId>;
  /** Edges that actually fired given the viewer's answers. */
  triggered: ReadonlyArray<readonly [BeliefId, BeliefId]>;
  /**
   * The fired findings, so a hovered/tapped edge can read out *why* the two
   * beliefs pull against each other and link down to the full comparison.
   */
  findings: ReadonlyArray<Finding>;
  className?: string;
}

export function InteractiveBeliefWeb({
  affirmed,
  triggered,
  findings,
  className,
}: InteractiveBeliefWebProps) {
  const [hoveredId, setHoveredId] = useState<BeliefId | null>(null);
  const [selectedId, setSelectedId] = useState<BeliefId | null>(null);
  const [hoveredKind, setHoveredKind] = useState<FindingKind | null>(null);
  // Cursor position (relative to the wrapper) for the floating readout that
  // travels with the pointer — so the details are right where the eye is,
  // not stranded in the panel below a tall diagram.
  const [pointer, setPointer] = useState<{ x: number; y: number; w: number } | null>(
    null,
  );
  // An edge the viewer is pointing at (hover) or has tapped open (pinned), so a
  // line's overlay can name the tension and link to the full comparison below.
  const [hoveredEdge, setHoveredEdge] = useState<string | null>(null);
  const [pinnedEdge, setPinnedEdge] = useState<string | null>(null);
  const [pinnedPos, setPinnedPos] = useState<{ x: number; y: number; w: number } | null>(
    null,
  );
  const wrapRef = useRef<HTMLDivElement>(null);

  const posFromEvent = (event: { clientX: number; clientY: number }) => {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return null;
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      w: rect.width,
    };
  };
  const updatePointer = (event: { clientX: number; clientY: number }) => {
    const pos = posFromEvent(event);
    if (pos) setPointer(pos);
  };

  // Map each fired edge to the finding that explains it, so the line itself
  // can surface the gist. Keyed the same way as triggeredSet.
  const findingByEdge = useMemo(() => {
    const map = new Map<string, Finding>();
    for (const finding of findings) {
      const beliefs = findingBeliefs(finding);
      if (beliefs.length >= 2) map.set(edgeKey(beliefs[0], beliefs[1]), finding);
    }
    return map;
  }, [findings]);

  const scrollToFinding = (id: string) => {
    setPinnedEdge(null);
    const el = document.getElementById(`finding-${id}`);
    // The finding card is a collapsible <details>; open it before scrolling so
    // the explanation is visible on arrival, not folded shut.
    if (el instanceof HTMLDetailsElement) el.open = true;
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const triggeredSet = useMemo(
    () => new Set(triggered.map(([a, b]) => edgeKey(a, b))),
    [triggered],
  );

  // Adjacency: every relationship each belief participates in, with whether
  // it fired given the current answers. Lets the detail panel read the web
  // out in plain language instead of leaving it to the eye.
  const relationsById = useMemo(() => {
    const map = new Map<BeliefId, Relation[]>();
    for (const edge of beliefWebDiagramEdges) {
      const triggeredEdge = triggeredSet.has(edgeKey(edge.a, edge.b));
      const push = (from: BeliefId, to: BeliefId) => {
        const list = map.get(from) ?? [];
        list.push({ other: to, kind: edge.kind, triggered: triggeredEdge });
        map.set(from, list);
      };
      push(edge.a, edge.b);
      push(edge.b, edge.a);
    }
    return map;
  }, [triggeredSet]);

  // Count of fired edges per kind, for the legend.
  const triggeredByKind = useMemo(() => {
    const counts: Record<FindingKind, number> = {
      conflict: 0,
      implication: 0,
      argument: 0,
      compatible: 0,
    };
    for (const edge of beliefWebDiagramEdges) {
      if (triggeredSet.has(edgeKey(edge.a, edge.b))) counts[edge.kind] += 1;
    }
    return counts;
  }, [triggeredSet]);

  const activeId = selectedId ?? hoveredId;
  const neighborIds = useMemo(() => {
    if (!activeId) return null;
    const set = new Set<BeliefId>([activeId]);
    for (const rel of relationsById.get(activeId) ?? []) set.add(rel.other);
    return set;
  }, [activeId, relationsById]);

  const selectNode = (id: BeliefId) =>
    setSelectedId((prev) => (prev === id ? null : id));

  // The edge currently spotlighted: a pinned tap wins over a passing hover.
  const activeEdgeKey = pinnedEdge ?? hoveredEdge;
  const activeEdgeEnds = useMemo(
    () => (activeEdgeKey ? new Set(activeEdgeKey.split("|")) : null),
    [activeEdgeKey],
  );
  const activeEdgeFinding = activeEdgeKey
    ? findingByEdge.get(activeEdgeKey) ?? null
    : null;

  return (
    <div ref={wrapRef} className={`relative ${className ?? ""}`}>
      <svg
        viewBox="0 0 480 372"
        className="block h-auto w-full touch-none select-none"
        xmlns="http://www.w3.org/2000/svg"
        role="group"
        aria-label="Interactive map of your beliefs and how they relate. Hover or tap a belief to trace its connections."
        onMouseLeave={() => {
          setHoveredId(null);
          setHoveredEdge(null);
          setPointer(null);
        }}
      >
        {/* Click anywhere empty to release a pinned node or edge. */}
        <rect
          x="0"
          y="0"
          width="480"
          height="372"
          fill="transparent"
          onClick={() => {
            setSelectedId(null);
            setPinnedEdge(null);
          }}
        />

        {/* Cluster labels */}
        {(
          [
            ["religion", 14, 16, "start"],
            ["value", 466, 16, "end"],
            ["freedom", 14, 366, "start"],
            ["mind", 252, 366, "start"],
            ["practice", 466, 366, "end"],
          ] as const
        ).map(([cat, x, y, anchor]) => (
          <text
            key={cat}
            x={x}
            y={y}
            textAnchor={anchor}
            fontFamily="var(--font-mono), ui-monospace, monospace"
            fontSize="7.2"
            fill="#545860"
            opacity={activeId ? 0.4 : 0.85}
            style={{ letterSpacing: "0.14em" }}
          >
            {clusterLabel[cat].toUpperCase()}
          </text>
        ))}

        {/* Edges */}
        {beliefWebDiagramEdges.map((edge) => {
          const a = nodeById.get(edge.a);
          const b = nodeById.get(edge.b);
          if (!a || !b) return null;
          const key = edgeKey(edge.a, edge.b);
          const fired = triggeredSet.has(key);
          const touchesActive =
            activeId === edge.a || activeId === edge.b;

          let opacity: number;
          let width: number;
          if (activeEdgeKey) {
            const isThis = key === activeEdgeKey;
            opacity = isThis ? 0.98 : 0.05;
            width = isThis ? 2.1 : 0.5;
          } else if (activeId) {
            opacity = touchesActive ? 0.95 : 0.05;
            width = touchesActive ? 1.6 : 0.5;
          } else if (hoveredKind) {
            opacity = edge.kind === hoveredKind ? 0.95 : 0.06;
            width = edge.kind === hoveredKind ? 1.6 : 0.5;
          } else {
            opacity = fired ? 0.82 : 0.14;
            width = fired ? 1.4 : 0.6;
          }

          return (
            <line
              key={`${edge.a}-${edge.b}-${edge.kind}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke={findingHex[edge.kind]}
              strokeWidth={width}
              strokeDasharray={edgeDash[edge.kind]}
              opacity={opacity}
              strokeLinecap="round"
              className="transition-[opacity,stroke-width] duration-150"
            />
          );
        })}

        {/* Wide, invisible hit targets over the fired edges, so a line can be
            hovered or tapped to open its explanation. Drawn above the visible
            edges but below the nodes, so node hits still win near endpoints. */}
        {beliefWebDiagramEdges.map((edge) => {
          const key = edgeKey(edge.a, edge.b);
          if (!findingByEdge.has(key)) return null;
          const a = nodeById.get(edge.a);
          const b = nodeById.get(edge.b);
          if (!a || !b) return null;
          return (
            <line
              key={`hit-${key}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke="transparent"
              strokeWidth={8}
              strokeLinecap="round"
              style={{ cursor: "pointer" }}
              onMouseEnter={(e) => {
                setHoveredEdge(key);
                setHoveredId(null);
                updatePointer(e);
              }}
              onMouseMove={updatePointer}
              onMouseLeave={() => setHoveredEdge(null)}
              onClick={(e) => {
                e.stopPropagation();
                if (pinnedEdge === key) {
                  setPinnedEdge(null);
                  return;
                }
                setPinnedEdge(key);
                setPinnedPos(posFromEvent(e));
              }}
            />
          );
        })}

        {/* Nodes */}
        {beliefWebDiagramNodes.map((n) => {
          const isAffirmed = affirmed.has(n.id);
          const isActive = activeId === n.id;
          const isNeighbor = neighborIds?.has(n.id) ?? false;
          const onActiveEdge = activeEdgeEnds?.has(n.id) ?? false;
          const dim =
            (activeId !== null && !isNeighbor) ||
            (activeEdgeKey !== null && !onActiveEdge);

          const fill = isAffirmed ? webColors.affirmed : webColors.nodeIdle;
          const stroke = isAffirmed ? webColors.affirmed : webColors.nodeStroke;
          const radius = isActive ? 5.5 : isAffirmed ? 4 : 3.2;

          return (
            <g
              key={n.id}
              role="button"
              tabIndex={0}
              aria-label={`${statementById[n.id].plain}. ${
                isAffirmed ? "You affirmed this." : "Not affirmed."
              }`}
              aria-pressed={isActive}
              onMouseEnter={(e) => {
                setHoveredId(n.id);
                updatePointer(e);
              }}
              onMouseMove={updatePointer}
              onFocus={() => setHoveredId(n.id)}
              onBlur={() => setHoveredId(null)}
              onClick={() => selectNode(n.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  selectNode(n.id);
                }
              }}
              style={{ cursor: "pointer", outline: "none" }}
              opacity={dim ? 0.32 : 1}
              className="transition-opacity duration-150"
            >
              {/* Halo on the active node so the eye lands on it. */}
              {isActive ? (
                <circle cx={n.x} cy={n.y} r={radius + 4} fill={fill} opacity={0.16} />
              ) : null}
              {/* Generous transparent hit target for hover / tap. */}
              <circle cx={n.x} cy={n.y} r={12} fill="transparent" />
              <circle
                cx={n.x}
                cy={n.y}
                r={radius}
                fill={fill}
                stroke={stroke}
                strokeWidth={isActive ? 1.6 : 1.1}
                className="transition-[r] duration-150"
              />
              <text
                x={n.x + radius + 2.5}
                y={n.y + 2.6}
                fontFamily="var(--font-mono), ui-monospace, monospace"
                fontSize={isActive ? 7.6 : 6.5}
                fontWeight={isActive || isNeighbor ? 600 : 400}
                fill={webColors.nodeStroke}
                opacity={isAffirmed || isActive || isNeighbor ? 1 : 0.66}
                style={{ letterSpacing: "0.02em" }}
              >
                {n.short}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Floating readout that follows the cursor, so the details sit next to
          the belief being traced rather than below the whole diagram. Hidden on
          touch (no hover); the panel underneath covers tap there. */}
      {hoveredId && pointer && !activeEdgeKey
        ? (() => {
            const TIP_W = 248;
            const OFFSET = 18;
            const MARGIN = 8;
            let left = pointer.x + OFFSET;
            if (left + TIP_W > pointer.w - MARGIN)
              left = pointer.x - OFFSET - TIP_W;
            left = Math.max(MARGIN, Math.min(left, pointer.w - TIP_W - MARGIN));
            const top = Math.max(0, pointer.y - 14);
            return (
              <div
                className="pointer-events-none absolute z-30 hidden sm:block"
                style={{ left, top, width: TIP_W }}
              >
                <HoverCard
                  id={hoveredId}
                  affirmed={affirmed.has(hoveredId)}
                  relations={relationsById.get(hoveredId) ?? []}
                />
              </div>
            );
          })()
        : null}

      {/* Edge readout: why this pair pulls against each other, with a link down
          to the full comparison. Follows the cursor on hover (desktop) and pins
          in place on tap (so the "read more" link is reachable on touch). */}
      {activeEdgeFinding &&
      ((pinnedEdge && pinnedPos) || (hoveredEdge && pointer))
        ? (() => {
            const pinned = Boolean(pinnedEdge && pinnedPos);
            const pos = pinned ? pinnedPos! : pointer!;
            const TIP_W = 264;
            const OFFSET = 16;
            const MARGIN = 8;
            // Prefer the right of the cursor; flip left if it would overflow,
            // then clamp so a narrow phone never pushes the card off-screen.
            let left = pos.x + OFFSET;
            if (left + TIP_W > pos.w - MARGIN) left = pos.x - OFFSET - TIP_W;
            left = Math.max(MARGIN, Math.min(left, pos.w - TIP_W - MARGIN));
            const top = Math.max(0, pos.y - 14);
            return (
              <div
                className={`absolute z-40 ${
                  pinned ? "" : "pointer-events-none hidden sm:block"
                }`}
                style={{ left, top, width: TIP_W }}
              >
                <EdgeCard
                  finding={activeEdgeFinding}
                  pinned={pinned}
                  onReadMore={() => scrollToFinding(activeEdgeFinding.id)}
                />
              </div>
            );
          })()
        : null}

      {/* Legend — hover a kind to trace every edge of that type. */}
      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 border-t border-rule-soft pt-3">
        {(
          ["conflict", "argument", "implication", "compatible"] as const
        ).map((kind) => {
          const count = triggeredByKind[kind];
          return (
            <button
              key={kind}
              type="button"
              onMouseEnter={() => setHoveredKind(kind)}
              onMouseLeave={() => setHoveredKind(null)}
              onFocus={() => setHoveredKind(kind)}
              onBlur={() => setHoveredKind(null)}
              className="group flex items-center gap-2 font-sans text-[0.66rem] uppercase tracking-[0.14em] text-muted transition hover:text-ink"
            >
              <svg width="22" height="8" aria-hidden="true">
                <line
                  x1="0"
                  y1="4"
                  x2="22"
                  y2="4"
                  stroke={findingHex[kind]}
                  strokeWidth="2"
                  strokeDasharray={edgeDash[kind]}
                  strokeLinecap="round"
                />
              </svg>
              {findingLabels[kind]}
              <span className="tabular text-ink-soft">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Detail panel — reads out whatever the viewer is pointing at. */}
      <div className="mt-4 min-h-[5.5rem] border-t border-rule-soft pt-4">
        {activeId ? (
          <ActiveDetail
            id={activeId}
            affirmed={affirmed.has(activeId)}
            relations={relationsById.get(activeId) ?? []}
            pinned={selectedId === activeId}
          />
        ) : (
          <p className="font-serif text-[0.95rem] leading-7 text-muted">
            Each dot is one statement; filled in oxblood means you affirmed it.
            Lines join beliefs the engine has a rule about.{" "}
            <span className="text-ink-soft">
              Hover or tap a belief to trace its connections, or a line to read
              why those two pull against each other — and open the full
              comparison from there.
            </span>
          </p>
        )}
      </div>
    </div>
  );
}

function ActiveDetail({
  id,
  affirmed,
  relations,
  pinned,
}: {
  id: BeliefId;
  affirmed: boolean;
  relations: Relation[];
  pinned: boolean;
}) {
  const statement = statementById[id];
  // Fired relationships first, then by kind, so the live tensions lead.
  const ordered = [...relations].sort((a, b) => {
    if (a.triggered !== b.triggered) return a.triggered ? -1 : 1;
    return 0;
  });

  return (
    <div>
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-muted">
          {clusterLabel[statement.category]}
        </span>
        <span
          className={`font-sans text-[0.62rem] uppercase tracking-[0.16em] ${
            affirmed ? "text-mark" : "text-muted"
          }`}
        >
          {affirmed ? "you affirmed this" : "not affirmed"}
        </span>
        {pinned ? (
          <span className="font-sans text-[0.6rem] uppercase tracking-[0.16em] text-muted">
            · pinned (tap again or tap empty space to release)
          </span>
        ) : null}
      </div>
      <p className="mt-2 font-serif text-[1.02rem] leading-7 text-ink">
        {statement.prompt}
      </p>
      {ordered.length > 0 ? (
        <ul className="mt-3 space-y-1.5">
          {ordered.map((rel) => (
            <li
              key={`${rel.other}-${rel.kind}`}
              className="flex items-baseline gap-2.5 font-serif text-[0.92rem] leading-6"
            >
              <svg
                width="20"
                height="8"
                aria-hidden="true"
                className="mt-1.5 shrink-0"
              >
                <line
                  x1="0"
                  y1="4"
                  x2="20"
                  y2="4"
                  stroke={findingHex[rel.kind]}
                  strokeWidth="2"
                  strokeDasharray={edgeDash[rel.kind]}
                  strokeLinecap="round"
                  opacity={rel.triggered ? 1 : 0.4}
                />
              </svg>
              <span className={rel.triggered ? "text-ink" : "text-muted"}>
                <span className="font-sans text-[0.62rem] uppercase tracking-[0.12em]">
                  {findingLabels[rel.kind]}
                </span>{" "}
                with {nodeById.get(rel.other)?.short ?? rel.other}
                {rel.triggered ? (
                  <span className="text-mark"> — active in your answers</span>
                ) : null}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 font-serif text-[0.9rem] italic leading-6 text-muted">
          This statement has no rule connecting it to the others in this
          version.
        </p>
      )}
    </div>
  );
}

// Compact card shown next to the cursor while hovering a node. Same content as
// the panel below, trimmed to what reads well in a small floating box.
function HoverCard({
  id,
  affirmed,
  relations,
}: {
  id: BeliefId;
  affirmed: boolean;
  relations: Relation[];
}) {
  const statement = statementById[id];
  const ordered = [...relations].sort((a, b) => {
    if (a.triggered !== b.triggered) return a.triggered ? -1 : 1;
    return 0;
  });

  return (
    <div className="border border-ink bg-paper px-4 py-3 shadow-[4px_5px_0_0_var(--color-paper-deep)]">
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
        <span className="font-mono text-[0.56rem] uppercase tracking-[0.14em] text-muted">
          {clusterLabel[statement.category]}
        </span>
        <span
          className={`font-sans text-[0.56rem] uppercase tracking-[0.14em] ${
            affirmed ? "text-mark" : "text-muted"
          }`}
        >
          {affirmed ? "affirmed" : "not affirmed"}
        </span>
      </div>
      <p className="mt-1.5 font-serif text-[0.92rem] leading-snug text-ink">
        {statement.plain}
      </p>
      {ordered.length > 0 ? (
        <ul className="mt-2.5 space-y-1.5">
          {ordered.map((rel) => (
            <li
              key={`${rel.other}-${rel.kind}`}
              className="flex items-baseline gap-2 font-sans text-[0.64rem] leading-tight"
            >
              <svg width="16" height="6" aria-hidden="true" className="mt-1 shrink-0">
                <line
                  x1="0"
                  y1="3"
                  x2="16"
                  y2="3"
                  stroke={findingHex[rel.kind]}
                  strokeWidth="2"
                  strokeDasharray={edgeDash[rel.kind]}
                  strokeLinecap="round"
                  opacity={rel.triggered ? 1 : 0.4}
                />
              </svg>
              <span className={rel.triggered ? "text-ink" : "text-muted"}>
                <span className="uppercase tracking-[0.1em]">
                  {findingLabels[rel.kind]}
                </span>{" "}
                · {nodeById.get(rel.other)?.short ?? rel.other}
                {rel.triggered ? (
                  <span className="text-mark"> · active</span>
                ) : null}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 font-serif text-[0.8rem] italic leading-snug text-muted">
          No rule connects this one to the others yet.
        </p>
      )}
    </div>
  );
}

// Card shown on a line: names the relationship, says in a sentence or two why
// the pair pulls against each other, and (when pinned) links to the full
// comparison below. The two beliefs are named via the line's endpoints.
function EdgeCard({
  finding,
  pinned,
  onReadMore,
}: {
  finding: Finding;
  pinned: boolean;
  onReadMore: () => void;
}) {
  const [first, second] = findingBeliefs(finding);
  return (
    <div className="border border-ink bg-paper px-4 py-3 shadow-[4px_5px_0_0_var(--color-paper-deep)]">
      <div className="flex items-center gap-2">
        <svg width="20" height="6" aria-hidden="true" className="shrink-0">
          <line
            x1="0"
            y1="3"
            x2="20"
            y2="3"
            stroke={findingHex[finding.kind]}
            strokeWidth="2.4"
            strokeDasharray={edgeDash[finding.kind]}
            strokeLinecap="round"
          />
        </svg>
        <span
          className="font-sans text-[0.58rem] uppercase tracking-[0.16em]"
          style={{ color: findingHex[finding.kind] }}
        >
          {findingLabels[finding.kind]}
        </span>
      </div>
      <p className="mt-2 font-mono text-[0.58rem] uppercase tracking-[0.1em] text-muted">
        {nodeById.get(first)?.short ?? first}
        <span aria-hidden="true"> ↔ </span>
        {nodeById.get(second)?.short ?? second}
      </p>
      <p className="mt-1.5 font-serif text-[0.88rem] leading-snug text-ink-soft">
        {finding.gist}
      </p>
      <div className="mt-2.5 border-t border-rule-soft pt-2">
        {pinned ? (
          <button
            type="button"
            onClick={onReadMore}
            className="font-sans text-[0.62rem] uppercase tracking-[0.14em] text-mark underline decoration-mark/40 underline-offset-[3px] transition hover:decoration-mark"
          >
            Read the full comparison <span aria-hidden="true">→</span>
          </button>
        ) : (
          <span className="font-sans text-[0.58rem] uppercase tracking-[0.14em] text-muted">
            Click the line to read the full comparison
          </span>
        )}
      </div>
    </div>
  );
}
