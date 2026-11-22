// @ts-check
import { html } from '../../lib/html.js';
import { projects } from '../../data/projects.js';
import { assetHref } from '../helpers.js';

/** @typedef {{ category: string, type: string, title: string, blurb: string, note: string }} ProjectCopy */

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
  <p class="type">${copy.type}</p>
  <h3>${copy.title}</h3>
  <p>${copy.blurb}</p>
  ${copy.note ? html`<p class="note">${copy.note}</p>` : ''}
  <div class="case-actions">
    <a class="btn btn-seed btn-sm" href="${project.url}" target="_blank" rel="noopener">${t('work.visitSite')}<span class="visually-hidden"> (${project.domain}, ${t('work.opensInNewTab')})</span></a>
    <a class="btn btn-ghost btn-sm" href="#contact">${t('work.ctaSimilar')}</a>
  </div>
</div>`;
}

/**
 * One screenshot per project inside a device frame; JS shows the selected one.
 * @param {import('../helpers.js').RenderContext} ctx
 * @param {'desktop' | 'phone'} device
 */
function renderScreenshots(ctx, device) {
  const { t } = ctx.i18n;
  return projects.map((project, index) => {
    const shot = project.screenshots[device];
    return html`<img class="shot" src="${assetHref(ctx, shot.src)}" width="${shot.width}" height="${shot.height}" alt="${t('work.shotAlt', { name: project.name })}" data-shot-for="${project.id}"${index === 0 ? '' : html` hidden loading="lazy"`} decoding="async">`;
  });
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
          <div class="bezel"><div class="vp" data-device-viewport tabindex="0" role="region" aria-label="${t('a11y.desktopPreview')}">${renderScreenshots(ctx, 'desktop')}</div></div>
          <div class="neck"></div><div class="foot"></div>
        </div>
        <div class="phone">
          <div class="notch"></div>
          <div class="vp" data-device-viewport tabindex="0" role="region" aria-label="${t('a11y.phonePreview')}">${renderScreenshots(ctx, 'phone')}</div>
        </div>
        <p class="dev-label" aria-hidden="true">${t('work.phoneLabel')}</p>
      </div>
      <div class="case-panels">
        ${projects.map((project, index) => renderCasePanel(ctx, project, index === 0))}
      </div>
    </div>
  </div>
</section>`;
}
