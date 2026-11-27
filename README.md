# John Reded C. Gavieta portfolio

Single-page portfolio for John Reded C. Gavieta: an app builder who uses coding
agents and AI tools, backed by 8+ years of business-systems experience.
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

| What to change                                   | Where in `data.ts`          |
| ------------------------------------------------ | --------------------------- |
| Name, role, email, LinkedIn, Upwork, OnlineJobs  | `profile`                   |
| Meta title and description                       | `metaTitle`, `metaDescription` |
| Header navigation                                | `navLinks`                  |
| Industries, education, experience                | `industries`, `education`, `experience` |
| Featured apps (add a `url` to show a button)     | `apps`                      |
| AI tools and the "also in my toolkit" chips      | `aiTools`, `alsoToolkit`    |
| Other services, tools & systems logos            | `services`, `toolGroups`    |
| Sample work screenshots and captions             | `workCategories`            |
| "Why work with me" bullets                       | `whyItems`                  |

Images live in `public/`:

- `public/john-reded-portrait.png` - hero portrait (transparent PNG).
- `public/brand/guild-logo-horizontal-transparent.svg` - Guild logo used in the footer.
- `public/logo/<group>/` - tool logos, roughly 112x40 display size.
- `public/sample-works/<category>/` - work screenshots at 651x303 (2.15:1).
  Give each image a short, specific `alt` in `workCategories`; it doubles as
  the caption in the lightbox.

## Site URL and sharing

Set `NEXT_PUBLIC_SITE_URL` to the production domain (for example
`https://john-redportfolio.vercel.app`) so the canonical URL, Open Graph tags, sitemap,
robots.txt, and structured data point at the live site. On Vercel the project's
production URL is used automatically when the variable is not set, and the live
site URL is the final fallback.

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
      sections/              hero, about, apps, projects, ai, services, work, why, contact
```

## How to set up the staff area

The staff area (`/admin`) lets the owner add, edit, publish and remove
gallery projects without a redeploy. Published projects show on the home page;
drafts never do. It needs three settings and a Blob store.

1. In the Vercel dashboard open the project, go to Storage, and create a Blob
   store (public access). Connect it to the project. Vercel then adds
   `BLOB_READ_WRITE_TOKEN` for you; do not add it by hand.
2. In Settings, Environment Variables, add these three names:
   - `ADMIN_EMAIL`: the email you sign in with.
   - `ADMIN_PASSWORD`: a long, unique password.
   - `SESSION_SECRET`: a random string of at least 32 characters.
3. Redeploy, then open `/admin` and sign in.

Until these exist, `/admin` shows "Staff area isn't set up yet" and the
project list shows "Storage isn't connected yet". Nothing breaks on the public
site; the gallery is simply empty.

For local development only, put the same names in `.env.local` (it is
git-ignored). Never commit real values. To change the password, edit
`ADMIN_PASSWORD` in Vercel and redeploy.

The staff area is `noindex`, disallowed in `robots.txt` and left out of the
sitemap.

Screenshot URLs of a draft are public (unguessable) links, so anyone who gets
one can open the image even though the project is not published.

## Deploy

Any Next.js host works. For Vercel, import the repository and set
`NEXT_PUBLIC_SITE_URL` in the project environment variables.
