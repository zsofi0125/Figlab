// @ts-check
import { html } from '../../lib/html.js';
import { assetHref, placeholder } from '../helpers.js';

/** @param {import('../helpers.js').RenderContext} ctx */
export function renderHero(ctx) {
  const { t, tHtml, formatPrice } = ctx.i18n;
  return html`<section class="hero" id="top" aria-labelledby="hero-title">
  <div class="hero-media" aria-hidden="true"><div class="hero-videos" data-hero-video data-src-webm="${assetHref(ctx, 'assets/video/hero-dark.webm')}" data-window-webm="0.2 8.3" data-src-mp4="${assetHref(ctx, 'assets/video/hero-dark.mp4')}" data-window-mp4="0 9.95" data-crossfade="1.2">${[0, 1].map(() => html`<video class="hero-video" muted playsinline preload="none" disablepictureinpicture></video>`)}</div></div>
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
  </div>
</section>`;
}
