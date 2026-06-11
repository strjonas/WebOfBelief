import type { Answer, BeliefId } from "./beliefs";
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

export const SHARE_CODE_VERSION = 3;

/**
 * Versioned frozen statement orders. Codes are positional, so an existing
 * order MUST NOT be reordered or edited once links exist in the wild. Add a
 * new order and bump SHARE_CODE_VERSION instead; old orders remain decodable
 * with newer statements left open.
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

export const SHARE_CODE_ORDER_V2: readonly BeliefId[] = [
  ...SHARE_CODE_ORDER_V1,
  "futureAiConscious",
];

export const SHARE_CODE_ORDER_V3: readonly BeliefId[] = [
  ...SHARE_CODE_ORDER_V2,
  "spiritualReality",
  "constructedMorality",
  "ordinaryKnowledge",
  "radicalSkepticalScenario",
  "psychologicalContinuity",
  "bodilySoulContinuity",
];

const CURRENT_SHARE_CODE_ORDER = SHARE_CODE_ORDER_V3;

const SHARE_CODE_ORDERS: Partial<Record<number, readonly BeliefId[]>> = {
  1: SHARE_CODE_ORDER_V1,
  2: SHARE_CODE_ORDER_V2,
  3: SHARE_CODE_ORDER_V3,
};

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

function byteLengthFor(statementCount: number): number {
  return Math.ceil((statementCount * 2) / 8);
}

/** Encode an answer map into a versioned, URL-fragment-safe code. */
export function encodeAnswers(answers: AnswerMap): string {
  const byteLength = byteLengthFor(CURRENT_SHARE_CODE_ORDER.length);
  const bytes = new Uint8Array(byteLength);
  CURRENT_SHARE_CODE_ORDER.forEach((beliefId, index) => {
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
  const order = SHARE_CODE_ORDERS[version];
  if (!order) return { ok: false, reason: "version" };

  const bytes = base64urlToBytes(match[2], byteLengthFor(order.length));
  if (!bytes) return { ok: false, reason: "format" };

  const answers: AnswerMap = {};
  order.forEach((beliefId, index) => {
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
export const shareCodeBeliefIds = CURRENT_SHARE_CODE_ORDER;
