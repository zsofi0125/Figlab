// @ts-check

/** Grows the fig bush and switches the stage text as the visitor scrolls through the track. */
function initProcess() {
  const track = document.querySelector('[data-process-track]');
  const plant = document.querySelector('[data-plant]');
  if (!(track instanceof HTMLElement) || !plant) return;

  const garden = /** @type {HTMLElement} */ (plant.parentElement);
  const growingPaths = /** @type {SVGPathElement[]} */ ([...plant.querySelectorAll('[data-grow-from]')]);
  const popping = /** @type {SVGGElement[]} */ ([...plant.querySelectorAll('[data-appear-at]')]);
  const seedling = plant.querySelector('[data-seedling]');
  const hint = track.querySelector('[data-scroll-hint]');
  const stepButtons = /** @type {HTMLButtonElement[]} */ ([...track.querySelectorAll('[data-step]')]);
  const panels = /** @type {HTMLElement[]} */ ([...track.querySelectorAll('[data-stage]')]);
  const stageCount = panels.length;
  let currentStage = -1;

  const progress = () => {
    const rect = track.getBoundingClientRect();
    const span = rect.height - window.innerHeight * 0.85;
    return span > 0 ? clamp01((-rect.top + window.innerHeight * 0.15) / span) : 1;
  };

  const render = () => {
    const p = progress();
    growingPaths.forEach((path) => {
      const from = Number(path.dataset.growFrom);
      const to = Number(path.dataset.growTo);
      const grown = clamp01((p - from) / (to - from));
      path.style.strokeDashoffset = String(1 - grown);
      path.style.opacity = grown > 0 ? '1' : '0';
    });
    popping.forEach((el) => {
      el.classList.toggle('on', p >= Number(el.dataset.appearAt));
      if (el.dataset.disappearAt) el.classList.toggle('gone', p >= Number(el.dataset.disappearAt));
    });
    seedling?.classList.toggle('gone', p > 0.3);
    garden.style.setProperty('--p', String(clamp01((p - 0.8) / 0.2)));
    if (hint instanceof HTMLElement) hint.style.opacity = p > 0.9 ? '0' : '1';

    stepButtons.forEach((button, index) => button.style.setProperty('--fill', String(clamp01(p * stageCount - index))));
    const stage = Math.min(stageCount - 1, Math.floor(p * stageCount));
    if (stage === currentStage) return;
    currentStage = stage;
    panels.forEach((panel, index) => {
      panel.classList.toggle('on', index === stage);
      panel.setAttribute('aria-hidden', String(index !== stage));
    });
    stepButtons.forEach((button, index) => {
      if (index === stage) button.setAttribute('aria-current', 'step');
      else button.removeAttribute('aria-current');
    });
  };

  stepButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
      const top = track.getBoundingClientRect().top + window.scrollY;
      const span = track.offsetHeight - window.innerHeight * 0.85;
      window.scrollTo({
        top: top - window.innerHeight * 0.15 + (span * (index + 0.5)) / stageCount,
        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      });
    });
  });

  window.addEventListener('scroll', throttleToFrame(render), { passive: true });
  window.addEventListener('resize', debounce(render, 120));
  render();
}
