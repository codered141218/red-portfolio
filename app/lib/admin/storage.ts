import "server-only";
import { randomBytes, randomUUID } from "node:crypto";
import { del, list, put } from "@vercel/blob";
import { blobConfigured } from "./config";
import { checkImageBytes, type ImageCheck } from "./image-check";
import {
  LIMITS,
  type Project,
  type ProjectImage,
  type ProjectInput,
  type ProjectStore,
  type PublicProject,
} from "./types";

/**
 * All data lives in the Vercel Blob store:
 *   data/<random folder>/projects-<timestamp>.json   (one new file per save)
 *   screenshots/<random>.<ext>                       (uploaded from the browser)
 * Every save writes a new JSON version and keeps the last few as backups, so a
 * bad edit can be rolled back by hand. The folder name is random so the file
 * (which also holds drafts) has no guessable address.
 */

export class StorageError extends Error {
  constructor(public code: "not-configured" | "unavailable") {
    super(code);
  }
}

const KEEP_VERSIONS = 10;
const FILE_RE = /^data\/([a-f0-9]{32})\/projects-(\d{13})\.json$/;

function ensureConfigured() {
  if (!blobConfigured()) throw new StorageError("not-configured");
}

async function listVersions() {
  const { blobs } = await list({ prefix: "data/", limit: 1000 });
  return blobs
    .filter((b) => FILE_RE.test(b.pathname))
    .sort((a, b) => (a.pathname < b.pathname ? 1 : -1)); // newest first
}

function isStore(value: unknown): value is ProjectStore {
  return (
    !!value &&
    typeof value === "object" &&
    (value as ProjectStore).version === 1 &&
    Array.isArray((value as ProjectStore).projects)
  );
}

export async function readStore(): Promise<{ store: ProjectStore; folder: string | null }> {
  ensureConfigured();
  try {
    const versions = await listVersions();
    if (!versions.length) return { store: { version: 1, projects: [] }, folder: null };
    const res = await fetch(versions[0].url, { cache: "no-store" });
    if (!res.ok) throw new Error(`read ${res.status}`);
    const data: unknown = await res.json();
    if (!isStore(data)) throw new Error("bad shape");
    return { store: data, folder: FILE_RE.exec(versions[0].pathname)![1] };
  } catch (error) {
    if (error instanceof StorageError) throw error;
    throw new StorageError("unavailable");
  }
}

async function writeStore(store: ProjectStore, folder: string | null) {
  const dir = folder ?? randomBytes(16).toString("hex");
  try {
    await put(`data/${dir}/projects-${Date.now()}.json`, JSON.stringify(store), {
      access: "public",
      contentType: "application/json",
      addRandomSuffix: false,
      allowOverwrite: false,
      cacheControlMaxAge: 60,
    });
  } catch {
    throw new StorageError("unavailable");
  }
  // Best-effort cleanup of old backups.
  try {
    const old = (await listVersions()).slice(KEEP_VERSIONS);
    if (old.length) await del(old.map((b) => b.url));
  } catch {}
}

async function deleteBlobs(urls: string[]) {
  if (!urls.length) return;
  try {
    await del(urls);
  } catch {}
}

export async function getAllProjects(): Promise<Project[]> {
  const { store } = await readStore();
  return [...store.projects].sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
}

export async function getProject(id: string): Promise<Project | null> {
  const { store } = await readStore();
  return store.projects.find((p) => p.id === id) ?? null;
}

export function toPublic(p: Project): PublicProject {
  return {
    id: p.id,
    title: p.title,
    summary: p.summary,
    tags: p.tags,
    link: p.link,
    privacyNote: p.privacyNote,
    images: p.images,
  };
}

export type PublicResult =
  | { status: "ok"; projects: PublicProject[] }
  | { status: "error" };

/** What the public page shows: published projects only. */
export async function getPublishedProjects(): Promise<PublicResult> {
  if (!blobConfigured()) return { status: "ok", projects: [] };
  try {
    const { store } = await readStore();
    const projects = store.projects
      .filter((p) => p.status === "published")
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
      .map(toPublic);
    return { status: "ok", projects };
  } catch {
    return { status: "error" };
  }
}

export type VerifyResult =
  | { ok: true; width: number; height: number }
  | { ok: false; reason: Exclude<ImageCheck, { ok: true }>["reason"] | "missing" };

/** Reads the uploaded file back and checks its real bytes. Bad files are deleted. */
export async function verifyUploadedImage(url: string): Promise<VerifyResult> {
  ensureConfigured();
  let bytes: Uint8Array;
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return { ok: false, reason: "missing" };
    const length = Number(res.headers.get("content-length") ?? 0);
    if (length > LIMITS.maxImageBytes) {
      await deleteBlobs([url]);
      return { ok: false, reason: "too-large" };
    }
    bytes = new Uint8Array(await res.arrayBuffer());
  } catch {
    throw new StorageError("unavailable");
  }
  const result = checkImageBytes(bytes);
  if (!result.ok) {
    await deleteBlobs([url]);
    return { ok: false, reason: result.reason };
  }
  return { ok: true, width: result.info.width, height: result.info.height };
}

export type SaveResult =
  | { ok: true; project: Project }
  | { ok: false; status: 404 | 422; errors: Record<string, string> };

const IMAGE_REASON: Record<string, string> = {
  empty: "A screenshot is empty. Remove it and upload it again.",
  "too-large": "A screenshot is over 5 MB. Remove it and upload a smaller one.",
  unreadable: "A screenshot couldn't be read as a PNG, JPG or WebP image.",
  dimensions: "A screenshot has unsupported dimensions.",
  missing: "A screenshot didn't finish uploading. Remove it and upload it again.",
};

/**
 * Creates (id = null) or updates a project. New screenshots are verified
 * server-side before anything is written, so a failed or fake upload can never
 * leave a half-saved project behind.
 */
export async function saveProject(id: string | null, input: ProjectInput): Promise<SaveResult> {
  const { store, folder } = await readStore();
  const existing = id ? store.projects.find((p) => p.id === id) : undefined;
  if (id && !existing) return { ok: false, status: 404, errors: { id: "not-found" } };

  const known = new Map<string, ProjectImage>();
  for (const p of store.projects) for (const img of p.images) known.set(img.url, img);

  const images: ProjectImage[] = [];
  for (const img of input.images) {
    const prior = known.get(img.url);
    if (prior) {
      images.push({ ...prior, alt: img.alt });
      continue;
    }
    const check = await verifyUploadedImage(img.url);
    if (!check.ok) {
      return { ok: false, status: 422, errors: { images: IMAGE_REASON[check.reason] } };
    }
    images.push({ url: img.url, alt: img.alt, width: check.width, height: check.height });
  }

  const now = new Date().toISOString();
  const status: Project["status"] =
    input.action === "publish"
      ? "published"
      : input.action === "unpublish" || input.action === "draft"
        ? "draft"
        : (existing?.status ?? "draft");

  const project: Project = {
    id: existing?.id ?? randomUUID(),
    title: input.title,
    summary: input.summary,
    tags: input.tags,
    link: input.link,
    privacyNote: input.privacyNote,
    images,
    status,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };

  const projects = existing
    ? store.projects.map((p) => (p.id === project.id ? project : p))
    : [...store.projects, project];
  await writeStore({ version: 1, projects }, folder);

  if (existing) {
    const kept = new Set(images.map((i) => i.url));
    await deleteBlobs(existing.images.map((i) => i.url).filter((u) => !kept.has(u)));
  }
  return { ok: true, project };
}

export async function removeProject(id: string): Promise<boolean> {
  const { store, folder } = await readStore();
  const existing = store.projects.find((p) => p.id === id);
  if (!existing) return false;
  await writeStore({ version: 1, projects: store.projects.filter((p) => p.id !== id) }, folder);
  await deleteBlobs(existing.images.map((i) => i.url));
  return true;
}
