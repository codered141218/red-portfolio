import { guardApi, json } from "@/app/lib/admin/auth";
import { StorageError, verifyUploadedImage } from "@/app/lib/admin/storage";
import { isOwnImageUrl } from "@/app/lib/admin/validation";

export async function POST(request: Request) {
  const guard = await guardApi(request);
  if ("response" in guard) return guard.response;

  const body = await request.json().catch(() => null);
  const url = typeof body?.url === "string" ? body.url : "";
  if (!isOwnImageUrl(url)) return json({ error: "bad-request" }, 400);

  try {
    return json(await verifyUploadedImage(url));
  } catch (error) {
    return json({ error: error instanceof StorageError ? error.code : "unavailable" }, 503);
  }
}
