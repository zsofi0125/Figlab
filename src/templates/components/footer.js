// @ts-check
import { html } from '../../lib/html.js';
import { SECTION_LINKS } from './header.js';

/** @param {import('../helpers.js').RenderContext} ctx */
export function renderFooter(ctx) {
  const { t } = ctx.i18n;
  return html`<footer class="site-footer">
  <div class="wrap">
    <p>${t('footer.copyright', { year: ctx.year })} · ${t('footer.tagline')}</p>
    <nav aria-label="${t('a11y.footerNav')}">
      <ul role="list">
        ${SECTION_LINKS.map((link) => html`<li><a href="#${link.id}">${t(link.labelKey)}</a></li>`)}
        <li><a href="#contact">${t('nav.contact')}</a></li>
      </ul>
    </nav>
    <p>${t('footer.motto')}</p>
  </div>
</footer>`;
}
