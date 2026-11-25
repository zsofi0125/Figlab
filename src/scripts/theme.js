// @ts-check

/** Keep in sync with THEME_BOOTSTRAP in src/templates/layout.js, which applies the saved theme before first paint. */
const THEME_STORAGE_KEY = 'site-theme';

/**
 * Light/dark switch. Without a saved choice the site follows the browser setting; a click saves
 * the opposite of what is showing now and sets <html data-theme>, which the tokens in styles/tokens.css read.
 */
function initThemeToggle() {
  const button = document.querySelector('[data-theme-toggle]');
  if (!(button instanceof HTMLButtonElement)) return;
  const root = document.documentElement;
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)');

  const isDark = () => (root.dataset.theme ? root.dataset.theme === 'dark' : systemDark.matches);
  const updateLabel = () => {
    const label = isDark() ? button.dataset.labelToLight : button.dataset.labelToDark;
    if (label) button.setAttribute('aria-label', label);
  };

  button.addEventListener('click', () => {
    const next = isDark() ? 'light' : 'dark';
    root.dataset.theme = next;
    safeStorage.set(THEME_STORAGE_KEY, next);
    updateLabel();
  });
  systemDark.addEventListener('change', updateLabel);
  updateLabel();
}
