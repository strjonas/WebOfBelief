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
import { decodeAnswers } from "@/lib/share-code";
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

export function BeliefCompare() {
  const hash = useSyncExternalStore(
    subscribeHash,
    getHashSnapshot,
    getServerHashSnapshot,
  );
  const [mine, setMine] = useState<AnswerMap | null>(null);
  const [myInput, setMyInput] = useState("");
  const [myError, setMyError] = useState<string | null>(null);

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

  // Analytics is a real side-effect (not state), so it belongs in an effect.
  useEffect(() => {
    if (their) trackEvent({ name: "compare_viewed" });
  }, [their]);

  function loadMine() {
    const result = decodeAnswers(extractCode(myInput));
    if (result.ok) {
      setMine(result.answers);
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
    return (
      <div className="border-l-2 border-rule pl-5">
        <p className="font-serif text-[1.05rem] leading-7 text-ink-soft">
          This page compares two belief webs side by side. There&apos;s no web
          in this link yet — take the check, then use{" "}
          <span className="text-ink">Copy compare link</span> on your result to
          send someone a link that opens here.
        </p>
        <Link
          href="/#check"
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
          <Link href="/#check" className="text-mark underline underline-offset-[3px]">
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

  // --- Have the sharer's web; collect the viewer's --------------------------

  const myWebInput = (
    <div className="mt-8 border-t border-rule pt-8">
      <p className="font-sans text-[0.7rem] uppercase tracking-[0.18em] text-mark">
        <span className="section-mark" />
        add your web
      </p>
      <p className="mt-2 max-w-2xl font-serif text-[1rem] leading-7 text-ink-soft">
        Take the check yourself, then copy your compare link and paste it below.
        Nothing you paste leaves your browser.
      </p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="text"
          value={myInput}
          onChange={(e) => setMyInput(e.target.value)}
          placeholder="Paste your compare link or code"
          aria-label="Your compare link or code"
          className="w-full max-w-md border border-rule bg-paper px-4 py-2.5 font-mono text-[0.85rem] text-ink outline-none focus:border-ink"
        />
        <button
          type="button"
          onClick={loadMine}
          className="border border-ink bg-ink px-5 py-2.5 font-sans text-[0.78rem] uppercase tracking-[0.18em] text-paper transition hover:bg-mark hover:border-mark"
        >
          Compare
        </button>
      </div>
      {myError ? (
        <p className="mt-3 font-sans text-[0.78rem] uppercase tracking-[0.16em] text-mark">
          {myError}
        </p>
      ) : null}
      <Link
        href="/#check"
        className="mt-4 inline-block font-sans text-[0.78rem] uppercase tracking-[0.16em] text-muted underline decoration-rule underline-offset-[5px] transition hover:text-ink hover:decoration-ink"
      >
        Haven&apos;t taken it yet? Begin the check →
      </Link>
    </div>
  );

  if (!diff) {
    // Show the sharer's web alone while we wait for the viewer's.
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
        {myWebInput}
      </div>
    );
  }

  // --- The diff -------------------------------------------------------------

  const hasStructuralDifference =
    diff.onlyFriendFindings.length + diff.onlyYouFindings.length > 0;

  return (
    <div>
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
        {hasStructuralDifference ? (
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
          href="/#check"
          className="inline-flex items-baseline gap-3 font-serif text-lg text-ink underline decoration-mark decoration-2 underline-offset-[6px] transition hover:decoration-ink"
        >
          Take the check yourself <span aria-hidden>→</span>
        </Link>
      </div>
    </div>
  );
}
