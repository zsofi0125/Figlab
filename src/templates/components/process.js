// @ts-check
import { html } from '../../lib/html.js';

/** @typedef {{ when: string, what: string, text: string, get: string }} Stage */

/** @param {import('../helpers.js').RenderContext} ctx */
export function renderProcess(ctx) {
  const { t, tHtml, tData } = ctx.i18n;
  /** @type {Stage[]} */
  const stages = tData('process.stages');
  const lastIndex = stages.length - 1;
  return html`<section class="process" id="process" aria-labelledby="process-title">
  <div class="wrap">
    <p class="eyebrow">${t('process.eyebrow')}</p>
    <h2 id="process-title" class="section-title">${t('process.title')}</h2>
    <p class="lead">${t('process.lead')}</p>
    <ol class="stages" role="list">
      ${stages.map((stage, index) => html`<li class="st${index === lastIndex ? ' final' : ''}">
        <p class="when">${t('process.stepOf', { n: index + 1 })} · ${stage.when}</p>
        <h3>${stage.what}</h3>
        <div class="body">
          <p class="text">${stage.text}</p>
          <p class="get">${t('process.youGet')} <b>${stage.get}</b></p>
        </div>
      </li>`)}
    </ol>
    <p class="inside">${tHtml('process.insideHtml')}</p>
  </div>
</section>`;
}
