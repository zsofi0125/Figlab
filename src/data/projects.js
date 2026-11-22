// @ts-check

/**
 * Showcase projects. Translated texts (type, blurb, deliverables, result label) live in
 * src/i18n/*.json under work.projects.<id>.
 *
 * `mock` drives the decorative mini-website drawn inside the monitor and phone frames.
 * It is shipped as JSON and rendered in the browser on purpose: it is illustration, like a
 * screenshot, and must not be indexed as Figlab's own page content.
 * Replace it with real screenshots (WebP, explicit width/height) once real projects exist.
 *
 * ALL THREE PROJECTS ARE PLACEHOLDERS.
 *
 * @typedef {object} MockSite
 * @property {Record<string, string>} vars  CSS custom properties that theme the mock.
 * @property {string} logo
 * @property {string[]} links
 * @property {string} headline
 * @property {string} intro
 * @property {string} cta
 * @property {[string, string][]} cards
 * @property {string} quote
 *
 * @typedef {object} Project
 * @property {string} id         Stable slug, used in element ids and translation keys.
 * @property {string} name       Proper noun, not translated.
 * @property {string} domain
 * @property {string} result     Headline figure shown in the case study.
 * @property {boolean} isPlaceholder
 * @property {MockSite} mock
 */

/** @type {readonly Project[]} */
export const projects = Object.freeze([
  {
    id: 'morning-crumb',
    name: 'Morning Crumb',
    domain: 'morningcrumb.hu',
    result: '+38%',
    isPlaceholder: true,
    mock: {
      vars: {
        '--m-bg': '#fbf3e6', '--m-ink': '#3b2414', '--m-accent': '#c0662b', '--m-on-accent': '#fff',
        '--m-card': '#f3e3c9', '--m-line': '#ead8bb', '--m-radius': '14px', '--m-font': 'Figtree, sans-serif',
        '--m-logo': '400 26px Gloock, serif', '--m-h': '400 64px Gloock, serif', '--m-q': '400 24px Gloock, serif',
        '--m-img': 'radial-gradient(circle at 30% 60%,#d79a5a 0 18%,transparent 19%),radial-gradient(circle at 62% 46%,#c47d3e 0 22%,transparent 23%),radial-gradient(circle at 70% 75%,#e0b27a 0 14%,transparent 15%),linear-gradient(160deg,#7a4a2a,#3b2414)',
      },
      logo: 'Morning Crumb',
      links: ['Kenyerek', 'Torták', 'Előrendelés', 'Itt vagyunk'],
      headline: 'Friss kenyér, amikor csak kéred.',
      intro: 'Rendelj este 8-ig, és másnap reggel még melegen viheted.',
      cta: 'Előrendelés',
      cards: [['Kovászos minden nap', 'Hajnali 4 óta sütjük'], ['Torták rendelésre', 'Születésnapra, esküvőre'], ['Itt találsz', 'Kossuth tér 4, nyitva 6–14']],
      quote: '„A kerület legjobb croissant-ja, és már sorba sem kell állnom.” – Anna',
    },
  },
  {
    id: 'align-physio',
    name: 'Align Physio',
    domain: 'alignphysio.hu',
    result: '2×',
    isPlaceholder: true,
    mock: {
      vars: {
        '--m-bg': '#eef3f1', '--m-ink': '#14302b', '--m-accent': '#1f6b5c', '--m-on-accent': '#fff',
        '--m-card': '#ffffff', '--m-line': '#d5e2dd', '--m-radius': '6px', '--m-font': 'Figtree, sans-serif',
        '--m-logo': '800 22px Archivo, sans-serif', '--m-h': '800 58px Archivo, sans-serif', '--m-q': '600 22px Figtree, sans-serif',
        '--m-img': 'radial-gradient(circle at 50% 38%,#f3d2b8 0 12%,transparent 13%),linear-gradient(180deg,transparent 48%,#1f6b5c 48% 80%,transparent 80%),radial-gradient(ellipse at 50% 100%,#cfe0da 0 60%,transparent 61%),linear-gradient(135deg,#bcd5cd,#e9f1ee)',
      },
      logo: 'ALIGN',
      links: ['Kezelések', 'Csapat', 'Árak', 'Kapcsolat'],
      headline: 'Mozogj újra fájdalom nélkül.',
      intro: 'Személyre szabott gyógytorna Pécs belvárosában. Írj, és egy napon belül válaszolunk.',
      cta: 'Jelentkezem',
      cards: [['Hát és nyak', '45 perc · 14 000 Ft'], ['Sportsérülések', '60 perc · 18 000 Ft'], ['Tartásvizsgálat', '30 perc · 9 000 Ft']],
      quote: '„Mindent érthetően elmagyaráztak, négy hét múlva újra futottam.” – Bence',
    },
  },
  {
    id: 'petal-and-stem',
    name: 'Petal & Stem',
    domain: 'petalandstem.hu',
    result: '60+',
    isPlaceholder: true,
    mock: {
      vars: {
        '--m-bg': '#fff5f6', '--m-ink': '#3a1426', '--m-accent': '#b3245a', '--m-on-accent': '#fff',
        '--m-card': '#fde3e8', '--m-line': '#f5d2da', '--m-radius': '999px', '--m-font': 'Figtree, sans-serif',
        '--m-logo': '400 26px Gloock, serif', '--m-h': '400 62px Gloock, serif', '--m-q': '400 24px Gloock, serif',
        '--m-img': 'radial-gradient(circle at 35% 40%,#e65a85 0 13%,transparent 14%),radial-gradient(circle at 58% 32%,#f49ab3 0 12%,transparent 13%),radial-gradient(circle at 50% 56%,#b3245a 0 12%,transparent 13%),radial-gradient(circle at 68% 54%,#fbc2cf 0 10%,transparent 11%),linear-gradient(180deg,transparent 60%,#5d7a3a 60% 64%,transparent 64%),linear-gradient(160deg,#f9d7de,#f0b8c5)',
      },
      logo: 'Petal & Stem',
      links: ['Csokrok', 'Esküvő', 'Blog', 'Rólunk'],
      headline: 'Virágok, amik mesélnek.',
      intro: 'Kézzel kötött csokrok helyi termelőktől. Foglalj időpontot esküvői konzultációra online.',
      cta: 'Időpontot foglalok',
      cards: [['Szezonális csokor', '9 900 Ft-tól'], ['Esküvői virágok', 'Ingyenes konzultáció'], ['Térkép és nyitvatartás', 'Hétfőtől szombatig']],
      quote: '„A csokor pontosan olyan lett, mint a képen. Anyukám elsírta magát.” – Réka',
    },
  },
]);
