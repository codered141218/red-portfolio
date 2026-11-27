import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, authConfigured } from "./config";
import { safeEqual, SESSION_TTL_MS, verifySessionToken, type Session } from "./session";

export async function getSession(): Promise<Session | null> {
  if (!authConfigured()) return null;
  const store = await cookies();
  return verifySessionToken(
    store.get(SESSION_COOKIE)?.value,
    process.env.SESSION_SECRET as string,
  );
}

/** For admin pages: no valid session means back to the sign-in screen. */
export async function requireSession(): Promise<Session> {
  const session = await getSession();
  if (!session) redirect("/admin?expired=1");
  return session;
}

export function cookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  };
}

export function json(body: unknown, status = 200) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

/** Browsers always send Origin on cross-site POST/PUT/DELETE. */
export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

/**
 * Guard for every admin API route: same origin, valid session cookie and a
 * matching CSRF token header. Returns a Response to send back on failure.
 */
export async function guardApi(
  request: Request,
  { csrfFrom }: { csrfFrom?: string } = {},
): Promise<{ session: Session } | { response: Response }> {
  if (!authConfigured()) return { response: json({ error: "not-configured" }, 503) };
  if (!isSameOrigin(request)) return { response: json({ error: "forbidden" }, 403) };
  const session = await getSession();
  if (!session) return { response: json({ error: "unauthorized" }, 401) };
  const csrf = csrfFrom ?? request.headers.get("x-csrf-token") ?? "";
  if (!safeEqual(csrf, session.csrf)) return { response: json({ error: "forbidden" }, 403) };
  return { session };
}
