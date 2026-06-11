"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  beliefStatements,
  statementById,
  type BeliefId,
} from "@/lib/beliefs";
import {
  affirmedBeliefs,
  evaluateBeliefs,
  findingBeliefs,
  type AnswerMap,
  type Finding,
} from "@/lib/evaluate";
import { decodeAnswers, encodeAnswers } from "@/lib/share-code";
import { loadPersistedState, type PersistedState } from "@/lib/answer-storage";
import { findingAccents, findingLabels, findingMarks } from "@/lib/findings";
import { BeliefWebDiagram } from "./belief-web-diagram";
import { trackEvent } from "@/lib/analytics";

/** Pull a share code out of a pasted code or a full compare URL. */
function extractCode(input: string): string {
  const trimmed = input.trim();
  const hashIndex = trimmed.lastIndexOf("#");
  return hashIndex >= 0 ? trimmed.slice(hashIndex + 1) : trimmed;
}

// Read the URL fragment via useSyncExternalStore so it works across SSR and
// reacts to hashchange — without ever syncing it into state inside an effect.
function subscribeHash(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
}
function getHashSnapshot() {
  return window.location.hash;
}
function getServerHashSnapshot() {
  return "";
}

function FindingDivergence({
  finding,
  who,
}: {
  finding: Finding;
  who: "you" | "friend";
}) {
  const accent = findingAccents[finding.kind];
  return (
    <article className={`border-l-[3px] ${accent.rule} bg-paper-soft px-5 py-5`}>
      <div className="flex flex-wrap items-baseline gap-3">
        <span className={`font-mono text-xl leading-none ${accent.ink}`} aria-hidden>
          {findingMarks[finding.kind]}
        </span>
        <span className={`font-sans text-[0.66rem] uppercase tracking-[0.2em] ${accent.ink}`}>
          {findingLabels[finding.kind]} ·{" "}
          {who === "you" ? "only on your web" : "only on your friend's web"}
        </span>
        <h4 className="font-serif text-[1.15rem] font-medium leading-snug text-ink">
          {finding.title}
        </h4>
      </div>
      <p className="mt-3 font-serif text-[0.97rem] leading-7 text-ink-soft">
        {finding.explanation}
      </p>
      {finding.bridge ? (
        <p className="mt-4 border-t border-rule-soft pt-3 font-serif text-[0.95rem] italic leading-7 text-ink-soft">
          <span className="font-sans not-italic text-[0.66rem] uppercase tracking-[0.18em] text-muted">
            the premise on this fault line —{" "}
          </span>
          {finding.bridge}
        </p>
      ) : null}
    </article>
  );
}

function StanceList({
  title,
  ids,
  accent,
}: {
  title: string;
  ids: BeliefId[];
  accent: string;
}) {
  if (ids.length === 0) return null;
  return (
    <div className={`border-l-2 ${accent} pl-4`}>
      <p className="font-sans text-[0.68rem] uppercase tracking-[0.16em] text-muted">
        {title}
      </p>
      <ul className="mt-2 space-y-1.5 font-serif text-[0.95rem] leading-6 text-ink-soft">
        {ids.map((id) => (
          <li key={id}>{statementById[id].plain}</li>
        ))}
      </ul>
    </div>
  );
}

/** A code/link text input with a submit button — shared by both paste flows. */
function PasteRow({
  value,
  onChange,
  onSubmit,
  error,
  placeholder,
  ariaLabel,
}: {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  error: string | null;
  placeholder: string;
  ariaLabel: string;
}) {
  return (
    <div className="mt-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSubmit();
          }}
          placeholder={placeholder}
          aria-label={ariaLabel}
          className="w-full max-w-md border border-rule bg-paper px-4 py-2.5 font-mono text-[0.85rem] text-ink outline-none focus:border-ink"
        />
        <button
          type="button"
          onClick={onSubmit}
          className="border border-ink bg-ink px-5 py-2.5 font-sans text-[0.78rem] uppercase tracking-[0.18em] text-paper transition hover:bg-mark hover:border-mark"
        >
          Compare
        </button>
      </div>
      {error ? (
        <p className="mt-3 font-sans text-[0.78rem] uppercase tracking-[0.16em] text-mark">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function BeliefCompare() {
  const hash = useSyncExternalStore(
    subscribeHash,
    getHashSnapshot,
    getServerHashSnapshot,
  );
  // The viewer's own web. It comes either from answers already saved in this
  // browser (the common case — no need to paste a link you already have) or
  // from a code/link the viewer pastes (e.g. they're on a different device).
  const [saved, setSaved] = useState<PersistedState | null>(null);
  const [mine, setMine] = useState<AnswerMap | null>(null);
  const [mineSource, setMineSource] = useState<"saved" | "pasted" | null>(null);
  const [showPaste, setShowPaste] = useState(false);
  const [myInput, setMyInput] = useState("");
  const [myError, setMyError] = useState<string | null>(null);
  const [linkNotice, setLinkNotice] = useState<string | null>(null);

  // Decode the sharer's web from the URL fragment — client-only, never sent.
  const { their, theirError } = useMemo<{
    their: AnswerMap | null;
    theirError: "none" | "format" | "version" | null;
  }>(() => {
    const raw = hash.replace(/^#/, "");
    if (!raw) return { their: null, theirError: "none" };
    const result = decodeAnswers(raw);
    return result.ok
      ? { their: result.answers, theirError: null }
      : { their: null, theirError: result.reason };
  }, [hash]);

  // Reuse the viewer's saved web if they've taken the check on this browser.
  // Done in an effect (not a lazy initializer) so SSR and the first client
  // render stay identical — the same restore pattern the checker uses.
  useEffect(() => {
    const s = loadPersistedState();
    /* eslint-disable react-hooks/set-state-in-effect */
    setSaved(s);
    if (s && Object.keys(s.answers).length > 0) {
      setMine(s.answers);
      setMineSource("saved");
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  // Analytics is a real side-effect (not state), so it belongs in an effect.
  useEffect(() => {
    if (their) trackEvent({ name: "compare_viewed" });
  }, [their]);

  const savedAnsweredCount = saved ? Object.keys(saved.answers).length : 0;
  const hasSavedWeb = savedAnsweredCount > 0;

  function loadPasted() {
    const result = decodeAnswers(extractCode(myInput));
    if (result.ok) {
      setMine(result.answers);
      setMineSource("pasted");
      setShowPaste(false);
      setMyError(null);
      trackEvent({ name: "compare_completed" });
    } else if (result.reason === "version") {
      setMyError(
        "That code is from a different version of the check, so the two can't be compared.",
      );
    } else {
      setMyError("That doesn't look like a valid code or compare link.");
    }
  }

  function useSavedWeb() {
    if (!saved) return;
    setMine(saved.answers);
    setMineSource("saved");
    setShowPaste(false);
  }

  // No friend's web in the URL yet: treat a pasted code/link as the friend's
  // web by writing it to the hash, which `their` reads. The viewer's own web is
  // already loaded from saved answers, so this lands straight on the diff.
  function loadFriendCode() {
    const code = extractCode(myInput);
    const result = decodeAnswers(code);
    if (result.ok) {
      setMyError(null);
      setMyInput("");
      window.location.hash = code;
    } else if (result.reason === "version") {
      setMyError(
        "That code is from a different version of the check, so the two can't be compared.",
      );
    } else {
      setMyError("That doesn't look like a valid compare link or code.");
    }
  }

  async function copyMyLink() {
    if (!saved) return;
    const link = `${window.location.origin}/compare-beliefs#${encodeAnswers(saved.answers)}`;
    try {
      await navigator.clipboard.writeText(link);
      setLinkNotice("Link copied — send it to a friend to compare.");
    } catch {
      setLinkNotice("Clipboard access was unavailable in this browser.");
    }
  }

  const diff = useMemo(() => {
    if (!their || !mine) return null;
    const affirmedA = new Set(affirmedBeliefs(their)); // the sharer
    const affirmedB = new Set(affirmedBeliefs(mine)); // the viewer
    const bothAffirm: BeliefId[] = [];
    const onlyFriend: BeliefId[] = [];
    const onlyYou: BeliefId[] = [];
    let divergentStances = 0;
    for (const s of beliefStatements) {
      const inA = affirmedA.has(s.id);
      const inB = affirmedB.has(s.id);
      if (inA && inB) bothAffirm.push(s.id);
      else if (inA) onlyFriend.push(s.id);
      else if (inB) onlyYou.push(s.id);
      if ((their[s.id] ?? "open") !== (mine[s.id] ?? "open")) divergentStances += 1;
    }
    const findingsA = evaluateBeliefs(their);
    const findingsB = evaluateBeliefs(mine);
    const idsA = new Set(findingsA.map((f) => f.id));
    const idsB = new Set(findingsB.map((f) => f.id));
    const onlyFriendFindings = findingsA.filter((f) => !idsB.has(f.id));
    const onlyYouFindings = findingsB.filter((f) => !idsA.has(f.id));
    // Structural difference: a finding fires for one of you but not the other.
    const structuralEdges = [...onlyFriendFindings, ...onlyYouFindings]
      .map(findingBeliefs)
      .filter((b) => b.length >= 2)
      .map((b) => [b[0], b[1]] as [BeliefId, BeliefId]);
    return {
      affirmedA,
      affirmedB,
      bothAffirm,
      onlyFriend,
      onlyYou,
      divergentStances,
      onlyFriendFindings,
      onlyYouFindings,
      sharedFindingCount: [...idsA].filter((id) => idsB.has(id)).length,
      structuralEdges,
    };
  }, [their, mine]);

  // --- Empty / error states for the sharer's web -------------------------

  if (theirError === "none") {
    // No friend's web in the URL. What we show depends on whether the visitor
    // already has a web of their own saved in this browser.
    if (hasSavedWeb) {
      return (
        <div>
          <div className="border-l-2 border-mark pl-5">
            <p className="font-sans text-[0.7rem] uppercase tracking-[0.18em] text-mark">
              <span className="section-mark" />
              your web is ready
            </p>
            <p className="mt-2 font-serif text-[1.05rem] leading-7 text-ink-soft">
              You&apos;ve answered{" "}
              <span className="text-ink">{savedAnsweredCount}</span> of{" "}
              {beliefStatements.length} statements. A comparison needs a second
              web — open the link a friend sent you, paste their compare code
              below, or send them yours.
            </p>
          </div>

          <div className="mt-8 border-t border-rule pt-8">
            <p className="font-sans text-[0.7rem] uppercase tracking-[0.18em] text-mark">
              <span className="section-mark" />
              paste your friend&apos;s link
            </p>
            <PasteRow
              value={myInput}
              onChange={(v) => {
                setMyInput(v);
                setMyError(null);
              }}
              onSubmit={loadFriendCode}
              error={myError}
              placeholder="Paste your friend's compare link or code"
              ariaLabel="Your friend's compare link or code"
            />
          </div>

          <div className="mt-8 border-t border-rule pt-8">
            <p className="font-sans text-[0.7rem] uppercase tracking-[0.18em] text-muted">
              <span className="section-mark" />
              or share yours
            </p>
            <p className="mt-2 max-w-2xl font-serif text-[1rem] leading-7 text-ink-soft">
              Send a friend a link to your web. Your answers ride inside the
              link itself and never reach a server.
            </p>
            <button
              type="button"
              onClick={copyMyLink}
              className="mt-4 border border-ink px-5 py-2.5 font-sans text-[0.78rem] uppercase tracking-[0.18em] text-ink transition hover:bg-ink hover:text-paper"
            >
              Copy your compare link
            </button>
            {linkNotice ? (
              <p
                aria-live="polite"
                className="mt-3 font-sans text-[0.78rem] uppercase tracking-[0.16em] text-mark"
              >
                {linkNotice}
              </p>
            ) : null}
          </div>
        </div>
      );
    }
    return (
      <div className="border-l-2 border-rule pl-5">
        <p className="font-serif text-[1.05rem] leading-7 text-ink-soft">
          This page compares two belief webs side by side. There&apos;s no web
          in this link yet — take the check, then use{" "}
          <span className="text-ink">Copy compare link</span> on your result to
          send someone a link that opens here.
        </p>
        <Link
          href="/check"
          className="mt-5 inline-flex items-baseline gap-3 font-serif text-lg text-ink underline decoration-mark decoration-2 underline-offset-[6px] transition hover:decoration-ink"
        >
          Begin the check <span aria-hidden>→</span>
        </Link>
      </div>
    );
  }

  if (theirError === "version") {
    return (
      <div className="border-l-[3px] border-amber-ink bg-paper-soft px-5 py-5">
        <p className="font-sans text-[0.7rem] uppercase tracking-[0.18em] text-amber-ink">
          versions differ
        </p>
        <p className="mt-2 font-serif text-[1.02rem] leading-7 text-ink-soft">
          Your friend used a different version of the check. The statements may
          have changed, so an honest comparison isn&apos;t possible. Ask them
          for a fresh link, or{" "}
          <Link href="/check" className="text-mark underline underline-offset-[3px]">
            take the current check
          </Link>
          .
        </p>
      </div>
    );
  }

  if (theirError === "format") {
    return (
      <div className="border-l-[3px] border-mark bg-paper-soft px-5 py-5">
        <p className="font-serif text-[1.02rem] leading-7 text-ink-soft">
          This compare link looks corrupted — the web couldn&apos;t be read.
          Ask your friend to copy it again.
        </p>
      </div>
    );
  }

  if (!their) return null; // decoding on first paint

  // --- Reusable paste field (different device / not my web) ----------------

  const pasteField = (
    <PasteRow
      value={myInput}
      onChange={(v) => {
        setMyInput(v);
        setMyError(null);
      }}
      onSubmit={loadPasted}
      error={myError}
      placeholder="Paste your compare link or code"
      ariaLabel="Your compare link or code"
    />
  );

  // --- Have the sharer's web, but not the viewer's yet ----------------------

  if (!diff) {
    const affirmedTheir = new Set(affirmedBeliefs(their));
    return (
      <div>
        <figure className="border border-rule bg-paper-soft p-5 sm:p-7">
          <figcaption className="mb-3 font-sans text-[0.65rem] uppercase tracking-[0.22em] text-muted">
            <span className="font-mono text-mark">fig.</span> · your friend&apos;s
            web — {affirmedTheir.size} beliefs affirmed
          </figcaption>
          <BeliefWebDiagram
            affirmed={affirmedTheir}
            className="block h-auto w-full"
            title={`Your friend's belief web with ${affirmedTheir.size} affirmed beliefs highlighted.`}
          />
        </figure>

        <div className="mt-8 border-t border-rule pt-8">
          <p className="font-sans text-[0.7rem] uppercase tracking-[0.18em] text-mark">
            <span className="section-mark" />
            add your web
          </p>
          <p className="mt-2 max-w-2xl font-serif text-[1.05rem] leading-7 text-ink-soft">
            To compare, take the check first. Your answers stay in this browser,
            and this page will use them automatically — no link to copy or
            paste.
          </p>
          <Link
            href="/check"
            className="mt-5 inline-flex items-baseline gap-3 font-serif text-lg text-ink underline decoration-mark decoration-2 underline-offset-[6px] transition hover:decoration-ink"
          >
            Begin the check <span aria-hidden>→</span>
          </Link>

          <details className="group mt-6 border-t border-rule-soft pt-4">
            <summary className="cursor-pointer list-none font-sans text-[0.72rem] uppercase tracking-[0.18em] text-muted marker:hidden">
              <span className="group-open:hidden">
                ↳ on a different device? paste your link or code
              </span>
              <span className="hidden group-open:inline">↑ hide</span>
            </summary>
            <p className="mt-3 max-w-2xl font-serif text-[0.97rem] leading-7 text-muted">
              Nothing you paste leaves your browser.
            </p>
            {pasteField}
          </details>
        </div>
      </div>
    );
  }

  // --- The diff -------------------------------------------------------------

  return (
    <div>
      {/* Which web is being compared, and how to change it. */}
      <div className="mb-8 flex flex-col gap-3 border-l-2 border-mark bg-paper-soft px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-sans text-[0.72rem] uppercase tracking-[0.16em] text-muted">
          {mineSource === "saved" ? (
            <>
              Compared against your saved answers —{" "}
              <span className="text-ink">{savedAnsweredCount}</span> of{" "}
              {beliefStatements.length} answered.
            </>
          ) : (
            <>Compared against the web you pasted.</>
          )}
        </p>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-sans text-[0.72rem] uppercase tracking-[0.16em]">
          {mineSource === "saved" ? (
            <Link
              href="/check"
              className="text-indigo-ink underline decoration-indigo-ink/40 underline-offset-[5px] transition hover:decoration-indigo-ink"
            >
              Review or change your answers →
            </Link>
          ) : hasSavedWeb ? (
            <button
              type="button"
              onClick={useSavedWeb}
              className="text-indigo-ink underline decoration-indigo-ink/40 underline-offset-[5px] transition hover:decoration-indigo-ink"
            >
              Use your saved answers
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => setShowPaste((v) => !v)}
            className="text-muted underline decoration-rule underline-offset-[5px] transition hover:text-ink hover:decoration-ink"
          >
            {showPaste ? "Hide" : "Use a different web"}
          </button>
        </div>
      </div>
      {showPaste ? <div className="mb-8">{pasteField}</div> : null}

      <figure className="border border-rule bg-paper-soft p-5 sm:p-7">
        <figcaption className="mb-3 font-sans text-[0.65rem] uppercase tracking-[0.22em] text-muted">
          <span className="font-mono text-mark">fig.</span> · the two webs
        </figcaption>
        <BeliefWebDiagram
          affirmed={diff.affirmedA}
          affirmedB={diff.affirmedB}
          triggeredEdges={
            diff.structuralEdges.length ? diff.structuralEdges : undefined
          }
          className="block h-auto w-full"
          title="The two belief webs overlaid: nodes both of you affirm, nodes only your friend affirms, and nodes only you affirm."
        />
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 font-sans text-[0.68rem] uppercase tracking-[0.14em]">
          <span className="flex items-center gap-2">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-forest" />
            both affirm
          </span>
          <span className="flex items-center gap-2">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-mark" />
            only your friend
          </span>
          <span className="flex items-center gap-2">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-indigo-ink" />
            only you
          </span>
        </div>
      </figure>

      <p className="mt-8 border-l-2 border-mark bg-paper-soft px-5 py-4 font-serif text-[1.02rem] leading-7 text-ink-soft">
        You and your friend both affirm{" "}
        <span className="text-ink">{diff.bothAffirm.length}</span> of the same
        beliefs and take a different stance on{" "}
        <span className="text-ink">{diff.divergentStances}</span>. On the web
        above, the larger coloured nodes are where you diverge — that&apos;s
        where the two worldviews pull apart.
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <StanceList
          title="affirmed only by your friend"
          ids={diff.onlyFriend}
          accent="border-mark"
        />
        <StanceList
          title="affirmed only by you"
          ids={diff.onlyYou}
          accent="border-indigo-ink"
        />
      </div>

      <div className="mt-12">
        <h2 className="font-serif text-2xl font-medium tracking-tight text-ink">
          Where your reasoning pulls apart
        </h2>
        {diff.onlyFriendFindings.length + diff.onlyYouFindings.length > 0 ? (
          <>
            <p className="mt-3 max-w-2xl font-serif text-[1rem] leading-7 text-ink-soft">
              These relationships fire on one web but not the other — a{" "}
              <em>structural</em> difference, not just a difference of opinion.
              Each names the premise where you part ways. A live argument or a
              fork is a place to think, not a mark against either of you.
            </p>
            <div className="mt-6 space-y-4">
              {diff.onlyFriendFindings.map((f) => (
                <FindingDivergence key={`a-${f.id}`} finding={f} who="friend" />
              ))}
              {diff.onlyYouFindings.map((f) => (
                <FindingDivergence key={`b-${f.id}`} finding={f} who="you" />
              ))}
            </div>
          </>
        ) : (
          <p className="mt-3 max-w-2xl font-serif text-[1rem] italic leading-7 text-ink-soft">
            Your webs trigger the same set of findings, even where your
            individual stances differ. The shape of your reasoning is alike;
            where you diverge is in the particular beliefs above, not in the
            structure that connects them.
          </p>
        )}
      </div>

      <div className="mt-12 border-t border-rule pt-8">
        <Link
          href="/check"
          className="inline-flex items-baseline gap-3 font-serif text-lg text-ink underline decoration-mark decoration-2 underline-offset-[6px] transition hover:decoration-ink"
        >
          {mineSource === "saved"
            ? "Review the check yourself"
            : "Take the check yourself"}{" "}
          <span aria-hidden>→</span>
        </Link>
      </div>
    </div>
  );
}
