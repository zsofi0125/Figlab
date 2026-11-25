// @ts-check
import { SafeHtml, escapeHtml, raw } from './html.js';

/** @typedef {import('../config/site.js').LocaleConfig} LocaleConfig */
/** @typedef {Record<string, string | number>} Params */
/** @typedef {Record<string, string | number | SafeHtml>} HtmlParams */

/**
 * @param {string} template
 * @param {HtmlParams} params
 * @param {(value: string) => string} [encode]
 */
function interpolate(template, params, encode = (value) => value) {
  return template.replace(/\{(\w+)\}/g, (match, name) => {
    if (!(name in params)) return match;
    const value = params[name];
    return value instanceof SafeHtml ? value.value : encode(String(value));
  });
}

/**
 * Creates the translation and formatting helpers for one locale.
 * A missing key throws, so a build can never ship an untranslated string.
 * @param {Record<string, unknown>} dictionary
 * @param {LocaleConfig} locale
 * @param {string} currency ISO 4217 code
 * @param {Params} [globals] Values every string may use, such as {brand}, so the site name lives in one place.
 */
export function createI18n(dictionary, locale, currency, globals = {}) {
  /** @param {string} key @returns {unknown} */
  const lookup = (key) => {
    /** @type {unknown} */
    let node = dictionary;
    for (const part of key.split('.')) {
      node = node !== null && typeof node === 'object' ? /** @type {Record<string, unknown>} */ (node)[part] : undefined;
    }
    if (node === undefined) throw new Error(`Missing translation "${key}" for locale "${locale.code}".`);
    return node;
  };

  /** @param {string} key @returns {string} */
  const lookupString = (key) => {
    const value = lookup(key);
    if (typeof value !== 'string') throw new Error(`Translation "${key}" (${locale.code}) is not a string.`);
    return value;
  };

  const currencyFormat = new Intl.NumberFormat(locale.intlLocale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  });
  const numberFormat = new Intl.NumberFormat(locale.intlLocale);

  return {
    locale,
    /** Plain text, escaped by the html`` template. @param {string} key @param {Params} [params] */
    t: (key, params = {}) => interpolate(lookupString(key), { ...globals, ...params }),
    /** Trusted inline markup (<b>, <em>) from the dictionary; string params are escaped. @param {string} key @param {HtmlParams} [params] */
    tHtml: (key, params = {}) => raw(interpolate(lookupString(key), { ...globals, ...params }, escapeHtml)),
    /**
     * Structured entries (lists of FAQ items, plan features...). The caller states the shape.
     * @template T
     * @param {string} key
     * @returns {T}
     */
    tData: (key) => /** @type {T} */ (lookup(key)),
    /** @param {string} template @param {Params} params */
    format: (template, params) => interpolate(template, { ...globals, ...params }),
    /** @param {number} amount */
    formatPrice: (amount) => currencyFormat.format(amount),
    /** @param {number} value */
    formatNumber: (value) => numberFormat.format(value),
  };
}

/** @typedef {ReturnType<typeof createI18n>} I18n */

/**
 * Lists every leaf key path, so dictionaries can be compared for parity.
 * @param {unknown} node
 * @param {string} [prefix]
 * @returns {string[]}
 */
export function collectKeyPaths(node, prefix = '') {
  if (node === null || typeof node !== 'object') return [prefix];
  return Object.entries(node).flatMap(([key, child]) => collectKeyPaths(child, prefix ? `${prefix}.${key}` : key));
}
