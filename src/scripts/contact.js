// @ts-check

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
