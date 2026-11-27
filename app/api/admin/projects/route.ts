import { revalidatePath } from "next/cache";
import { guardApi, json } from "@/app/lib/admin/auth";
import { saveProject, StorageError } from "@/app/lib/admin/storage";
import { validateProjectInput } from "@/app/lib/admin/validation";

export async function POST(request: Request) {
  const guard = await guardApi(request);
  if ("response" in guard) return guard.response;

  const raw = await request.json().catch(() => null);
  const parsed = validateProjectInput(raw);
  if (!parsed.ok) return json({ errors: parsed.errors }, 422);
  if (parsed.value.action === "unpublish") return json({ errors: { action: "Unknown action." } }, 422);

  try {
    const result = await saveProject(null, parsed.value);
    if (!result.ok) return json({ errors: result.errors }, result.status);
    revalidatePath("/");
    return json({ project: result.project }, 201);
  } catch (error) {
    return json({ error: error instanceof StorageError ? error.code : "unavailable" }, 503);
  }
}
