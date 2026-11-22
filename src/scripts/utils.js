// @ts-check
// Shared browser helpers. The build concatenates every file in src/scripts into one
// strict-mode IIFE, so these are module-private, not globals.

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * @template {unknown[]} A
 * @param {(...args: A) => void} callback
 * @param {number} waitMs
 */
function debounce(callback, waitMs) {
  /** @type {number | undefined} */
  let timer;
  return (/** @type {A} */ ...args) => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => callback(...args), waitMs);
  };
}

/** Runs the callback at most once per animation frame. @param {() => void} callback */
function throttleToFrame(callback) {
  let isQueued = false;
  return () => {
    if (isQueued) return;
    isQueued = true;
    window.requestAnimationFrame(() => {
      isQueued = false;
      callback();
    });
  };
}

/** @param {number} value */
const clamp01 = (value) => Math.max(0, Math.min(1, value));

/** @type {Record<string, string>} */
const HTML_ENTITIES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
/** @param {unknown} value */
const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => HTML_ENTITIES[char]);

/** Storage can throw (private mode, blocked cookies); the site must work without it. */
const safeStorage = {
  /** @param {string} key */
  get(key) {
    try { return window.localStorage.getItem(key); } catch { return null; }
  },
  /** @param {string} key @param {string} value */
  set(key, value) {
    try { window.localStorage.setItem(key, value); } catch { /* storage unavailable: preference simply isn't kept */ }
  },
};

/**
 * Isolates features: one failing script must not take the rest of the page down.
 * @param {string} name
 * @param {() => void} init
 */
function runFeature(name, init) {
  try {
    init();
  } catch (error) {
    console.error(`[figlab] ${name} failed to start`, error);
  }
}
