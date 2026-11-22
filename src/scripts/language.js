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

  const switcher = document.querySelector('.lang');
  links.forEach((link) => {
    link.addEventListener('click', (event) => {
      const isPlainClick = event.button === 0 && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey;
      if (!isPlainClick || !(switcher instanceof HTMLElement)) return;
      // Clicking the language that is already shown flips to the other one, so the switch always does something.
      const isCurrent = link.getAttribute('aria-current') === 'page';
      const destination = isCurrent ? links.find((other) => other !== link) : link;
      if (!destination) return;
      event.preventDefault();
      safeStorage.set(LANGUAGE_STORAGE_KEY, destination.dataset.langLink ?? '');
      // Slide the pill to the destination first, then follow its link.
      switcher.classList.add('is-switching');
      destination.classList.add('is-target');
      switcher.style.setProperty('--i', String(links.indexOf(destination)));
      window.setTimeout(() => { window.location.href = destination.href; }, prefersReducedMotion() ? 0 : 600);
    });
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
