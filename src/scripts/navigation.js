// @ts-check

/** Mobile menu disclosure: Esc closes it, choosing a link closes it. */
function initNavigation() {
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.getElementById('nav-links');
  if (!(toggle instanceof HTMLButtonElement) || !menu) return;

  /** @param {boolean} isOpen */
  const setOpen = (isOpen) => {
    toggle.setAttribute('aria-expanded', String(isOpen));
    menu.classList.toggle('is-open', isOpen);
  };

  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  menu.addEventListener('click', (event) => {
    if (event.target instanceof Element && event.target.closest('a')) setOpen(false);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      toggle.focus();
    }
  });
}

/** Staging-only banner. */
function initDraftBanner() {
  const button = document.querySelector('[data-draft-dismiss]');
  const banner = document.getElementById('draft-banner');
  if (!button || !banner) return;
  button.addEventListener('click', () => { banner.hidden = true; });
}
