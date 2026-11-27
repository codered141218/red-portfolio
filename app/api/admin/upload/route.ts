import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { guardApi, json } from "@/app/lib/admin/auth";
import { blobConfigured } from "@/app/lib/admin/config";
import { ALLOWED_IMAGE_TYPES, LIMITS } from "@/app/lib/admin/types";

// Browser uploads go straight to Blob. This route only hands out a short-lived
// token, and only to a signed-in admin, for one random-named image.
const PATHNAME_RE = /^screenshots\/[a-f0-9-]{36}\.(png|jpg|webp)$/;

export async function POST(request: Request) {
  if (!blobConfigured()) return json({ error: "not-configured" }, 503);

  const body = (await request.json().catch(() => null)) as HandleUploadBody | null;
  if (!body || body.type !== "blob.generate-client-token") return json({ error: "bad-request" }, 400);

  const guard = await guardApi(request, { csrfFrom: body.payload?.clientPayload ?? "" });
  if ("response" in guard) return guard.response;

  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        if (!PATHNAME_RE.test(pathname)) throw new Error("Invalid file name.");
        return {
          allowedContentTypes: [...ALLOWED_IMAGE_TYPES],
          maximumSizeInBytes: LIMITS.maxImageBytes,
          addRandomSuffix: true,
          validUntil: Date.now() + 10 * 60 * 1000,
        };
      },
    });
    return json(result);
  } catch {
    return json({ error: "rejected" }, 400);
  }
}
