import { cookies } from "next/headers";
import { cookieOptions, isSameOrigin, json } from "@/app/lib/admin/auth";
import { SESSION_COOKIE, authConfigured } from "@/app/lib/admin/config";
import { createLimiter, createSessionToken, safeEqual } from "@/app/lib/admin/session";

export const dynamic = "force-dynamic";

// Per-IP and overall limits (per server instance; see session.ts).
const perIp = createLimiter(5);
const overall = createLimiter(25);
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function POST(request: Request) {
  if (!authConfigured()) return json({ error: "not-configured" }, 503);
  if (!isSameOrigin(request)) return json({ error: "forbidden" }, 403);

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  if (perIp.isLocked(ip) || overall.isLocked("all")) {
    return json({ error: "locked" }, 429);
  }

  let email = "";
  let password = "";
  try {
    const body = await request.json();
    email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    password = typeof body?.password === "string" ? body.password : "";
  } catch {}

  // Evaluate both so timing doesn't reveal which one was wrong.
  const emailOk = safeEqual(email, (process.env.ADMIN_EMAIL as string).trim().toLowerCase());
  const passwordOk = safeEqual(password, process.env.ADMIN_PASSWORD as string);

  if (!(emailOk && passwordOk)) {
    perIp.fail(ip);
    overall.fail("all");
    await sleep(500);
    return json({ error: "invalid" }, 401);
  }

  perIp.reset(ip);
  const { token } = createSessionToken(process.env.SESSION_SECRET as string);
  (await cookies()).set(SESSION_COOKIE, token, cookieOptions());
  return json({ ok: true });
}
