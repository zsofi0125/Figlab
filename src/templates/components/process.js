// @ts-check
import { html } from '../../lib/html.js';
import { plant } from '../../data/decor.js';
import { icon } from './icons.js';

/** @typedef {{ when: string, name: string, what: string, text: string, get: string }} Stage */

/**
 * The growing fig bush. Rendered at build time so it exists without JavaScript;
 * scripts/process.js only animates it. Data attributes hold the scroll thresholds.
 * @param {import('../helpers.js').RenderContext} ctx
 */
function renderPlant(ctx) {
  const fruitAt = 0.95;
  return html`<svg class="plant" viewBox="10 10 220 285" role="img" aria-label="${ctx.i18n.t('a11y.plantLabel')}" data-plant>
  <ellipse cx="120" cy="273" rx="80" ry="9" fill="#2b1d17"/>
  <ellipse cx="120" cy="271" rx="50" ry="5" fill="#3a281e"/>
  ${plant.roots.map((d) => html`<path class="root" pathLength="1" data-grow-from=".05" data-grow-to=".2" d="${d}"/>`)}
  <g class="seedling" data-seedling><path d="M120,256 C126,262 128,268 124,273 C122,276 118,276 116,273 C112,268 114,262 120,256Z" fill="var(--seed)"/><circle cx="117.5" cy="265" r="1.4" fill="#fff" opacity=".6"/></g>
  ${plant.stems.map(([d, width, from, to]) => html`<path class="stem" pathLength="1" stroke-width="${width}" data-grow-from="${from}" data-grow-to="${to}" d="${d}"/>`)}
  ${plant.leaves.map(([x, y, rotation, scale, at]) => html`<g transform="translate(${x} ${y}) rotate(${rotation}) scale(${scale})"><g class="pop" data-appear-at="${at}"><use href="#leaf" class="sway" style="animation-delay:${(-x * 0.05).toFixed(2)}s"/></g></g>`)}
  ${plant.figs.map(([x, y, scale, greenAt, ripeAt]) => html`<g transform="translate(${x} ${y}) scale(${scale})"><g class="pop hang is-unripe" data-appear-at="${greenAt}" data-disappear-at="${ripeAt}"><use href="#fig-green"/></g><g class="pop hang" data-appear-at="${ripeAt}"><use href="#fig-ripe"/></g></g>`)}
  <g transform="translate(190 256) scale(2.6)"><g class="pop" data-appear-at="${fruitAt}"><use href="#fig-cut"/></g></g>
</svg>`;
}

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
    <div class="track" data-process-track>
      <div class="pin">
        <div class="garden">${renderPlant(ctx)}</div>
        <div>
          <ol class="steps" role="list">
            ${stages.map((stage, index) => html`<li><button type="button" data-step="${index}"${index === 0 ? html` aria-current="step"` : ''}>${stage.name}</button></li>`)}
          </ol>
          <div class="panels">
            ${stages.map((stage, index) => html`<article class="st${index === 0 ? ' on' : ''}${index === lastIndex ? ' final' : ''}" data-stage="${index}">
              <p class="when">${t('process.stepOf', { n: index + 1 })} · ${stage.when}</p>
              <h3>${stage.name}</h3>
              <p class="what">${stage.what}</p>
              <p class="text">${stage.text}</p>
              <p class="get">${t('process.youGet')} <b>${stage.get}</b></p>
            </article>`)}
          </div>
          <p class="scroll-hint" data-scroll-hint aria-hidden="true">${t('process.scrollHint')}</p>
        </div>
      </div>
    </div>
    <div class="inside">
      ${icon('fig-cut')}
      <p>${tHtml('process.insideHtml')}</p>
    </div>
  </div>
</section>`;
}
