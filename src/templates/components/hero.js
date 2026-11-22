// @ts-check
import { html } from '../../lib/html.js';
import { heroDroplets } from '../../data/decor.js';
import { projects } from '../../data/projects.js';
import { placeholder } from '../helpers.js';

/** @param {import('../helpers.js').RenderContext} ctx */
function renderProjectFan(ctx) {
  const { t } = ctx.i18n;
  return html`<div class="fan">
  ${projects.map((project, index) => html`<a class="card c${index}" href="#work" data-project-link="${project.id}">
    <span class="chrome" aria-hidden="true"><i></i><i></i><i></i><span>${project.domain}</span></span>
    <span class="vp still" data-render-width="1280" aria-hidden="true"><span class="scaler"><span class="site" data-mock-site="${project.id}"></span></span></span>
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
  ${heroDroplets.map(([left, top, size]) => html`<span class="drop" style="left:${left}%;top:${top}%;width:${size}px;height:${size}px" aria-hidden="true"></span>`)}
  <div class="wrap">
    <div>
      <h1 id="hero-title"><span class="hero-kicker">${t('hero.kicker')}</span> <span class="hero-headline">${tHtml('hero.titleHtml')}</span></h1>
      <p class="lead">${t('hero.lead')}</p>
      <div class="ctas">
        <a class="btn btn-seed" href="#free">${t('hero.ctaPrimary')}</a>
        <a class="btn btn-ghost" href="#work">${t('hero.ctaSecondary')}</a>
      </div>
      <ul class="facts" role="list">
        <li><b>${formatPrice(0)}</b>${t('hero.facts.draftLabel')}</li>
        <li><b>${placeholder(t('hero.facts.launchedValue'))}</b>${t('hero.facts.launchedLabel')}</li>
        <li><b>${t('hero.facts.replyValue')}</b>${t('hero.facts.replyLabel')}</li>
      </ul>
    </div>
    ${renderProjectFan(ctx)}
  </div>
</section>`;
}
