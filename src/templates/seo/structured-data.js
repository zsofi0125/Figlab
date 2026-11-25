// @ts-check
import { absoluteUrl } from '../../config/site.js';
import { monthlyPlans, oneTimePlans } from '../../data/pricing.js';
import { buildFaqItems } from '../view-models.js';

/** @typedef {import('../helpers.js').RenderContext} RenderContext */
/** @typedef {{ tier: string, title: string, audience: string }} PlanCopy */
/** @typedef {{ tier: string, title: string }} MonthlyPlanCopy */

/**
 * Schema.org graph for the home page. Every value comes from the same sources as the
 * visible page (dictionaries + data files), so the markup cannot drift from the content.
 * Organization (not LocalBusiness) on purpose: the site publishes no street address.
 * @param {RenderContext} ctx
 */
export function buildHomeStructuredData(ctx) {
  const { config, locale, i18n } = ctx;
  const { t, tData } = i18n;
  const pageUrl = absoluteUrl(locale.path);
  const orgId = `${config.siteUrl}/#organization`;
  const websiteId = `${config.siteUrl}/#website`;
  const areaServed = { '@type': 'Country', name: 'Hungary', identifier: 'HU' };

  const serviceOffers = oneTimePlans.map((plan) => {
    /** @type {PlanCopy} */
    const copy = tData(`pricing.plans.${plan.id}`);
    return {
      '@type': 'Offer',
      name: `${copy.tier}: ${copy.title}`,
      description: copy.audience,
      url: `${pageUrl}#pricing`,
      priceCurrency: config.currency,
      priceSpecification: { '@type': 'PriceSpecification', minPrice: plan.priceFrom, priceCurrency: config.currency },
      itemOffered: { '@type': 'Service', name: copy.title, serviceType: t('hero.kicker'), areaServed },
    };
  });

  const careOffers = monthlyPlans.map((plan) => {
    /** @type {MonthlyPlanCopy} */
    const copy = tData(`pricing.monthly.plans.${plan.id}`);
    return {
      '@type': 'Offer',
      name: `${copy.tier}: ${copy.title}`,
      url: `${pageUrl}#pricing`,
      priceCurrency: config.currency,
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: plan.pricePerMonth,
        priceCurrency: config.currency,
        billingDuration: 'P1M',
        unitText: 'MONTH',
      },
      itemOffered: { '@type': 'Service', name: copy.title, areaServed },
    };
  });

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': orgId,
        name: config.brandName,
        url: absoluteUrl('/'),
        logo: { '@type': 'ImageObject', url: absoluteUrl('/assets/img/logo-512.png'), width: 512, height: 512 },
        image: absoluteUrl(`/${locale.ogImage}`),
        email: config.contactEmail,
        description: t('meta.description'),
        slogan: t('footer.motto'),
        founder: { '@type': 'Person', name: config.founderName },
        areaServed,
        knowsLanguage: config.locales.map((entry) => entry.htmlLang),
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'customer service',
          email: config.contactEmail,
          availableLanguage: ['Hungarian', 'English'],
        },
        makesOffer: [...serviceOffers, ...careOffers],
      },
      {
        '@type': 'WebSite',
        '@id': websiteId,
        url: absoluteUrl('/'),
        name: config.brandName,
        publisher: { '@id': orgId },
        inLanguage: config.locales.map((entry) => entry.hreflang),
      },
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: t('meta.title'),
        description: t('meta.description'),
        inLanguage: locale.hreflang,
        isPartOf: { '@id': websiteId },
        about: { '@id': orgId },
        primaryImageOfPage: absoluteUrl(`/${locale.ogImage}`),
      },
      {
        '@type': 'FAQPage',
        '@id': `${pageUrl}#faq`,
        inLanguage: locale.hreflang,
        isPartOf: { '@id': `${pageUrl}#webpage` },
        mainEntity: buildFaqItems(i18n).map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: { '@type': 'Answer', text: item.answer },
        })),
      },
    ],
  };
}
