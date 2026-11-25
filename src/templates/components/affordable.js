// @ts-check
import { html } from '../../lib/html.js';

/** @typedef {{ title: string, text: string }} ValuePoint */

/**
 * "Why the price is low" section. Answers the intent behind searches such as
 * "olcsó weboldal készítés" with real reasons instead of keyword filler.
 * @param {import('../helpers.js').RenderContext} ctx
 */
export function renderAffordable(ctx) {
  const { t, tData, formatNumber } = ctx.i18n;
  /** @type {ValuePoint[]} */
  const points = tData('affordable.points');
  return html`<section class="affordable" id="affordable" aria-labelledby="affordable-title">
  <div class="wrap">
    <p class="eyebrow">${t('affordable.eyebrow')}</p>
    <h2 id="affordable-title" class="section-title">${t('affordable.title')}</h2>
    <p class="lead">${t('affordable.lead')}</p>
    <ul class="value-points" role="list">
      ${points.map((point, index) => html`<li>
        <span class="num" aria-hidden="true">${formatNumber(index + 1).padStart(2, '0')}</span>
        <h3>${point.title}</h3>
        <p>${point.text}</p>
      </li>`)}
    </ul>
    <p class="affordable-closing">${t('affordable.closing')}</p>
  </div>
</section>`;
}
