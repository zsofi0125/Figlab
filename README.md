# Figlab

Portfolio site for Figlab, built as static HTML in Hungarian (`/`) and English (`/en/`). The build has no dependencies and needs only Node 22 or newer.

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Staging build (noindex, draft banner, placeholder markers), then serves it at http://localhost:4173 |
| `npm run build` | Production build into `dist/`, ready to upload |
| `npm run build:staging` | Staging build only |
| `npm run preview` | Serves whatever is in `dist/` |
| `npm run images` | Regenerates the social share images, logo and icons (Windows only) |

Copy `.env.example` to `.env` and set `SITE_URL` to the real domain before the production build. Canonical URLs, hreflang links, Open Graph tags, JSON-LD and the sitemap are all built from it.

Each build checks every page and fails if it finds a missing title, description, canonical, hreflang or OG tag, more or fewer than one `<h1>`, a skipped heading level, an image without alt text or size, a broken in-page link, or invalid JSON-LD.

## Where things live

```
src/
  config/site.js         domain, locales, email, environment
  i18n/hu.json, en.json  ALL visible text (both files must have the same keys; the build checks this)
  data/                  numbers and non-translated facts: prices, projects, decorative geometry
  lib/                   html escaping, i18n + Intl formatting
  templates/
    pages/               home, 404
    components/          one file per page section
    seo/                 <head> meta, JSON-LD, sitemap + robots
  styles/                mobile-first CSS, one file per section (bundled in the order set in scripts/build.mjs)
  scripts/               browser JS, one feature per file (bundled into one script)
  static/                copied into dist/ unchanged (favicon, images)
scripts/                 build, preview server, SEO audit, image generator
```

## Common edits

- **Change text:** edit `src/i18n/hu.json` and `src/i18n/en.json`.
- **Change a price:** edit `src/data/pricing.js`. The price cards, the FAQ answer and the structured data all update from it. Set `isPlaceholder: false` when a price is final.
- **Replace a showcase project:** edit `src/data/projects.js` and its texts under `work.projects` in both dictionaries.
- **Add a section:** add a component in `src/templates/components/`, add a CSS file in `src/styles/` and list it in `STYLE_ORDER` in `scripts/build.mjs`, then add the component to `src/templates/pages/home.js`.

## Deploying

Upload the contents of `dist/` to any static host. On the host, set these up:

1. One canonical host: 301-redirect `www.` to the bare domain (or the other way round), and `http` to `https`.
2. Serve `404.html` for unknown URLs.
3. Cache `assets/css/` and `assets/js/` for a long time. Their file names change whenever their content changes.
