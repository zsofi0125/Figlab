// @ts-check

/**
 * Showcase projects. Translated texts (category, type, title, blurb, note) live in
 * src/i18n/*.json under work.projects.<id>.
 *
 * Screenshots are full-page captures (desktop 1000 px wide, phone 390 px wide) shown inside the
 * monitor and phone frames, where visitors can scroll them. Re-capture them after a site changes.
 *
 * @typedef {object} Screenshot
 * @property {string} src     Path inside the built site.
 * @property {number} width
 * @property {number} height
 *
 * @typedef {object} Project
 * @property {string} id       Stable slug, used in element ids and translation keys.
 * @property {string} name     Tab label; a proper noun, not translated.
 * @property {string} url      Live website.
 * @property {string} domain
 * @property {{ desktop: Screenshot, phone: Screenshot }} screenshots
 */

/** @type {readonly Project[]} */
export const projects = Object.freeze([
  {
    id: 'molnar-judit',
    name: 'Molnár Judit kozmetikus',
    url: 'https://molnarjuditkozmetikus.hu/',
    domain: 'molnarjuditkozmetikus.hu',
    screenshots: {
      desktop: { src: 'assets/img/work-molnar-judit-desktop.jpg', width: 1000, height: 1865 },
      phone: { src: 'assets/img/work-molnar-judit-phone.jpg', width: 390, height: 3581 },
    },
  },
  {
    id: 'mecsekalja-apartman',
    name: 'Mecsekalja apartman',
    url: 'https://mecsekaljaapartman.hu/',
    domain: 'mecsekaljaapartman.hu',
    screenshots: {
      desktop: { src: 'assets/img/work-mecsekalja-desktop.jpg', width: 1000, height: 3738 },
      phone: { src: 'assets/img/work-mecsekalja-phone.jpg', width: 390, height: 5778 },
    },
  },
]);
