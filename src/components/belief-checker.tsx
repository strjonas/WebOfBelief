"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  categories,
  sources,
  statementById,
  type Answer,
  type BeliefId,
  type BeliefStatement,
} from "@/lib/beliefs";
import {
  checkStepCount,
  checkSteps,
  stepStatementIds,
  type CheckStep,
  type ClaimStep,
  type PositionsStep,
} from "@/lib/check-flow";
import {
  affirmedBeliefs,
  countFindings,
  evaluateBeliefs,
  findingBeliefs,
  type AnswerMap,
  type Finding,
  type FindingKind,
} from "@/lib/evaluate";
import {
  beliefWebDiagramEdges,
  beliefWebDiagramNodes,
} from "./belief-web-diagram";
import { InteractiveBeliefWeb } from "./interactive-belief-web";
import { GeneralFeedback, StatementFeedback } from "./belief-feedback";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics";
import { encodeAnswers } from "@/lib/share-code";
import {
  findingAccents,
  findingHex,
  findingLabels,
  findingMarks,
} from "@/lib/findings";
import {
  clearPersistedState,
  loadPersistedState,
  savePersistedState,
} from "@/lib/answer-storage";

const claimChoices: Array<{ id: Answer; label: string; hint: string }> = [
  {
    id: "affirm",
    label: "Yes (I believe this)",
    hint: "You take it to be actually true, as worded.",
  },
  {
    id: "reject",
    label: "No (I reject this)",
    hint: "You take it to be false, as worded.",
  },
  {
    id: "unsure",
    label: "I'm not sure",
    hint: "No settled view either way (not counted against you)",
  },
  {
    id: "qualify",
    label: "It's complicated",
    hint: "The wording doesn't quite fit your view, or you'd only affirm it hypothetically.",
  },
];

// Short answer names for the review list.
const claimAnswerSummary: Record<Answer, string> = {
  affirm: "Yes",
  reject: "No",
  unsure: "Not sure",
  qualify: "It's complicated",
};

// One plain line per kind, so the label is legible before the full
// explanation. Wording mirrors the contradiction-vs-tension guide.
// findingLabels/findingMarks/findingAccents now live in @/lib/findings
// (shared with the compare view); findingGlosses stays local — it's only
// used in this file's FindingCard.
const findingGlosses: Record<FindingKind, string> = {
  conflict: "As worded, both can't be true at once.",
  implication:
    "Together, with one added premise, they entail a further conclusion.",
  argument:
    "No outright clash — but they're in real tension, and the step connecting them is one people still argue over.",
  compatible:
    "Often called incompatible, yet a recognized view holds them together.",
};

const BRAND = "Web of Belief";

// Shown on deity-dependent questions once "no gods exist" has been affirmed,
// so a hypothetical "if God existed…" reading doesn't get recorded as an
// actual belief.
const deityNoteForForeknowledge =
  "You've affirmed that no god or deity exists. Choose “Yes (I believe this)” only if you also take this deity-dependent sentence to be actually true; choose “It's complicated” for a hypothetical reading, or reject it as worded.";

const deityNoteForDivineCommand =
  "You've affirmed that no god or deity exists. Select “duties exist only because God commands them” only if you take it to be actually true — for a purely hypothetical reading, leave it unselected.";

interface BadgeData {
  conflicts: number;
  implications: number;
  arguments: number;
  compatibles: number;
  affirmed: number;
  affirmedIds: BeliefId[];
  triggeredEdges: Array<[BeliefId, BeliefId, FindingKind]>;
  host: string;
}

function drawBadge(canvas: HTMLCanvasElement, data: BadgeData) {
  const w = 1200;
  const h = 630;
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "left";

  // Paper background
  ctx.fillStyle = "#ece9e0";
  ctx.fillRect(0, 0, w, h);

  // Hairline page borders
  ctx.strokeStyle = "#b1ad9f";
  ctx.lineWidth = 1.2;
  ctx.strokeRect(40, 40, w - 80, h - 80);
  ctx.lineWidth = 0.8;
  ctx.strokeRect(48, 48, w - 96, h - 96);

  const serif =
    "'Spectral', 'Source Serif Pro', Georgia, 'Times New Roman', serif";
  const sans =
    "'IBM Plex Sans', ui-sans-serif, system-ui, -apple-system, sans-serif";
  const mono = "'IBM Plex Mono', ui-monospace, 'SF Mono', Menlo, monospace";

  const contentX = 96;
  const contentRight = w - 96;

  // Masthead
  ctx.fillStyle = "#7a1f1d";
  ctx.font = `500 20px ${mono}`;
  ctx.fillText("VOL. I", contentX, 108);

  ctx.fillStyle = "#11131a";
  ctx.font = `500 30px ${serif}`;
  ctx.fillText(BRAND, contentX + 96, 108);

  ctx.fillStyle = "#545860";
  ctx.font = `500 16px ${sans}`;
  ctx.textAlign = "right";
  ctx.fillText("A CONSISTENCY CHECK", contentRight, 108);
  ctx.textAlign = "left";

  // Masthead rule
  ctx.strokeStyle = "#b1ad9f";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(contentX, 128);
  ctx.lineTo(contentRight, 128);
  ctx.stroke();

  // Headline (kept short so it always fits)
  ctx.fillStyle = "#11131a";
  ctx.font = `500 60px ${serif}`;
  const headline =
    data.conflicts === 0
      ? "Mapping my web of belief."
      : `${data.conflicts} contradiction${
          data.conflicts === 1 ? "" : "s"
        } in my web.`;
  ctx.fillText(headline, contentX, 210);

  ctx.fillStyle = "#545860";
  ctx.font = `italic 400 24px ${serif}`;
  ctx.fillText(
    `${data.affirmed} stated belief${
      data.affirmed === 1 ? "" : "s"
    } checked — God, ethics, meaning, freedom, mind.`,
    contentX,
    250,
  );

  // Layout: diagram on left, legend stack on right
  const diagBoxX = contentX;
  const diagBoxY = 280;
  const diagBoxW = 600;
  const diagBoxH = 264;

  // Diagram-area rule label
  ctx.fillStyle = "#545860";
  ctx.font = `500 13px ${mono}`;
  ctx.fillText("FIG. 1 · YOUR BELIEFS ON THE WEB", diagBoxX, diagBoxY - 8);

  // Map node positions (480x360 viewBox) into the diagram box
  const sx = diagBoxW / 480;
  const sy = diagBoxH / 360;
  const nodePosById = new Map<BeliefId, { x: number; y: number }>(
    beliefWebDiagramNodes.map((n) => [
      n.id,
      { x: diagBoxX + n.x * sx, y: diagBoxY + n.y * sy },
    ]),
  );

  const affirmedSet = new Set<BeliefId>(data.affirmedIds);
  const edgeColor = findingHex;
  const triggeredKey = (a: BeliefId, b: BeliefId) =>
    a < b ? `${a}|${b}` : `${b}|${a}`;
  const triggeredSet = new Set<string>(
    data.triggeredEdges.map(([a, b]) => triggeredKey(a, b)),
  );

  for (const edge of beliefWebDiagramEdges) {
    const a = nodePosById.get(edge.a);
    const b = nodePosById.get(edge.b);
    if (!a || !b) continue;
    const hot = triggeredSet.has(triggeredKey(edge.a, edge.b));
    ctx.strokeStyle = edgeColor[edge.kind];
    ctx.globalAlpha = hot ? 0.95 : 0.2;
    ctx.lineWidth = hot ? 2.4 : 1;
    if (edge.kind === "argument") {
      ctx.setLineDash([7, 5]);
    } else if (edge.kind === "compatible") {
      ctx.setLineDash([3, 4]);
    } else {
      ctx.setLineDash([]);
    }
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }
  ctx.setLineDash([]);
  ctx.globalAlpha = 1;

  for (const [id, pos] of nodePosById) {
    const isAffirmed = affirmedSet.has(id);
    ctx.fillStyle = isAffirmed ? "#7a1f1d" : "#ece9e0";
    ctx.strokeStyle = isAffirmed ? "#7a1f1d" : "#11131a";
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, isAffirmed ? 6.5 : 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  // Legend on the right
  const legendX = diagBoxX + diagBoxW + 56;
  const legendTop = diagBoxY - 8;
  ctx.fillStyle = "#545860";
  ctx.font = `500 13px ${mono}`;
  ctx.fillText("FINDINGS", legendX, legendTop);

  const legendRows: Array<{
    key: keyof Pick<
      BadgeData,
      "conflicts" | "implications" | "arguments" | "compatibles"
    >;
    label: string;
    color: string;
    glyph: string;
  }> = [
    {
      key: "conflicts",
      label: "Direct conflict",
      color: findingHex.conflict,
      glyph: "⊥",
    },
    {
      key: "implications",
      label: "Conditional implication",
      color: findingHex.implication,
      glyph: "⊢",
    },
    {
      key: "arguments",
      label: "Live argument",
      color: findingHex.argument,
      glyph: "‡",
    },
    {
      key: "compatibles",
      label: "Coherent combination",
      color: findingHex.compatible,
      glyph: "≈",
    },
  ];

  legendRows.forEach((row, idx) => {
    const y = legendTop + 38 + idx * 60;

    ctx.fillStyle = row.color;
    ctx.font = `500 28px ${mono}`;
    ctx.fillText(row.glyph, legendX, y + 4);

    ctx.fillStyle = "#11131a";
    ctx.font = `500 44px ${serif}`;
    ctx.fillText(String(data[row.key]), legendX + 44, y + 4);

    ctx.fillStyle = "#545860";
    ctx.font = `500 13px ${sans}`;
    ctx.fillText(row.label.toUpperCase(), legendX + 44, y + 22);
    ctx.font = `italic 400 13px ${serif}`;
  });

  // Footer
  ctx.strokeStyle = "#b1ad9f";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(contentX, h - 108);
  ctx.lineTo(contentRight, h - 108);
  ctx.stroke();

  ctx.fillStyle = "#7a1f1d";
  ctx.font = `500 18px ${mono}`;
  ctx.fillText(data.host.toUpperCase(), contentX, h - 78);

  ctx.fillStyle = "#11131a";
  ctx.font = `italic 400 22px ${serif}`;
  ctx.textAlign = "right";
  ctx.fillText("examine your own.", contentRight, h - 78);
  ctx.textAlign = "left";
}

function SourceLinks({ ids }: { ids: BeliefStatement["sourceIds"] }) {
  return (
    <span className="flex flex-wrap gap-x-4 gap-y-1 font-sans text-[0.78rem]">
      {ids.map((sourceId, i) => (
        <a
          key={sourceId}
          href={sources[sourceId].url}
          target="_blank"
          rel="noreferrer"
          className="text-mark underline decoration-mark/40 underline-offset-[3px] transition hover:decoration-mark"
        >
          <span className="font-mono text-[0.72rem] text-mark/70">
            [{i + 1}]
          </span>{" "}
          {sources[sourceId].title}
        </a>
      ))}
    </span>
  );
}

/**
 * The collapsible fine print under each statement: exact wording, what it
 * means, the case each way, sources, and a feedback affordance.
 */
function StatementBackground({ statement }: { statement: BeliefStatement }) {
  return (
    <details className="group/bg">
      <summary className="cursor-pointer list-none py-3 font-sans text-[0.74rem] uppercase tracking-[0.18em] text-mark marker:hidden">
        <span className="group-open/bg:hidden">
          ↳ exact wording, arguments, sources
        </span>
        <span className="hidden group-open/bg:inline">↑ hide background</span>
      </summary>
      <div className="grid gap-5 pb-4 font-serif text-[0.98rem] leading-7 text-ink-soft md:grid-cols-2">
        <div className="md:col-span-2 border-l border-rule-soft pl-4">
          <p className="font-sans text-[0.7rem] uppercase tracking-[0.18em] text-muted">
            <span className="section-mark" />
            exact wording used by the check
          </p>
          <p className="mt-2 font-serif italic text-ink">{statement.prompt}</p>
        </div>
        <div className="md:col-span-2 border-l border-rule-soft pl-4">
          <p className="font-sans text-[0.7rem] uppercase tracking-[0.18em] text-muted">
            <span className="section-mark" />
            what it means
          </p>
          <p className="mt-2">{statement.clarify}</p>
        </div>
        <div className="border-l border-rule-soft pl-4">
          <p className="font-sans text-[0.7rem] uppercase tracking-[0.18em] text-forest">
            <span className="section-mark" />
            reason to hold it
          </p>
          <p className="mt-2">{statement.caseFor}</p>
        </div>
        <div className="border-l border-rule-soft pl-4">
          <p className="font-sans text-[0.7rem] uppercase tracking-[0.18em] text-mark">
            <span className="section-mark" />
            reason not to
          </p>
          <p className="mt-2">{statement.caseAgainst}</p>
        </div>
        <div className="md:col-span-2 border-l border-rule-soft pl-4">
          <p className="font-sans text-[0.7rem] uppercase tracking-[0.18em] text-muted">
            <span className="section-mark" />
            sources
          </p>
          <div className="mt-2">
            <SourceLinks ids={statement.sourceIds} />
          </div>
        </div>
        <div className="md:col-span-2">
          <StatementFeedback beliefId={statement.id} />
        </div>
      </div>
    </details>
  );
}

/** One selectable position on a topic question. */
function PositionCard({
  statement,
  label,
  selected,
  onToggle,
}: {
  statement: BeliefStatement;
  label: string;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={`border transition focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-mark ${
        selected
          ? "border-mark bg-paper shadow-[inset_4px_0_0_0_var(--color-mark)]"
          : "border-rule-soft bg-paper-soft hover:border-ink"
      }`}
    >
      <label className="flex cursor-pointer items-start gap-4 px-5 py-4 sm:px-6">
        <input
          type="checkbox"
          checked={selected}
          onChange={onToggle}
          aria-label={`${label}: ${statement.prompt}`}
          className="sr-only"
        />
        <span
          aria-hidden="true"
          className={`mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center border font-mono text-[0.78rem] ${
            selected
              ? "border-mark bg-mark text-paper"
              : "border-rule text-muted/70"
          }`}
        >
          {selected ? "✓" : "+"}
        </span>
        <span>
          <span
            className={`font-sans text-[0.95rem] font-medium leading-6 ${
              selected ? "text-ink" : "text-ink-soft"
            }`}
          >
            {label}
          </span>
          <span className="mt-1 block font-serif text-[0.95rem] leading-6 text-muted">
            {statement.plain}
          </span>
        </span>
      </label>
      <div className="border-t border-rule-soft/70 px-5 sm:px-6">
        <StatementBackground statement={statement} />
      </div>
    </div>
  );
}

/** A topic question: select any number of positions, or none. */
function PositionsScreen({
  step,
  answers,
  onToggle,
  qualified,
  onToggleQualified,
  note,
}: {
  step: PositionsStep;
  answers: AnswerMap;
  onToggle: (beliefId: BeliefId) => void;
  qualified: boolean;
  onToggleQualified: () => void;
  note?: string;
}) {
  return (
    <fieldset>
      <legend className="sr-only">{step.question}</legend>
      <h2 className="font-serif text-[1.7rem] font-medium leading-tight tracking-tight text-ink sm:text-[2.1rem]">
        {step.question}
      </h2>
      <p className="mt-3 max-w-2xl font-serif text-[0.98rem] italic leading-7 text-muted">
        Select every position you genuinely hold — one, several, or none. Mixed
        views are welcome; if two selections pull against each other, the result
        will show it.
      </p>
      {step.help ? (
        <p className="mt-2 max-w-2xl font-serif text-[0.98rem] leading-7 text-ink-soft">
          {step.help}
        </p>
      ) : null}
      {note ? (
        <p className="mt-4 max-w-2xl border-l-2 border-amber-ink bg-paper-soft px-4 py-3 font-serif text-[0.95rem] leading-6 text-ink-soft">
          <span className="font-sans text-[0.68rem] uppercase tracking-[0.18em] text-amber-ink">
            answer as an actual belief
          </span>
          <br />
          {note}
        </p>
      ) : null}
      <div className="mt-6 space-y-3">
        {step.positions.map((position) => (
          <PositionCard
            key={position.id}
            statement={statementById[position.id]}
            label={position.label}
            selected={answers[position.id] === "affirm"}
            onToggle={() => onToggle(position.id)}
          />
        ))}
      </div>
      {/* The same escape hatch the yes/no questions offer: a topic-level
          "it's complicated" for visitors whose view none of the wordings
          captures. Mutually exclusive with selecting positions. */}
      <label
        className={`mt-3 flex cursor-pointer items-baseline gap-3.5 border px-5 py-3.5 transition focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-mark ${
          qualified
            ? "border-indigo-ink bg-paper text-ink shadow-[inset_4px_0_0_0_var(--color-indigo-ink)]"
            : "border-rule-soft bg-paper-soft text-ink-soft hover:border-ink"
        }`}
      >
        <input
          type="checkbox"
          checked={qualified}
          onChange={onToggleQualified}
          aria-label={`It's complicated (none of the above): ${step.question}`}
          className="sr-only"
        />
        <span
          aria-hidden="true"
          className={`font-mono text-[0.82rem] ${
            qualified ? "text-indigo-ink" : "text-muted/60"
          }`}
        >
          {qualified ? "✓" : "±"}
        </span>
        <span>
          <span className="font-serif text-[1.02rem]">
            It&apos;s complicated (none of the above)
          </span>
          <span className="mt-0.5 block font-serif text-[0.85rem] italic leading-5 text-muted">
            The wording doesn&apos;t quite fit your view, or you&apos;d only
            affirm it hypothetically
          </span>
        </span>
      </label>
    </fieldset>
  );
}

/** A single yes / no / unsure / it's-complicated statement. */
function ClaimScreen({
  step,
  answer,
  onAnswer,
  note,
}: {
  step: ClaimStep;
  answer?: Answer;
  onAnswer: (answer: Answer) => void;
  note?: string;
}) {
  const statement = statementById[step.statementId];
  return (
    <fieldset>
      <legend className="sr-only">{statement.prompt}</legend>
      <p className="font-sans text-[0.72rem] uppercase tracking-[0.22em] text-muted">
        do you believe this?
      </p>
      <h2 className="mt-3 max-w-2xl font-serif text-[1.55rem] font-medium leading-snug tracking-tight text-ink sm:text-[1.9rem]">
        {statement.plain}
      </h2>
      {note ? (
        <p className="mt-4 max-w-2xl border-l-2 border-amber-ink bg-paper-soft px-4 py-3 font-serif text-[0.95rem] leading-6 text-ink-soft">
          <span className="font-sans text-[0.68rem] uppercase tracking-[0.18em] text-amber-ink">
            answer as an actual belief
          </span>
          <br />
          {note}
        </p>
      ) : null}
      <div className="mt-6 grid max-w-2xl gap-2.5">
        {claimChoices.map((choice) => {
          const selected = answer === choice.id;
          const selectedClasses =
            choice.id === "affirm"
              ? "border-mark bg-paper shadow-[inset_4px_0_0_0_var(--color-mark)]"
              : choice.id === "reject"
                ? "border-ink bg-paper shadow-[inset_4px_0_0_0_var(--color-ink)]"
                : choice.id === "unsure"
                  ? "border-amber-ink bg-paper shadow-[inset_4px_0_0_0_var(--color-amber-ink)]"
                  : "border-indigo-ink bg-paper shadow-[inset_4px_0_0_0_var(--color-indigo-ink)]";
          const idleGlyph =
            choice.id === "affirm"
              ? "+"
              : choice.id === "reject"
                ? "–"
                : choice.id === "unsure"
                  ? "?"
                  : "±";
          const selectedGlyphColor =
            choice.id === "affirm"
              ? "text-mark"
              : choice.id === "reject"
                ? "text-ink"
                : choice.id === "unsure"
                  ? "text-amber-ink"
                  : "text-indigo-ink";
          return (
            <label
              key={choice.id}
              className={`group flex cursor-pointer items-baseline gap-3.5 border px-5 py-3.5 transition focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-mark ${
                selected
                  ? `${selectedClasses} text-ink`
                  : "border-rule-soft bg-paper-soft text-ink-soft hover:border-ink"
              }`}
            >
              <input
                type="radio"
                name={statement.id}
                value={choice.id}
                checked={selected}
                onChange={() => onAnswer(choice.id)}
                aria-label={`${choice.label}: ${statement.prompt}`}
                className="sr-only"
              />
              <span
                aria-hidden="true"
                className={`font-mono text-[0.82rem] ${
                  selected ? selectedGlyphColor : "text-muted/60"
                }`}
              >
                {selected ? "✓" : idleGlyph}
              </span>
              <span>
                <span className="font-serif text-[1.02rem]">
                  {choice.label}
                </span>
                <span className="mt-0.5 block font-serif text-[0.85rem] italic leading-5 text-muted">
                  {choice.hint}
                </span>
              </span>
            </label>
          );
        })}
      </div>
      <div className="mt-5 max-w-2xl border-t border-rule-soft">
        <StatementBackground statement={statement} />
      </div>
    </fieldset>
  );
}

function FindingCard({ finding }: { finding: Finding }) {
  const accent = findingAccents[finding.kind];
  // Direct conflicts are the reason most people ran the check, so they open by
  // default; the softer findings collapse to a scannable row so the share and
  // compare steps below aren't buried under every explanation at once.
  const startsOpen = finding.kind === "conflict";
  return (
    <details
      id={`finding-${finding.id}`}
      open={startsOpen}
      className={`group scroll-mt-24 border-l-[3px] ${accent.rule} bg-paper-soft`}
    >
      <summary className="cursor-pointer list-none px-5 py-5 marker:hidden sm:px-7">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span
            className={`font-mono text-2xl leading-none ${accent.ink}`}
            aria-hidden="true"
          >
            {findingMarks[finding.kind]}
          </span>
          <span
            className={`font-sans text-[0.7rem] uppercase tracking-[0.22em] ${accent.ink}`}
          >
            {findingLabels[finding.kind]}
          </span>
          <h4 className="font-serif text-[1.25rem] font-medium leading-snug text-ink">
            {finding.title}
          </h4>
          <span className="ml-auto self-center font-sans text-[0.68rem] uppercase tracking-[0.16em] text-muted">
            <span className="group-open:hidden">read →</span>
            <span className="hidden group-open:inline">hide</span>
          </span>
        </div>
        <p className="mt-2 font-serif text-[0.9rem] italic leading-6 text-muted">
          {findingGlosses[finding.kind]}
        </p>
      </summary>
      <div className="px-5 pb-6 sm:px-7">
        <p className="font-serif text-[1rem] leading-7 text-ink-soft">
          {finding.explanation}
        </p>
        <div className="mt-5 border-t border-rule-soft pt-4 font-serif text-[0.97rem] leading-7 text-ink-soft">
          <p className="font-sans text-[0.7rem] uppercase tracking-[0.18em] text-muted">
            <span className="section-mark" />
            your beliefs at issue
          </p>
          <ul className="mt-2 space-y-1.5 pl-4">
            {finding.requires.map((beliefId) => (
              <li key={beliefId} className="relative">
                <span className="absolute -left-4 top-2 inline-block h-1 w-2 bg-ink" />
                {statementById[beliefId].prompt}
              </li>
            ))}
            {(finding.rejects ?? []).map((beliefId) => (
              <li key={beliefId} className="relative">
                <span className="absolute -left-4 top-2 inline-block h-1 w-2 border border-ink" />
                {statementById[beliefId].prompt}{" "}
                <span className="font-sans text-[0.7rem] uppercase tracking-[0.14em] text-muted">
                  — which you rejected
                </span>
              </li>
            ))}
          </ul>
          {finding.bridge ? (
            <>
              <p className="mt-5 font-sans text-[0.7rem] uppercase tracking-[0.18em] text-muted">
                <span className="section-mark" />
                additional premise required
              </p>
              <p className="mt-2 italic">{finding.bridge}</p>
            </>
          ) : null}
          <p className="mt-5 font-sans text-[0.7rem] uppercase tracking-[0.18em] text-muted">
            <span className="section-mark" />
            question to revisit
          </p>
          <p className="mt-2">{finding.nextQuestion}</p>
        </div>
        <div className="mt-5 border-t border-rule-soft pt-4">
          <SourceLinks ids={finding.sourceIds} />
        </div>
      </div>
    </details>
  );
}

type Phase = "questions" | "review" | "results";

/** True once the visitor has recorded anything on this question. */
function stepHasAnswer(step: CheckStep, answers: AnswerMap): boolean {
  return stepStatementIds(step).some((id) => answers[id] !== undefined);
}

/**
 * True when a topic question was answered "it's complicated" rather than by
 * selecting positions. The toggle records `qualify` on every position in the
 * step; any affirmed position means the topic was answered normally.
 */
function stepQualified(step: PositionsStep, answers: AnswerMap): boolean {
  return (
    step.positions.some((position) => answers[position.id] === "qualify") &&
    !step.positions.some((position) => answers[position.id] === "affirm")
  );
}

/** Review-list summary of what was recorded on a question. */
function stepSummary(step: CheckStep, answers: AnswerMap): string {
  if (step.kind === "claim") {
    const answer = answers[step.statementId];
    return answer ? claimAnswerSummary[answer] : "Skipped — counts as not sure";
  }
  const selected = step.positions.filter(
    (position) => answers[position.id] === "affirm",
  );
  if (selected.length > 0) {
    return selected.map((position) => position.label).join(" · ");
  }
  if (stepQualified(step, answers)) return claimAnswerSummary.qualify;
  return "Nothing selected — counts as not sure";
}

export function BeliefChecker() {
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [phase, setPhase] = useState<Phase>("questions");
  const [step, setStep] = useState(0);
  const [copyNotice, setCopyNotice] = useState("");
  const [compareNotice, setCompareNotice] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const topRef = useRef<HTMLElement | null>(null);

  // Restore saved progress once, after mount. Doing this in an effect (rather
  // than a lazy useState initializer that reads localStorage) keeps the server
  // and first client render identical, so there's no hydration mismatch — which
  // is exactly why setting state from the effect is correct here.
  useEffect(() => {
    const saved = loadPersistedState();
    if (saved) {
      /* eslint-disable react-hooks/set-state-in-effect */
      setAnswers(saved.answers);
      setPhase(saved.showResults ? "results" : "questions");
      setStep(saved.step);
      /* eslint-enable react-hooks/set-state-in-effect */
    }
    setHydrated(true);
  }, []);

  // Persist on change — but only after the restore above has run, so the
  // initial empty state never overwrites saved answers.
  useEffect(() => {
    if (!hydrated) return;
    savePersistedState({
      answers,
      showResults: phase === "results",
      step,
    });
  }, [hydrated, answers, phase, step]);

  const scrollToTop = useCallback(() => {
    window.requestAnimationFrame(() => {
      topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);

  // Counted per question, not per statement: a topic answered "it's
  // complicated" records qualify on each of its positions but is one answer.
  const qualifiedCount = checkSteps.filter((s) =>
    s.kind === "claim"
      ? answers[s.statementId] === "qualify"
      : stepQualified(s, answers),
  ).length;
  const findings = useMemo(() => evaluateBeliefs(answers), [answers]);
  const affirmed = useMemo(() => affirmedBeliefs(answers), [answers]);
  const conflictCount = countFindings(findings, "conflict");
  const argumentCount = countFindings(findings, "argument");
  const implicationCount = countFindings(findings, "implication");
  const compatibleCount = countFindings(findings, "compatible");
  const noDirectConflict = conflictCount === 0 && affirmed.length > 0;
  const answeredSteps = checkSteps.filter((s) =>
    stepHasAnswer(s, answers),
  ).length;

  const affirmedSet = useMemo(() => new Set(affirmed), [affirmed]);
  const triggeredEdges = useMemo<
    Array<[BeliefId, BeliefId, FindingKind]>
  >(() => {
    const out: Array<[BeliefId, BeliefId, FindingKind]> = [];
    for (const finding of findings) {
      const beliefs = findingBeliefs(finding);
      if (beliefs.length >= 2) {
        out.push([beliefs[0], beliefs[1], finding.kind]);
      }
    }
    return out;
  }, [findings]);
  const triggeredPairs = useMemo<Array<[BeliefId, BeliefId]>>(
    () => triggeredEdges.map(([a, b]) => [a, b]),
    [triggeredEdges],
  );

  const badgeData: BadgeData = useMemo(
    () => ({
      conflicts: conflictCount,
      implications: implicationCount,
      arguments: argumentCount,
      compatibles: compatibleCount,
      affirmed: affirmed.length,
      affirmedIds: affirmed,
      triggeredEdges,
      host:
        typeof window === "undefined"
          ? "webofbelief.app"
          : window.location.host || "webofbelief.app",
    }),
    [
      conflictCount,
      implicationCount,
      argumentCount,
      compatibleCount,
      affirmed,
      triggeredEdges,
    ],
  );

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [badgeUrl, setBadgeUrl] = useState("");

  useEffect(() => {
    if (phase !== "results") return;
    const canvas = canvasRef.current ?? document.createElement("canvas");
    canvasRef.current = canvas;
    try {
      drawBadge(canvas, badgeData);
      setBadgeUrl(canvas.toDataURL("image/png"));
    } catch {
      setBadgeUrl("");
    }
  }, [phase, badgeData]);

  const downloadBadge = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    trackEvent({ name: "badge_shared", props: { via: "download" } });
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "web-of-belief.png";
      link.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  }, []);

  const copyBadge = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    trackEvent({ name: "badge_shared", props: { via: "copy" } });
    try {
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/png"),
      );
      if (!blob || !navigator.clipboard || !("write" in navigator.clipboard)) {
        throw new Error("unsupported");
      }
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
      ]);
      setCopyNotice("Image copied. Paste it into a post or message.");
    } catch {
      setCopyNotice("Image copy is unavailable here — use Download image.");
    }
  }, []);

  const shareBadge = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    trackEvent({ name: "badge_shared", props: { via: "share" } });
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/png"),
    );
    if (!blob) return;
    const file = new File([blob], "web-of-belief.png", { type: "image/png" });
    const nav = navigator as Navigator & {
      canShare?: (data?: ShareData) => boolean;
    };
    if (nav.canShare?.({ files: [file] }) && nav.share) {
      try {
        await nav.share({
          files: [file],
          title: BRAND,
          text: "I mapped which of my beliefs fit together — see yours:",
          url: window.location.origin,
        });
      } catch {
        // Dismissed.
      }
      return;
    }
    downloadBadge();
    setCopyNotice(
      "Your browser can't share files directly, so the image was downloaded — attach it to your post.",
    );
  }, [downloadBadge]);

  const shareText = useMemo(() => {
    if (conflictCount > 0) {
      return `My belief web has ${conflictCount} contradiction${
        conflictCount === 1 ? "" : "s"
      } to examine. Each finding cites a philosophical source:`;
    }
    if (noDirectConflict) {
      return "No direct contradiction detected in my belief web. Conditional implications and live arguments are separated from verdicts:";
    }
    return "Mapping my web of belief with a small source-backed consistency check:";
  }, [conflictCount, noDirectConflict]);

  const siteOrigin =
    typeof window === "undefined"
      ? "https://webofbelief.app"
      : window.location.origin;

  const tweetUrl = useMemo(() => {
    const params = new URLSearchParams({
      text: shareText,
      url: siteOrigin,
    });
    return `https://twitter.com/intent/tweet?${params.toString()}`;
  }, [shareText, siteOrigin]);

  const blueskyUrl = useMemo(() => {
    const params = new URLSearchParams({ text: `${shareText} ${siteOrigin}` });
    return `https://bsky.app/intent/compose?${params.toString()}`;
  }, [shareText, siteOrigin]);

  const redditUrl = useMemo(() => {
    const params = new URLSearchParams({
      title: shareText,
      url: siteOrigin,
    });
    return `https://www.reddit.com/submit?${params.toString()}`;
  }, [shareText, siteOrigin]);

  const copyShareText = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(`${shareText} ${siteOrigin}`);
      setCopyNotice("Caption copied. Paste it with the image.");
    } catch {
      setCopyNotice("Clipboard access was unavailable in this browser.");
    }
  }, [shareText, siteOrigin]);

  const copyCompareLink = useCallback(async () => {
    // The answers ride in the URL *fragment*, so they are never sent to the
    // server — the comparison is computed entirely in each browser.
    const link = `${siteOrigin}/compare-beliefs#${encodeAnswers(answers)}`;
    try {
      await navigator.clipboard.writeText(link);
      trackEvent({ name: "compare_link_created" });
      setCompareNotice(
        "Compare link copied. Send it to a friend — they'll see where your webs differ. Your answers ride in the link, never our server.",
      );
    } catch {
      setCompareNotice("Clipboard access was unavailable in this browser.");
    }
  }, [answers, siteOrigin]);

  function recordAnswer(updater: (previous: AnswerMap) => AnswerMap) {
    setAnswers((previous) => {
      const next = updater(previous);
      // Fire "check_started" only on the very first recorded answer, so the
      // event maps to "this visitor actually began the check" vs. bouncing.
      if (Object.keys(previous).length === 0 && Object.keys(next).length > 0) {
        trackEvent({ name: "check_started" });
      }
      return next;
    });
    setCopyNotice("");
  }

  function answerClaim(statementId: BeliefId, answer: Answer) {
    recordAnswer((previous) => ({ ...previous, [statementId]: answer }));
  }

  function togglePosition(positionsStep: PositionsStep, beliefId: BeliefId) {
    recordAnswer((previous) => {
      const next = { ...previous };
      // Selecting a position withdraws the topic-level "it's complicated".
      for (const position of positionsStep.positions) {
        if (next[position.id] === "qualify") delete next[position.id];
      }
      if (previous[beliefId] === "affirm") {
        delete next[beliefId];
      } else {
        next[beliefId] = "affirm";
      }
      return next;
    });
  }

  function toggleStepQualified(positionsStep: PositionsStep) {
    recordAnswer((previous) => {
      const wasQualified = stepQualified(positionsStep, previous);
      const next = { ...previous };
      for (const position of positionsStep.positions) {
        if (wasQualified) {
          delete next[position.id];
        } else {
          next[position.id] = "qualify";
        }
      }
      return next;
    });
  }

  function goToStep(index: number) {
    setStep(Math.min(Math.max(index, 0), checkStepCount - 1));
    setPhase("questions");
    scrollToTop();
  }

  function goNext() {
    if (step >= checkStepCount - 1) {
      setPhase("review");
    } else {
      setStep(step + 1);
    }
    scrollToTop();
  }

  function goBack() {
    if (step > 0) setStep(step - 1);
    scrollToTop();
  }

  function openReview() {
    setPhase("review");
    scrollToTop();
  }

  function reviewResults() {
    trackEvent({ name: "results_viewed" });
    setPhase("results");
    scrollToTop();
  }

  function resetCheck() {
    trackEvent({ name: "check_reset" });
    clearPersistedState();
    setAnswers({});
    setPhase("questions");
    setStep(0);
    setCopyNotice("");
    setCompareNotice("");
    scrollToTop();
  }

  const currentStep = checkSteps[step];
  const isLastStep = step === checkStepCount - 1;
  const currentAnswered = stepHasAnswer(currentStep, answers);

  const stepNote =
    answers.noDeity === "affirm"
      ? currentStep.kind === "claim" &&
        currentStep.statementId === "infallibleForeknowledge"
        ? deityNoteForForeknowledge
        : currentStep.id === "morality-and-god"
          ? deityNoteForDivineCommand
          : undefined
      : undefined;

  return (
    <section id="check" ref={topRef} className="scroll-mt-24 py-10 sm:py-14">
      {phase === "questions" ? (
        <>
          {/* Progress header: where am I, how much is left, and the one exit
              (review & finish) — always visible, never a dead end. */}
          <div className="border-b border-rule pb-4">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
              <p className="font-sans text-[0.72rem] uppercase tracking-[0.18em] text-muted">
                question <span className="tabular text-ink">{step + 1}</span> of{" "}
                <span className="tabular">{checkStepCount}</span>
                <span className="text-rule"> · </span>
                <span className="text-mark">{currentStep.title}</span>
              </p>
              <button
                type="button"
                onClick={openReview}
                className="font-sans text-[0.72rem] uppercase tracking-[0.16em] text-muted underline decoration-rule underline-offset-[5px] transition hover:text-ink hover:decoration-ink"
              >
                Review &amp; finish →
              </button>
            </div>
            <div
              role="progressbar"
              aria-label="Question progress"
              aria-valuemin={1}
              aria-valuemax={checkStepCount}
              aria-valuenow={step + 1}
              className="mt-3 h-[3px] w-full overflow-hidden bg-rule-soft"
            >
              <div
                className="h-full bg-mark transition-all"
                style={{
                  width: `${((step + 1) / checkStepCount) * 100}%`,
                }}
              />
            </div>
          </div>

          <div className="mt-8 min-h-[22rem]">
            {currentStep.kind === "positions" ? (
              <PositionsScreen
                step={currentStep}
                answers={answers}
                onToggle={(beliefId) => togglePosition(currentStep, beliefId)}
                qualified={stepQualified(currentStep, answers)}
                onToggleQualified={() => toggleStepQualified(currentStep)}
                note={stepNote}
              />
            ) : (
              <ClaimScreen
                step={currentStep}
                answer={answers[currentStep.statementId]}
                onAnswer={(answer) =>
                  answerClaim(currentStep.statementId, answer)
                }
                note={stepNote}
              />
            )}
          </div>

          {/* Back / next. Skipping is always allowed and labelled as such. */}
          <div className="mt-10 flex items-center justify-between gap-4 border-t border-rule pt-6">
            <button
              type="button"
              onClick={goBack}
              disabled={step === 0}
              className="border border-rule px-5 py-3 font-sans text-[0.78rem] uppercase tracking-[0.18em] text-muted transition enabled:hover:border-ink enabled:hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
            >
              ← Back
            </button>
            <button
              type="button"
              onClick={goNext}
              className={`group inline-flex items-center gap-3 px-7 py-3 font-sans text-[0.78rem] uppercase tracking-[0.18em] transition ${
                currentAnswered || isLastStep
                  ? "border border-ink bg-ink text-paper hover:border-mark hover:bg-mark"
                  : "border border-ink text-ink hover:bg-ink hover:text-paper"
              }`}
            >
              {isLastStep
                ? "Review answers"
                : currentAnswered
                  ? "Next"
                  : "Skip for now"}
              <span
                aria-hidden="true"
                className="transition group-hover:translate-x-1"
              >
                →
              </span>
            </button>
          </div>
        </>
      ) : null}

      {phase === "review" ? (
        <>
          <div className="border-b border-rule pb-8">
            <p className="font-sans text-[0.72rem] uppercase tracking-[0.22em] text-mark">
              <span className="section-mark" />
              review
            </p>
            <h2 className="mt-3 font-serif text-3xl font-medium leading-tight tracking-tight text-ink sm:text-4xl">
              Your answers
            </h2>
            <p className="mt-3 max-w-2xl font-serif text-[1.02rem] leading-7 text-ink-soft">
              {`You answered ${answeredSteps} of ${checkStepCount} questions.`}{" "}
              Anything skipped or left unselected counts as &ldquo;not
              sure&rdquo; — never as belief in the opposite. Select a question
              to change it, or see your results.
            </p>
          </div>

          <div className="mt-8 space-y-8">
            {categories.map((category) => {
              const categorySteps = checkSteps.filter(
                (s) => s.category === category.id,
              );
              if (categorySteps.length === 0) return null;
              return (
                <div key={category.id}>
                  <h3 className="font-sans text-[0.72rem] uppercase tracking-[0.22em] text-muted">
                    {category.name}
                  </h3>
                  <ul className="mt-3 divide-y divide-rule-soft border-y border-rule-soft">
                    {categorySteps.map((s) => {
                      const index = checkSteps.indexOf(s);
                      const has = stepHasAnswer(s, answers);
                      return (
                        <li key={s.id}>
                          <button
                            type="button"
                            onClick={() => goToStep(index)}
                            className="group flex w-full flex-wrap items-baseline justify-between gap-x-6 gap-y-1 px-1 py-3.5 text-left transition hover:bg-paper-soft"
                          >
                            <span className="font-serif text-[1.02rem] text-ink">
                              {s.title}
                            </span>
                            <span
                              className={`font-sans text-[0.78rem] ${
                                has ? "text-ink-soft" : "italic text-muted"
                              }`}
                            >
                              {stepSummary(s, answers)}
                              <span className="ml-3 font-sans text-[0.68rem] uppercase tracking-[0.14em] text-mark opacity-0 transition group-hover:opacity-100">
                                edit →
                              </span>
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-4 border-t border-rule pt-8">
            <button
              type="button"
              onClick={reviewResults}
              aria-label="See my results"
              className="group inline-flex items-center gap-3 border border-ink bg-ink px-8 py-4 font-sans text-[0.82rem] uppercase tracking-[0.18em] text-paper transition hover:border-mark hover:bg-mark"
            >
              See my results
              <span
                aria-hidden="true"
                className="transition group-hover:translate-x-1"
              >
                →
              </span>
            </button>
            <button
              type="button"
              onClick={() => goToStep(step)}
              className="font-sans text-[0.78rem] uppercase tracking-[0.18em] text-muted underline decoration-rule underline-offset-[5px] transition hover:text-ink hover:decoration-ink"
            >
              ← Back to the questions
            </button>
          </div>
        </>
      ) : null}

      {phase === "results" ? (
        <>
          <div className="flex flex-col gap-4 border-b border-rule pb-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-sans text-[0.72rem] uppercase tracking-[0.22em] text-mark">
                <span className="section-mark" />
                your result
              </p>
              <p className="mt-3 max-w-2xl font-serif text-[1.02rem] leading-7 text-ink-soft">
                {affirmed.length > 0
                  ? `Based on ${affirmed.length} belief${
                      affirmed.length === 1 ? "" : "s"
                    } you affirmed across ${answeredSteps} answered question${
                      answeredSteps === 1 ? "" : "s"
                    }.`
                  : "You didn't affirm any beliefs yet, so there was nothing to check — only affirmed beliefs become premises."}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={openReview}
                className="border border-ink px-5 py-3 font-sans text-[0.78rem] uppercase tracking-[0.18em] text-ink transition hover:bg-ink hover:text-paper"
              >
                Edit answers
              </button>
              <button
                type="button"
                onClick={resetCheck}
                className="border border-rule px-5 py-3 font-sans text-[0.78rem] uppercase tracking-[0.18em] text-muted transition hover:border-ink hover:text-ink"
              >
                Start over
              </button>
            </div>
          </div>

          <section
            id="results"
            aria-live="polite"
            aria-label="Reflection results"
            className="mt-10 scroll-mt-6"
          >
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-start">
              <div>
                <h3 className="font-serif text-3xl font-medium leading-tight tracking-tight text-ink sm:text-4xl">
                  {conflictCount > 0
                    ? `${conflictCount} direct conflict${
                        conflictCount === 1 ? "" : "s"
                      } to examine`
                    : "No direct conflict detected"}
                </h3>
                <p className="mt-4 max-w-2xl font-serif text-[1rem] leading-7 text-ink-soft">
                  Only the beliefs you affirmed were checked. Everything else —
                  rejections, &ldquo;not sure,&rdquo; skipped questions
                  {qualifiedCount > 0
                    ? `, and the ${qualifiedCount} answer${
                        qualifiedCount === 1 ? "" : "s"
                      } you marked “it's complicated”`
                    : ""}{" "}
                  (was never read as a hidden opposite belief). Results report
                  relationships in the rule set; they do not prove your complete
                  worldview coherent or incoherent.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-left sm:max-w-xs">
                {(
                  [
                    ["conflict", conflictCount],
                    ["implication", implicationCount],
                    ["argument", argumentCount],
                    ["compatible", compatibleCount],
                  ] as const
                ).map(([kind, count]) => (
                  <div key={kind} className="border-l-2 border-rule-soft pl-3">
                    <p
                      className={`font-mono text-[0.7rem] uppercase tracking-[0.18em] ${findingAccents[kind].ink}`}
                    >
                      {findingLabels[kind].toLowerCase()}
                    </p>
                    <p className="mt-1 font-serif text-2xl tabular text-ink">
                      {count}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {conflictCount > 0 ? (
              <p className="mt-8 border-l-2 border-mark bg-paper-soft px-5 py-4 font-serif text-[1rem] leading-7 text-ink-soft">
                <span className="font-sans text-[0.7rem] uppercase tracking-[0.18em] text-mark">
                  <span className="section-mark" />
                  how to read this
                </span>
                <br />
                Nothing here is a verdict on you. Each result just points to a
                place where two of your beliefs pull against each other — and
                what to do there is your call: drop one, add a condition, or
                make the case for the premise that joins them. Being consistent
                won&apos;t make a belief true; plenty of tidy worldviews are
                wrong. It only means your beliefs aren&apos;t quietly working
                against each other. The aim is to see what you actually believe,
                and choose it on purpose.
              </p>
            ) : null}

            {/* Personalised, explorable diagram: affirmed nodes + fired edges,
                with hover/tap to trace each belief's relationships. */}
            {affirmed.length > 0 ? (
              <figure className="mt-8 border border-rule bg-paper-soft p-5 sm:p-7">
                <figcaption className="mb-3 flex items-baseline justify-between font-sans text-[0.65rem] uppercase tracking-[0.22em] text-muted">
                  <span>
                    <span className="font-mono text-mark">fig. 2</span> &middot;
                    your beliefs on the web
                  </span>
                  <span className="tabular">
                    {affirmed.length} affirmed / {findings.length} edges
                    triggered
                  </span>
                </figcaption>
                <InteractiveBeliefWeb
                  affirmed={affirmedSet}
                  triggered={triggeredPairs}
                  findings={findings}
                />
              </figure>
            ) : null}

            {findings.length === 0 && !noDirectConflict ? (
              <p className="mt-8 border-l-2 border-rule-soft px-5 py-4 font-serif text-[1rem] italic leading-7 text-ink-soft">
                None of the explicit relationships in this version was
                triggered. Answer additional questions to broaden the check.
              </p>
            ) : findings.length === 0 ? null : (
              <div className="mt-8 space-y-4">
                {findings.map((finding) => (
                  <FindingCard key={finding.id} finding={finding} />
                ))}
              </div>
            )}

            {/* Share block */}
            <div className="mt-12 grid gap-8 border-t border-rule pt-10 lg:grid-cols-[minmax(0,1fr)_22rem]">
              <div>
                <p className="font-sans text-[0.72rem] uppercase tracking-[0.22em] text-mark">
                  <span className="section-mark" />
                  share
                </p>
                <h4 className="mt-3 font-serif text-2xl font-medium leading-tight tracking-tight text-ink">
                  A shareable card — counts &amp; structure only.
                </h4>
                <p className="mt-3 max-w-xl font-serif text-[1rem] leading-7 text-ink-soft">
                  The image shows your finding counts and the shape of your
                  affirmations on the rule-graph. Individual stances are never
                  shown. It is rendered in your browser and never uploaded.
                </p>

                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={shareBadge}
                    className="border border-ink bg-ink px-5 py-2.5 text-center font-sans text-[0.78rem] uppercase tracking-[0.18em] text-paper transition hover:bg-mark hover:border-mark"
                  >
                    System share sheet
                  </button>
                  <a
                    href={tweetUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="border border-ink px-5 py-2.5 text-center font-sans text-[0.78rem] uppercase tracking-[0.18em] text-ink transition hover:bg-ink hover:text-paper"
                  >
                    Share on X
                  </a>
                  <a
                    href={blueskyUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="border border-ink px-5 py-2.5 text-center font-sans text-[0.78rem] uppercase tracking-[0.18em] text-ink transition hover:bg-ink hover:text-paper"
                  >
                    Share on Bluesky
                  </a>
                  <a
                    href={redditUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="border border-ink px-5 py-2.5 text-center font-sans text-[0.78rem] uppercase tracking-[0.18em] text-ink transition hover:bg-ink hover:text-paper"
                  >
                    Post to Reddit
                  </a>
                </div>

                <div className="mt-3 flex flex-wrap items-baseline gap-x-5 gap-y-2 font-sans text-[0.75rem] uppercase tracking-[0.16em]">
                  <button
                    type="button"
                    onClick={copyBadge}
                    className="text-muted underline decoration-rule underline-offset-[5px] transition hover:text-ink hover:decoration-ink"
                  >
                    Copy image
                  </button>
                  <button
                    type="button"
                    onClick={downloadBadge}
                    className="text-muted underline decoration-rule underline-offset-[5px] transition hover:text-ink hover:decoration-ink"
                  >
                    Download image
                  </button>
                  <button
                    type="button"
                    onClick={copyShareText}
                    className="text-muted underline decoration-rule underline-offset-[5px] transition hover:text-ink hover:decoration-ink"
                  >
                    Copy caption
                  </button>
                </div>

                <p className="mt-4 font-serif text-[0.92rem] italic leading-6 text-muted">
                  X and Reddit open with the caption ready — attach the
                  downloaded image yourself.
                </p>

                {copyNotice ? (
                  <p
                    aria-live="polite"
                    className="mt-3 font-sans text-[0.78rem] uppercase tracking-[0.16em] text-mark"
                  >
                    {copyNotice}
                  </p>
                ) : null}
              </div>

              {badgeUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={badgeUrl}
                  alt="Shareable summary of your belief-consistency counts and your structure on the rule-graph"
                  width={1200}
                  height={630}
                  className="h-auto w-full border border-rule shadow-[6px_8px_0_0_var(--color-paper-deep)]"
                />
              ) : null}
            </div>

            {/* Compare — its own prominent step at the end of the result. */}
            {affirmed.length > 0 ? (
              <div className="mt-12 border-t border-rule pt-10">
                <p className="font-sans text-[0.72rem] uppercase tracking-[0.22em] text-indigo-ink">
                  <span className="section-mark" />
                  compare
                </p>
                <div className="mt-4 border-l-[3px] border-indigo-ink bg-paper-soft px-5 py-6 sm:px-7">
                  <h4 className="font-serif text-2xl font-medium leading-tight tracking-tight text-ink">
                    Compare your web with a friend&apos;s.
                  </h4>
                  <p className="mt-3 max-w-xl font-serif text-[1rem] leading-7 text-ink-soft">
                    Send someone a link and they&apos;ll see exactly where your
                    two webs pull apart — and the premise on each fault line.
                    Your answers travel inside the link itself; they never reach
                    our server.
                  </p>
                  <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
                    <button
                      type="button"
                      onClick={copyCompareLink}
                      className="border border-indigo-ink bg-indigo-ink px-6 py-3 font-sans text-[0.78rem] uppercase tracking-[0.18em] text-paper transition hover:border-ink hover:bg-ink"
                    >
                      Copy compare link
                    </button>
                    <Link
                      href="/compare-beliefs"
                      className="font-sans text-[0.75rem] uppercase tracking-[0.16em] text-indigo-ink underline decoration-indigo-ink/40 underline-offset-[5px] transition hover:decoration-indigo-ink"
                    >
                      Or open a link someone sent you →
                    </Link>
                  </div>
                  {compareNotice ? (
                    <p
                      aria-live="polite"
                      className="mt-4 font-sans text-[0.78rem] uppercase tracking-[0.16em] text-indigo-ink"
                    >
                      {compareNotice}
                    </p>
                  ) : null}
                </div>
              </div>
            ) : null}

            <GeneralFeedback />
          </section>
        </>
      ) : null}
    </section>
  );
}
