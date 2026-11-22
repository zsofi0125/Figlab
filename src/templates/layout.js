// @ts-check
import { html } from '../lib/html.js';
import { assetHref } from './helpers.js';
import { renderIconSprite } from './components/icons.js';
import { renderSeoHead } from './seo/meta.js';

/**
 * @typedef {object} BuiltAssets
 * @property {string} css  Root-relative path of the hashed stylesheet.
 * @property {string} js   Root-relative path of the hashed script bundle.
 */

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
  const fontsUrl = 'https://fonts.googleapis.com/css2?family=Montserrat+Alternates:wght@500;600;700&family=Montserrat:wght@400;500;600;700&display=swap';
  return `<!doctype html>
${html`<html lang="${locale.htmlLang}" dir="ltr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
${renderSeoHead(ctx, meta)}
<meta name="theme-color" content="${config.themeColor}">
<meta name="color-scheme" content="dark">
<meta name="author" content="${config.brandName}">
<link rel="icon" href="${resolveAsset('assets/img/favicon-32.png')}" sizes="32x32" type="image/png">
<link rel="icon" href="${resolveAsset('assets/img/favicon-48.png')}" sizes="48x48" type="image/png">
<link rel="apple-touch-icon" href="${resolveAsset('assets/img/apple-touch-icon.png')}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${fontsUrl}">
<link rel="stylesheet" href="${resolveAsset(assets.css)}">
<script>document.documentElement.classList.add('js')</script>
<script src="${resolveAsset(assets.js)}" defer></script>
</head>
<body${ctx.isDraft ? html` class="is-draft"` : ''}>
<a class="skip-link" href="#main">${ctx.i18n.t('a11y.skipToContent')}</a>
${renderIconSprite()}
${body}
</body>
</html>`}
`;
}
