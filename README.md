# Portfolio site

Portfolio site, built as static HTML in Hungarian (`/`) and English (`/en/`). The build has no dependencies and needs only Node 22 or newer.

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Staging build (noindex, draft banner, placeholder markers), then serves it at http://localhost:4173 |
| `npm run build` | Production build into `dist/`, ready to upload |
| `npm run build:staging` | Staging build only |
| `npm run preview` | Serves whatever is in `dist/` |
| `npm run images` | Regenerates the social share images, logo and icons (Windows only) |
| `npm run video` | Re-encodes the hero background video into small, seamlessly looping WebM + MP4 files (needs ffmpeg, see "Hero video") |

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
  media/                 videos; published as assets/media/<name>.<hash>.<ext>
  static/                copied into dist/ unchanged (favicon, images)
scripts/                 build, preview server, SEO audit, image generator, video encoder
  source/                originals the generators start from (not published)
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
3. Cache `assets/css/`, `assets/js/`, `assets/media/` and `assets/fonts/` for a long time (for example `Cache-Control: public, max-age=31536000, immutable`). Their file names change whenever their content changes (font files carry their version, e.g. `manrope-v23-latin.woff2`).

## Hero video

In the dark theme the hero plays `src/media/hero-dark.webm` (or the `.mp4` in Safari versions without VP9). `src/scripts/hero-video.js` only downloads it after the page has loaded and the browser is idle, pauses it when the hero is off screen or the tab is hidden, and skips it entirely for reduced-motion, data-saver, slow-connection (3G or slower) and low-memory (2 GB or less) visitors. They keep the still poster `src/static/assets/img/hero-dark-poster.webp`.

To replace or re-encode the video:

1. Install ffmpeg once. On Windows, run `winget install Gyan.FFmpeg`, then open a new terminal and check that `ffmpeg -version` works.
2. Put the original clip at `scripts/source/hero-dark-original.mp4`.
3. Run `npm run video`. It cross-fades the clip's last 1.5 s into its start so it loops seamlessly, scales it to 960 px wide at 24 fps, removes any audio, and writes `hero-dark.webm` and `hero-dark.mp4` into `src/media/`.
4. Copy the `data-window-*` and `data-crossfade` values the script prints into `src/templates/components/hero.js`, then run `npm run build`.
5. Refresh the poster from the new first frame: `ffmpeg -y -i src/media/hero-dark.webm -frames:v 1 -vf scale=1280:-2 -c:v libwebp -quality 72 src/static/assets/img/hero-dark-poster.webp`.

If `ffmpeg` is "not found" right after installing, open a new terminal (or restart VS Code) so it picks up the updated PATH.
