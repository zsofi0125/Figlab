// @ts-check
import { html } from '../../lib/html.js';

/** @param {import('../helpers.js').RenderContext} ctx */
export function renderGuarantee(ctx) {
  const { t, tHtml, tData, formatPrice, formatNumber } = ctx.i18n;
  /** @type {string[]} */
  const steps = tData('guarantee.steps');
  return html`<section class="guarantee" id="free" aria-labelledby="free-title">
  <div class="wrap">
    <div>
      <p class="eyebrow">${t('guarantee.eyebrow')}</p>
      <h2 id="free-title" class="section-title">${tHtml('guarantee.titleHtml')}</h2>
      <p class="lead">${t('guarantee.lead')}</p>
      <ol class="g-steps" role="list">
        ${steps.map((step, index) => html`<li><b aria-hidden="true">${formatNumber(index + 1).padStart(2, '0')}</b>${step}</li>`)}
      </ol>
    </div>
    <div class="stamp" aria-hidden="true"><div>${formatPrice(0)}<small>${t('guarantee.stampLabel')}</small></div></div>
  </div>
</section>`;
}
