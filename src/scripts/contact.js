// @ts-check

/** Seed texture behind the contact section. Deterministic, so it looks the same on every visit. */
function initSeedTexture() {
  const canvas = document.querySelector('[data-seed-canvas]');
  if (!(canvas instanceof HTMLCanvasElement)) return;
  const context = canvas.getContext('2d');
  if (!context) return;

  const draw = () => {
    const rect = canvas.getBoundingClientRect();
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = rect.width * pixelRatio;
    canvas.height = rect.height * pixelRatio;
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    let seed = 7;
    const random = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
    for (let i = 0; i < 260; i += 1) {
      context.fillStyle = random() < 0.5 ? '#f1e6cc' : '#3a0a12';
      context.beginPath();
      context.ellipse(random() * rect.width, random() * rect.height, 2 + random() * 3, 1.2 + random() * 1.5, random() * 3, 0, Math.PI * 2);
      context.fill();
    }
  };

  draw();
  window.addEventListener('resize', debounce(draw, 150));
}

/** Copy-to-clipboard for the email address, with a select-the-text fallback. */
function initCopyEmail() {
  const button = document.querySelector('[data-copy-email]');
  const address = document.querySelector('[data-email]');
  if (!(button instanceof HTMLButtonElement) || !address) return;
  const idleLabel = button.textContent ?? '';
  const email = address.textContent?.trim() ?? '';

  /** @param {string} label */
  const flash = (label) => {
    button.textContent = label;
    window.setTimeout(() => { button.textContent = idleLabel; }, 1600);
  };
  const selectAddress = () => {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(address);
    selection?.removeAllRanges();
    selection?.addRange(range);
    flash(button.dataset.labelSelected ?? idleLabel);
  };

  button.addEventListener('click', () => {
    if (!navigator.clipboard) {
      selectAddress();
      return;
    }
    navigator.clipboard.writeText(email).then(() => flash(button.dataset.labelDone ?? idleLabel), selectAddress);
  });
}
