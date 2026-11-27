"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { ProjectCard } from "@/app/components/portfolio/project-gallery";
import ProjectViewer from "@/app/components/portfolio/project-viewer";
import { LIMITS, type Project, type PublicProject, type SaveAction } from "@/app/lib/admin/types";
import { isHttpUrl } from "@/app/lib/admin/validation";
import { apiFetch } from "../api";
import Modal from "../modal";
import Screenshots, { initialTiles, type Tile } from "./screenshots";

type Errors = Record<string, string>;
type Banner = { kind: "error" | "offline"; text: string } | null;

const SAVING_LABEL: Record<SaveAction, string> = {
  draft: "Saving draft...",
  save: "Saving...",
  publish: "Publishing...",
  unpublish: "Unpublishing...",
};

/** Field ids, in page order, used for the error summary and focus. */
const FIELD_ORDER = ["title", "summary", "tags", "link", "privacyNote", "images", "alt", "confirmedPrivacy"] as const;
const FIELD_LABEL: Record<string, string> = {
  title: "Title",
  summary: "Summary",
  tags: "Tags",
  link: "Link",
  privacyNote: "Privacy note",
  images: "Screenshots",
  alt: "Screenshot description",
  confirmedPrivacy: "Publish reminder",
};

function Field({
  id,
  label,
  helper,
  counter,
  error,
  children,
}: {
  id: string;
  label: string;
  helper?: string;
  counter?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="field">
      <div className="field-head">
        <label htmlFor={`field-${id}`}>{label}</label>
        {counter ? <span className="helper">{counter}</span> : null}
      </div>
      {children}
      {helper ? (
        <p className="helper" id={`help-${id}`}>
          {helper}
        </p>
      ) : null}
      {error ? (
        <p className="field-error" id={`err-${id}`}>
          {error}
        </p>
      ) : null}
    </div>
  );
}

export default function ProjectForm({ csrf, initial }: { csrf: string; initial: Project | null }) {
  const router = useRouter();
  const idRef = useRef<string | null>(initial?.id ?? null);
  const [status, setStatus] = useState<"draft" | "published">(initial?.status ?? "draft");
  const [title, setTitle] = useState(initial?.title ?? "");
  const [summary, setSummary] = useState(initial?.summary ?? "");
  const [tags, setTags] = useState<string[]>(initial?.tags ?? []);
  const [tagInput, setTagInput] = useState("");
  const [link, setLink] = useState(initial?.link ?? "");
  const [privacyNote, setPrivacyNote] = useState(initial?.privacyNote ?? "");
  const [tiles, setTiles] = useState<Tile[]>(() => initialTiles(initial?.images ?? []));
  const [confirmed, setConfirmed] = useState(false);

  const [errors, setErrors] = useState<Errors>({});
  const [banner, setBanner] = useState<Banner>(null);
  const [busy, setBusy] = useState<SaveAction | null>(null);
  const [dirty, setDirty] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [dialog, setDialog] = useState<null | "leave" | "unpublish" | "preview" | "expired">(null);
  const [viewing, setViewing] = useState(false);
  const busyRef = useRef(false);
  const summaryRef = useRef<HTMLDivElement>(null);

  const published = status === "published";
  const uploading = tiles.some((t) => t.status === "uploading");
  const locked = busy !== null;

  const touch = useCallback(() => setDirty(true), []);
  const onSessionEnded = useCallback(() => setDialog("expired"), []);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 5000);
    return () => clearTimeout(t);
  }, [toast]);

  function commitTag(raw: string): boolean {
    const tag = raw.trim().replace(/,+$/, "").trim();
    if (!tag) return true;
    if (tag.length > LIMITS.maxTag) {
      setErrors((e) => ({ ...e, tags: `Each tag can be up to ${LIMITS.maxTag} characters.` }));
      return false;
    }
    if (tags.some((t) => t.toLowerCase() === tag.toLowerCase())) {
      setTagInput("");
      return true;
    }
    if (tags.length >= LIMITS.maxTags) {
      setErrors((e) => ({ ...e, tags: `You can add up to ${LIMITS.maxTags} tags.` }));
      return false;
    }
    setTags((all) => [...all, tag]);
    setTagInput("");
    setErrors((e) => {
      const { tags: _drop, ...rest } = e;
      void _drop;
      return rest;
    });
    touch();
    return true;
  }

  function validate(action: SaveAction): Errors {
    const out: Errors = {};
    if (!title.trim()) out.title = "Add a title.";
    else if (title.trim().length > LIMITS.maxTitle) out.title = `Keep the title to ${LIMITS.maxTitle} characters.`;
    if (!summary.trim()) out.summary = "Add a short summary.";
    else if (summary.trim().length > LIMITS.maxSummary) out.summary = `Keep the summary to ${LIMITS.maxSummary} characters.`;
    const l = link.trim();
    if (l && (l.length > LIMITS.maxLink || !isHttpUrl(l))) out.link = "Enter a full link that starts with http:// or https://";
    if (privacyNote.trim().length > LIMITS.maxPrivacyNote) {
      out.privacyNote = `Keep the note to ${LIMITS.maxPrivacyNote} characters.`;
    }
    const done = tiles.filter((t) => t.status === "done");
    // Saving a published project keeps it published, so it follows the publish rules.
    if (action === "publish" || action === "save") {
      if (done.length < 1) out.images = "Add at least one screenshot before publishing.";
      else if (done.some((t) => !t.alt.trim())) out.alt = "Add a description for this screenshot.";
      if (!confirmed) out.confirmedPrivacy = "Tick this box to confirm before publishing.";
    }
    return out;
  }

  function focusField(key: string) {
    let id = `field-${key}`;
    if (key === "alt") {
      const missing = tiles.find((t) => t.status === "done" && !t.alt.trim());
      if (missing) id = `alt-${missing.key}`;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ block: "center" });
      el.focus();
    }
  }

  function showErrors(found: Errors) {
    setErrors(found);
    const keys = FIELD_ORDER.filter((k) => found[k]);
    setBanner(null);
    setTimeout(() => {
      summaryRef.current?.scrollIntoView({ block: "nearest" });
      if (keys[0]) focusField(keys[0]);
    }, 0);
  }

  async function submit(action: SaveAction) {
    if (busyRef.current) return;
    if (!commitTag(tagInput)) return;
    const found = validate(action);
    if (Object.keys(found).length) {
      showErrors(found);
      return;
    }
    busyRef.current = true;
    setBusy(action);
    setErrors({});
    setBanner(null);
    setDialog((d) => (d === "unpublish" ? null : d));

    const body = {
      title,
      summary,
      tags,
      link,
      privacyNote,
      images: tiles.filter((t) => t.status === "done").map((t) => ({ url: t.url, alt: t.alt })),
      action,
      confirmedPrivacy: confirmed,
    };
    const id = idRef.current;
    const res = await apiFetch(id ? `/api/admin/projects/${id}` : "/api/admin/projects", id ? "PUT" : "POST", csrf, body);

    busyRef.current = false;
    setBusy(null);

    if (res.status === 200 || res.status === 201) {
      const saved = res.data?.project?.id;
      if (saved && !idRef.current) {
        idRef.current = saved;
        window.history.replaceState(null, "", `/admin/projects/${saved}`);
      }
      setDirty(false);
      if (action === "publish") {
        router.push("/admin/projects?published=1");
        return;
      }
      if (action === "unpublish") setStatus("draft");
      setToast(action === "unpublish" ? "Unpublished. It's now in Drafts." : action === "save" ? "Changes saved." : "Draft saved.");
    } else if (res.status === 401) {
      setDialog("expired");
    } else if (res.status === 422 && res.data?.errors) {
      showErrors(res.data.errors);
    } else if (res.network) {
      setBanner({ kind: "offline", text: "You seem to be offline. Your changes are still here." });
    } else {
      setBanner({ kind: "error", text: "Couldn't save. Nothing was lost on this page. Please try again." });
    }
  }

  function goBack() {
    if (dirty) setDialog("leave");
    else router.push("/admin/projects");
  }

  const previewProject: PublicProject = {
    id: "preview",
    title: title.trim() || "Untitled project",
    summary: summary.trim(),
    tags,
    link: link.trim() && isHttpUrl(link.trim()) ? link.trim() : "",
    privacyNote: privacyNote.trim(),
    images: tiles
      .filter((t) => t.status === "done" && t.url)
      .map((t) => ({ url: t.url as string, alt: t.alt.trim(), width: 1600, height: 1000 })),
  };
  const previewWarn = tiles.some((t) => t.status === "done" && !t.alt.trim());

  const errorKeys = FIELD_ORDER.filter((k) => errors[k]);
  const doneCount = tiles.filter((t) => t.status === "done").length;

  const describe = (id: string) => [`help-${id}`, errors[id] ? `err-${id}` : ""].filter(Boolean).join(" ");

  const label = (action: SaveAction, text: string) =>
    busy === action ? (
      <>
        <span className="spinner" aria-hidden="true" /> {SAVING_LABEL[action]}
      </>
    ) : (
      text
    );

  return (
    <>
      <button type="button" className="back-link" onClick={goBack}>
        ← Back to projects
      </button>
      <h1>{initial ? "Edit project" : "Add project"}</h1>

      <div ref={summaryRef}>
        {errorKeys.length ? (
          <div className="banner banner-error" role="alert">
            <p>
              Please fix {errorKeys.length} {errorKeys.length === 1 ? "thing" : "things"} below.
            </p>
            <ul>
              {errorKeys.map((k) => (
                <li key={k}>
                  <a
                    href={`#field-${k}`}
                    onClick={(e) => {
                      e.preventDefault();
                      focusField(k);
                    }}
                  >
                    {FIELD_LABEL[k]}: {errors[k]}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        {banner ? (
          <p className="banner banner-error" role="alert">
            {banner.text}
          </p>
        ) : null}
      </div>

      <form
        className="form"
        noValidate
        onSubmit={(e) => {
          // Enter in a text field must never save or publish; only buttons do.
          e.preventDefault();
        }}
      >
        <section className="card">
          <Field id="title" error={errors.title} label="Title" helper="The project name visitors will see." counter={`${title.length}/${LIMITS.maxTitle}`}>
            <input
              id="field-title"
              type="text"
              value={title}
              disabled={locked}
              aria-invalid={errors.title ? true : undefined}
              aria-describedby={describe("title")}
              onChange={(e) => {
                setTitle(e.target.value);
                touch();
              }}
            />
          </Field>

          <Field id="summary" error={errors.summary} label="Summary" helper="One or two sentences on what it does." counter={`${summary.length}/${LIMITS.maxSummary}`}>
            <textarea
              id="field-summary"
              rows={4}
              value={summary}
              disabled={locked}
              aria-invalid={errors.summary ? true : undefined}
              aria-describedby={describe("summary")}
              onChange={(e) => {
                setSummary(e.target.value);
                touch();
              }}
            />
          </Field>

          <Field id="tags" error={errors.tags} label="Tags (optional)" helper={`Up to ${LIMITS.maxTags}. Press Enter or comma to add.`}>
            <div className="chip-input">
              {tags.map((tag) => (
                <span className="chip" key={tag}>
                  {tag}
                  <button
                    type="button"
                    className="chip-remove"
                    disabled={locked}
                    aria-label={`Remove tag ${tag}`}
                    onClick={() => {
                      setTags((all) => all.filter((t) => t !== tag));
                      touch();
                    }}
                  >
                    ×
                  </button>
                </span>
              ))}
              <input
                id="field-tags"
                type="text"
                value={tagInput}
                disabled={locked}
                placeholder={tags.length ? "" : "e.g. PHP, MySQL, Next.js"}
                aria-invalid={errors.tags ? true : undefined}
                aria-describedby={describe("tags")}
                onChange={(e) => {
                  const v = e.target.value;
                  if (v.includes(",")) {
                    const parts = v.split(",");
                    const rest = parts.pop() ?? "";
                    for (const p of parts) if (!commitTag(p)) return;
                    setTagInput(rest);
                  } else {
                    setTagInput(v);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    commitTag(tagInput);
                  } else if (e.key === "Backspace" && !tagInput && tags.length) {
                    setTags((all) => all.slice(0, -1));
                    touch();
                  }
                }}
                onBlur={() => void commitTag(tagInput)}
              />
            </div>
          </Field>

          <Field id="link" error={errors.link} label="Link (optional)" helper="Only add a link if the project is public. Leave empty for private projects.">
            <input
              id="field-link"
              type="url"
              inputMode="url"
              value={link}
              disabled={locked}
              aria-invalid={errors.link ? true : undefined}
              aria-describedby={describe("link")}
              onChange={(e) => {
                setLink(e.target.value);
                touch();
              }}
            />
          </Field>

          <Field
            id="privacyNote"
            error={errors.privacyNote}
            label="Privacy note (optional)"
            helper={'Shown under the summary, for example "Client details hidden."'}
            counter={`${privacyNote.length}/${LIMITS.maxPrivacyNote}`}
          >
            <input
              id="field-privacyNote"
              type="text"
              value={privacyNote}
              disabled={locked}
              aria-invalid={errors.privacyNote ? true : undefined}
              aria-describedby={describe("privacyNote")}
              onChange={(e) => {
                setPrivacyNote(e.target.value);
                touch();
              }}
            />
          </Field>
        </section>

        <section className="card">
          <h2>Screenshots</h2>
          <Screenshots
            tiles={tiles}
            setTiles={setTiles}
            csrf={csrf}
            disabled={locked}
            onChange={touch}
            altError={errors.alt}
            imagesError={errors.images}
            onSessionEnded={onSessionEnded}
          />
        </section>

        <section className="card">
          <div className="check-row">
            <input
              id="field-confirmedPrivacy"
              type="checkbox"
              checked={confirmed}
              disabled={locked}
              aria-invalid={errors.confirmedPrivacy ? true : undefined}
              aria-describedby={describe("confirmedPrivacy")}
              onChange={(e) => {
                setConfirmed(e.target.checked);
                if (e.target.checked) setErrors((er) => ({ ...er, confirmedPrivacy: "" }));
              }}
            />
            <label htmlFor="field-confirmedPrivacy">I&apos;ve covered confidential info in every screenshot</label>
          </div>
          <p className="helper" id="help-confirmedPrivacy">
            A reminder for you. It isn&apos;t shown on the site.
          </p>
          {errors.confirmedPrivacy ? (
            <p className="field-error" id="err-confirmedPrivacy">
              {errors.confirmedPrivacy}
            </p>
          ) : null}
        </section>

        <div className="action-bar">
          {uploading ? (
            <p className="helper action-note" role="status">
              Wait for uploads to finish.
            </p>
          ) : null}
          <div className="action-buttons">
            <button type="button" className="button button-secondary" disabled={locked} onClick={() => setDialog("preview")}>
              Preview
            </button>
            {published ? (
              <button type="button" className="button button-secondary" disabled={locked || uploading} onClick={() => setDialog("unpublish")}>
                Unpublish
              </button>
            ) : (
              <button
                type="button"
                className="button button-secondary"
                disabled={locked || uploading}
                aria-busy={busy === "draft"}
                onClick={() => void submit("draft")}
              >
                {label("draft", "Save draft")}
              </button>
            )}
            <button
              type="button"
              className="button button-primary action-primary"
              disabled={locked || uploading}
              onClick={() => void submit(published ? "save" : "publish")}
              aria-busy={busy === "publish" || busy === "save"}
            >
              {published ? label("save", "Save changes") : label("publish", "Publish")}
            </button>
          </div>
        </div>
      </form>

      {dialog === "leave" ? (
        <Modal title="Leave without saving?" onEscape={() => setDialog(null)}>
          <p>Your changes on this page haven&apos;t been saved.</p>
          <div className="modal-actions">
            <button type="button" data-autofocus className="button button-secondary" onClick={() => setDialog(null)}>
              Stay
            </button>
            <button
              type="button"
              className="button button-danger"
              onClick={() => {
                setDirty(false);
                router.push("/admin/projects");
              }}
            >
              Leave
            </button>
          </div>
        </Modal>
      ) : null}

      {dialog === "unpublish" ? (
        <Modal title={`Unpublish "${title.trim() || "this project"}"?`} onEscape={busy ? undefined : () => setDialog(null)}>
          <p>It will disappear from your site but stay in Drafts.</p>
          <div className="modal-actions">
            <button type="button" data-autofocus className="button button-secondary" disabled={locked} onClick={() => setDialog(null)}>
              Cancel
            </button>
            <button type="button" className="button button-primary" disabled={locked} aria-busy={busy === "unpublish"} onClick={() => void submit("unpublish")}>
              {busy === "unpublish" ? "Unpublishing..." : "Unpublish"}
            </button>
          </div>
        </Modal>
      ) : null}

      {dialog === "expired" ? (
        <Modal title="Your session ended">
          <p>Please sign in again. This page keeps your changes until you reload it.</p>
          <div className="modal-actions">
            <a href="/admin?expired=1" target="_blank" rel="noopener noreferrer" data-autofocus className="button button-primary">
              Sign in again
            </a>
            <button type="button" className="button button-secondary" onClick={() => setDialog(null)}>
              Back to the form
            </button>
          </div>
        </Modal>
      ) : null}

      {dialog === "preview" ? (
        <Modal title="Preview" role="dialog" onEscape={viewing ? undefined : () => setDialog(null)}>
          <div className="preview-body">
            <p className="muted">Preview. This is how visitors will see it.</p>
            {previewWarn ? (
              <p className="banner">Some screenshots have no description yet. You need one for each before publishing.</p>
            ) : null}
            {doneCount === 0 ? <p className="banner">No screenshots uploaded yet.</p> : null}
            <ProjectCard project={previewProject} draft={!published} onOpen={() => previewProject.images.length && setViewing(true)} />
          </div>
          <div className="modal-actions">
            <button type="button" data-autofocus className="button button-secondary" onClick={() => setDialog(null)}>
              Back to editing
            </button>
          </div>
          {viewing ? <ProjectViewer project={previewProject} onClose={() => setViewing(false)} /> : null}
        </Modal>
      ) : null}

      {toast ? (
        <div className="toast toast-success" role="status">
          <span>{toast}</span>
          <button type="button" className="toast-close" aria-label="Close message" onClick={() => setToast(null)}>
            ×
          </button>
        </div>
      ) : null}
    </>
  );
}
