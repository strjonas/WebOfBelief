import { beliefStatements, type Answer, type BeliefId } from "./beliefs";
import type { AnswerMap } from "./evaluate";

/**
 * Self-contained, server-free encoding of an answer map into a short
 * URL-safe string, for the "compare your web to mine" feature.
 *
 * Privacy contract: this string is only ever carried in the URL *fragment*
 * (after `#`), which browsers never send to the server. The answer map is
 * therefore never transmitted — encoding and decoding both happen entirely in
 * the visitor's browser. Do not put it in a query string.
 *
 * Lossy collapse, documented on purpose: a shared web records four states per
 * statement — affirm / reject / qualify / open — using two bits each. "Unsure"
 * and "unanswered" both encode as `open`, because in a shared artifact both
 * mean "no committed stance," and the engine already treats them alike. Reject
 * and qualify are preserved: reject can trigger a finding, qualify marks a
 * conditional reading. Decoding `open` omits the statement from the map.
 */

export const SHARE_CODE_VERSION = 1;

/**
 * The frozen statement order the encoding is defined against. Codes are
 * positional, so this MUST NOT be reordered or edited once links exist in the
 * wild — bump SHARE_CODE_VERSION and add a new order instead. A test asserts
 * this list stays in lockstep with the belief set, so adding or removing a
 * statement fails loudly rather than silently corrupting old links.
 */
export const SHARE_CODE_ORDER_V1: readonly BeliefId[] = [
  "perfectGod",
  "noDeity",
  "gratuitousSuffering",
  "nonresistantNonbelief",
  "infallibleForeknowledge",
  "beliefNeedsEvidence",
  "moralFacts",
  "attitudeOnlyMorality",
  "divineCommandOnly",
  "independentDuty",
  "naturalMeaning",
  "meaningNeedsTranscendent",
  "determinism",
  "samePastAlternative",
  "responsibilityWithoutAlternatives",
  "physicalClosure",
  "zombieWorld",
  "consequencesOnly",
  "sideConstraints",
  "animalsMatter",
  "minorConvenienceHarmWrong",
  "factoryFarmPermissible",
];

// 2-bit code per statement. 0 is the default ("open") so absent statements and
// trailing padding both read as open.
const CODE_BY_ANSWER: Record<Answer, number> = {
  affirm: 1,
  reject: 2,
  qualify: 3,
  unsure: 0,
};
const ANSWER_BY_CODE: Record<number, Answer | undefined> = {
  0: undefined, // open — omitted from the decoded map
  1: "affirm",
  2: "reject",
  3: "qualify",
};

const BASE64URL =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";

function bytesToBase64url(bytes: Uint8Array): string {
  let out = "";
  for (let i = 0; i < bytes.length; i += 3) {
    const b0 = bytes[i];
    const b1 = i + 1 < bytes.length ? bytes[i + 1] : 0;
    const b2 = i + 2 < bytes.length ? bytes[i + 2] : 0;
    const triple = (b0 << 16) | (b1 << 8) | b2;
    const chars = i + 1 < bytes.length ? (i + 2 < bytes.length ? 4 : 3) : 2;
    for (let j = 0; j < chars; j += 1) {
      out += BASE64URL[(triple >> (18 - j * 6)) & 0x3f];
    }
  }
  return out;
}

function base64urlToBytes(str: string, byteLength: number): Uint8Array | null {
  const bytes = new Uint8Array(byteLength);
  let bitBuffer = 0;
  let bitCount = 0;
  let byteIndex = 0;
  for (const ch of str) {
    const value = BASE64URL.indexOf(ch);
    if (value < 0) return null;
    bitBuffer = (bitBuffer << 6) | value;
    bitCount += 6;
    if (bitCount >= 8) {
      bitCount -= 8;
      if (byteIndex < byteLength) {
        bytes[byteIndex] = (bitBuffer >> bitCount) & 0xff;
        byteIndex += 1;
      }
    }
  }
  return bytes;
}

const STATEMENT_COUNT = SHARE_CODE_ORDER_V1.length;
const BYTE_LENGTH = Math.ceil((STATEMENT_COUNT * 2) / 8);

/** Encode an answer map into a versioned, URL-fragment-safe code. */
export function encodeAnswers(answers: AnswerMap): string {
  const bytes = new Uint8Array(BYTE_LENGTH);
  SHARE_CODE_ORDER_V1.forEach((beliefId, index) => {
    const answer = answers[beliefId];
    const code = answer ? CODE_BY_ANSWER[answer] : 0;
    if (code === 0) return;
    const bitPos = index * 2;
    const byteIndex = Math.floor(bitPos / 8);
    const shift = 6 - (bitPos % 8); // 2-bit slots: shifts 6,4,2,0 within a byte
    bytes[byteIndex] |= code << shift;
  });
  return `v${SHARE_CODE_VERSION}.${bytesToBase64url(bytes)}`;
}

export type DecodeResult =
  | { ok: true; answers: AnswerMap }
  | { ok: false; reason: "format" | "version" };

/** Decode a code back into an answer map, or report why it could not. */
export function decodeAnswers(code: string): DecodeResult {
  const match = /^v(\d+)\.([A-Za-z0-9\-_]+)$/.exec(code.trim());
  if (!match) return { ok: false, reason: "format" };

  const version = Number(match[1]);
  if (version !== SHARE_CODE_VERSION) return { ok: false, reason: "version" };

  const bytes = base64urlToBytes(match[2], BYTE_LENGTH);
  if (!bytes) return { ok: false, reason: "format" };

  const answers: AnswerMap = {};
  SHARE_CODE_ORDER_V1.forEach((beliefId, index) => {
    const bitPos = index * 2;
    const byteIndex = Math.floor(bitPos / 8);
    const shift = 6 - (bitPos % 8);
    const value = (bytes[byteIndex] >> shift) & 0x3;
    const answer = ANSWER_BY_CODE[value];
    if (answer) answers[beliefId] = answer;
  });
  return { ok: true, answers };
}

// Re-exported so callers and tests can guard the frozen order against drift.
export const shareCodeBeliefIds = beliefStatements.map((s) => s.id);
