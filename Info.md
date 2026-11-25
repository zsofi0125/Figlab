# Portfolio – project info

Every decision about the portfolio site is recorded here. When something changes, this file is updated: new decisions are added, changed ones are rewritten, dropped ones are deleted.

Last updated: 2026-11-25

## Goal

- Personal portfolio website for Zsófi, who builds websites for (small) businesses.
- It advertises her and her work.
- It must be convincing, trustworthy and easy to understand for clients, while still looking bold ("extra") and individual. It must not look like a generic AI-made site.

## Name and branding

- Site name: **not chosen yet.** The fig theme and the name "Figlab" were dropped on 2026-11-25. Until Zsófi picks a new name, the site shows the placeholder "Studio Name". Change it in one place: `brandName` in `src/config/site.js` (and `$brand` in `scripts/generate-images.ps1`, then run `npm run images`).
- Zsófi's name appears only in the intro (About) section.
- Look: minimalist and mostly neutral, with one strong accent colour (soiled pink #85383E) and a quiet second one (olive). No themed metaphors or decorative illustrations.
- Two colour themes. **Light**: warm cream background (#F6F1EA, from Pastel Earth #D7CAB7), dark burgundy text (#3E0911). **Dark**: dark burgundy background, cream text, dusty pink (#C39583) accent. The site follows the visitor's browser setting, and a moon/sun button in the header switches between them; the choice is remembered. All colours are in `src/styles/tokens.css`.
- Fonts: Montserrat Alternates (headings) and Montserrat (body text). Kept for now; new font pairings to be suggested once the colours are settled.

## Format and files

- One-page website (one-pager), one page per language.
- Files live in `C:\Users\zsofi\Downloads\Figlab`. The site is built by a small static site generator (no dependencies, Node 22+): source in `src/`, finished site in `dist/`. README.md lists the commands and folder structure.
  - `npm run dev` – staging preview at http://localhost:4173, with the placeholder markers.
  - `npm run build` – production build, ready to upload.
  - All visible text is in `src/i18n/hu.json` and `src/i18n/en.json`. Prices are in `src/data/pricing.js`.
  - `Info.md` – this file.
- An online preview of the earlier draft also exists as a Claude artifact: https://claude.ai/artifact/G19d5Loa6fVaZRXyWT76n5
- Everything that is still a placeholder is marked with a dashed gold underline or a "placeholder" tag, and a bar on top of the page says so. These markers show **only in the staging build**. The production build hides them, and only the production build may be indexed by search engines.

## Language

- The site is in **Hungarian and English**, with a **HU / EN switch** in the header.
- Each language has its own address: Hungarian at `/` (default), English at `/en/`, so Google can index both languages separately.
- The site remembers the visitor's choice.
- Hungarian copy uses the informal "te" form (tegeződés). *Assumed, not yet confirmed: tell me if you prefer "Ön" (magázás).*

## Sections (in order)

1. **Header** – site name with an accent dot, menu, light/dark switch, HU/EN switch, "Free design draft" button.
2. **Hero** – headline, short description, buttons, key facts, and a fan of three finished-website cards (click one to jump to the showcase). Animations were tried here on 2026-11-22 and removed the same day because Zsófi didn't like them.
3. **About / intro** – placeholder for her photo, placeholder for her About text, three promises.
4. **Work / showcase** – each past website shown in a desktop **monitor frame** with a **phone frame** beside it; both can be scrolled. Tabs switch between projects.
5. **Free design draft (guarantee)** – a prominent band: she makes a free design draft before the client pays anything.
6. **Process** – five steps as a simple numbered list (first email, free design draft, decision and plan, build, launch), each with its timing and what the client gets.
7. **Affordable** – why the price is low: no agency overheads, a fixed price up front, and still mobile- and Google-friendly. Added for the "olcsó weboldal készítés" searches.
8. **Pricing** – 3 one-time plans + 2 monthly plans.
9. **FAQ**.
10. **Contact** – email only.
11. **Footer**.

## Pricing

- Prices in **HUF (Ft)**. All amounts are **placeholders** for now.
- **No webshop** (not offered yet).
- Three one-time plans:
  1. **Starter / Induló** – one-page website. Placeholder: from 149 000 Ft.
  2. **Standard / Standard** – business website, up to 6 pages (marked "most chosen"). Placeholder: from 349 000 Ft.
  3. **Complete / Teljes** – everything in plan 2 plus extras: **calendar and online appointment booking, embedded Google Maps, blog**. Placeholder: from 549 000 Ft.
- **Two monthly plans** exist. Names, prices and contents are placeholders that Zsófi will change later (currently "Care / Gondozás" and "Care+ / Gondozás+").
- Fine print (placeholders): payment split, domain and hosting not included.

## Trust / guarantee

- **No client reviews yet**, so the site shows none.
- Instead the guarantee is: **a free design draft before paying**. The client sees the design first and pays only if they like it. This is shown prominently (hero facts, its own band, the process, pricing fine print and FAQ).

## Contact

- **Email only: figlab25@gmail.com.** No phone number, no address, no city, no other details.

## Photo and About text

- No photo yet: a **placeholder** is kept for it.
- About text: also a **placeholder** for now.

## Showcase projects

- The three projects (bakery, physio studio, florist) are invented **placeholders**, including names, results and screenshots. They will be replaced with Zsófi's real projects.

## SEO

- Target searches: **"weboldal készítés"**, **"olcsó weboldal készítés"** and close variants (honlap készítés, weboldal készítés árak, egyoldalas weboldal, céges honlap, landing page). The English page targets affordable website design for small businesses.
- These words appear in the page title, the meta description, the first line of the main heading ("Weboldal készítés kisvállalkozásoknak"), the Affordable section, the pricing heading and the FAQ.
- New FAQ questions that people search for: how much a website costs, how long it takes, why it is cheaper than an agency, and whether we can work together from anywhere in Hungary.
- Technical SEO: a separate URL per language with hreflang, canonical URLs, Open Graph / Twitter share images, Schema.org data (Organization, offers with prices, FAQ), sitemap.xml and robots.txt. Every build checks these automatically.
- Domain: **assumed `figlab.hu`, not yet confirmed.** Set `SITE_URL` in `.env` once the real domain is known.
- *Assumed, not yet confirmed:* that Zsófi works with clients anywhere in Hungary (the FAQ says "Budapesttől Szegedig").

## Inspiration sites

- siteflow.hu
- contentmedia.hu
- profihonlapkeszites.hu
- webpecs.hu

Common elements on these: FAQ, free first consultation, process steps, clear prices.

## Still open / placeholder

- Real prices for the 3 plans and the 2 monthly plans (and their names and contents).
- Payment terms (currently "50% upfront, 50% at launch") and whether prices include VAT (ÁFA).
- Hero numbers (number of websites launched, speed score).
- Real projects for the showcase.
- Photo and About text.
- Informal "te" vs formal "Ön" in Hungarian.
- The real domain (currently assumed `figlab.hu`) and the hosting provider.
- Before going live: replace "24 websites launched" and the invented showcase results with true ones. Fake results on a live site hurt trust and can mislead clients.
