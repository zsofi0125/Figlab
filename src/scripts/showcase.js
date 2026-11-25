// @ts-check

/** Project tabs (WAI-ARIA tabs pattern): the selected project's screenshots and case text are shown. */
function initShowcase() {
  const tabs = /** @type {HTMLButtonElement[]} */ ([...document.querySelectorAll('[role="tab"][data-project]')]);
  const shots = /** @type {HTMLElement[]} */ ([...document.querySelectorAll('[data-device-viewport] [data-shot-for]')]);
  const viewports = /** @type {HTMLElement[]} */ ([...document.querySelectorAll('[data-device-viewport]')]);
  if (tabs.length === 0) return;

  /** @param {string} projectId @param {{ focusTab?: boolean }} [options] */
  const selectProject = (projectId, { focusTab = false } = {}) => {
    tabs.forEach((tab) => {
      const isSelected = tab.dataset.project === projectId;
      tab.setAttribute('aria-selected', String(isSelected));
      tab.tabIndex = isSelected ? 0 : -1;
      const panel = document.getElementById(tab.getAttribute('aria-controls') ?? '');
      panel?.classList.toggle('is-active', isSelected);
      if (isSelected && focusTab) tab.focus();
    });
    shots.forEach((shot) => {
      shot.hidden = shot.dataset.shotFor !== projectId;
      if (!shot.hidden) shot.loading = 'eager';
    });
    viewports.forEach((viewport) => { viewport.scrollTop = 0; });
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectProject(tab.dataset.project ?? ''));
    tab.addEventListener('keydown', (event) => {
      const lastIndex = tabs.length - 1;
      /** @type {Record<string, number>} */
      const targets = { ArrowRight: index === lastIndex ? 0 : index + 1, ArrowLeft: index === 0 ? lastIndex : index - 1, Home: 0, End: lastIndex };
      if (!(event.key in targets)) return;
      event.preventDefault();
      selectProject(tabs[targets[event.key]].dataset.project ?? '', { focusTab: true });
    });
  });
}
