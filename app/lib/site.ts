/**
 * Canonical site URL used for metadata, the sitemap, robots.txt, and
 * structured data. Set NEXT_PUBLIC_SITE_URL in production (for example
 * https://john-redportfolio.vercel.app). On Vercel the production URL is used as a
 * fallback, and everything else falls back to the live site URL.
 */
const fallbackSiteUrl = "https://john-redportfolio.vercel.app";

function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/+$/, "");

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercel) return `https://${vercel}`;

  return fallbackSiteUrl;
}

export const siteUrl = resolveSiteUrl();
