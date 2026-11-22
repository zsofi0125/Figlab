// @ts-check
import { html } from '../../lib/html.js';
import { hosting, monthlyPlans, oneTimePlans } from '../../data/pricing.js';
import { draftOnly, placeholder } from '../helpers.js';
import { icon } from './icons.js';

/** @typedef {{ tier: string, title: string, audience: string, timeline: string, features: string[], cta: string }} PlanCopy */
/** @typedef {{ tier: string, title: string, features: string[] }} MonthlyPlanCopy */

/**
 * @param {import('../helpers.js').RenderContext} ctx
 * @param {import('../../data/pricing.js').OneTimePlan} plan
 */
function renderPlan(ctx, plan) {
  const { t, tData, formatPrice } = ctx.i18n;
  /** @type {PlanCopy} */
  const copy = tData(`pricing.plans.${plan.id}`);
  const suffix = t('pricing.fromSuffix');
  return html`<article class="plan${plan.isFeatured ? ' ripe' : ''}" aria-labelledby="plan-${plan.id}">
  ${plan.isFeatured ? html`<p class="badge">${t('pricing.featuredBadge')}</p>` : ''}
  <p class="tier">${copy.tier}</p>
  <h3 id="plan-${plan.id}">${copy.title}</h3>
  <p class="for">${copy.audience}</p>
  <p class="price"><small>${t('pricing.fromPrefix')}</small><b>${placeholder(formatPrice(plan.priceFrom), plan.isPlaceholder)}</b>${suffix ? html`<small>${suffix}</small>` : ''}</p>
  <p class="time">${copy.timeline}</p>
  <ul role="list">${copy.features.map((feature) => html`<li>${feature}</li>`)}</ul>
  <a class="btn ${plan.isFeatured ? 'btn-seed' : 'btn-ghost'}" href="#contact">${copy.cta}<span class="visually-hidden"> – ${copy.title}</span></a>
</article>`;
}

/** @param {import('../helpers.js').RenderContext} ctx */
function renderMonthlyPlans(ctx) {
  const { t, tData, formatPrice } = ctx.i18n;
  return html`<div class="monthly">
  <div class="monthly-head">
    <h3>${t('pricing.monthly.title')}</h3>
    <p>${t('pricing.monthly.lead')} ${draftOnly(ctx, placeholder(t('pricing.monthly.placeholderNote')))}</p>
  </div>
  <ul class="mplans" role="list">
    ${monthlyPlans.map((plan) => {
      /** @type {MonthlyPlanCopy} */
      const copy = tData(`pricing.monthly.plans.${plan.id}`);
      return html`<li class="mplan">
        <div>
          <p class="tier">${placeholder(copy.tier, plan.isPlaceholder)}</p>
          <h4>${copy.title}</h4>
          <ul>${copy.features.map((feature) => html`<li>${feature}</li>`)}</ul>
        </div>
        <p class="p">${placeholder(formatPrice(plan.pricePerMonth), plan.isPlaceholder)}<small>${t('pricing.monthly.perMonth')}</small></p>
      </li>`;
    })}
  </ul>
</div>`;
}

/** @param {import('../helpers.js').RenderContext} ctx */
export function renderPricing(ctx) {
  const { t, tHtml, formatPrice } = ctx.i18n;
  return html`<section class="pricing" id="pricing" aria-labelledby="pricing-title">
  <div class="wrap">
    <p class="eyebrow">${t('pricing.eyebrow')}</p>
    <h2 id="pricing-title" class="section-title">${t('pricing.title')}</h2>
    <p class="lead">${t('pricing.lead')} ${draftOnly(ctx, placeholder(t('pricing.placeholderNote')))}</p>
    <div class="plans">
      ${oneTimePlans.map((plan) => renderPlan(ctx, plan))}
    </div>
    <div class="free-note">
      ${icon('fig-cut')}
      <p>${tHtml('pricing.freeNoteHtml')}</p>
    </div>
    ${renderMonthlyPlans(ctx)}
    <ul class="fine" role="list">
      <li>${t('pricing.fine.payAfterApproval')}</li>
      <li>${placeholder(t('pricing.fine.paymentSplit'))}</li>
      <li>${tHtml('pricing.fine.hostingHtml', { price: placeholder(formatPrice(hosting.approxPerMonth), hosting.isPlaceholder) })}</li>
    </ul>
  </div>
</section>`;
}
