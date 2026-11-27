import { LIMITS, type ProjectInput, type SaveAction } from "./types.ts";

export type FieldErrors = Record<string, string>;

export type ValidationResult =
  | { ok: true; value: ProjectInput }
  | { ok: false; errors: FieldErrors };

const BLOB_HOST_SUFFIX = ".public.blob.vercel-storage.com";
const ACTIONS: SaveAction[] = ["draft", "save", "publish", "unpublish"];

/** Only screenshots in our own Blob store are accepted as image sources. */
export function isOwnImageUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      url.hostname.endsWith(BLOB_HOST_SUFFIX) &&
      url.pathname.startsWith("/screenshots/") &&
      !url.username &&
      !url.password
    );
  } catch {
    return false;
  }
}

export function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

export function validateProjectInput(
  raw: unknown,
  { requirePublishRules }: { requirePublishRules?: boolean } = {},
): ValidationResult {
  const errors: FieldErrors = {};
  const body = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;

  const action = ACTIONS.includes(body.action as SaveAction)
    ? (body.action as SaveAction)
    : null;
  if (!action) errors.action = "Unknown action.";
  const publishing = requirePublishRules ?? (action === "publish");

  const title = str(body.title);
  if (!title) errors.title = "Add a title.";
  else if (title.length > LIMITS.maxTitle) errors.title = `Keep the title to ${LIMITS.maxTitle} characters.`;

  const summary = str(body.summary);
  if (!summary) errors.summary = "Add a short summary.";
  else if (summary.length > LIMITS.maxSummary) errors.summary = `Keep the summary to ${LIMITS.maxSummary} characters.`;

  const tags: string[] = [];
  if (body.tags !== undefined && !Array.isArray(body.tags)) {
    errors.tags = "Tags must be a list.";
  } else {
    for (const t of (body.tags as unknown[] | undefined) ?? []) {
      const tag = str(t);
      if (!tag) continue;
      if (tag.length > LIMITS.maxTag) {
        errors.tags = `Each tag can be up to ${LIMITS.maxTag} characters.`;
        break;
      }
      if (!tags.some((x) => x.toLowerCase() === tag.toLowerCase())) tags.push(tag);
    }
    if (tags.length > LIMITS.maxTags) errors.tags = `You can add up to ${LIMITS.maxTags} tags.`;
  }

  const link = str(body.link);
  if (link && (link.length > LIMITS.maxLink || !isHttpUrl(link))) {
    errors.link = "Enter a full link that starts with http:// or https://";
  }

  const privacyNote = str(body.privacyNote);
  if (privacyNote.length > LIMITS.maxPrivacyNote) {
    errors.privacyNote = `Keep the note to ${LIMITS.maxPrivacyNote} characters.`;
  }

  const images: ProjectInput["images"] = [];
  const rawImages = Array.isArray(body.images) ? body.images : [];
  if (body.images !== undefined && !Array.isArray(body.images)) errors.images = "Screenshots must be a list.";
  if (rawImages.length > LIMITS.maxImages) {
    errors.images = `You can add up to ${LIMITS.maxImages} screenshots.`;
  }
  for (const item of rawImages.slice(0, LIMITS.maxImages)) {
    const rec = (item && typeof item === "object" ? item : {}) as Record<string, unknown>;
    const url = str(rec.url);
    const alt = str(rec.alt);
    if (!isOwnImageUrl(url)) {
      errors.images = "One of the screenshots isn't valid. Remove it and upload it again.";
      break;
    }
    if (alt.length > LIMITS.maxAlt) {
      errors.images = `Keep each screenshot description to ${LIMITS.maxAlt} characters.`;
      break;
    }
    images.push({ url, alt });
  }

  if (publishing) {
    if (!errors.images && images.length < 1) errors.images = "Add at least one screenshot before publishing.";
    if (!errors.images && images.some((i) => !i.alt)) errors.alt = "Add a description for this screenshot.";
    if (body.confirmedPrivacy !== true) errors.confirmedPrivacy = "Tick this box to confirm before publishing.";
  }

  if (Object.keys(errors).length) return { ok: false, errors };
  return {
    ok: true,
    value: {
      title,
      summary,
      tags,
      link,
      privacyNote,
      images,
      action: action as SaveAction,
      confirmedPrivacy: body.confirmedPrivacy === true,
    },
  };
}
