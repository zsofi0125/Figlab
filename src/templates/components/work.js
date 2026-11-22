// @ts-check
import { html } from '../../lib/html.js';
import { projects } from '../../data/projects.js';
import { draftOnly, placeholderTag } from '../helpers.js';

/** @typedef {{ category: string, type: string, blurb: string, deliverables: string[], resultLabel: string }} ProjectCopy */

/**
 * @param {import('../helpers.js').RenderContext} ctx
 * @param {import('../../data/projects.js').Project} project
 * @param {boolean} isActive
 */
function renderCasePanel(ctx, project, isActive) {
  const { t, tData } = ctx.i18n;
  /** @type {ProjectCopy} */
  const copy = tData(`work.projects.${project.id}`);
  return html`<div class="case${isActive ? ' is-active' : ''}" role="tabpanel" id="case-${project.id}" aria-labelledby="tab-${project.id}" tabindex="0">
  <p class="type">${copy.type}${project.isPlaceholder ? placeholderTag(ctx) : ''}</p>
  <h3>${project.name}</h3>
  <p>${copy.blurb}</p>
  <ul role="list">${copy.deliverables.map((item) => html`<li>${item}</li>`)}</ul>
  <p class="result"><b>${project.result}</b><span>${copy.resultLabel}</span></p>
  <a class="btn btn-ghost btn-sm" href="#contact">${t('work.ctaSimilar')}</a>
</div>`;
}

/** @param {import('../helpers.js').RenderContext} ctx */
export function renderWork(ctx) {
  const { t } = ctx.i18n;
  return html`<section id="work" aria-labelledby="work-title">
  <div class="wrap">
    <div class="work-head">
      <div>
        <p class="eyebrow">${t('work.eyebrow')}</p>
        <h2 id="work-title" class="section-title">${t('work.title')}</h2>
      </div>
      <p class="lead">${t('work.lead')}</p>
    </div>
    <div class="tabs" role="tablist" aria-label="${t('a11y.showcaseTabs')}">
      ${projects.map((project, index) => html`<button class="tab" type="button" role="tab" id="tab-${project.id}" aria-controls="case-${project.id}" aria-selected="${String(index === 0)}" tabindex="${index === 0 ? 0 : -1}" data-project="${project.id}">${project.name}</button>`)}
    </div>
    <div class="showroom">
      <div class="devices">
        <div class="monitor">
          <div class="bezel"><div class="vp" data-render-width="1280" data-device-viewport tabindex="0" role="region" aria-label="${t('a11y.desktopPreview')}"><div class="scaler" aria-hidden="true"><div class="site"></div></div></div></div>
          <div class="neck"></div><div class="foot"></div>
        </div>
        <div class="phone">
          <div class="notch"></div>
          <div class="vp" data-render-width="390" data-device-viewport tabindex="0" role="region" aria-label="${t('a11y.phonePreview')}"><div class="scaler" aria-hidden="true"><div class="site"></div></div></div>
        </div>
        <p class="dev-label" aria-hidden="true">${t('work.phoneLabel')}</p>
      </div>
      <div class="case-panels">
        ${projects.map((project, index) => renderCasePanel(ctx, project, index === 0))}
      </div>
    </div>
    ${draftOnly(ctx, html`<p class="hint">${t('work.placeholderNote')}</p>`)}
  </div>
</section>`;
}
