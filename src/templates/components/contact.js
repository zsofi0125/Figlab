// @ts-check
import { html } from '../../lib/html.js';

/** @param {import('../helpers.js').RenderContext} ctx */
export function renderContact(ctx) {
  const { t } = ctx.i18n;
  const email = ctx.config.contactEmail;
  return html`<section class="contact" id="contact" aria-labelledby="contact-title">
  <canvas class="seeds-bg" data-seed-canvas aria-hidden="true"></canvas>
  <div class="wrap">
    <div>
      <h2 id="contact-title">${t('contact.title')}</h2>
      <p>${t('contact.lead')}</p>
    </div>
    <div class="mailbox">
      <p class="mailbox-label" id="mail-label">${t('contact.mailLabel')}</p>
      <p class="mailrow"><a class="mail-address" href="mailto:${email}" data-email>${email}</a></p>
      <div class="actions">
        <a class="btn btn-seed" href="mailto:${email}">${t('contact.writeEmail')}</a>
        <button class="copy" type="button" data-copy-email data-label-done="${t('contact.copied')}" data-label-selected="${t('contact.selected')}">${t('contact.copy')}</button>
      </div>
      <p class="mailbox-note">${t('contact.note')}</p>
    </div>
  </div>
</section>`;
}
