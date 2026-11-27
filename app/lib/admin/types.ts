/** Shared by server and client code. No server-only imports here. */

export type ProjectImage = {
  url: string;
  alt: string;
  width: number;
  height: number;
};

export type ProjectStatus = "draft" | "published";

export type Project = {
  id: string;
  title: string;
  summary: string;
  tags: string[];
  link: string;
  privacyNote: string;
  images: ProjectImage[];
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
};

export type ProjectStore = { version: 1; projects: Project[] };

/** Public view: nothing but what visitors should see. */
export type PublicProject = Pick<
  Project,
  "id" | "title" | "summary" | "tags" | "link" | "privacyNote" | "images"
>;

export type SaveAction = "draft" | "save" | "publish" | "unpublish";

export type ProjectInput = {
  title: string;
  summary: string;
  tags: string[];
  link: string;
  privacyNote: string;
  images: { url: string; alt: string; width?: number; height?: number }[];
  action: SaveAction;
  /** Private reminder tick. Required to publish, never stored. */
  confirmedPrivacy: boolean;
};

export const LIMITS = {
  maxImageBytes: 5 * 1024 * 1024,
  maxImages: 12,
  maxImageSide: 10000,
  maxTitle: 80,
  maxSummary: 280,
  maxTags: 6,
  maxTag: 24,
  maxLink: 500,
  maxPrivacyNote: 120,
  maxAlt: 140,
} as const;

export const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"] as const;
