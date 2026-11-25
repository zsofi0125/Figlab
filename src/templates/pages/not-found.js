// @ts-check
import { html } from '../../lib/html.js';
import { renderDocument } from '../layout.js';

/**
 * Bilingual 404. Served from any URL depth, so every asset path is root-absolute.
 * Always noindex: it is a utility page.
 * @param {import('../helpers.js').RenderContext} ctx          Default-locale context.
 * @param {import('../helpers.js').RenderContext[]} allContexts One context per locale.
 * @param {import('../layout.js').BuiltAssets} assets
 */
export function renderNotFoundPage(ctx, allContexts, assets) {
  const body = html`<main id="main" class="not-found" tabindex="-1">
  <div class="wrap">
    ${allContexts.map((localeCtx, index) => {
      const { t } = localeCtx.i18n;
      const Heading = index === 0 ? 'h1' : 'p';
      return html`<div lang="${localeCtx.locale.htmlLang}" class="not-found-block">
        <${Heading} class="not-found-title">${t('notFound.heading')}</${Heading}>
        <p class="lead">${t('notFound.text')}</p>
        <a class="btn btn-primary" href="${localeCtx.locale.path}">${t('notFound.backHome')}</a>
      </div>`;
    })}
  </div>
</main>`;

  return renderDocument(ctx, {
    assets,
    body,
    resolveAsset: (path) => `/${path}`,
    meta: {
      title: ctx.i18n.t('notFound.title'),
      description: ctx.i18n.t('notFound.text'),
      canonicalPath: '/404.html',
      isIndexable: false,
      hasAlternates: false,
    },
  });
}
