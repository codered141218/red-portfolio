"use client";

import { useState } from "react";
import { apiFetch } from "./api";

export default function SignOutButton({ csrf }: { csrf: string }) {
  const [busy, setBusy] = useState(false);
  return (
    <button
      type="button"
      className="button button-secondary"
      disabled={busy}
      aria-busy={busy}
      onClick={async () => {
        setBusy(true);
        await apiFetch("/api/admin/logout", "POST", csrf);
        window.location.assign("/admin");
      }}
    >
      {busy ? "Signing out..." : "Sign out"}
    </button>
  );
}
