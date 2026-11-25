// @ts-check
import { html, raw } from '../lib/html.js';
import { assetHref } from './helpers.js';
import { renderSeoHead } from './seo/meta.js';

/**
 * @typedef {object} BuiltAssets
 * @property {string} css  Root-relative path of the hashed stylesheet.
 * @property {string} js   Root-relative path of the hashed script bundle.
 */

/**
 * Runs before the stylesheet paints: marks JS as available and applies a theme the visitor picked
 * earlier, so the page never flashes the wrong colours. Keep the storage key in sync with scripts/theme.js.
 */
const THEME_BOOTSTRAP = "document.documentElement.classList.add('js');try{var t=localStorage.getItem('site-theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){}";

/**
 * Manrope is the headline (LCP) and body font, so it is preloaded; the mono label font is not. Hungarian
 * text needs the latin-ext subset (ő, ű) straight away, other locales only the latin one.
 * @param {import('../config/site.js').LocaleConfig} locale
 */
const fontPreloads = (locale) => [
  'assets/fonts/manrope-v23-latin.woff2',
  ...(locale.code === 'hu' ? ['assets/fonts/manrope-v23-latin-ext.woff2'] : []),
];

/**
 * The HTML document shell shared by every page.
 * @param {import('./helpers.js').RenderContext} ctx
 * @param {object} options
 * @param {import('./seo/meta.js').PageMeta} options.meta
 * @param {BuiltAssets} options.assets
 * @param {import('../lib/html.js').Interpolation} options.body
 * @param {(path: string) => string} [options.resolveAsset]  Overrides relative asset paths (the 404 page needs absolute ones).
 */
export function renderDocument(ctx, { meta, assets, body, resolveAsset = (path) => assetHref(ctx, path) }) {
  const { config, locale } = ctx;
  return `<!doctype html>
${html`<html lang="${locale.htmlLang}" dir="ltr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
${renderSeoHead(ctx, meta)}
<meta name="theme-color" content="${config.themeColor.light}" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="${config.themeColor.dark}" media="(prefers-color-scheme: dark)">
<meta name="color-scheme" content="light dark">
<meta name="author" content="${config.brandName}">
<link rel="icon" href="${resolveAsset('assets/img/favicon-32.png')}" sizes="32x32" type="image/png">
<link rel="icon" href="${resolveAsset('assets/img/favicon-48.png')}" sizes="48x48" type="image/png">
<link rel="apple-touch-icon" href="${resolveAsset('assets/img/apple-touch-icon.png')}">
${fontPreloads(locale).map((file) => html`<link rel="preload" href="${resolveAsset(file)}" as="font" type="font/woff2" crossorigin>
`)}<link rel="stylesheet" href="${resolveAsset(assets.css)}">
<script>${raw(THEME_BOOTSTRAP)}</script>
<script src="${resolveAsset(assets.js)}" defer></script>
</head>
<body${ctx.isDraft ? html` class="is-draft"` : ''}>
<a class="skip-link" href="#main">${ctx.i18n.t('a11y.skipToContent')}</a>
${body}
</body>
</html>`}
`;
}
