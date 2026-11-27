"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { apiFetch } from "../api";
import Modal from "../modal";

type Row = {
  id: string;
  title: string;
  summary: string;
  status: "draft" | "published";
  cover: string | null;
  count: number;
  updatedAt: string;
};

export default function ProjectList({
  projects,
  problem,
  csrf,
  justPublished,
}: {
  projects: Row[];
  problem: "not-configured" | "unavailable" | null;
  csrf: string;
  justPublished: boolean;
}) {
  const router = useRouter();
  const published = projects.filter((p) => p.status === "published");
  const drafts = projects.filter((p) => p.status === "draft");
  const [tab, setTab] = useState<"published" | "drafts">(published.length ? "published" : "drafts");
  const [removing, setRemoving] = useState<Row | null>(null);
  const [busy, setBusy] = useState(false);
  const [removeError, setRemoveError] = useState(false);
  const [toast, setToast] = useState<string | null>(justPublished ? "published" : null);
  const busyRef = useRef(false);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const rows = tab === "published" ? published : drafts;

  function onTabKey(event: React.KeyboardEvent) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    const next = tab === "published" ? "drafts" : "published";
    setTab(next);
    tabRefs.current[next]?.focus();
  }

  async function confirmRemove() {
    if (!removing || busyRef.current) return;
    busyRef.current = true;
    setBusy(true);
    setRemoveError(false);
    const res = await apiFetch(`/api/admin/projects/${removing.id}`, "DELETE", csrf);
    busyRef.current = false;
    setBusy(false);
    if (res.status === 200 || res.status === 404) {
      setRemoving(null);
      setToast("removed");
      router.refresh();
    } else if (res.status === 401) {
      window.location.assign("/admin?expired=1");
    } else {
      setRemoveError(true);
    }
  }

  return (
    <>
      <div className="page-head">
        <h1>Your projects</h1>
        <Link href="/admin/projects/new" className="button button-primary">
          Add project
        </Link>
      </div>

      {problem ? (
        <p className="banner banner-error" role="alert">
          {problem === "not-configured"
            ? "Storage isn't connected yet. Create the Blob store in Vercel (see \"How to set up\" in the README)."
            : "We couldn't load your projects. Check that the storage is set up, then reload."}{" "}
          {problem === "unavailable" ? (
            <button type="button" className="button button-secondary" onClick={() => router.refresh()}>
              Reload
            </button>
          ) : null}
        </p>
      ) : (
        <>
          <div role="tablist" aria-label="Project status" className="tabs" onKeyDown={onTabKey}>
            {(["published", "drafts"] as const).map((t) => (
              <button
                key={t}
                ref={(el) => {
                  tabRefs.current[t] = el;
                }}
                role="tab"
                id={`tab-${t}`}
                type="button"
                aria-selected={tab === t}
                aria-controls="tab-panel"
                tabIndex={tab === t ? 0 : -1}
                className="tab"
                onClick={() => setTab(t)}
              >
                {t === "published" ? `Published (${published.length})` : `Drafts (${drafts.length})`}
              </button>
            ))}
          </div>

          <div role="tabpanel" id="tab-panel" aria-labelledby={`tab-${tab}`}>
            {rows.length === 0 ? (
              <div className="empty-card">
                <h2>{tab === "published" ? "Nothing published yet." : "No drafts."}</h2>
                <p>
                  {tab === "published"
                    ? "Add a project, then press Publish to show it on your site."
                    : "Drafts you save show up here. Visitors never see them."}
                </p>
                {tab === "published" ? (
                  <Link href="/admin/projects/new" className="button button-primary">
                    Add project
                  </Link>
                ) : null}
              </div>
            ) : (
              <ul className="row-list">
                {rows.map((p) => (
                  <li className="row" key={p.id}>
                    <div className="row-thumb">
                      {p.cover ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.cover} alt="" />
                      ) : null}
                    </div>
                    <div className="row-text">
                      <div className="row-title">
                        <strong>{p.title}</strong>
                        <span className={`pill ${p.status}`}>
                          {p.status === "published" ? "Published" : "Draft"}
                        </span>
                      </div>
                      <p className="row-summary">{p.summary}</p>
                      <p className="row-meta">
                        {p.count === 1 ? "1 screenshot" : `${p.count} screenshots`} · Updated{" "}
                        {new Date(p.updatedAt).toLocaleDateString("en", { dateStyle: "medium" })}
                      </p>
                    </div>
                    <div className="row-actions">
                      <Link href={`/admin/projects/${p.id}`} className="button button-secondary">
                        Edit
                      </Link>
                      <button
                        type="button"
                        className="button button-danger"
                        onClick={() => {
                          setRemoveError(false);
                          setRemoving(p);
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}

      {removing ? (
        <Modal title={`Remove "${removing.title}"?`} onEscape={busy ? undefined : () => setRemoving(null)}>
          <p>This removes the project and its screenshots from your site. This can&apos;t be undone.</p>
          {removeError ? (
            <p className="banner banner-error" role="alert">
              Couldn&apos;t remove the project. Nothing was changed. Please try again.
            </p>
          ) : null}
          <div className="modal-actions">
            <button type="button" data-autofocus className="button button-secondary" disabled={busy} onClick={() => setRemoving(null)}>
              Cancel
            </button>
            <button type="button" className="button button-danger" disabled={busy} aria-busy={busy} onClick={confirmRemove}>
              {busy ? "Removing..." : "Remove project"}
            </button>
          </div>
        </Modal>
      ) : null}

      {toast ? (
        <div className="toast toast-success" role="status">
          <span>
            {toast === "published" ? "Published. It's live on your site now." : "Project removed."}
          </span>
          {toast === "published" ? (
            <a href="/" target="_blank" rel="noopener noreferrer">
              View site
            </a>
          ) : null}
          <button type="button" className="toast-close" aria-label="Close message" onClick={() => setToast(null)}>
            ×
          </button>
        </div>
      ) : null}
    </>
  );
}
