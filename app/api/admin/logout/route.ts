import { cookies } from "next/headers";
import { isSameOrigin, json } from "@/app/lib/admin/auth";
import { SESSION_COOKIE } from "@/app/lib/admin/config";

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return json({ error: "forbidden" }, 403);
  (await cookies()).delete(SESSION_COOKIE);
  return json({ ok: true });
}
