// @ts-check

/**
 * Prices are numbers in HUF and are formatted per locale with Intl.NumberFormat.
 * The same numbers feed the visible price cards, the FAQ answers and the JSON-LD offers,
 * so changing a price here updates all three.
 *
 * Set `isPlaceholder: false` once a value is final: it removes the dashed staging marker.
 *
 * @typedef {'seedling' | 'ripe' | 'grove'} PlanId
 * @typedef {{ id: PlanId, priceFrom: number, isFeatured: boolean, isPlaceholder: boolean }} OneTimePlan
 * @typedef {'care' | 'carePlus'} MonthlyPlanId
 * @typedef {{ id: MonthlyPlanId, pricePerMonth: number, isPlaceholder: boolean }} MonthlyPlan
 */

/** @type {readonly OneTimePlan[]} */
export const oneTimePlans = Object.freeze([
  { id: 'seedling', priceFrom: 149000, isFeatured: false, isPlaceholder: true },
  { id: 'ripe', priceFrom: 349000, isFeatured: true, isPlaceholder: true },
  { id: 'grove', priceFrom: 549000, isFeatured: false, isPlaceholder: true },
]);

/** @type {readonly MonthlyPlan[]} */
export const monthlyPlans = Object.freeze([
  { id: 'care', pricePerMonth: 9900, isPlaceholder: true },
  { id: 'carePlus', pricePerMonth: 19900, isPlaceholder: true },
]);

export const hosting = Object.freeze({ approxPerMonth: 2500, isPlaceholder: true });

/** @param {PlanId} id */
export function getPlan(id) {
  const plan = oneTimePlans.find((candidate) => candidate.id === id);
  if (!plan) throw new Error(`Unknown plan "${id}".`);
  return plan;
}
