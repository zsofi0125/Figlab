// @ts-check
import { html, jsonForScript } from '../../lib/html.js';
import { projects } from '../../data/projects.js';
import { renderDocument } from '../layout.js';
import { buildHomeStructuredData } from '../seo/structured-data.js';
import { renderDraftBanner, renderSiteHeader } from '../components/header.js';
import { renderHero } from '../components/hero.js';
import { renderAbout } from '../components/about.js';
import { renderWork } from '../components/work.js';
import { renderGuarantee } from '../components/guarantee.js';
import { renderProcess } from '../components/process.js';
import { renderAffordable } from '../components/affordable.js';
import { renderPricing } from '../components/pricing.js';
import { renderFaq } from '../components/faq.js';
import { renderContact } from '../components/contact.js';
import { renderFooter } from '../components/footer.js';

/**
 * @param {import('../helpers.js').RenderContext} ctx
 * @param {import('../layout.js').BuiltAssets} assets
 */
export function renderHomePage(ctx, assets) {
  const { t } = ctx.i18n;
  const mockSites = Object.fromEntries(projects.map((project) => [project.id, project.mock]));

  const body = html`${renderDraftBanner(ctx)}
${renderSiteHeader(ctx)}
<main id="main" tabindex="-1">
${renderHero(ctx)}
${renderAbout(ctx)}
${renderWork(ctx)}
${renderGuarantee(ctx)}
${renderProcess(ctx)}
${renderAffordable(ctx)}
${renderPricing(ctx)}
${renderFaq(ctx)}
${renderContact(ctx)}
</main>
${renderFooter(ctx)}
<script type="application/json" id="mock-sites-data">${jsonForScript(mockSites)}</script>`;

  return renderDocument(ctx, {
    assets,
    body,
    meta: {
      title: t('meta.title'),
      description: t('meta.description'),
      canonicalPath: ctx.locale.path,
      isIndexable: ctx.config.isProduction,
      hasAlternates: true,
      structuredData: buildHomeStructuredData(ctx),
    },
  });
}
