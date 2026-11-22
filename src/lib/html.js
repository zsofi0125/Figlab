// @ts-check

/** Markup that is trusted and must not be escaped again. */
export class SafeHtml {
  /** @param {string} value */
  constructor(value) {
    this.value = value;
  }
  toString() {
    return this.value;
  }
}

/** @type {Record<string, string>} */
const ENTITIES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

/** @param {unknown} value */
export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ENTITIES[char]);
}

/**
 * Wraps developer-controlled markup (translation strings with <b>/<em>, inline SVG).
 * Never pass user input here.
 * @param {string} markup
 */
export function raw(markup) {
  return new SafeHtml(markup);
}

/** @typedef {SafeHtml | string | number | boolean | null | undefined | Interpolation[]} Interpolation */

/** @param {Interpolation} value @returns {string} */
function serialize(value) {
  if (value === null || value === undefined || value === false || value === true) return '';
  if (Array.isArray(value)) return value.map(serialize).join('');
  if (value instanceof SafeHtml) return value.value;
  return escapeHtml(value);
}

/**
 * Tagged template that escapes every interpolated value unless it is SafeHtml.
 * Arrays are joined, and null/undefined/booleans render as nothing, so `${cond && html`...`}` works.
 * @param {TemplateStringsArray} strings
 * @param {...Interpolation} values
 */
export function html(strings, ...values) {
  let out = strings[0];
  values.forEach((value, index) => {
    out += serialize(value) + strings[index + 1];
  });
  return new SafeHtml(out);
}

/**
 * Serialises data for an inline <script type="application/json|ld+json"> block
 * so that no string can close the script element early.
 * @param {unknown} data
 */
export function jsonForScript(data) {
  return raw(JSON.stringify(data).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026'));
}
