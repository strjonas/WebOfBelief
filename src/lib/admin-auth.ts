import "server-only";
import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/**
 * Single-admin gate for /admin/analytics. The password lives in the
 * STAT_ACC_TOKEN env var. On success we set an httpOnly cookie holding the
 * SHA-256 of the token (never the token itself), and re-check that hash on
 * every request. Change STAT_ACC_TOKEN to instantly invalidate old cookies.
 */

export const AUTH_COOKIE = "wob_stat_auth";
export const AUTH_COOKIE_PATH = "/admin";

/** Whether an admin password has been configured at all. */
export function isConfigured(): boolean {
  return Boolean(process.env.STAT_ACC_TOKEN);
}

/** The cookie value we expect for the current token, or null if unconfigured. */
export function cookieValueForToken(): string | null {
  const token = process.env.STAT_ACC_TOKEN;
  if (!token) return null;
  return createHash("sha256").update(token).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

/** Constant-time check of a submitted password against STAT_ACC_TOKEN. */
export function verifyPassword(password: string): boolean {
  const token = process.env.STAT_ACC_TOKEN;
  if (!token) return false;
  return safeEqual(password, token);
}

/** True when the request carries a valid admin cookie. */
export async function isAuthed(): Promise<boolean> {
  const expected = cookieValueForToken();
  if (!expected) return false;
  const jar = await cookies();
  const got = jar.get(AUTH_COOKIE)?.value;
  return Boolean(got) && safeEqual(got!, expected);
}
