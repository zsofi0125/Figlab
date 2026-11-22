// @ts-check

/**
 * @typedef {object} MockSite
 * @property {Record<string, string>} vars
 * @property {string} logo
 * @property {string[]} links
 * @property {string} headline
 * @property {string} intro
 * @property {string} cta
 * @property {[string, string][]} cards
 * @property {string} quote
 */

/** @param {MockSite} mock */
function mockSiteMarkup(mock) {
  const e = escapeHtml;
  return `
    <div class="m-nav"><span class="m-logo">${e(mock.logo)}</span><span class="m-links">${mock.links.map((link) => `<span>${e(link)}</span>`).join('')}</span><span class="m-btn">${e(mock.cta)}</span><span class="m-burger"></span></div>
    <div class="m-hero"><div><div class="m-title">${e(mock.headline)}</div><p>${e(mock.intro)}</p><span class="m-btn">${e(mock.cta)}</span></div><div class="m-img"></div></div>
    <div class="m-cards">${mock.cards.map(([title, text]) => `<div class="m-card"><i></i><b>${e(title)}</b><span>${e(text)}</span></div>`).join('')}</div>
    <div class="m-quote">${e(mock.quote)}</div>
    <div class="m-foot"><span>© ${e(mock.logo)}</span><span>Made by Figlab</span></div>`;
}

/** @param {HTMLElement} siteEl @param {MockSite} mock */
function paintMockSite(siteEl, mock) {
  siteEl.removeAttribute('style');
  Object.entries(mock.vars).forEach(([name, value]) => siteEl.style.setProperty(name, value));
  siteEl.innerHTML = mockSiteMarkup(mock);
}

/** Scales each mock (rendered at its real width) down to fit its frame. */
function fitViewports() {
  document.querySelectorAll('[data-render-width]').forEach((viewport) => {
    if (!(viewport instanceof HTMLElement)) return;
    const renderWidth = Number(viewport.dataset.renderWidth);
    const site = viewport.querySelector('.site');
    const scaler = viewport.querySelector('.scaler');
    if (!renderWidth || !(site instanceof HTMLElement) || !(scaler instanceof HTMLElement)) return;
    const scale = viewport.clientWidth / renderWidth;
    site.style.width = `${renderWidth}px`;
    site.style.transform = `scale(${scale})`;
    scaler.style.height = `${site.offsetHeight * scale}px`;
  });
}

/** Project tabs (WAI-ARIA tabs pattern) + the mock-site previews. */
function initShowcase() {
  const dataEl = document.getElementById('mock-sites-data');
  if (!dataEl) return;
  /** @type {Record<string, MockSite>} */
  const mocks = JSON.parse(dataEl.textContent || '{}');

  document.querySelectorAll('[data-mock-site]').forEach((siteEl) => {
    if (!(siteEl instanceof HTMLElement)) return;
    const mock = mocks[siteEl.dataset.mockSite ?? ''];
    if (mock) paintMockSite(siteEl, mock);
  });

  const tabs = /** @type {HTMLButtonElement[]} */ ([...document.querySelectorAll('[role="tab"][data-project]')]);
  const deviceSites = /** @type {HTMLElement[]} */ ([...document.querySelectorAll('[data-device-viewport] .site')]);
  const viewports = /** @type {HTMLElement[]} */ ([...document.querySelectorAll('[data-device-viewport]')]);

  /** @param {string} projectId @param {{ focusTab?: boolean }} [options] */
  const selectProject = (projectId, { focusTab = false } = {}) => {
    const mock = mocks[projectId];
    if (!mock) return;
    tabs.forEach((tab) => {
      const isSelected = tab.dataset.project === projectId;
      tab.setAttribute('aria-selected', String(isSelected));
      tab.tabIndex = isSelected ? 0 : -1;
      const panel = document.getElementById(tab.getAttribute('aria-controls') ?? '');
      panel?.classList.toggle('is-active', isSelected);
      if (isSelected && focusTab) tab.focus();
    });
    deviceSites.forEach((siteEl) => paintMockSite(siteEl, mock));
    viewports.forEach((viewport) => { viewport.scrollTop = 0; });
    fitViewports();
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

  // Hero cards are real links to #work; they also pick the matching project.
  document.querySelectorAll('a[data-project-link]').forEach((link) => {
    if (!(link instanceof HTMLElement)) return;
    link.addEventListener('click', () => selectProject(link.dataset.projectLink ?? ''));
  });

  const firstProject = tabs[0]?.dataset.project;
  if (firstProject) selectProject(firstProject);

  window.addEventListener('resize', debounce(fitViewports, 120));
  document.fonts?.ready.then(fitViewports);
}
