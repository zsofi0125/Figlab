// @ts-check
import { html } from '../lib/html.js';

/**
 * @typedef {object} RenderContext
 * @property {import('../lib/i18n.js').I18n} i18n
 * @property {import('../config/site.js').SiteConfig} config
 * @property {import('../config/site.js').LocaleConfig} locale
 * @property {boolean} isDraft  Staging build: shows the draft banner and placeholder markers.
 * @property {number} year
 */

/**
 * Marks content that still needs real values. The dashed underline only shows in staging (.is-draft).
 * @param {import('../lib/html.js').Interpolation} content
 * @param {boolean} [isPlaceholder]
 */
export function placeholder(content, isPlaceholder = true) {
  return isPlaceholder ? html`<span class="ph">${content}</span>` : html`${content}`;
}

/** A "placeholder" chip, rendered only in staging builds. @param {RenderContext} ctx */
export function placeholderTag(ctx) {
  return ctx.isDraft ? html`<span class="ph-tag">${ctx.i18n.t('draft.placeholderTag')}</span>` : '';
}

/** Content for the site owner, never for visitors of the live site. @param {RenderContext} ctx @param {import('../lib/html.js').Interpolation} content */
export function draftOnly(ctx, content) {
  return ctx.isDraft ? content : '';
}

/**
 * Relative link from the current locale's page to another locale's home page.
 * @param {RenderContext} ctx
 * @param {import('../config/site.js').LocaleConfig} target
 */
export function localeHref(ctx, target) {
  return ctx.locale.toRoot + target.path.slice(1) || './';
}

/** Root-relative static asset path, resolved for the current locale's depth. @param {RenderContext} ctx @param {string} path */
export function assetHref(ctx, path) {
  return ctx.locale.toRoot + path;
}
