// @ts-check

/**
 * @typedef {'hu' | 'en'} LocaleCode
 *
 * @typedef {object} LocaleConfig
 * @property {LocaleCode} code
 * @property {string} path         Route of the locale's home page, always with a trailing slash.
 * @property {string} toRoot       Relative prefix from that route back to the site root (keeps file:// previews working).
 * @property {string} htmlLang     Value of <html lang>.
 * @property {string} hreflang     Value of hreflang alternates (ISO 639-1 + optional ISO 3166-1).
 * @property {string} ogLocale     Open Graph locale.
 * @property {string} intlLocale   Locale passed to the Intl APIs.
 * @property {string} ogImage      Social share image, relative to the site root.
 */

const cliArgs = new Set(process.argv.slice(2));
const environment = cliArgs.has('--staging') || process.env.SITE_ENV === 'staging' ? 'staging' : 'production';

/** @type {readonly LocaleConfig[]} */
const locales = Object.freeze([
  {
    code: 'hu',
    path: '/',
    toRoot: '',
    htmlLang: 'hu',
    hreflang: 'hu-HU',
    ogLocale: 'hu_HU',
    intlLocale: 'hu-HU',
    ogImage: 'assets/img/og-hu.png',
  },
  {
    code: 'en',
    path: '/en/',
    toRoot: '../',
    // Plain "en" on purpose: the English page serves English speakers everywhere, not one region.
    htmlLang: 'en',
    hreflang: 'en',
    ogLocale: 'en_GB',
    intlLocale: 'en-GB',
    ogImage: 'assets/img/og-en.png',
  },
]);

export const siteConfig = Object.freeze({
  // Placeholder until the new name is chosen. Every visible mention of the site name comes from here.
  brandName: 'Studio Name',
  siteUrl: (process.env.SITE_URL || 'https://figlab.hu').replace(/\/+$/, ''),
  environment,
  isProduction: environment === 'production',
  contactEmail: 'figlab25@gmail.com',
  founderName: 'Zsófi',
  currency: 'HUF',
  /** Browser UI colour per theme; matches --color-bg in styles/tokens.css. */
  themeColor: Object.freeze({ light: '#f6f1ea', dark: '#3e0911' }),
  googleSiteVerification: process.env.GOOGLE_SITE_VERIFICATION || '',
  /** @type {LocaleCode} */
  defaultLocale: 'hu',
  locales,
  ogImageSize: Object.freeze({ width: 1200, height: 630 }),
});

/** @typedef {typeof siteConfig} SiteConfig */

/**
 * @param {string} routePath  A root-relative path such as "/en/".
 * @returns {string} The absolute URL on the live domain.
 */
export function absoluteUrl(routePath) {
  return siteConfig.siteUrl + (routePath.startsWith('/') ? routePath : `/${routePath}`);
}
