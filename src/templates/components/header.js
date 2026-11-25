// @ts-check
import { html } from '../../lib/html.js';
import { localeHref } from '../helpers.js';

/** In-page sections linked from the menus, in page order. */
export const SECTION_LINKS = Object.freeze([
  { id: 'work', labelKey: 'nav.work' },
  { id: 'process', labelKey: 'nav.process' },
  { id: 'pricing', labelKey: 'nav.pricing' },
  { id: 'about', labelKey: 'nav.about' },
  { id: 'faq', labelKey: 'nav.faq' },
]);

/** @param {import('../helpers.js').RenderContext} ctx */
export function renderDraftBanner(ctx) {
  if (!ctx.isDraft) return '';
  const { t, tHtml } = ctx.i18n;
  return html`<div class="draft" id="draft-banner">
  <div class="wrap">
    <p>${tHtml('draft.noticeHtml')}</p>
    <button type="button" data-draft-dismiss>${t('draft.hide')}</button>
  </div>
</div>`;
}

/** @param {import('../helpers.js').RenderContext} ctx */
export function renderLanguageSwitch(ctx) {
  const { t } = ctx.i18n;
  const currentIndex = ctx.config.locales.findIndex((target) => target.code === ctx.locale.code);
  return html`<div class="lang" role="group" aria-label="${t('a11y.langSwitch')}" style="--i:${currentIndex}">
  ${ctx.config.locales.map((target) => {
    const isCurrent = target.code === ctx.locale.code;
    return html`<a href="${localeHref(ctx, target)}" hreflang="${target.htmlLang}" lang="${target.htmlLang}" data-lang-link="${target.code}"${isCurrent ? html` aria-current="page"` : ''}>${target.code.toUpperCase()}<span class="visually-hidden"> – ${t(`a11y.langNames.${target.code}`)}</span></a>`;
  })}
</div>`;
}

/**
 * Light/dark switch. The label names the theme it switches to; scripts/theme.js keeps it current.
 * @param {import('../helpers.js').RenderContext} ctx
 */
function renderThemeToggle(ctx) {
  const { t } = ctx.i18n;
  return html`<button class="theme-toggle" type="button" data-theme-toggle data-label-to-dark="${t('a11y.themeToDark')}" data-label-to-light="${t('a11y.themeToLight')}" aria-label="${t('a11y.themeToDark')}">
  <svg class="icon-moon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M20.5 14.6A8.5 8.5 0 0 1 9.4 3.5a8.5 8.5 0 1 0 11.1 11.1Z"/></svg>
  <svg class="icon-sun" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/></g></svg>
</button>`;
}

/** @param {import('../helpers.js').RenderContext} ctx */
export function renderSiteHeader(ctx) {
  const { t } = ctx.i18n;
  return html`<header class="site-header">
  <nav class="site-nav wrap" aria-label="${t('a11y.mainNav')}">
    <a class="mark" href="./" aria-label="${t('nav.home')}"><span aria-hidden="true">${ctx.config.brandName}</span></a>
    <ul class="nav-links" id="nav-links" role="list">
      ${SECTION_LINKS.map((link) => html`<li><a href="#${link.id}">${t(link.labelKey)}</a></li>`)}
      <li class="nav-cta-item"><a class="btn btn-primary btn-sm btn-cta" href="#free">${t('nav.cta')}</a></li>
    </ul>
    <div class="nav-right">
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="nav-links">
        <span class="nav-toggle-bars" aria-hidden="true"></span><span class="visually-hidden">${t('a11y.menu')}</span>
      </button>
      <a class="btn btn-primary btn-sm btn-cta" href="#free">${t('nav.cta')}</a>
      ${renderThemeToggle(ctx)}
      ${renderLanguageSwitch(ctx)}
    </div>
  </nav>
</header>`;
}
