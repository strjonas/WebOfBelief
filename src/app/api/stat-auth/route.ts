import { NextResponse } from "next/server";
import {
  AUTH_COOKIE,
  AUTH_COOKIE_PATH,
  cookieValueForToken,
  verifyPassword,
} from "@/lib/admin-auth";

export const runtime = "nodejs";

/**
 * Login/logout for the analytics dashboard. The login form on
 * /admin/analytics posts here (works without JS). Logout posts with
 * `logout=1`. On success we set/clear the httpOnly auth cookie and redirect
 * back to the dashboard.
 */
export async function POST(request: Request): Promise<Response> {
  const form = await request.formData();
  const dashboard = new URL("/admin/analytics", request.url);

  if (form.get("logout")) {
    const res = NextResponse.redirect(dashboard, { status: 303 });
    res.cookies.delete({ name: AUTH_COOKIE, path: AUTH_COOKIE_PATH });
    return res;
  }

  const password = String(form.get("password") ?? "");
  const cookieValue = cookieValueForToken();

  if (!cookieValue || !verifyPassword(password)) {
    dashboard.searchParams.set("error", "1");
    return NextResponse.redirect(dashboard, { status: 303 });
  }

  const res = NextResponse.redirect(dashboard, { status: 303 });
  res.cookies.set(AUTH_COOKIE, cookieValue, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: AUTH_COOKIE_PATH,
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
