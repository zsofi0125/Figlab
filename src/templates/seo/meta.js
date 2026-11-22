// @ts-check
import { absoluteUrl } from '../../config/site.js';
import { html, jsonForScript } from '../../lib/html.js';

/**
 * @typedef {object} PageMeta
 * @property {string} title
 * @property {string} description
 * @property {string} canonicalPath   Root-relative route, e.g. "/en/".
 * @property {boolean} isIndexable
 * @property {boolean} hasAlternates  Emit hreflang links for every locale.
 * @property {object} [structuredData]
 */

/**
 * Everything a crawler or a social preview reads from <head>.
 * @param {import('../helpers.js').RenderContext} ctx
 * @param {PageMeta} meta
 */
export function renderSeoHead(ctx, meta) {
  const { config, locale, i18n } = ctx;
  const canonicalUrl = absoluteUrl(meta.canonicalPath);
  const ogImageUrl = absoluteUrl(`/${locale.ogImage}`);
  const defaultLocale = config.locales.find((entry) => entry.code === config.defaultLocale) ?? locale;
  const alternateLocales = config.locales.filter((entry) => entry.code !== locale.code);
  const robots = meta.isIndexable ? 'index, follow, max-image-preview:large, max-snippet:-1' : 'noindex, nofollow';

  return html`<title>${meta.title}</title>
<meta name="description" content="${meta.description}">
<meta name="robots" content="${robots}">
<link rel="canonical" href="${canonicalUrl}">
${meta.hasAlternates ? html`${config.locales.map((entry) => html`<link rel="alternate" hreflang="${entry.hreflang}" href="${absoluteUrl(entry.path)}">
`)}<link rel="alternate" hreflang="x-default" href="${absoluteUrl(defaultLocale.path)}">` : ''}
<meta property="og:type" content="website">
<meta property="og:site_name" content="${config.brandName}">
<meta property="og:title" content="${meta.title}">
<meta property="og:description" content="${meta.description}">
<meta property="og:url" content="${canonicalUrl}">
<meta property="og:image" content="${ogImageUrl}">
<meta property="og:image:width" content="${config.ogImageSize.width}">
<meta property="og:image:height" content="${config.ogImageSize.height}">
<meta property="og:image:alt" content="${i18n.t('meta.ogImageAlt')}">
<meta property="og:locale" content="${locale.ogLocale}">
${alternateLocales.map((entry) => html`<meta property="og:locale:alternate" content="${entry.ogLocale}">
`)}<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${meta.title}">
<meta name="twitter:description" content="${meta.description}">
<meta name="twitter:image" content="${ogImageUrl}">
<meta name="twitter:image:alt" content="${i18n.t('meta.ogImageAlt')}">
${config.googleSiteVerification ? html`<meta name="google-site-verification" content="${config.googleSiteVerification}">` : ''}
${meta.structuredData ? html`<script type="application/ld+json">${jsonForScript(meta.structuredData)}</script>` : ''}`;
}
