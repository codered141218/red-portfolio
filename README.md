# John Reden portfolio

Single-page portfolio for John Reden Gavieta, Operations & Systems Specialist.
Built with Next.js 16 (App Router, React Compiler), React 19, Tailwind CSS v4,
and hand-written CSS in `app/globals.css`.

## Getting started

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. The production build and checks:

```bash
npm run lint
npm run build
npm run start
```

## Editing content

All personal details and page content live in one file:
[`app/components/portfolio/data.ts`](app/components/portfolio/data.ts).

| What to change                          | Where in `data.ts`      |
| --------------------------------------- | ----------------------- |
| Name, role, email, LinkedIn, OnlineJobs | `profile`               |
| Header / footer navigation              | `navLinks`, `contactLink` |
| Education and experience                | `education`, `experience` |
| Tools & systems logos                   | `toolGroups`            |
| Core services                           | `services`              |
| Selected work screenshots and captions  | `workCategories`        |
| "Why work with me" bullets              | `whyItems`              |

The highlight numbers in the About section (business systems, tools & platforms)
are counted from `toolGroups`, so they stay accurate as logos are added or removed.

Images live in `public/`:

- `public/john-reden-portrait.png` - hero portrait (transparent PNG).
- `public/logo/<group>/` - tool logos, roughly 112x40 display size.
- `public/sample-works/<category>/` - work screenshots at 651x303 (2.15:1).
  Give each image a short, specific `alt` in `workCategories`; it doubles as
  the caption in the lightbox.

## Site URL and sharing

Set `NEXT_PUBLIC_SITE_URL` to the production domain (for example
`https://johnreden.com`) so the canonical URL, Open Graph tags, sitemap,
robots.txt, and structured data point at the live site. On Vercel the project's
production URL is used automatically when the variable is not set.

The following are generated at build time from the content in `data.ts`:

- `/opengraph-image` - social share card (`app/opengraph-image.tsx`)
- `/icon` and `/apple-icon` - favicons (`app/icon.tsx`, `app/apple-icon.tsx`)
- `/robots.txt`, `/sitemap.xml`, `/manifest.webmanifest`
- Person structured data (JSON-LD) in `app/page.tsx`

## Project layout

```
app/
  layout.tsx                 metadata, viewport, skip link
  page.tsx                   home page + JSON-LD
  not-found.tsx              custom 404
  globals.css                all styles (dark theme, responsive rules)
  components/
    navbar.tsx               sticky header, scroll-spy, mobile drawer
    ui/grid-background.tsx   interactive hero grid
    portfolio/
      data.ts                content
      portfolio-page.tsx     page composition + footer
      sections/              hero, about, expertise, services, work, why
```

## Deploy

Any Next.js host works. For Vercel, import the repository and set
`NEXT_PUBLIC_SITE_URL` in the project environment variables.
