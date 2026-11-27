import { LIMITS } from "./types.ts";

export type ImageInfo = {
  type: "image/png" | "image/jpeg" | "image/webp";
  width: number;
  height: number;
};

export type ImageCheck =
  | { ok: true; info: ImageInfo }
  | { ok: false; reason: "empty" | "too-large" | "unreadable" | "dimensions" };

const u32be = (b: Uint8Array, o: number) =>
  ((b[o] << 24) | (b[o + 1] << 16) | (b[o + 2] << 8) | b[o + 3]) >>> 0;
const u16be = (b: Uint8Array, o: number) => (b[o] << 8) | b[o + 1];
const u24le = (b: Uint8Array, o: number) => b[o] | (b[o + 1] << 8) | (b[o + 2] << 16);

function ascii(b: Uint8Array, o: number, n: number) {
  let s = "";
  for (let i = 0; i < n && o + i < b.length; i++) s += String.fromCharCode(b[o + i]);
  return s;
}

function readPng(b: Uint8Array): ImageInfo | null {
  const sig = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  if (b.length < 24 || sig.some((v, i) => b[i] !== v)) return null;
  if (ascii(b, 12, 4) !== "IHDR") return null;
  return { type: "image/png", width: u32be(b, 16), height: u32be(b, 20) };
}

function readJpeg(b: Uint8Array): ImageInfo | null {
  if (b.length < 4 || b[0] !== 0xff || b[1] !== 0xd8) return null;
  let o = 2;
  while (o + 4 <= b.length) {
    if (b[o] !== 0xff) return null;
    let marker = b[o + 1];
    while (marker === 0xff && o + 2 < b.length) {
      o++;
      marker = b[o + 1];
    }
    o += 2;
    if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) continue;
    if (marker === 0xd9) return null;
    if (o + 2 > b.length) return null;
    const len = u16be(b, o);
    const isSof =
      marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc;
    if (isSof) {
      if (o + 7 > b.length) return null;
      return { type: "image/jpeg", height: u16be(b, o + 3), width: u16be(b, o + 5) };
    }
    if (len < 2) return null;
    o += len;
  }
  return null;
}

function readWebp(b: Uint8Array): ImageInfo | null {
  if (b.length < 30 || ascii(b, 0, 4) !== "RIFF" || ascii(b, 8, 4) !== "WEBP") return null;
  const kind = ascii(b, 12, 4);
  if (kind === "VP8X") {
    return { type: "image/webp", width: u24le(b, 24) + 1, height: u24le(b, 27) + 1 };
  }
  if (kind === "VP8L") {
    if (b[20] !== 0x2f) return null;
    const bits = b[21] | (b[22] << 8) | (b[23] << 16) | (b[24] * 2 ** 24);
    return { type: "image/webp", width: (bits & 0x3fff) + 1, height: ((bits >>> 14) & 0x3fff) + 1 };
  }
  if (kind === "VP8 ") {
    if (b[23] !== 0x9d || b[24] !== 0x01 || b[25] !== 0x2a) return null;
    return {
      type: "image/webp",
      width: (b[26] | (b[27] << 8)) & 0x3fff,
      height: (b[28] | (b[29] << 8)) & 0x3fff,
    };
  }
  return null;
}

/**
 * Checks the real bytes, not the file name or the declared type. SVG, HTML,
 * renamed files and truncated images all come back as "unreadable".
 */
export function checkImageBytes(bytes: Uint8Array): ImageCheck {
  if (bytes.length === 0) return { ok: false, reason: "empty" };
  if (bytes.length > LIMITS.maxImageBytes) return { ok: false, reason: "too-large" };
  const info = readPng(bytes) ?? readJpeg(bytes) ?? readWebp(bytes);
  if (!info) return { ok: false, reason: "unreadable" };
  const { width, height } = info;
  if (
    width < 1 ||
    height < 1 ||
    width > LIMITS.maxImageSide ||
    height > LIMITS.maxImageSide
  ) {
    return { ok: false, reason: "dimensions" };
  }
  return { ok: true, info };
}
