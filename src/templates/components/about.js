// @ts-check
import { html } from '../../lib/html.js';
import { assetHref, placeholderTag } from '../helpers.js';
import { icon } from './icons.js';

/** @typedef {{ title: string, text: string }} PromiseItem */

/** @param {import('../helpers.js').RenderContext} ctx */
export function renderAbout(ctx) {
  const { t, tData } = ctx.i18n;
  /** @type {PromiseItem[]} */
  const promises = tData('about.promises');
  return html`<section class="intro" id="about" aria-labelledby="about-title">
  <div class="wrap intro-grid">
    <div class="portrait"><img src="${assetHref(ctx, 'assets/img/zsofi.jpg')}" width="640" height="800" alt="${t('about.photoAlt')}" loading="lazy" decoding="async"></div>
    <div>
      <p class="eyebrow">${t('about.eyebrow')}</p>
      <h2 id="about-title" class="section-title">${t('about.title')}</h2>
      <div class="body">
        <div class="about-ph">
          ${placeholderTag(ctx)}
          <p>${t('about.bioPlaceholder')}</p>
        </div>
        <p>${t('about.body')}</p>
      </div>
      <ul class="promises" role="list">
        ${promises.map((promise) => html`<li>
          ${icon('leaf')}
          <h3>${promise.title}</h3>
          <p>${promise.text}</p>
        </li>`)}
      </ul>
    </div>
  </div>
</section>`;
}
