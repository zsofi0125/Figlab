// @ts-check
import { html, raw } from '../../lib/html.js';

/** Shared SVG symbols, referenced with <use href="#id">. All decorative. */
export function renderIconSprite() {
  return raw(`<svg class="sprite" width="0" height="0" aria-hidden="true" focusable="false">
  <defs>
    <g id="leaf">
      <path fill="var(--leaf)" d="M0,0 C-3,-2 -9,-3 -12,-8 C-9,-9.5 -7,-9.5 -5.5,-11 C-9,-14 -8,-19.5 -4.5,-21 C-2.5,-19 -1.2,-18 0,-24 C1.2,-18 2.5,-19 4.5,-21 C8,-19.5 9,-14 5.5,-11 C7,-9.5 9,-9.5 12,-8 C9,-3 3,-2 0,0 Z"/>
      <path d="M0,0 L0,-20 M0,-9 L-8,-12 M0,-9 L8,-12 M0,-14 L-4,-19 M0,-14 L4,-19" stroke="#3f5427" stroke-width=".8" fill="none"/>
    </g>
    <g id="fig-green">
      <path fill="#8da55a" d="M0,-6 C2,-4 5,-1 5,3 C5,6.5 2.5,8 0,8 C-2.5,8 -5,6.5 -5,3 C-5,-1 -2,-4 0,-6Z"/>
      <rect x="-.8" y="-8.5" width="1.6" height="3" fill="var(--stem)"/>
    </g>
    <g id="fig-ripe">
      <path fill="var(--skin-hi)" d="M0,-7 C2.4,-4.6 6.4,-1.4 6.4,3.6 C6.4,7.8 3.2,9.6 0,9.6 C-3.2,9.6 -6.4,7.8 -6.4,3.6 C-6.4,-1.4 -2.4,-4.6 0,-7Z"/>
      <path fill="#2b1a31" opacity=".5" d="M0,-7 C1,-4 1.5,3 0,9.6 C3.2,9.6 6.4,7.8 6.4,3.6 C6.4,-1.4 2.4,-4.6 0,-7Z"/>
      <circle cx="-2.2" cy="1" r=".9" fill="#fff" opacity=".7"/>
      <rect x="-.8" y="-9.5" width="1.6" height="3" fill="var(--stem)"/>
    </g>
    <g id="fig-cut">
      <path fill="var(--skin-hi)" d="M0,-9 C3,-6 8.5,-2 8.5,4.5 C8.5,10 4.3,12.5 0,12.5 C-4.3,12.5 -8.5,10 -8.5,4.5 C-8.5,-2 -3,-6 0,-9Z"/>
      <path fill="var(--flesh)" d="M0,-7 C2.6,-4.6 7,-1.4 7,4.4 C7,8.8 3.6,11 0,11 C-3.6,11 -7,8.8 -7,4.4 C-7,-1.4 -2.6,-4.6 0,-7Z"/>
      <path fill="var(--seed)" d="M0,-3.5 C2,-1.8 5.2,0.5 5.2,4.6 C5.2,7.8 2.6,9.4 0,9.4 C-2.6,9.4 -5.2,7.8 -5.2,4.6 C-5.2,0.5 -2,-1.8 0,-3.5Z"/>
      <g fill="var(--flesh)" opacity=".85"><circle cx="-2" cy="3" r=".55"/><circle cx="1.6" cy="5" r=".55"/><circle cx="-.6" cy="7" r=".55"/><circle cx="2.4" cy="2" r=".55"/><circle cx="-3" cy="6" r=".55"/><circle cx="0" cy="1" r=".55"/></g>
    </g>
  </defs>
</svg>`);
}

/** @typedef {'leaf' | 'fig-cut' | 'fig-green' | 'fig-ripe'} IconId */

/** @type {Record<IconId, string>} */
const VIEW_BOXES = {
  leaf: '-12 -26 24 28',
  'fig-cut': '-10 -11 20 25',
  'fig-green': '-6 -9 12 18',
  'fig-ripe': '-7 -10 14 20',
};

/** Decorative inline icon. @param {IconId} id @param {string} [className] */
export function icon(id, className = '') {
  return html`<svg class="${className}" viewBox="${VIEW_BOXES[id]}" aria-hidden="true" focusable="false"><use href="#${id}"/></svg>`;
}
