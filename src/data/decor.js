// @ts-check
// Purely decorative geometry, kept out of the templates so they stay readable.

/** Hero water droplets: [left %, top %, diameter px]. */
export const heroDroplets = Object.freeze([
  [6, 12, 14], [14, 78, 9], [46, 8, 7], [52, 88, 12], [93, 14, 10], [88, 82, 16], [30, 62, 6], [70, 70, 8],
]);

/**
 * Process illustration: a fig bush that grows while the visitor scrolls.
 * `growFrom`/`growTo` and `appearAt` are scroll-progress values between 0 and 1.
 */
export const plant = Object.freeze({
  /** [path, stroke width, growFrom, growTo] */
  stems: [
    ['M120,270 C120,220 112,160 120,60', 6, 0.16, 0.82],
    ['M119,215 C95,200 75,180 66,145', 4, 0.44, 0.62],
    ['M120,182 C145,167 162,147 170,117', 4, 0.5, 0.68],
    ['M119,130 C105,118 96,102 92,86', 3, 0.6, 0.74],
    ['M120,106 C132,96 140,85 144,74', 2.5, 0.64, 0.78],
  ],
  roots: ['M120,272 q-8,10 -20,15', 'M120,272 q6,12 16,18', 'M120,272 q-1,12 2,22'],
  /** [x, y, rotation, scale, appearAt] */
  leaves: [
    [120, 240, -50, 1.1, 0.27], [120, 234, 50, 1.1, 0.3], [120, 194, -55, 1.4, 0.4], [120, 176, 55, 1.4, 0.44],
    [96, 203, -70, 1.2, 0.56], [66, 147, -25, 1.7, 0.62], [146, 170, 70, 1.2, 0.62], [170, 119, 25, 1.7, 0.68],
    [108, 142, -45, 1.2, 0.68], [132, 126, 45, 1.1, 0.72], [92, 88, -20, 1.4, 0.74], [144, 76, 20, 1.3, 0.78], [120, 62, 0, 1.9, 0.82],
  ],
  /** [x, y, scale, greenAt, ripeAt] */
  figs: [[80, 172, 1.9, 0.66, 0.86], [156, 144, 1.8, 0.7, 0.88], [102, 110, 1.6, 0.74, 0.9], [134, 98, 1.6, 0.77, 0.92]],
});
