// @ts-check
import { getPlan } from '../data/pricing.js';

/** @typedef {{ question: string, answer: string }} FaqItem */

/**
 * FAQ entries with prices filled in. Shared by the visible FAQ and the FAQPage JSON-LD,
 * so the structured data always matches what visitors read.
 * @param {import('../lib/i18n.js').I18n} i18n
 * @returns {FaqItem[]}
 */
export function buildFaqItems(i18n) {
  /** @type {FaqItem[]} */
  const items = i18n.tData('faq.items');
  const prices = {
    starterPrice: i18n.formatPrice(getPlan('starter').priceFrom),
    businessPrice: i18n.formatPrice(getPlan('business').priceFrom),
    extrasPrice: i18n.formatPrice(getPlan('extras').priceFrom),
  };
  return items.map((item) => ({
    question: i18n.format(item.question, prices),
    answer: i18n.format(item.answer, prices),
  }));
}
