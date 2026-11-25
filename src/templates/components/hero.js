// @ts-check
import { html } from '../../lib/html.js';
import { projects } from '../../data/projects.js';
import { assetHref, placeholder } from '../helpers.js';

/** @param {import('../helpers.js').RenderContext} ctx */
function renderProjectFan(ctx) {
  const { t } = ctx.i18n;
  return html`<div class="fan">
  ${projects.map((project, index) => html`<a class="card c${index}" href="#work" data-project-link="${project.id}">
    <span class="chrome" aria-hidden="true"><i></i><i></i><i></i><span>${project.domain}</span></span>
    <span class="vp still" aria-hidden="true"><img src="${assetHref(ctx, project.screenshots.desktop.src)}" width="${project.screenshots.desktop.width}" height="${project.screenshots.desktop.height}" alt="" decoding="async"></span>
    <span class="tag">${t(`work.projects.${project.id}.category`)}</span>
    <span class="visually-hidden">${t('a11y.viewProject', { name: project.name })}</span>
  </a>`)}
  <p class="fan-cap">${t('hero.fanCaption')}</p>
</div>`;
}

/** @param {import('../helpers.js').RenderContext} ctx */
export function renderHero(ctx) {
  const { t, tHtml, formatPrice } = ctx.i18n;
  return html`<section class="hero" id="top" aria-labelledby="hero-title">
  <div class="wrap">
    <div>
      <h1 id="hero-title"><span class="hero-kicker">${t('hero.kicker')}</span> <span class="hero-headline">${tHtml('hero.titleHtml')}</span></h1>
      <p class="lead">${t('hero.lead')}</p>
      <div class="ctas">
        <a class="btn btn-primary" href="#free">${t('hero.ctaPrimary')}</a>
        <a class="btn btn-ghost" href="#work">${t('hero.ctaSecondary')}</a>
      </div>
      <ul class="facts" role="list">
        <li><b>${formatPrice(0)}</b>${t('hero.facts.draftLabel')}</li>
        <li><b>${t('hero.facts.replyValue')}</b>${t('hero.facts.replyLabel')}</li>
        <li><b>${t('hero.facts.buildValue')}</b>${t('hero.facts.buildLabel')}</li>
        <li><b>${placeholder(t('hero.facts.launchedValue'))}</b>${t('hero.facts.launchedLabel')}</li>
      </ul>
    </div>
    ${renderProjectFan(ctx)}
  </div>
</section>`;
}
