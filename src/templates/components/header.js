// @ts-check
import { html } from '../../lib/html.js';
import { assetHref, localeHref } from '../helpers.js';

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

/** @param {import('../helpers.js').RenderContext} ctx */
export function renderSiteHeader(ctx) {
  const { t } = ctx.i18n;
  return html`<header class="site-header">
  <nav class="site-nav wrap" aria-label="${t('a11y.mainNav')}">
    <a class="mark" href="./" aria-label="${t('nav.home')}"><img src="${assetHref(ctx, 'assets/img/fig-white.png')}" width="28" height="28" alt="" decoding="async"><span aria-hidden="true">${ctx.config.brandName}</span></a>
    <ul class="nav-links" id="nav-links" role="list">
      ${SECTION_LINKS.map((link) => html`<li><a href="#${link.id}">${t(link.labelKey)}</a></li>`)}
      <li class="nav-cta-item"><a class="btn btn-seed btn-sm btn-cta" href="#free">${t('nav.cta')}</a></li>
    </ul>
    <div class="nav-right">
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="nav-links">
        <span class="nav-toggle-bars" aria-hidden="true"></span><span class="visually-hidden">${t('a11y.menu')}</span>
      </button>
      <a class="btn btn-seed btn-sm btn-cta" href="#free">${t('nav.cta')}</a>
      ${renderLanguageSwitch(ctx)}
    </div>
  </nav>
</header>`;
}
