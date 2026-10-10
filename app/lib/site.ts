/**
 * Canonical site URL used for metadata, the sitemap, robots.txt, and
 * structured data. Set NEXT_PUBLIC_SITE_URL in production (for example
 * https://johnreden.com). On Vercel the production URL is used as a
 * fallback, and local development falls back to localhost.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/+$/, "");

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercel) return `https://${vercel}`;

  return "http://localhost:3000";
}

export const siteUrl = resolveSiteUrl();
