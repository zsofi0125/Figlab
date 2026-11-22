// @ts-check

const LANGUAGE_STORAGE_KEY = 'figlab-lang';

/**
 * Remembers the visitor's language choice. Each language has its own URL (/ and /en/),
 * so search engines index both; this only sends a returning visitor to the version
 * they picked last time. Arriving from another page of this site is never redirected,
 * so a deliberate click on the switch always wins.
 */
function initLanguagePreference() {
  const currentLanguage = document.documentElement.lang;
  const links = /** @type {HTMLAnchorElement[]} */ ([...document.querySelectorAll('a[data-lang-link]')]);

  links.forEach((link) => {
    link.addEventListener('click', () => safeStorage.set(LANGUAGE_STORAGE_KEY, link.dataset.langLink ?? ''));
  });

  const preferred = safeStorage.get(LANGUAGE_STORAGE_KEY);
  if (!preferred || preferred === currentLanguage) return;

  let isInternalNavigation = false;
  try {
    isInternalNavigation = document.referrer !== '' && new URL(document.referrer).origin === window.location.origin;
  } catch {
    isInternalNavigation = false;
  }
  if (isInternalNavigation) return;

  const target = links.find((link) => link.dataset.langLink === preferred);
  if (target) window.location.replace(target.href + window.location.hash);
}
