import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";

export const SESSION_TTL_MS = 8 * 60 * 60 * 1000;
export const LOCK_WINDOW_MS = 15 * 60 * 1000;

/** Constant-time string compare (hashes first so lengths never leak). */
export function safeEqual(a: string, b: string): boolean {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

const b64 = (s: string | Buffer) => Buffer.from(s).toString("base64url");

function sign(payload: string, secret: string) {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

export type Session = { exp: number; csrf: string };

export function createSessionToken(secret: string, now = Date.now()) {
  const session: Session = {
    exp: now + SESSION_TTL_MS,
    csrf: randomBytes(24).toString("base64url"),
  };
  const payload = b64(JSON.stringify(session));
  return { token: `${payload}.${sign(payload, secret)}`, session };
}

export function verifySessionToken(
  token: string | undefined,
  secret: string,
  now = Date.now(),
): Session | null {
  if (!token || !secret) return null;
  const [payload, signature, extra] = token.split(".");
  if (!payload || !signature || extra !== undefined) return null;
  const expected = sign(payload, secret);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (
      typeof data?.exp !== "number" ||
      typeof data?.csrf !== "string" ||
      data.exp <= now
    ) {
      return null;
    }
    return { exp: data.exp, csrf: data.csrf };
  } catch {
    return null;
  }
}

/**
 * Failed-login limiter. In memory, so it is per server instance: it slows
 * guessing down but is not a hard global guarantee on serverless hosting.
 */
export function createLimiter(max: number, windowMs = LOCK_WINDOW_MS) {
  const failures = new Map<string, number[]>();
  const recent = (key: string, now: number) => {
    const list = (failures.get(key) ?? []).filter((t) => now - t < windowMs);
    if (list.length) failures.set(key, list);
    else failures.delete(key);
    return list;
  };
  return {
    isLocked: (key: string, now = Date.now()) => recent(key, now).length >= max,
    fail: (key: string, now = Date.now()) => {
      const list = recent(key, now);
      list.push(now);
      failures.set(key, list);
    },
    reset: (key: string) => failures.delete(key),
  };
}
