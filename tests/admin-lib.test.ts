import assert from "node:assert/strict";
import { test } from "node:test";
import { checkImageBytes } from "../app/lib/admin/image-check.ts";
import {
  createLimiter,
  createSessionToken,
  safeEqual,
  SESSION_TTL_MS,
  verifySessionToken,
} from "../app/lib/admin/session.ts";
import { isOwnImageUrl, validateProjectInput } from "../app/lib/admin/validation.ts";

const SECRET = "x".repeat(40);

function png(width: number, height: number) {
  const b = new Uint8Array(33);
  b.set([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 13, 0x49, 0x48, 0x44, 0x52]);
  new DataView(b.buffer).setUint32(16, width);
  new DataView(b.buffer).setUint32(20, height);
  return b;
}

test("png: reads dimensions from the header", () => {
  const r = checkImageBytes(png(1280, 800));
  assert.equal(r.ok && r.info.width, 1280);
  assert.equal(r.ok && r.info.height, 800);
});

test("jpeg: reads dimensions from the SOF marker", () => {
  const b = new Uint8Array([
    0xff, 0xd8, 0xff, 0xe0, 0, 4, 0, 0, 0xff, 0xc0, 0, 11, 8, 0x01, 0xe0, 0x02, 0x80, 1, 0, 0,
  ]);
  const r = checkImageBytes(b);
  assert.deepEqual(r.ok && [r.info.type, r.info.width, r.info.height], ["image/jpeg", 640, 480]);
});

test("webp: VP8X dimensions", () => {
  const b = new Uint8Array(30);
  b.set([...Buffer.from("RIFF")], 0);
  b.set([...Buffer.from("WEBP")], 8);
  b.set([...Buffer.from("VP8X")], 12);
  b.set([99 & 255, 0, 0], 24); // width-1 = 99
  b.set([49, 0, 0], 27); // height-1 = 49
  const r = checkImageBytes(b);
  assert.deepEqual(r.ok && [r.info.width, r.info.height], [100, 50]);
});

test("rejects svg, html, renamed text, empty, oversized and huge-dimension files", () => {
  const enc = (s: string) => new TextEncoder().encode(s);
  assert.deepEqual(checkImageBytes(enc('<svg xmlns="http://www.w3.org/2000/svg"></svg>')), { ok: false, reason: "unreadable" });
  assert.deepEqual(checkImageBytes(enc("<html></html>")), { ok: false, reason: "unreadable" });
  assert.deepEqual(checkImageBytes(new Uint8Array(0)), { ok: false, reason: "empty" });
  assert.deepEqual(checkImageBytes(new Uint8Array(5 * 1024 * 1024 + 1)), { ok: false, reason: "too-large" });
  assert.deepEqual(checkImageBytes(png(20000, 10)), { ok: false, reason: "dimensions" });
  assert.deepEqual(checkImageBytes(png(0, 10)), { ok: false, reason: "dimensions" });
});

test("session token round trip, tamper and expiry", () => {
  const { token } = createSessionToken(SECRET, 1000);
  assert.ok(verifySessionToken(token, SECRET, 2000));
  assert.equal(verifySessionToken(token, "y".repeat(40), 2000), null);
  assert.equal(verifySessionToken(token + "a", SECRET, 2000), null);
  const [payload, sig] = token.split(".");
  assert.equal(verifySessionToken(`${payload}x.${sig}`, SECRET, 2000), null);
  assert.equal(verifySessionToken(token, SECRET, 1000 + SESSION_TTL_MS), null);
  assert.equal(verifySessionToken(undefined, SECRET), null);
  assert.equal(verifySessionToken("a.b.c", SECRET), null);
});

test("safeEqual", () => {
  assert.equal(safeEqual("abc", "abc"), true);
  assert.equal(safeEqual("abc", "abd"), false);
  assert.equal(safeEqual("abc", "abcd"), false);
});

test("limiter locks after max failures and unlocks after the window", () => {
  const l = createLimiter(3, 1000);
  for (let i = 0; i < 3; i++) l.fail("ip", 0);
  assert.equal(l.isLocked("ip", 500), true);
  assert.equal(l.isLocked("other", 500), false);
  assert.equal(l.isLocked("ip", 1001), false);
  l.fail("ip", 2000);
  l.reset("ip");
  assert.equal(l.isLocked("ip", 2001), false);
});

const goodUrl = "https://abc123.public.blob.vercel-storage.com/screenshots/a-b.png";

test("image url allow-list", () => {
  assert.equal(isOwnImageUrl(goodUrl), true);
  assert.equal(isOwnImageUrl("http://abc.public.blob.vercel-storage.com/screenshots/a.png"), false);
  assert.equal(isOwnImageUrl("https://evil.example.com/screenshots/a.png"), false);
  assert.equal(isOwnImageUrl("https://abc.public.blob.vercel-storage.com/other/a.png"), false);
  assert.equal(isOwnImageUrl("javascript:alert(1)"), false);
});

test("draft needs title and summary only; publish needs image, alt and tick", () => {
  const draft = validateProjectInput({ action: "draft", title: " My app ", summary: "Does things", images: [{ url: goodUrl, alt: "" }] });
  assert.equal(draft.ok, true);

  const bad = validateProjectInput({ action: "publish", title: "A", summary: "B", images: [{ url: goodUrl, alt: "" }] });
  assert.equal(bad.ok, false);
  assert.ok(!bad.ok && bad.errors.alt && bad.errors.confirmedPrivacy);

  const none = validateProjectInput({ action: "publish", title: "A", summary: "B", images: [], confirmedPrivacy: true });
  assert.ok(!none.ok && none.errors.images);

  const ok = validateProjectInput({ action: "publish", title: "A", summary: "B", images: [{ url: goodUrl, alt: "Dash" }], confirmedPrivacy: true });
  assert.equal(ok.ok, true);
});

test("validation: links, tags, lengths and image count", () => {
  const base = { action: "draft", title: "A", summary: "B" };
  assert.ok(!validateProjectInput({ ...base, link: "javascript:alert(1)" }).ok);
  assert.ok(!validateProjectInput({ ...base, link: "ftp://x.com" }).ok);
  assert.ok(validateProjectInput({ ...base, link: "https://example.com" }).ok);
  assert.ok(!validateProjectInput({ ...base, tags: ["1", "2", "3", "4", "5", "6", "7"] }).ok);
  assert.ok(!validateProjectInput({ ...base, tags: ["x".repeat(25)] }).ok);
  assert.ok(!validateProjectInput({ ...base, title: "x".repeat(81) }).ok);
  assert.ok(!validateProjectInput({ ...base, summary: "" }).ok);
  assert.ok(!validateProjectInput({ ...base, action: "delete-everything" }).ok);
  const many = Array.from({ length: 13 }, () => ({ url: goodUrl, alt: "a" }));
  assert.ok(!validateProjectInput({ ...base, images: many }).ok);
  assert.ok(!validateProjectInput({ ...base, images: [{ url: "https://evil.example.com/x.png", alt: "a" }] }).ok);
  assert.ok(!validateProjectInput(null).ok);
});
