// @ts-check
import { html } from '../../lib/html.js';
import { buildFaqItems } from '../view-models.js';

/** @param {import('../helpers.js').RenderContext} ctx */
export function renderFaq(ctx) {
  const { t } = ctx.i18n;
  return html`<section class="faq" id="faq" aria-labelledby="faq-title">
  <div class="wrap faq-grid">
    <div>
      <p class="eyebrow">${t('faq.eyebrow')}</p>
      <h2 id="faq-title" class="section-title">${t('faq.title')}</h2>
      <p class="lead">${t('faq.lead')}</p>
    </div>
    <div class="qs">
      ${buildFaqItems(ctx.i18n).map((item) => html`<details>
        <summary>${item.question}</summary>
        <p>${item.answer}</p>
      </details>`)}
    </div>
  </div>
</section>`;
}
