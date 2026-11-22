// @ts-check
import { absoluteUrl } from '../../config/site.js';
import { escapeHtml } from '../../lib/html.js';

/**
 * sitemap.xml with hreflang alternates for every localized route.
 * @param {import('../../config/site.js').SiteConfig} config
 * @param {string} lastModified ISO date (YYYY-MM-DD)
 */
export function renderSitemap(config, lastModified) {
  const defaultLocale = config.locales.find((entry) => entry.code === config.defaultLocale) ?? config.locales[0];
  const alternates = [
    ...config.locales.map((entry) => `    <xhtml:link rel="alternate" hreflang="${entry.hreflang}" href="${escapeHtml(absoluteUrl(entry.path))}"/>`),
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeHtml(absoluteUrl(defaultLocale.path))}"/>`,
  ].join('\n');

  const urls = config.locales
    .map((entry) => `  <url>
    <loc>${escapeHtml(absoluteUrl(entry.path))}</loc>
    <lastmod>${lastModified}</lastmod>
${alternates}
  </url>`)
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`;
}

/** @param {import('../../config/site.js').SiteConfig} config */
export function renderRobots(config) {
  if (!config.isProduction) {
    return `# Staging build: keep it out of search engines.\nUser-agent: *\nDisallow: /\n`;
  }
  return `User-agent: *\nAllow: /\n\nSitemap: ${absoluteUrl('/sitemap.xml')}\n`;
}
