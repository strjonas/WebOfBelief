"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  beliefStatements,
  categories,
  sources,
  statementById,
  type Answer,
  type BeliefCategoryId,
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

const choices: Array<{ id: Answer; label: string }> = [
  { id: "affirm", label: "I believe this" },
  { id: "reject", label: "I do not believe this" },
  { id: "unsure", label: "Not sure" },
];

const findingLabels: Record<FindingKind, string> = {
  conflict: "Direct conflict",
  argument: "Live argument",
  implication: "Logical implication",
  compatible: "Coherent combination",
};

const findingColors: Record<FindingKind, string> = {
  conflict: "border-rose-300 bg-rose-50 text-rose-950",
  argument: "border-amber-300 bg-amber-50 text-amber-950",
  implication: "border-indigo-300 bg-indigo-50 text-indigo-950",
  compatible: "border-emerald-300 bg-emerald-50 text-emerald-950",
};

const BRAND = "Web of Belief";

interface BadgeData {
  conflicts: number;
  implications: number;
  arguments: number;
  compatibles: number;
  affirmed: number;
  host: string;
}

const badgeStats: Array<{
  key: keyof Pick<
    BadgeData,
    "conflicts" | "implications" | "arguments" | "compatibles"
  >;
  label: string;
  dot: string;
}> = [
  { key: "conflicts", label: "Conflicts", dot: "#fb7185" },
  { key: "implications", label: "Implications", dot: "#818cf8" },
  { key: "arguments", label: "Live tensions", dot: "#fbbf24" },
  { key: "compatibles", label: "Coherent", dot: "#34d399" },
];

function drawBadge(canvas: HTMLCanvasElement, data: BadgeData) {
  const w = 1200;
  const h = 630;
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.fillStyle = "#0b1220";
  ctx.fillRect(0, 0, w, h);

  // Faint "web of belief" node graph in the background.
  const nodes = [
    [980, 110],
    [1090, 210],
    [930, 250],
    [1060, 360],
    [995, 470],
    [1110, 520],
    [880, 430],
    [1015, 150],
  ];
  ctx.strokeStyle = "rgba(45, 212, 191, 0.18)";
  ctx.lineWidth = 1.5;
  for (let i = 0; i < nodes.length; i += 1) {
    for (let j = i + 1; j < nodes.length; j += 1) {
      const dx = nodes[i][0] - nodes[j][0];
      const dy = nodes[i][1] - nodes[j][1];
      if (Math.hypot(dx, dy) < 175) {
        ctx.beginPath();
        ctx.moveTo(nodes[i][0], nodes[i][1]);
        ctx.lineTo(nodes[j][0], nodes[j][1]);
        ctx.stroke();
      }
    }
  }
  ctx.fillStyle = "rgba(45, 212, 191, 0.55)";
  for (const [nx, ny] of nodes) {
    ctx.beginPath();
    ctx.arc(nx, ny, 5, 0, Math.PI * 2);
    ctx.fill();
  }

  const sans =
    "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";

  ctx.fillStyle = "#2dd4bf";
  ctx.font = `700 26px ${sans}`;
  ctx.fillText(BRAND.toUpperCase(), 80, 110);

  const consistent = data.conflicts === 0;
  ctx.fillStyle = "#f8fafc";
  ctx.font = `700 70px ${sans}`;
  const headline = consistent
    ? "My beliefs hold together."
    : `${data.conflicts} conflict${data.conflicts === 1 ? "" : "s"} to resolve.`;
  ctx.fillText(headline, 80, 250);

  ctx.fillStyle = "#94a3b8";
  ctx.font = `400 27px ${sans}`;
  ctx.fillText(
    `Checked across ${data.affirmed} stated belief${
      data.affirmed === 1 ? "" : "s"
    } — God, ethics, meaning, freedom & mind.`,
    80,
    305,
  );

  const startX = 80;
  const top = 360;
  const chipW = 242;
  const chipH = 150;
  const gap = 24;
  badgeStats.forEach((stat, index) => {
    const x = startX + index * (chipW + gap);
    ctx.fillStyle = "rgba(255,255,255,0.06)";
    ctx.beginPath();
    ctx.roundRect(x, top, chipW, chipH, 22);
    ctx.fill();

    ctx.fillStyle = stat.dot;
    ctx.beginPath();
    ctx.arc(x + 34, top + 42, 9, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#f8fafc";
    ctx.font = `700 60px ${sans}`;
    ctx.fillText(String(data[stat.key]), x + 28, top + 108);

    ctx.fillStyle = "#94a3b8";
    ctx.font = `600 22px ${sans}`;
    ctx.fillText(stat.label, x + 28, top + 138);
  });

  ctx.fillStyle = "#475569";
  ctx.font = `500 24px ${sans}`;
  ctx.fillText(`${data.host} · examine yours`, 80, 580);
}

function statementsForCategory(categoryId: BeliefCategoryId) {
  return beliefStatements.filter((statement) => statement.category === categoryId);
}

function SourceLinks({ ids }: { ids: BeliefStatement["sourceIds"] }) {
  return (
    <span className="flex flex-wrap gap-x-3 gap-y-1">
      {ids.map((sourceId) => (
        <a
          key={sourceId}
          href={sources[sourceId].url}
          target="_blank"
          rel="noreferrer"
          className="font-medium text-teal-800 underline decoration-teal-700/30 underline-offset-4 transition hover:text-teal-950"
        >
          {sources[sourceId].title}
        </a>
      ))}
    </span>
  );
}

function StatementCard({
  statement,
  answer,
  onAnswer,
}: {
  statement: BeliefStatement;
  answer?: Answer;
  onAnswer: (answer: Answer) => void;
}) {
  const selectedLabel = choices.find((choice) => choice.id === answer)?.label;

  return (
    <fieldset className="rounded-2xl border-2 border-slate-200 bg-white p-5 shadow-sm shadow-slate-950/[0.03] sm:p-6">
      <legend className="sr-only">{statement.prompt}</legend>
      <p className="text-lg font-semibold leading-7 text-slate-950">
        {statement.plain}
      </p>
      <p className="mt-2 text-sm leading-6 text-slate-500">
        <span className="font-semibold text-slate-600">Precisely: </span>
        {statement.prompt}
      </p>

      <div className="mt-5 grid gap-2 sm:grid-cols-3">
        {choices.map((choice) => {
          const selected = answer === choice.id;
          return (
            <label
              key={choice.id}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 px-4 py-3 text-sm font-medium transition ${
                selected
                  ? choice.id === "affirm"
                    ? "border-teal-700 bg-teal-50 text-teal-950"
                    : choice.id === "reject"
                      ? "border-slate-700 bg-slate-100 text-slate-950"
                      : "border-amber-600 bg-amber-50 text-amber-950"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50"
              }`}
            >
              <input
                type="radio"
                name={statement.id}
                value={choice.id}
                checked={selected}
                onChange={() => onAnswer(choice.id)}
                aria-label={`${choice.label}: ${statement.prompt}`}
                className="h-4 w-4 shrink-0 accent-teal-700"
              />
              {choice.label}
            </label>
          );
        })}
      </div>

      {selectedLabel ? (
        <p
          aria-live="polite"
          className="mt-4 rounded-lg bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700"
        >
          Recorded: {selectedLabel}.
        </p>
      ) : null}

      <details className="group mt-5 border-t border-slate-100 pt-4">
        <summary className="cursor-pointer list-none text-sm font-semibold text-teal-800 marker:hidden">
          <span className="group-open:hidden">
            Meaning, arguments, and sources
          </span>
          <span className="hidden group-open:inline">Hide background</span>
        </summary>
        <div className="mt-4 grid gap-4 text-sm leading-6 text-slate-600 md:grid-cols-2">
          <div className="rounded-xl bg-slate-50 p-4 md:col-span-2">
            <p className="mb-1 font-semibold text-slate-900">What it means</p>
            <p>{statement.clarify}</p>
          </div>
          <div>
            <p className="mb-1 font-semibold text-slate-900">
              Reason to believe it
            </p>
            <p>{statement.caseFor}</p>
          </div>
          <div>
            <p className="mb-1 font-semibold text-slate-900">
              Reason not to believe it
            </p>
            <p>{statement.caseAgainst}</p>
          </div>
          <div className="md:col-span-2">
            <p className="mb-1 font-semibold text-slate-900">Sources</p>
            <SourceLinks ids={statement.sourceIds} />
          </div>
        </div>
      </details>
    </fieldset>
  );
}

function FindingCard({ finding }: { finding: Finding }) {
  return (
    <article
      className={`rounded-2xl border-2 p-5 sm:p-6 ${findingColors[finding.kind]}`}
    >
      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em]">
          {findingLabels[finding.kind]}
        </span>
        <h4 className="text-base font-semibold">{finding.title}</h4>
      </div>
      <p className="mt-4 text-sm leading-6">{finding.explanation}</p>
      <div className="mt-4 rounded-xl bg-white/75 p-4 text-sm leading-6">
        <p className="font-semibold">Your selected beliefs used here</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          {finding.requires.map((beliefId) => (
            <li key={beliefId}>{statementById[beliefId].prompt}</li>
          ))}
        </ul>
        {finding.bridge ? (
          <>
            <p className="mt-4 font-semibold">
              Additional premise required for this argument
            </p>
            <p className="mt-1">{finding.bridge}</p>
          </>
        ) : null}
        <p className="mt-4 font-semibold">Question to revisit</p>
        <p className="mt-1">{finding.nextQuestion}</p>
      </div>
      <div className="mt-4 text-sm">
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
  const findings = useMemo(() => evaluateBeliefs(answers), [answers]);
  const affirmed = useMemo(() => affirmedBeliefs(answers), [answers]);
  const activeTopic = categories[topicIndex];
  const visibleStatements = statementsForCategory(activeTopic.id);
  const conflictCount = countFindings(findings, "conflict");
  const argumentCount = countFindings(findings, "argument");
  const implicationCount = countFindings(findings, "implication");
  const compatibleCount = countFindings(findings, "compatible");
  const isConsistent = conflictCount === 0 && affirmed.length > 0;

  const badgeData: BadgeData = useMemo(
    () => ({
      conflicts: conflictCount,
      implications: implicationCount,
      arguments: argumentCount,
      compatibles: compatibleCount,
      affirmed: affirmed.length,
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
      affirmed.length,
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
        // The user dismissed the share sheet, or it failed; nothing to do.
      }
      return;
    }
    downloadBadge();
    setCopyNotice(
      "Your browser can't share files directly, so the image was downloaded — attach it to your post.",
    );
  }, [downloadBadge]);

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
    const summary =
      `${BRAND} reflection: I answered ${answeredCount} statements; ` +
      `${unansweredCount} unanswered statements were treated as not sure. ` +
      `It identified ${conflictCount} direct conflict(s), ${implicationCount} logical implication(s), ` +
      `${argumentCount} live argument(s), and ${compatibleCount} coherent combination(s). ` +
      `It is a discussion prompt, not a verdict. ${window.location.origin}`;
    try {
      await navigator.clipboard.writeText(summary);
      setCopyNotice("Summary copied. It includes counts only, not your choices.");
    } catch {
      setCopyNotice("Clipboard access was unavailable in this browser.");
    }
  }

  return (
    <section id="check" className="scroll-mt-24 py-10 sm:py-14">
      <div className="rounded-3xl bg-slate-950 px-6 py-7 text-white sm:px-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-300">
              Start here
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Choose what you believe.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
              Answer only the questions you want to examine. Skip any
              statement; unselected answers count as Not sure when you check.
            </p>
          </div>
          <div className="w-full max-w-sm rounded-2xl bg-white/10 p-4">
            <div className="flex justify-between text-sm font-medium">
              <span>Progress</span>
              <span>
                {answeredCount} of {beliefStatements.length} answered
              </span>
            </div>
            <div
              role="progressbar"
              aria-label="Statements answered"
              aria-valuemin={0}
              aria-valuemax={beliefStatements.length}
              aria-valuenow={answeredCount}
              className="mt-3 h-2.5 overflow-hidden rounded-full bg-white/15"
            >
              <div
                className="h-full rounded-full bg-teal-300 transition-all"
                style={{
                  width: `${(answeredCount / beliefStatements.length) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
        <div className="mt-7 grid gap-3 text-sm sm:grid-cols-3">
          <p className="rounded-xl bg-white/[0.07] p-3">
            <span className="font-bold text-teal-300">1.</span> Answer any
            statements.
          </p>
          <p className="rounded-xl bg-white/[0.07] p-3">
            <span className="font-bold text-teal-300">2.</span> Skip freely:
            blank means Not sure.
          </p>
          <p className="rounded-xl bg-white/[0.07] p-3">
            <span className="font-bold text-teal-300">3.</span> Read reasons
            and sources.
          </p>
        </div>
      </div>

      <div className="mt-7 grid gap-6 lg:grid-cols-[18rem_minmax(0,1fr)]">
        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-4 lg:sticky lg:top-6">
          <p className="px-2 pb-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
            Topics
          </p>
          <nav aria-label="Belief topics" className="space-y-2">
            {categories.map((item, index) => {
              const categoryCount = statementsForCategory(item.id).length;
              const answered = answeredForCategory(item.id);
              const active = index === topicIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => moveToTopic(index)}
                  aria-label={`${item.name}. ${answered} of ${categoryCount} answered.`}
                  aria-current={active ? "step" : undefined}
                  className={`flex w-full items-center gap-3 rounded-xl border-2 p-3 text-left transition ${
                    active
                      ? "border-teal-700 bg-teal-50 text-slate-950"
                      : "border-transparent bg-slate-50 text-slate-700 hover:border-slate-300"
                  }`}
                >
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                      active
                        ? "bg-teal-700 text-white"
                        : "bg-white text-slate-500"
                    }`}
                  >
                    {index + 1}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold">
                      {item.name}
                    </span>
                    <span className="block text-xs text-slate-500">
                      {answered} / {categoryCount} answered
                    </span>
                  </span>
                </button>
              );
            })}
          </nav>
          <div className="mt-4 rounded-xl border-2 border-teal-100 bg-teal-50 p-4">
            <p className="text-sm font-semibold text-teal-950">
              Check whenever you are ready
            </p>
            <p className="mt-1 text-xs leading-5 text-teal-900/75">
              Partial results are supported. Unanswered statements are treated
              as Not sure and cannot trigger a result.
            </p>
            <button
              type="button"
              onClick={reviewResults}
              className="mt-4 w-full rounded-lg bg-teal-800 px-4 py-3 text-sm font-semibold text-white transition hover:bg-teal-900"
            >
              Check selected beliefs
            </button>
          </div>
        </aside>

        <div id="active-topic" className="scroll-mt-6">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-800">
              Topic {topicIndex + 1} of {categories.length}
            </p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
              {activeTopic.name}
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {activeTopic.description}
            </p>
          </div>

          <div className="mt-4 grid gap-4">
            {visibleStatements.map((statement) => (
              <StatementCard
                key={statement.id}
                statement={statement}
                answer={answers[statement.id]}
                onAnswer={(answer) => answerStatement(statement.id, answer)}
              />
            ))}
          </div>

          <div className="mt-6 flex flex-wrap justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4">
            {topicIndex > 0 ? (
              <button
                type="button"
                onClick={() => moveToTopic(topicIndex - 1)}
                className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-500"
              >
                Previous topic
              </button>
            ) : (
              <span />
            )}
            {topicIndex < categories.length - 1 ? (
              <button
                type="button"
                onClick={() => moveToTopic(topicIndex + 1)}
                className="rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-900"
              >
                Next topic: {categories[topicIndex + 1].name} (optional)
              </button>
            ) : (
              <button
                type="button"
                onClick={reviewResults}
                className="rounded-lg bg-teal-800 px-6 py-3 text-sm font-semibold text-white transition hover:bg-teal-900"
              >
                Check selected beliefs
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
          className="mt-10 scroll-mt-6 rounded-3xl border-2 border-slate-200 bg-white p-6 sm:p-8"
        >
          <div className="flex flex-col justify-between gap-5 border-b border-slate-100 pb-7 sm:flex-row sm:items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-800">
                Results
              </p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                {conflictCount > 0
                  ? `${conflictCount} direct conflict${
                      conflictCount === 1 ? "" : "s"
                    } to examine`
                  : isConsistent
                    ? "Your beliefs hold together"
                    : "No direct conflict detected"}
              </h3>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                Checked {affirmed.length} belief
                {affirmed.length === 1 ? "" : "s"} you selected as true. This
                check treats {unansweredCount} unselected statement
                {unansweredCount === 1 ? "" : "s"} as Not sure. Results report
                relationships in the rule set; they do not prove your complete
                worldview coherent or incoherent.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center text-xs sm:flex sm:text-sm">
              {(
                [
                  ["conflict", conflictCount],
                  ["implication", implicationCount],
                  ["argument", argumentCount],
                  ["compatible", compatibleCount],
                ] as const
              ).map(([kind, count]) => (
                <div key={kind} className="rounded-xl bg-slate-50 px-3 py-2">
                  <p className="text-lg font-semibold text-slate-950">{count}</p>
                  <p className="text-slate-500">{findingLabels[kind]}</p>
                </div>
              ))}
            </div>
          </div>

          {affirmed.length > 0 ? (
            <p className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm leading-6 text-slate-600">
              <span className="font-semibold text-slate-900">
                How to read this.
              </span>{" "}
              This is a mirror, not a judge. Every result below is a fork, not a
              verdict: where two of your beliefs pull apart, you decide which one
              to keep. Nothing here tells you the right answer — and consistency
              is a floor, not proof that a belief is true. The point is the
              examined life: to see your commitments clearly and hold them on
              purpose.
            </p>
          ) : null}

          {isConsistent ? (
            <div className="mt-7 flex items-start gap-4 rounded-2xl border-2 border-emerald-300 bg-emerald-50 p-5 text-emerald-950 sm:p-6">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="mt-0.5 h-8 w-8 shrink-0 rounded-full bg-emerald-600 p-1.5 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
              <div>
                <p className="text-base font-semibold">
                  No direct contradictions among the beliefs you affirmed.
                </p>
                <p className="mt-1 text-sm leading-6">
                  {argumentCount + implicationCount > 0
                    ? "They hold together with no flat conflict. The implications and live tensions below are not problems — just the next things worth thinking through."
                    : "On every relationship this tool checks, your stated beliefs fit together. That is a real achievement and a good place to build from — though it is a floor, not a finish line. Answer more topics to keep stress-testing it."}
                </p>
              </div>
            </div>
          ) : null}

          {findings.length === 0 && !isConsistent ? (
            <p className="mt-7 rounded-2xl bg-slate-50 p-5 text-sm leading-6 text-slate-600">
              None of the explicit relationships in this version was
              triggered. Answer additional topics to broaden the check.
            </p>
          ) : findings.length === 0 ? null : (
            <div className="mt-7 grid gap-4">
              {findings.map((finding) => (
                <FindingCard key={finding.id} finding={finding} />
              ))}
            </div>
          )}

          <div className="mt-8 grid gap-6 border-t border-slate-100 pt-7 lg:grid-cols-[minmax(0,1fr)_20rem]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-800">
                Share your web of belief
              </p>
              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
                A shareable image with your counts only — never your individual
                answers. It is drawn in your browser; nothing is uploaded.
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={shareBadge}
                  className="rounded-lg bg-teal-800 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-900"
                >
                  Share
                </button>
                <button
                  type="button"
                  onClick={copyBadge}
                  className="rounded-lg bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-900"
                >
                  Copy image
                </button>
                <button
                  type="button"
                  onClick={downloadBadge}
                  className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-500"
                >
                  Download image
                </button>
                <button
                  type="button"
                  onClick={copyPrivateSummary}
                  className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-500"
                >
                  Copy text summary
                </button>
                <button
                  type="button"
                  onClick={resetCheck}
                  className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-500"
                >
                  Start over
                </button>
              </div>
              {copyNotice ? (
                <p aria-live="polite" className="mt-4 text-sm text-teal-800">
                  {copyNotice}
                </p>
              ) : null}
            </div>
            {badgeUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={badgeUrl}
                alt="Shareable summary of your belief-consistency counts"
                width={1200}
                height={630}
                className="h-auto w-full rounded-2xl border border-slate-200 shadow-sm"
              />
            ) : null}
          </div>
        </section>
      ) : null}
    </section>
  );
}
