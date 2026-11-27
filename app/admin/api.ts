export type ApiResult = {
  status: number;
  data: { errors?: Record<string, string>; error?: string; project?: { id: string } } | null;
  network?: boolean;
};

/** JSON fetch for the admin API; never throws. */
export async function apiFetch(
  path: string,
  method: "POST" | "PUT" | "DELETE",
  csrf: string,
  body?: unknown,
): Promise<ApiResult> {
  try {
    const res = await fetch(path, {
      method,
      headers: { "Content-Type": "application/json", "x-csrf-token": csrf },
      body: body === undefined ? undefined : JSON.stringify(body),
      credentials: "same-origin",
    });
    const data = await res.json().catch(() => null);
    return { status: res.status, data };
  } catch {
    return { status: 0, data: null, network: true };
  }
}
