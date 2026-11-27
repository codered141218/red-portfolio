"use client";

import { upload } from "@vercel/blob/client";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { ALLOWED_IMAGE_TYPES, LIMITS } from "@/app/lib/admin/types";
import { apiFetch } from "../api";

export type Tile = {
  key: string;
  name: string;
  status: "uploading" | "done" | "error";
  progress: number;
  /** Local object URL while uploading, then the stored URL. */
  preview: string;
  url?: string;
  alt: string;
  error?: string;
  file?: File;
  confirmRemove?: boolean;
};

const EXT: Record<string, string> = { "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp" };

const REASON: Record<string, (n: string) => string> = {
  empty: (n) => `${n} is empty.`,
  "too-large": (n) => `${n} is too large. Choose an image under 5 MB.`,
  unreadable: (n) => `${n} couldn't be read as an image. Try exporting it again.`,
  dimensions: (n) => `${n} couldn't be read as an image. Try exporting it again.`,
  missing: () => "Upload failed. Try again.",
};

export function initialTiles(images: { url: string; alt: string }[]): Tile[] {
  return images.map((img, i) => ({
    key: `existing-${i}-${img.url}`,
    name: `Screenshot ${i + 1}`,
    status: "done",
    progress: 100,
    preview: img.url,
    url: img.url,
    alt: img.alt,
  }));
}

export default function Screenshots({
  tiles,
  setTiles,
  csrf,
  disabled,
  onChange,
  altError,
  imagesError,
  onSessionEnded,
}: {
  tiles: Tile[];
  setTiles: React.Dispatch<React.SetStateAction<Tile[]>>;
  csrf: string;
  disabled: boolean;
  onChange: () => void;
  altError: string | undefined;
  imagesError: string | undefined;
  onSessionEnded: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const controllers = useRef(new Map<string, AbortController>());
  const objectUrls = useRef(new Set<string>());
  const [dragOver, setDragOver] = useState(false);
  const [announce, setAnnounce] = useState("");
  const [limitMsg, setLimitMsg] = useState("");
  const helpId = useId();

  useEffect(() => {
    const live = controllers.current;
    const urls = objectUrls.current;
    return () => {
      live.forEach((c) => c.abort());
      urls.forEach((u) => URL.revokeObjectURL(u));
    };
  }, []);

  const patch = useCallback(
    (key: string, change: Partial<Tile>) =>
      setTiles((all) => all.map((t) => (t.key === key ? { ...t, ...change } : t))),
    [setTiles],
  );

  const startUpload = useCallback(
    async (key: string, file: File) => {
      const controller = new AbortController();
      controllers.current.set(key, controller);
      patch(key, { status: "uploading", progress: 0, error: undefined });
      try {
        const blob = await upload(`screenshots/${crypto.randomUUID()}.${EXT[file.type]}`, file, {
          access: "public",
          handleUploadUrl: "/api/admin/upload",
          clientPayload: csrf,
          abortSignal: controller.signal,
          onUploadProgress: ({ percentage }) => patch(key, { progress: Math.round(percentage) }),
        });
        const res = await apiFetch("/api/admin/upload/verify", "POST", csrf, { url: blob.url });
        if (res.status === 401) onSessionEnded();
        const data = res.data as unknown as { ok?: boolean; reason?: string } | null;
        if (data?.ok) {
          patch(key, { status: "done", progress: 100, url: blob.url, file: undefined });
        } else {
          patch(key, {
            status: "error",
            error: (REASON[data?.reason ?? "missing"] ?? REASON.missing)(file.name),
            file: data?.reason ? undefined : file,
          });
        }
      } catch {
        if (!controller.signal.aborted) {
          patch(key, { status: "error", error: "Upload failed. Try again.", file });
        }
      } finally {
        controllers.current.delete(key);
      }
    },
    [csrf, onSessionEnded, patch],
  );

  function addFiles(list: FileList | File[]) {
    const files = Array.from(list);
    if (!files.length) return;
    onChange();
    setLimitMsg("");
    let room = LIMITS.maxImages - tiles.filter((t) => t.status !== "error").length;
    const next: Tile[] = [];
    const toUpload: { key: string; file: File }[] = [];
    for (const file of files) {
      const key = crypto.randomUUID();
      const base = { key, name: file.name, progress: 0, alt: "" };
      if (file.size === 0) {
        next.push({ ...base, status: "error", preview: "", error: `${file.name} is empty.` });
      } else if (!(ALLOWED_IMAGE_TYPES as readonly string[]).includes(file.type)) {
        next.push({ ...base, status: "error", preview: "", error: `${file.name} isn't a PNG, JPG or WebP image.` });
      } else if (file.size > LIMITS.maxImageBytes) {
        next.push({ ...base, status: "error", preview: "", error: `${file.name} is too large. Choose an image under 5 MB.` });
      } else if (room <= 0) {
        setLimitMsg(`You can add up to ${LIMITS.maxImages} screenshots.`);
      } else {
        room -= 1;
        const preview = URL.createObjectURL(file);
        objectUrls.current.add(preview);
        next.push({ ...base, status: "uploading", preview, file });
        toUpload.push({ key, file });
      }
    }
    setTiles((all) => [...all, ...next]);
    toUpload.forEach(({ key, file }) => void startUpload(key, file));
  }

  function remove(tile: Tile) {
    controllers.current.get(tile.key)?.abort();
    if (tile.preview.startsWith("blob:")) {
      URL.revokeObjectURL(tile.preview);
      objectUrls.current.delete(tile.preview);
    }
    setTiles((all) => all.filter((t) => t.key !== tile.key));
    onChange();
  }

  function move(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= tiles.length) return;
    setTiles((all) => {
      const copy = [...all];
      [copy[index], copy[target]] = [copy[target], copy[index]];
      return copy;
    });
    setAnnounce(`Moved to position ${target + 1} of ${tiles.length}.`);
    onChange();
  }

  return (
    <div>
      <p className="banner">Cover up client names and private data before you upload.</p>

      <div
        id="field-images"
        className={`dropzone${dragOver ? " is-over" : ""}`}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
        aria-describedby={helpId}
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={(e) => {
          if (!disabled && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (!disabled) addFiles(e.dataTransfer.files);
        }}
      >
        <strong>{dragOver ? "Drop to upload" : "Drag screenshots here or choose files"}</strong>
        <span className="button button-secondary" aria-hidden="true">
          Choose files
        </span>
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          multiple
          hidden
          tabIndex={-1}
          onChange={(e) => {
            if (e.target.files) addFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>
      <p id={helpId} className="helper">
        PNG, JPG or WebP. Up to 5 MB each. Up to {LIMITS.maxImages} screenshots.
      </p>
      {limitMsg ? <p className="field-error" role="alert">{limitMsg}</p> : null}
      {imagesError ? <p className="field-error" role="alert">{imagesError}</p> : null}
      {altError ? <p className="field-error" role="alert">{altError}</p> : null}

      {tiles.length ? (
        <ul className="tile-grid">
          {tiles.map((tile, i) => (
            <li key={tile.key} className={`tile tile-${tile.status}`}>
              <div className="tile-thumb">
                {tile.preview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={tile.preview} alt="" style={tile.status === "uploading" ? { opacity: 0.5 } : undefined} />
                ) : null}
                {i === 0 && tile.status === "done" ? <span className="cover-badge">Cover</span> : null}
                {tile.status === "uploading" ? (
                  <div
                    className="progress"
                    role="progressbar"
                    aria-label={`Uploading ${tile.name}`}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={tile.progress}
                  >
                    <span style={{ width: `${tile.progress}%` }} />
                  </div>
                ) : null}
              </div>

              {tile.status === "uploading" ? (
                <div className="tile-row">
                  <span className="helper">{tile.progress}%</span>
                  <button type="button" className="icon-btn" aria-label={`Cancel upload of ${tile.name}`} onClick={() => remove(tile)}>
                    ×
                  </button>
                </div>
              ) : null}

              {tile.status === "error" ? (
                <div className="tile-error">
                  <p role="alert">{tile.error}</p>
                  <div className="tile-row">
                    {tile.file ? (
                      <button type="button" className="button button-secondary" onClick={() => void startUpload(tile.key, tile.file as File)}>
                        Retry
                      </button>
                    ) : null}
                    <button type="button" className="button button-secondary" onClick={() => remove(tile)}>
                      Remove
                    </button>
                  </div>
                </div>
              ) : null}

              {tile.status === "done" ? (
                <>
                  <label htmlFor={`alt-${tile.key}`} className="tile-label">
                    Describe this screenshot
                  </label>
                  <input
                    id={`alt-${tile.key}`}
                    type="text"
                    maxLength={LIMITS.maxAlt}
                    value={tile.alt}
                    disabled={disabled}
                    aria-invalid={altError && !tile.alt.trim() ? true : undefined}
                    onChange={(e) => {
                      patch(tile.key, { alt: e.target.value });
                      onChange();
                    }}
                  />
                  <p className="helper">For people using screen readers. Example: Dashboard showing open loans by status.</p>
                  {tile.confirmRemove ? (
                    <div className="tile-confirm">
                      <span>Remove this screenshot?</span>
                      <div className="tile-row">
                        <button type="button" className="button button-secondary" onClick={() => patch(tile.key, { confirmRemove: false })}>
                          Cancel
                        </button>
                        <button type="button" className="button button-danger" onClick={() => remove(tile)}>
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="tile-row">
                      <button type="button" className="icon-btn" disabled={disabled || i === 0} aria-label={`Move ${tile.alt || tile.name} earlier`} onClick={() => move(i, -1)}>
                        ←
                      </button>
                      <button type="button" className="icon-btn" disabled={disabled || i === tiles.length - 1} aria-label={`Move ${tile.alt || tile.name} later`} onClick={() => move(i, 1)}>
                        →
                      </button>
                      <button type="button" className="icon-btn" disabled={disabled} aria-label={`Remove screenshot ${tile.alt || tile.name}`} onClick={() => patch(tile.key, { confirmRemove: true })}>
                        🗑
                      </button>
                    </div>
                  )}
                </>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}
      <p className="sr-only" aria-live="polite">{announce}</p>
    </div>
  );
}
