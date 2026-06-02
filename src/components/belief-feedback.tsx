"use client";

import { useState } from "react";
import { MAX_TEXT_LENGTH, type FeedbackKind } from "@/lib/feedback-shape";

type Status = "idle" | "sending" | "sent" | "error";

async function postFeedback(payload: {
  kind: FeedbackKind;
  beliefId?: string;
  text: string;
}): Promise<"ok" | "rate-limited" | "error"> {
  try {
    const res = await fetch("/api/feedback", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) return "ok";
    if (res.status === 429) return "rate-limited";
    return "error";
  } catch {
    return "error";
  }
}

/**
 * The shared textarea + submit + status line. The caller supplies how to turn
 * the typed text into a payload, so the same box backs both the per-statement
 * and the general forms.
 */
function FeedbackBox({
  label,
  placeholder,
  buildPayload,
}: {
  label: string;
  placeholder: string;
  buildPayload: (text: string) => {
    kind: FeedbackKind;
    beliefId?: string;
    text: string;
  };
}) {
  const [text, setText] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  if (status === "sent") {
    return (
      <p
        aria-live="polite"
        className="mt-3 font-serif text-[0.92rem] italic leading-6 text-forest"
      >
        Thank you — noted. Filtered suggestions help shape later versions.
      </p>
    );
  }

  async function submit() {
    const trimmed = text.trim();
    if (trimmed.length < 2) return;
    setStatus("sending");
    const result = await postFeedback(buildPayload(trimmed));
    if (result === "ok") {
      setStatus("sent");
      setText("");
    } else {
      setStatus("error");
    }
  }

  return (
    <div className="mt-3">
      <label className="block font-sans text-[0.68rem] uppercase tracking-[0.18em] text-muted">
        {label}
      </label>
      <textarea
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder={placeholder}
        rows={3}
        maxLength={MAX_TEXT_LENGTH}
        className="mt-2 w-full resize-y border border-rule bg-paper px-3 py-2.5 font-serif text-[0.95rem] leading-6 text-ink outline-none focus:border-ink"
      />
      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2">
        <button
          type="button"
          onClick={submit}
          disabled={status === "sending" || text.trim().length < 2}
          className="border border-ink bg-ink px-4 py-2 font-sans text-[0.72rem] uppercase tracking-[0.18em] text-paper transition hover:border-mark hover:bg-mark disabled:cursor-not-allowed disabled:opacity-40"
        >
          {status === "sending" ? "Sending…" : "Send"}
        </button>
        {status === "error" ? (
          <span
            aria-live="polite"
            className="font-sans text-[0.72rem] uppercase tracking-[0.16em] text-mark"
          >
            Couldn&apos;t send — try again later.
          </span>
        ) : (
          <span className="font-sans text-[0.66rem] uppercase tracking-[0.14em] text-muted">
            Text only · no answers attached
          </span>
        )}
      </div>
    </div>
  );
}

/**
 * Per-statement feedback, tucked inside a statement's background dropdown. The
 * visitor picks whether they're flagging the wording or a missing position,
 * then writes a note tied to this exact statement.
 */
export function StatementFeedback({ beliefId }: { beliefId: string }) {
  const [kind, setKind] = useState<"rephrase" | "missing-position">("rephrase");

  const kindOptions: Array<{ id: typeof kind; label: string }> = [
    { id: "rephrase", label: "Wording" },
    { id: "missing-position", label: "Missing position" },
  ];

  return (
    <details className="group mt-5 border-t border-rule-soft pt-4">
      <summary className="cursor-pointer list-none font-sans text-[0.74rem] uppercase tracking-[0.18em] text-muted marker:hidden transition hover:text-ink">
        <span className="group-open:hidden">↳ suggest a fix for this one</span>
        <span className="hidden group-open:inline">↑ hide suggestion box</span>
      </summary>
      <div className="mt-4">
        <div
          role="radiogroup"
          aria-label="What kind of suggestion"
          className="flex flex-wrap gap-2"
        >
          {kindOptions.map((option) => {
            const active = kind === option.id;
            return (
              <button
                key={option.id}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setKind(option.id)}
                className={`border px-3 py-1.5 font-sans text-[0.66rem] uppercase tracking-[0.14em] transition ${
                  active
                    ? "border-ink bg-ink text-paper"
                    : "border-rule text-ink-soft hover:border-ink hover:text-ink"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
        <FeedbackBox
          label={
            kind === "rephrase"
              ? "How would you rephrase it?"
              : "What position is this statement missing?"
          }
          placeholder={
            kind === "rephrase"
              ? "The presupposition in this wording forces…"
              : "Someone who holds X can't answer this because…"
          }
          buildPayload={(text) => ({ kind, beliefId, text })}
        />
      </div>
    </details>
  );
}

/**
 * The catch-all box at the end of the results — a missing question, a position
 * no statement captures, or anything else.
 */
export function GeneralFeedback() {
  return (
    <div className="mt-12 border-t border-rule pt-10">
      <p className="font-sans text-[0.72rem] uppercase tracking-[0.22em] text-muted">
        <span className="section-mark" />5 &middot; help improve the check
      </p>
      <div className="mt-4 max-w-2xl">
        <h4 className="font-serif text-2xl font-medium leading-tight tracking-tight text-ink">
          Missing a position or a crucial question?
        </h4>
        <p className="mt-3 font-serif text-[1rem] leading-7 text-ink-soft">
          This is a deliberately small, source-backed set but not set in stone.
          If a view you hold has no home here, or a question you&apos;d expect
          is absent, tell us. Suggestions are read, filtered, and fold into
          later versions.
        </p>
        <details className="group mt-4">
          <summary className="cursor-pointer list-none font-sans text-[0.74rem] uppercase tracking-[0.18em] text-mark marker:hidden transition hover:text-ink">
            <span className="group-open:hidden">↳ leave a suggestion</span>
            <span className="hidden group-open:inline">
              ↑ hide suggestion box
            </span>
          </summary>
          <FeedbackBox
            label="Your suggestion"
            placeholder="A position the statements miss, a question worth adding, or anything that felt off…"
            buildPayload={(text) => ({ kind: "general", text })}
          />
        </details>
      </div>
    </div>
  );
}
