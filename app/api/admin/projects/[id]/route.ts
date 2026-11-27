import { revalidatePath } from "next/cache";
import { guardApi, json } from "@/app/lib/admin/auth";
import { getProject, removeProject, saveProject, StorageError } from "@/app/lib/admin/storage";
import { validateProjectInput } from "@/app/lib/admin/validation";

type Ctx = { params: Promise<{ id: string }> };

const fail = (error: unknown) =>
  json({ error: error instanceof StorageError ? error.code : "unavailable" }, 503);

export async function PUT(request: Request, { params }: Ctx) {
  const guard = await guardApi(request);
  if ("response" in guard) return guard.response;
  const { id } = await params;

  const raw = await request.json().catch(() => null);
  try {
    // "save" on a published project keeps it published, so it needs the publish rules.
    const current = await getProject(id);
    if (!current) return json({ error: "not-found" }, 404);
    const action = (raw as { action?: string } | null)?.action;
    const publishing = action === "publish" || (action === "save" && current.status === "published");
    const parsed = validateProjectInput(raw, { requirePublishRules: publishing });
    if (!parsed.ok) return json({ errors: parsed.errors }, 422);

    const result = await saveProject(id, parsed.value);
    if (!result.ok) return json({ errors: result.errors }, result.status);
    revalidatePath("/");
    return json({ project: result.project });
  } catch (error) {
    return fail(error);
  }
}

export async function DELETE(request: Request, { params }: Ctx) {
  const guard = await guardApi(request);
  if ("response" in guard) return guard.response;
  const { id } = await params;
  try {
    const removed = await removeProject(id);
    if (!removed) return json({ error: "not-found" }, 404);
    revalidatePath("/");
    return json({ ok: true });
  } catch (error) {
    return fail(error);
  }
}
