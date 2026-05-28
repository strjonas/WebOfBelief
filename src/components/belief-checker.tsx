"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  beliefStatements,
  categories,
  sources,
  statementById,
  type Answer,
  type BeliefCategoryId,
  type BeliefId,
  type BeliefStatement,
} from "@/lib/beliefs";
import {
  affirmedBeliefs,
  countFindings,
  evaluateBeliefs,
  type AnswerMap,
  type Finding,
  type FindingKind,
} from "@/lib/evaluate";
import {
  BeliefWebDiagram,
  beliefWebDiagramEdges,
  beliefWebDiagramNodes,
} from "./belief-web-diagram";

const choices: Array<{ id: Answer; label: string; hint: string }> = [
  { id: "affirm", label: "I believe this", hint: "Affirm as worded." },
  { id: "reject", label: "I do not believe this", hint: "Deny as worded." },
  { id: "unsure", label: "Not sure", hint: "No settled view." },
  {
    id: "qualify",
    label: "Need to qualify",
    hint: "I have a view but the binary as stated doesn't capture it.",
  },
];

const findingLabels: Record<FindingKind, string> = {
  conflict: "Direct conflict",
  argument: "Live argument",
  implication: "Logical implication",
  compatible: "Coherent combination",
};

const findingMarks: Record<FindingKind, string> = {
  conflict: "⊥",
  implication: "⊢",
  argument: "‡",
  compatible: "≈",
};

const findingAccents: Record<FindingKind, { rule: string; ink: string }> = {
  conflict: { rule: "border-mark", ink: "text-mark" },
  implication: { rule: "border-indigo-ink", ink: "text-indigo-ink" },
  argument: { rule: "border-amber-ink", ink: "text-amber-ink" },
  compatible: { rule: "border-forest", ink: "text-forest" },
};

const BRAND = "Web of Belief";

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
  const mono =
    "'IBM Plex Mono', ui-monospace, 'SF Mono', Menlo, monospace";

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
  const consistent = data.conflicts === 0 && data.affirmed > 0;
  ctx.fillStyle = "#11131a";
  ctx.font = `500 60px ${serif}`;
  const headline = consistent
    ? "My beliefs hold together."
    : data.conflicts === 0
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
  const edgeColor: Record<FindingKind, string> = {
    conflict: "#7a1f1d",
    implication: "#2b3672",
    argument: "#8a5a14",
    compatible: "#2d4a36",
  };
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
    { key: "conflicts", label: "Direct conflict", color: "#7a1f1d", glyph: "⊥" },
    {
      key: "implications",
      label: "Logical implication",
      color: "#2b3672",
      glyph: "⊢",
    },
    { key: "arguments", label: "Live argument", color: "#8a5a14", glyph: "‡" },
    {
      key: "compatibles",
      label: "Coherent combination",
      color: "#2d4a36",
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

function statementsForCategory(categoryId: BeliefCategoryId) {
  return beliefStatements.filter((statement) => statement.category === categoryId);
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

function StatementCard({
  statement,
  index,
  answer,
  onAnswer,
}: {
  statement: BeliefStatement;
  index: number;
  answer?: Answer;
  onAnswer: (answer: Answer) => void;
}) {
  const selectedLabel = choices.find((choice) => choice.id === answer)?.label;

  return (
    <fieldset className="relative border-l-2 border-rule-soft pl-5 pb-7 pt-1 sm:pl-7">
      <legend className="sr-only">{statement.prompt}</legend>
      <p className="font-mono text-[0.7rem] uppercase tracking-[0.22em] text-muted">
        prop. {String(index + 1).padStart(2, "0")}
      </p>
      <p className="mt-2 font-serif text-[1.18rem] leading-7 text-ink sm:text-[1.22rem]">
        {statement.plain}
      </p>
      <p className="mt-2 font-serif text-[0.95rem] italic leading-6 text-muted">
        Precisely: {statement.prompt}
      </p>

      <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {choices.map((choice) => {
          const selected = answer === choice.id;
          const baseLabel =
            "group flex cursor-pointer items-baseline gap-3 border border-rule-soft bg-paper-soft px-4 py-3 text-[0.95rem] transition";
          const selectedClasses =
            choice.id === "affirm"
              ? "border-mark bg-paper text-ink shadow-[inset_4px_0_0_0_var(--color-mark)]"
              : choice.id === "reject"
                ? "border-ink bg-paper text-ink shadow-[inset_4px_0_0_0_var(--color-ink)]"
                : choice.id === "unsure"
                  ? "border-amber-ink bg-paper text-ink shadow-[inset_4px_0_0_0_var(--color-amber-ink)]"
                  : "border-indigo-ink bg-paper text-ink shadow-[inset_4px_0_0_0_var(--color-indigo-ink)]";
          const idleClasses =
            "text-muted hover:border-ink hover:text-ink";
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
              title={choice.hint}
              className={`${baseLabel} ${selected ? selectedClasses : idleClasses}`}
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
                className={`font-mono text-[0.78rem] tracking-[0.12em] ${
                  selected ? selectedGlyphColor : "text-muted/60"
                }`}
              >
                {selected ? "✓" : idleGlyph}
              </span>
              <span className="font-serif">{choice.label}</span>
            </label>
          );
        })}
      </div>

      {selectedLabel ? (
        <p
          aria-live="polite"
          className="mt-3 font-sans text-[0.78rem] uppercase tracking-[0.16em] text-muted"
        >
          Recorded: {selectedLabel}.
        </p>
      ) : null}

      <details className="group mt-5 border-t border-rule-soft pt-4">
        <summary className="cursor-pointer list-none font-sans text-[0.78rem] uppercase tracking-[0.18em] text-mark marker:hidden">
          <span className="group-open:hidden">
            ↳ meaning, arguments, sources
          </span>
          <span className="hidden group-open:inline">↑ hide background</span>
        </summary>
        <div className="mt-5 grid gap-5 font-serif text-[0.98rem] leading-7 text-ink-soft md:grid-cols-2">
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
        </div>
      </details>
    </fieldset>
  );
}

function FindingCard({ finding }: { finding: Finding }) {
  const accent = findingAccents[finding.kind];
  return (
    <article className={`border-l-[3px] ${accent.rule} bg-paper-soft px-5 py-6 sm:px-7`}>
      <div className="flex flex-wrap items-baseline gap-3">
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
      </div>
      <p className="mt-4 font-serif text-[1rem] leading-7 text-ink-soft">
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
    </article>
  );
}

export function BeliefChecker() {
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [topicIndex, setTopicIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [copyNotice, setCopyNotice] = useState("");

  const answeredCount = Object.keys(answers).length;
  const unansweredCount = beliefStatements.length - answeredCount;
  const qualifiedCount = Object.values(answers).filter(
    (a) => a === "qualify",
  ).length;
  const findings = useMemo(() => evaluateBeliefs(answers), [answers]);
  const affirmed = useMemo(() => affirmedBeliefs(answers), [answers]);
  const activeTopic = categories[topicIndex];
  const visibleStatements = statementsForCategory(activeTopic.id);
  const conflictCount = countFindings(findings, "conflict");
  const argumentCount = countFindings(findings, "argument");
  const implicationCount = countFindings(findings, "implication");
  const compatibleCount = countFindings(findings, "compatible");
  const isConsistent = conflictCount === 0 && affirmed.length > 0;

  const affirmedSet = useMemo(() => new Set(affirmed), [affirmed]);
  const triggeredEdges = useMemo<Array<[BeliefId, BeliefId, FindingKind]>>(() => {
    const out: Array<[BeliefId, BeliefId, FindingKind]> = [];
    for (const finding of findings) {
      if (finding.requires.length >= 2) {
        out.push([finding.requires[0], finding.requires[1], finding.kind]);
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
    if (!showResults) return;
    const canvas = canvasRef.current ?? document.createElement("canvas");
    canvasRef.current = canvas;
    try {
      drawBadge(canvas, badgeData);
      setBadgeUrl(canvas.toDataURL("image/png"));
    } catch {
      setBadgeUrl("");
    }
  }, [showResults, badgeData]);

  const downloadBadge = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
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
      } to resolve. Map yours — every call cites SEP:`;
    }
    if (isConsistent) {
      return "My beliefs hold together — no flat contradictions across the rule set (yet). Map yours — every call cites SEP:";
    }
    return "Mapping my web of belief. Every call cites SEP — see where yours pulls against itself:";
  }, [conflictCount, isConsistent]);

  const siteOrigin =
    typeof window === "undefined" ? "https://webofbelief.app" : window.location.origin;

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

  function answeredForCategory(categoryId: BeliefCategoryId) {
    return statementsForCategory(categoryId).filter(
      (statement) => answers[statement.id],
    ).length;
  }

  function answerStatement(statementId: BeliefStatement["id"], answer: Answer) {
    setAnswers((previous) => ({ ...previous, [statementId]: answer }));
    setCopyNotice("");
  }

  function moveToTopic(nextIndex: number) {
    setTopicIndex(nextIndex);
    window.requestAnimationFrame(() => {
      document
        .getElementById("active-topic")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function reviewResults() {
    setShowResults(true);
    window.requestAnimationFrame(() => {
      document
        .getElementById("results")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  function resetCheck() {
    setAnswers({});
    setTopicIndex(0);
    setShowResults(false);
    setCopyNotice("");
  }

  async function copyPrivateSummary() {
    const qualifiedNote =
      qualifiedCount > 0
        ? `${qualifiedCount} were flagged as needing qualification. `
        : "";
    const summary =
      `${BRAND} reflection: I answered ${answeredCount} statements; ` +
      `${unansweredCount} unanswered statements were treated as not sure. ` +
      qualifiedNote +
      `It identified ${conflictCount} direct conflict(s), ${implicationCount} logical implication(s), ` +
      `${argumentCount} live argument(s), and ${compatibleCount} coherent combination(s). ` +
      `It is a discussion prompt, not a verdict. ${siteOrigin}`;
    try {
      await navigator.clipboard.writeText(summary);
      setCopyNotice("Summary copied. It includes counts only, not your choices.");
    } catch {
      setCopyNotice("Clipboard access was unavailable in this browser.");
    }
  }

  // First statement index per topic — for the prop. NN numbering.
  const categoryStartIndex = useMemo(() => {
    const map = new Map<BeliefCategoryId, number>();
    let i = 0;
    for (const cat of categories) {
      map.set(cat.id, i);
      i += statementsForCategory(cat.id).length;
    }
    return map;
  }, []);

  return (
    <section id="check" className="scroll-mt-24 py-12 sm:py-16">
      {/* Section title */}
      <div className="flex flex-col gap-6 border-b border-rule pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="font-sans text-[0.72rem] uppercase tracking-[0.22em] text-mark">
            <span className="section-mark" />1 &middot; the check
          </p>
          <h2 className="mt-3 font-serif text-3xl font-medium leading-tight tracking-tight text-ink sm:text-4xl">
            Choose what you believe.
          </h2>
          <p className="mt-3 max-w-2xl font-serif text-[1.02rem] leading-7 text-ink-soft">
            Answer only the statements you want to examine. Skip any of them —
            unselected answers count as Not sure when you check. Your responses
            never leave the browser.
          </p>
        </div>
        <div className="w-full max-w-sm border-l-2 border-mark pl-5">
          <div className="flex items-baseline justify-between font-sans text-[0.72rem] uppercase tracking-[0.16em] text-muted">
            <span>progress</span>
            <span className="tabular text-ink">
              {answeredCount} of {beliefStatements.length} answered
            </span>
          </div>
          <div
            role="progressbar"
            aria-label="Statements answered"
            aria-valuemin={0}
            aria-valuemax={beliefStatements.length}
            aria-valuenow={answeredCount}
            className="mt-3 h-[3px] w-full overflow-hidden bg-rule-soft"
          >
            <div
              className="h-full bg-mark transition-all"
              style={{
                width: `${(answeredCount / beliefStatements.length) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[14rem_minmax(0,1fr)]">
        {/* Sidebar — numbered topic list */}
        <aside className="h-fit lg:sticky lg:top-6">
          <p className="font-sans text-[0.7rem] uppercase tracking-[0.22em] text-muted">
            topics
          </p>
          <nav aria-label="Belief topics" className="mt-3">
            <ol className="border-t border-rule-soft">
              {categories.map((item, index) => {
                const categoryCount = statementsForCategory(item.id).length;
                const answered = answeredForCategory(item.id);
                const active = index === topicIndex;
                const roman = ["i", "ii", "iii", "iv", "v"][index] ?? `${index + 1}`;
                return (
                  <li key={item.id} className="border-b border-rule-soft">
                    <button
                      type="button"
                      onClick={() => moveToTopic(index)}
                      aria-label={`${item.name}. ${answered} of ${categoryCount} answered.`}
                      aria-current={active ? "step" : undefined}
                      className={`flex w-full items-baseline gap-3 py-3 text-left transition ${
                        active ? "text-ink" : "text-ink-soft hover:text-ink"
                      }`}
                    >
                      <span
                        className={`font-mono text-[0.72rem] uppercase tracking-[0.18em] ${
                          active ? "text-mark" : "text-muted"
                        }`}
                      >
                        {roman}.
                      </span>
                      <span className="flex-1 font-serif text-[0.98rem] leading-snug">
                        {item.name}
                      </span>
                      <span className="font-mono tabular text-[0.72rem] text-muted">
                        {answered}/{categoryCount}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </nav>
          <div className="mt-6 border-l-2 border-mark pl-4">
            <p className="font-sans text-[0.7rem] uppercase tracking-[0.18em] text-mark">
              when ready
            </p>
            <p className="mt-2 font-serif text-[0.95rem] leading-6 text-ink-soft">
              Partial answers are fine. Skipped statements count as Not sure
              and cannot trigger a finding.
            </p>
            <button
              type="button"
              onClick={reviewResults}
              aria-label="Check selected beliefs"
              className="mt-4 w-full border border-ink bg-ink px-4 py-3 font-sans text-[0.78rem] uppercase tracking-[0.18em] text-paper transition hover:bg-mark hover:border-mark"
            >
              Check selected beliefs <span aria-hidden="true">→</span>
            </button>
          </div>
        </aside>

        {/* Main column — current topic & its statements */}
        <div id="active-topic" className="scroll-mt-6">
          <div className="border-b border-rule pb-6">
            <p className="font-sans text-[0.7rem] uppercase tracking-[0.22em] text-muted">
              topic {topicIndex + 1} of {categories.length}
            </p>
            <h3 className="mt-2 font-serif text-[1.85rem] font-medium leading-tight tracking-tight text-ink sm:text-3xl">
              {activeTopic.name}
            </h3>
            <p className="mt-3 max-w-2xl font-serif text-[1rem] italic leading-7 text-ink-soft">
              {activeTopic.description}
            </p>
          </div>

          <div className="mt-7 space-y-1">
            {visibleStatements.map((statement, localIdx) => {
              const startIdx = categoryStartIndex.get(activeTopic.id) ?? 0;
              return (
                <StatementCard
                  key={statement.id}
                  statement={statement}
                  index={startIdx + localIdx}
                  answer={answers[statement.id]}
                  onAnswer={(answer) => answerStatement(statement.id, answer)}
                />
              );
            })}
          </div>

          <div className="mt-8 flex flex-wrap items-baseline justify-between gap-4 border-t border-rule pt-6">
            {topicIndex > 0 ? (
              <button
                type="button"
                onClick={() => moveToTopic(topicIndex - 1)}
                aria-label="Previous topic"
                className="font-sans text-[0.78rem] uppercase tracking-[0.18em] text-muted underline decoration-rule underline-offset-[5px] transition hover:text-ink hover:decoration-ink"
              >
                <span aria-hidden="true">←</span> previous topic
              </button>
            ) : (
              <span />
            )}
            {topicIndex < categories.length - 1 ? (
              <button
                type="button"
                onClick={() => moveToTopic(topicIndex + 1)}
                aria-label={`Next topic: ${categories[topicIndex + 1].name} (optional)`}
                className="font-sans text-[0.78rem] uppercase tracking-[0.18em] text-ink underline decoration-mark decoration-2 underline-offset-[5px] transition hover:decoration-ink"
              >
                Next topic: {categories[topicIndex + 1].name} (optional){" "}
                <span aria-hidden="true">→</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={reviewResults}
                aria-label="Check selected beliefs"
                className="border border-ink bg-ink px-5 py-3 font-sans text-[0.78rem] uppercase tracking-[0.18em] text-paper transition hover:bg-mark hover:border-mark"
              >
                Check selected beliefs <span aria-hidden="true">→</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {showResults ? (
        <section
          id="results"
          aria-live="polite"
          aria-label="Reflection results"
          className="mt-14 scroll-mt-6 border-t border-rule pt-10"
        >
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-start">
            <div>
              <p className="font-sans text-[0.72rem] uppercase tracking-[0.22em] text-mark">
                <span className="section-mark" />2 &middot; the result
              </p>
              <h3 className="mt-3 font-serif text-3xl font-medium leading-tight tracking-tight text-ink sm:text-4xl">
                {conflictCount > 0
                  ? `${conflictCount} direct conflict${
                      conflictCount === 1 ? "" : "s"
                    } to examine`
                  : isConsistent
                    ? "Your beliefs hold together"
                    : "No direct conflict detected"}
              </h3>
              <p className="mt-4 max-w-2xl font-serif text-[1rem] leading-7 text-ink-soft">
                Checked {affirmed.length} belief
                {affirmed.length === 1 ? "" : "s"} you selected as true. This
                check treats {unansweredCount} unselected statement
                {unansweredCount === 1 ? "" : "s"} as Not sure
                {qualifiedCount > 0
                  ? `, and ignores ${qualifiedCount} you flagged as needing qualification`
                  : ""}
                . Results report relationships in the rule set; they do not
                prove your complete worldview coherent or incoherent.
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

          {affirmed.length > 0 ? (
            <p className="mt-8 border-l-2 border-mark bg-paper-soft px-5 py-4 font-serif text-[1rem] leading-7 text-ink-soft">
              <span className="font-sans text-[0.7rem] uppercase tracking-[0.18em] text-mark">
                <span className="section-mark" />
                how to read this
              </span>
              <br />
              This is a mirror, not a judge. Every result below is a fork, not a
              verdict: where two of your beliefs pull apart, you decide which
              one to keep. Nothing here tells you the right answer — and
              consistency is a floor, not proof that a belief is true. The
              point is the examined life: to see your commitments clearly and
              hold them on purpose.
            </p>
          ) : null}

          {/* Personalised diagram showing affirmed nodes + triggered edges */}
          {affirmed.length > 0 ? (
            <figure className="mt-8 border border-rule bg-paper-soft p-5 sm:p-7">
              <figcaption className="mb-3 flex items-baseline justify-between font-sans text-[0.65rem] uppercase tracking-[0.22em] text-muted">
                <span>
                  <span className="font-mono text-mark">fig. 2</span> &middot;
                  your beliefs on the web
                </span>
                <span className="tabular">
                  {affirmed.length} affirmed / {findings.length} edges triggered
                </span>
              </figcaption>
              <BeliefWebDiagram
                affirmed={affirmedSet}
                triggeredEdges={triggeredPairs.length ? triggeredPairs : undefined}
                className="block h-auto w-full"
                title={`Diagram of the engine's belief web with your ${affirmed.length} affirmed beliefs highlighted in oxblood and ${findings.length} edges triggered.`}
              />
            </figure>
          ) : null}

          {isConsistent ? (
            <div className="mt-8 border-l-[3px] border-forest bg-paper-soft px-5 py-5">
              <p className="font-sans text-[0.7rem] uppercase tracking-[0.18em] text-forest">
                <span className="section-mark" />
                coherent across the checks
              </p>
              <p className="mt-3 font-serif text-[1.05rem] leading-7 text-ink">
                No direct contradictions among the beliefs you affirmed.
              </p>
              <p className="mt-2 font-serif text-[0.97rem] italic leading-7 text-ink-soft">
                {argumentCount + implicationCount > 0
                  ? "They hold together with no flat conflict. The implications and live tensions below are not problems — just the next things worth thinking through."
                  : "On every relationship this tool checks, your stated beliefs fit together. That is a real achievement and a good place to build from — though it is a floor, not a finish line. Answer more topics to keep stress-testing it."}
              </p>
            </div>
          ) : null}

          {findings.length === 0 && !isConsistent ? (
            <p className="mt-8 border-l-2 border-rule-soft px-5 py-4 font-serif text-[1rem] italic leading-7 text-ink-soft">
              None of the explicit relationships in this version was triggered.
              Answer additional topics to broaden the check.
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
                <span className="section-mark" />3 &middot; share
              </p>
              <h4 className="mt-3 font-serif text-2xl font-medium leading-tight tracking-tight text-ink">
                A shareable broadside — counts &amp; structure only.
              </h4>
              <p className="mt-3 max-w-xl font-serif text-[1rem] leading-7 text-ink-soft">
                The image shows your finding counts and the shape of your
                affirmations on the rule-graph. Individual stances are never
                shown. It is rendered in your browser and never uploaded.
              </p>

              <div className="mt-6 flex flex-wrap items-baseline gap-x-5 gap-y-3">
                <button
                  type="button"
                  onClick={shareBadge}
                  className="border border-ink bg-ink px-5 py-2.5 font-sans text-[0.78rem] uppercase tracking-[0.18em] text-paper transition hover:bg-mark hover:border-mark"
                >
                  System share sheet
                </button>
                <a
                  href={tweetUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="border border-ink px-5 py-2.5 font-sans text-[0.78rem] uppercase tracking-[0.18em] text-ink transition hover:bg-ink hover:text-paper"
                >
                  Share on X
                </a>
                <a
                  href={blueskyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="border border-ink px-5 py-2.5 font-sans text-[0.78rem] uppercase tracking-[0.18em] text-ink transition hover:bg-ink hover:text-paper"
                >
                  Share on Bluesky
                </a>
                <a
                  href={redditUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="border border-ink px-5 py-2.5 font-sans text-[0.78rem] uppercase tracking-[0.18em] text-ink transition hover:bg-ink hover:text-paper"
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
                <button
                  type="button"
                  onClick={copyPrivateSummary}
                  className="text-muted underline decoration-rule underline-offset-[5px] transition hover:text-ink hover:decoration-ink"
                >
                  Copy text summary
                </button>
                <button
                  type="button"
                  onClick={resetCheck}
                  className="text-muted underline decoration-rule underline-offset-[5px] transition hover:text-ink hover:decoration-ink"
                >
                  Start over
                </button>
              </div>

              <p className="mt-4 font-serif text-[0.92rem] italic leading-6 text-muted">
                Image attachment for X / Reddit posts requires uploading the
                downloaded or copied image manually — the intent links open with
                the caption prefilled.
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
        </section>
      ) : null}
    </section>
  );
}
